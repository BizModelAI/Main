import { calculateAllBusinessModelMatches } from "./shared/scoring.ts";

// Test data with sample quiz responses
const testQuizData = {
  // Core required fields
  successIncomeGoal: 5000,
  firstIncomeTimeline: "1–3 months",
  passionIdentityAlignment: 4,
  techSkillsRating: 3,
  workCollaborationPreference: "Mostly solo",
  directCommunicationEnjoyment: 3,
  creativeWorkEnjoyment: 4,
  passiveIncomeImportance: 4,
  controlImportance: 5,

  // Legacy fields that are expected
  mainMotivation: "Financial freedom",
  businessExitPlan: "build-and-sell",
  businessGrowthSize: "scaling",
  weeklyTimeCommitment: 20,
  longTermConsistency: 4,
  trialErrorComfort: 3,
  learningPreference: "Hands-on",
  systemsRoutinesEnjoyment: 3,
  discouragementResilience: 4,
  toolLearningWillingness: "yes",
  organizationLevel: 3,
  selfMotivationLevel: 4,
  uncertaintyHandling: 3,
  repetitiveTasksFeeling: "neutral",
  brandFaceComfort: 2,
  competitivenessLevel: 3,
  workStructurePreference: "some-structure",
  workspaceAvailability: "Yes",
  supportSystemStrength: "A small but helpful group",
  internetDeviceReliability: 4,
  familiarTools: ["Google Docs/Sheets", "Canva"],
  decisionMakingStyle: "After some research",
  riskComfortLevel: 3,
  feedbackRejectionResponse: 3,
  pathPreference: "both-equally",
  onlinePresenceComfort: "yes",
  clientCallsComfort: "yes",
  physicalShippingOpenness: "no",
  workStylePreference: "hybrid",
  socialMediaInterest: 3,
  ecosystemParticipation: "maybe",
  existingAudience: "No",
  promotingOthersOpenness: "no",
  teachVsSolvePreference: "both",
  meaningfulContributionImportance: 4,
};

try {
  console.log("Testing new scoring algorithm...");
  const results = calculateAllBusinessModelMatches(testQuizData);

  console.log("\n=== SCORING RESULTS ===");
  console.log(`Total business models evaluated: ${results.length}`);

  // Display top 5 results
  console.log("\nTop 5 Business Model Matches:");
  results.slice(0, 5).forEach((result, index) => {
    console.log(
      `${index + 1}. ${result.name}: ${result.score}% (${result.category})`,
    );
  });

  // Display category distribution
  const categoryCount = results.reduce((acc, result) => {
    acc[result.category] = (acc[result.category] || 0) + 1;
    return acc;
  }, {});

  console.log("\nCategory Distribution:");
  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`${category}: ${count} models`);
  });

  console.log("\n✅ Scoring algorithm test completed successfully!");
} catch (error) {
  console.error("❌ Error testing scoring algorithm:", error);
  console.error(error.stack);
}
