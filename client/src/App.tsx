import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PaywallProvider } from "./contexts/PaywallContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import BusinessExplorer from "./pages/BusinessExplorer";

import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import EmailCapture from "./components/EmailCapture";
import BusinessModelDetail from "./components/BusinessModelDetail";
import BusinessGuide from "./components/BusinessGuide";
import DownloadReportPage from "./pages/DownloadReportPage";
import PDFReportPage from "./pages/PDFReportPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import UnsubscribePage from "./pages/UnsubscribePage";
import AIReportLoading from "./components/AIReportLoading";
import QuizCompletionLoading from "./components/QuizCompletionLoading";

// Alias for loading page component
const LoadingPage = AIReportLoading;
import { QuizData } from "./types";

function App() {
  const [quizData, setQuizData] = React.useState<QuizData | null>(null);
  const [showEmailCapture, setShowEmailCapture] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [showAILoading, setShowAILoading] = React.useState(false);
  const [loadedReportData, setLoadedReportData] = React.useState<any>(null);
  const [showCongratulations, setShowCongratulations] = React.useState(false);

  // Restore data from localStorage on app start
  React.useEffect(() => {
    const savedQuizData = localStorage.getItem("quizData");
    const savedUserEmail = localStorage.getItem("userEmail");
    const savedLoadedReportData = localStorage.getItem("loadedReportData");

    if (savedQuizData) {
      try {
        setQuizData(JSON.parse(savedQuizData));
      } catch (error) {
        console.error("Error parsing saved quiz data:", error);
      }
    }

    if (savedUserEmail) {
      setUserEmail(savedUserEmail);
    }

    if (savedLoadedReportData) {
      try {
        setLoadedReportData(JSON.parse(savedLoadedReportData));
      } catch (error) {
        console.error("Error parsing saved loaded report data:", error);
      }
    }
  }, []);

  // Handler for AI loading completion
  const handleAILoadingComplete = (data: any) => {
    console.log("AI loading complete, showing congratulations");
    setLoadedReportData(data);
    setShowAILoading(false);
    setShowCongratulations(true);
  };

  // TEMPORARY: Mock quiz data for testing with COMPLETE data structure
  const generateMockQuizData = (): QuizData => {
    return {
      // Round 1: Motivation & Vision
      mainMotivation: "financial-freedom",
      firstIncomeTimeline: "3-6-months",
      successIncomeGoal: 5000,
      upfrontInvestment: 1000,
      passionIdentityAlignment: 4,
      businessExitPlan: "not-sure",
      businessGrowthSize: "full-time-income",
      passiveIncomeImportance: 3,

      // Round 2: Time, Effort & Learning Style
      weeklyTimeCommitment: 20,
      longTermConsistency: 4,
      trialErrorComfort: 3,
      learningPreference: "hands-on",
      systemsRoutinesEnjoyment: 3,
      discouragementResilience: 4,
      toolLearningWillingness: "yes",
      organizationLevel: 3,
      selfMotivationLevel: 4,
      uncertaintyHandling: 3,
      repetitiveTasksFeeling: "tolerate",
      workCollaborationPreference: "mostly-solo",

      // Round 3: Personality & Preferences
      brandFaceComfort: 3,
      competitivenessLevel: 3,
      creativeWorkEnjoyment: 4,
      directCommunicationEnjoyment: 4,
      workStructurePreference: "some-structure",

      // Round 4: Tools & Work Environment
      techSkillsRating: 3,
      workspaceAvailability: "yes",
      supportSystemStrength: "small-helpful-group",
      internetDeviceReliability: 4,
      familiarTools: ["google-docs-sheets", "canva"],

      // Round 5: Strategy & Decision-Making
      decisionMakingStyle: "after-some-research",
      riskComfortLevel: 3,
      feedbackRejectionResponse: 3,
      pathPreference: "mix",
      controlImportance: 4,

      // Round 6: Business Model Fit Filters
      onlinePresenceComfort: "yes",
      clientCallsComfort: "yes",
      physicalShippingOpenness: "no",
      workStylePreference: "mix-both",
      socialMediaInterest: 3,
      ecosystemParticipation: "yes",
      existingAudience: "no",
      promotingOthersOpenness: "yes",
      teachVsSolvePreference: "both",
      meaningfulContributionImportance: 4,

      // Legacy fields for backward compatibility (mapped from new fields)
      primaryMotivation: "financial-independence",
      incomeGoal: 5000,
      timeToFirstIncome: "3-6-months",
      startupBudget: 1000,
      timeCommitment: 20,
      learningStyle: "hands-on",
      workPreference: "solo-flexible",
      riskTolerance: 3,
      customerInteractionComfort: 4,
      selfMotivation: 4,
      existingSkills: ["writing", "marketing"],
      experienceLevel: "intermediate",
      lifestyle: "freedom",
      stressResponse: "manage-well",
      communicationStyle: "direct",
      perfectionismLevel: 3,
      socialEnergy: "mixed",
      changeAdaptability: 3,
      attentionToDetail: 3,
      competitionMotivation: "neutral",
      failureResponse: "learning-opportunity",
      routinePreference: "some-structure",
      feedbackReception: "welcome-constructive",
      longTermThinking: "annual-goals",
      authorityComfort: 3,
      technologyComfort: 3,
    };
  };

  return (
    <AuthProvider>
      <PaywallProvider>
        <Router>
          <Routes>
            {/* Public routes with layout */}
            <Route
              path="/"
              element={
                <Layout>
                  <Index />
                </Layout>
              }
            />

            <Route
              path="/explore"
              element={
                <Layout>
                  <BusinessExplorer quizData={quizData} />
                </Layout>
              }
            />

            <Route
              path="/contact"
              element={
                <Layout>
                  <ContactUs />
                </Layout>
              }
            />

            {/* Auth routes (no layout) */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes with layout */}
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Layout>
              }
            />

            <Route
              path="/settings"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                </Layout>
              }
            />

            {/* Quiz without layout (has its own design) */}
            <Route
              path="/quiz"
              element={
                <QuizWithNavigation
                  quizData={quizData}
                  setQuizData={setQuizData}
                  showEmailCapture={showEmailCapture}
                  setShowEmailCapture={setShowEmailCapture}
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                  generateMockQuizData={generateMockQuizData}
                  showAILoading={showAILoading}
                  setShowAILoading={setShowAILoading}
                  loadedReportData={loadedReportData}
                  setLoadedReportData={setLoadedReportData}
                  showCongratulations={showCongratulations}
                  setShowCongratulations={setShowCongratulations}
                  handleAILoadingComplete={handleAILoadingComplete}
                />
              }
            />

            {/* Quiz completion loading page - NEW */}
            <Route
              path="/quiz-loading"
              element={
                <QuizCompletionLoadingWrapper
                  quizData={quizData}
                  setShowCongratulations={setShowCongratulations}
                />
              }
            />

            {/* Loading page - separate route */}
            <Route
              path="/loading"
              element={
                <LoadingPageWrapper
                  quizData={quizData}
                  userEmail={userEmail}
                  showCongratulations={showCongratulations}
                  setUserEmail={setUserEmail}
                  setShowCongratulations={setShowCongratulations}
                  loadedReportData={loadedReportData}
                  handleAILoadingComplete={handleAILoadingComplete}
                />
              }
            />

            {/* Results with layout */}
            <Route
              path="/results"
              element={
                <Layout>
                  <ResultsWrapper
                    quizData={quizData}
                    userEmail={userEmail}
                    onBack={() => window.history.back()}
                    loadedReportData={loadedReportData}
                  />
                </Layout>
              }
            />

            {/* Business Model Detail Page */}
            <Route
              path="/business/:businessId"
              element={
                <Layout>
                  <BusinessModelDetail quizData={quizData} />
                </Layout>
              }
            />

            {/* Business Guide Page */}
            <Route
              path="/guide/:businessId"
              element={
                <Layout>
                  <BusinessGuide quizData={quizData} />
                </Layout>
              }
            />

            {/* Download Report Page */}
            <Route path="/report" element={<DownloadReportPage />} />

            {/* PDF Report Page (no layout) */}
            <Route path="/pdf-report" element={<PDFReportPage />} />

            {/* Privacy Policy */}
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* Unsubscribe Page */}
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
          </Routes>
        </Router>
      </PaywallProvider>
    </AuthProvider>
  );
}

