// Website content knowledge base for AI assistant

// Type definitions
interface Subcategory {
  id: string;
  title: string;
  description: string | null;
  slug: string;
}

interface Category {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  subcategories: Subcategory[];
}

// Dynamic categories cache
let categoriesCache: Category[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch categories and subcategories from database
async function fetchCategoriesFromDB(): Promise<Category[]> {
  try {
    // Check cache first
    const now = Date.now();
    if (categoriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return categoriesCache;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/categories`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      categoriesCache = data;
      cacheTimestamp = now;
      return data;
    }
  } catch (error) {
    console.error('Error fetching categories for AI:', error);
  }
  
  return [];
}

export const websiteContent = {
  services: {
    categories: [
      {
        name: 'Healthcare Services',
        description: 'Professional medical care and health monitoring services',
        examples: ['Nursing care', 'Physical therapy', 'Medication management', 'Health monitoring', 'Medical appointments']
      },
      {
        name: 'Personal Care',
        description: 'Assistance with daily living activities',
        examples: ['Bathing and grooming', 'Dressing assistance', 'Mobility support', 'Meal preparation', 'Feeding assistance']
      },
      {
        name: 'Companionship',
        description: 'Social interaction and emotional support',
        examples: ['Conversation and engagement', 'Activity participation', 'Errands and outings', 'Reading and entertainment']
      },
      {
        name: 'Housekeeping',
        description: 'Home maintenance and cleaning services',
        examples: ['Light housekeeping', 'Laundry services', 'Home organization', 'Grocery shopping']
      },
      {
        name: 'Transportation',
        description: 'Safe and reliable transportation services',
        examples: ['Medical appointments', 'Shopping trips', 'Social events', 'Errands']
      },
      {
        name: 'Specialized Care',
        description: 'Specialized care for specific conditions',
        examples: ['Dementia care', 'Alzheimer\'s care', 'Palliative care', 'Post-surgery care', 'Chronic condition management']
      }
    ],
    pricing: {
      structure: 'Pricing varies by service type, location, provider experience, and duration',
      providerFees: 'Providers set their own rates starting from $299/month for platform membership',
      customerCosts: 'Service costs are negotiated directly between customers and providers'
    }
  },

  registration: {
    customer: {
      process: [
        'Visit /register and select "Customer Account"',
        'Fill out registration form with personal information',
        'Verify email address',
        'Complete profile with care needs and preferences',
        'Browse providers and services',
        'Book appointments and manage care'
      ],
      benefits: [
        'Access to verified care providers',
        'Compare services and prices',
        'Manage bookings and schedules',
        'Secure payment processing',
        'Review and rating system',
        '24/7 customer support'
      ]
    },
    provider: {
      process: [
        'Visit /register-as-pro or /register and select "Provider Account"',
        'Choose subscription plan (Monthly, Quarterly, Half-Yearly, or Yearly)',
        'Complete professional profile and verification',
        'Upload credentials and certifications',
        'Set service offerings and pricing',
        'Start receiving client bookings'
      ],
      plans: [
        {
          name: 'Monthly',
          price: 299,
          features: ['Unlimited service listings', 'Client booking management', 'Payment processing', 'Profile verification badge', 'Basic analytics dashboard', 'Email support']
        },
        {
          name: 'Quarterly',
          price: 849,
          savings: 48,
          features: ['Everything in Monthly', 'Priority listing in search', 'Advanced analytics', 'Marketing toolkit', 'Priority support', 'Featured provider badge']
        },
        {
          name: 'Half-Yearly',
          price: 1649,
          savings: 145,
          features: ['Everything in Quarterly', 'Premium profile customization', 'Promotional campaigns', 'Dedicated account manager', 'API access', 'Custom integrations']
        },
        {
          name: 'Yearly',
          price: 3199,
          savings: 389,
          features: ['Everything in Half-Yearly', 'Top search placement', 'White-label options', 'Business consulting sessions', 'Priority verification', 'Exclusive partner benefits']
        }
      ],
      benefits: [
        'Access to thousands of clients',
        'Grow your business',
        'Verified and trusted profile',
        'Easy booking management',
        'Secure payment processing',
        'Professional dashboard',
        '24/7 support'
      ]
    }
  },

  termsAndConditions: {
    summary: 'Our Terms of Service cover user agreements, service commitments, booking policies, payment terms, user responsibilities, prohibited activities, and dispute resolution procedures.',
    keyPoints: [
      'Users must be 18+ or have guardian consent',
      'Providers must maintain valid licenses and insurance',
      'All bookings are contracts between customers and providers',
      'Platform facilitates connections but is not liable for service quality',
      'Payment terms: Secure processing through Stripe',
      'Cancellation policies vary by provider',
      'Users must report issues within 48 hours',
      'Disputes handled through platform mediation first',
      'Prohibited: Fraud, harassment, discrimination, unsafe practices'
    ],
    fullDocument: '/terms'
  },

  privacyPolicy: {
    summary: 'We are committed to protecting your privacy and personal information. Our policy explains how we collect, use, share, and protect your data.',
    dataCollection: [
      'Personal information: Name, email, phone, address',
      'Profile data: Services, preferences, availability',
      'Payment information: Processed securely through Stripe',
      'Usage data: Platform activity, search history, bookings',
      'Location data: For matching with nearby providers',
      'Communications: Messages between users'
    ],
    dataUsage: [
      'Facilitate service connections and bookings',
      'Process payments and transactions',
      'Improve platform features and user experience',
      'Send notifications and updates',
      'Ensure safety and prevent fraud',
      'Comply with legal obligations'
    ],
    dataSharing: [
      'With service providers: Profile and booking information',
      'With payment processors: Transaction data',
      'With law enforcement: When legally required',
      'Never sold to third parties for marketing'
    ],
    userRights: [
      'Access your personal data',
      'Request data corrections',
      'Delete your account and data',
      'Export your information',
      'Opt-out of marketing communications',
      'Control privacy settings'
    ],
    security: [
      'Encrypted data transmission (SSL/TLS)',
      'Secure database storage',
      'Regular security audits',
      'Access controls and authentication',
      'Incident response procedures'
    ],
    compliance: 'GDPR compliant, follows data protection regulations',
    fullDocument: '/privacy'
  },

  platform: {
    name: 'Senior Home Services Network',
    description: 'A comprehensive platform connecting families seeking senior care services with verified professional care providers',
    mission: 'To make quality senior care accessible, affordable, and trustworthy for families while empowering care providers to grow their businesses',
    features: [
      'Verified provider profiles with credentials and reviews',
      'Advanced search and filtering',
      'Secure booking and scheduling system',
      'Integrated payment processing',
      'Real-time messaging between users',
      'Calendar integration (Google Calendar)',
      'Mobile-responsive design',
      'AI-powered recommendations and assistance',
      'Analytics dashboard for providers',
      'Rating and review system',
      '24/7 customer support'
    ],
    safety: [
      'Provider verification and background checks',
      'License and insurance validation',
      'Secure payment processing',
      'Review and rating system',
      'Dispute resolution process',
      'Data encryption and privacy protection'
    ],
    support: {
      email: 'support@seniorhomeservices.com',
      hours: '24/7 support available',
      phone: 'Coming soon',
      resources: 'Help center and FAQs available in dashboard'
    }
  },

  about: {
    company: 'Senior Home Services Network',
    founded: '2025',
    mission: 'Transforming senior care by connecting families with trusted professionals',
    vision: 'To become the most trusted platform for senior home care services',
    values: [
      'Quality Care: Ensuring the highest standards of service',
      'Trust & Safety: Verified providers and secure platform',
      'Accessibility: Making care affordable and available',
      'Innovation: Using technology to improve care delivery',
      'Compassion: Putting seniors and families first'
    ],
    team: 'Dedicated professionals with backgrounds in healthcare, technology, and senior care',
    contact: '/get-more-info'
  },

  technicalDetails: {
    stack: 'Next.js, TypeScript, Prisma, PostgreSQL, Stripe, OpenAI',
    authentication: 'Secure email/password and Google OAuth',
    payments: 'Stripe payment processing',
    apis: 'Google Maps, Google Calendar, OpenAI',
    deployment: 'Cloud-hosted with high availability',
    mobile: 'Mobile apps coming soon (iOS and Android)'
  }
};

// Function to get relevant content based on query
export async function getRelevantContent(query: string): Promise<string> {
  const lowerQuery = query.toLowerCase();
  const relevantContent: string[] = [];

  // Fetch real categories from database
  const dbCategories = await fetchCategoriesFromDB();
  
  // Check for service/category questions
  if (lowerQuery.includes('service') || lowerQuery.includes('care') || lowerQuery.includes('category') || 
      lowerQuery.includes('what do you offer') || lowerQuery.includes('types of') || lowerQuery.includes('kind of')) {
    
    if (dbCategories.length > 0) {
      // Use real database categories
      const categoriesText = dbCategories.map((cat: Category) => {
        const subcatsText = cat.subcategories && cat.subcategories.length > 0
          ? `\n  Subcategories: ${cat.subcategories.map((sub: Subcategory) => sub.title).join(', ')}`
          : '';
        return `• ${cat.title}${cat.description ? `: ${cat.description}` : ''}${subcatsText}`;
      }).join('\n');
      
      relevantContent.push(`AVAILABLE SERVICE CATEGORIES:\n${categoriesText}\n\nPricing: ${websiteContent.services.pricing.structure}`);
    } else {
      // Fallback to static categories if DB fetch fails
      relevantContent.push(`AVAILABLE SERVICES:\n${websiteContent.services.categories.map(c => 
        `${c.name}: ${c.description}\nExamples: ${c.examples.join(', ')}`
      ).join('\n\n')}\n\nPricing: ${websiteContent.services.pricing.structure}`);
    }
  }

  // Check for registration questions
  if (lowerQuery.includes('register') || lowerQuery.includes('sign up') || lowerQuery.includes('account') || lowerQuery.includes('join')) {
    if (lowerQuery.includes('provider') || lowerQuery.includes('pro') || lowerQuery.includes('professional')) {
      relevantContent.push(`PROVIDER REGISTRATION:
Process: ${websiteContent.registration.provider.process.join(' → ')}

Subscription Plans:
${websiteContent.registration.provider.plans.map(p => 
  `- ${p.name}: $${p.price}${p.savings ? ` (Save $${p.savings})` : ''}\n  Features: ${p.features.join(', ')}`
).join('\n')}

Benefits: ${websiteContent.registration.provider.benefits.join(', ')}

To register: Visit /register-as-pro or /register/provider`);
    } else {
      relevantContent.push(`CUSTOMER REGISTRATION:
Process: ${websiteContent.registration.customer.process.join(' → ')}

Benefits: ${websiteContent.registration.customer.benefits.join(', ')}

To register: Visit /register and select "Customer Account"`);
    }
  }

  // Check for terms and conditions
  if (lowerQuery.includes('term') || lowerQuery.includes('condition') || lowerQuery.includes('agreement') || lowerQuery.includes('contract')) {
    relevantContent.push(`TERMS & CONDITIONS:
Summary: ${websiteContent.termsAndConditions.summary}

Key Points:
${websiteContent.termsAndConditions.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Full terms available at: ${websiteContent.termsAndConditions.fullDocument}`);
  }

  // Check for privacy policy
  if (lowerQuery.includes('privacy') || lowerQuery.includes('data') || lowerQuery.includes('personal information') || lowerQuery.includes('gdpr')) {
    relevantContent.push(`PRIVACY POLICY:
Summary: ${websiteContent.privacyPolicy.summary}

Data We Collect: ${websiteContent.privacyPolicy.dataCollection.join(', ')}

How We Use Data: ${websiteContent.privacyPolicy.dataUsage.join(', ')}

Your Rights: ${websiteContent.privacyPolicy.userRights.join(', ')}

Security: ${websiteContent.privacyPolicy.security.join(', ')}

Compliance: ${websiteContent.privacyPolicy.compliance}

Full policy available at: ${websiteContent.privacyPolicy.fullDocument}`);
  }

  // Check for services
  if (lowerQuery.includes('service') || lowerQuery.includes('care') || lowerQuery.includes('what do you offer')) {
    relevantContent.push(`AVAILABLE SERVICES:
${websiteContent.services.categories.map(c => 
  `${c.name}: ${c.description}\nExamples: ${c.examples.join(', ')}`
).join('\n\n')}

Pricing: ${websiteContent.services.pricing.structure}`);
  }

  // Check for pricing
  if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('fee') || lowerQuery.includes('payment')) {
    relevantContent.push(`PRICING INFORMATION:
Customer Costs: ${websiteContent.services.pricing.customerCosts}

Provider Platform Fees: ${websiteContent.services.pricing.providerFees}

Provider Plans:
${websiteContent.registration.provider.plans.map(p => 
  `${p.name}: $${p.price}${p.savings ? ` (Save $${p.savings})` : ''}`
).join('\n')}`);
  }

  // Check for platform/about questions
  if (lowerQuery.includes('about') || lowerQuery.includes('who are you') || lowerQuery.includes('what is this') || lowerQuery.includes('platform')) {
    relevantContent.push(`ABOUT ${websiteContent.platform.name}:
${websiteContent.platform.description}

Mission: ${websiteContent.platform.mission}

Key Features: ${websiteContent.platform.features.join(', ')}

Safety Measures: ${websiteContent.platform.safety.join(', ')}

Support: ${websiteContent.platform.support.email} (${websiteContent.platform.support.hours})`);
  }

  // Check for contact/support
  if (lowerQuery.includes('contact') || lowerQuery.includes('support') || lowerQuery.includes('help') || lowerQuery.includes('email')) {
    relevantContent.push(`CONTACT & SUPPORT:
Email: ${websiteContent.platform.support.email}
Availability: ${websiteContent.platform.support.hours}
Contact Form: ${websiteContent.about.contact}
Resources: ${websiteContent.platform.support.resources}`);
  }

  // Return combined relevant content or empty string
  return relevantContent.join('\n\n---\n\n');
}
