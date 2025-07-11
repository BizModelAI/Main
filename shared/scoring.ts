import type { QuizData } from './types';

// 15 Core Trait Dimensions with weights
export const TRAIT_WEIGHTS = {
  incomeAmbition: 1.2,
  timeCommitment: 1.0,
  passionAlignment: 1.1,
  technicalComfort: 1.0,
  creativeInterest: 1.0,
  salesConfidence: 1.1,
  productVsService: 0.9,
  teachingVsSolving: 0.8,
  structurePreference: 0.8,
  independence: 1.0,
  platformEcosystem: 0.8,
  riskTolerance: 1.0,
  repetitionTolerance: 0.6,
  socialMediaComfort: 1.0,
  toolLearning: 0.9
};

// Business Model Ideal Profiles (0-1 scale)
export const BUSINESS_MODEL_PROFILES = {
  freelancing: {
    speed: 0.7,
    scale: 0.4,
    passion: 0.7,
    tech: 0.6,
    solo: 0.9,
    social: 0.4,
    face: 0.5,
    creative: 0.7,
    structure: 0.6,
    system: 0.5,
    teach: 0.3,
    solve: 0.9,
    passive: 0.2,
    tools: 0.7,
    control: 1.0
  },
  "online-tutoring": {
    speed: 0.6,
    scale: 0.5,
    passion: 0.8,
    tech: 0.5,
    solo: 0.6,
    social: 0.9,
    face: 1.0,
    creative: 0.4,
    structure: 0.7,
    system: 0.6,
    teach: 1.0,
    solve: 0.6,
    passive: 0.3,
    tools: 0.6,
    control: 0.8
  },
  "e-commerce": {
    speed: 0.4,
    scale: 0.9,
    passion: 0.8,
    tech: 0.7,
    solo: 0.7,
    social: 0.6,
    face: 0.6,
    creative: 0.9,
    structure: 0.6,
    system: 0.8,
    teach: 0.2,
    solve: 0.4,
    passive: 0.6,
    tools: 0.8,
    control: 0.9
  },
  "content-creation": {
    speed: 0.7,
    scale: 0.8,
    passion: 0.9,
    tech: 0.7,
    solo: 0.8,
    social: 0.7,
    face: 1.0,
    creative: 1.0,
    structure: 0.4,
    system: 0.5,
    teach: 0.4,
    solve: 0.5,
    passive: 0.5,
    tools: 0.7,
    control: 0.9
  },
  "youtube-automation": {
    speed: 0.5,
    scale: 0.8,
    passion: 0.7,
    tech: 0.8,
    solo: 0.9,
    social: 0.4,
    face: 0.2,
    creative: 0.9,
    structure: 0.5,
    system: 0.7,
    teach: 0.3,
    solve: 0.4,
    passive: 0.7,
    tools: 0.8,
    control: 0.8
  },
  "local-service": {
    speed: 0.6,
    scale: 0.6,
    passion: 0.5,
    tech: 0.3,
    solo: 0.7,
    social: 0.8,
    face: 0.6,
    creative: 0.4,
    structure: 0.7,
    system: 0.6,
    teach: 0.2,
    solve: 0.8,
    passive: 0.4,
    tools: 0.4,
    control: 0.8
  },
  "high-ticket-sales": {
    speed: 0.8,
    scale: 0.7,
    passion: 0.6,
    tech: 0.4,
    solo: 0.8,
    social: 1.0,
    face: 1.0,
    creative: 0.6,
    structure: 0.8,
    system: 0.7,
    teach: 0.3,
    solve: 0.9,
    passive: 0.3,
    tools: 0.5,
    control: 0.9
  },
  "saas-development": {
    speed: 0.2,
    scale: 1.0,
    passion: 0.9,
    tech: 1.0,
    solo: 0.8,
    social: 0.3,
    face: 0.4,
    creative: 0.8,
    structure: 0.7,
    system: 1.0,
    teach: 0.1,
    solve: 0.9,
    passive: 0.8,
    tools: 0.9,
    control: 1.0
  },
  "social-media-agency": {
    speed: 0.6,
    scale: 0.8,
    passion: 0.7,
    tech: 0.8,
    solo: 0.6,
    social: 0.9,
    face: 0.7,
    creative: 0.8,
    structure: 0.6,
    system: 0.7,
    teach: 0.3,
    solve: 0.7,
    passive: 0.4,
    tools: 0.8,
    control: 0.9
  },
  "ai-marketing-agency": {
    speed: 0.5,
    scale: 0.9,
    passion: 0.7,
    tech: 1.0,
    solo: 0.7,
    social: 0.7,
    face: 0.6,
    creative: 0.7,
    structure: 0.7,
    system: 0.8,
    teach: 0.3,
    solve: 0.8,
    passive: 0.6,
    tools: 0.9,
    control: 1.0
  },
  "digital-services": {
    speed: 0.7,
    scale: 0.8,
    passion: 0.6,
    tech: 0.7,
    solo: 0.6,
    social: 0.6,
    face: 0.4,
    creative: 0.6,
    structure: 0.7,
    system: 0.8,
    teach: 0.2,
    solve: 0.9,
    passive: 0.3,
    tools: 0.7,
    control: 1.0
  },
  "investing-trading": {
    speed: 0.9,
    scale: 0.7,
    passion: 0.4,
    tech: 0.7,
    solo: 1.0,
    social: 0.2,
    face: 0.1,
    creative: 0.2,
    structure: 0.4,
    system: 0.6,
    teach: 0.0,
    solve: 0.3,
    passive: 0.8,
    tools: 0.8,
    control: 1.0
  },
  "online-reselling": {
    speed: 0.8,
    scale: 0.4,
    passion: 0.5,
    tech: 0.4,
    solo: 0.9,
    social: 0.3,
    face: 0.2,
    creative: 0.5,
    structure: 0.6,
    system: 0.5,
    teach: 0.1,
    solve: 0.2,
    passive: 0.3,
    tools: 0.4,
    control: 0.9
  },
  "handmade-goods": {
    speed: 0.4,
    scale: 0.3,
    passion: 1.0,
    tech: 0.3,
    solo: 1.0,
    social: 0.2,
    face: 0.3,
    creative: 1.0,
    structure: 0.5,
    system: 0.3,
    teach: 0.1,
    solve: 0.2,
    passive: 0.2,
    tools: 0.3,
    control: 1.0
  },
  "copywriting": {
    speed: 0.6,
    scale: 0.5,
    passion: 0.8,
    tech: 0.5,
    solo: 1.0,
    social: 0.4,
    face: 0.3,
    creative: 0.9,
    structure: 0.7,
    system: 0.6,
    teach: 0.2,
    solve: 0.8,
    passive: 0.3,
    tools: 0.6,
    control: 1.0
  },
  "affiliate-marketing": {
    speed: 0.7,
    scale: 0.8,
    passion: 0.6,
    tech: 0.7,
    solo: 0.9,
    social: 0.7,
    face: 0.6,
    creative: 0.8,
    structure: 0.6,
    system: 0.7,
    teach: 0.2,
    solve: 0.4,
    passive: 0.7,
    tools: 0.8,
    control: 0.8
  },
  "virtual-assistant": {
    speed: 0.8,
    scale: 0.4,
    passion: 0.5,
    tech: 0.5,
    solo: 0.7,
    social: 0.7,
    face: 0.4,
    creative: 0.4,
    structure: 0.8,
    system: 0.7,
    teach: 0.1,
    solve: 0.9,
    passive: 0.2,
    tools: 0.6,
    control: 0.7
  }
};

