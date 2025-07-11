import { Resend } from 'resend';
import type { QuizData } from '../../shared/types';
import { calculateAllBusinessModelMatches } from '../../shared/scoring';
import { calculatePersonalityScores, getPersonalityDescription } from '../../shared/personalityScoring';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper functions to convert stored numbers back to original quiz ranges
const getIncomeRangeLabel = (value: number): string => {
  if (value === 500) return "Less than $500";
  if (value === 1250) return "$500–$2,000";
  if (value === 3500) return "$2,000–$5,000";
  if (value === 7500) return "$5,000+";
  return `$${value}`;
};

const getInvestmentRangeLabel = (value: number): string => {
  if (value === 0) return "$0";
  if (value === 125) return "Under $250";
  if (value === 625) return "$250–$1,000";
  if (value === 1500) return "$1,000+";
  return `$${value}`;
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
    "no-rush": "No rush"
  };
  return labels[value] || value.replace("-", " ");
};

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private static instance: EmailService;
  
  private constructor() {}
  
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }

    try {
      const { data, error } = await resend.emails.send({
        from: 'BizModelAI <onboarding@resend.dev>',
        to: [options.to],
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        console.error('Error sending email:', error);
        return false;
      }

      console.log('Email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendQuizResults(email: string, quizData: QuizData): Promise<boolean> {
    const subject = 'Your BizModelAI Business Path Results';
    const html = this.generateQuizResultsHTML(quizData);
    
    return await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  async sendWelcomeEmail(email: string): Promise<boolean> {
    const subject = 'Welcome to BizModelAI!';
    const html = this.generateWelcomeHTML();
    
    return await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  async sendFullReport(email: string, quizData: QuizData): Promise<boolean> {
    const subject = 'Your Complete BizModelAI Business Report';
    const html = this.generateFullReportHTML(quizData);
    
    return await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  private generateQuizResultsHTML(quizData: QuizData): string {
    const topBusinessModel = this.getTopBusinessModel(quizData);
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light">
          <title>Your BizModelAI Results</title>
          <style>
            ${this.getBrighterStyles()}
          </style>
        </head>
        <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC !important; color: #000000 !important;">
          <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #FFFFFF !important; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); border: 1px solid #E5E7EB;">
            <div class="header" style="background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white !important; padding: 50px 40px; text-align: center; position: relative; overflow: hidden;">
              <div class="logo" style="width: 70px; height: 70px; background: #7C3AED; border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);"></div>
              <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 12px; position: relative; z-index: 1; color: white !important;">Your Business Path Results</h1>
              <p style="font-size: 18px; opacity: 0.95; position: relative; z-index: 1; color: white !important;">AI-Powered Recommendations Just for You</p>
            </div>
            
            <div class="content" style="padding: 50px 40px; background: #FFFFFF !important; color: #000000 !important;">
              <div class="section" style="margin-bottom: 40px;">
                <h2 class="section-title" style="font-size: 22px; font-weight: 600; color: #000000 !important; margin-bottom: 20px; display: flex; align-items: center;">🎯 Your Best Fit Business Model</h2>
                <div class="top-match-card" style="background: #FFFFFF !important; border: 2px solid #E5E7EB; border-radius: 16px; padding: 30px; margin-bottom: 30px; position: relative; text-align: center; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                  <div class="match-badge" style="background: linear-gradient(135deg, #10B981, #059669); color: white !important; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 16px;">Perfect Match</div>
                  <h3 class="match-name" style="font-size: 24px; font-weight: 700; color: #000000 !important; margin-bottom: 12px;">${topBusinessModel.name}</h3>
                  <p class="match-description" style="font-size: 16px; color: #333333 !important; margin-bottom: 20px; line-height: 1.5;">${topBusinessModel.description}</p>
                  <div class="match-score" style="display: inline-flex; align-items: center; background: linear-gradient(135deg, #2563EB, #7C3AED); color: white !important; padding: 12px 24px; border-radius: 25px; font-weight: 600;">
                    <span class="score-label" style="margin-right: 8px; font-size: 14px; color: white !important;">Fit Score:</span>
                    <span class="score-value" style="font-size: 18px; font-weight: 700; color: white !important;">${topBusinessModel.fitScore}%</span>
                  </div>
                </div>
              </div>

              <div class="section" style="margin-bottom: 40px;">
                <h2 class="section-title" style="font-size: 22px; font-weight: 600; color: #000000 !important; margin-bottom: 20px; display: flex; align-items: center;">Your Business Profile</h2>
                <div class="profile-card" style="background: #FFFFFF !important; border: 1px solid #E5E7EB; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
                  <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F3F4F6;">
                    <span class="profile-label" style="font-weight: 500; color: #6B7280 !important; font-size: 15px;">Main Motivation</span>
                    <span class="profile-value" style="font-weight: 600; color: #000000 !important; font-size: 15px;">${this.formatMotivation(quizData.mainMotivation)}</span>
                  </div>
                  <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F3F4F6;">
                    <span class="profile-label" style="font-weight: 500; color: #6B7280 !important; font-size: 15px;">Income Goal</span>
                    <span class="profile-value" style="font-weight: 600; color: #000000 !important; font-size: 15px;">${getIncomeRangeLabel(quizData.successIncomeGoal)}</span>
                  </div>
                  <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F3F4F6;">
                    <span class="profile-label" style="font-weight: 500; color: #6B7280 !important; font-size: 15px;">Timeline</span>
                    <span class="profile-value" style="font-weight: 600; color: #000000 !important; font-size: 15px;">${this.formatTimeline(quizData.firstIncomeTimeline)}</span>
                  </div>
                  <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0;">
                    <span class="profile-label" style="font-weight: 500; color: #6B7280 !important; font-size: 15px;">Investment Budget</span>
                    <span class="profile-value" style="font-weight: 600; color: #000000 !important; font-size: 15px;">${getInvestmentRangeLabel(quizData.upfrontInvestment)}</span>
                  </div>
                </div>
              </div>

              <div class="section" style="margin-bottom: 40px;">
                <h2 class="section-title" style="font-size: 22px; font-weight: 600; color: #000000 !important; margin-bottom: 20px; display: flex; align-items: center;">What's Waiting for You</h2>
                <ul class="steps-list" style="list-style: none; padding: 0; background: #FFFFFF !important;">
                  <li style="padding: 16px 0; padding-left: 50px; position: relative; color: #000000 !important; font-size: 16px; line-height: 1.5;">View your top-matched business models with personalized fit scores</li>
                  <li style="padding: 16px 0; padding-left: 50px; position: relative; color: #000000 !important; font-size: 16px; line-height: 1.5;">Get detailed step-by-step implementation guides</li>
                  <li style="padding: 16px 0; padding-left: 50px; position: relative; color: #000000 !important; font-size: 16px; line-height: 1.5;">Access curated resources, tools, and templates</li>
                  <li style="padding: 16px 0; padding-left: 50px; position: relative; color: #000000 !important; font-size: 16px; line-height: 1.5;">Download your comprehensive PDF business report</li>
                  <li style="padding: 16px 0; padding-left: 50px; position: relative; color: #000000 !important; font-size: 16px; line-height: 1.5;">Explore income projections and timeline expectations</li>
                </ul>
              </div>

              <div class="cta-container" style="text-align: center; padding: 30px; background: #FFFFFF !important; border-radius: 12px; border: 1px solid #F3F4F6; margin-top: 20px;">
                <a href="${process.env.FRONTEND_URL || 'https://bizmodelai.com'}/results" class="cta-button" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white !important; padding: 20px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 18px; text-align: center; margin: 30px 0; box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);">
                  View Your Full Results →
                </a>
                <p style="margin-top: 16px; font-size: 14px; color: #6B7280 !important;">
                  Your personalized business blueprint is ready to explore
                </p>
              </div>
            </div>

            <div class="footer" style="background: #FFFFFF !important; padding: 40px; text-align: center; border-top: 1px solid #F3F4F6;">
              <div class="footer-logo" style="font-size: 20px; font-weight: 700; color: #000000 !important; margin-bottom: 10px;">BizModelAI</div>
              <div class="footer-tagline" style="color: #6B7280 !important; font-size: 16px; margin-bottom: 20px;">Your AI-Powered Business Discovery Platform</div>
              <div class="footer-disclaimer" style="font-size: 14px; color: #9CA3AF !important; line-height: 1.5; margin-bottom: 16px;">
                This email was sent because you completed our business assessment quiz.<br>
                We're here to help you discover your perfect business path.
              </div>
              <div class="footer-unsubscribe" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #F3F4F6;">
                <a href="${process.env.FRONTEND_URL || 'https://bizmodelai.com'}/unsubscribe" class="unsubscribe-link" style="color: #6B7280 !important; text-decoration: none; font-size: 14px; padding: 8px 16px; border-radius: 6px;">
                  Unsubscribe
                </a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private formatMotivation(motivation: string): string {
    const motivationMap: { [key: string]: string } = {
      'financial-freedom': 'Financial Freedom',
      'flexible-schedule': 'Flexible Schedule',
      'passion-project': 'Passion Project',
      'career-change': 'Career Change',
      'side-income': 'Side Income',
      'creative-expression': 'Creative Expression'
    };
    return motivationMap[motivation] || motivation;
  }

  private formatTimeline(timeline: string): string {
    const timelineMap: { [key: string]: string } = {
      'immediately': 'Immediately',
      '1-3-months': '1-3 Months',
      '3-6-months': '3-6 Months',
      '6-12-months': '6-12 Months',
      '1-year-plus': '1+ Years'
    };
    return timelineMap[timeline] || timeline;
  }

  private getTopBusinessModel(quizData: QuizData): { name: string; description: string; fitScore: number } {
    // Use the same scoring algorithm as the frontend
    const scoredBusinessModels = calculateAllBusinessModelMatches(quizData);
    
    // Get the top match (highest score)
    const topMatch = scoredBusinessModels[0];
    
    // Map business model descriptions
    const businessDescriptions: { [key: string]: string } = {
      'Affiliate Marketing': 'Promote other people\'s products and earn commission on sales',
      'Content Creation / UGC': 'Create valuable content and monetize through multiple channels',
      'Online Tutoring / Coaching': 'Share your expertise through 1-on-1 or group coaching programs',
      'E-commerce Brand Building': 'Sell physical or digital products through your own online store',
      'Freelancing': 'Offer your skills and services to clients on a project basis',
      'Copywriting / Ghostwriting': 'Write compelling content for businesses and individuals',
      'Social Media Marketing Agency': 'Help businesses grow their social media presence',
      'Virtual Assistant': 'Provide administrative and business support remotely',
      'High-Ticket Sales / Closing': 'Sell high-value products or services for businesses',
      'AI Marketing Agency': 'Leverage AI tools to provide marketing solutions',
      'Digital Services Agency': 'Offer digital marketing and web services',
      'YouTube Automation': 'Create and manage monetized YouTube channels',
      'Investing / Trading': 'Generate income through financial markets',
      'Online Reselling': 'Buy and resell products online for profit',
      'Handmade Goods': 'Create and sell handcrafted products'
    };

    return {
      name: topMatch.name,
      description: businessDescriptions[topMatch.name] || 'A business model tailored to your skills and goals',
      fitScore: Math.round(topMatch.score)
    };
  }

  private generateWelcomeHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light">
          <title>Welcome to BizModelAI</title>
          <style>
            ${this.getBrighterStyles()}
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo"></div>
              <h1>Welcome to BizModelAI!</h1>
              <p>Your journey to business success starts here</p>
            </div>
            
            <div class="content">
              <div class="section">
                <h2 class="section-title">What's Next?</h2>
                <ul class="steps-list">
                  <li>Complete our comprehensive business assessment quiz</li>
                  <li>Get personalized business model recommendations</li>
                  <li>Access detailed implementation guides and resources</li>
                  <li>Download your complete business strategy report</li>
                </ul>
              </div>

              <div class="cta-container">
                <a href="${process.env.FRONTEND_URL || 'https://bizmodelai.com'}/quiz" class="cta-button">
                  Start Your Assessment →
                </a>
                <p style="margin-top: 12px; font-size: 14px; color: #6B7280;">
                  Takes just 10-15 minutes to complete
                </p>
              </div>
            </div>

            <div class="footer">
              <div class="footer-logo">BizModelAI</div>
              <div class="footer-tagline">Your AI-Powered Business Discovery Platform</div>
              <div class="footer-disclaimer">
                Ready to discover your perfect business path?<br>
                We're here to guide you every step of the way.
              </div>
              <div class="footer-unsubscribe">
                <a href="${process.env.FRONTEND_URL || 'https://bizmodelai.com'}/unsubscribe" class="unsubscribe-link">
                  Unsubscribe
                </a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateFullReportHTML(quizData: QuizData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light">
          <title>Your Complete Business Report</title>
          <style>
            ${this.getBrighterStyles()}
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo"></div>
              <h1>Your Complete Business Report</h1>
              <p>Comprehensive insights and actionable strategies</p>
            </div>
            
            <div class="content">
              <div class="section">
                <h2 class="section-title">Report Contents</h2>
                <ul class="steps-list">
                  <li>Detailed personality and skills analysis</li>
                  <li>Top 5 business models ranked by fit score</li>
                  <li>Step-by-step implementation roadmaps</li>
                  <li>Income projections and timeline expectations</li>
                  <li>Curated resources and tools for each path</li>
                  <li>Risk assessment and mitigation strategies</li>
                </ul>
              </div>

              <div class="cta-container">
                <a href="${process.env.FRONTEND_URL || 'https://bizmodelai.com'}/results" class="cta-button">
                  Download Your PDF Report →
                </a>
                <p style="margin-top: 12px; font-size: 14px; color: #6B7280;">
                  Your comprehensive business strategy guide
                </p>
              </div>
            </div>

            <div class="footer">
              <div class="footer-logo">BizModelAI</div>
              <div class="footer-tagline">Your AI-Powered Business Discovery Platform</div>
              <div class="footer-disclaimer">
                This detailed report is personalized just for you.<br>
                Start building your business with confidence.
              </div>
              <div class="footer-unsubscribe">
                <a href="${process.env.FRONTEND_URL || 'https://bizmodelai.com'}/unsubscribe" class="unsubscribe-link">
                  Unsubscribe
                </a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getBrighterStyles(): string {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      /* Force light mode - prevent email clients from applying dark mode styles */
      [data-ogsc] * {
        color: inherit !important;
        background-color: inherit !important;
      }
      
      [data-ogsb] * {
        color: inherit !important;
        background-color: inherit !important;
      }
      
      /* Outlook dark mode overrides */
      [data-outlook-cycle] * {
        color: inherit !important;
        background-color: inherit !important;
      }
      
      /* Apple Mail dark mode overrides */
      @media (prefers-color-scheme: dark) {
        .email-container {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
        
        .content {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
        
        .footer {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
        
        .profile-card {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
        
        .top-match-card {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
        
        .section-title {
          color: #000000 !important;
        }
        
        .match-name {
          color: #000000 !important;
        }
        
        .match-description {
          color: #333333 !important;
        }
        
        .profile-value {
          color: #000000 !important;
        }
        
        .steps-list li {
          color: #000000 !important;
        }
        
        .footer-logo {
          color: #000000 !important;
        }
        
        body {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
      }
      
      /* Gmail dark mode overrides */
      u + .body .email-container {
        background-color: #FFFFFF !important;
        color: #000000 !important;
      }
      
      /* Additional dark mode prevention */
      .ExternalClass {
        width: 100%;
      }
      
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
      
      /* Force white background on all containers */
      table, td, div, p, span {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      
      /* Meta tags to prevent dark mode */
      meta[name="color-scheme"] {
        content: light !important;
      }
      
      meta[name="supported-color-schemes"] {
        content: light !important;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #000000;
        background-color: #FFFFFF;
        padding: 20px;
      }
      
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: #FFFFFF;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid #F3F4F6;
      }
      
      .header {
        background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
        color: white;
        padding: 50px 40px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
        animation: pulse 4s ease-in-out infinite;
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.05); opacity: 0.9; }
      }
      
      .logo {
        width: 70px;
        height: 70px;
        background: #7C3AED;
        border-radius: 50%;
        margin: 0 auto 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
        box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);
      }
      
      .logo::after {
        content: '';
        width: 28px;
        height: 35px;
        background: white;
        clip-path: polygon(50% 0%, 0% 60%, 30% 60%, 30% 100%, 70% 100%, 70% 60%, 100% 60%);
      }
      
      .header h1 {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 12px;
        position: relative;
        z-index: 1;
      }
      
      .header p {
        font-size: 18px;
        opacity: 0.95;
        position: relative;
        z-index: 1;
      }
      
      .content {
        padding: 50px 40px;
        background: #FFFFFF;
        color: #000000;
      }
      
      .section {
        margin-bottom: 40px;
      }
      
      .section-title {
        font-size: 22px;
        font-weight: 600;
        color: #000000;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
      }
      
      .section-title::before {
        content: '';
        width: 4px;
        height: 24px;
        background: linear-gradient(135deg, #2563EB, #7C3AED);
        border-radius: 2px;
        margin-right: 16px;
      }
      
      .top-match-card {
        background: linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%);
        border: 2px solid #E5E7EB;
        border-radius: 16px;
        padding: 30px;
        margin-bottom: 30px;
        position: relative;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      }
      
      .match-badge {
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        display: inline-block;
        margin-bottom: 16px;
      }
      
      .match-name {
        font-size: 24px;
        font-weight: 700;
        color: #000000;
        margin-bottom: 12px;
      }
      
      .match-description {
        font-size: 16px;
        color: #333333;
        margin-bottom: 20px;
        line-height: 1.5;
      }
      
      .match-score {
        display: inline-flex;
        align-items: center;
        background: linear-gradient(135deg, #2563EB, #7C3AED);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: 600;
      }
      
      .score-label {
        margin-right: 8px;
        font-size: 14px;
      }
      
      .score-value {
        font-size: 18px;
        font-weight: 700;
      }
      
      .profile-card {
        background: #FFFFFF;
        border: 1px solid #E5E7EB;
        border-radius: 12px;
        padding: 30px;
        margin-bottom: 30px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }
      
      .profile-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid #F3F4F6;
      }
      
      .profile-item:last-child {
        border-bottom: none;
      }
      
      .profile-label {
        font-weight: 500;
        color: #6B7280;
        font-size: 15px;
      }
      
      .profile-value {
        font-weight: 600;
        color: #000000;
        font-size: 15px;
      }
      
      .steps-list {
        list-style: none;
        padding: 0;
        background: #FFFFFF;
      }
      
      .steps-list li {
        padding: 16px 0;
        padding-left: 50px;
        position: relative;
        color: #000000;
        font-size: 16px;
        line-height: 1.5;
      }
      
      .steps-list li::before {
        content: '✓';
        position: absolute;
        left: 0;
        top: 16px;
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
      }
      
      .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
        color: white;
        padding: 20px 40px;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 600;
        font-size: 18px;
        text-align: center;
        margin: 30px 0;
        transition: all 0.3s ease;
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(37, 99, 235, 0.4);
      }
      
      .cta-container {
        text-align: center;
        padding: 30px;
        background: #FFFFFF;
        border-radius: 12px;
        border: 1px solid #F3F4F6;
        margin-top: 20px;
      }
      
      .footer {
        background: #FFFFFF;
        padding: 40px;
        text-align: center;
        border-top: 1px solid #F3F4F6;
      }
      
      .footer-logo {
        font-size: 20px;
        font-weight: 700;
        color: #000000;
        margin-bottom: 10px;
      }
      
      .footer-tagline {
        color: #6B7280;
        font-size: 16px;
        margin-bottom: 20px;
      }
      
      .footer-disclaimer {
        font-size: 14px;
        color: #9CA3AF;
        line-height: 1.5;
        margin-bottom: 16px;
      }
      
      .footer-unsubscribe {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #F3F4F6;
      }
      
      .unsubscribe-link {
        color: #6B7280;
        text-decoration: none;
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 6px;
        transition: all 0.3s ease;
      }
      
      .unsubscribe-link:hover {
        color: #374151;
        background: #F9FAFB;
      }
      
      @media (max-width: 480px) {
        body {
          padding: 10px;
        }
        
        .email-container {
          border-radius: 0;
          margin: 0;
        }
        
        .header {
          padding: 40px 20px;
        }
        
        .content {
          padding: 40px 20px;
        }
        
        .header h1 {
          font-size: 28px;
        }
        
        .cta-button {
          width: 100%;
          padding: 16px 20px;
        }
        
        .profile-card, .top-match-card {
          padding: 20px;
        }
        
        .footer {
          padding: 30px 20px;
        }
      }
    `;
  }

  private getBaseStyles(): string {
    return this.getBrighterStyles();
  }
}

export const emailService = EmailService.getInstance();