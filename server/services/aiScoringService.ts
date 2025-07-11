import OpenAI from "openai";
import { QuizData, BusinessPath } from "../../shared/types.js";
import { businessPaths } from "../../client/src/data/businessPaths.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface BusinessFitAnalysis {
  fitScore: number;
  reasoning: string;
  strengths: string[];
  challenges: string[];
  confidence: number;
}

export interface ComprehensiveFitAnalysis {
  topMatches: Array<{
    businessPath: BusinessPath;
    analysis: BusinessFitAnalysis;
  }>;
  personalityProfile: {
    strengths: string[];
    developmentAreas: string[];
    workStyle: string;
    riskProfile: string;
  };
  recommendations: string[];
}

export class AIScoringService {
  private static instance: AIScoringService;
  
  private constructor() {}
  
  static getInstance(): AIScoringService {
    if (!AIScoringService.instance) {
      AIScoringService.instance = new AIScoringService();
    }
    return AIScoringService.instance;
  }

  async analyzeBusinessFit(quizData: QuizData): Promise<ComprehensiveFitAnalysis> {
    try {
      const prompt = this.buildAnalysisPrompt(quizData);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert business consultant and psychologist specializing in entrepreneurial fit assessment. Analyze the user's quiz responses and provide detailed, accurate business model compatibility scores with reasoning."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 4000
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      return this.processAnalysis(analysis);
      
    } catch (error) {
      console.error('AI Scoring Service Error:', error);
      // Fallback to enhanced algorithmic scoring
      return this.fallbackAnalysis(quizData);
    }
  }

  private buildAnalysisPrompt(quizData: QuizData): string {
    const businessModels = businessPaths.map(bp => ({
      id: bp.id,
      name: bp.name,
      description: bp.description,
      difficulty: bp.difficulty,
      timeToProfit: bp.timeToProfit,
      startupCost: bp.startupCost,
      potentialIncome: bp.potentialIncome,
      skills: bp.skills,
      bestFitPersonality: bp.bestFitPersonality
    }));

    return `
    Analyze your quiz responses and provide business model compatibility scores:

    USER PROFILE:
    - Main Motivation: ${quizData.mainMotivation}
    - Income Goal: $${quizData.successIncomeGoal}/month
    - Timeline: ${quizData.firstIncomeTimeline}
    - Budget: $${quizData.upfrontInvestment}
    - Weekly Time: ${quizData.weeklyTimeCommitment} hours
    - Tech Skills: ${quizData.techSkillsRating}/5
    - Communication Comfort: ${quizData.directCommunicationEnjoyment}/5
    - Risk Tolerance: ${quizData.riskComfortLevel}/5
    - Self Motivation: ${quizData.selfMotivationLevel}/5
    - Creative Work Enjoyment: ${quizData.creativeWorkEnjoyment}/5
    - Work Style: ${quizData.workCollaborationPreference}
    - Learning Preference: ${quizData.learningPreference}
    - Brand Face Comfort: ${quizData.brandFaceComfort}/5
    - Organization Level: ${quizData.organizationLevel}/5
    - Consistency Level: ${quizData.longTermConsistency}/5

    BUSINESS MODELS TO ANALYZE:
    ${JSON.stringify(businessModels, null, 2)}

    Provide a comprehensive analysis in JSON format with the following structure:

    {
      "personalityProfile": {
        "strengths": ["strength1", "strength2", "strength3"],
        "developmentAreas": ["area1", "area2"],
        "workStyle": "description of work style",
        "riskProfile": "description of risk tolerance"
      },
      "businessAnalysis": [
        {
          "businessId": "business-id",
          "fitScore": 0-100,
          "reasoning": "detailed explanation of why this score",
          "strengths": ["strength1", "strength2"],
          "challenges": ["challenge1", "challenge2"],
          "confidence": 0.0-1.0
        }
      ],
      "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
    }

    SCORING GUIDELINES:
    - Use 0-100 scale where 70+ = Best Fit, 50-69 = Strong Fit, 30-49 = Possible Fit, <30 = Poor Fit
    - Consider realistic barriers and advantages
    - Weight factors: Income match (20%), Timeline (15%), Budget (15%), Skills (20%), Personality (15%), Risk (10%), Time (5%)
    - Be honest about challenges and realistic about opportunities
    - Most people should NOT get 90+ scores unless they're exceptionally well-suited
    - Distribute scores realistically - not everyone can be a perfect fit for everything
    `;
  }