// Quiz completion loading wrapper component
const QuizCompletionLoadingWrapper: React.FC<{
  quizData: QuizData | null;
  setShowCongratulations: (show: boolean) => void;
}> = ({ quizData, setShowCongratulations }) => {
  const navigate = useNavigate();

  const handleLoadingComplete = () => {
    console.log("Quiz completion loading complete, showing congratulations");
    setShowCongratulations(true);
    // Navigate back to quiz route where congratulations popup will be handled
    navigate("/quiz");
  };

  if (!quizData) {
    // Fallback if no quiz data
    navigate("/quiz");
    return null;
  }

  return (
    <div className="relative">
      <QuizCompletionLoading
        quizData={quizData}
        onComplete={handleLoadingComplete}
      />
    </div>
  );
};

// Loading page wrapper component to handle navigation properly
const LoadingPageWrapper: React.FC<{
  quizData: QuizData | null;
  userEmail: string | null;
  showCongratulations: boolean;
  setUserEmail: (email: string) => void;
  setShowCongratulations: (show: boolean) => void;
  loadedReportData: any;
  handleAILoadingComplete: (data: any) => void;
}> = ({
  quizData,
  userEmail,
  showCongratulations,
  setUserEmail,
  setShowCongratulations,
  loadedReportData,
  handleAILoadingComplete,
}) => {
  const navigate = useNavigate();

  // Handler for congratulations completion with proper navigation
  const handleCongratulationsComplete = (email?: string) => {
    console.log("Congratulations complete, navigating to results");
    if (email) {
      setUserEmail(email);
      localStorage.setItem("userEmail", email);
    }
    setShowCongratulations(false);

    // Store data in localStorage before navigation
    if (quizData) {
      localStorage.setItem("quizData", JSON.stringify(quizData));
    }
    if (loadedReportData) {
      localStorage.setItem(
        "loadedReportData",
        JSON.stringify(loadedReportData),
      );
    }

    // Use React Router navigation instead of window.location.href
    navigate("/results");
  };

  return (
    <div className="relative">
      {quizData && (
        <LoadingPage
          quizData={quizData}
          userEmail={userEmail}
          onComplete={handleAILoadingComplete}
          onExit={() => navigate("/quiz")}
        />
      )}
      {showCongratulations && quizData && (
        <EmailCapture
          onEmailSubmit={handleCongratulationsComplete}
          onContinueAsGuest={handleCongratulationsComplete}
          onReturnToQuiz={() => navigate("/quiz")}
          quizData={quizData}
          onStartAIGeneration={handleCongratulationsComplete}
        />
      )}
    </div>
  );
};

