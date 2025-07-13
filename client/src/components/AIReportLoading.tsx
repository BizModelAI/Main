import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  Sparkles,
  BarChart3,
  Award,
  Calendar,
  Lightbulb,
  ChevronLeft,
} from "lucide-react";
import { QuizData, BusinessPath } from "../types";

interface AIReportLoadingProps {
  quizData: QuizData;
  userEmail?: string | null;
  onComplete: (data: {
    personalizedPaths: BusinessPath[];
    aiInsights: any;
    allCharacteristics: string[];
    businessFitDescriptions: { [key: string]: string };
    businessAvoidDescriptions: { [key: string]: string };
  }) => void;
  onExit?: () => void;
}

interface LoadingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: "pending" | "active" | "completed";
  estimatedTime: number; // in seconds
}

const AIReportLoading: React.FC<AIReportLoadingProps> = ({
  quizData,
  userEmail,
  onComplete,
  onExit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loadingResults, setLoadingResults] = useState<any>({});

  const loadingSteps: LoadingStep[] = [
    {
      id: "analyzing-profile",
      title: "Analyzing Your Profile",
      description: "Processing your quiz responses and personality traits",
      icon: Brain,
      status: "pending",
      estimatedTime: 3,
    },
    {
      id: "generating-matches",
      title: "Finding Perfect Business Matches",
      description: "AI is matching you with the best business models",
      icon: Target,
      status: "pending",
      estimatedTime: 5,
    },
    {
      id: "creating-insights",
      title: "Creating Personalized Insights",
      description: "Generating custom recommendations based on your strengths",
      icon: Sparkles,
      status: "pending",
      estimatedTime: 4,
    },
    {
      id: "building-characteristics",
      title: "Building Your Entrepreneur Profile",
      description: "Identifying your unique entrepreneurial characteristics",
      icon: Users,
      status: "pending",
      estimatedTime: 3,
    },
    {
      id: "generating-descriptions",
      title: "Crafting Business Fit Analysis",
      description: "Creating detailed explanations for your top matches",
      icon: BarChart3,
      status: "pending",
      estimatedTime: 4,
    },
    {
      id: "finalizing-report",
      title: "Finalizing Your Report",
      description:
        "Putting together your comprehensive business analysis with personalized insights",
      icon: Award,
      status: "pending",
      estimatedTime: 5,
    },
  ];

  const [steps, setSteps] = useState<LoadingStep[]>(loadingSteps);

  // Generate all 6 characteristics with OpenAI
  const generateAllCharacteristics = async (
    quizData: QuizData,
  ): Promise<string[]> => {
    try {
      const prompt = `Based on this quiz data, generate exactly 6 short positive characteristics that reflect the user's entrepreneurial strengths. Each should be 3-5 words maximum and highlight unique aspects of their entrepreneurial potential.

Quiz Data:
- Self-motivation level: ${quizData.selfMotivationLevel}/5
- Risk comfort level: ${quizData.riskComfortLevel}/5
- Tech skills rating: ${quizData.techSkillsRating}/5
- Direct communication enjoyment: ${quizData.directCommunicationEnjoyment}/5
- Learning preference: ${quizData.learningPreference}
- Organization level: ${quizData.organizationLevel}/5
- Creative work enjoyment: ${quizData.creativeWorkEnjoyment}/5
- Work collaboration preference: ${quizData.workCollaborationPreference}
- Decision making style: ${quizData.decisionMakingStyle}
- Work structure preference: ${quizData.workStructurePreference}
- Long-term consistency: ${quizData.longTermConsistency}/5
- Uncertainty handling: ${quizData.uncertaintyHandling}/5
- Tools familiar with: ${quizData.familiarTools?.join(", ")}
- Main motivation: ${quizData.mainMotivation}
- Weekly time commitment: ${quizData.weeklyTimeCommitment}
- Income goal: ${quizData.successIncomeGoal}

Return a JSON object with this exact structure:
{
  "characteristics": ["characteristic 1", "characteristic 2", "characteristic 3", "characteristic 4", "characteristic 5", "characteristic 6"]
}

Examples: {"characteristics": ["Highly self-motivated", "Strategic risk-taker", "Tech-savvy innovator", "Clear communicator", "Organized planner", "Creative problem solver"]}`;

      const response = await fetch("/api/openai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          maxTokens: 200,
          temperature: 0.7,
          responseFormat: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate characteristics");
      }

      const data = await response.json();

      // Clean up the response content (remove markdown code blocks if present)
      let cleanContent = data.content;
      if (cleanContent.includes("```json")) {
        cleanContent = cleanContent
          .replace(/```json\n?/g, "")
          .replace(/```/g, "");
      }

      const parsed = JSON.parse(cleanContent);
      if (
        parsed &&
        parsed.characteristics &&
        Array.isArray(parsed.characteristics) &&
        parsed.characteristics.length === 6
      ) {
        return parsed.characteristics;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating all characteristics:", error);
      // Fallback characteristics based on quiz data
      const fallbackCharacteristics = [
        quizData.selfMotivationLevel >= 4
          ? "Highly self-motivated"
          : "Moderately self-motivated",
        quizData.riskComfortLevel >= 4
          ? "High risk tolerance"
          : "Moderate risk tolerance",
        quizData.techSkillsRating >= 4
          ? "Strong tech skills"
          : "Adequate tech skills",
        quizData.directCommunicationEnjoyment >= 4
          ? "Excellent communicator"
          : "Good communicator",
        quizData.organizationLevel >= 4
          ? "Highly organized planner"
          : "Flexible approach to planning",
        quizData.creativeWorkEnjoyment >= 4
          ? "Creative problem solver"
          : "Analytical approach to challenges",
      ];

      return fallbackCharacteristics;
    }
  };

  // Generate business fit descriptions
  const generateBusinessFitDescriptions = async (
    quizData: QuizData,
  ): Promise<{ [key: string]: string }> => {
    try {
      const { calculateAdvancedBusinessModelMatches } = await import(
        "../utils/advancedScoringAlgorithm"
      );
      const topThreeAdvanced = calculateAdvancedBusinessModelMatches(quizData);

      const businessModels = topThreeAdvanced.slice(0, 3).map((match) => ({
        id: match.id,
        name: match.name,
        score: match.score,
      }));

      const prompt = `Based on the quiz data and business model matches, generate personalized explanations for why each business model fits this user. Focus on specific aspects of their profile that align with each model.

Quiz Data Summary:
- Self-motivation: ${quizData.selfMotivationLevel}/5
- Risk tolerance: ${quizData.riskComfortLevel}/5
- Tech skills: ${quizData.techSkillsRating}/5
- Time commitment: ${quizData.weeklyTimeCommitment} hours/week
- Income goal: ${quizData.successIncomeGoal}
- Learning preference: ${quizData.learningPreference}
- Work collaboration: ${quizData.workCollaborationPreference}

Business Models:
${businessModels.map((model) => `- ${model.name} (${model.score}% fit)`).join("\n")}

For each business model, write a 2-3 sentence explanation of why it fits this user's profile. Focus on specific strengths and alignments.

Return JSON format:
{
  "descriptions": [
    {"businessId": "business-id", "description": "explanation here"},
    {"businessId": "business-id", "description": "explanation here"},
    {"businessId": "business-id", "description": "explanation here"}
  ]
}`;

      const response = await fetch("/api/openai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          maxTokens: 800,
          temperature: 0.7,
          responseFormat: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate business fit descriptions");
      }

      const data = await response.json();
      let cleanContent = data.content;
      if (cleanContent.includes("```json")) {
        cleanContent = cleanContent
          .replace(/```json\n?/g, "")
          .replace(/```/g, "");
      }

      const parsed = JSON.parse(cleanContent);
      const descriptionsMap: { [key: string]: string } = {};

      if (parsed && parsed.descriptions && Array.isArray(parsed.descriptions)) {
        parsed.descriptions.forEach(
          (desc: { businessId: string; description: string }) => {
            descriptionsMap[desc.businessId] = desc.description;
          },
        );
      }

      return descriptionsMap;
    } catch (error) {
      console.error("Error generating business fit descriptions:", error);
      // Set fallback descriptions
      const fallbackDescriptions: { [key: string]: string } = {};
      const { calculateAdvancedBusinessModelMatches } = await import(
        "../utils/advancedScoringAlgorithm"
      );
      const topThreeAdvanced = calculateAdvancedBusinessModelMatches(quizData);

      topThreeAdvanced.slice(0, 3).forEach((match, index) => {
        fallbackDescriptions[match.id] =
          `This business model aligns well with your ${quizData.selfMotivationLevel >= 4 ? "high self-motivation" : "self-driven nature"} and ${quizData.weeklyTimeCommitment} hours/week availability. Your ${quizData.techSkillsRating >= 4 ? "strong" : "adequate"} technical skills and ${quizData.riskComfortLevel >= 4 ? "high" : "moderate"} risk tolerance make this a ${index === 0 ? "perfect" : index === 1 ? "excellent" : "good"} match for your entrepreneurial journey.`;
      });

      return fallbackDescriptions;
    }
  };

  // Generate business avoid descriptions for bottom 3 matches
  const generateBusinessAvoidDescriptions = async (
    quizData: QuizData,
  ): Promise<{ [key: string]: string }> => {
    try {
      const { calculateAdvancedBusinessModelMatches } = await import(
        "../utils/advancedScoringAlgorithm"
      );
      const { businessPaths } = await import("../../../shared/businessPaths");

      const allMatches = calculateAdvancedBusinessModelMatches(quizData);

      // Get the bottom 3 business models (worst matches)
      const bottomThree = allMatches.slice(-3).reverse(); // reverse to get worst-first order

      const businessMatches = bottomThree.map((match) => {
        const pathData = businessPaths.find((path) => path.id === match.id);
        return {
          id: match.id,
          name: match.name,
          fitScore: match.score,
          description:
            pathData?.description || "Business model description not available",
          timeToProfit: pathData?.timeToProfit || "Variable",
          startupCost: pathData?.startupCost || "Variable",
          potentialIncome: pathData?.potentialIncome || "Variable",
        };
      });

      const response = await fetch(
        "/api/generate-business-avoid-descriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizData: quizData,
            businessMatches: businessMatches,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate business avoid descriptions");
      }

      const data = await response.json();
      const descriptionsMap: { [key: string]: string } = {};

      if (data && data.descriptions && Array.isArray(data.descriptions)) {
        data.descriptions.forEach(
          (desc: { businessId: string; description: string }) => {
            descriptionsMap[desc.businessId] = desc.description;
          },
        );
      }

      return descriptionsMap;
    } catch (error) {
      console.error("Error generating business avoid descriptions:", error);
      // Set fallback descriptions
      const fallbackDescriptions: { [key: string]: string } = {};
      const { calculateAdvancedBusinessModelMatches } = await import(
        "../utils/advancedScoringAlgorithm"
      );
      const allMatches = calculateAdvancedBusinessModelMatches(quizData);
      const bottomThree = allMatches.slice(-3).reverse();

      bottomThree.forEach((match) => {
        fallbackDescriptions[match.id] =
          `This business model scored ${match.score}% for your profile, indicating significant misalignment with your current goals, skills, and preferences. Based on your quiz responses, you would likely face substantial challenges in this field that could impact your success. Consider focusing on higher-scoring business models that better match your natural strengths and current situation. Your ${quizData.riskComfortLevel <= 2 ? "lower risk tolerance" : "risk preferences"} and ${quizData.weeklyTimeCommitment} hours/week availability suggest other business models would be more suitable for your entrepreneurial journey.`;
      });

      return fallbackDescriptions;
    }
  };

  useEffect(() => {
    const generateReport = async () => {
      const startTime = Date.now();
      let currentResults = {};

      // Create fallback quiz data for development mode
      const getFallbackQuizData = (): QuizData => ({
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
        pathPreference: "proven-path",
        controlImportance: 4,

        // Round 6: Business Model Fit Filters
        onlinePresenceComfort: "somewhat-comfortable",
        clientCallsComfort: "somewhat-comfortable",
        physicalShippingOpenness: "open-to-it",
        workStylePreference: "structured-flexible-mix",
        socialMediaInterest: 3,
        ecosystemParticipation: "participate-somewhat",
        existingAudience: "none",
        promotingOthersOpenness: "somewhat-open",
        teachVsSolvePreference: "solve-problems",
        meaningfulContributionImportance: 4,
      });

      // Use fallback data if quizData is null/undefined (DEV mode)
      const activeQuizData = quizData || getFallbackQuizData();

      if (!quizData) {
        console.log("Using fallback quiz data for development mode");
      }

      try {
        // Step 1: Analyze profile (immediate)
        const step1Result = await executeStep(0, async () => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          return { profileAnalyzed: true };
        });
        currentResults = { ...currentResults, ...step1Result };

        // Step 2: Generate AI-powered personalized paths
        const step2Result = await executeStep(1, async () => {
          const { generateAIPersonalizedPaths } = await import(
            "../utils/quizLogic"
          );
          const paths = await generateAIPersonalizedPaths(activeQuizData);
          return { personalizedPaths: paths };
        });
        currentResults = { ...currentResults, ...step2Result };

        // Step 3: Generate AI insights
        const step3Result = await executeStep(2, async () => {
          const { AIService } = await import("../utils/aiService");
          const aiService = AIService.getInstance();
          const pathsForInsights =
            (currentResults as any).personalizedPaths?.slice(0, 3) || [];
          const insights = await aiService.generatePersonalizedInsights(
            activeQuizData,
            pathsForInsights,
          );
          return { aiInsights: insights };
        });
        currentResults = { ...currentResults, ...step3Result };

        // Step 4: Generate characteristics
        const step4Result = await executeStep(3, async () => {
          const characteristics =
            await generateAllCharacteristics(activeQuizData);
          return { allCharacteristics: characteristics };
        });
        currentResults = { ...currentResults, ...step4Result };

        // Step 5: Generate business fit and avoid descriptions
        const step5Result = await executeStep(4, async () => {
          const [fitDescriptions, avoidDescriptions] = await Promise.all([
            generateBusinessFitDescriptions(activeQuizData),
            generateBusinessAvoidDescriptions(activeQuizData),
          ]);
          return {
            businessFitDescriptions: fitDescriptions,
            businessAvoidDescriptions: avoidDescriptions,
          };
        });
        currentResults = { ...currentResults, ...step5Result };

        // Step 6: Generate personalized insights
        const step6Result = await executeStep(5, async () => {
          // Get the cached AI analysis that was already generated
          const { aiCacheManager } = await import("../utils/aiCacheManager");
          const cachedData = aiCacheManager.getCachedAIContent(activeQuizData);

          // Use the fullAnalysis from the cached data, or generate fallback content
          const insights =
            cachedData.analysis?.fullAnalysis ||
            `Your assessment reveals strong alignment with ${(currentResults as any).personalizedPaths?.[0]?.name || "your top business match"}. Your ${activeQuizData.selfMotivationLevel >= 4 ? "high" : "moderate"} self-motivation level and ${activeQuizData.weeklyTimeCommitment} hours per week commitment create a solid foundation for this business model.

Based on your ${activeQuizData.riskComfortLevel}/5 risk tolerance and ${activeQuizData.techSkillsRating}/5 tech skills, you're well-positioned to navigate the challenges of this business path. Your ${activeQuizData.learningPreference} learning style will help you adapt to the requirements of this field.

With your income goal of ${activeQuizData.successIncomeGoal} per month and ${activeQuizData.firstIncomeTimeline} timeline, this path offers realistic potential for achieving your financial objectives while aligning with your personal strengths and preferences.`;

          return {};
        });
        currentResults = { ...currentResults, ...step6Result };

        // Step 7: Finalize report
        const step7Result = await executeStep(6, async () => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          return { reportFinalized: true };
        });
        currentResults = { ...currentResults, ...step7Result };

        // Ensure minimum 10 seconds duration
        const elapsedTime = Date.now() - startTime;
        const minimumDuration = 10000; // 10 seconds

        if (elapsedTime < minimumDuration) {
          const remainingTime = minimumDuration - elapsedTime;
          await new Promise((resolve) => setTimeout(resolve, remainingTime));

          // Update progress to 100% during final wait
          setProgress(100);
        }

        // Complete and pass data to parent
        onComplete({
          personalizedPaths: (currentResults as any).personalizedPaths || [],
          aiInsights: (currentResults as any).aiInsights || null,
          allCharacteristics: (currentResults as any).allCharacteristics || [],
          businessFitDescriptions:
            (currentResults as any).businessFitDescriptions || {},
          businessAvoidDescriptions:
            (currentResults as any).businessAvoidDescriptions || {},
        });
      } catch (error) {
        console.error("Error generating report:", error);

        // Ensure minimum 10 seconds duration even on error
        const elapsedTime = Date.now() - startTime;
        const minimumDuration = 10000; // 10 seconds

        if (elapsedTime < minimumDuration) {
          const remainingTime = minimumDuration - elapsedTime;
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
          setProgress(100);
        }

        // In case of error, still complete with current data
        onComplete({
          personalizedPaths: (currentResults as any).personalizedPaths || [],
          aiInsights: (currentResults as any).aiInsights || null,
          allCharacteristics: (currentResults as any).allCharacteristics || [],
          businessFitDescriptions:
            (currentResults as any).businessFitDescriptions || {},
          businessAvoidDescriptions:
            (currentResults as any).businessAvoidDescriptions || {},
        });
      }
    };

    generateReport();
  }, [quizData]);

  const executeStep = async (
    stepIndex: number,
    asyncFunction: () => Promise<any>,
  ) => {
    // Mark step as active
    setCurrentStep(stepIndex);
    setSteps((prev) =>
      prev.map((step, index) => ({
        ...step,
        status:
          index === stepIndex
            ? "active"
            : index < stepIndex
              ? "completed"
              : "pending",
      })),
    );

    // Start progress for this step
    const startProgress = (stepIndex / loadingSteps.length) * 100;
    const endProgress = ((stepIndex + 1) / loadingSteps.length) * 100;

    // Gradually increase progress during step execution
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = (endProgress - startProgress) / 50; // Divide into 50 smaller increments
        const newProgress = Math.min(prev + increment, endProgress - 2);
        return newProgress;
      });
    }, 50); // Update every 50ms for smoother animation

    try {
      const result = await asyncFunction();

      // Clear the interval and set final progress
      clearInterval(progressInterval);
      setProgress(endProgress);

      // Store result
      setLoadingResults((prev: any) => ({ ...prev, ...result }));

      // Mark step as completed
      setCompletedSteps((prev) => new Set([...prev, stepIndex]));
      setSteps((prev) =>
        prev.map((step, index) => ({
          ...step,
          status: index <= stepIndex ? "completed" : "pending",
        })),
      );

      return result;
    } catch (error) {
      console.error(`Error in step ${stepIndex}:`, error);
      // Clear the interval and set final progress
      clearInterval(progressInterval);
      setProgress(endProgress);

      // Continue with fallback
      setCompletedSteps((prev) => new Set([...prev, stepIndex]));
      setSteps((prev) =>
        prev.map((step, index) => ({
          ...step,
          status: index <= stepIndex ? "completed" : "pending",
        })),
      );
      return {};
    }
  };

  const getStepIcon = (step: LoadingStep, index: number) => {
    const IconComponent = step.icon;

    if (step.status === "completed") {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }

    if (step.status === "active") {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <IconComponent className="h-6 w-6 text-blue-500" />
        </motion.div>
      );
    }

    return <IconComponent className="h-6 w-6 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="max-w-4xl mx-auto px-4 relative">
        {/* Exit Button */}
        {onExit && (
          <motion.button
            onClick={onExit}
            className="absolute top-2 left-2 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </motion.button>
        )}

        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Brain className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI is Creating Your Personalized Report
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our advanced AI is analyzing your responses and generating custom
            insights just for you. This will take about 15-30 seconds.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Compact Loading Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`bg-gray-50 rounded-xl p-4 shadow-sm transition-all duration-300 ${
                step.status === "active"
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : step.status === "completed"
                    ? "ring-2 ring-green-500 bg-green-50"
                    : "ring-1 ring-gray-200"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-center mb-2">
                <div className="flex-shrink-0 mr-3">
                  {getStepIcon(step, index)}
                </div>
                {step.status === "active" && (
                  <motion.div
                    className="flex space-x-1 ml-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: dot * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
              <h3
                className={`text-lg font-semibold mb-1 ${
                  step.status === "active"
                    ? "text-blue-900"
                    : step.status === "completed"
                      ? "text-green-900"
                      : "text-gray-700"
                }`}
              >
                {step.title}
              </h3>
              <p
                className={`text-sm ${
                  step.status === "active"
                    ? "text-blue-600"
                    : step.status === "completed"
                      ? "text-green-600"
                      : "text-gray-500"
                }`}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Compact Fun Facts */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
            Did you know?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start">
              <div className="text-xl mr-3">🧠</div>
              <div>
                <p className="text-sm text-gray-600">
                  Our AI analyzes over 12 different personality traits and
                  business factors to find your perfect match.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-xl mr-3">🎯</div>
              <div>
                <p className="text-sm text-gray-600">
                  Your personalized report is unique to you - no two reports are
                  exactly the same!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIReportLoading;
