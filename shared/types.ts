// Shared types between client and server
export type QuizData = {
  // Round 1: Motivation & Vision
  mainMotivation:
    | "Financial freedom"
    | "Flexibility and autonomy"
    | "Purpose and impact"
    | "Creativity and passion";
  firstIncomeTimeline:
    | "Under 1 month"
    | "1–3 months"
    | "3–6 months"
    | "No rush";
  successIncomeGoal: number; // e.g., 5000, 10000. Assuming numerical input for $5000+ category.
  upfrontInvestment: "$0" | "Under $250" | "$250–$1,000" | "$1,000+";
  passionIdentityAlignment: 1 | 2 | 3 | 4 | 5;
  sellOrExitBusiness: "Yes" | "No" | "Not sure";
  businessGrowthAmbition:
    | "Just a side income"
    | "Full-time income"
    | "Multi-6-figure brand"
    | "A widely recognized company";
  passiveIncomeImportance: 1 | 2 | 3 | 4 | 5;

  // Round 2: Time, Effort & Learning Style
  hoursPerWeek:
    | "Less than 5 hours"
    | "5–10 hours"
    | "10–25 hours"
    | "25+ hours";
  consistencyWithGoals: 1 | 2 | 3 | 4 | 5;
  trialAndErrorComfort: 1 | 2 | 3 | 4 | 5;
  learningPreference:
    | "Hands-on"
    | "Watching tutorials"
    | "Reading/self-study"
    | "One-on-one coaching";
  systemsRoutinesEnjoyment: 1 | 2 | 3 | 4 | 5;
  discouragementResilience: 1 | 2 | 3 | 4 | 5;
  toolLearningWillingness: "Yes" | "No";

  // Round 3: Personality & Preferences
  organizationLevel: 1 | 2 | 3 | 4 | 5;
  selfMotivation: 1 | 2 | 3 | 4 | 5;
  uncertaintyHandling: 1 | 2 | 3 | 4 | 5;
  repetitiveTaskPreference:
    | "I avoid them"
    | "I tolerate them"
    | "I don't mind them"
    | "I enjoy them";
  workCollaborationPreference:
    | "Solo only"
    | "Mostly solo"
    | "Team-oriented"
    | "I like both";
  brandFaceComfort: 1 | 2 | 3 | 4 | 5;
  competitiveness: 1 | 2 | 3 | 4 | 5;
  creativeWorkEnjoyment: 1 | 2 | 3 | 4 | 5;
  directCommunicationEnjoyment: 1 | 2 | 3 | 4 | 5;
  workStructurePreference:
    | "Clear steps and order"
    | "Some structure"
    | "Mostly flexible"
    | "Total freedom";

  // Round 4: Tools & Work Environment
  techSkillsRating: 1 | 2 | 3 | 4 | 5;
  consistentWorkspace: "Yes" | "No";
  personalSupportSystem:
    | "None"
    | "One or two people"
    | "A small but helpful group"
    | "Very strong support";
  internetAccessReliability: 1 | 2 | 3 | 4 | 5;
  familiarTools: Array<
    | "Google Docs/Sheets"
    | "Canva"
    | "Notion"
    | "Shopify/Wix/Squarespace"
    | "Zoom/StreamYard"
    | "None of the above"
  >;

  // Round 5: Strategy & Decision-Making
  decisionMakingStyle:
    | "Quickly and instinctively"
    | "After some research"
    | "With a logical process"
    | "After talking to others";
  riskComfort: 1 | 2 | 3 | 4 | 5; // Mapped from Q32 (How comfortable are you taking risks?)
  negativeFeedbackResponse: 1 | 2 | 3 | 4 | 5;
  pathCreationPreference:
    | "Proven paths"
    | "A mix"
    | "Mostly original"
    | "I want to build something new";
  controlImportance: 1 | 2 | 3 | 4 | 5;

  // Round 6: Business Model Fit Filters
  faceAndVoiceOnlineComfort: "Yes" | "No";
  clientCallComfort: "Yes" | "No";
  physicalProductShipping: "Yes" | "No";
  createEarnWorkConsistently:
    | "Create once, earn passively"
    | "Work consistently with people"
    | "Mix of both";
  socialMediaInterest: 1 | 2 | 3 | 4 | 5;
  platformEcosystemInterest: "Yes" | "No" | "Maybe";
  hasAudience:
    | "Yes, highly engaged"
    | "Yes, but small"
    | "No"
    | "Just starting";
  promoteOthersProducts: "Yes" | "No";
  teachOrSolve: "Teach" | "Solve" | "Both" | "Neither";
  meaningfulContributionImportance: 1 | 2 | 3 | 4 | 5;

  // Legacy compatibility fields - keeping for backward compatibility with existing quiz data
  businessExitPlan?: string;
  businessGrowthSize?: string;
  weeklyTimeCommitment?: number;
  longTermConsistency?: number;
  trialErrorComfort?: number;
  selfMotivationLevel?: number;
  repetitiveTasksFeeling?: string;
  competitivenessLevel?: number;
  workspaceAvailability?: string;
  supportSystemStrength?: string;
  internetDeviceReliability?: number;
  riskComfortLevel?: number;
  feedbackRejectionResponse?: number;
  pathPreference?: string;
  onlinePresenceComfort?: string;
  clientCallsComfort?: string;
  physicalShippingOpenness?: string;
  workStylePreference?: string;
  incomeGoal?: number;
  timeToFirstIncome?: string;
  startupBudget?: number;
  timeCommitment?: number;
  technologyComfort?: number;
  selfMotivation?: number;
  riskTolerance?: number;
  teachVsSolvePreference?: string;
  socialMediaInterest?: number;
  existingSkills?: string[];
  authorityComfort?: number;
};

export interface BusinessPath {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  fitScore: number;
  difficulty: "Easy" | "Medium" | "Hard";
  timeToProfit: string;
  startupCost: string;
  potentialIncome: string;
  pros: string[];
  cons: string[];
  tools: string[];
  skills: string[];
  icon: string;
  marketSize: string;
  averageIncome: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  userStruggles: string[];
  solutions: string[];
  bestFitPersonality: string[];
  resources: {
    platforms: string[];
    learning: string[];
    tools: string[];
  };
  actionPlan: {
    phase1: string[];
    phase2: string[];
    phase3: string[];
  };
  aiAnalysis?: BusinessFitAnalysis;
}

export interface BusinessFitAnalysis {
  fitScore: number;
  reasoning: string;
  strengths: string[];
  challenges: string[];
  confidence: number;
}
