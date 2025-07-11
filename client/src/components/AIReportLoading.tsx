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
  ChevronLeft
} from "lucide-react";
import { QuizData, BusinessPath } from "../types";

interface AIReportLoadingProps {
  quizData: QuizData;
  userEmail?: string | null;
  onComplete: (data: {
    personalizedPaths: BusinessPath[];
    aiInsights: any;
    allCharacteristics: string[];
    businessFitDescriptions: {[key: string]: string};
  }) => void;
  onExit?: () => void;
}

interface LoadingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'active' | 'completed';
  estimatedTime: number; // in seconds
}

const AIReportLoading: React.FC<AIReportLoadingProps> = ({
  quizData,
  userEmail,
  onComplete,
  onExit
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
      status: 'pending',
      estimatedTime: 3
    },
    {
      id: "generating-matches",
      title: "Finding Perfect Business Matches",
      description: "AI is matching you with the best business models",
      icon: Target,
      status: 'pending',
      estimatedTime: 5
    },
    {
      id: "creating-insights",
      title: "Creating Personalized Insights",
      description: "Generating custom recommendations based on your strengths",
      icon: Sparkles,
      status: 'pending',
      estimatedTime: 4
    },
    {
      id: "building-characteristics",
      title: "Building Your Entrepreneur Profile",
      description: "Identifying your unique entrepreneurial characteristics",
      icon: Users,
      status: 'pending',
      estimatedTime: 3
    },
    {
      id: "generating-descriptions",
      title: "Crafting Business Fit Analysis",
      description: "Creating detailed explanations for your top matches",
      icon: BarChart3,
      status: 'pending',
      estimatedTime: 4
    },
    {
      id: "finalizing-report",
      title: "Finalizing Your Report",
      description: "Putting together your comprehensive business analysis",
      icon: Award,
      status: 'pending',
      estimatedTime: 2
    }
  ];

  const [steps, setSteps] = useState<LoadingStep[]>(loadingSteps);

  useEffect(() => {
    const generateReport = async () => {
      const startTime = Date.now();
      let currentResults = {};
      
      try {
        // Step 1: Analyze profile (immediate)
        const step1Result = await executeStep(0, async () => {
          await new Promise(resolve => setTimeout(resolve, 1500));
          return { profileAnalyzed: true };
        });
        currentResults = { ...currentResults, ...step1Result };

        // Step 2: Generate AI-powered personalized paths
        const step2Result = await executeStep(1, async () => {
          const { generateAIPersonalizedPaths } = await import("../utils/quizLogic");
          const paths = await generateAIPersonalizedPaths(quizData);
          return { personalizedPaths: paths };
        });
        currentResults = { ...currentResults, ...step2Result };

        // Step 3: Generate AI insights
        const step3Result = await executeStep(2, async () => {
          const { AIService } = await import("../utils/aiService");
          const aiService = AIService.getInstance();
          const pathsForInsights = (currentResults as any).personalizedPaths?.slice(0, 3) || [];
          const insights = await aiService.generatePersonalizedInsights(
            quizData,
            pathsForInsights
          );
          return { aiInsights: insights };
        });
        currentResults = { ...currentResults, ...step3Result };

        // Step 4: Generate characteristics
        const step4Result = await executeStep(3, async () => {
          const characteristics = await generateAllCharacteristics();
          return { allCharacteristics: characteristics };
        });
        currentResults = { ...currentResults, ...step4Result };

        // Step 5: Generate business fit descriptions
        const step5Result = await executeStep(4, async () => {
          const descriptions = await generateBusinessFitDescriptions();
          return { businessFitDescriptions: descriptions };
        });
        currentResults = { ...currentResults, ...step5Result };

        // Step 6: Finalize report
        const step6Result = await executeStep(5, async () => {
          await new Promise(resolve => setTimeout(resolve, 1500));
          return { reportFinalized: true };
        });
        currentResults = { ...currentResults, ...step6Result };

        // Ensure minimum 10 seconds duration
        const elapsedTime = Date.now() - startTime;
        const minimumDuration = 10000; // 10 seconds
        
        if (elapsedTime < minimumDuration) {
          const remainingTime = minimumDuration - elapsedTime;
          await new Promise(resolve => setTimeout(resolve, remainingTime));
          
          // Update progress to 100% during final wait
          setProgress(100);
        }

        // Complete and pass data to parent
        onComplete({
          personalizedPaths: (currentResults as any).personalizedPaths || [],
          aiInsights: (currentResults as any).aiInsights || null,
          allCharacteristics: (currentResults as any).allCharacteristics || [],
          businessFitDescriptions: (currentResults as any).businessFitDescriptions || {}
        });

      } catch (error) {
        console.error("Error generating report:", error);
        
        // Ensure minimum 10 seconds duration even on error
        const elapsedTime = Date.now() - startTime;
        const minimumDuration = 10000; // 10 seconds
        
        if (elapsedTime < minimumDuration) {
          const remainingTime = minimumDuration - elapsedTime;
          await new Promise(resolve => setTimeout(resolve, remainingTime));
          setProgress(100);
        }
        
        // In case of error, still complete with current data
        onComplete({
          personalizedPaths: (currentResults as any).personalizedPaths || [],
          aiInsights: (currentResults as any).aiInsights || null,
          allCharacteristics: (currentResults as any).allCharacteristics || [],
          businessFitDescriptions: (currentResults as any).businessFitDescriptions || {}
        });
      }
    };

    generateReport();
  }, []);

  const executeStep = async (stepIndex: number, asyncFunction: () => Promise<any>) => {
    // Mark step as active
    setCurrentStep(stepIndex);
    setSteps(prev => prev.map((step, index) => ({
      ...step,
      status: index === stepIndex ? 'active' : index < stepIndex ? 'completed' : 'pending'
    })));

    // Start progress for this step
    const startProgress = (stepIndex / loadingSteps.length) * 100;
    const endProgress = ((stepIndex + 1) / loadingSteps.length) * 100;
    
    // Gradually increase progress during step execution
    const progressInterval = setInterval(() => {
      setProgress(prev => {
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
      setLoadingResults(prev => ({ ...prev, ...result }));
      
      // Mark step as completed
      setCompletedSteps(prev => new Set([...prev, stepIndex]));
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index <= stepIndex ? 'completed' : 'pending'
      })));
      
      return result;
      
    } catch (error) {
      console.error(`Error in step ${stepIndex}:`, error);
      // Clear the interval and set final progress
      clearInterval(progressInterval);
      setProgress(endProgress);
      
      // Continue with fallback
      setCompletedSteps(prev => new Set([...prev, stepIndex]));
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index <= stepIndex ? 'completed' : 'pending'
      })));
      return {};
    }
  };

  const generateAllCharacteristics = async (): Promise<string[]> => {
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
- Tools familiar with: ${quizData.familiarTools?.join(', ')}
- Main motivation: ${quizData.mainMotivation}
- Weekly time commitment: ${quizData.weeklyTimeCommitment}
- Income goal: ${quizData.successIncomeGoal}

Return a JSON object with this exact structure:
{
  "characteristics": ["characteristic 1", "characteristic 2", "characteristic 3", "characteristic 4", "characteristic 5", "characteristic 6"]
}

Examples: {"characteristics": ["Highly self-motivated", "Strategic risk-taker", "Tech-savvy innovator", "Clear communicator", "Organized planner", "Creative problem solver"]}`;

      const response = await fetch('/api/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          maxTokens: 200,
          temperature: 0.7,
          responseFormat: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate characteristics');
      }

      const data = await response.json();
      
      // Clean up the response content (remove markdown code blocks if present)
      let cleanContent = data.content;
      if (cleanContent.includes('```json')) {
        cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```/g, '');
      }
      
      const parsed = JSON.parse(cleanContent);
      if (parsed && parsed.characteristics && Array.isArray(parsed.characteristics) && parsed.characteristics.length === 6) {
        return parsed.characteristics;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating characteristics:', error);
      // Fallback characteristics based on quiz data
      return [
        quizData.selfMotivationLevel >= 4 ? "Highly self-motivated" : "Moderately self-motivated",
        quizData.riskComfortLevel >= 4 ? "High risk tolerance" : "Moderate risk tolerance",
        quizData.techSkillsRating >= 4 ? "Strong tech skills" : "Adequate tech skills",
        quizData.directCommunicationEnjoyment >= 4 ? "Excellent communicator" : "Good communicator",
        quizData.organizationLevel >= 4 ? "Highly organized planner" : "Flexible approach to planning",
        quizData.creativeWorkEnjoyment >= 4 ? "Creative problem solver" : "Analytical approach to challenges"
      ];
    }
  };

  const generateBusinessFitDescriptions = async (): Promise<{[key: string]: string}> => {
    try {
      const { calculateAdvancedBusinessModelMatches } = await import("../utils/advancedScoringAlgorithm");
      const advancedScores = calculateAdvancedBusinessModelMatches(quizData);
      const top3Paths = advancedScores.slice(0, 3);
      
      const response = await fetch('/api/generate-business-fit-descriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizData,
          businessMatches: top3Paths
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate business fit descriptions');
      }

      const data = await response.json();
      return data.descriptions || {};
    } catch (error) {
      console.error('Error generating business fit descriptions:', error);
      return {};
    }
  };

  const getStepIcon = (step: LoadingStep, index: number) => {
    const IconComponent = step.icon;
    
    if (step.status === 'completed') {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    
    if (step.status === 'active') {
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
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Brain className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI is Creating Your Personalized Report
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our advanced AI is analyzing your responses and generating custom insights just for you. This will take about 10-15 seconds.
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
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
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
                  damping: 15
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
                step.status === 'active' 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : step.status === 'completed'
                  ? 'ring-2 ring-green-500 bg-green-50'
                  : 'ring-1 ring-gray-200'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-center mb-2">
                <div className="flex-shrink-0 mr-3">
                  {getStepIcon(step, index)}
                </div>
                {step.status === 'active' && (
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
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: dot * 0.2
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${
                step.status === 'active' ? 'text-blue-900' : 
                step.status === 'completed' ? 'text-green-900' : 
                'text-gray-700'
              }`}>
                {step.title}
              </h3>
              <p className={`text-sm ${
                step.status === 'active' ? 'text-blue-600' : 
                step.status === 'completed' ? 'text-green-600' : 
                'text-gray-500'
              }`}>
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
                  Our AI analyzes over 12 different personality traits and business factors to find your perfect match.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-xl mr-3">🎯</div>
              <div>
                <p className="text-sm text-gray-600">
                  Your personalized report is unique to you - no two reports are exactly the same!
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