import { BusinessPath } from './types.js';

export const businessPaths: BusinessPath[] = [
  {
    id: 'content-creation-ugc',
    name: 'Content Creation / UGC',
    description: 'Create videos, photos, blogs, or social media posts for personal brands or other businesses',
    detailedDescription: 'Content creation and user-generated content (UGC) involve producing videos, photos, blogs, or social media posts for personal brands or other businesses. UGC creators are often paid by companies to create native-style content that aligns with the brand\'s identity but feels organic to viewers.',
    fitScore: 0,
    difficulty: 'Easy',
    timeToProfit: '2-4 weeks',
    startupCost: '$0-300',
    potentialIncome: '$0-20K/month',
    pros: [
      'Extremely low barrier to entry',
      'Creative freedom and self-expression',
      'Potential for large income with no inventory',
      'Flexible work schedule',
      'Builds long-term personal brand equity',
      'Opens opportunities in many niches'
    ],
    cons: [
      'Algorithms can change rapidly',
      'Time-intensive content planning and editing',
      'Emotional toll of public feedback',
      'Inconsistent income early on',
      'High competition and saturation',
      'Burnout is common without balance'
    ],
    tools: ['CapCut', 'Canva', 'TikTok', 'Instagram', 'Notion'],
    skills: ['Creative thinking', 'Communication', 'Social media', 'Visual storytelling', 'Trend awareness'],
    icon: 'TrendingUp',
    marketSize: 'Creator economy valued at over $104B',
    averageIncome: {
      beginner: '$0-500/month',
      intermediate: '$500-5K/month',
      advanced: '$5K-20K/month'
    },
    userStruggles: [
      'Consistency challenges',
      'Audience growth',
      'Monetization timing',
      'Negative feedback handling'
    ],
    solutions: [
      'Content calendar planning',
      'Focus on niche audience',
      'Diversify revenue streams',
      'Build thick skin and community'
    ],
    bestFitPersonality: [
      'Creative and innovative',
      'Patient and persistent',
      'Comfortable on camera',
      'Resilient to criticism'
    ],
    resources: {
      platforms: ['YouTube', 'TikTok', 'Instagram', 'Creator Now'],
      learning: ['YouTube Creator Academy', 'Creator economy courses'],
      tools: ['CapCut', 'Canva', 'Later', 'Notion']
    },
    actionPlan: {
      phase1: [
        'Choose content niche',
        'Set up equipment',
        'Create content calendar',
        'Post consistently'
      ],
      phase2: [
        'Engage with audience',
        'Collaborate with others',
        'Optimize for algorithms',
        'Track analytics'
      ],
      phase3: [
        'Monetize through ads',
        'Secure sponsorships',
        'Launch own products',
        'Expand to new platforms'
      ]
    }
  },
  {
    id: 'freelancing',
    name: 'Freelancing',
    description: 'Offer specialized services to clients on a project or contract basis',
    detailedDescription: 'Freelancing involves offering specialized services to clients on a project or contract basis. This could include writing, graphic design, web development, marketing, consulting, or any skill-based service. Freelancers work independently, often with multiple clients, and have the flexibility to choose their projects and set their rates.',
    fitScore: 0,
    difficulty: 'Easy',
    timeToProfit: '1-2 weeks',
    startupCost: '$0-500',
    potentialIncome: '$1K-15K+/month',
    pros: [
      'Quick to start with existing skills',
      'Complete schedule flexibility',
      'Choose your own clients and projects',
      'No inventory or upfront costs',
      'Can work from anywhere',
      'Direct relationship with income and effort'
    ],
    cons: [
      'Income can be inconsistent',
      'No benefits or job security',
      'Constant client acquisition needed',
      'Time-for-money limitation',
      'Handling all business aspects alone',
      'Potential for scope creep and difficult clients'
    ],
    tools: ['Upwork', 'Fiverr', 'LinkedIn', 'Slack', 'Zoom'],
    skills: ['Specialized expertise', 'Client communication', 'Project management', 'Time management', 'Networking'],
    icon: 'Briefcase',
    marketSize: 'Freelance economy worth $400B+ globally',
    averageIncome: {
      beginner: '$500-2K/month',
      intermediate: '$2K-8K/month',
      advanced: '$8K-15K+/month'
    },
    userStruggles: [
      'Finding consistent clients',
      'Pricing services appropriately',
      'Managing multiple projects',
      'Dealing with difficult clients'
    ],
    solutions: [
      'Build strong portfolio and testimonials',
      'Develop recurring client relationships',
      'Use project management tools',
      'Set clear boundaries and contracts'
    ],
    bestFitPersonality: [
      'Self-motivated and disciplined',
      'Strong communication skills',
      'Adaptable to different clients',
      'Business-minded'
    ],
    resources: {
      platforms: ['Upwork', 'Fiverr', 'LinkedIn', 'Freelancer'],
      learning: ['Freelancer courses', 'Industry certifications'],
      tools: ['Slack', 'Zoom', 'Trello', 'FreshBooks']
    },
    actionPlan: {
      phase1: [
        'Identify your skills',
        'Create portfolio',
        'Set up profiles on platforms',
        'Apply for first projects'
      ],
      phase2: [
        'Deliver quality work',
        'Collect testimonials',
        'Raise your rates',
        'Build repeat clients'
      ],
      phase3: [
        'Specialize in high-value niches',
        'Create passive income streams',
        'Build a personal brand',
        'Consider hiring subcontractors'
      ]
    }
  },
  // Add more business paths as needed
  {
    id: 'affiliate-marketing',
    name: 'Affiliate Marketing',
    description: 'Promote other companies\' products and earn commissions on successful referrals',
    detailedDescription: 'Affiliate marketing involves promoting other companies\' products or services and earning a commission for each sale or lead generated through your referral. This can be done through blogs, social media, email marketing, or paid advertising.',
    fitScore: 0,
    difficulty: 'Medium',
    timeToProfit: '3-6 months',
    startupCost: '$0-1000',
    potentialIncome: '$0-50K+/month',
    pros: [
      'No product creation required',
      'Passive income potential',
      'Low startup costs',
      'Flexible schedule',
      'Scalable income',
      'Work from anywhere'
    ],
    cons: [
      'Takes time to build audience',
      'Dependent on other companies',
      'Commission-based income',
      'High competition',
      'Need to constantly adapt to changes',
      'Building trust takes time'
    ],
    tools: ['WordPress', 'ConvertKit', 'Google Analytics', 'Canva', 'Social media platforms'],
    skills: ['Content creation', 'SEO', 'Email marketing', 'Social media marketing', 'Analytics'],
    icon: 'TrendingUp',
    marketSize: 'Affiliate marketing industry worth $17B+ globally',
    averageIncome: {
      beginner: '$0-500/month',
      intermediate: '$500-5K/month',
      advanced: '$5K-50K+/month'
    },
    userStruggles: [
      'Building initial audience',
      'Finding profitable niches',
      'Creating engaging content',
      'Tracking and optimizing campaigns'
    ],
    solutions: [
      'Focus on one niche initially',
      'Provide genuine value first',
      'Use analytics to optimize',
      'Build email list early'
    ],
    bestFitPersonality: [
      'Patient and persistent',
      'Good at building relationships',
      'Analytical mindset',
      'Marketing-oriented'
    ],
    resources: {
      platforms: ['Amazon Associates', 'ShareASale', 'CJ Affiliate', 'ClickBank'],
      learning: ['Affiliate marketing courses', 'Industry blogs'],
      tools: ['WordPress', 'ConvertKit', 'Google Analytics', 'Canva']
    },
    actionPlan: {
      phase1: [
        'Choose your niche',
        'Research affiliate programs',
        'Create content platform',
        'Start creating valuable content'
      ],
      phase2: [
        'Build email list',
        'Join affiliate programs',
        'Create product reviews',
        'Optimize for SEO'
      ],
      phase3: [
        'Scale successful campaigns',
        'Diversify income streams',
        'Build personal brand',
        'Consider paid advertising'
      ]
    }
  }
];