// types.ts (Place this in your types.ts file, or at the top of this file if you prefer)
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
};

// Main Scoring Logic File

// import type { QuizData } from './types'; // Uncomment this line if QuizData is in a separate types.ts file

// 23 Core Trait Dimensions with weights - REFINED WEIGHTS and ALIGNED WITH QUIZ QUESTIONS
// These weights indicate the importance of each trait in the overall business model fit.
export const TRAIT_WEIGHTS = {
  // Core Business Traits
  incomeAmbition: 1.5, // From Q3 (monthly income) & Q7 (growth ambition)
  speedToIncome: 1.3, // From Q2 (earn first $100)
  upfrontInvestmentTolerance: 1.0, // From Q4 (money willing to invest)
  passiveIncomePreference: 1.4, // From Q8 (importance of long-term passive income)
  businessExitStrategy: 0.5, // From Q6 (sell or exit) - Lower weight as it's a long-term vision
  meaningfulContributionImportance: 1.0, // From Q45

  // Personal Work Style & Resilience
  passionAlignment: 1.3, // From Q5 (identity/passion reflection)
  timeCommitment: 1.2, // From Q9 (hours per week)
  consistencyAndFollowThrough: 1.1, // From Q10 (consistency)
  riskTolerance: 1.4, // From Q11 (trial and error) & Q32 (taking risks) & Q14 (discouragement)
  systemsThinking: 1.0, // From Q13 (enjoy building routines/systems) & Q16 (organized)
  toolLearning: 0.9, // From Q15 (willingness to learn tools)
  autonomyControl: 1.1, // From Q17 (self-motivated) & Q35 (control of decisions)
  structurePreference: 0.8, // From Q18 (uncertainty) & Q25 (structure preference)
  repetitionTolerance: 0.7, // From Q19 (repetitive tasks)
  adaptabilityToFeedback: 0.8, // From Q33 (negative feedback)
  originalityPreference: 0.9, // From Q34 (proven paths vs creating own)

  // Interaction & Marketing Style
  salesConfidence: 1.1, // From Q24 (direct communication enjoyment)
  creativeInterest: 1.0, // From Q23 (creative work enjoyment)
  socialMediaComfort: 1.0, // From Q21 (face of brand) & Q36 (face/voice online) & Q40 (social media interest)
  productVsService: 0.9, // From Q39 (create once/passive vs work with people) & Q38 (physical products)
  teachingVsSolving: 0.8, // From Q44 (teach vs solve)
  platformEcosystemComfort: 0.7, // From Q41 (ecosystem interest)
  collaborationPreference: 0.8, // From Q20 (solo vs collaborating)
  promoteOthersWillingness: 0.5, // From Q43 (promote others products) - Lower weight as it's specific
  technicalComfort: 1.0, // From Q26 (tech skills)
};

