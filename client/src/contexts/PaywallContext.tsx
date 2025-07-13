import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface PaywallContextType {
  hasUnlockedAnalysis: boolean;
  hasCompletedQuiz: boolean;
  setHasUnlockedAnalysis: (unlocked: boolean) => void;
  setHasCompletedQuiz: (completed: boolean) => void;
  isUnlocked: () => boolean;
  canAccessBusinessModel: (modelId?: string) => boolean;
  canAccessFullReport: () => boolean;
  hasMadeAnyPayment: () => boolean;
}

const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

export const usePaywall = () => {
  const context = useContext(PaywallContext);
  if (!context) {
    throw new Error("usePaywall must be used within a PaywallProvider");
  }
  return context;
};

interface PaywallProviderProps {
  children: React.ReactNode;
}

export const PaywallProvider: React.FC<PaywallProviderProps> = ({
  children,
}) => {
  const [hasUnlockedAnalysis, setHasUnlockedAnalysis] = useState(false);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const { user, getLatestQuizData, isLoading } = useAuth();

  // Check user's quiz completion and payment status when user changes
  useEffect(() => {
    let isMounted = true;

    const checkUserStatus = async () => {
      if (!isMounted || isLoading) return;

      if (!user) {
        // For non-authenticated users, check localStorage for temporary state
        const unlocked = localStorage.getItem("hasUnlockedAnalysis") === "true";
        const completed = localStorage.getItem("hasCompletedQuiz") === "true";
        if (isMounted) {
          setHasUnlockedAnalysis(unlocked);
          setHasCompletedQuiz(completed);
        }
        return;
      }

      // For authenticated users, check their database records
      try {
        // Check if user has completed quiz
        const quizData = await getLatestQuizData();

        if (!isMounted) return; // Component unmounted, don't update state

        const hasQuiz = !!quizData;
        setHasCompletedQuiz(hasQuiz);

        // Check if user has access pass (payment)
        const hasAccess = user.hasAccessPass;
        setHasUnlockedAnalysis(hasAccess);

        // Update localStorage for consistency
        localStorage.setItem("hasCompletedQuiz", hasQuiz.toString());
        localStorage.setItem("hasUnlockedAnalysis", hasAccess.toString());
      } catch (error) {
        if (isMounted) {
          console.error("Error checking user status:", error);
        }
      }
    };

    checkUserStatus();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates after unmount
    };
  }, [user, isLoading, getLatestQuizData]);

  // Save state to localStorage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!user) {
      localStorage.setItem(
        "hasUnlockedAnalysis",
        hasUnlockedAnalysis.toString(),
      );
    }
  }, [hasUnlockedAnalysis, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("hasCompletedQuiz", hasCompletedQuiz.toString());
    }
  }, [hasCompletedQuiz, user]);

  const isUnlocked = () => {
    // For logged-in users with access pass, consider them unlocked even if local state is stale
    if (user && user.hasAccessPass) return true;

    return hasUnlockedAnalysis;
  };

  const canAccessBusinessModel = (modelId?: string) => {
    // Must have completed quiz to access any business model details
    if (!hasCompletedQuiz) return false;

    // If unlocked, can access all models
    if (hasUnlockedAnalysis) return true;

    // For logged-in users with access pass, grant access even if local state is stale
    if (user && user.hasAccessPass) return true;

    // If not unlocked, no access to detailed pages
    return false;
  };

  const canAccessFullReport = () => {
    // For logged-in users with access pass, grant access even if local state is stale
    if (user && user.hasAccessPass && hasCompletedQuiz) return true;

    return hasCompletedQuiz && hasUnlockedAnalysis;
  };

  const hasMadeAnyPayment = () => {
    // For authenticated users, strictly check hasAccessPass only
    if (user) {
      return user.hasAccessPass;
    }

    // For non-authenticated users, check localStorage flags
    const hasUnlocked = localStorage.getItem("hasUnlockedAnalysis") === "true";
    const hasBusinessAccess =
      localStorage.getItem("hasBusinessAccess") === "true";
    const hasPaidDownload = localStorage.getItem("hasPaidDownload") === "true";
    const hasAnyPayment = localStorage.getItem("hasAnyPayment") === "true";

    return hasUnlocked || hasBusinessAccess || hasPaidDownload || hasAnyPayment;
  };

  return (
    <PaywallContext.Provider
      value={{
        hasUnlockedAnalysis,
        hasCompletedQuiz,
        setHasUnlockedAnalysis,
        setHasCompletedQuiz,
        isUnlocked,
        canAccessBusinessModel,
        canAccessFullReport,
        hasMadeAnyPayment,
      }}
    >
      {children}
    </PaywallContext.Provider>
  );
};