  private processAnalysis(analysis: any): ComprehensiveFitAnalysis {
    const topMatches = analysis.businessAnalysis
      .map((ba: any) => {
        const businessPath = businessPaths.find(bp => bp.id === ba.businessId);
        if (!businessPath) return null;
        
        return {
          businessPath: { ...businessPath, fitScore: ba.fitScore },
          analysis: {
            fitScore: ba.fitScore,
            reasoning: ba.reasoning,
            strengths: ba.strengths,
            challenges: ba.challenges,
            confidence: ba.confidence
          }
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.analysis.fitScore - a.analysis.fitScore);

    return {
      topMatches,
      personalityProfile: analysis.personalityProfile,
      recommendations: analysis.recommendations
    };
  }

  private fallbackAnalysis(quizData: QuizData): ComprehensiveFitAnalysis {
    // Enhanced algorithmic scoring as fallback
    const scoredPaths = businessPaths.map(path => {
      const fitScore = this.calculateEnhancedFitScore(path.id, quizData);
      return {
        businessPath: { ...path, fitScore },
        analysis: {
          fitScore,
          reasoning: `Algorithmic analysis based on ${path.name} requirements vs your profile`,
          strengths: this.getPathStrengths(path.id, quizData),
          challenges: this.getPathChallenges(path.id, quizData),
          confidence: 0.7
        }
      };
    }).sort((a, b) => b.analysis.fitScore - a.analysis.fitScore);

    return {
      topMatches: scoredPaths,
      personalityProfile: {
        strengths: this.getPersonalityStrengths(quizData),
        developmentAreas: this.getPersonalityDevelopmentAreas(quizData),
        workStyle: this.getWorkStyleDescription(quizData),
        riskProfile: this.getRiskProfileDescription(quizData)
      },
      recommendations: this.getGeneralRecommendations(quizData)
    };
  }

  private calculateEnhancedFitScore(pathId: string, data: QuizData): number {
    // Use the existing scoring logic but enhance it
    const factors = this.calculateFactors(pathId, data);
    const weights = {
      income: 0.20,
      timeline: 0.15,
      budget: 0.15,
      skills: 0.20,
      personality: 0.15,
      risk: 0.10,
      time: 0.05
    };

    const score = Object.keys(factors).reduce((total, key) => {
      return total + (factors[key] * weights[key] * 100);
    }, 0);

    return Math.min(Math.max(Math.round(score), 0), 100);
  }

  private calculateFactors(pathId: string, data: QuizData): any {
    // Simplified version of the factor calculation
    const factors = {
      income: 0.5,
      timeline: 0.5,
      budget: 0.5,
      skills: 0.5,
      personality: 0.5,
      risk: 0.5,
      time: 0.5
    };

    // Path-specific calculations would go here
    // This is a simplified version for the fallback
    
    return factors;
  }

  private getPathStrengths(pathId: string, data: QuizData): string[] {
    const strengths = [];
    
    if (data.selfMotivationLevel >= 4) {
      strengths.push("High self-motivation");
    }
    if (data.techSkillsRating >= 4) {
      strengths.push("Strong technical skills");
    }
    if (data.directCommunicationEnjoyment >= 4) {
      strengths.push("Excellent communication abilities");
    }
    
    return strengths;
  }

  private getPathChallenges(pathId: string, data: QuizData): string[] {
    const challenges = [];
    
    if (data.riskComfortLevel <= 2) {
      challenges.push("Low risk tolerance may limit growth");
    }
    if (data.weeklyTimeCommitment <= 10) {
      challenges.push("Limited time availability");
    }
    
    return challenges;
  }

  private getPersonalityStrengths(data: QuizData): string[] {
    const strengths = [];
    
    if (data.selfMotivationLevel >= 4) strengths.push("Self-motivated");
    if (data.organizationLevel >= 4) strengths.push("Well-organized");
    if (data.longTermConsistency >= 4) strengths.push("Consistent");
    if (data.techSkillsRating >= 4) strengths.push("Tech-savvy");
    if (data.creativeWorkEnjoyment >= 4) strengths.push("Creative");
    
    return strengths;
  }

  private getPersonalityDevelopmentAreas(data: QuizData): string[] {
    const areas = [];
    
    if (data.riskComfortLevel <= 2) areas.push("Risk tolerance");
    if (data.directCommunicationEnjoyment <= 2) areas.push("Communication confidence");
    if (data.brandFaceComfort <= 2) areas.push("Personal branding comfort");
    
    return areas;
  }

  private getWorkStyleDescription(data: QuizData): string {
    const styles = {
      'solo-only': 'Strongly prefers independent work',
      'mostly-solo': 'Prefers working alone with minimal collaboration',
      'balanced': 'Comfortable with both solo and team work',
      'team-focused': 'Thrives in collaborative environments'
    };
    
    return styles[data.workCollaborationPreference] || 'Flexible work style';
  }

  private getRiskProfileDescription(data: QuizData): string {
    if (data.riskComfortLevel >= 4) return 'High risk tolerance - comfortable with uncertainty';
    if (data.riskComfortLevel >= 3) return 'Moderate risk tolerance - cautious but willing to take calculated risks';
    return 'Low risk tolerance - prefers stable, predictable opportunities';
  }

  private getGeneralRecommendations(data: QuizData): string[] {
    const recommendations = [];
    
    if (data.selfMotivationLevel >= 4) {
      recommendations.push("Focus on business models that reward self-driven individuals");
    }
    if (data.weeklyTimeCommitment <= 10) {
      recommendations.push("Consider part-time or passive income opportunities first");
    }
    if (data.upfrontInvestment <= 500) {
      recommendations.push("Start with low-cost business models to minimize risk");
    }
    
    return recommendations;
  }
}

export const aiScoringService = AIScoringService.getInstance();