import OpenAI from "openai";
import { QuizData, BusinessPath, AIAnalysis } from "../types";
import { AICacheManager } from "./aiCacheManager";

// Client-side AI service should use server endpoints instead of direct API calls
// This is more secure and allows proper environment variable access

export class AIService {
  private static instance: AIService;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Method to clear cache and force fresh responses
  static clearCacheAndReset(): void {
    if (typeof window !== 'undefined') {
      const aiCacheManager = AICacheManager.getInstance();
      aiCacheManager.forceResetCache();
      console.log("AI cache cleared - next responses will be fresh from OpenAI");
      // Force a page reload to ensure complete reset
      window.location.reload();
    }
  }

  async generatePersonalizedInsights(
    quizData: QuizData,
    topPaths: BusinessPath[],
  ): Promise<{
    personalizedSummary: string;
    customRecommendations: string[];
    potentialChallenges: string[];
    successStrategies: string[];
    personalizedActionPlan: {
      week1: string[];
      month1: string[];
      month3: string[];
      month6: string[];
    };
    motivationalMessage: string;
  }> {
    try {
      // Create a comprehensive user profile for the AI
      const userProfile = this.createUserProfile(quizData);
      const topBusinessPaths = topPaths.map((path) => ({
        name: path.name,
        fitScore: path.fitScore,
        description: path.description,
      }));

      // Generate personalized summary
      const personalizedSummary = await this.generatePersonalizedSummary(
        userProfile,
        topBusinessPaths,
      );

      // Generate custom recommendations
      const customRecommendations = await this.generateCustomRecommendations(
        userProfile,
        topBusinessPaths,
      );

      // Generate potential challenges
      const potentialChallenges = await this.generatePotentialChallenges(
        userProfile,
        topBusinessPaths,
      );

      // Generate success strategies
      const successStrategies = await this.generateSuccessStrategies(
        userProfile,
        topBusinessPaths,
      );

      // Generate personalized action plan
      const personalizedActionPlan = await this.generatePersonalizedActionPlan(
        userProfile,
        topBusinessPaths[0],
      );

      // Generate motivational message
      const motivationalMessage = await this.generateMotivationalMessage(
        userProfile,
        topBusinessPaths,
      );

      return {
        personalizedSummary,
        customRecommendations,
        potentialChallenges,
        successStrategies,
        personalizedActionPlan,
        motivationalMessage,
      };
    } catch (error) {
      console.error("Error generating AI insights:", error);
      // Only fallback after multiple attempts and clear failure
      if (error.message.includes('Server error') || error.message.includes('fetch')) {
        console.log("Server/network error - using fallback");
        return this.generateFallbackInsights(quizData, topPaths);
      }
      // Re-throw other errors to be handled upstream
      throw error;
    }
  }

