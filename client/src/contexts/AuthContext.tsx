import React, { createContext, useContext, useState, useEffect } from "react";
import { QuizData } from "../types";

interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  hasAccessPass: boolean;
  quizRetakesRemaining: number;
  isTemporary?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    quizData?: any,
  ) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  getLatestQuizData: () => Promise<QuizData | null>;
  hasValidSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkExistingSession = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!isMounted) return; // Component unmounted, don't update state

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else if (response.status === 401) {
          // Not authenticated - this is expected, not an error
          setUser(null);
        } else {
          console.warn(`Session check returned ${response.status}`);
        }
      } catch (error) {
        if (!isMounted) return; // Component unmounted, don't update state
        console.error("Error checking session:", error);
        // Don't throw the error, just log it and continue
        setUser(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Check for existing session on mount
    checkExistingSession();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates after unmount
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = "Login failed";
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use the response status text or default message
          errorMessage = response.statusText || errorMessage;
        }
        const error = new Error(errorMessage) as any;
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    quizData?: any,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, name, quizData }),
      });

      if (!response.ok) {
        let errorMessage = "Signup failed";
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
          console.log("AuthContext signup error response:", {
            status: response.status,
            data,
            errorMessage,
          }); // Debug log
        } catch (parseError) {
          // If JSON parsing fails, use the response status text or default message
          errorMessage = response.statusText || errorMessage;
          console.log("AuthContext signup error (JSON parse failed):", {
            status: response.status,
            errorMessage,
            parseError,
          }); // Debug log
        }

        // Ensure the exact error message is preserved for frontend handling
        const error = new Error(errorMessage) as any;
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const deleteAccount = async (): Promise<void> => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      const response = await fetch("/api/auth/account", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Account deletion failed";
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Clear user state after successful deletion
      setUser(null);
    } catch (error) {
      // Handle network errors gracefully (common during page unload)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.debug("Account deletion skipped due to network unavailability");
        // Still clear local state since temporary accounts expire automatically
        setUser(null);
        return;
      }
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        let errorMessage = "Profile update failed";
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use the response status text or default message
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getLatestQuizData = async (): Promise<QuizData | null> => {
    if (!user) {
      console.log("getLatestQuizData: No user available");
      return null;
    }

    try {
      const url = "/api/auth/latest-quiz-data";
      console.log("getLatestQuizData: Making request to:", url);
      console.log("getLatestQuizData: Current user:", {
        id: user.id,
        email: user.email,
      });

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("getLatestQuizData: Response status:", response.status);
      console.log(
        "getLatestQuizData: Response headers:",
        Object.fromEntries(response.headers.entries()),
      );

      if (response.ok) {
        const quizData = await response.json();
        console.log(
          "getLatestQuizData: Success, quiz data:",
          quizData ? "Found" : "None",
        );
        return quizData;
      } else {
        // For error responses, safely read the body once
        let errorMessage = `HTTP ${response.status} ${response.statusText}`;
        try {
          const responseText = await response.text();
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            // If not JSON, use the text as is
            errorMessage = responseText || errorMessage;
          }
        } catch {
          // If can't read body, use status text
        }
        console.error("getLatestQuizData: Request failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
        });
      }
    } catch (error) {
      console.error("getLatestQuizData: Network error:", error);
    }

    return null;
  };

  const hasValidSession = (): boolean => {
    return !!user;
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    deleteAccount,
    updateProfile,
    getLatestQuizData,
    hasValidSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
