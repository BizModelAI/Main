import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
  Loader,
  User,
  Mail,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { usePaywall } from "../contexts/PaywallContext";
import { StripePaymentWrapper } from "./StripePaymentForm";

interface PaymentAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: "business-model" | "learn-more" | "full-report";
  title?: string;
}

export const PaymentAccountModal: React.FC<PaymentAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  type,
  title,
}) => {
  const [step, setStep] = useState<"account" | "login" | "payment">("account");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");

  // Account form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, login, user } = useAuth();
  const { setHasUnlockedAnalysis } = usePaywall();

  // Prevent closing modal after login but before payment to avoid paywall bypass
  const canCloseModal = () => {
    // If user is logged in and we're showing login or payment step,
    // they must complete payment - prevent closing
    if (user && (step === "login" || step === "payment")) {
      return false;
    }
    return true;
  };

  const handleClose = () => {
    if (canCloseModal()) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case "business-model":
        return {
          title: "Unlock Your Full Business Blueprint",
          subtitle:
            "Create your account and unlock personalized insights for $9.99",
        };
      case "learn-more":
        return {
          title: "Unlock Your Full Business Blueprint",
          subtitle: title
            ? `Create your account to access detailed insights about ${title}`
            : "Create your account and unlock personalized business insights",
        };
      case "full-report":
        return {
          title: "Unlock Your Full Business Blueprint",
          subtitle:
            "Create your account and get your complete AI-powered success report",
        };
      default:
        return {
          title: "Unlock Your Full Business Blueprint",
          subtitle: "Create your account and unlock all features",
        };
    }
  };

  const content = getContent();

  const validateAccountForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      );
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    return true;
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateAccountForm()) return;

    setIsProcessing(true);
    try {
      // Include quiz data in signup for temporary account storage
      const quizData = localStorage.getItem("quizData");
      const parsedQuizData = quizData ? JSON.parse(quizData) : {};

      await signup(
        formData.email,
        formData.password,
        formData.name,
        parsedQuizData,
      );
      setStep("payment");
    } catch (err: any) {
      if (err.message === "User already exists") {
        setLoginEmail(formData.email);
        setStep("login");
        setError(
          "An account with this email already exists. Please log in to continue with your purchase.",
        );
      } else {
        setError(err.message || "Failed to create account");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginEmail || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setIsProcessing(true);
    try {
      await login(loginEmail, formData.password);

      // Critical security fix: When logging in through payment modal,
      // users must complete payment regardless of their existing access status.
      // This prevents bypassing the paywall by entering existing credentials.
      setStep("payment");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setHasUnlockedAnalysis(true);
    localStorage.setItem("hasAnyPayment", "true");

    // Save quiz data from localStorage to user's account
    const savedQuizData = localStorage.getItem("quizData");
    if (savedQuizData) {
      try {
        const quizData = JSON.parse(savedQuizData);
        await fetch("/api/auth/save-quiz-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ quizData }),
        });
        console.log("Quiz data saved to user account");
      } catch (error) {
        console.error("Error saving quiz data:", error);
      }
    }

    onSuccess();
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleDevBypass = async () => {
    setIsProcessing(true);
    try {
      // If user isn't logged in, create a dev account
      if (!user) {
        const devEmail = `dev_${Date.now()}@test.com`;
        await signup(devEmail, "devpass123", "Dev User");
      }

      // Mark as unlocked
      setHasUnlockedAnalysis(true);
      localStorage.setItem("hasAnyPayment", "true");
      localStorage.setItem("devBypass", "true");

      // Save quiz data from localStorage to user's account
      const savedQuizData = localStorage.getItem("quizData");
      if (savedQuizData) {
        try {
          const quizData = JSON.parse(savedQuizData);
          await fetch("/api/auth/save-quiz-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ quizData }),
          });
          console.log("Quiz data saved to dev user account");
        } catch (error) {
          console.error("Error saving quiz data:", error);
        }
      }

      setIsProcessing(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Dev bypass failed");
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden max-h-[90vh] overflow-y-auto my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50"></div>

          <div className="relative p-6">
            {/* Close button */}
            <button
              onClick={handleClose}
              className={`absolute top-4 right-4 transition-colors ${
                canCloseModal()
                  ? "text-gray-400 hover:text-gray-600 cursor-pointer"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Close modal"
              disabled={!canCloseModal()}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Lock Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </motion.div>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {content.title}
              </h2>
              <p className="text-gray-600 text-sm">{content.subtitle}</p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-6">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === "account" || step === "login"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {step === "account" || step === "login" ? (
                  "1"
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </div>
              <div
                className={`w-12 h-1 mx-2 rounded-full ${step === "payment" ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-300"}`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === "payment"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                2
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Account Creation Form */}
            {step === "account" && (
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account & Continue"
                  )}
                </button>

                {/* Dev Bypass Button */}
                {import.meta.env.MODE === "development" && (
                  <button
                    type="button"
                    onClick={handleDevBypass}
                    disabled={isProcessing}
                    className="w-full bg-gray-600 text-white py-2 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    🔧 DEV: Bypass Payment (Remove in Prod)
                  </button>
                )}
              </form>
            )}

            {/* Login Form */}
            {step === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    An account with this email already exists. Please log in to
                    continue with your purchase.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                      placeholder="Enter your email"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Logging In...
                    </>
                  ) : (
                    "Log In & Continue"
                  )}
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("account");
                      setError("");
                      setLoginEmail("");
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Back to Sign Up
                  </button>
                </div>
              </form>
            )}

            {/* Payment Form */}
            {step === "payment" && (
              <div className="space-y-4">
                <StripePaymentWrapper
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("account")}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                </div>

                {/* Dev Bypass Button for payment step too */}
                {import.meta.env.MODE === "development" && (
                  <button
                    type="button"
                    onClick={handleDevBypass}
                    disabled={isProcessing}
                    className="w-full bg-gray-600 text-white py-2 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    🔧 DEV: Bypass Payment (Remove in Prod)
                  </button>
                )}
              </div>
            )}

            {/* Security note */}
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                🔒 Secure payment • 30-day guarantee • Cancel anytime
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
