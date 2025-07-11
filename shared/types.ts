// Shared types between client and server
export interface QuizData {
  // Round 1: Motivation & Vision
  mainMotivation: string;
  firstIncomeTimeline: string;
  successIncomeGoal: number;
  upfrontInvestment: number;
  passionIdentityAlignment: number;
  businessExitPlan: string;
  businessGrowthSize: string;
  passiveIncomeImportance: number;
  
  // Round 2: Time, Effort & Learning Style
  weeklyTimeCommitment: number;
  longTermConsistency: number;
  trialErrorComfort: number;
  learningPreference: string;
  systemsRoutinesEnjoyment: number;
  discouragementResilience: number;
  toolLearningWillingness: string;
  organizationLevel: number;
  selfMotivationLevel: number;
  uncertaintyHandling: number;
  repetitiveTasksFeeling: string;
  workCollaborationPreference: string;
  
  // Round 3: Personality & Preferences
  brandFaceComfort: number;
  competitivenessLevel: number;
  creativeWorkEnjoyment: number;
  directCommunicationEnjoyment: number;
  workStructurePreference: string;
  
  // Round 4: Tools & Work Environment
  techSkillsRating: number;
  workspaceAvailability: string;
  supportSystemStrength: string;
  internetDeviceReliability: number;
  familiarTools: string[];
  
  // Round 5: Strategy & Decision-Making
  decisionMakingStyle: string;
  riskComfortLevel: number;
  feedbackRejectionResponse: number;
  pathPreference: string;
  controlImportance: number;
  
  // Round 6: Business Model Fit Filters
  onlinePresenceComfort: string;
  clientCallsComfort: string;
  physicalShippingOpenness: string;
  workStylePreference: string;

  // Optional legacy fields
  incomeGoal?: number;
  timeToFirstIncome?: string;
  startupBudget?: number;
  timeCommitment?: number;
  technologyComfort?: number;
  selfMotivation?: number;
  riskTolerance?: number;
  teachVsSolvePreference?: string;
  meaningfulContributionImportance?: number;
  socialMediaInterest?: number;
  existingSkills?: string[];
  authorityComfort?: number;
}

export interface BusinessPath {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  fitScore: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
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