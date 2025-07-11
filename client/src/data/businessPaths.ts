import { BusinessPath } from '../types';

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
      'Research market rates thoroughly',
      'Use project management tools',
      'Set clear boundaries and contracts'
    ],
    bestFitPersonality: [
      'Self-motivated and disciplined',
      'Good communicator',
      'Skilled in specific area',
      'Comfortable with uncertainty'
    ],
    resources: {
      platforms: ['Upwork', 'Fiverr', 'Freelancer', 'LinkedIn'],
      learning: ['Freelancers Union', 'Skill-specific courses'],
      tools: ['Time tracking apps', 'Invoice software', 'Project management tools']
    },
    actionPlan: {
      phase1: [
        'Identify your marketable skills',
        'Create professional profiles',
        'Build initial portfolio',
        'Set competitive rates'
      ],
      phase2: [
        'Apply to relevant projects',
        'Deliver exceptional work',
        'Collect testimonials',
        'Refine your niche'
      ],
      phase3: [
        'Raise rates based on experience',
        'Build long-term client relationships',
        'Consider specializing further',
        'Explore passive income streams'
      ]
    }
  },
  {
    id: 'affiliate-marketing',
    name: 'Affiliate Marketing',
    description: 'Promote other people\'s products and earn commission on sales',
    detailedDescription: 'Affiliate marketing involves promoting other people\'s products and earning a commission on each sale made through your referral link. You don\'t need to own a product or handle fulfillment; instead, you focus on generating traffic and conversions.',
    fitScore: 0,
    difficulty: 'Easy',
    timeToProfit: '3-6 months',
    startupCost: '$50-500',
    potentialIncome: '$100-10K+/month',
    pros: [
      'No need to create your own product',
      'Scalable and passive over time',
      'Flexible and remote-friendly',
      'Can pair with other models',
      'Low startup costs',
      'Evergreen content builds compounding returns'
    ],
    cons: [
      'Delayed income',
      'Requires consistent publishing or ad spend',
      'Payouts and platforms can change',
      'Highly competitive in profitable niches',
      'Some programs have low commissions',
      'Hard to build trust as a beginner'
    ],
    tools: ['WordPress', 'ConvertKit', 'Canva', 'Ahrefs'],
    skills: ['Content creation', 'SEO', 'Traffic generation', 'Conversion optimization', 'Audience building'],
    icon: 'TrendingUp',
    marketSize: '$15.7B industry, projected to reach $36.9B by 2030',
    averageIncome: {
      beginner: '$0-500/month',
      intermediate: '$500-2K/month',
      advanced: '$2K-10K+/month'
    },
    userStruggles: [
      'Building audience takes time',
      'Content creation consistency',
      'Building trust and authority',
      'Algorithm dependency'
    ],
    solutions: [
      'Set realistic 6-12 month expectations',
      'Focus on specific niche for authority',
      'Diversify traffic sources',
      'Use AI tools for content scaling'
    ],
    bestFitPersonality: [
      'Patient and persistent',
      'Content creator',
      'Analytical for optimization',
      'Good at relationship building'
    ],
    resources: {
      platforms: ['Amazon Associates', 'ShareASale', 'ClickBank'],
      learning: ['Authority Hacker', 'Affiliate marketing courses'],
      tools: ['WordPress', 'ConvertKit', 'Ahrefs', 'Canva']
    },
    actionPlan: {
      phase1: [
        'Choose profitable niche',
        'Set up blog/website',
        'Join affiliate programs',
        'Create content calendar'
      ],
      phase2: [
        'Publish consistent content',
        'Build email list',
        'Optimize for SEO',
        'Track and analyze metrics'
      ],
      phase3: [
        'Scale successful content',
        'Diversify traffic sources',
        'Add premium affiliate programs',
        'Consider paid advertising'
      ]
    }
  },
  {
    id: 'e-commerce-dropshipping',
    name: 'E-commerce / Dropshipping',
    description: 'Sell products online without holding inventory through supplier partnerships',
    detailedDescription: 'E-commerce and dropshipping involve selling products online without holding inventory. In dropshipping, when a customer places an order, the retailer purchases the item from a third-party supplier who ships it directly to the customer. This model allows entrepreneurs to start an online store with minimal upfront investment.',
    fitScore: 0,
    difficulty: 'Medium',
    timeToProfit: '2-6 months',
    startupCost: '$500-3K',
    potentialIncome: '$1K-50K+/month',
    pros: [
      'Low startup costs',
      'No inventory management',
      'Location independence',
      'Scalable with advertising',
      'Wide product selection',
      'Quick to test new products'
    ],
    cons: [
      'High competition',
      'Low profit margins',
      'Supplier dependency',
      'Customer service challenges',
      'Ad costs can be high',
      'Quality control issues'
    ],
    tools: ['Shopify', 'Oberlo', 'Facebook Ads', 'Google Ads', 'AliExpress'],
    skills: ['Product research', 'Digital marketing', 'Customer service', 'Supplier management', 'Analytics'],
    icon: 'Package',
    marketSize: 'Global e-commerce market worth $6.2T, growing 10% annually',
    averageIncome: {
      beginner: '$0-1K/month',
      intermediate: '$1K-10K/month',
      advanced: '$10K-50K+/month'
    },
    userStruggles: [
      'Finding winning products',
      'Managing ad costs',
      'Dealing with suppliers',
      'Customer service issues'
    ],
    solutions: [
      'Use product research tools',
      'Start with small ad budgets',
      'Build relationships with reliable suppliers',
      'Implement good customer service systems'
    ],
    bestFitPersonality: [
      'Marketing-focused',
      'Data-driven',
      'Comfortable with advertising',
      'Good at problem-solving'
    ],
    resources: {
      platforms: ['Shopify', 'WooCommerce', 'BigCommerce'],
      learning: ['Shopify Academy', 'E-commerce courses'],
      tools: ['Product research tools', 'Ad management platforms']
    },
    actionPlan: {
      phase1: [
        'Research profitable niches',
        'Set up online store',
        'Find reliable suppliers',
        'Create product listings'
      ],
      phase2: [
        'Launch advertising campaigns',
        'Test different products',
        'Optimize conversion rates',
        'Build customer service processes'
      ],
      phase3: [
        'Scale successful products',
        'Expand to new markets',
        'Build brand recognition',
        'Consider private labeling'
      ]
    }
  },
  {
    id: 'virtual-assistant',
    name: 'Virtual Assistant',
    description: 'Provide remote administrative support to entrepreneurs and businesses',
    detailedDescription: 'A Virtual Assistant (VA) provides remote administrative support to entrepreneurs, businesses, or executives. Tasks might include email management, scheduling, customer service, research, or social media coordination. Some VAs specialize in areas like e-commerce, podcast production, or bookkeeping.',
    fitScore: 0,
    difficulty: 'Easy',
    timeToProfit: '1-2 weeks',
    startupCost: '$0-100',
    potentialIncome: '$500-5K/month',
    pros: [
      'Easy to start quickly',
      'Highly flexible schedule',
      'Always in demand across industries',
      'Great stepping stone into online work',
      'Opportunity to niche or grow agency',
      'Low financial risk'
    ],
    cons: [
      'Limited income ceiling',
      'Time-for-money trade-off',
      'Can become repetitive',
      'Client expectations vary widely',
      'May involve inconsistent hours',
      'Burnout risk from juggling clients'
    ],
    tools: ['Google Workspace', 'Notion', 'Trello', 'Slack', 'Zoom'],
    skills: ['Organization', 'Communication', 'Time management', 'Tech proficiency', 'Problem-solving'],
    icon: 'Users',
    marketSize: 'Virtual assistant market growing 34% annually, worth $25B+',
    averageIncome: {
      beginner: '$500-1.5K/month',
      intermediate: '$1.5K-3K/month',
      advanced: '$3K-5K/month'
    },
    userStruggles: [
      'Finding quality clients',
      'Setting appropriate rates',
      'Managing multiple clients',
      'Avoiding scope creep'
    ],
    solutions: [
      'Build strong portfolio and testimonials',
      'Research market rates by specialty',
      'Use project management tools',
      'Set clear boundaries and contracts'
    ],
    bestFitPersonality: [
      'Organized and detail-oriented',
      'Good communicator',
      'Reliable and trustworthy',
      'Enjoys helping others'
    ],
    resources: {
      platforms: ['Belay', 'Time Etc', 'Fancy Hands', 'Upwork'],
      learning: ['Virtual Assistant courses', 'Skill-specific training'],
      tools: ['Project management software', 'Communication tools']
    },
    actionPlan: {
      phase1: [
        'Identify your service offerings',
        'Create professional profiles',
        'Set competitive rates',
        'Apply to VA positions'
      ],
      phase2: [
        'Deliver excellent service',
        'Build client relationships',
        'Collect testimonials',
        'Refine your niche'
      ],
      phase3: [
        'Raise rates based on experience',
        'Consider specializing',
        'Build long-term contracts',
        'Explore agency model'
      ]
    }
  },
  {
    id: 'online-coaching-consulting',
    name: 'Online Coaching / Consulting',
    description: 'Provide expertise and guidance to clients in your area of specialization',
    detailedDescription: 'Online coaching and consulting involve providing expertise, guidance, and strategic advice to clients in your area of specialization. This could range from business consulting to life coaching, fitness training, or career guidance. Sessions are typically conducted via video calls, and packages can include one-on-one sessions, group coaching, or digital courses.',
    fitScore: 0,
    difficulty: 'Medium',
    timeToProfit: '1-3 months',
    startupCost: '$100-1K',
    potentialIncome: '$2K-25K+/month',
    pros: [
      'High hourly rates',
      'Meaningful impact on clients',
      'Flexible scheduling',
      'Low overhead costs',
      'Can package expertise into courses',
      'Strong recurring revenue potential'
    ],
    cons: [
      'Time-for-money limitation',
      'Requires proven expertise',
      'Client acquisition can be challenging',
      'Emotional investment in client outcomes',
      'Market can be saturated',
      'Requires strong personal brand'
    ],
    tools: ['Zoom', 'Calendly', 'Teachable', 'Stripe', 'Notion'],
    skills: ['Subject expertise', 'Communication', 'Problem-solving', 'Program development', 'Client management'],
    icon: 'GraduationCap',
    marketSize: 'Global coaching market worth $20B+, growing 6% annually',
    averageIncome: {
      beginner: '$1K-3K/month',
      intermediate: '$3K-10K/month',
      advanced: '$10K-25K+/month'
    },
    userStruggles: [
      'Establishing credibility',
      'Finding ideal clients',
      'Pricing services',
      'Scaling beyond 1-on-1'
    ],
    solutions: [
      'Build portfolio of results',
      'Define ideal client clearly',
      'Research market rates',
      'Create group programs and courses'
    ],
    bestFitPersonality: [
      'Subject matter expert',
      'Natural teacher',
      'Good listener',
      'Empathetic and patient'
    ],
    resources: {
      platforms: ['Coach training programs', 'Certification bodies'],
      learning: ['Coaching methodologies', 'Business development'],
      tools: ['Video conferencing', 'Scheduling software', 'Course platforms']
    },
    actionPlan: {
      phase1: [
        'Define your coaching niche',
        'Get relevant certifications',
        'Create service packages',
        'Build online presence'
      ],
      phase2: [
        'Offer free discovery sessions',
        'Collect client testimonials',
        'Refine your methodology',
        'Build referral network'
      ],
      phase3: [
        'Scale with group programs',
        'Create digital courses',
        'Build thought leadership',
        'Consider certification programs'
      ]
    }
  },
  {
    id: 'print-on-demand',
    name: 'Print on Demand',
    description: 'Create and sell custom designs on products without inventory management',
    detailedDescription: 'Print on Demand (POD) allows creators to design custom graphics, artwork, or text that gets printed on products like t-shirts, mugs, phone cases, and more only when orders are placed. Platforms like Printful, Printify, and Redbubble handle production and shipping, while creators focus on design and marketing.',
    fitScore: 0,
    difficulty: 'Easy',
    timeToProfit: '2-4 months',
    startupCost: '$0-500',
    potentialIncome: '$200-5K+/month',
    pros: [
      'No upfront inventory costs',
      'Passive income potential',
      'Creative freedom',
      'Global market reach',
      'Easy to start',
      'Multiple product categories'
    ],
    cons: [
      'Lower profit margins',
      'High competition',
      'Design theft issues',
      'Platform dependency',
      'Limited customization options',
      'Marketing required for visibility'
    ],
    tools: ['Canva', 'Photoshop', 'Printful', 'Etsy', 'Amazon Merch'],
    skills: ['Graphic design', 'Market research', 'Trend awareness', 'Basic marketing', 'Brand development'],
    icon: 'Package',
    marketSize: 'Print-on-demand market worth $4.9B, growing 26% annually',
    averageIncome: {
      beginner: '$0-200/month',
      intermediate: '$200-1K/month',
      advanced: '$1K-5K+/month'
    },
    userStruggles: [
      'Creating designs that sell',
      'Standing out in crowded markets',
      'Understanding trends',
      'Marketing products effectively'
    ],
    solutions: [
      'Research trending niches and keywords',
      'Focus on specific target audiences',
      'Use trend research tools',
      'Build social media presence'
    ],
    bestFitPersonality: [
      'Creative and artistic',
      'Trend-aware',
      'Patient with slow growth',
      'Good at market research'
    ],
    resources: {
      platforms: ['Printful', 'Printify', 'Redbubble', 'Etsy'],
      learning: ['Design tutorials', 'POD courses'],
      tools: ['Design software', 'Trend research tools']
    },
    actionPlan: {
      phase1: [
        'Learn design basics',
        'Research profitable niches',
        'Set up POD accounts',
        'Create first designs'
      ],
      phase2: [
        'Upload designs to platforms',
        'Optimize listings for SEO',
        'Test different niches',
        'Build social media presence'
      ],
      phase3: [
        'Scale successful designs',
        'Expand to new platforms',
        'Build brand recognition',
        'Consider premium products'
      ]
    }
  },
  {
    id: 'youtube-automation',
    name: 'YouTube Automation Channels',
    description: 'Build faceless YouTube channels where content is outsourced to a team',
    detailedDescription: 'YouTube automation involves building faceless YouTube channels where the content is outsourced—scripts, voiceovers, video editing, and thumbnails. The owner manages the strategy and monetization while a team handles production.',
    fitScore: 0,
    difficulty: 'Medium',
    timeToProfit: '3-6 months',
    startupCost: '$300-3K',
    potentialIncome: '$500-15K/month',
    pros: [
      'High passive income potential',
      'Doesn\'t require on-camera presence',
      'Can operate multiple channels at once',
      'Leverages evergreen content',
      'Delegation builds time freedom',
      'Excellent for data-driven creators'
    ],
    cons: [
      'Needs upfront capital to outsource content',
      'Hiring reliable team members is difficult',
      'Monetization takes time and effort',
      'Channels can be demonetized for policy violations',
      'High content production costs upfront',
      'Constant optimization required'
    ],
    tools: ['VidIQ', 'Pictory', 'Fiverr', 'Google Docs'],
    skills: ['Strategic planning', 'Team management', 'SEO', 'Analytics', 'Trend recognition'],
    icon: 'Monitor',
    marketSize: 'YouTube generates $28B+ annually',
    averageIncome: {
      beginner: '$0-500/month',
      intermediate: '$500-3K/month',
      advanced: '$3K-15K/month'
    },
    userStruggles: [
      'Finding reliable team members',
      'Content quality control',
      'Monetization delays',
      'Algorithm changes'
    ],
    solutions: [
      'Thorough vetting process',
      'Clear quality standards',
      'Diversify revenue streams',
      'Stay updated on platform changes'
    ],
    bestFitPersonality: [
      'Systems thinker',
      'Good at delegation',
      'Data-driven',
      'Patient with long-term results'
    ],
    resources: {
      platforms: ['YouTube', 'Fiverr', 'Upwork'],
      learning: ['Cash Cow Mastery', 'Think Media'],
      tools: ['VidIQ', 'TubeBuddy', 'Pictory']
    },
    actionPlan: {
      phase1: [
        'Choose profitable niche',
        'Research competition',
        'Create channel strategy',
        'Hire initial team'
      ],
      phase2: [
        'Produce first videos',
        'Optimize thumbnails/titles',
        'Build content pipeline',
        'Track performance'
      ],
      phase3: [
        'Scale content production',
        'Diversify monetization',
        'Launch additional channels',
        'Build team systems'
      ]
    }
  },
  {
    id: 'local-service-arbitrage',
    name: 'Local Service Arbitrage',
    description: 'Generate leads for local services and hire others to fulfill the work',
    detailedDescription: 'Local service arbitrage is the process of generating leads for a local service (like lawn care, pressure washing, or cleaning), then hiring someone else to fulfill the job. The business owner makes the margin between the client\'s fee and the vendor\'s cost.',
    fitScore: 0,
    difficulty: 'Medium',
    timeToProfit: '2-8 weeks',
    startupCost: '$100-1K',
    potentialIncome: '$1K-10K/month',
    pros: [
      'High-margin business potential',
      'Doesn\'t require performing services yourself',
      'Great for testing sales skills',
      'Fast to launch with minimal equipment',
      'Can be scaled with team processes',
      'Real-world entrepreneurship experience'
    ],
    cons: [
      'Customer complaints fall on you',
      'Requires reliable local vendors',
      'Not location-independent',
      'Heavy reliance on phone sales or cold outreach',
      'Quality control is hard to maintain',
      'Limited software support'
    ],
    tools: ['Google Ads', 'Jobber', 'Stripe', 'Thumbtack'],
    skills: ['Sales', 'Communication', 'Lead generation', 'Vendor management', 'Customer service'],
    icon: 'Briefcase',
    marketSize: 'Local services market worth $400B+ annually',
    averageIncome: {
      beginner: '$500-2K/month',
      intermediate: '$2K-5K/month',
      advanced: '$5K-10K/month'
    },
    userStruggles: [
      'Finding reliable vendors',
      'Quality control issues',
      'Customer complaints',
      'Scaling operations'
    ],
    solutions: [
      'Thorough vendor vetting',
      'Clear service standards',
      'Excellent customer communication',
      'Build operational systems'
    ],
    bestFitPersonality: [
      'Sales-oriented',
      'Organized operator',
      'Problem solver',
      'Local market focused'
    ],
    resources: {
      platforms: ['Google Ads', 'Thumbtack', 'Angie\'s List'],
      learning: ['Sweaty Startup', 'Local service courses'],
      tools: ['Jobber', 'ServiceTitan', 'Google Ads']
    },
    actionPlan: {
      phase1: [
        'Choose service niche',
        'Find local vendors',
        'Set up lead generation',
        'Create pricing strategy'
      ],
      phase2: [
        'Launch marketing campaigns',
        'Handle first customers',
        'Refine operations',
        'Build vendor relationships'
      ],
      phase3: [
        'Scale lead generation',
        'Expand service offerings',
        'Build team systems',
        'Consider new markets'
      ]
    }
  },
  {
    id: 'high-ticket-sales',
    name: 'High-Ticket Sales / Closing',
    description: 'Sell expensive products or services over phone/Zoom for commission',
    detailedDescription: 'High-ticket sales is the process of selling expensive products or services, often $2,000+, over the phone or via Zoom. Closers are typically paid commission (10–20%) per sale and don\'t need to generate leads—the company handles marketing and passes warm leads to closers.',
    fitScore: 0,
    difficulty: 'Medium',
    timeToProfit: '2-6 weeks',
    startupCost: '$0-200',
    potentialIncome: '$3K-30K+/month',
    pros: [
      'Extremely high earning potential',
      'No need to create your own product',
      'Valuable sales experience',
      'Fast to start and learn',
      'Remote-friendly',
      'Builds confidence and discipline'
    ],
    cons: [
      'Inconsistent income if not performing',
      'Commission-only roles can be stressful',
      'Long calls and repetitive scripts',
      'Emotional ups and downs from rejections',
      'Limited if not great at communication',
      'Burnout if unstructured'
    ],
    tools: ['Zoom', 'Close.io', 'Slack', 'Calendly'],
    skills: ['Communication', 'Persuasion', 'Objection handling', 'Emotional intelligence', 'Follow-up'],
    icon: 'TrendingUp',
    marketSize: 'High-ticket coaching/consulting market worth $15B+',
    averageIncome: {
      beginner: '$1K-5K/month',
      intermediate: '$5K-15K/month',
      advanced: '$15K-30K+/month'
    },
    userStruggles: [
      'Handling rejection',
      'Inconsistent income',
      'Long sales cycles',
      'Emotional pressure'
    ],
    solutions: [
      'Develop thick skin',
      'Focus on activity metrics',
      'Build strong follow-up systems',
      'Practice stress management'
    ],
    bestFitPersonality: [
      'Persuasive communicator',
      'Competitive nature',
      'Resilient to rejection',
      'Goal-oriented'
    ],
    resources: {
      platforms: ['Closers.io', 'Remote Closing Academy'],
      learning: ['Sales training programs', 'Cole Gordon content'],
      tools: ['Zoom', 'CRM systems', 'Calendly']
    },
    actionPlan: {
      phase1: [
        'Learn sales fundamentals',
        'Practice scripts',
        'Find closing opportunities',
        'Set up workspace'
      ],
      phase2: [
        'Start taking calls',
        'Track metrics',
        'Refine techniques',
        'Build relationships'
      ],
      phase3: [
        'Optimize conversion rates',
        'Negotiate higher commissions',
        'Consider starting own offers',
        'Build sales team'
      ]
    }
  },
  {
    id: 'app-saas-development',
    name: 'App or SaaS Development',
    description: 'Create tech-based products with subscription or license monetization',
    detailedDescription: 'App or SaaS development involves creating a tech-based product (mobile or web) that solves a problem and can be monetized through subscriptions, licenses, or ads. This model is known for its high leverage—once built, the product can serve unlimited users without much added cost.',
    fitScore: 0,
    difficulty: 'Hard',
    timeToProfit: '6-18 months',
    startupCost: '$1K-15K',
    potentialIncome: '$1K-100K+/month',
    pros: [
      'High-margin and recurring revenue',
      'Scales infinitely with users',
      'Modern tools reduce technical barriers',
      'Attracts investors if successful',
      'Can be automated over time',
      'Strong product = long-term defensibility'
    ],
    cons: [
      'Long build cycles',
      'Tech bugs and debugging headaches',
      'Difficult to find early users',
      'Heavy time investment upfront',
      'Constant iteration and support',
      'High competition in most categories'
    ],
    tools: ['React', 'Vercel', 'Supabase', 'Stripe', 'Figma'],
    skills: ['Programming', 'Product thinking', 'UX/UI design', 'Problem solving', 'Market validation'],
    icon: 'Monitor',
    marketSize: 'Global SaaS market worth $195B and growing',
    averageIncome: {
      beginner: '$0-1K/month',
      intermediate: '$1K-10K/month',
      advanced: '$10K-100K+/month'
    },
    userStruggles: [
      'Technical complexity',
      'Finding product-market fit',
      'User acquisition',
      'Feature creep'
    ],
    solutions: [
      'Start with MVP',
      'Validate early and often',
      'Focus on user feedback',
      'Prioritize core features'
    ],
    bestFitPersonality: [
      'Technical problem solver',
      'Patient with long development cycles',
      'Detail-oriented',
      'User-focused'
    ],
    resources: {
      platforms: ['Indie Hackers', 'Product Hunt', 'GitHub'],
      learning: ['Buildspace', 'SaaS courses', 'Tech tutorials'],
      tools: ['React', 'Supabase', 'Vercel', 'Stripe']
    },
    actionPlan: {
      phase1: [
        'Validate problem/solution fit',
        'Build MVP',
        'Get first users',
        'Gather feedback'
      ],
      phase2: [
        'Iterate based on feedback',
        'Implement monetization',
        'Scale user acquisition',
        'Improve product'
      ],
      phase3: [
        'Optimize for growth',
        'Add advanced features',
        'Consider funding',
        'Build team'
      ]
    }
  }
];