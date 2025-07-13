import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  Zap,
  Target,
  Star,
  CheckCircle,
  Clock,
  TrendingUp,
  Lightbulb,
  Award,
  Users,
  BarChart3,
} from "lucide-react";
import { QuizData } from "../types";

interface QuizCompletionLoadingProps {
  quizData: QuizData;
  onComplete: () => void;
}

interface ProcessingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  duration: number; // in seconds
  completed: boolean;
}

const QuizCompletionLoading: React.FC<QuizCompletionLoadingProps> = ({
  quizData,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  const processingSteps: ProcessingStep[] = [
    {
      id: "analyzing",
      title: "Analyzing Your Responses",
      subtitle: "Processing your unique answers and preferences",
      icon: Brain,
      duration: 2.5,
      completed: false,
    },
    {
      id: "matching",
      title: "Finding Perfect Matches",
      subtitle: "AI is comparing you with business models",
      icon: Target,
      duration: 3,
      completed: false,
    },
    {
      id: "insights",
      title: "Generating AI Insights",
      subtitle: "Creating personalized recommendations just for you",
      icon: Sparkles,
      duration: 4,
      completed: false,
    },
    {
      id: "profiling",
      title: "Building Your Profile",
      subtitle: "Identifying your entrepreneurial strengths",
      icon: Users,
      duration: 2.5,
      completed: false,
    },
    {
      id: "finalizing",
      title: "Preparing Results",
      subtitle: "Putting the finishing touches on your report",
      icon: Award,
      duration: 3,
      completed: false,
    },
  ];

  const [steps, setSteps] = useState<ProcessingStep[]>(processingSteps);

  // Generate AI insights during the loading process
  const generateAIInsights = async () => {
    try {
      setIsGeneratingInsights(true);

      // Call the AI service to generate insights
      const { AIService } = await import("../utils/aiService");
      const aiService = AIService.getInstance();

      // Get top business paths first
      const { generateAIPersonalizedPaths } = await import(
        "../utils/quizLogic"
      );
      const topPaths = await generateAIPersonalizedPaths(quizData);

      // Generate personalized insights
      const insights = await aiService.generatePersonalizedInsights(
        quizData,
        topPaths.slice(0, 3), // Use top 3 paths
      );

      // Store insights in cache for later use
      const { aiCacheManager } = await import("../utils/aiCacheManager");
      // For now, we'll cache just the insights. The full caching will be handled by the Results page
      // This is a temporary storage for the quiz completion flow
      localStorage.setItem("temp-ai-insights", JSON.stringify(insights));

      setIsGeneratingInsights(false);
      return insights;
    } catch (error) {
      console.error("Error generating AI insights:", error);
      setIsGeneratingInsights(false);
      return null;
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const runSteps = async () => {
      const totalDuration = 15; // 15 seconds total
      const stepDuration = totalDuration / steps.length;

      for (let i = 0; i < steps.length; i++) {
        setCurrentStepIndex(i);

        // Mark current step as active
        setSteps((prev) =>
          prev.map((step, index) => ({
            ...step,
            completed: index < i,
          })),
        );

        // Special handling for AI insights step
        if (steps[i].id === "insights") {
          generateAIInsights();
        }

        // Smooth progress animation for current step
        const stepStart = (i / steps.length) * 100;
        const stepEnd = ((i + 1) / steps.length) * 100;

        let currentProgress = stepStart;
        const progressIncrement = (stepEnd - stepStart) / (stepDuration * 20); // 20 updates per second

        progressInterval = setInterval(() => {
          currentProgress = Math.min(
            currentProgress + progressIncrement,
            stepEnd,
          );
          setProgress(currentProgress);

          if (currentProgress >= stepEnd) {
            clearInterval(progressInterval);
          }
        }, 50);

        // Wait for step duration
        await new Promise((resolve) => {
          timeoutId = setTimeout(resolve, stepDuration * 1000);
        });

        // Mark step as completed
        setCompletedSteps((prev) => new Set([...prev, i]));
        setSteps((prev) =>
          prev.map((step, index) => ({
            ...step,
            completed: index <= i,
          })),
        );
      }

      // Ensure we reach 100%
      setProgress(100);

      // Small delay before completing
      setTimeout(() => {
        onComplete();
      }, 500);
    };

    runSteps();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [onComplete, steps.length]);

  const getRandomMotivationalText = () => {
    const texts = [
      "Great entrepreneurs are made, not born...",
      "Your journey to success starts here...",
      "Every expert was once a beginner...",
      "The best time to start was yesterday, the second best time is now...",
      "Success is where preparation meets opportunity...",
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  const [motivationalText] = useState(getRandomMotivationalText());

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Pulsing Icon */}
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl"
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
                "0 25px 50px -12px rgba(139, 92, 246, 0.4)",
                "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Quiz Complete!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI is now analyzing your responses...
          </p>
          <p className="text-sm text-gray-500 italic">{motivationalText}</p>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Overall Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Overall Progress
              </span>
              <span className="text-lg font-bold text-purple-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Current Step Display */}
          <AnimatePresence mode="wait">
            {steps.map((step, index) => {
              if (index !== currentStepIndex) return null;

              return (
                <motion.div
                  key={step.id}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <step.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.subtitle}</p>
                    </div>
                  </div>

                  {/* Animated dots for current step */}
                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: dot * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Steps Overview */}
        <motion.div
          className="grid grid-cols-5 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-3 rounded-xl text-center transition-all duration-300 ${
                index < currentStepIndex
                  ? "bg-green-100 text-green-700"
                  : index === currentStepIndex
                    ? "bg-purple-100 text-purple-700 ring-2 ring-purple-300"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              <div className="flex justify-center mb-2">
                {index < currentStepIndex ? (
                  <CheckCircle className="w-5 h-5" />
                ) : index === currentStepIndex ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <step.icon className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-medium">{step.title}</p>
            </div>
          ))}
        </motion.div>

        {/* Fun Fact */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-center mb-2">
              <Lightbulb className="w-5 h-5 mr-2" />
              <span className="font-semibold">Did you know?</span>
            </div>
            <p className="text-sm opacity-90">
              Our AI analyzes your responses against 15+ business models to find
              your perfect entrepreneurial match!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizCompletionLoading;
