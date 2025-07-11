import React, { createContext, useContext, useState, useEffect } from "react";

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

  // Load state from localStorage on mount
  useEffect(() => {
    const unlocked = localStorage.getItem("hasUnlockedAnalysis") === "true";
    const completed = localStorage.getItem("hasCompletedQuiz") === "true";
    setHasUnlockedAnalysis(unlocked);
    setHasCompletedQuiz(completed);
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("hasUnlockedAnalysis", hasUnlockedAnalysis.toString());
  }, [hasUnlockedAnalysis]);

  useEffect(() => {
    localStorage.setItem("hasCompletedQuiz", hasCompletedQuiz.toString());
  }, [hasCompletedQuiz]);

  const isUnlocked = () => hasUnlockedAnalysis;

  const canAccessBusinessModel = (modelId?: string) => {
    // Must have completed quiz to access any business model details
    if (!hasCompletedQuiz) return false;

    // If unlocked, can access all models
    if (hasUnlockedAnalysis) return true;

    // If not unlocked, no access to detailed pages
    return false;
  };

  const canAccessFullReport = () => {
    return hasCompletedQuiz && hasUnlockedAnalysis;
  };

  const hasMadeAnyPayment = () => {
    // Check for any payment-related flags in localStorage
    const hasUnlocked = localStorage.getItem("hasUnlockedAnalysis") === "true";
    const hasBusinessAccess = localStorage.getItem("hasBusinessAccess") === "true";
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