// Business Model Ideal Profiles (0-1 scale) - **YOU MUST COMPLETE ALL 18 MODELS HERE**
// Ensure all 23 traits from TRAIT_WEIGHTS are represented for each model.
export const BUSINESS_MODEL_PROFILES = {
  freelancing: {
    incomeAmbition: 0.4,
    speedToIncome: 0.9,
    upfrontInvestmentTolerance: 0.8,
    passiveIncomePreference: 0.1,
    businessExitStrategy: 0.2,
    meaningfulContributionImportance: 0.7,

    passionAlignment: 0.7,
    timeCommitment: 0.7,
    consistencyAndFollowThrough: 0.8,
    riskTolerance: 0.6,
    systemsThinking: 0.5,
    toolLearning: 0.7,
    autonomyControl: 1.0,
    structurePreference: 0.6,
    repetitionTolerance: 0.5,
    adaptabilityToFeedback: 0.7,
    originalityPreference: 0.7,

    salesConfidence: 0.8,
    creativeInterest: 0.7,
    socialMediaComfort: 0.4,
    productVsService: 0.1,
    teachingVsSolving: 0.6,
    platformEcosystemComfort: 0.4,
    collaborationPreference: 0.8,
    promoteOthersWillingness: 0.3,
    technicalComfort: 0.6,
  },
  "online-tutoring": {
    incomeAmbition: 0.5,
    speedToIncome: 0.7,
    upfrontInvestmentTolerance: 0.9,
    passiveIncomePreference: 0.2,
    businessExitStrategy: 0.1,
    meaningfulContributionImportance: 0.9,

    passionAlignment: 0.8,
    timeCommitment: 0.6,
    consistencyAndFollowThrough: 0.7,
    riskTolerance: 0.5,
    systemsThinking: 0.6,
    toolLearning: 0.6,
    autonomyControl: 0.8,
    structurePreference: 0.7,
    repetitionTolerance: 0.7,
    adaptabilityToFeedback: 0.8,
    originalityPreference: 0.4,

    salesConfidence: 0.9,
    creativeInterest: 0.4,
    socialMediaComfort: 0.9,
    productVsService: 0.0,
    teachingVsSolving: 1.0,
    platformEcosystemComfort: 0.8,
    collaborationPreference: 0.6,
    promoteOthersWillingness: 0.1,
    technicalComfort: 0.5,
  },
  "e-commerce": {
    incomeAmbition: 0.9,
    speedToIncome: 0.4,
    upfrontInvestmentTolerance: 0.6,
    passiveIncomePreference: 0.6,
    businessExitStrategy: 0.9,
    meaningfulContributionImportance: 0.5,

    passionAlignment: 0.8,
    timeCommitment: 0.8,
    consistencyAndFollowThrough: 0.9,
    riskTolerance: 0.8,
    systemsThinking: 0.8,
    toolLearning: 0.8,
    autonomyControl: 0.9,
    structurePreference: 0.6,
    repetitionTolerance: 0.7,
    adaptabilityToFeedback: 0.7,
    originalityPreference: 0.8,

    salesConfidence: 0.6,
    creativeInterest: 0.9,
    socialMediaComfort: 0.7,
    productVsService: 0.9,
    teachingVsSolving: 0.2,
    platformEcosystemComfort: 0.8,
    collaborationPreference: 0.7,
    promoteOthersWillingness: 0.4,
    technicalComfort: 0.7,
  },
  "content-creation": {
    incomeAmbition: 0.8,
    speedToIncome: 0.6,
    upfrontInvestmentTolerance: 0.8,
    passiveIncomePreference: 0.5,
    businessExitStrategy: 0.7,
    meaningfulContributionImportance: 0.9,

    passionAlignment: 0.9,
    timeCommitment: 0.8,
    consistencyAndFollowThrough: 0.9,
    riskTolerance: 0.7,
    systemsThinking: 0.6,
    toolLearning: 0.7,
    autonomyControl: 0.9,
    structurePreference: 0.4,
    repetitionTolerance: 0.6,
    adaptabilityToFeedback: 0.8,
    originalityPreference: 0.9,

    salesConfidence: 0.7,
    creativeInterest: 1.0,
    socialMediaComfort: 1.0,
    productVsService: 0.7,
    teachingVsSolving: 0.4,
    platformEcosystemComfort: 0.5,
    collaborationPreference: 0.8,
    promoteOthersWillingness: 0.7,
    technicalComfort: 0.7,
  },
  "youtube-automation": {
    incomeAmbition: 0.8,
    speedToIncome: 0.5,
    upfrontInvestmentTolerance: 0.7,
    passiveIncomePreference: 0.7,
    businessExitStrategy: 0.8,
    meaningfulContributionImportance: 0.3,

    passionAlignment: 0.7,
    timeCommitment: 0.8,
    consistencyAndFollowThrough: 0.8,
    riskTolerance: 0.6,
    systemsThinking: 0.7,
    toolLearning: 0.8,
    autonomyControl: 0.8,
    structurePreference: 0.5,
    repetitionTolerance: 0.7,
    adaptabilityToFeedback: 0.6,
    originalityPreference: 0.7,

    salesConfidence: 0.4,
    creativeInterest: 0.9,
    socialMediaComfort: 0.4,
    productVsService: 0.8,
    teachingVsSolving: 0.3,
    platformEcosystemComfort: 0.7,
    collaborationPreference: 0.9,
    promoteOthersWillingness: 0.6,
    technicalComfort: 0.8,
  },
  "local-service": {
    incomeAmbition: 0.6,
    speedToIncome: 0.6,
    upfrontInvestmentTolerance: 0.5,
    passiveIncomePreference: 0.4,
    businessExitStrategy: 0.6,
    meaningfulContributionImportance: 0.5,

    passionAlignment: 0.5,
    timeCommitment: 0.7,
    consistencyAndFollowThrough: 0.7,
    riskTolerance: 0.5,
    systemsThinking: 0.6,
    toolLearning: 0.4,
    autonomyControl: 0.8,
    structurePreference: 0.7,
    repetitionTolerance: 0.6,
    adaptabilityToFeedback: 0.7,
    originalityPreference: 0.3,

    salesConfidence: 0.8,
    creativeInterest: 0.4,
    socialMediaComfort: 0.8,
    productVsService: 0.3,
    teachingVsSolving: 0.2,
    platformEcosystemComfort: 0.3,
    collaborationPreference: 0.7,
    promoteOthersWillingness: 0.2,
    technicalComfort: 0.3,
  },
  "high-ticket-sales": {
    incomeAmbition: 0.7,
    speedToIncome: 0.8,
    upfrontInvestmentTolerance: 0.8,
    passiveIncomePreference: 0.3,
    businessExitStrategy: 0.4,
    meaningfulContributionImportance: 0.6,

    passionAlignment: 0.6,
    timeCommitment: 0.8,
    consistencyAndFollowThrough: 0.9,
    riskTolerance: 0.7,
    systemsThinking: 0.7,
    toolLearning: 0.5,
    autonomyControl: 0.9,
    structurePreference: 0.8,
    repetitionTolerance: 0.8,
    adaptabilityToFeedback: 0.9,
    originalityPreference: 0.5,

    salesConfidence: 1.0,
    creativeInterest: 0.6,
    socialMediaComfort: 1.0,
    productVsService: 0.1,
    teachingVsSolving: 0.3,
    platformEcosystemComfort: 0.5,
    collaborationPreference: 0.8,
    promoteOthersWillingness: 0.4,
    technicalComfort: 0.4,
  },
  "saas-development": {
    incomeAmbition: 1.0,
    speedToIncome: 0.2,
    upfrontInvestmentTolerance: 0.4,
    passiveIncomePreference: 0.8,
    businessExitStrategy: 1.0,
    meaningfulContributionImportance: 0.9,

    passionAlignment: 0.9,
    timeCommitment: 0.9,
    consistencyAndFollowThrough: 1.0,
    riskTolerance: 0.9,
    systemsThinking: 1.0,
    toolLearning: 0.9,
    autonomyControl: 1.0,
    structurePreference: 0.7,
    repetitionTolerance: 0.7,
    adaptabilityToFeedback: 0.9,
    originalityPreference: 1.0,

    salesConfidence: 0.3,
    creativeInterest: 0.8,
    socialMediaComfort: 0.3,
    productVsService: 1.0,
    teachingVsSolving: 0.1,
    platformEcosystemComfort: 0.9,
    collaborationPreference: 0.8,
    promoteOthersWillingness: 0.2,
    technicalComfort: 1.0,
  },
  "social-media-agency": {
    incomeAmbition: 0.8,
    speedToIncome: 0.6,
    upfrontInvestmentTolerance: 0.7,
    passiveIncomePreference: 0.4,
    businessExitStrategy: 0.7,
    meaningfulContributionImportance: 0.7,

    passionAlignment: 0.7,
    timeCommitment: 0.7,
    consistencyAndFollowThrough: 0.8,
    riskTolerance: 0.6,
    systemsThinking: 0.7,
    toolLearning: 0.8,
    autonomyControl: 0.9,
    structurePreference: 0.6,
    repetitionTolerance: 0.6,
    adaptabilityToFeedback: 0.8,
    originalityPreference: 0.7,

    salesConfidence: 0.9,
    creativeInterest: 0.8,
    socialMediaComfort: 0.9,
    productVsService: 0.2,
    teachingVsSolving: 0.3,
    platformEcosystemComfort: 0.6,
    collaborationPreference: 0.6,
    promoteOthersWillingness: 0.5,
    technicalComfort: 0.8,
  },
  "ai-marketing-agency": {
    incomeAmbition: 0.9,
    speedToIncome: 0.5,
    upfrontInvestmentTolerance: 0.7,
    passiveIncomePreference: 0.6,
    businessExitStrategy: 0.8,
    meaningfulContributionImportance: 0.7,

    passionAlignment: 0.7,
    timeCommitment: 0.8,
    consistencyAndFollowThrough: 0.9,
    riskTolerance: 0.7,
    systemsThinking: 0.8,
    toolLearning: 0.9,
    autonomyControl: 1.0,
    structurePreference: 0.7,
    repetitionTolerance: 0.6,
    adaptabilityToFeedback: 0.8,
    originalityPreference: 0.7,

    salesConfidence: 0.7,
    creativeInterest: 0.7,
    socialMediaComfort: 0.7,
    productVsService: 0.3,
    teachingVsSolving: 0.3,
    platformEcosystemComfort: 0.7,
    collaborationPreference: 0.7,
    promoteOthersWillingness: 0.6,
    technicalComfort: 1.0,
  },
  "digital-services": {
    incomeAmbition: 0.8,
    speedToIncome: 0.7,
    upfrontInvestmentTolerance: 0.8,
    passiveIncomePreference: 0.3,
    businessExitStrategy: 0.7,
    meaningfulContributionImportance: 0.6,

    passionAlignment: 0.6,
    timeCommitment: 0.7,
    consistencyAndFollowThrough: 0.8,
    riskTolerance: 0.6,
    systemsThinking: 0.8,
    toolLearning: 0.7,
    autonomyControl: 1.0,
    structurePreference: 0.7,
    repetitionTolerance: 0.6,
    adaptabilityToFeedback: 0.8,
    originalityPreference: 0.6,

    salesConfidence: 0.6,
    creativeInterest: 0.6,
    socialMediaComfort: 0.6,
    productVsService: 0.2,
    teachingVsSolving: 0.2,
    platformEcosystemComfort: 0.5,
    collaborationPreference: 0.6,
    promoteOthersWillingness: 0.4,
    technicalComfort: 0.7,
  },
  "investing-trading": {
    incomeAmbition: 0.7,
    speedToIncome: 0.9,
    upfrontInvestmentTolerance: 0.1,
    passiveIncomePreference: 0.8,
    businessExitStrategy: 0.2,
    meaningfulContributionImportance: 0.4,

    passionAlignment: 0.4,
    timeCommitment: 0.9,
    consistencyAndFollowThrough: 0.6,
    riskTolerance: 1.0,
    systemsThinking: 0.6,
    toolLearning: 0.8,
    autonomyControl: 1.0,
    structurePreference: 0.4,
    repetitionTolerance: 0.8,
    adaptabilityToFeedback: 0.7,
    originalityPreference: 0.2,

    salesConfidence: 0.2,
    creativeInterest: 0.2,
    socialMediaComfort: 0.2,
    productVsService: 1.0,
    teachingVsSolving: 0.0,
    platformEcosystemComfort: 0.6,
    collaborationPreference: 0.1,
    promoteOthersWillingness: 0.0,
    technicalComfort: 0.7,
  },
  "online-reselling": {
    incomeAmbition: 0.4,
    speedToIncome: 0.8,
    upfrontInvestmentTolerance: 0.3,
    passiveIncomePreference: 0.3,
    businessExitStrategy: 0.5,
    meaningfulContributionImportance: 0.5,

    passionAlignment: 0.5,
    timeCommitment: 0.7,
    consistencyAndFollowThrough: 0.7,
    riskTolerance: 0.4,
    systemsThinking: 0.5,
    toolLearning: 0.4,
    autonomyControl: 0.9,
    structurePreference: 0.6,
    repetitionTolerance: 0.8,
    adaptabilityToFeedback: 0.6,
    originalityPreference: 0.5,

    salesConfidence: 0.3,
    creativeInterest: 0.5,
    socialMediaComfort: 0.3,
    productVsService: 0.9,
    teachingVsSolving: 0.1,
    platformEcosystemComfort: 0.5,
    collaborationPreference: 0.9,
    promoteOthersWillingness: 0.2,
    technicalComfort: 0.4,
  },
  "handmade-goods": {
    incomeAmbition: 0.3,
    speedToIncome: 0.4,
    upfrontInvestmentTolerance: 0.3,
    passiveIncomePreference: 0.2,
    businessExitStrategy: 0.3,
    meaningfulContributionImportance: 1.0,

    passionAlignment: 1.0,
    timeCommitment: 0.6,
    consistencyAndFollowThrough: 0.8,
    riskTolerance: 0.3,
    systemsThinking: 0.3,
    toolLearning: 0.3,
    autonomyControl: 1.0,
    structurePreference: 0.5,
    repetitionTolerance: 0.6,
    adaptabilityToFeedback: 0.5,
    originalityPreference: 0.9,

    salesConfidence: 0.2,
    creativeInterest: 1.0,
    socialMediaComfort: 0.2,
    productVsService: 0.9,
    teachingVsSolving: 0.1,
    platformEcosystemComfort: 0.3,
    collaborationPreference: 0.9,
    promoteOthersWillingness: 0.1,
    technicalComfort: 0.3,
  },
  copywriting: {
    incomeAmbition: 0.5,
    speedToIncome: 0.6,
    upfrontInvestmentTolerance: 0.8,
    passiveIncomePreference: 0.3,
    businessExitStrategy: 0.4,
    meaningfulContributionImportance: 0.8,

    passionAlignment: 0.8,
    timeCommitment: 0.6,
    consistencyAndFollowThrough: 0.7,
    riskTolerance: 0.5,
    systemsThinking: 0.6,
    toolLearning: 0.6,
    autonomyControl: 1.0,
    structurePreference: 0.7,
    repetitionTolerance: 0.7,
    adaptabilityToFeedback: 0.8,
    originalityPreference: 0.9,

    salesConfidence: 0.4,
    creativeInterest: 0.9,
    socialMediaComfort: 0.3,
    productVsService: 0.1,
    teachingVsSolving: 0.2,
    platformEcosystemComfort: 0.6,
    collaborationPreference: 1.0,
    promoteOthersWillingness: 0.3,
    technicalComfort: 0.5,
  },
  "affiliate-marketing": {
    incomeAmbition: 0.8,
    speedToIncome: 0.7,
    upfrontInvestmentTolerance: 0.7,
    passiveIncomePreference: 0.7,
    businessExitStrategy: 0.8,
    meaningfulContributionImportance: 0.6,

    passionAlignment: 0.6,
    timeCommitment: 0.7,
    consistencyAndFollowThrough: 0.8,
    riskTolerance: 0.7,
    systemsThinking: 0.7,
    toolLearning: 0.8,
    autonomyControl: 0.8,
    structurePreference: 0.6,
    repetitionTolerance: 0.6,
    adaptabilityToFeedback: 0.7,
    originalityPreference: 0.8,

    salesConfidence: 0.7,
    creativeInterest: 0.8,
    socialMediaComfort: 0.7,
    productVsService: 0.8,
    teachingVsSolving: 0.2,
    platformEcosystemComfort: 0.7,
    collaborationPreference: 0.9,
    promoteOthersWillingness: 1.0,
    technicalComfort: 0.7,
  },
  "virtual-assistant": {
    incomeAmbition: 0.4,
    speedToIncome: 0.8,
    upfrontInvestmentTolerance: 0.9,
    passiveIncomePreference: 0.2,
    businessExitStrategy: 0.1,
    meaningfulContributionImportance: 0.5,

    passionAlignment: 0.5,
    timeCommitment: 0.7,
    consistencyAndFollowThrough: 0.8,
    riskTolerance: 0.5,
    systemsThinking: 0.7,
    toolLearning: 0.6,
    autonomyControl: 0.7,
    structurePreference: 0.8,
    repetitionTolerance: 0.8,
    adaptabilityToFeedback: 0.7,
    originalityPreference: 0.4,

    salesConfidence: 0.7,
    creativeInterest: 0.4,
    socialMediaComfort: 0.7,
    productVsService: 0.0,
    teachingVsSolving: 0.1,
    platformEcosystemComfort: 0.4,
    collaborationPreference: 0.7,
    promoteOthersWillingness: 0.3,
    technicalComfort: 0.5,
  },
};

