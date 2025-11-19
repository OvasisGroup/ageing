# AI Features Documentation

## Overview
This document describes all AI-powered features integrated into the Senior Home Services Network platform across Admin, Provider, and Customer dashboards.

## Setup

### 1. Environment Configuration
Add your OpenAI API key to `.env`:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

### 2. Dependencies
All required packages are already installed:
- `openai` - OpenAI SDK for AI features
- `recharts` - Analytics visualization

## AI Features by Dashboard

### 🔧 Admin Dashboard

#### 1. **Predictive Analytics** (`/components/admin/predictive-analytics.tsx`)
- **Visual metrics dashboard** with real-time data
- **Trend analysis charts** showing bookings and revenue
- **AI-generated insights** analyzing platform performance
- **Future predictions** for bookings, providers, and customers
- **API Endpoint**: `GET /api/ai/analytics`

**Features:**
- 7-day metrics tracking
- Interactive line charts
- Key performance indicators
- Automated trend detection

#### 2. **Business Intelligence Assistant** (`/components/admin/business-intelligence.tsx`)
- **Natural language queries** - Ask questions in plain English
- **Quick query templates** for common reports
- **Data-driven insights** based on platform metrics

**Example Queries:**
- "Show me top performing providers this month"
- "Which services have highest cancellation rates?"
- "What are peak booking times?"
- "Analyze customer retention trends"

**API Endpoint**: `POST /api/ai/chat`

---

### 👷 Provider Dashboard

#### 1. **AI Response Assistant** (`/components/provider/response-assistant.tsx`)
- **Context-aware response generation** for customer messages
- **Multiple tone options**: Professional, Friendly, Apologetic
- **One-click copy to clipboard**
- **Real-time suggestions**

**Use Cases:**
- Responding to booking inquiries
- Handling customer complaints
- Confirming appointments
- Professional communication

**API Endpoint**: `POST /api/ai/response-generator`

#### 2. **Pricing Recommendations** (`/components/provider/pricing-recommendations.tsx`)
- **Market-based pricing analysis**
- **Experience-adjusted rates**
- **Location-specific recommendations**
- **Competitive positioning insights**

**Factors Considered:**
- Years of experience
- Service category
- Local market rates
- Competition density

**API Endpoint**: `POST /api/ai/pricing`

---

### 👴 Customer Dashboard

#### 1. **Service Recommender** (`/components/customer/service-recommender.tsx`)
- **Personalized service suggestions** based on history
- **AI-powered matching** to customer needs
- **Location-aware recommendations**
- **Seasonal care reminders**

**How It Works:**
- Analyzes past booking history
- Considers current needs description
- Matches to available service categories
- Suggests 3-5 relevant services

**API Endpoint**: `POST /api/ai/recommendations`

#### 2. **Care Planning Assistant** (`/components/customer/care-planning-assistant.tsx`)
- **Personalized care plans** for seniors
- **Health condition analysis**
- **Mobility-based recommendations**
- **Service prioritization**

**Inputs:**
- Senior's age
- Health conditions
- Mobility level (high/moderate/low/wheelchair)
- Current services

**Outputs:**
- Comprehensive care plan summary
- 5 prioritized service recommendations
- Safety considerations

**API Endpoint**: `POST /api/ai/care-plan`

---

## 💬 Universal AI Chatbot

**Location**: Bottom-right floating button on all dashboards (`/components/ai-chatbot.tsx`)

**Features:**
- **Role-aware responses** - Adapts to admin/provider/customer context
- **Conversational interface** with message history
- **Real-time streaming** responses
- **24/7 availability**

**Context Adaptation:**
- **Admin**: Platform analytics, management insights, policy help
- **Provider**: Scheduling tips, customer relations, business advice
- **Customer**: Service guidance, booking help, care recommendations

**API Endpoint**: `POST /api/ai/chat`

---

## API Reference

### Core AI Utilities (`/lib/openai.ts`)

#### `generateChatResponse(messages, userRole)`
General chat completion with role-specific system prompts.

#### `generateServiceRecommendations(userHistory, currentNeeds, location)`
Returns array of recommended services.

#### `generateProviderResponse(context, customerMessage, tone)`
Generates professional response templates.

#### `generateCarePlan(seniorAge, conditions, mobilityLevel, currentServices)`
Creates personalized care plan with recommendations.

#### `generatePricingRecommendation(serviceType, providerExperience, location, marketData)`
Suggests optimal pricing with reasoning.

#### `analyzeTrends(data)`
Analyzes metrics and provides insights/predictions.

#### `analyzeFraudRisk(accountData)`
Evaluates account for suspicious activity (admin only).

---

## API Endpoints

### `POST /api/ai/chat`
**Headers**: `x-user-id`  
**Body**: `{ messages: [{role, content}] }`  
**Response**: `{ response: string }`

