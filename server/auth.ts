import type { Express } from "express";
import { storage } from "./storage.js";
import bcrypt from "bcrypt";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export function setupAuthRoutes(app: Express) {
  // Get current user session
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.userId = undefined;
        return res.status(401).json({ error: "User not found" });
      }

      // Don't send password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error in /api/auth/me:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      // Find user by email (using username field for now)
      const user = await storage.getUserByUsername(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;

      // Don't send password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error in /api/auth/login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Signup - Store temporary account data until payment
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res
          .status(400)
          .json({ error: "Email, password, and name are required" });
      }

      // Basic email validation
      if (!email.includes("@") || email.length < 5) {
        return res
          .status(400)
          .json({ error: "Please enter a valid email address" });
      }

      // Password validation
      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      // Check if user already exists as a paid user
      const existingUser = await storage.getUserByUsername(email);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      // Store temporary account data (no real account created yet)
      // We'll create the actual account only after successful payment
      const sessionId =
        req.sessionID ||
        `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;

      // Get quiz data from request or localStorage indication
      const quizData = req.body.quizData || {};

      await storage.storeUnpaidUserEmail(sessionId, email, {
        email,
        password: await bcrypt.hash(password, 10),
        name,
        quizData,
      });

      // Return a temporary user object for frontend
      res.json({
        id: `temp_${sessionId}`,
        username: email,
        email: email,
        hasAccessPass: false,
        quizRetakesRemaining: 0,
        isTemporary: true,
      });
    } catch (error) {
      console.error("Error in /api/auth/signup:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Logout
  app.post("/api/auth/logout", async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ error: "Could not log out" });
        }
        res.clearCookie("connect.sid");
        res.json({ success: true });
      });
    } catch (error) {
      console.error("Error in /api/auth/logout:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update profile
  app.put("/api/auth/profile", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const updates = req.body;
      const user = await storage.updateUser(req.session.userId, updates);

      // Don't send password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error in /api/auth/profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete account
  app.delete("/api/auth/account", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const userId = req.session.userId;

      // Delete all user data from database
      await storage.deleteUser(userId);

      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res
            .status(500)
            .json({ error: "Could not complete account deletion" });
        }
        res.clearCookie("connect.sid");
        res.json({ success: true, message: "Account deleted successfully" });
      });
    } catch (error) {
      console.error("Error in /api/auth/account:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