// STEP 2: Normalize User Answers (Convert to 0-1 scale)
export function normalizeUserResponses(data: QuizData): Record<string, number> {
  const normalized: Record<string, number> = {};

  const normalizeFivePointScale = (value: number) => (value - 1) / 4; // Converts 1-5 to 0-1

  // === Core Business Traits ===

  // incomeAmbition (Q3, Q7)
  const numericalIncomeGoal = data.successIncomeGoal;
  // Cap at a reasonable high for normalization, e.g., $15,000 (monthly for $5000+ category)
  const scaledIncome =
    Math.min(Math.max(numericalIncomeGoal, 0), 15000) / 15000;

  const growthAmbitionMapping: Record<string, number> = {
    "Just a side income": 0.2,
    "Full-time income": 0.5,
    "Multi-6-figure brand": 0.8,
    "A widely recognized company": 1.0,
  };
  normalized.incomeAmbition =
    (scaledIncome + growthAmbitionMapping[data.businessGrowthAmbition]) / 2;

  // speedToIncome (Q2)
  const firstIncomeMapping: Record<string, number> = {
    "Under 1 month": 1.0,
    "1–3 months": 0.7,
    "3–6 months": 0.4,
    "No rush": 0.1,
  };
  normalized.speedToIncome = firstIncomeMapping[data.firstIncomeTimeline];

  // upfrontInvestmentTolerance (Q4)
  const investmentMapping: Record<string, number> = {
    $0: 0.0,
    "Under $250": 0.25,
    "$250–$1,000": 0.6,
    "$1,000+": 1.0,
  };
  normalized.upfrontInvestmentTolerance =
    investmentMapping[data.upfrontInvestment];

  // passiveIncomePreference (Q8)
  normalized.passiveIncomePreference = normalizeFivePointScale(
    data.passiveIncomeImportance,
  );

  // businessExitStrategy (Q6)
  const exitMapping: Record<string, number> = {
    Yes: 1.0,
    No: 0.0,
    "Not sure": 0.5,
  };
  normalized.businessExitStrategy = exitMapping[data.sellOrExitBusiness];

  // meaningfulContributionImportance (Q45)
  normalized.meaningfulContributionImportance = normalizeFivePointScale(
    data.meaningfulContributionImportance,
  );

  // === Personal Work Style & Resilience ===

  // passionAlignment (Q5)
  normalized.passionAlignment = normalizeFivePointScale(
    data.passionIdentityAlignment,
  );

  // timeCommitment (Q9)
  const hoursMapping: Record<string, number> = {
    "Less than 5 hours": 0.1,
    "5–10 hours": 0.4,
    "10–25 hours": 0.7,
    "25+ hours": 1.0,
  };
  normalized.timeCommitment = hoursMapping[data.hoursPerWeek];

  // consistencyAndFollowThrough (Q10)
  normalized.consistencyAndFollowThrough = normalizeFivePointScale(
    data.consistencyWithGoals,
  );

  // riskTolerance (Q11, Q14, Q32) - Combine these three for a holistic view
  const trialErrorScale = normalizeFivePointScale(data.trialAndErrorComfort);
  const discouragementScale = normalizeFivePointScale(
    data.discouragementResilience,
  );
  const riskComfortScale = normalizeFivePointScale(data.riskComfort);
  normalized.riskTolerance =
    (trialErrorScale + discouragementScale + riskComfortScale) / 3;

  // systemsThinking (Q13, Q16)
  normalized.systemsThinking =
    (normalizeFivePointScale(data.systemsRoutinesEnjoyment) +
      normalizeFivePointScale(data.organizationLevel)) /
    2;

  // toolLearning (Q15)
  const toolWillingnessMapping: Record<string, number> = { Yes: 1.0, No: 0.0 };
  normalized.toolLearning =
    toolWillingnessMapping[data.toolLearningWillingness];

  // autonomyControl (Q17, Q35)
  normalized.autonomyControl =
    (normalizeFivePointScale(data.selfMotivation) +
      normalizeFivePointScale(data.controlImportance)) /
    2;

  // structurePreference (Q18, Q25)
  // Q18: 1=need clear (0 structure) -> 5=adapt easily (1 structure) (inverted for "structure preference")
  const uncertaintyHandlingNormalized =
    1 - normalizeFivePointScale(data.uncertaintyHandling); // Invert: High uncertainty handling means low preference for clear steps
  const structurePrefMapping: Record<string, number> = {
    "Clear steps and order": 1.0,
    "Some structure": 0.7,
    "Mostly flexible": 0.4,
    "Total freedom": 0.1,
  };
  normalized.structurePreference =
    (uncertaintyHandlingNormalized +
      structurePrefMapping[data.workStructurePreference]) /
    2;

  // repetitionTolerance (Q19)
  const repetitiveMapping: Record<string, number> = {
    "I avoid them": 0.0,
    "I tolerate them": 0.3,
    "I don't mind them": 0.7,
    "I enjoy them": 1.0,
  };
  normalized.repetitionTolerance =
    repetitiveMapping[data.repetitiveTaskPreference];

  // adaptabilityToFeedback (Q33)
  normalized.adaptabilityToFeedback = normalizeFivePointScale(
    data.negativeFeedbackResponse,
  );

  // originalityPreference (Q34)
  const originalityMapping: Record<string, number> = {
    "Proven paths": 0.0,
    "A mix": 0.5,
    "Mostly original": 0.8,
    "I want to build something new": 1.0,
  };
  normalized.originalityPreference =
    originalityMapping[data.pathCreationPreference];

  // === Interaction & Marketing Style ===

  // salesConfidence (Q24)
  normalized.salesConfidence = normalizeFivePointScale(
    data.directCommunicationEnjoyment,
  );

  // creativeInterest (Q23)
  normalized.creativeInterest = normalizeFivePointScale(
    data.creativeWorkEnjoyment,
  );

  // socialMediaComfort (Q21, Q36, Q40)
  const brandFaceComfortScaled = normalizeFivePointScale(data.brandFaceComfort);
  const faceVoiceOnlineComfortScaled =
    data.faceAndVoiceOnlineComfort === "Yes" ? 1.0 : 0.0;
  const socialMediaInterestScaled = normalizeFivePointScale(
    data.socialMediaInterest,
  );
  normalized.socialMediaComfort =
    (brandFaceComfortScaled +
      faceVoiceOnlineComfortScaled +
      socialMediaInterestScaled) /
    3;

  // productVsService (Q38, Q39)
  const physicalProductPreference =
    data.physicalProductShipping === "Yes" ? 1.0 : 0.0; // 1 for product-oriented, 0 for service-oriented
  const createEarnWorkConsistentlyMapping: Record<string, number> = {
    "Create once, earn passively": 1.0, // Leans towards product/digital product
    "Work consistently with people": 0.0, // Leans towards service
    "Mix of both": 0.5,
  };
  normalized.productVsService =
    (physicalProductPreference +
      createEarnWorkConsistentlyMapping[data.createEarnWorkConsistently]) /
    2;

  // teachingVsSolving (Q44)
  const teachSolveMapping: Record<string, number> = {
    Teach: 1.0,
    Solve: 0.0,
    Both: 0.5,
    Neither: 0.25, // Slightly less engagement if neither
  };
  normalized.teachingVsSolving = teachSolveMapping[data.teachOrSolve];

  // platformEcosystemComfort (Q41)
  const platformInterestMapping: Record<string, number> = {
    Yes: 1.0,
    No: 0.0,
    Maybe: 0.5,
  };
  normalized.platformEcosystemComfort =
    platformInterestMapping[data.platformEcosystemInterest];

  // collaborationPreference (Q20)
  const collabMapping: Record<string, number> = {
    "Solo only": 1.0,
    "Mostly solo": 0.8,
    "I like both": 0.5,
    "Team-oriented": 0.2,
  };
  normalized.collaborationPreference =
    collabMapping[data.workCollaborationPreference];

  // promoteOthersWillingness (Q43)
  normalized.promoteOthersWillingness =
    data.promoteOthersProducts === "Yes" ? 1.0 : 0.0;

  // technicalComfort (Q26)
  normalized.technicalComfort = normalizeFivePointScale(data.techSkillsRating);

  return normalized;
}

