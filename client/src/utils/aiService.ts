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
    if (typeof window !== "undefined") {
      const aiCacheManager = AICacheManager.getInstance();
      aiCacheManager.forceResetCache();
      console.log(
        "AI cache cleared - next responses will be fresh from OpenAI",
      );
      // Force a page reload to ensure complete reset
      window.location.reload();
    }
  }

  async generateResultsPreview(
    quizData: QuizData,
    topPaths: BusinessPath[],
  ): Promise<{
    previewInsights: string;
    keyInsights: string[];
    successPredictors: string[];
  }> {
    try {
      const cacheKey = `preview_${this.createCacheKey(quizData, topPaths)}`;
      const cached = this.getCachedInsights(cacheKey);
      if (cached) {
        console.log("✅ Using cached preview insights");
        return cached;
      }

      const userProfile = this.createUserProfile(quizData);
      const topBusinessModel = topPaths[0];

      const prompt = `
You are an expert business coach. Based on this user's quiz profile and top business model match, generate the following in JSON format:

1. "previewInsights": Exactly 3 paragraphs introducing the user's entrepreneurial potential and business alignment. Use a professional, supportive tone that feels personalized. Focus on motivation, alignment, strengths, and readiness.

2. "keyInsights": 4 bullet points summarizing important themes from their quiz (e.g., structure preference, creativity, motivation, tech skills, risk tolerance, etc.)

3. "successPredictors": 4 bullet points predicting success based on their profile traits. These should reference specific quiz data (e.g., high motivation, tech skills, time commitment).

Return the result as a valid JSON object like:
{
  "previewInsights": "...",
  "keyInsights": ["...", "...", "...", "..."],
  "successPredictors": ["...", "...", "...", "..."]
}

CRITICAL RULES:
- Use only the data below.
- Do NOT make up numbers, goals, or experience.
- Do NOT include HTML or markdown.
- Do NOT include introductory text—only output the JSON object.

USER PROFILE:
${userProfile}

Top Business Match:
${topBusinessModel.name} (${topBusinessModel.fitScore}% match)
Description: ${topBusinessModel.description}
`;

      const raw = await this.makeOpenAIRequest(prompt, 600, 0.7);

      let clean = raw;
      if (clean.includes("```json")) {
        clean = clean.replace(/```json\n?/, "").replace(/```$/, "");
      }

      const parsed = JSON.parse(clean);

      const result = {
        previewInsights:
          parsed.previewInsights ||
          "Your entrepreneurial potential is strong and well-aligned with your goals.",
        keyInsights: this.validateArray(
          parsed.keyInsights,
          4,
          "You bring strong personal alignment to business.",
        ),
        successPredictors: this.validateArray(
          parsed.successPredictors,
          4,
          "Your traits support long-term success.",
        ),
      };

      this.cacheInsights(cacheKey, result);
      return result;
    } catch (err) {
      console.error("❌ Error generating preview insights:", err);
      return {
        previewInsights:
          "Your profile shows promising alignment with entrepreneurial success. Your traits suggest you're capable of building something meaningful. The combination of your skills, motivation, and available resources creates a strong foundation for your chosen business path.",
        keyInsights: [
          "You value structure and clarity in your work.",
          "You're willing to commit time and energy to your goals.",
          "You show high potential for creative problem solving.",
          "Your comfort with risk gives you an advantage in uncertain environments.",
        ],
        successPredictors: [
          "Strong self-motivation and long-term thinking",
          "Ability to learn new tools and systems quickly",
          "Clear sense of purpose and mission alignment",
          "Sustainable time commitment and consistency",
        ],
      };
    }
  }

  async generateFullReportInsights(
    quizData: QuizData,
    topPaths: BusinessPath[],
    previewInsights: string,
    keySuccessIndicators: string[],
  ): Promise<{
    personalizedRecommendations: string[];
    potentialChallenges: string[];
    keyInsights: string[];
    bestFitCharacteristics: string[];
    top3Fits: { model: string; reason: string }[];
    bottom3Avoid: {
      model: string;
      reason: string;
      futureConsideration?: string;
    }[];
  }> {
    try {
      // Create cache key based on quiz data and top paths
      const cacheKey = `fullreport_${this.createCacheKey(quizData, topPaths)}`;

      // Check for existing cached insights
      const cached = this.getCachedInsights(cacheKey);
      if (cached) {
        console.log(
          "✅ Using cached full report insights (no API call needed)",
        );
        return cached;
      }

      console.log(
        "🔄 Generating fresh full report insights with streamlined AI call",
      );

      // Create a comprehensive user profile for the AI
      const userProfile = this.createUserProfile(quizData);

      // Make streamlined OpenAI call for full report only
      const insights = await this.generateStreamlinedFullReportInsights(
        userProfile,
        topPaths,
        previewInsights,
        keySuccessIndicators,
      );

      // Cache the results
      this.cacheInsights(cacheKey, insights);

      console.log("✅ Fresh full report insights generated and cached");
      return insights;
    } catch (error) {
      console.error("Error generating AI insights:", error);
      // Always return fallback content instead of throwing
      console.log("Full report AI insights generation failed - using fallback");
      return this.generateFullReportFallbackInsights(quizData, topPaths);
    }
  }

  async generateDetailedAnalysis(
    quizData: QuizData,
    topPath: BusinessPath,
  ): Promise<AIAnalysis> {
    try {
      // Determine fit category
      const getFitCategory = (fitScore: number): string => {
        if (fitScore >= 70) return "Best Fit";
        if (fitScore >= 50) return "Strong Fit";
        if (fitScore >= 30) return "Possible Fit";
        return "Poor Fit";
      };

      const fitCategory = getFitCategory(topPath.fitScore);

      // Create category-specific prompts
      const getPromptForCategory = (category: string): string => {
        const baseProfile = `
User Profile Summary:
- Main Motivation: ${quizData.mainMotivation}
- Income Goal: ${this.getIncomeGoalRange(quizData.successIncomeGoal)}
- Time Commitment: ${this.getTimeCommitmentRange(quizData.weeklyTimeCommitment)}
- Tech Skills: ${this.getRatingDescription(quizData.techSkillsRating)}
- Risk Tolerance: ${this.getRatingDescription(quizData.riskComfortLevel)}
- Communication Comfort: ${this.getRatingDescription(quizData.directCommunicationEnjoyment)}
- Creative Enjoyment: ${this.getRatingDescription(quizData.creativeWorkEnjoyment)}

Business Model: ${topPath.name} (${topPath.fitScore}% fit - ${category})`;

        switch (category) {
          case "Best Fit":
            return `${baseProfile}

Generate a professional analysis explaining why ${topPath.name} is the BEST fit for you. Focus on:
1. How your personality traits perfectly align with this business model
2. Why this is your ideal entrepreneurial path
3. Specific advantages you have in this field
4. How your profile gives you competitive advantages
5. Why you should prioritize this over other options

Requirements:
- Speak directly to the user in second person ("you", "your")
- Enthusiastic but professional tone
- Emphasize strong alignment and natural advantages
- 250-350 words maximum
- No markdown formatting
- CRITICAL: Use ONLY the actual data provided. Do NOT make up specific numbers or amounts. Reference the exact ranges shown in the user profile.`;

          case "Strong Fit":
            return `${baseProfile}

Generate a professional analysis explaining why ${topPath.name} is a STRONG fit for you, but acknowledge it's not your absolute best match. Focus on:
1. How your traits align well with this business model
2. Why this is a solid choice with good potential for you
3. Areas where you'll do well
4. 1-2 sentences about minor gaps or why other options might be slightly better
5. How you can maximize success in this model despite small misalignments

Requirements:
- Speak directly to the user in second person ("you", "your")
- Positive but realistic tone - emphasize it's STRONG but not perfect
- Show it's a very good choice while noting minor areas that could be better
- 250-350 words maximum
- No markdown formatting
- CRITICAL: Use ONLY the actual data provided. Do NOT make up specific numbers or amounts. Reference the exact ranges shown in the user profile.`;

          case "Possible Fit":
            return `${baseProfile}

Generate a professional analysis explaining why ${topPath.name} wouldn't work great for you. Focus on:
1. Specific misalignments between your traits and this business model requirements
2. Why this path would be challenging based on your quiz responses
3. Concrete examples of difficulties you would likely face
4. Why other business models would be much better suited to your profile
5. What you should explore instead that better matches your strengths

Requirements:
- Speak directly to the user in second person ("you", "your")
- Honest, direct tone explaining why this isn't a good fit
- Clearly explain this would be difficult and not recommended
- Emphasize that better options exist for your profile
- Suggest focusing on better-matching business models
- 250-350 words maximum
- No markdown formatting
- CRITICAL: Use ONLY the actual data provided. Do NOT make up specific numbers or amounts. Reference the exact ranges shown in the user profile.`;

          case "Poor Fit":
            return `${baseProfile}

Generate a professional analysis explaining why you should AVOID ${topPath.name} right now. Focus on:
1. Major misalignments between your profile and this business model requirements
2. Specific fundamental reasons why you would struggle and likely fail
3. Why you should definitely avoid this path at present
4. What significant changes would be needed before this could be considered
5. Much better alternatives that actually match your profile

Requirements:
- Speak directly to the user in second person ("you", "your")
- Direct, honest tone that clearly advises against this path
- Explain this is a poor choice that should be avoided now
- Mention this might be reconsidered in the future after major changes
- Strongly recommend focusing on better-matched alternatives
- 250-350 words maximum
- No markdown formatting
- CRITICAL: Use ONLY the actual data provided. Do NOT make up specific numbers or amounts. Reference the exact ranges shown in the user profile.`;

          default:
            return `${baseProfile}

Generate a professional business analysis about ${topPath.name} for this user.`;
        }
      };

      const prompt = getPromptForCategory(fitCategory);
      const fullAnalysis = await this.makeOpenAIRequest(prompt, 500, 0.7);

      // Generate category-specific insights and predictors
      const getCategorySpecificContent = (category: string) => {
        switch (category) {
          case "Best Fit":
            return {
              keyInsights: [
                `Your ${quizData.riskComfortLevel >= 4 ? "high" : "moderate"} risk tolerance aligns perfectly with ${topPath.name}`,
                `With ${this.getTimeCommitmentRange(quizData.weeklyTimeCommitment)}, you can realistically achieve ${topPath.timeToProfit}`,
                `Your tech comfort level is ${quizData.techSkillsRating >= 4 ? "excellent" : "adequate"} for this path`,
                `Communication style matches the ${quizData.directCommunicationEnjoyment >= 4 ? "high" : "moderate"} interaction requirements`,
              ],
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
                `Your personality profile shows ${topPath.fitScore}% alignment with successful entrepreneurs in this field`,
              ].filter(Boolean) as string[],
            };

          case "Strong Fit":
            return {
              keyInsights: [
                `Your ${quizData.riskComfortLevel >= 4 ? "high" : "moderate"} risk tolerance works well with ${topPath.name}`,
                `With ${this.getTimeCommitmentRange(quizData.weeklyTimeCommitment)}, you can make good progress toward ${topPath.timeToProfit}`,
                `Your tech comfort level is ${quizData.techSkillsRating >= 3 ? "solid" : "workable"} for this path`,
                `While not your perfect match, this path offers strong potential for success`,
              ],
              successPredictors: [
                quizData.selfMotivationLevel >= 3
                  ? "Good self-motivation supports success in this field"
                  : null,
                quizData.longTermConsistency >= 3
                  ? "Solid consistency will help you build momentum"
                  : null,
                `Your ${topPath.fitScore}% compatibility shows good alignment, though other paths may be even better`,
                "With focused effort, you can overcome the minor gaps in this match",
              ].filter(Boolean) as string[],
            };

          case "Possible Fit":
            return {
              keyInsights: [
                `Your ${quizData.riskComfortLevel <= 2 ? "low" : "moderate"} risk tolerance doesn't match ${topPath.name} demands`,
                `With ${this.getTimeCommitmentRange(quizData.weeklyTimeCommitment)}, this path would be challenging to execute properly`,
                `Your profile shows gaps that would make success in this field difficult`,
                `Other business models would be much better suited to your strengths and preferences`,
              ],
              successPredictors: [
                "Significant misalignment means you'd face major challenges and likely struggle",
                "Your profile suggests this path would require working against your natural strengths",
                quizData.selfMotivationLevel <= 2
                  ? "Lower self-motivation makes this independent path particularly challenging"
                  : "This business model demands skills and traits that don't align with your profile",
                `Your ${topPath.fitScore}% compatibility indicates this path should be avoided in favor of better matches`,
              ],
            };

          case "Poor Fit":
            return {
              keyInsights: [
                `Your ${quizData.riskComfortLevel <= 2 ? "low" : "moderate"} risk tolerance fundamentally conflicts with ${topPath.name} requirements`,
                `With ${this.getTimeCommitmentRange(quizData.weeklyTimeCommitment)}, you lack the commitment this demanding path requires`,
                `Your profile shows major gaps that would lead to failure in this business model`,
                `This path goes against your natural strengths and should be avoided completely`,
              ],
              successPredictors: [
                "Major misalignment indicates high probability of failure and wasted effort",
                "This business model requires traits and skills that conflict with your profile",
                quizData.selfMotivationLevel <= 2
                  ? "Low self-motivation makes this demanding independent path virtually impossible"
                  : "Your personality and preferences make this path unsuitable for success",
                `Your ${topPath.fitScore}% compatibility clearly shows this path should be completely avoided`,
              ],
            };

          default:
            return {
              keyInsights: [
                `Your profile shows moderate alignment with ${topPath.name}`,
                `Consider exploring this path with careful planning`,
              ],
              successPredictors: [
                "Standard business skills and dedication will be important",
              ],
            };
        }
      };

      const categoryContent = getCategorySpecificContent(fitCategory);

      // Generate AI-powered success predictors or struggle points
      const aiSuccessPredictors = await this.generateAISuccessPredictors(
        quizData,
        topPath,
        fitCategory,
      );

      return {
        fullAnalysis,
        keyInsights: categoryContent.keyInsights,
        personalizedRecommendations: [
          `Start with ${quizData.upfrontInvestment <= 500 ? "free tools and gradual investment" : "proven tools and systems"}`,
          `Focus on ${quizData.creativeWorkEnjoyment >= 4 ? "creative differentiation" : "systematic execution"}`,
          `Leverage your ${quizData.selfMotivationLevel >= 4 ? "high self-motivation" : "structured approach"} for consistency`,
        ],
        successPredictors: aiSuccessPredictors,
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
      };
    } catch (error) {
      console.error("Error generating detailed analysis:", error);
      // Only fallback for clear API/network errors
      if (
        error instanceof Error &&
        (error.message.includes("Server error") ||
          error.message.includes("fetch"))
      ) {
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
    retries: number = 3,
  ): Promise<string> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 Making OpenAI request (attempt ${attempt}/${retries})`);

        let response: Response;

        // Use XMLHttpRequest first to avoid FullStory interference
        try {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/openai-chat", true);
          xhr.withCredentials = true;
          xhr.setRequestHeader("Content-Type", "application/json");

          response = await new Promise<Response>((resolve, reject) => {
            xhr.onload = () => {
              const responseText = xhr.responseText;
              resolve({
                ok: xhr.status >= 200 && xhr.status < 300,
                status: xhr.status,
                statusText: xhr.statusText,
                json: () => {
                  try {
                    return Promise.resolve(JSON.parse(responseText));
                  } catch (e) {
                    return Promise.reject(new Error("Invalid JSON response"));
                  }
                },
                text: () => Promise.resolve(responseText),
                headers: new Headers(),
                url: "/api/openai-chat",
                redirected: false,
                type: "basic",
                clone: () => response,
                body: null,
                bodyUsed: false,
                arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
                blob: () => Promise.resolve(new Blob()),
                formData: () => Promise.resolve(new FormData()),
              } as Response);
            };
            xhr.onerror = () =>
              reject(new Error("XMLHttpRequest network error"));
            xhr.ontimeout = () => reject(new Error("XMLHttpRequest timeout"));
            xhr.timeout = 60000; // 60 second timeout for OpenAI calls
            xhr.send(
              JSON.stringify({
                prompt,
                maxTokens,
                temperature,
              }),
            );
          });
        } catch (xhrError) {
          console.log(
            "aiService: XMLHttpRequest failed, trying fetch fallback",
          );

          // Fallback to fetch
          response = await fetch("/api/openai-chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt,
              maxTokens,
              temperature,
            }),
          });
        }

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log(`✅ OpenAI request successful on attempt ${attempt}`);
        return data.content || "";
      } catch (error) {
        console.error(
          `❌ OpenAI API request failed (attempt ${attempt}/${retries}):`,
          error,
        );

        if (attempt === retries) {
          // Final attempt failed, return fallback content instead of throwing
          console.warn(
            "⚠️ All OpenAI API attempts failed, using fallback content",
          );
          return this.getFallbackContent(prompt);
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error("All retry attempts failed");
  }

  private async generateAISuccessPredictors(
    quizData: QuizData,
    topPath: BusinessPath,
    fitCategory: string,
  ): Promise<string[]> {
    try {
      const userProfile = this.createUserProfile(quizData);

      const getPromptForPredictors = (category: string) => {
        const baseInfo = `User Profile: ${userProfile}
Business Model: ${topPath.name}
Fit Score: ${topPath.fitScore}%
Category: ${category}`;

        if (category === "Best Fit" || category === "Strong Fit") {
          return `${baseInfo}

Based on your quiz responses, generate exactly 4 success predictors explaining why you are likely to succeed in ${topPath.name}. Each point should:
1. Reference specific quiz answers or personality traits
2. Explain how that trait leads to success in this business model
3. Be concrete and actionable
4. Be 15-25 words each

Format as a simple list with each point on a new line, no numbers or bullets.

CRITICAL: Use ONLY the actual data provided in the user profile. Do NOT make up specific numbers, amounts, or timeframes. Reference the exact ranges and values shown in the user profile.`;
        } else {
          return `${baseInfo}

Based on your quiz responses, generate exactly 4 struggle points explaining why you are likely to face challenges in ${topPath.name}. Each point should:
1. Reference specific quiz answers or personality traits  
2. Explain how that trait creates challenges in this business model
3. Be honest but constructive
4. Be 15-25 words each

Format as a simple list with each point on a new line, no numbers or bullets.

CRITICAL: Use ONLY the actual data provided in the user profile. Do NOT make up specific numbers, amounts, or timeframes. Reference the exact ranges and values shown in the user profile.`;
        }
      };

      const prompt = getPromptForPredictors(fitCategory);
      const response = await this.makeOpenAIRequest(prompt, 200, 0.7);

      // Parse response into array of 4 points
      const points = response
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.trim())
        .slice(0, 4);

      // Ensure we have exactly 4 points
      while (points.length < 4) {
        points.push(
          fitCategory === "Best Fit" || fitCategory === "Strong Fit"
            ? "Your profile shows strong alignment with this business model"
            : "Some aspects of your profile may create challenges in this path",
        );
      }

      return points;
    } catch (error) {
      console.error("Error generating AI success predictors:", error);
      // Return fallback predictors
      const fallbackPredictors =
        fitCategory === "Best Fit" || fitCategory === "Strong Fit"
          ? [
              "Your quiz responses show strong alignment with this business model",
              "Your personality traits match successful entrepreneurs in this field",
              "Your time commitment and goals align well with this path",
              "Your risk tolerance and motivation support success in this area",
            ]
          : [
              "Your quiz responses suggest some misalignment with this business model",
              "Certain personality traits may create challenges in this field",
              "Your time commitment or goals may not align perfectly with this path",
              "Your risk tolerance or motivation may need adjustment for this area",
            ];
      return fallbackPredictors;
    }
  }

  private createCacheKey(quizData: QuizData, topPaths: BusinessPath[]): string {
    // Create a hash-like key based on quiz data and top paths
    const quizKey = `${quizData.mainMotivation}_${quizData.successIncomeGoal}_${quizData.weeklyTimeCommitment}_${quizData.techSkillsRating}_${quizData.riskComfortLevel}`;
    const pathsKey = topPaths
      .slice(0, 3)
      .map((p) => `${p.id}_${p.fitScore}`)
      .join("_");
    return `ai_insights_${quizKey}_${pathsKey}`;
  }

  private getCachedInsights(cacheKey: string): any | null {
    try {
      // TEMPORARILY DISABLE CACHING FOR DEBUGGING
      console.log(
        "🚫 Caching temporarily disabled for debugging AI personalization",
      );
      return null;

      const cached =
        typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;
      if (cached) {
        const data = JSON.parse(cached!);
        // Check if cache is still valid (1 hour)
        if (Date.now() - data.timestamp < 3600000) {
          return data.insights;
        } else {
          // Remove expired cache
          if (typeof window !== "undefined") {
            localStorage.removeItem(cacheKey);
          }
        }
      }
    } catch (error) {
      console.error("Error reading cached insights:", error);
    }
    return null;
  }

  private cacheInsights(cacheKey: string, insights: any): void {
    try {
      const cacheData = {
        insights,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error caching insights:", error);
    }
  }

  private async generateStreamlinedFullReportInsights(
    userProfile: string,
    topPaths: BusinessPath[],
    previewInsights: string,
    keySuccessIndicators: string[],
  ): Promise<{
    personalizedRecommendations: string[];
    potentialChallenges: string[];
    keyInsights: string[];
    bestFitCharacteristics: string[];
    top3Fits: { model: string; reason: string }[];
    bottom3Avoid: {
      model: string;
      reason: string;
      futureConsideration?: string;
    }[];
  }> {
    const prompt = `
You are an AI business coach. Based only on the quiz data and top 3 business matches, generate the following JSON output. This is for a full business analysis report. Do NOT include formatting or markdown. Be specific and use only known data.

Return exactly this structure:

{
  "personalizedRecommendations": ["...", "...", "...", "...", "...", "..."],
  "potentialChallenges": ["...", "...", "...", "..."],
  "keyInsights": ["...", "...", "...", "..."],
  "bestFitCharacteristics": ["...", "...", "...", "...", "...", "..."],
  "top3Fits": [
    {
      "model": "${topPaths[0]?.name || "Business Model"}",
      "reason": "One short paragraph explaining why this is a strong match"
    },
    {
      "model": "${topPaths[1]?.name || "Business Model"}",
      "reason": "One short paragraph explaining why this is a strong match"
    },
    {
      "model": "${topPaths[2]?.name || "Business Model"}",
      "reason": "One short paragraph explaining why this is a strong match"
    }
  ],
  "bottom3Avoid": [
    {
      "model": "Example Business Model",
      "reason": "Why this model doesn't align with current profile",
      "futureConsideration": "How it could become viable in the future (optional)"
    }
  ]
}

CRITICAL RULES:
- Use ONLY the following data:
  - ${userProfile}
  - Top matches:
    1. ${topPaths[0]?.name} (${topPaths[0]?.fitScore}%)
    2. ${topPaths[1]?.name ?? "N/A"} (${topPaths[1]?.fitScore ?? "N/A"}%)
    3. ${topPaths[2]?.name ?? "N/A"} (${topPaths[2]?.fitScore ?? "N/A"}%)
- DO NOT generate previewInsights or keySuccessIndicators (already created).
- Use clean, specific, professional language only.
- Do NOT invent numbers, ratings, or filler traits.
    `;

    try {
      console.log(
        "📤 Sending streamlined full report prompt to OpenAI:",
        prompt.substring(0, 200) + "...",
      );

      const response = await this.makeOpenAIRequest(prompt, 1000, 0.7);

      console.log("📥 Raw AI response:", response.substring(0, 300) + "...");

      // Clean up the response content (remove markdown code blocks if present)
      let cleanContent = response;
      if (cleanContent.includes("```json")) {
        cleanContent = cleanContent
          .replace(/```json\n?/g, "")
          .replace(/```/g, "");
      }

      const parsed = JSON.parse(cleanContent);

      // Validate and structure the response
      return {
        personalizedRecommendations: this.validateArray(
          parsed.personalizedRecommendations,
          6,
          "Focus on building core skills and taking consistent action.",
        ),
        potentialChallenges: this.validateArray(
          parsed.potentialChallenges,
          4,
          "Initial learning curve may require patience and persistence.",
        ),
        keyInsights: this.validateArray(
          parsed.keyInsights,
          4,
          "Your profile shows strong entrepreneurial potential.",
        ),
        bestFitCharacteristics: this.validateArray(
          parsed.bestFitCharacteristics,
          6,
          "Strong business foundation",
        ),
        top3Fits: this.validateTop3Fits(parsed.top3Fits, topPaths),
        bottom3Avoid: this.validateBottom3Avoid(parsed.bottom3Avoid),
      };
    } catch (error) {
      console.error(
        "Error in streamlined full report insights generation:",
        error,
      );
      throw error; // Let the parent method handle fallback
    }
  }

  private validateArray(
    arr: any,
    expectedLength: number,
    fallback: string,
  ): string[] {
    if (!Array.isArray(arr)) {
      return Array(expectedLength).fill(fallback);
    }

    const validItems = arr.filter(
      (item) => typeof item === "string" && item.length > 10,
    );

    // Pad with fallback if needed
    while (validItems.length < expectedLength) {
      validItems.push(fallback);
    }

    return validItems.slice(0, expectedLength);
  }

  private validateTop3Fits(
    fits: any,
    topPaths: BusinessPath[],
  ): { model: string; reason: string }[] {
    if (!Array.isArray(fits)) {
      return topPaths.slice(0, 3).map((path, index) => ({
        model: path.name,
        reason: `This business model aligns well with your ${
          index === 0 ? "top" : index === 1 ? "secondary" : "alternative"
        } strengths and offers a ${path.fitScore}% compatibility match.`,
      }));
    }

    const validFits = fits
      .filter(
        (fit) =>
          fit &&
          typeof fit.model === "string" &&
          typeof fit.reason === "string" &&
          fit.reason.length > 20,
      )
      .slice(0, 3);

    // Fill with fallbacks if needed
    while (validFits.length < 3 && validFits.length < topPaths.length) {
      const index = validFits.length;
      validFits.push({
        model: topPaths[index]?.name || "Business Model",
        reason: `This business model aligns well with your ${
          index === 0 ? "top" : index === 1 ? "secondary" : "alternative"
        } strengths and offers strong potential for success.`,
      });
    }

    return validFits;
  }

  private validateBottom3Avoid(avoid: any): {
    model: string;
    reason: string;
    futureConsideration?: string;
  }[] {
    if (!Array.isArray(avoid)) {
      return [
        {
          model: "High-risk speculation",
          reason: "Requires risk tolerance beyond your comfort level",
          futureConsideration: "Could be viable after building experience",
        },
        {
          model: "Complex technical development",
          reason: "May require more technical expertise than available",
          futureConsideration: "Consider after developing stronger skills",
        },
        {
          model: "High-investment businesses",
          reason: "Investment requirements exceed current budget",
          futureConsideration: "Revisit when you have more capital",
        },
      ];
    }

    const validAvoid = avoid
      .filter(
        (item) =>
          item &&
          typeof item.model === "string" &&
          typeof item.reason === "string" &&
          item.reason.length > 20,
      )
      .slice(0, 3);

    // Ensure we have at least 3 items
    while (validAvoid.length < 3) {
      validAvoid.push({
        model: "Misaligned business model",
        reason: "Does not align well with your current profile and goals",
        futureConsideration: "Could become viable as your skills develop",
      });
    }

    return validAvoid;
  }

  // Backward compatibility method - redirects to new structure
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
      // Get preview content from cache or generate it
      const previewData = await this.generateResultsPreview(quizData, topPaths);

      // Get the new streamlined insights
      const fullReportInsights = await this.generateFullReportInsights(
        quizData,
        topPaths,
        previewData.previewInsights,
        previewData.keyInsights,
      );

      // Convert to old format for backward compatibility
      return {
        personalizedSummary: previewData.previewInsights, // Reuse from preview
        customRecommendations: fullReportInsights.personalizedRecommendations,
        potentialChallenges: fullReportInsights.potentialChallenges,
        successStrategies: previewData.keyInsights, // Reuse from preview (renamed)
        personalizedActionPlan: this.getFallbackActionPlan(), // Hardcoded now
        motivationalMessage:
          "Your unique combination of skills and drive positions you perfectly for entrepreneurial success. Trust in your abilities and take that first step.",
      };
    } catch (error) {
      console.error("Error in backward compatibility method:", error);
      return this.generateFallbackInsights(quizData, topPaths);
    }
  }

  // Fallback method for backward compatibility
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
      personalizedSummary: `Based on your comprehensive assessment, ${topPath?.name || "your chosen business"} achieves a ${topPath?.fitScore || 75}% compatibility score with your unique profile. Your goals, personality traits, and available resources align well with this business model's requirements and potential outcomes.`,
      customRecommendations: this.getFallbackRecommendations(),
      potentialChallenges: this.getFallbackChallenges(),
      successStrategies: this.getFallbackStrategies(),
      personalizedActionPlan: this.getFallbackActionPlan(),
      motivationalMessage:
        "Your unique combination of skills, motivation, and strategic thinking creates a strong foundation for entrepreneurial success. Trust in your abilities, stay consistent with your efforts, and remember that every successful entrepreneur started exactly where you are now.",
    };
  }

  private createUserProfile(quizData: QuizData): string {
    return `
User Profile:
- Main Motivation: ${quizData.mainMotivation || "Not specified"}
- Income Goal: ${quizData.successIncomeGoal ? this.getIncomeGoalRange(quizData.successIncomeGoal) : "Not specified"}
- Time to First Income: ${quizData.firstIncomeTimeline || "Not specified"}
- Investment Budget: ${quizData.upfrontInvestment ? this.getInvestmentRange(quizData.upfrontInvestment) : "Not specified"}
- Weekly Time Commitment: ${quizData.weeklyTimeCommitment ? this.getTimeCommitmentRange(quizData.weeklyTimeCommitment) : "Not specified"}
- Tech Skills: ${quizData.techSkillsRating ? this.getRatingDescription(quizData.techSkillsRating) : "Not specified"}
- Brand Face Comfort: ${quizData.brandFaceComfort ? this.getRatingDescription(quizData.brandFaceComfort) : "Not specified"}
- Creative Work Enjoyment: ${quizData.creativeWorkEnjoyment ? this.getRatingDescription(quizData.creativeWorkEnjoyment) : "Not specified"}
- Communication Enjoyment: ${quizData.directCommunicationEnjoyment ? this.getRatingDescription(quizData.directCommunicationEnjoyment) : "Not specified"}
- Self Motivation: ${quizData.selfMotivationLevel ? this.getRatingDescription(quizData.selfMotivationLevel) : "Not specified"}
- Risk Comfort: ${quizData.riskComfortLevel ? this.getRatingDescription(quizData.riskComfortLevel) : "Not specified"}
- Work Structure Preference: ${quizData.workStructurePreference || "Not specified"}
- Work Collaboration Preference: ${quizData.workCollaborationPreference || "Not specified"}
- Decision Making Style: ${quizData.decisionMakingStyle || "Not specified"}
- Social Media Interest: ${quizData.socialMediaInterest ? this.getRatingDescription(quizData.socialMediaInterest) : "Not specified"}
- Familiar Tools: ${quizData.familiarTools?.join(", ") || "None specified"}
- Learning Preference: ${quizData.learningPreference || "Not specified"}
- Passion Alignment Importance: ${quizData.passionIdentityAlignment ? this.getRatingDescription(quizData.passionIdentityAlignment) : "Not specified"}
- Meaningful Contribution Importance: ${quizData.meaningfulContributionImportance ? this.getRatingDescription(quizData.meaningfulContributionImportance) : "Not specified"}
    `.trim();
  }

  private async generatePersonalizedSummary(
    userProfile: string,
    topPaths: any[],
  ): Promise<string> {
    // Debug logging to ensure we have the correct top business model
    console.log(
      "AI Summary - Top business paths:",
      topPaths.map((p) => `${p.name} (${p.fitScore}%)`),
    );

    const topBusinessModel = topPaths[0];
    const prompt = `
Based on this user profile, create a personalized 2-3 sentence summary that explains why ${topBusinessModel.name} is your perfect business match. Be specific about your personality traits and goals.

${userProfile}

FOCUS ON THIS TOP BUSINESS MATCH:
${topBusinessModel.name} (${topBusinessModel.fitScore}% compatibility)

Additional Context - Other matches:
${topPaths
  .slice(1, 3)
  .map((path, i) => `${i + 2}. ${path.name} (${path.fitScore}% match)`)
  .join("\n")}

Write a personalized summary that connects your specific traits to ${topBusinessModel.name}. Be encouraging and specific about why ${topBusinessModel.name} is your best fit.

CRITICAL: Use ONLY the actual data provided in the user profile. Do NOT make up specific numbers, amounts, or timeframes. Reference the exact ranges and values shown.
    `;

    try {
      const content = await this.makeOpenAIRequest(prompt, 200, 0.7);
      return (
        content ||
        `Your unique combination of traits makes you perfectly suited for ${topBusinessModel.name} success.`
      );
    } catch (error) {
      return `Your unique combination of traits makes you perfectly suited for ${topBusinessModel.name} success.`;
    }
  }

  private async generateCustomRecommendations(
    userProfile: string,
    topPaths: any[],
  ): Promise<string[]> {
    const topBusinessModel = topPaths[0];
    console.log(
      "AI Recommendations - Top business model:",
      topBusinessModel.name,
    );

    const prompt = `
Based on this user profile and your top business match (${topBusinessModel.name}), generate 6 specific, actionable recommendations tailored to your personality and goals for starting ${topBusinessModel.name}.

${userProfile}

PRIMARY FOCUS - TOP BUSINESS MATCH:
${topBusinessModel.name} (${topBusinessModel.fitScore}% compatibility)

Generate 6 personalized recommendations specifically for ${topBusinessModel.name} that consider your:
- Specific strengths and preferences
- Time availability and goals
- Risk tolerance and tech comfort
- Learning style and motivation level

Format as a simple list, each recommendation should be 1-2 sentences and actionable for ${topBusinessModel.name}.

CRITICAL: Use ONLY the actual data provided in the user profile. Do NOT make up specific numbers, amounts, or timeframes. Reference the exact ranges and values shown.
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
    try {
      const topBusinessModel = topPaths[0];
      console.log("AI Challenges - Top business model:", topBusinessModel.name);

      const prompt = `
Based on this user profile and your top business match (${topBusinessModel.name}), identify 4 specific challenges you might face when starting ${topBusinessModel.name} and how to address them.

${userProfile}

PRIMARY FOCUS - TOP BUSINESS MATCH:
${topBusinessModel.name} (${topBusinessModel.fitScore}% compatibility)

Generate 4 potential challenges specifically for ${topBusinessModel.name} that are based on your personality traits, goals, and this specific business path. For each challenge, include a brief solution or mitigation strategy.

Format as a simple list, each item should be 1-2 sentences and specific to ${topBusinessModel.name}.

CRITICAL: Use ONLY the actual data provided in the user profile. Do NOT make up specific numbers, amounts, or timeframes. Reference the exact ranges and values shown.
    `;

      const content = await this.makeOpenAIRequest(prompt, 350, 0.7);
      return this.parseListResponse(content, 4);
    } catch (error) {
      console.warn("generatePotentialChallenges error, using fallback:", error);
      return this.getFallbackChallenges();
    }
  }

  private async generateSuccessStrategies(
    userProfile: string,
    topPaths: any[],
  ): Promise<string[]> {
    try {
      const topBusinessModel = topPaths[0];
      console.log(
        "AI Success Strategies - Top business model:",
        topBusinessModel.name,
      );

      const prompt = `
Based on this user profile and your top business match (${topBusinessModel.name}), generate 6 specific success strategies that leverage your strengths for ${topBusinessModel.name}.

${userProfile}

PRIMARY FOCUS - TOP BUSINESS MATCH:
${topBusinessModel.name} (${topBusinessModel.fitScore}% compatibility)

Generate 6 success strategies specifically for ${topBusinessModel.name} that:
- Leverage your specific strengths and preferences
- Address your goals and timeline
- Work with your available time and resources
- Match your learning and work style
- Are specifically tailored to ${topBusinessModel.name}

Format as a simple list, each strategy should be 1-2 sentences and actionable for ${topBusinessModel.name}.

CRITICAL: Use ONLY the actual data provided in the user profile. Do NOT make up specific numbers, amounts, or timeframes. Reference the exact ranges and values shown.
    `;

      const content = await this.makeOpenAIRequest(prompt, 400, 0.7);
      return this.parseListResponse(content, 6);
    } catch (error) {
      console.warn("generateSuccessStrategies error, using fallback:", error);
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
Based on this user profile and your top business match, create a detailed action plan with specific tasks for Week 1, Month 1, Month 3, and Month 6.

${userProfile}

Top Business Match: ${topPath.name} (${topPath.fitScore}% match) - ${topPath.description}

Create a personalized action plan that considers your:
- Available time and resources
- Learning style and preferences
- Goals and timeline
- Strengths and challenges

For each timeframe, provide 3-4 specific, actionable tasks. Make sure the progression is logical and builds upon previous phases.

CRITICAL: Use ONLY the actual data provided in the user profile. Do NOT make up specific numbers, amounts, or timeframes. Reference the exact ranges and values shown in the user profile.

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
    const topBusinessModel = topPaths[0];
    console.log(
      "AI Motivational Message - Top business model:",
      topBusinessModel.name,
    );

    const prompt = `
Based on this user profile and your top business match (${topBusinessModel.name}), write an inspiring and personalized motivational message (2-3 sentences) that:
- Acknowledges your specific strengths for ${topBusinessModel.name}
- Connects to your goals and motivation
- Encourages you to take action in ${topBusinessModel.name}
- Feels personal and authentic

${userProfile}

Top Business Match: ${topBusinessModel.name} (${topBusinessModel.fitScore}% compatibility)

Write a motivational message that feels like it's coming from a mentor who truly understands you and believes in your potential for ${topBusinessModel.name}.

CRITICAL: Use ONLY the actual data provided in the user profile. Do NOT make up specific numbers, amounts, or timeframes. Reference the exact ranges and values shown.
    `;

    try {
      const content = await this.makeOpenAIRequest(prompt, 150, 0.8);
      return (
        content ||
        `Your unique combination of skills and drive positions you perfectly for ${topBusinessModel.name} success. Trust in your abilities and take that first step.`
      );
    } catch (error) {
      return `Your unique combination of skills and drive positions you perfectly for ${topBusinessModel.name} success. Trust in your abilities and take that first step.`;
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
  private generateFullReportFallbackInsights(
    quizData: QuizData,
    topPaths: BusinessPath[],
  ): {
    personalizedRecommendations: string[];
    potentialChallenges: string[];
    keyInsights: string[];
    bestFitCharacteristics: string[];
    top3Fits: { model: string; reason: string }[];
    bottom3Avoid: {
      model: string;
      reason: string;
      futureConsideration?: string;
    }[];
  } {
    return {
      personalizedRecommendations: [
        "Start with proven tools and systems to minimize learning curve",
        "Focus on systematic execution rather than trying to reinvent approaches",
        "Leverage your natural strengths while gradually building new skills",
        "Set realistic milestones and celebrate small wins along the way",
        "Join communities in your chosen field for support and networking",
        "Track your progress and adjust strategies based on results",
      ],
      potentialChallenges: [
        "Initial learning curve may require patience and persistence",
        "Building confidence to position yourself as an expert",
        "Managing time effectively between learning and doing",
        "Staying motivated during periods when results are slow",
      ],
      keyInsights: [
        "Your risk tolerance aligns well with entrepreneurial requirements",
        "Time commitment matches realistic income expectations",
        "Technical skills provide a solid foundation for success",
        "Communication preferences support customer relationship building",
      ],
      bestFitCharacteristics: [
        "Self-motivated and goal-oriented",
        "Strong analytical thinking",
        "Good communication skills",
        "Realistic expectations",
        "Willingness to learn and adapt",
        "Consistent and disciplined approach",
      ],
      top3Fits: topPaths.slice(0, 3).map((path, index) => ({
        model: path.name,
        reason: `This business model aligns well with your ${index === 0 ? "top" : index === 1 ? "secondary" : "alternative"} strengths and offers a ${path.fitScore}% compatibility match with your profile.`,
      })),
      bottom3Avoid: [
        {
          model: "High-risk speculation",
          reason: "Requires risk tolerance beyond your comfort level",
          futureConsideration:
            "Could be viable after building experience and capital",
        },
        {
          model: "Complex technical development",
          reason:
            "May require more technical expertise than currently available",
          futureConsideration:
            "Consider after developing stronger technical skills",
        },
        {
          model: "High-investment businesses",
          reason: "Investment requirements exceed your current budget",
          futureConsideration: "Revisit when you have more capital available",
        },
      ],
    };
  }

  private getRatingDescription(rating: number): string {
    if (rating >= 4.5) return "Very High";
    if (rating >= 4) return "High";
    if (rating >= 3) return "Moderate";
    if (rating >= 2) return "Low";
    return "Very Low";
  }

  private getIncomeGoalRange(value: number): string {
    if (value <= 500) return "Less than $500/month";
    if (value <= 1250) return "$500–$2,000/month";
    if (value <= 3500) return "$2,000–$5,000/month";
    return "$5,000+/month";
  }

  private getTimeCommitmentRange(value: number): string {
    if (value <= 3) return "Less than 5 hours/week";
    if (value <= 7) return "5–10 hours/week";
    if (value <= 17) return "10–25 hours/week";
    return "25+ hours/week";
  }

  private getInvestmentRange(value: number): string {
    if (value <= 0) return "$0 (bootstrap only)";
    if (value <= 125) return "Under $250";
    if (value <= 625) return "$250–$1,000";
    return "$1,000+";
  }

  private getFallbackContent(prompt: string): string {
    // Provide meaningful fallback content based on the prompt type
    if (prompt.includes("action plan") || prompt.includes("actionable steps")) {
      return `Week 1:\n• Research your target market and competition\n• Set up basic business infrastructure\n• Define your value proposition\n\nMonth 1:\n• Launch your minimum viable product/service\n• Start building your customer base\n• Establish your online presence\n\nMonth 3:\n• Optimize based on customer feedback\n• Scale your marketing efforts\n• Build strategic partnerships\n\nMonth 6:\n• Expand your offerings\n• Consider hiring or outsourcing\n• Plan for next growth phase`;
    }

    if (prompt.includes("avoid") || prompt.includes("poor fit")) {
      return "Models that require high upfront investment, complex technical skills you don't have, or time commitments that don't match your availability may not be ideal fits for your current situation.";
    }

    if (prompt.includes("challenge") || prompt.includes("obstacle")) {
      return "Common challenges include time management, maintaining motivation during slow initial growth, building consistent systems, and balancing learning new skills with executing your business plan.";
    }

    if (prompt.includes("strength") || prompt.includes("advantage")) {
      return "Your analytical approach to decision-making, willingness to learn, and realistic expectations about business growth create a strong foundation for entrepreneurial success.";
    }

    if (prompt.includes("recommendation") || prompt.includes("advice")) {
      return "Focus on building one core skill deeply rather than spreading yourself thin. Start with proven systems and gradually customize them to fit your unique situation. Prioritize consistency over perfection in your daily actions.";
    }

    // Generic fallback
    return "Based on your profile, focus on systematic execution of proven business strategies while leveraging your natural strengths and addressing potential challenges through continuous learning and adaptation.";
  }
}
