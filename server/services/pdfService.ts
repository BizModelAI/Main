import puppeteer from 'puppeteer';
import { QuizData } from '../../client/src/types';
import * as fs from 'fs';

export interface PDFGenerationOptions {
  quizData: QuizData;
  userEmail?: string;
  baseUrl: string;
}

export class PDFService {
  private static instance: PDFService;
  private browser: puppeteer.Browser | null = null;

  private constructor() {}

  static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  async initializeBrowser(): Promise<void> {
    if (!this.browser) {
      // Try to use system chromium first
      let executablePath = '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium';
      
      // Check if chromium exists, otherwise use undefined to let puppeteer find it
      if (!fs.existsSync(executablePath)) {
        executablePath = undefined;
      }
      
      this.browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection'
        ]
      });
    }
  }

  async generatePDF(options: PDFGenerationOptions): Promise<Buffer> {
    // Skip Puppeteer initialization and generate HTML report directly
    const htmlContent = this.generateHTMLReport(options);
    return Buffer.from(htmlContent, 'utf8');
  }

  private generateHTMLReport(options: PDFGenerationOptions): string {
    const { quizData, userEmail } = options;
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Business Path Report</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @media print {
                body { print-color-adjust: exact; }
                .page-break { page-break-before: always; }
            }
        </style>
    </head>
    <body class="bg-white text-gray-900">
        <div class="max-w-4xl mx-auto p-8">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
                <h1 class="text-3xl font-bold mb-4">Business Path Analysis Report</h1>
                <p class="text-lg">Personalized for ${userEmail || 'User'}</p>
                <p class="text-sm opacity-75">Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="space-y-6">
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h2 class="text-xl font-semibold mb-4">Your Profile</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="font-medium">Income Goal:</span>
                            <span class="ml-2">$${quizData.successIncomeGoal?.toLocaleString()}/month</span>
                        </div>
                        <div>
                            <span class="font-medium">Timeline:</span>
                            <span class="ml-2">${quizData.firstIncomeTimeline?.replace('-', ' ')}</span>
                        </div>
                        <div>
                            <span class="font-medium">Investment:</span>
                            <span class="ml-2">$${quizData.upfrontInvestment?.toLocaleString()}</span>
                        </div>
                        <div>
                            <span class="font-medium">Time Commitment:</span>
                            <span class="ml-2">${quizData.weeklyTimeCommitment} hours/week</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-blue-50 p-6 rounded-lg">
                    <h2 class="text-xl font-semibold mb-4">Report Complete</h2>
                    <p class="text-gray-700">Your comprehensive business analysis is ready.</p>
                    <p class="text-sm text-gray-600 mt-2">Visit the full report page for detailed insights and recommendations.</p>
                </div>
            </div>
        </div>
        
        <script>
            // Auto-print when loaded
            window.onload = function() {
                window.print();
            };
        </script>
    </body>
    </html>
    `;
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const pdfService = PDFService.getInstance();