  async generateDetailedAnalysis(
    quizData: QuizData,
    topPath: BusinessPath,
  ): Promise<AIAnalysis> {
    try {

      // Create a comprehensive prompt for detailed analysis
      const prompt = `
Based on this user's quiz responses and their top business match (${topPath.name}), generate a comprehensive business model analysis.

User Profile Summary:
- Main Motivation: ${quizData.mainMotivation}
- Income Goal: $${quizData.successIncomeGoal}/month
- Time Commitment: ${quizData.weeklyTimeCommitment} hours/week
- Tech Skills: ${quizData.techSkillsRating}/5
- Risk Tolerance: ${quizData.riskComfortLevel}/5
- Communication Comfort: ${quizData.directCommunicationEnjoyment}/5
- Creative Enjoyment: ${quizData.creativeWorkEnjoyment}/5

Top Business Match: ${topPath.name} (${topPath.fitScore}% fit)

Generate a professional business analysis in plain text format (no markdown, no asterisks, no bold formatting) that explains:
1. Why this business model is specifically suited to their personality and goals
2. How their unique combination of traits creates advantages in this field
3. Specific strategies they should use based on their profile
4. Timeline expectations based on their commitment level
5. How to leverage their strengths and mitigate weaknesses

Requirements:
- Write in a professional, consultative tone
- Use clear, direct language without excessive enthusiasm
- No markdown formatting (no **, no #, no bullet points)
- 250-350 words maximum
- Focus on actionable insights and realistic expectations
      `;

      const fullAnalysis = await this.makeOpenAIRequest(prompt, 500, 0.7);

      return {
        fullAnalysis,
        keyInsights: [
          `Your ${quizData.riskComfortLevel >= 4 ? "high" : "moderate"} risk tolerance aligns perfectly with ${topPath.name}`,
          `With ${quizData.weeklyTimeCommitment} hours/week, you can realistically achieve ${topPath.timeToProfit}`,
          `Your tech comfort level (${quizData.techSkillsRating}/5) is ${quizData.techSkillsRating >= 4 ? "excellent" : "adequate"} for this path`,
          `Communication style matches the ${quizData.directCommunicationEnjoyment >= 4 ? "high" : "moderate"} interaction requirements`,
        ],
        personalizedRecommendations: [
          `Start with ${quizData.upfrontInvestment <= 500 ? "free tools and gradual investment" : "proven tools and systems"}`,
          `Focus on ${quizData.creativeWorkEnjoyment >= 4 ? "creative differentiation" : "systematic execution"}`,
          `Leverage your ${quizData.selfMotivationLevel >= 4 ? "high self-motivation" : "structured approach"} for consistency`,
        ],
        riskFactors: [
          quizData.longTermConsistency <= 2
            ? "May struggle with long-term consistency"
            : null,
          quizData.techSkillsRating <= 2
            ? "Technical learning curve may be challenging"
            : null,
          quizData.weeklyTimeCommitment <= 10
            ? "Limited time may slow initial progress"
            : null,
        ].filter(Boolean) as string[],
        successPredictors: [
          quizData.selfMotivationLevel >= 4
            ? "High self-motivation indicates strong success potential"
            : null,
          quizData.longTermConsistency >= 4
            ? "Excellent consistency track record"
            : null,
          quizData.riskComfortLevel >= 3
            ? "Comfortable risk tolerance for entrepreneurship"
            : null,
        ].filter(Boolean) as string[],
      };
    } catch (error) {
      console.error("Error generating detailed analysis:", error);
      // Only fallback for clear API/network errors
      if (error.message.includes('Server error') || error.message.includes('fetch')) {
        console.log("Server/network error - using fallback analysis");
        return this.generateFallbackAnalysis(quizData, topPath);
      }
      // Re-throw other errors
      throw error;
    }
  }