// Component that handles quiz navigation
const QuizWithNavigation: React.FC<{
  quizData: QuizData | null;
  setQuizData: (data: QuizData | null) => void;
  showEmailCapture: boolean;
  setShowEmailCapture: (show: boolean) => void;
  userEmail: string | null;
  setUserEmail: (email: string) => void;
  generateMockQuizData: () => QuizData;
  showAILoading: boolean;
  setShowAILoading: (show: boolean) => void;
  loadedReportData: any;
  setLoadedReportData: (data: any) => void;
  showCongratulations: boolean;
  setShowCongratulations: (show: boolean) => void;
  handleAILoadingComplete: (data: any) => void;
}> = ({
  quizData,
  setQuizData,
  showEmailCapture,
  setShowEmailCapture,
  userEmail,
  setUserEmail,
  generateMockQuizData,
  showAILoading,
  setShowAILoading,
  loadedReportData,
  setLoadedReportData,
  showCongratulations,
  setShowCongratulations,
  handleAILoadingComplete,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleQuizComplete = (data: QuizData) => {
    console.log("Quiz completed, navigating to quiz loading page");
    setQuizData(data);
    // Navigate to new loading page instead of showing congratulations immediately
    navigate("/quiz-loading");
  };

  const handleCongratulationsComplete = (email?: string) => {
    console.log("Congratulations complete, navigating to results");
    if (email) {
      setUserEmail(email);
      localStorage.setItem("userEmail", email);
    }

    // IMPORTANT: Reset congratulations state BEFORE navigation
    setShowCongratulations(false);

    // Store quiz data before navigation
    if (quizData) {
      localStorage.setItem("quizData", JSON.stringify(quizData));
    }

    // Small delay to ensure state update is processed
    setTimeout(() => {
      navigate("/results");
    }, 100);
  };

  const handleReturnToQuiz = () => {
    console.log("Returning to quiz");
    setShowCongratulations(false);
    setQuizData(null);
    // Stay on current page (quiz)
  };

  const handleSkipToResults = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(
      "Skip button clicked! Generating mock data and navigating directly to results...",
    );
    const mockData = generateMockQuizData();
    console.log("Generated mock data:", mockData);

    // Set the data and navigate directly, bypassing all loading states
    setQuizData(mockData);
    setUserEmail("delivered@resend.dev");
    setShowAILoading(false);
    setShowCongratulations(false);
    setShowEmailCapture(false);

    console.log("Navigating to /results");
    // Navigate immediately for dev purposes
    navigate("/results");
  };

  return (
    <div className="relative">
      {/* TEMPORARY SKIP BUTTON - REMOVE LATER */}
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button
          type="button"
          onClick={handleSkipToResults}
          className="bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105 border-2 border-white"
          style={{ zIndex: 9999 }}
          hidden
        >
          🚀 SKIP TO RESULTS (DEV)
        </button>
      </div>

      <Quiz
        onComplete={handleQuizComplete}
        onBack={() => window.history.back()}
        userId={
          user && !user.id.startsWith("temp_") ? parseInt(user.id) : undefined
        }
      />
      {showCongratulations && quizData && (
        <EmailCapture
          onEmailSubmit={handleCongratulationsComplete}
          onContinueAsGuest={handleCongratulationsComplete}
          onReturnToQuiz={handleReturnToQuiz}
          quizData={quizData}
          onStartAIGeneration={handleCongratulationsComplete}
        />
      )}
    </div>
  );
};

// Wrapper component to handle results display
const ResultsWrapper: React.FC<{
  quizData: QuizData | null;
  userEmail: string | null;
  onBack: () => void;
  loadedReportData?: any;
}> = ({ quizData, userEmail, onBack, loadedReportData }) => {
  console.log("ResultsWrapper received quizData:", quizData);
  console.log("ResultsWrapper received userEmail:", userEmail);

  if (quizData) {
    return (
      <Results
        quizData={quizData}
        onBack={onBack}
        userEmail={userEmail}
        preloadedReportData={loadedReportData}
      />
    );
  } else {
    return (
      <div className="py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          No Results Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Please take the quiz first to see your personalized results.
        </p>
        <a
          href="/quiz"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Take the Quiz
        </a>
      </div>
    );
  }
};

export default App;
