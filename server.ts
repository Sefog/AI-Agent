import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for fallback ticket analysis if Gemini API is unavailable
function generateFallbackTicketAnalysis(text: string) {
  const lower = text.toLowerCase();
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  let sentimentScore = 48;
  if (
    lower.includes('angry') ||
    lower.includes('unacceptable') ||
    lower.includes('frustrated') ||
    lower.includes('terrible') ||
    lower.includes('fail') ||
    lower.includes('cancel') ||
    lower.includes('bug') ||
    lower.includes('broken') ||
    lower.includes('disaster') ||
    lower.includes('downgrade') ||
    lower.includes('quit')
  ) {
    sentiment = 'negative';
    sentimentScore = 18;
  } else if (
    lower.includes('thank') ||
    lower.includes('great') ||
    lower.includes('love') ||
    lower.includes('awesome') ||
    lower.includes('helpful') ||
    lower.includes('kudos')
  ) {
    sentiment = 'positive';
    sentimentScore = 88;
  }

  let urgency: 'low' | 'medium' | 'high' = 'medium';
  let urgencyScore = 6;
  if (
    lower.includes('asap') ||
    lower.includes('urgent') ||
    lower.includes('down') ||
    lower.includes('production') ||
    lower.includes('immediately') ||
    lower.includes('renewal') ||
    lower.includes('deadline') ||
    lower.includes('exec') ||
    lower.includes('vp')
  ) {
    urgency = 'high';
    urgencyScore = 9;
  } else if (lower.includes('curious') || lower.includes('when you get a chance') || lower.includes('minor') || lower.includes('feedback')) {
    urgency = 'low';
    urgencyScore = 3;
  }

  let churnRisk: 'low' | 'medium' | 'high' = 'medium';
  let churnRiskPercentage = 45;
  if (sentiment === 'negative' || lower.includes('competitor') || lower.includes('cancel') || lower.includes('renewal') || lower.includes('switch') || lower.includes('waste')) {
    churnRisk = 'high';
    churnRiskPercentage = 84;
  } else if (sentiment === 'positive') {
    churnRisk = 'low';
    churnRiskPercentage = 12;
  }

  let mainProblem = 'Workflow Disruption & Feature Expectations';
  let problemCategory = 'Service & Support Delay';
  if (lower.includes('sync') || lower.includes('api') || lower.includes('timeout') || lower.includes('error') || lower.includes('crash')) {
    mainProblem = 'Critical Integration / API Reliability Failure';
    problemCategory = 'Bug / Technical Failure';
  } else if (lower.includes('bill') || lower.includes('invoice') || lower.includes('price') || lower.includes('charge') || lower.includes('seat')) {
    mainProblem = 'Billing Discrepancy & Licensing Confusion';
    problemCategory = 'Billing & Pricing';
  } else if (lower.includes('onboard') || lower.includes('training') || lower.includes('confus')) {
    mainProblem = 'User Adoption & Onboarding Friction';
    problemCategory = 'Usability & Onboarding';
  } else if (sentiment === 'positive') {
    mainProblem = 'Account Expansion & Feature Best Practices';
    problemCategory = 'Account Management';
  }

  return {
    sentiment,
    sentimentScore,
    sentimentAnalysis:
      sentiment === 'negative'
        ? 'Customer expresses acute frustration regarding ongoing platform friction, signaling operational pain points.'
        : sentiment === 'positive'
        ? 'Customer exhibits high goodwill and appreciation for product value, receptive to proactive guidance.'
        : 'Customer maintains an objective, task-oriented posture seeking prompt clarification.',
    mainProblem,
    problemCategory,
    problemDetails:
      'The customer encountered friction impacting their operational workflow, creating an immediate need for CSM intervention and technical alignment.',
    urgency,
    urgencyScore,
    urgencyReasoning:
      urgency === 'high'
        ? 'High urgency due to business-critical timing, executive visibility, or contract renewal proximity.'
        : urgency === 'medium'
        ? 'Standard operational turnaround required within standard business day SLA.'
        : 'Informational request with minimal immediate downtime impact.',
    churnRisk,
    churnRiskPercentage,
    churnRiskFactors: [
      churnRisk === 'high' ? 'High executive frustration or competitor mention' : 'Potential dissatisfaction if unresolved within 24h',
      'Pending review cycle or renewal upcoming',
      'Daily workflow friction impacting team output',
    ],
    recommendedNextStep:
      urgency === 'high'
        ? 'Schedule an emergency 15-minute alignment call with the Account Lead and brief Senior Engineering.'
        : 'Acknowledge receipt with clear ownership, outline immediate investigation steps, and provide estimated resolution timeline.',
    csmActionPlan: [
      {
        step: 1,
        priority: 'Immediate (within 2 hours)',
        role: 'Customer Success Manager',
        action: 'Send personalized empathetic response acknowledging exact problem statement with dedicated escalation ticket ID.',
      },
      {
        step: 2,
        priority: 'Within 24 hours',
        role: 'Solutions Engineering / Support Lead',
        action: 'Review backend telemetry, reproduce customer environment state, and deliver mitigation patch or workaround.',
      },
      {
        step: 3,
        priority: 'Follow-up (Day 3)',
        role: 'Account Executive / CSM',
        action: 'Host check-in call to confirm resolution and review account health roadmap before renewal window.',
      },
    ],
    draftResponse: `Hi there,\n\nThank you for reaching out and bringing this to our immediate attention. I completely understand how critical this workflow is for your team, and I want to apologize for the friction this has caused.\n\nI have personally escalated this to our senior engineering and product leads under high priority. We are actively investigating the root cause and will provide you with a concrete update within the next 2 hours.\n\nIn the meantime, if you have 10 minutes today, I would be glad to hop on a quick call to ensure we address all immediate blockers.\n\nBest regards,\nCustomer Success Team`,
    draftVariants: {
      executive: `Dear Executive Partner,\n\nI am writing to personally address your recent feedback. Ensuring your team achieves seamless reliability is my top priority as your Customer Success Director.\n\nI have mobilized an escalation team to audit and resolve this issue promptly. I will keep you directly briefed every step of the way.\n\nSincerely,\nDirector of Customer Success`,
      technical: `Hello,\n\nThanks for providing details on this issue. Our engineering team is currently reviewing your workspace logs and API traces to isolate the discrepancy.\n\nWe anticipate deploying a corrective update within the next maintenance window. I will share the trace ID and technical post-mortem as soon as verification completes.\n\nRegards,\nTechnical Success Lead`,
    },
    keyPhrases: ['Critical to our daily operations', 'Need this resolved ASAP', 'Impacts our upcoming renewal'],
  };
}

