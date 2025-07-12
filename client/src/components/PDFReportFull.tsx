import React from "react";
import { QuizData } from "../types";
import { generatePersonalizedPaths } from "../utils/quizLogic";
import {
  TrendingUp,
  Target,
  Brain,
  Award,
  Users,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap,
  Calendar,
  BarChart3,
  Lightbulb,
  Clock,
  DollarSign,
  Shield,
  ExternalLink,
  User,
  BookOpen,
  Map,
  Briefcase,
} from "lucide-react";

interface PDFReportFullProps {
  quizData: QuizData;
  userEmail?: string | null;
}

// Enhanced PDF-optimized version with complete report content
export const PDFReportFull: React.FC<PDFReportFullProps> = ({
  quizData,
  userEmail,
}) => {
  const paths = generatePersonalizedPaths(quizData);
  const topThreePaths = paths.slice(0, 3);
  const userName = userEmail?.split("@")[0] || "User";

  // Calculate trait scores
  const traitScores = {
    socialComfort: calculateSocialComfort(quizData),
    consistency: calculateConsistency(quizData),
    riskTolerance: calculateRiskTolerance(quizData),
    techComfort: calculateTechComfort(quizData),
    motivation: calculateMotivation(quizData),
    feedbackResilience: calculateFeedbackResilience(quizData),
    structurePreference: calculateStructurePreference(quizData),
    creativity: calculateCreativity(quizData),
    communicationConfidence: calculateCommunicationConfidence(quizData),
  };

  const traits = [
    {
      label: "Social Comfort",
      value: traitScores.socialComfort,
      leftLabel: "Prefers Solo Work",
      rightLabel: "Thrives in Groups",
    },
    {
      label: "Consistency",
      value: traitScores.consistency,
      leftLabel: "Flexible Schedule",
      rightLabel: "Routine Focused",
    },
    {
      label: "Risk Tolerance",
      value: traitScores.riskTolerance,
      leftLabel: "Risk Averse",
      rightLabel: "Risk Embracer",
    },
    {
      label: "Tech Comfort",
      value: traitScores.techComfort,
      leftLabel: "Basic Tech Use",
      rightLabel: "Tech Enthusiast",
    },
    {
      label: "Motivation",
      value: traitScores.motivation,
      leftLabel: "External Motivation",
      rightLabel: "Self-Driven",
    },
    {
      label: "Feedback Resilience",
      value: traitScores.feedbackResilience,
      leftLabel: "Sensitive to Criticism",
      rightLabel: "Thrives on Feedback",
    },
    {
      label: "Structure Preference",
      value: traitScores.structurePreference,
      leftLabel: "Flexible Approach",
      rightLabel: "Structured Systems",
    },
    {
      label: "Creativity",
      value: traitScores.creativity,
      leftLabel: "Analytical Focus",
      rightLabel: "Creative Expression",
    },
    {
      label: "Communication Confidence",
      value: traitScores.communicationConfidence,
      leftLabel: "Behind-the-Scenes",
      rightLabel: "Front-and-Center",
    },
  ];

  // Helper functions for data formatting
  const getIncomeRangeLabel = (value: number): string => {
    if (value === 500) return "Less than $500";
    if (value === 1250) return "$500–$2,000";
    if (value === 3500) return "$2,000–$5,000";
    if (value === 7500) return "$5,000+";
    return `$${value?.toLocaleString()}`;
  };

  const getInvestmentRangeLabel = (value: number): string => {
    if (value === 0) return "$0";
    if (value === 125) return "Under $250";
    if (value === 625) return "$250–$1,000";
    if (value === 1500) return "$1,000+";
    return `$${value?.toLocaleString()}`;
  };

  const getTimeCommitmentRangeLabel = (value: number): string => {
    if (value === 3) return "Less than 5 hours";
    if (value === 7) return "5–10 hours";
    if (value === 17) return "10–25 hours";
    if (value === 35) return "25+ hours";
    return `${value} hours`;
  };

  const getTimelineLabel = (value: string): string => {
    const labels: Record<string, string> = {
      "under-1-month": "Under 1 month",
      "1-3-months": "1–3 months",
      "3-6-months": "3–6 months",
      "no-rush": "No rush",
    };
    return labels[value] || value.replace("-", " ");
  };

  return (
    <div className="pdf-report bg-white text-gray-900 min-h-screen font-sans">
      <style>{`
        @media print {
          .pdf-report {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .page-break {
            page-break-before: always;
          }

          .avoid-break {
            page-break-inside: avoid;
          }

          .gradient-bg {
            background: linear-gradient(
              135deg,
              #3b82f6 0%,
              #8b5cf6 100%
            ) !important;
            color: white !important;
          }

          .trait-bar {
            background: linear-gradient(
              90deg,
              #3b82f6 0%,
              #8b5cf6 100%
            ) !important;
          }

          .blue-gradient {
            background: linear-gradient(
              135deg,
              #1e40af 0%,
              #3b82f6 100%
            ) !important;
            color: white !important;
          }

          .purple-gradient {
            background: linear-gradient(
              135deg,
              #7c3aed 0%,
              #a855f7 100%
            ) !important;
            color: white !important;
          }

          .green-gradient {
            background: linear-gradient(
              135deg,
              #059669 0%,
              #10b981 100%
            ) !important;
            color: white !important;
          }

          .no-print {
            display: none !important;
          }
        }

        .gradient-bg {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
        }

        .trait-bar {
          background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
        }

        .blue-gradient {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
        }

        .purple-gradient {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: white;
        }

        .green-gradient {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white;
        }
      `}</style>

      {/* Header */}
      <div className="gradient-bg text-white p-8 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">
              Business Path Analysis Report
            </h1>
            <p className="text-2xl opacity-90 mb-2">
              Personalized Entrepreneurial Blueprint for {userName}
            </p>
            <p className="text-lg opacity-75">
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-center mb-3">
                <Target className="h-8 w-8 mr-2" />
                <span className="font-semibold text-lg">Income Goal</span>
              </div>
              <p className="text-3xl font-bold">
                {getIncomeRangeLabel(quizData.successIncomeGoal)}/month
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-center mb-3">
                <Clock className="h-8 w-8 mr-2" />
                <span className="font-semibold text-lg">Timeline</span>
              </div>
              <p className="text-3xl font-bold">
                {getTimelineLabel(quizData.firstIncomeTimeline)}
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-center mb-3">
                <DollarSign className="h-8 w-8 mr-2" />
                <span className="font-semibold text-lg">Investment</span>
              </div>
              <p className="text-3xl font-bold">
                {getInvestmentRangeLabel(quizData.upfrontInvestment)}
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-center mb-3">
                <Calendar className="h-8 w-8 mr-2" />
                <span className="font-semibold text-lg">Time Commitment</span>
              </div>
              <p className="text-3xl font-bold">
                {getTimeCommitmentRangeLabel(quizData.weeklyTimeCommitment)}
                /week
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 pb-8">
        {/* Executive Summary */}
        <section className="mb-12 avoid-break">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Award className="h-8 w-8 mr-3 text-yellow-500" />
            Executive Summary
          </h2>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-yellow-500" />
                  Your Best Match
                </h3>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="text-2xl font-bold text-blue-600 mb-2">
                    {topThreePaths[0]?.name}
                  </h4>
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
                      {topThreePaths[0]?.fitScore}% MATCH
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {topThreePaths[0]?.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Time to Profit:</span>{" "}
                      {topThreePaths[0]?.timeToProfit}
                    </div>
                    <div>
                      <span className="font-medium">Startup Cost:</span>{" "}
                      {topThreePaths[0]?.startupCost}
                    </div>
                    <div>
                      <span className="font-medium">Difficulty:</span>{" "}
                      {topThreePaths[0]?.difficulty}
                    </div>
                    <div>
                      <span className="font-medium">Income Potential:</span>{" "}
                      {topThreePaths[0]?.potentialIncome}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="h-6 w-6 mr-2 text-blue-500" />
                  Your Profile Highlights
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Primary Motivation
                    </h4>
                    <p className="text-gray-700">
                      {quizData.mainMotivation?.replace("-", " ")}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Work Style
                    </h4>
                    <p className="text-gray-700">
                      {quizData.workCollaborationPreference?.replace("-", " ")}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Structure Preference
                    </h4>
                    <p className="text-gray-700">
                      {quizData.workStructurePreference?.replace("-", " ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Personality Analysis */}
        <section className="mb-12 page-break">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Brain className="h-8 w-8 mr-3 text-purple-600" />
            Your Entrepreneurial Personality Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {traits.map((trait, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl avoid-break"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg text-gray-900">
                    {trait.label}
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.round(trait.value * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="trait-bar h-3 rounded-full transition-all duration-500"
                    style={{ width: `${trait.value * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="text-left">{trait.leftLabel}</span>
                  <span className="text-right">{trait.rightLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Business Recommendations */}
        <section className="mb-12 page-break">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Briefcase className="h-8 w-8 mr-3 text-green-600" />
            Your Top 3 Business Recommendations
          </h2>

          <div className="space-y-8">
            {topThreePaths.map((path, index) => (
              <div key={path.id} className="avoid-break">
                <div className="border-2 border-gray-200 rounded-2xl p-8 bg-white shadow-lg">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mr-6">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {path.name}
                        </h3>
                        <p className="text-gray-600 text-lg">
                          {path.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                      <span className="font-bold text-lg">
                        {path.fitScore}% MATCH
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-900">
                          Time to Profit
                        </span>
                      </div>
                      <p className="font-bold text-lg text-blue-800">
                        {path.timeToProfit}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-900">
                          Startup Cost
                        </span>
                      </div>
                      <p className="font-bold text-lg text-green-800">
                        {path.startupCost}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="font-medium text-purple-900">
                          Income Potential
                        </span>
                      </div>
                      <p className="font-bold text-lg text-purple-800">
                        {path.potentialIncome}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <BarChart3 className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="font-medium text-orange-900">
                          Difficulty
                        </span>
                      </div>
                      <p className="font-bold text-lg text-orange-800">
                        {path.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-green-700 mb-3 flex items-center text-lg">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Key Advantages
                      </h4>
                      <ul className="space-y-2">
                        {path.pros.slice(0, 4).map((pro, i) => (
                          <li
                            key={i}
                            className="flex items-start text-gray-700"
                          >
                            <span className="text-green-500 mr-3 text-lg">
                              •
                            </span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-orange-700 mb-3 flex items-center text-lg">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Considerations
                      </h4>
                      <ul className="space-y-2">
                        {path.cons.slice(0, 4).map((con, i) => (
                          <li
                            key={i}
                            className="flex items-start text-gray-700"
                          >
                            <span className="text-orange-500 mr-3 text-lg">
                              •
                            </span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-blue-700 mb-3 flex items-center text-lg">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {path.skills.slice(0, 8).map((skill, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Plan */}
        <section className="mb-12 page-break">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Map className="h-8 w-8 mr-3 text-indigo-600" />
            Your 90-Day Action Plan
          </h2>

          <div className="space-y-8">
            <div className="avoid-break">
              <div className="blue-gradient p-6 rounded-2xl text-white mb-4">
                <h3 className="text-2xl font-bold mb-2">
                  Week 1: Foundation Building
                </h3>
                <p className="text-blue-100">
                  Establish your entrepreneurial foundation and mindset
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    <span className="text-gray-700">
                      Set up your dedicated workspace and essential tools
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    <span className="text-gray-700">
                      Research your target market and identify competitors
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    <span className="text-gray-700">
                      Create your business plan outline and set SMART goals
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    <span className="text-gray-700">
                      Establish your brand identity and online presence
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="avoid-break">
              <div className="green-gradient p-6 rounded-2xl text-white mb-4">
                <h3 className="text-2xl font-bold mb-2">
                  Month 1: Launch Preparation
                </h3>
                <p className="text-green-100">
                  Build your minimum viable product and test the market
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">•</span>
                    <span className="text-gray-700">
                      Develop your minimum viable product or service offering
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">•</span>
                    <span className="text-gray-700">
                      Create your website and social media profiles
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">•</span>
                    <span className="text-gray-700">
                      Test with initial customers and gather feedback
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">•</span>
                    <span className="text-gray-700">
                      Refine your value proposition based on market response
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="avoid-break">
              <div className="purple-gradient p-6 rounded-2xl text-white mb-4">
                <h3 className="text-2xl font-bold mb-2">
                  Month 2-3: Growth & Optimization
                </h3>
                <p className="text-purple-100">
                  Scale your operations and optimize for profitability
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 text-xl">•</span>
                    <span className="text-gray-700">
                      Launch your marketing campaigns and scale customer
                      acquisition
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 text-xl">•</span>
                    <span className="text-gray-700">
                      Optimize your processes and automate repetitive tasks
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 text-xl">•</span>
                    <span className="text-gray-700">
                      Establish consistent revenue streams and pricing strategy
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 text-xl">•</span>
                    <span className="text-gray-700">
                      Plan for expansion and future growth opportunities
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Key Success Factors */}
        <section className="mb-12 avoid-break">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Zap className="h-8 w-8 mr-3 text-yellow-500" />
            Your Success Strategy
          </h2>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  Focus on Strengths
                </h3>
                <p className="text-gray-700">
                  Leverage your natural abilities in{" "}
                  {quizData.mainMotivation?.replace("-", " ")} to accelerate
                  your success.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  Manage Risks
                </h3>
                <p className="text-gray-700">
                  Start with low-risk validation, build systematically, and
                  scale based on proven results.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  Continuous Learning
                </h3>
                <p className="text-gray-700">
                  Stay adaptable, gather feedback regularly, and iterate based
                  on market response.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 border-t pt-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-2">
                  Visit Our Platform
                </h4>
                <p className="text-blue-700">
                  Access additional tools, resources, and personalized guidance
                  at our main website
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl">
                <h4 className="font-bold text-purple-900 mb-2">
                  Get Full Analysis
                </h4>
                <p className="text-purple-700">
                  Explore your complete business analysis and detailed
                  recommendations online
                </p>
              </div>
            </div>
          </div>
          <div className="text-sm space-y-2">
            <p className="font-medium">
              This personalized report was generated based on your quiz
              responses on {new Date().toLocaleDateString()}
            </p>
            <p>
              © 2024 Business Path Platform - Your Guide to Entrepreneurial
              Success
            </p>
            <p className="text-xs">
              Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Helper functions (same as existing PDFReport)
function calculateSocialComfort(data: QuizData): number {
  let score = 0.5;

  if (data.workCollaborationPreference === "team-focused") score += 0.3;
  else if (data.workCollaborationPreference === "mostly-solo") score -= 0.2;

  if (data.brandFaceComfort && data.brandFaceComfort >= 4) score += 0.2;
  else if (data.brandFaceComfort && data.brandFaceComfort <= 2) score -= 0.2;

  if (
    data.directCommunicationEnjoyment &&
    data.directCommunicationEnjoyment >= 4
  )
    score += 0.1;

  return Math.max(0, Math.min(1, score));
}

function calculateConsistency(data: QuizData): number {
  let score = 0.5;

  if (data.longTermConsistency && data.longTermConsistency >= 4) score += 0.3;
  else if (data.longTermConsistency && data.longTermConsistency <= 2)
    score -= 0.2;

  if (data.systemsRoutinesEnjoyment && data.systemsRoutinesEnjoyment >= 4)
    score += 0.2;
  else if (data.systemsRoutinesEnjoyment && data.systemsRoutinesEnjoyment <= 2)
    score -= 0.2;

  if (data.workStructurePreference === "very-structured") score += 0.2;
  else if (data.workStructurePreference === "very-flexible") score -= 0.2;

  return Math.max(0, Math.min(1, score));
}

function calculateRiskTolerance(data: QuizData): number {
  let score = 0.5;

  if (data.riskComfortLevel && data.riskComfortLevel >= 4) score += 0.3;
  else if (data.riskComfortLevel && data.riskComfortLevel <= 2) score -= 0.3;

  if (data.trialErrorComfort && data.trialErrorComfort >= 4) score += 0.2;
  else if (data.trialErrorComfort && data.trialErrorComfort <= 2) score -= 0.2;

  if (data.upfrontInvestment && data.upfrontInvestment >= 5000) score += 0.1;
  else if (data.upfrontInvestment && data.upfrontInvestment <= 500)
    score -= 0.1;

  return Math.max(0, Math.min(1, score));
}

function calculateTechComfort(data: QuizData): number {
  let score = 0.5;

  if (data.techSkillsRating && data.techSkillsRating >= 4) score += 0.3;
  else if (data.techSkillsRating && data.techSkillsRating <= 2) score -= 0.3;

  if (data.toolLearningWillingness === "yes") score += 0.2;
  else if (data.toolLearningWillingness === "no") score -= 0.3;

  if (data.familiarTools && data.familiarTools.length >= 3) score += 0.1;

  return Math.max(0, Math.min(1, score));
}

function calculateMotivation(data: QuizData): number {
  let score = 0.5;

  if (data.selfMotivationLevel && data.selfMotivationLevel >= 4) score += 0.3;
  else if (data.selfMotivationLevel && data.selfMotivationLevel <= 2)
    score -= 0.3;

  if (data.discouragementResilience && data.discouragementResilience >= 4)
    score += 0.2;
  else if (data.discouragementResilience && data.discouragementResilience <= 2)
    score -= 0.2;

  if (data.mainMotivation === "passion-purpose") score += 0.1;

  return Math.max(0, Math.min(1, score));
}

function calculateFeedbackResilience(data: QuizData): number {
  let score = 0.5;

  if (data.feedbackResilience && data.feedbackResilience >= 4) score += 0.3;
  else if (data.feedbackResilience && data.feedbackResilience <= 2)
    score -= 0.3;

  if (data.discouragementResilience && data.discouragementResilience >= 4)
    score += 0.2;
  else if (data.discouragementResilience && data.discouragementResilience <= 2)
    score -= 0.2;

  if (data.competitivenessLevel && data.competitivenessLevel >= 4) score += 0.1;

  return Math.max(0, Math.min(1, score));
}

function calculateStructurePreference(data: QuizData): number {
  let score = 0.5;

  if (data.workStructurePreference === "very-structured") score += 0.3;
  else if (data.workStructurePreference === "very-flexible") score -= 0.3;

  if (data.systemsRoutinesEnjoyment && data.systemsRoutinesEnjoyment >= 4)
    score += 0.2;
  else if (data.systemsRoutinesEnjoyment && data.systemsRoutinesEnjoyment <= 2)
    score -= 0.2;

  if (data.organizationLevel && data.organizationLevel >= 4) score += 0.2;
  else if (data.organizationLevel && data.organizationLevel <= 2) score -= 0.2;

  return Math.max(0, Math.min(1, score));
}

function calculateCreativity(data: QuizData): number {
  let score = 0.5;

  if (data.creativeWorkEnjoyment && data.creativeWorkEnjoyment >= 4)
    score += 0.3;
  else if (data.creativeWorkEnjoyment && data.creativeWorkEnjoyment <= 2)
    score -= 0.3;

  if (data.passionIdentityAlignment && data.passionIdentityAlignment >= 4)
    score += 0.2;
  else if (data.passionIdentityAlignment && data.passionIdentityAlignment <= 2)
    score -= 0.2;

  if (data.mainMotivation === "passion-purpose") score += 0.1;

  return Math.max(0, Math.min(1, score));
}

function calculateCommunicationConfidence(data: QuizData): number {
  let score = 0.5;

  if (
    data.directCommunicationEnjoyment &&
    data.directCommunicationEnjoyment >= 4
  )
    score += 0.3;
  else if (
    data.directCommunicationEnjoyment &&
    data.directCommunicationEnjoyment <= 2
  )
    score -= 0.3;

  if (data.brandFaceComfort && data.brandFaceComfort >= 4) score += 0.2;
  else if (data.brandFaceComfort && data.brandFaceComfort <= 2) score -= 0.2;

  if (data.workCollaborationPreference === "team-focused") score += 0.1;

  return Math.max(0, Math.min(1, score));
}
