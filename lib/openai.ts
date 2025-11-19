import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Chat Assistant
export async function generateChatResponse(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  userRole: 'ADMIN' | 'PROVIDER' | 'CUSTOMER'
) {
  const systemPrompts = {
    ADMIN: 'You are an AI assistant for Senior Home Services Network administrators. Help with platform analytics, provider management, fraud detection, and business insights. Be professional and data-driven.',
    PROVIDER: 'You are an AI assistant for service providers on Senior Home Services Network. Help with scheduling, customer communication, pricing strategies, and professional growth. Be supportive and practical.',
    CUSTOMER: 'You are an AI assistant for customers seeking senior home services. Help with service recommendations, provider selection, care planning, and booking assistance. Be empathetic and clear.',
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompts[userRole] },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0].message.content;
}

// Smart Service Recommendations
export async function generateServiceRecommendations(
  userHistory: string[],
  currentNeeds: string,
  location: string
): Promise<string[]> {
  const prompt = `Based on a customer's service history: ${userHistory.join(', ')}, their current needs: "${currentNeeds}", and location: ${location}, suggest 3-5 relevant senior home services they might need. Return only service names, one per line.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 150,
  });

  return (
    response.choices[0].message.content
      ?.split('\n')
      .filter((line) => line.trim())
      .map((line) => line.replace(/^[-•*\d.]\s*/, '').trim()) || []
  );
}

// AI Response Templates for Providers
export async function generateProviderResponse(
  context: string,
  customerMessage: string,
  tone: 'professional' | 'friendly' | 'apologetic' = 'professional'
): Promise<string> {
  const toneInstructions = {
    professional: 'formal and professional',
    friendly: 'warm and friendly',
    apologetic: 'apologetic and solution-oriented',
  };

  const prompt = `You are helping a service provider respond to a customer. Context: ${context}. Customer message: "${customerMessage}". Generate a ${toneInstructions[tone]} response that addresses their needs. Keep it concise (2-3 sentences).`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 200,
  });

  return response.choices[0].message.content || '';
}

// Care Planning Assistant
export async function generateCarePlan(
  seniorAge: number,
  conditions: string[],
  mobilityLevel: string,
  currentServices: string[]
): Promise<{ plan: string; recommendations: string[] }> {
  const prompt = `Create a personalized care plan for a ${seniorAge}-year-old with conditions: ${conditions.join(', ')}, mobility level: ${mobilityLevel}. Current services: ${currentServices.join(', ')}. Provide a brief care plan summary and 5 specific service recommendations.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 400,
  });

  const content = response.choices[0].message.content || '';
  const lines = content.split('\n').filter((line) => line.trim());

  return {
    plan: lines.slice(0, 3).join(' '),
    recommendations: lines
      .slice(3)
      .map((line) => line.replace(/^[-•*\d.]\s*/, '').trim())
      .filter((line) => line.length > 10)
      .slice(0, 5),
  };
}

// Pricing Recommendations
export async function generatePricingRecommendation(
  serviceType: string,
  providerExperience: number,
  location: string,
  marketData?: { avgPrice: number; competitors: number }
): Promise<{ suggestedPrice: number; reasoning: string }> {
  const marketInfo = marketData
    ? `Market average: $${marketData.avgPrice}, ${marketData.competitors} competitors`
    : 'No market data available';

  const prompt = `Suggest pricing for ${serviceType} service. Provider experience: ${providerExperience} years. Location: ${location}. ${marketInfo}. Provide a suggested hourly rate and brief reasoning.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.6,
    max_tokens: 150,
  });

  const content = response.choices[0].message.content || '';
  const priceMatch = content.match(/\$(\d+(?:\.\d{2})?)/);
  const suggestedPrice = priceMatch ? parseFloat(priceMatch[1]) : marketData?.avgPrice || 50;

  return {
    suggestedPrice,
    reasoning: content,
  };
}

// Predictive Analytics
export async function analyzeTrends(
  data: { metric: string; values: number[]; timeframe: string }[]
): Promise<{ insights: string[]; predictions: string[] }> {
  const dataStr = data.map((d) => `${d.metric}: ${d.values.join(', ')} (${d.timeframe})`).join('; ');

  const prompt = `Analyze these platform metrics: ${dataStr}. Provide 3 key insights and 3 predictions for the next period.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 300,
  });

  const content = response.choices[0].message.content || '';
  const lines = content
    .split('\n')
    .map((line) => line.replace(/^[-•*\d.]\s*/, '').trim())
    .filter((line) => line.length > 10);

  return {
    insights: lines.slice(0, 3),
    predictions: lines.slice(3, 6),
  };
}

// Fraud Detection Analysis
export async function analyzeFraudRisk(
  accountData: {
    createdAt: Date;
    bookingCount: number;
    cancellationRate: number;
    reviewPattern: string;
    locationChanges: number;
  }
): Promise<{ riskScore: number; flags: string[]; recommendation: string }> {
  const prompt = `Analyze fraud risk: Account age ${Math.floor((Date.now() - accountData.createdAt.getTime()) / (1000 * 60 * 60 * 24))} days, ${accountData.bookingCount} bookings, ${accountData.cancellationRate}% cancellation rate, review pattern: ${accountData.reviewPattern}, ${accountData.locationChanges} location changes. Rate risk 0-100 and list red flags.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 200,
  });

  const content = response.choices[0].message.content || '';
  const scoreMatch = content.match(/(\d+)(?:\/100|\s*out\s*of\s*100)/i);
  const riskScore = scoreMatch ? parseInt(scoreMatch[1]) : 50;

  const flags = content
    .split('\n')
    .filter((line) => line.includes('flag') || line.includes('•') || line.includes('-'))
    .map((line) => line.replace(/^[-•*\d.]\s*/, '').trim())
    .filter((line) => line.length > 5);

  return {
    riskScore,
    flags,
    recommendation: riskScore > 70 ? 'High risk - Review required' : riskScore > 40 ? 'Medium risk - Monitor' : 'Low risk',
  };
}

// Public Assistant for Homepage (No Authentication Required)
export async function generatePublicAssistantResponse(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const systemPrompt = `You are a helpful AI assistant for Senior Home Services Network's public website. Your role is to help visitors with:

1. **Registration Process**: Explain how to sign up as a customer, provider, or admin. Guide them through account creation steps.

2. **Terms and Conditions**: Answer questions about:
   - Service agreements and commitments
   - Booking policies and cancellations
   - Payment terms and refund policies
   - User responsibilities and prohibited activities
   - Dispute resolution procedures

3. **Privacy Policy**: Explain how we:
   - Collect and use personal information
   - Protect user data and maintain security
   - Share information with service providers
   - Handle cookies and tracking
   - Allow users to access, update, or delete their data
   - Comply with GDPR and privacy regulations

4. **Platform Overview**: Describe:
   - What services are available (healthcare, companionship, housekeeping, transportation, etc.)
   - How customers find and book providers
   - How providers offer their services
   - Safety and verification measures
   - Pricing and payment process

Be friendly, clear, and concise. Use bullet points for clarity. If asked about specific legal details, recommend reviewing the full terms/privacy documents or contacting support. Always provide helpful, accurate information while being welcoming to new users.

For registration questions, guide them to the /register page.
For legal documents, reference that full terms are available at /terms and privacy policy at /privacy.
For support, provide: support@seniorhomeservices.com

Keep responses under 200 words unless more detail is specifically requested.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 400,
  });

  return response.choices[0].message.content || 'I apologize, but I was unable to generate a response. Please try again or contact our support team.';
}