// STEP 4: Calculate Match Score
export function calculateBusinessModelMatch(
  userProfile: Record<string, number>,
  businessProfile: Record<string, number>,
): number {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  // Iterate over the TRAIT_WEIGHTS to ensure all weighted traits are considered
  for (const trait in TRAIT_WEIGHTS) {
    if (TRAIT_WEIGHTS.hasOwnProperty(trait)) {
      const userScore = userProfile[trait] || 0; // Default to 0 if trait missing in user profile
      const modelIdeal =
        businessProfile[
          trait as keyof typeof BUSINESS_MODEL_PROFILES.freelancing
        ] || 0; // Ensure modelIdeal is accessed correctly
      const weight = TRAIT_WEIGHTS[trait as keyof typeof TRAIT_WEIGHTS]; // Get weight from TRAIT_WEIGHTS

      // Calculate similarity (1 - absolute difference)
      const similarity = 1 - Math.abs(userScore - modelIdeal);

      totalWeightedScore += similarity * weight;
      totalWeight += weight;
    }
  }

  // Return percentage
  return totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;
}

// Helper for dynamic thresholds
const categoryThresholds = {
  "Best Fit": (max: number) => max * 0.9,
  "Strong Fit": (max: number) => max * 0.7,
  "Possible Fit": (max: number) => max * 0.4,
  "Poor Fit": (max: number) => 0, // Always a poor fit if below possible
};