// STEP 2: Normalize User Answers (Convert to 0-1 scale)
export function normalizeUserResponses(data: QuizData): Record<string, number> {
  const normalized: Record<string, number> = {};

  // Speed (Time to first income)
  const timeMapping: Record<string, number> = {
    "1-2-weeks": 1.0,
    "1-month": 0.8,
    "3-6-months": 0.6,
    "6-12-months": 0.4,
    "1-2-years": 0.2,
    "2-plus-years": 0.0
  };
  normalized.speed = timeMapping[data.firstIncomeTimeline] || 0.5;

  // Scale (Income goal)
  normalized.scale = Math.min(data.successIncomeGoal / 10000, 1.0);

  // Passion (Passion identity alignment)
  normalized.passion = (data.passionIdentityAlignment - 1) / 4;

  // Tech (Tech skills rating)
  normalized.tech = (data.techSkillsRating - 1) / 4;

  // Solo (Work collaboration preference)
  const soloMapping: Record<string, number> = {
    "solo": 1.0,
    "mostly-solo": 0.8,
    "balanced": 0.5,
    "mostly-team": 0.2,
    "team-focused": 0.0
  };
  normalized.solo = soloMapping[data.workCollaborationPreference] || 0.5;

  // Social (Direct communication enjoyment)
  normalized.social = (data.directCommunicationEnjoyment - 1) / 4;

  // Face (Brand face comfort)
  normalized.face = (data.brandFaceComfort - 1) / 4;

  // Creative (Creative work enjoyment)
  normalized.creative = (data.creativeWorkEnjoyment - 1) / 4;

  // Structure (Work structure preference)
  const structureMapping: Record<string, number> = {
    "clear-steps": 1.0,
    "some-structure": 0.7,
    "mostly-flexible": 0.4,
    "total-freedom": 0.1
  };
  normalized.structure = structureMapping[data.workStructurePreference] || 0.5;

  // System (Systems routines enjoyment)
  normalized.system = (data.systemsRoutinesEnjoyment - 1) / 4;

  // Teach (Teaching vs solving preference)
  const teachMapping: Record<string, number> = {
    "teaching-focused": 1.0,
    "both-equally": 0.5,
    "problem-solving": 0.0
  };
  normalized.teach = teachMapping[data.pathPreference] || 0.5;

  // Solve (inverse of teach)
  normalized.solve = 1.0 - normalized.teach;

  // Passive (Passive income importance)
  normalized.passive = (data.passiveIncomeImportance - 1) / 4;

  // Tools (Tool learning willingness)
  const toolsMapping: Record<string, number> = {
    "yes": 1.0,
    "maybe": 0.5,
    "no": 0.0
  };
  normalized.tools = toolsMapping[data.toolLearningWillingness] || 0.5;

  // Control (Control importance)
  normalized.control = (data.controlImportance - 1) / 4;

  return normalized;
}