  async makeOpenAIRequest(
    prompt: string,
    maxTokens: number = 200,
    temperature: number = 0.7,
  ): Promise<string> {
    try {
      const response = await fetch('/api/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      return data.content || "";
    } catch (error) {
      console.error("OpenAI API request failed:", error);
      throw error;
    }
  }

  private createUserProfile(quizData: QuizData): string {
    return `
User Profile:
- Main Motivation: ${quizData.mainMotivation || "Not specified"}
- Income Goal: $${quizData.successIncomeGoal || "Not specified"}/month
- Time to First Income: ${quizData.firstIncomeTimeline || "Not specified"}
- Investment Budget: $${quizData.upfrontInvestment || "Not specified"}
- Weekly Time Commitment: ${quizData.weeklyTimeCommitment || "Not specified"} hours
- Tech Skills: ${quizData.techSkillsRating || "Not specified"}/5
- Brand Face Comfort: ${quizData.brandFaceComfort || "Not specified"}/5
- Creative Work Enjoyment: ${quizData.creativeWorkEnjoyment || "Not specified"}/5
- Communication Enjoyment: ${quizData.directCommunicationEnjoyment || "Not specified"}/5
- Self Motivation: ${quizData.selfMotivationLevel || "Not specified"}/5
- Risk Comfort: ${quizData.riskComfortLevel || "Not specified"}/5
- Work Structure Preference: ${quizData.workStructurePreference || "Not specified"}
- Work Collaboration Preference: ${quizData.workCollaborationPreference || "Not specified"}
- Decision Making Style: ${quizData.decisionMakingStyle || "Not specified"}
- Social Media Interest: ${quizData.socialMediaInterest || "Not specified"}/5
- Familiar Tools: ${quizData.familiarTools?.join(", ") || "None specified"}
- Learning Preference: ${quizData.learningPreference || "Not specified"}
- Passion Alignment Importance: ${quizData.passionIdentityAlignment || "Not specified"}/5
- Meaningful Contribution Importance: ${quizData.meaningfulContributionImportance || "Not specified"}/5
    `.trim();
  }

  private async generatePersonalizedSummary(
    userProfile: string,
    topPaths: any[],
  ): Promise<string> {
    const prompt = `
Based on this user profile, create a personalized 2-3 sentence summary that explains why their top business match is perfect for them. Be specific about their personality traits and goals.

${userProfile}

Top Business Matches:
${topPaths.map((path, i) => `${i + 1}. ${path.name} (${path.fitScore}% match) - ${path.description}`).join("\n")}

Write a personalized summary that connects their specific traits to their top business match. Be encouraging and specific.
    `;

    try {
      const content = await this.makeOpenAIRequest(prompt, 200, 0.7);
      return (
        content ||
        "Your unique combination of traits makes you well-suited for entrepreneurial success."
      );
    } catch (error) {
      return "Your unique combination of traits makes you well-suited for entrepreneurial success.";
    }
  }

  private async generateCustomRecommendations(
    userProfile: string,
    topPaths: any[],
  ): Promise<string[]> {
    const prompt = `
Based on this user profile and their top business matches, generate 6 specific, actionable recommendations tailored to their personality and goals.

${userProfile}

Top Business Matches:
${topPaths.map((path, i) => `${i + 1}. ${path.name} (${path.fitScore}% match)`).join("\n")}

Generate 6 personalized recommendations that consider their:
- Specific strengths and preferences
- Time availability and goals
- Risk tolerance and tech comfort
- Learning style and motivation level

Format as a simple list, each recommendation should be 1-2 sentences and actionable.
    `;

    try {
      const content = await this.makeOpenAIRequest(prompt, 400, 0.7);
      return this.parseListResponse(content, 6);
    } catch (error) {
      return this.getFallbackRecommendations();
    }
  }

  private async generatePotentialChallenges(
    userProfile: string,
    topPaths: any[],
  ): Promise<string[]> {
    const prompt = `
Based on this user profile and their top business matches, identify 4 specific challenges they might face and how to address them.

${userProfile}

Top Business Matches:
${topPaths.map((path, i) => `${i + 1}. ${path.name} (${path.fitScore}% match)`).join("\n")}

Generate 4 potential challenges that are specific to their personality traits, goals, and chosen business path. For each challenge, include a brief solution or mitigation strategy.

Format as a simple list, each item should be 1-2 sentences.
    `;

    try {
      const content = await this.makeOpenAIRequest(prompt, 350, 0.7);
      return this.parseListResponse(content, 4);
    } catch (error) {
      return this.getFallbackChallenges();
    }
  }

  private async generateSuccessStrategies(
    userProfile: string,
    topPaths: any[],
  ): Promise<string[]> {
    const prompt = `
Based on this user profile and their top business matches, generate 6 specific success strategies that leverage their strengths.

${userProfile}

Top Business Matches:
${topPaths.map((path, i) => `${i + 1}. ${path.name} (${path.fitScore}% match)`).join("\n")}

Generate 6 success strategies that:
- Leverage their specific strengths and preferences
- Address their goals and timeline
- Work with their available time and resources
- Match their learning and work style

Format as a simple list, each strategy should be 1-2 sentences and actionable.
    `;

    try {
      const content = await this.makeOpenAIRequest(prompt, 400, 0.7);
      return this.parseListResponse(content, 6);
    } catch (error) {
      return this.getFallbackStrategies();
    }
  }

  private async generatePersonalizedActionPlan(
    userProfile: string,
    topPath: any,
  ): Promise<{
    week1: string[];
    month1: string[];
    month3: string[];
    month6: string[];
  }> {
    const prompt = `
Based on this user profile and their top business match, create a detailed action plan with specific tasks for Week 1, Month 1, Month 3, and Month 6.

${userProfile}

Top Business Match: ${topPath.name} (${topPath.fitScore}% match) - ${topPath.description}

Create a personalized action plan that considers their:
- Available time and resources
- Learning style and preferences
- Goals and timeline
- Strengths and challenges

For each timeframe, provide 3-4 specific, actionable tasks. Make sure the progression is logical and builds upon previous phases.

Format as:
Week 1:
- Task 1
- Task 2
- Task 3

Month 1:
- Task 1
- Task 2
- Task 3
- Task 4

Month 3:
- Task 1
- Task 2
- Task 3
- Task 4

Month 6:
- Task 1
- Task 2
- Task 3
- Task 4
    `;

    try {
      const content = await this.makeOpenAIRequest(prompt, 600, 0.7);
      return this.parseActionPlan(content);
    } catch (error) {
      return this.getFallbackActionPlan();
    }
  }

  private async generateMotivationalMessage(
    userProfile: string,
    topPaths: any[],
  ): Promise<string> {
    const prompt = `
Based on this user profile and their business matches, write an inspiring and personalized motivational message (2-3 sentences) that:
- Acknowledges their specific strengths
- Connects to their goals and motivation
- Encourages them to take action
- Feels personal and authentic

${userProfile}

Top Business Match: ${topPaths[0].name} (${topPaths[0].fitScore}% match)

Write a motivational message that feels like it's coming from a mentor who truly understands them.
    `;

    try {
      const content = await this.makeOpenAIRequest(prompt, 150, 0.8);
      return (
        content ||
        "Your unique combination of skills and drive positions you perfectly for entrepreneurial success. Trust in your abilities and take that first step."
      );
    } catch (error) {
      return "Your unique combination of skills and drive positions you perfectly for entrepreneurial success. Trust in your abilities and take that first step.";
    }
  }

  private generateFallbackAnalysis(
    quizData: QuizData,
    topPath: BusinessPath,
  ): AIAnalysis {
    return {
      fullAnalysis: this.generateFallbackAnalysisText(quizData, topPath),
      keyInsights: [
        "Your risk tolerance perfectly matches the requirements of this business model",
        "Time commitment aligns with realistic income expectations and growth timeline",
        "Technical skills provide a solid foundation for the tools and systems needed",
        "Communication preferences match the customer interaction requirements",
      ],
      personalizedRecommendations: [
        "Start with proven tools and systems to minimize learning curve",
        "Focus on systematic execution rather than trying to reinvent approaches",
        "Leverage your natural strengths while gradually building new skills",
      ],
      riskFactors: [
        "Initial learning curve may require patience and persistence",
        "Income may be inconsistent in the first few months",
        "Success requires consistent daily action and follow-through",
      ],
      successPredictors: [
        "Strong self-motivation indicates high likelihood of follow-through",
        "Analytical approach will help optimize strategies and tactics",
        "Realistic expectations set foundation for sustainable growth",
      ],
    };
  }

  private generateFallbackAnalysisText(
    quizData: QuizData,
    topPath: BusinessPath,
  ): string {
    return `Your assessment reveals a remarkable alignment between your personal profile and ${topPath.name}. With a ${topPath.fitScore}% compatibility score, this represents more than just a good fit—it's potentially your ideal entrepreneurial path. Your unique combination of risk tolerance, time availability, and skill set creates natural advantages in this field. The way you approach decisions, handle challenges, and prefer to work all point toward success in this specific business model. Your timeline expectations are realistic given your commitment level, and your technical comfort provides the foundation needed for the tools and systems required. Most importantly, this path aligns with your core motivations and long-term vision, creating the sustainable motivation needed for entrepreneurial success.`;
  }

  private parseListResponse(content: string, expectedCount: number): string[] {
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, ""))
      .filter((line) => line.length > 10); // Filter out very short lines