// STEP 3: Categorize scores - REVISED for more dynamic thresholds
export function getCategoryFromScore(score: number, maxScore: number): string {
  if (score >= categoryThresholds["Best Fit"](maxScore)) return "Best Fit";
  if (score >= categoryThresholds["Strong Fit"](maxScore)) return "Strong Fit";
  if (score >= categoryThresholds["Possible Fit"](maxScore))
    return "Possible Fit";
  return "Poor Fit";
}

// Assignment function to ensure a good distribution of categories
export function assignCategories(
  results: Array<{
    id: string;
    name: string;
    score: number;
    category: string; // This will be initially empty and then set
  }>,
): Array<{
  id: string;
  name: string;
  score: number;
  category: string;
}> {
  // Sort by score (highest first)
  const sortedResults = [...results].sort((a, b) => b.score - a.score);

  // Get the highest score from the sorted results
  const maxScore = sortedResults.length > 0 ? sortedResults[0].score : 0;

  // Define limits for categories (optional, adjust as needed for display balance)
  const categoryLimits: Record<string, number> = {
    "Best Fit": 3,
    "Strong Fit": 6,
    "Possible Fit": 5,
    "Poor Fit": Infinity, // No limit for poor fit
  };

  const categoryCounts: Record<string, number> = {
    "Best Fit": 0,
    "Strong Fit": 0,
    "Possible Fit": 0,
    "Poor Fit": 0,
  };

  const finalCategorizedResults: Array<{
    id: string;
    name: string;
    score: number;
    category: string;
  }> = [];

  for (const result of sortedResults) {
    let assignedCategory = "Poor Fit"; // Default to Poor Fit if no other category fits

    // Try to assign the highest possible category based on dynamic thresholds and limits
    if (
      result.score >= categoryThresholds["Best Fit"](maxScore) &&
      categoryCounts["Best Fit"] < categoryLimits["Best Fit"]
    ) {
      assignedCategory = "Best Fit";
    } else if (
      result.score >= categoryThresholds["Strong Fit"](maxScore) &&
      categoryCounts["Strong Fit"] < categoryLimits["Strong Fit"]
    ) {
      assignedCategory = "Strong Fit";
    } else if (
      result.score >= categoryThresholds["Possible Fit"](maxScore) &&
      categoryCounts["Possible Fit"] < categoryLimits["Possible Fit"]
    ) {
      assignedCategory = "Possible Fit";
    }

    // Increment count for the assigned category
    categoryCounts[assignedCategory]++;

    finalCategorizedResults.push({
      ...result,
      category: assignedCategory,
    });
  }

  // If you want to maintain the original sorting for the final output, re-sort by ID or some other stable key
  // For now, it will return sorted by score, which is generally what's desired for presentation.
  return finalCategorizedResults;
}