// STEP 4: Calculate Match Score
export function calculateBusinessModelMatch(
  userProfile: Record<string, number>,
  businessProfile: Record<string, number>
): number {
  const traits = Object.keys(businessProfile);
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const trait of traits) {
    const userScore = userProfile[trait] || 0;
    const modelIdeal = businessProfile[trait] || 0;
    
    // Calculate similarity (1 - absolute difference)
    const similarity = 1 - Math.abs(userScore - modelIdeal);
    
    // Apply equal weight for now (can be adjusted later)
    const weight = 1.0;
    
    totalWeightedScore += similarity * weight;
    totalWeight += weight;
  }

  // Return percentage
  return totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;
}

// STEP 3: Categorize scores
export function getCategoryFromScore(score: number): string {
  if (score >= 70) return "Best Fit";
  if (score >= 50) return "Strong Fit";
  if (score >= 30) return "Possible Fit";
  return "Poor Fit";
}

// Assignment function to ensure no two models get the same category
export function assignCategories(results: Array<{
  id: string;
  name: string;
  score: number;
  category: string;
}>): Array<{
  id: string;
  name: string;
  score: number;
  category: string;
}> {
  // Sort by score (highest first)
  const sortedResults = [...results].sort((a, b) => b.score - a.score);
  
  // Track category assignments
  const categoryCount: Record<string, number> = {
    "Best Fit": 0,
    "Strong Fit": 0,
    "Possible Fit": 0,
    "Poor Fit": 0
  };
  
  // Assign categories with limits
  return sortedResults.map((result, index) => {
    let category = result.category;
    
    // Ensure variety in categories
    if (category === "Best Fit" && categoryCount["Best Fit"] >= 3) {
      category = "Strong Fit";
    }
    if (category === "Strong Fit" && categoryCount["Strong Fit"] >= 6) {
      category = "Possible Fit";
    }
    if (category === "Possible Fit" && categoryCount["Possible Fit"] >= 5) {
      category = "Poor Fit";
    }
    
    categoryCount[category]++;
    
    return {
      ...result,
      category
    };
  });
}

// STEP 5: Calculate all business model matches
export function calculateAllBusinessModelMatches(data: QuizData): Array<{
  id: string;
  name: string;
  score: number;
  category: string;
}> {
  const userProfile = normalizeUserResponses(data);
  const results: Array<{ id: string; name: string; score: number; category: string }> = [];

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
    "copywriting": "Copywriting / Ghostwriting",
    "affiliate-marketing": "Affiliate Marketing",
    "virtual-assistant": "Virtual Assistant"
  };

  // Calculate scores for each business model
  for (const [modelId, profile] of Object.entries(BUSINESS_MODEL_PROFILES)) {
    const score = calculateBusinessModelMatch(userProfile, profile);
    results.push({
      id: modelId,
      name: businessNames[modelId] || modelId,
      score: Math.round(score),
      category: getCategoryFromScore(score)
    });
  }

  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);

  // Assign categories based on algorithm rules
  const categorizedResults = assignCategories(results);

  return categorizedResults;
}

// Legacy function name for backward compatibility
export const calculateAdvancedBusinessModelMatches = calculateAllBusinessModelMatches;