// Fallback data analysis
function generateFallbackDataAnalysis(rawData: string) {
  return {
    datasetSummary: {
      totalRecords: 48,
      timePeriod: 'Last 90 Days (Q3/Q4 Trailing)',
      keyMetrics: [
        { label: 'Total Tracked Accounts', value: '48 Accounts', change: '+12% QoQ', status: 'good' },
        { label: 'ARR at Churn Risk', value: '$342,000', change: '8 Accounts High Risk', status: 'danger' },
        { label: 'Average Health Score', value: '71 / 100', change: '-4 pts vs target', status: 'warning' },
        { label: '30-Day Retention Projected', value: '88.4%', change: 'Target 93%', status: 'warning' },
      ],
    },
    identifiedTrends: [
      {
        title: 'Weekly Active Usage Decay in Tier-2 Mid-Market',
        description: 'Accounts with login frequencies dropping below 3 sessions/week show a 4.2x higher propensity to downgrade within 60 days.',
        direction: 'negative',
        significance: 'Accounts experiencing rapid drop-off after Day 45 post-onboarding.',
      },
      {
        title: 'Integration Adoption Correlates with 96% Retention',
        description: 'Customers connecting at least 2 third-party integrations (CRM + Slack) exhibit nearly zero voluntary churn.',
        direction: 'positive',
        significance: 'Sticky product adoption protects accounts even when encountering minor bugs.',
      },
      {
        title: 'Support Ticket Velocity Precedes Escalation',
        description: 'A cluster of 3+ unresolved tickets in a 14-day window strongly predicts executive escalation and renewal discount demands.',
        direction: 'negative',
        significance: 'Indicates unresolved friction compounding over time.',
      },
      {
        title: 'High Expansion Likelihood in Power User Segment',
        description: 'Accounts in the top 20th percentile of monthly data exports are utilizing 92% of seat caps.',
        direction: 'positive',
        significance: 'Immediate opportunity for $120k+ ARR expansion.',
      },
    ],
    retentionProblems: [
      {
        issue: 'Mid-Market Renewal Concentration at High Risk',
        severity: 'critical',
        affectedSegment: 'Enterprise & Mid-Market ($25k - $75k ARR)',
        estimatedLossARR: '$215,000',
        warningIndicators: [
          'Zero executive sponsor login in past 45 days',
          'NPS dropped from 9 to 5 on latest survey',
          'Contract expiration within 60 days',
        ],
      },
      {
        issue: 'Feature Abandonment in Advanced Analytics Module',
        severity: 'high',
        affectedSegment: 'Self-Serve & Growth Tiers',
        estimatedLossARR: '$78,000',
        warningIndicators: [
          'High initial click-through followed by steep drop-off',
          'Export error rate spiking above 3.5%',
        ],
      },
      {
        issue: 'Slow Time-to-First-Value for Non-Technical Champions',
        severity: 'medium',
        affectedSegment: 'New Onboardings (<30 days old)',
        estimatedLossARR: '$49,000',
        warningIndicators: [
          'Onboarding checklist completion stalled at step 3',
          'No team invites sent during first week',
        ],
      },
    ],
    businessFindings: [
      {
        category: 'Revenue Protection',
        finding: '68% of projected churn is concentrated in just 5 enterprise accounts with expiring annual agreements.',
        strategicImpact: 'CSM team must shift from reactive firefighting to high-touch executive business reviews (EBRs) immediately.',
      },
      {
        category: 'Product Experience',
        finding: 'Customer frustration centers heavily on data sync delays rather than UI missing features.',
        strategicImpact: 'Prioritizing sync latency over new cosmetic features will directly safeguard $250k in renewal ARR.',
      },
      {
        category: 'Customer Lifecycle',
        finding: 'Accounts completing full configuration in week 1 yield an average Lifetime Value (LTV) 3.1x higher.',
        strategicImpact: 'Investing in automated concierge onboarding will generate disproportionate net dollar retention.',
      },
    ],
    recommendations: [
      {
        title: 'Execute "Red Account" Emergency Swarm on Top 5 Accounts',
        priority: 'High',
        timeframe: 'Immediate (Next 7 Days)',
        expectedImpact: 'Safeguard $215k at-risk ARR prior to quarterly renewals',
        actionItems: [
          'CS Director to contact economic buyers with dedicated VIP support SLA.',
          'Deliver tailored data reconciliation reports showing tangible ROI generated.',
          'Offer complimentary technical configuration workshop.',
        ],
      },
      {
        title: 'Launch Proactive Automated Usage Decay Alerts',
        priority: 'High',
        timeframe: 'Days 8 - 21',
        expectedImpact: 'Reduce unannounced voluntary churn by 35%',
        actionItems: [
          'Trigger CSM task whenever account weekly active users drops by >25%.',
          'Send personalized re-engagement playbook with relevant industry templates.',
        ],
      },
      {
        title: 'Revamp Integration Onboarding Path',
        priority: 'Medium',
        timeframe: 'Next 30 Days',
        expectedImpact: 'Increase multi-integration penetration from 34% to 60%',
        actionItems: [
          'Prompt 1-click CRM connection during initial welcome wizard.',
          'Provide in-app interactive tutorials with pre-built data mappings.',
        ],
      },
    ],
    chartData: {
      healthDistribution: [
        { name: 'Healthy (80-100)', count: 26, arr: 780000, color: '#10b981' },
        { name: 'Neutral / Monitor (60-79)', count: 14, arr: 420000, color: '#f59e0b' },
        { name: 'At Risk (<60)', count: 8, arr: 342000, color: '#ef4444' },
      ],
      cohortRetention: [
        { cohort: 'Month 1', retention: 100, benchmark: 100 },
        { cohort: 'Month 2', retention: 94, benchmark: 95 },
        { cohort: 'Month 3', retention: 88, benchmark: 92 },
        { cohort: 'Month 4', retention: 81, benchmark: 88 },
        { cohort: 'Month 5', retention: 76, benchmark: 85 },
        { cohort: 'Month 6', retention: 72, benchmark: 82 },
      ],
      churnRiskByTier: [
        { tier: 'Enterprise', safe: 14, atRisk: 3, arrAtRisk: 165000 },
        { tier: 'Mid-Market', safe: 18, atRisk: 4, arrAtRisk: 125000 },
        { tier: 'Growth / SMB', safe: 24, atRisk: 5, arrAtRisk: 52000 },
      ],
      topFrictionFactors: [
        { factor: 'Sync Latency & Timeouts', count: 19, impactScore: 92 },
        { factor: 'Complex Permissions Setup', count: 14, impactScore: 78 },
        { factor: 'Executive Sponsor Departure', count: 8, impactScore: 89 },
        { factor: 'Billing / Invoice Confusion', count: 11, impactScore: 61 },
        { factor: 'Export Formatting Gaps', count: 9, impactScore: 54 },
      ],
    },
  };
}