// STEP 5: Calculate all business model matches
export function calculateAllBusinessModelMatches(data: QuizData): Array<{
  id: string;
  name: string;
  score: number;
  category: string;
}> {
  const userProfile = normalizeUserResponses(data);
  const results: Array<{
    id: string;
    name: string;
    score: number;
    category: string;
  }> = [];

  // Business model names mapping
  const businessNames: Record<string, string> = {
    freelancing: "Freelancing",
    "online-tutoring": "Online Tutoring / Coaching",
    "e-commerce": "E-commerce Brand Building",
    "content-creation": "Content Creation / UGC",
    "youtube-automation": "YouTube Automation Channels",
    "local-service": "Local Service Arbitrage",
    "high-ticket-sales": "High-Ticket Sales / Closing",
    "saas-development": "App or SaaS Development",
    "social-media-agency": "Social Media Marketing Agency",
    "ai-marketing-agency": "AI Marketing Agency",
    "digital-services": "Digital Services Agency",
    "investing-trading": "Investing / Trading",
    "online-reselling": "Online Reselling",
    "handmade-goods": "Handmade Goods",
    copywriting: "Copywriting / Ghostwriting",
    "affiliate-marketing": "Affiliate Marketing",
    "virtual-assistant": "Virtual Assistant",
  };

  // Calculate scores for each business model
  for (const [modelId, profile] of Object.entries(BUSINESS_MODEL_PROFILES)) {
    const score = calculateBusinessModelMatch(userProfile, profile);
    results.push({
      id: modelId,
      name: businessNames[modelId] || modelId,
      score: Math.round(score),
      category: "", // Will be set by assignCategories
    });
  }

  // Sort by score (highest first) before assigning categories based on max score
  results.sort((a, b) => b.score - a.score);

  // Assign categories based on algorithm rules (now using max score for dynamic thresholds)
  const categorizedResults = assignCategories(results);

  return categorizedResults;
}

// Legacy function name for backward compatibility
export const calculateAdvancedBusinessModelMatches =
  calculateAllBusinessModelMatches;
