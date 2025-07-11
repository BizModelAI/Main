import {
  users,
  quizAttempts,
  payments,
  unpaidUserEmails,
  type User,
  type InsertUser,
  type QuizAttempt,
  type InsertQuizAttempt,
  type Payment,
  type InsertPayment,
  type UnpaidUserEmail,
  type InsertUnpaidUserEmail,
} from "@shared/schema";
import { db } from "./db.js";
import { eq, desc, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  // Quiz retake operations
  recordQuizAttempt(attempt: Omit<InsertQuizAttempt, 'id'>): Promise<QuizAttempt>;
  getQuizAttemptsCount(userId: number): Promise<number>;
  getQuizAttempts(userId: number): Promise<QuizAttempt[]>;
  canUserRetakeQuiz(userId: number): Promise<boolean>;
  decrementQuizRetakes(userId: number): Promise<void>;
  
  // Payment operations
  createPayment(payment: Omit<InsertPayment, 'id'>): Promise<Payment>;
  completePayment(paymentId: number, retakesGranted: number): Promise<void>;
  getPaymentsByUser(userId: number): Promise<Payment[]>;
  
  // Unpaid user email tracking
  storeUnpaidUserEmail(sessionId: string, email: string, quizData: any): Promise<UnpaidUserEmail>;
  getUnpaidUserEmail(sessionId: string): Promise<UnpaidUserEmail | undefined>;
  cleanupExpiredUnpaidEmails(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quizAttempts: Map<number, QuizAttempt>;
  private payments: Map<number, Payment>;
  private unpaidUserEmails: Map<string, UnpaidUserEmail>;
  currentId: number;
  currentQuizAttemptId: number;
  currentPaymentId: number;
  currentUnpaidEmailId: number;

  constructor() {
    this.users = new Map();
    this.quizAttempts = new Map();
    this.payments = new Map();
    this.unpaidUserEmails = new Map();
    this.currentId = 1;
    this.currentQuizAttemptId = 1;
    this.currentPaymentId = 1;
    this.currentUnpaidEmailId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      hasAccessPass: false,
      quizRetakesRemaining: 0,
      totalQuizRetakesUsed: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async recordQuizAttempt(attempt: Omit<InsertQuizAttempt, 'id'>): Promise<QuizAttempt> {
    const id = this.currentQuizAttemptId++;
    const quizAttempt: QuizAttempt = {
      ...attempt,
      id,
      completedAt: new Date(),
    };
    this.quizAttempts.set(id, quizAttempt);
    return quizAttempt;
  }

  async getQuizAttemptsCount(userId: number): Promise<number> {
    return Array.from(this.quizAttempts.values()).filter(
      attempt => attempt.userId === userId
    ).length;
  }

  async getQuizAttempts(userId: number): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values())
      .filter(attempt => attempt.userId === userId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime()); // Most recent first
  }

  async canUserRetakeQuiz(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) return false;
    
    const attemptCount = await this.getQuizAttemptsCount(userId);
    
    // First quiz is free
    if (attemptCount === 0) return true;
    
    // After first quiz, user needs access pass and remaining retakes
    return user.hasAccessPass && user.quizRetakesRemaining > 0;
  }

  async decrementQuizRetakes(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;
    
    const attemptCount = await this.getQuizAttemptsCount(userId);
    
    // Don't decrement for first quiz (it's free)
    if (attemptCount === 0) return;
    
    await this.updateUser(userId, {
      quizRetakesRemaining: Math.max(0, user.quizRetakesRemaining - 1),
      totalQuizRetakesUsed: user.totalQuizRetakesUsed + 1,
    });
  }

  async createPayment(payment: Omit<InsertPayment, 'id'>): Promise<Payment> {
    const id = this.currentPaymentId++;
    const newPayment: Payment = {
      ...payment,
      id,
      status: payment.status || "pending",
      currency: payment.currency || "usd",
      retakesGranted: payment.retakesGranted || 0,
      stripePaymentIntentId: payment.stripePaymentIntentId || null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async completePayment(paymentId: number, retakesGranted: number): Promise<void> {
    const payment = this.payments.get(paymentId);
    if (!payment) return;

    // Update payment status
    const completedPayment = {
      ...payment,
      status: "completed" as const,
      retakesGranted,
      completedAt: new Date(),
    };
    this.payments.set(paymentId, completedPayment);

    // Update user's retakes and access pass
    const user = await this.getUser(payment.userId);
    if (user) {
      const updates: Partial<User> = {
        quizRetakesRemaining: user.quizRetakesRemaining + retakesGranted,
      };
      
      if (payment.type === "access_pass") {
        updates.hasAccessPass = true;
        updates.quizRetakesRemaining = 5; // Initial 5 retakes with access pass
      }
      
      await this.updateUser(payment.userId, updates);
    }
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async storeUnpaidUserEmail(sessionId: string, email: string, quizData: any): Promise<UnpaidUserEmail> {
    const id = this.currentUnpaidEmailId++;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    const unpaidUserEmail: UnpaidUserEmail = {
      id,
      sessionId,
      email,
      quizData,
      createdAt: new Date(),
      expiresAt,
    };
    
    this.unpaidUserEmails.set(sessionId, unpaidUserEmail);
    return unpaidUserEmail;
  }

  async getUnpaidUserEmail(sessionId: string): Promise<UnpaidUserEmail | undefined> {
    const email = this.unpaidUserEmails.get(sessionId);
    if (!email) return undefined;
    
    // Check if expired
    if (email.expiresAt < new Date()) {
      this.unpaidUserEmails.delete(sessionId);
      return undefined;
    }
    
    return email;
  }

  async cleanupExpiredUnpaidEmails(): Promise<void> {
    const now = new Date();
    for (const [sessionId, email] of this.unpaidUserEmails.entries()) {
      if (email.expiresAt < now) {
        this.unpaidUserEmails.delete(sessionId);
      }
    }
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async recordQuizAttempt(attempt: Omit<InsertQuizAttempt, 'id'>): Promise<QuizAttempt> {
    const [quizAttempt] = await db
      .insert(quizAttempts)
      .values(attempt)
      .returning();
    return quizAttempt;
  }

  async getQuizAttemptsCount(userId: number): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, userId));
    return result[0].count;
  }

  async getQuizAttempts(userId: number): Promise<QuizAttempt[]> {
    return await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, userId))
      .orderBy(desc(quizAttempts.completedAt));
  }

  async canUserRetakeQuiz(userId: number): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user ? user.quizRetakesRemaining > 0 : false;
  }

  async decrementQuizRetakes(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        quizRetakesRemaining: sql`${users.quizRetakesRemaining} - 1`,
        totalQuizRetakesUsed: sql`${users.totalQuizRetakesUsed} + 1`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async createPayment(payment: Omit<InsertPayment, 'id'>): Promise<Payment> {
    const [newPayment] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return newPayment;
  }

  async completePayment(paymentId: number, retakesGranted: number): Promise<void> {
    await db.transaction(async (tx) => {
      // Update payment status
      const [payment] = await tx
        .update(payments)
        .set({ 
          status: "completed",
          completedAt: new Date(),
          retakesGranted
        })
        .where(eq(payments.id, paymentId))
        .returning();

      if (!payment) {
        throw new Error("Payment not found");
      }

      // Update user's retakes
      await tx
        .update(users)
        .set({ 
          quizRetakesRemaining: sql`${users.quizRetakesRemaining} + ${retakesGranted}`,
          updatedAt: new Date()
        })
        .where(eq(users.id, payment.userId));
    });
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  async storeUnpaidUserEmail(sessionId: string, email: string, quizData: any): Promise<UnpaidUserEmail> {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    // Delete any existing record for this session
    await db.delete(unpaidUserEmails).where(eq(unpaidUserEmails.sessionId, sessionId));
    
    const [newUnpaidUserEmail] = await db
      .insert(unpaidUserEmails)
      .values({
        sessionId,
        email,
        quizData,
        expiresAt,
      })
      .returning();
    
    return newUnpaidUserEmail;
  }

  async getUnpaidUserEmail(sessionId: string): Promise<UnpaidUserEmail | undefined> {
    const [email] = await db
      .select()
      .from(unpaidUserEmails)
      .where(eq(unpaidUserEmails.sessionId, sessionId));
    
    if (!email) return undefined;
    
    // Check if expired
    if (email.expiresAt < new Date()) {
      await db.delete(unpaidUserEmails).where(eq(unpaidUserEmails.sessionId, sessionId));
      return undefined;
    }
    
    return email;
  }

  async cleanupExpiredUnpaidEmails(): Promise<void> {
    await db.delete(unpaidUserEmails).where(sql`${unpaidUserEmails.expiresAt} < ${new Date()}`);
  }
}

export const storage = new DatabaseStorage();