### `POST /api/ai/recommendations`
**Headers**: `x-user-id`  
**Body**: `{ currentNeeds: string, location: string }`  
**Response**: `{ recommendations: string[] }`

### `POST /api/ai/response-generator`
**Headers**: `x-user-id`  
**Body**: `{ context: string, customerMessage: string, tone: string }`  
**Response**: `{ response: string }`

### `POST /api/ai/care-plan`
**Headers**: `x-user-id`  
**Body**: `{ seniorAge: number, conditions: string[], mobilityLevel: string, currentServices: string[] }`  
**Response**: `{ plan: string, recommendations: string[] }`

### `POST /api/ai/pricing`
**Headers**: `x-user-id`  
**Body**: `{ serviceType: string, location: string }`  
**Response**: `{ suggestedPrice: number, reasoning: string }`

### `GET /api/ai/analytics`
**Headers**: `x-user-id` (Admin only)  
**Response**: `{ insights: string[], predictions: string[], currentMetrics: object }`

---

## Usage Examples

### Admin: Query Business Intelligence
```javascript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': userId,
  },
  body: JSON.stringify({
    messages: [{
      role: 'user',
      content: 'Show me top providers this month'
    }]
  })
});
const data = await response.json();
console.log(data.response);
```

### Provider: Generate Response
```javascript
const response = await fetch('/api/ai/response-generator', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': userId,
  },
  body: JSON.stringify({
    context: 'Plumbing repair scheduled for tomorrow',
    customerMessage: 'Can we reschedule to next week?',
    tone: 'professional'
  })
});
const data = await response.json();
console.log(data.response);
```

### Customer: Get Service Recommendations
```javascript
const response = await fetch('/api/ai/recommendations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': userId,
  },
  body: JSON.stringify({
    currentNeeds: 'My parent needs daily medication reminders',
    location: 'San Francisco'
  })
});
const data = await response.json();
console.log(data.recommendations);
```

---

## Security & Best Practices

### Authentication
- All API endpoints require `x-user-id` header
- Admin-only endpoints verify role in database
- User data is isolated by userId

### Rate Limiting
Consider implementing rate limits for AI endpoints:
- Prevent API abuse
- Control costs
- Ensure fair usage

### Error Handling
All AI endpoints include try-catch blocks and return appropriate error responses:
- 401: Unauthorized (missing user ID)
- 403: Forbidden (insufficient permissions)
- 404: Not found
- 500: Server error

### Cost Optimization
- Using `gpt-4o-mini` model for cost efficiency
- Token limits set appropriately (150-500 tokens)
- Temperature tuned for each use case

---

## Future Enhancements

### Planned Features
1. **Smart Matching Algorithm** - Auto-assign requests to optimal providers
2. **Fraud Detection Dashboard** - Real-time risk monitoring
3. **Schedule Optimizer** - AI route planning for providers
4. **Voice Integration** - Speech-to-text for accessibility
5. **Multi-language Support** - Translate services/responses
6. **Sentiment Analysis** - Monitor customer satisfaction
7. **Automated Reports** - Daily/weekly AI-generated summaries

### Advanced Analytics
- Customer lifetime value prediction
- Churn risk detection
- Demand forecasting by region
- Dynamic pricing optimization

---

## Troubleshooting

### Common Issues

**"Missing OPENAI_API_KEY environment variable"**
- Add your OpenAI API key to `.env` file
- Restart the development server

**"Unauthorized" errors**
- Ensure user is logged in
- Check `x-user-id` header is set
- Verify localStorage has user data

**"Rate limit exceeded"**
- OpenAI free tier has limits
- Upgrade to paid plan
- Implement caching for common queries

**Slow response times**
- Normal for first request (cold start)
- Consider implementing loading states
- Cache frequent queries

---

## Testing

### Manual Testing Checklist

**Admin Dashboard:**
- [ ] Predictive analytics loads with charts
- [ ] Business intelligence accepts queries
- [ ] Insights are relevant and accurate

**Provider Dashboard:**
- [ ] Response assistant generates appropriate replies
- [ ] Pricing recommendations are reasonable
- [ ] Tone selection works correctly

**Customer Dashboard:**
- [ ] Service recommender provides relevant services
- [ ] Care planning generates comprehensive plans
- [ ] Mobility levels affect recommendations

**Chatbot (All Roles):**
- [ ] Opens/closes correctly
- [ ] Messages send and receive
- [ ] Responses are role-appropriate
- [ ] Conversation history maintained

---

## Support

For issues or questions:
1. Check this documentation
2. Review API error messages
3. Check OpenAI API status
4. Verify environment variables
5. Contact development team

---

## License & Credits

- OpenAI GPT-4 powers all AI features
- Recharts for analytics visualization
- Built for Senior Home Services Network