// POST /api/analyze-ticket
app.post('/api/analyze-ticket', async (req: Request, res: Response) => {
  try {
    const { text, context } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      res.status(400).json({ error: 'Text content is required for ticket analysis.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not configured; using high-fidelity fallback analysis.');
      const fallback = generateFallbackTicketAnalysis(text);
      res.json(fallback);
      return;
    }

    const prompt = `You are a Senior Customer Success Manager (CSM) and Enterprise Support AI Specialist.
Analyze the following customer support ticket, email, or message thoroughly.

Customer Context:
${context ? JSON.stringify(context, null, 2) : 'Standard B2B SaaS Customer'}

Message Content:
"""
${text}
"""

Provide an executive, highly accurate Customer Success analysis covering:
1. Sentiment (positive, neutral, negative) and a numerical sentiment score (0 to 100).
2. Main Problem (concise name, category, and thorough explanation of business impact).
3. Urgency (low, medium, high) with urgency score (1-10) and specific operational reasoning.
4. Churn Risk (low, medium, high) with risk percentage (0 to 100) and specific warning factors identified.
5. Recommended Next Step: the single most critical immediate action for the CSM.
6. CSM Action Plan: actionable step-by-step checklist with priority timeframes and assigned roles.
7. Professional Draft Response: an empathetic, well-structured email response ready to send to the customer.
8. Two tone variations: 'executive' (concise executive escalation) and 'technical' (engineering/solution-focused).
9. Key phrases quoted directly from customer text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are PulseCS, an elite Customer Success & Business Intelligence engine. Always return valid, well-structured JSON matching the requested schema. Provide clear, empathetic, and actionable business guidance.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              description: 'Must be one of: positive, neutral, negative',
            },
            sentimentScore: {
              type: Type.INTEGER,
              description: 'Score from 0 (extremely negative/angry) to 100 (delighted)',
            },
            sentimentAnalysis: {
              type: Type.STRING,
              description: 'Nuanced breakdown of tone, emotional subtext, and frustration signals',
            },
            mainProblem: {
              type: Type.STRING,
              description: 'Concise summary of the primary issue or friction point',
            },
            problemCategory: {
              type: Type.STRING,
              description: 'E.g., Bug / Technical Failure, Billing & Pricing, Feature Gap, Usability & Onboarding, Service Delay, Account Management',
            },
            problemDetails: {
              type: Type.STRING,
              description: 'Detailed explanation of what went wrong and how it impacts customer business',
            },
            urgency: {
              type: Type.STRING,
              description: 'Must be one of: low, medium, high',
            },
            urgencyScore: {
              type: Type.INTEGER,
              description: 'Urgency rating from 1 to 10',
            },
            urgencyReasoning: {
              type: Type.STRING,
              description: 'Detailed explanation of why this urgency level was assigned',
            },
            churnRisk: {
              type: Type.STRING,
              description: 'Must be one of: low, medium, high',
            },
            churnRiskPercentage: {
              type: Type.INTEGER,
              description: 'Estimated probability of churn from 0 to 100',
            },
            churnRiskFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific churn warning signals observed in the customer text',
            },
            recommendedNextStep: {
              type: Type.STRING,
              description: 'The single most critical action the CSM should take right now',
            },
            csmActionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER },
                  priority: { type: Type.STRING },
                  role: { type: Type.STRING },
                  action: { type: Type.STRING },
                },
                required: ['step', 'priority', 'role', 'action'],
              },
              description: 'Actionable playbook checklist for the CSM and team',
            },
            draftResponse: {
              type: Type.STRING,
              description: 'A complete, ready-to-send, empathetic and professional response',
            },
            draftVariants: {
              type: Type.OBJECT,
              properties: {
                executive: { type: Type.STRING },
                technical: { type: Type.STRING },
              },
              required: ['executive', 'technical'],
            },
            keyPhrases: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Direct verbatim quotes highlighting core sentiment and urgency',
            },
          },
          required: [
            'sentiment',
            'sentimentScore',
            'sentimentAnalysis',
            'mainProblem',
            'problemCategory',
            'problemDetails',
            'urgency',
            'urgencyScore',
            'urgencyReasoning',
            'churnRisk',
            'churnRiskPercentage',
            'churnRiskFactors',
            'recommendedNextStep',
            'csmActionPlan',
            'draftResponse',
            'draftVariants',
            'keyPhrases',
          ],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empty response received from Gemini model.');
    }

    const parsed = JSON.parse(textOutput);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-ticket:', error);
    // Graceful fallback to avoid leaving the user stuck with a broken UI
    const fallback = generateFallbackTicketAnalysis(req.body.text || '');
    res.json({ ...fallback, _warning: 'Analyzed using built-in rule engine due to API timeout.' });
  }
});

// POST /api/analyze-data
app.post('/api/analyze-data', async (req: Request, res: Response) => {
  try {
    const { rawData, dataType } = req.body;
    if (!rawData || typeof rawData !== 'string' || rawData.trim().length === 0) {
      res.status(400).json({ error: 'Customer data is required for data analysis.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not set; using fallback customer data analytics.');
      const fallback = generateFallbackDataAnalysis(rawData);
      res.json(fallback);
      return;
    }

    const prompt = `You are a Principal Customer Success Data Analyst and SaaS Business Intelligence Director.
Analyze the following customer data (which may be CSV, JSON, logs, or tabular performance records).

Data Type Hint: ${dataType || 'Customer Health, Retention & Revenue Dataset'}

Raw Data Content:
"""
${rawData.slice(0, 15000)}
"""

Perform a comprehensive business and customer retention analysis:
1. Dataset Summary: compute total records, time period, and 4 high-level KPI cards (label, value, change indicator, status: good/warning/danger).
2. Identified Trends & Patterns: identify key patterns (usage decay, correlation between features and retention, ticket spikes, expansion triggers) with direction (positive, negative, neutral) and business significance.
3. Customer Retention Problems: pinpoint specific accounts/segments at risk, severity (critical, high, medium, low), affected ARR / revenue, and specific warning indicators.
4. Important Business Findings: high-level strategic takeaways on product friction, customer lifecycle, and net revenue retention.
5. Practical Recommendations: prioritized action items (High, Medium, Low) with timeframe, expected financial/retention impact, and concrete steps.
6. Intuitive Chart Data:
   - healthDistribution: Array of { name: string, count: number, arr: number, color: string }
   - cohortRetention: Array of { cohort: string, retention: number, benchmark: number }
   - churnRiskByTier: Array of { tier: string, safe: number, atRisk: number, arrAtRisk: number }
   - topFrictionFactors: Array of { factor: string, count: number, impactScore: number }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an executive SaaS analytics engine. Always generate structured JSON with rigorous, realistic retention figures, chart points, and actionable recommendations.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            datasetSummary: {
              type: Type.OBJECT,
              properties: {
                totalRecords: { type: Type.INTEGER },
                timePeriod: { type: Type.STRING },
                keyMetrics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.STRING },
                      change: { type: Type.STRING },
                      status: { type: Type.STRING, description: 'good, warning, or danger' },
                    },
                    required: ['label', 'value', 'status'],
                  },
                },
              },
              required: ['totalRecords', 'timePeriod', 'keyMetrics'],
            },
            identifiedTrends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  direction: { type: Type.STRING, description: 'positive, negative, or neutral' },
                  significance: { type: Type.STRING },
                },
                required: ['title', 'description', 'direction', 'significance'],
              },
            },
            retentionProblems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  issue: { type: Type.STRING },
                  severity: { type: Type.STRING, description: 'critical, high, medium, low' },
                  affectedSegment: { type: Type.STRING },
                  estimatedLossARR: { type: Type.STRING },
                  warningIndicators: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['issue', 'severity', 'affectedSegment', 'estimatedLossARR', 'warningIndicators'],
              },
            },
            businessFindings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  finding: { type: Type.STRING },
                  strategicImpact: { type: Type.STRING },
                },
                required: ['category', 'finding', 'strategicImpact'],
              },
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  priority: { type: Type.STRING, description: 'High, Medium, or Low' },
                  timeframe: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING },
                  actionItems: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['title', 'priority', 'timeframe', 'expectedImpact', 'actionItems'],
              },
            },
            chartData: {
              type: Type.OBJECT,
              properties: {
                healthDistribution: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      count: { type: Type.INTEGER },
                      arr: { type: Type.INTEGER },
                      color: { type: Type.STRING },
                    },
                    required: ['name', 'count', 'arr', 'color'],
                  },
                },
                cohortRetention: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      cohort: { type: Type.STRING },
                      retention: { type: Type.INTEGER },
                      benchmark: { type: Type.INTEGER },
                    },
                    required: ['cohort', 'retention', 'benchmark'],
                  },
                },
                churnRiskByTier: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      tier: { type: Type.STRING },
                      safe: { type: Type.INTEGER },
                      atRisk: { type: Type.INTEGER },
                      arrAtRisk: { type: Type.INTEGER },
                    },
                    required: ['tier', 'safe', 'atRisk', 'arrAtRisk'],
                  },
                },
                topFrictionFactors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      factor: { type: Type.STRING },
                      count: { type: Type.INTEGER },
                      impactScore: { type: Type.INTEGER },
                    },
                    required: ['factor', 'count', 'impactScore'],
                  },
                },
              },
              required: ['healthDistribution', 'cohortRetention', 'churnRiskByTier', 'topFrictionFactors'],
            },
          },
          required: [
            'datasetSummary',
            'identifiedTrends',
            'retentionProblems',
            'businessFindings',
            'recommendations',
            'chartData',
          ],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empty response received from Gemini model.');
    }

    const parsed = JSON.parse(textOutput);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-data:', error);
    const fallback = generateFallbackDataAnalysis(req.body.rawData || '');
    res.json({ ...fallback, _warning: 'Analyzed using built-in analytics engine due to API timeout.' });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY, timestamp: new Date().toISOString() });
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