    // If we don't have enough items, pad with generic ones
    while (lines.length < expectedCount) {
      lines.push(
        "Focus on consistent daily action and continuous learning to build momentum.",
      );
    }

    return lines.slice(0, expectedCount);
  }

  private parseActionPlan(content: string): {
    week1: string[];
    month1: string[];
    month3: string[];
    month6: string[];
  } {
    const sections = {
      week1: [] as string[],
      month1: [] as string[],
      month3: [] as string[],
      month6: [] as string[],
    };

    const lines = content.split("\n").map((line) => line.trim());
    let currentSection = "";

    for (const line of lines) {
      if (line.toLowerCase().includes("week 1")) {
        currentSection = "week1";
      } else if (line.toLowerCase().includes("month 1")) {
        currentSection = "month1";
      } else if (line.toLowerCase().includes("month 3")) {
        currentSection = "month3";
      } else if (line.toLowerCase().includes("month 6")) {
        currentSection = "month6";
      } else if (line.startsWith("-") || line.match(/^\d+\./)) {
        const task = line
          .replace(/^[-•*]\s*/, "")
          .replace(/^\d+\.\s*/, "")
          .trim();
        if (task.length > 10 && currentSection) {
          sections[currentSection as keyof typeof sections].push(task);
        }
      }
    }

    // Ensure each section has at least 3 items
    Object.keys(sections).forEach((key) => {
      const section = sections[key as keyof typeof sections];
      while (section.length < 3) {
        section.push(
          "Continue building your business foundation with consistent daily actions.",
        );
      }
    });

    return sections;
  }

  // Fallback methods for when API calls fail
  private getFallbackRecommendations(): string[] {
    return [
      "Start with free tools and platforms to validate your concept before investing money",
      "Focus on building one core skill deeply rather than spreading yourself thin",
      "Set realistic 90-day milestones to maintain motivation and track progress",
      "Join online communities in your chosen field for support and networking",
      "Create a dedicated workspace to maintain focus and professionalism",
      "Track your time and energy to optimize your most productive hours",
    ];
  }

  private getFallbackChallenges(): string[] {
    return [
      "Managing time effectively between learning and doing while building momentum",
      "Overcoming perfectionism that might delay launching and getting feedback",
      "Building confidence to position yourself as an expert in your chosen field",
      "Staying motivated during the initial period when results may be slow",
    ];
  }

  private getFallbackStrategies(): string[] {
    return [
      "Leverage your analytical nature by tracking metrics and making data-driven decisions",
      "Use your natural communication skills to build strong customer relationships",
      "Focus on solving real problems for people rather than just making money",
      "Build systems and processes early to create scalable business operations",
      "Invest in continuous learning to stay ahead of market changes",
      "Network strategically with others in your industry for partnerships and opportunities",
    ];
  }

  private getFallbackActionPlan(): {
    week1: string[];
    month1: string[];
    month3: string[];
    month6: string[];
  } {
    return {
      week1: [
        "Research your chosen business model and successful case studies",
        "Set up your workspace and basic tools needed to get started",
        "Define your specific target market and ideal customer profile",
      ],
      month1: [
        "Launch your minimum viable product or service offering",
        "Create your first marketing materials and online presence",
        "Reach out to potential customers and gather initial feedback",
        "Establish basic business processes and tracking systems",
      ],
      month3: [
        "Optimize your offering based on customer feedback and results",
        "Scale your marketing efforts and expand your reach",
        "Build strategic partnerships or collaborations",
        "Develop systems for consistent delivery and customer service",
      ],
      month6: [
        "Analyze your business performance and identify growth opportunities",
        "Consider expanding your product or service offerings",
        "Build a team or outsource tasks to focus on high-value activities",
        "Plan your next phase of growth and set new goals",
      ],
    };
  }

  // Fallback method in case OpenAI API fails
  private generateFallbackInsights(
    quizData: QuizData,
    topPaths: BusinessPath[],
  ): {
    personalizedSummary: string;
    customRecommendations: string[];
    potentialChallenges: string[];
    successStrategies: string[];
    personalizedActionPlan: {
      week1: string[];
      month1: string[];
      month3: string[];
      month6: string[];
    };
    motivationalMessage: string;
  } {
    const topPath = topPaths[0];

    return {
      personalizedSummary: `Based on your comprehensive assessment, ${topPath.name} achieves a ${topPath.fitScore}% compatibility score with your unique profile. Your goals, personality traits, and available resources align perfectly with this business model's requirements and potential outcomes.`,
      customRecommendations: this.getFallbackRecommendations(),
      potentialChallenges: this.getFallbackChallenges(),
      successStrategies: this.getFallbackStrategies(),
      personalizedActionPlan: this.getFallbackActionPlan(),
      motivationalMessage:
        "Your unique combination of skills, motivation, and strategic thinking creates the perfect foundation for entrepreneurial success. Trust in your abilities, stay consistent with your efforts, and remember that every successful entrepreneur started exactly where you are now.",
    };
  }
}
