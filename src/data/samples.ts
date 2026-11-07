export interface SampleTicket {
  id: string;
  title: string;
  customerName: string;
  company: string;
  tier: string;
  arr: string;
  badge: string;
  badgeColor: string;
  content: string;
}

export const SAMPLE_TICKETS: SampleTicket[] = [
  {
    id: 'ticket-urgent-renewal',
    title: '🚨 Critical Salesforce Sync Failure Before Q4 Close',
    customerName: 'Marcus Vance',
    company: 'Apex Logistics Global',
    tier: 'Enterprise Tier',
    arr: '$84,000 / yr',
    badge: 'Renewal in 28 Days',
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    content: `From: Marcus Vance <m.vance@apexlogistics.com>
To: support@pulsecs-demo.com, success@pulsecs-demo.com
Subject: URGENT: Salesforce sync completely broken for 3 days - Contract renewal on hold

Team,

This is completely unacceptable. Our Salesforce CRM sync has been failing silently since Wednesday. My 45 account executives cannot see updated pipeline telemetry or shipping milestones, and we are entering the final two weeks of our Q4 closing cycle.

We opened Ticket #8921 two days ago and were told "engineering is reviewing the queue." That is not an acceptable response for an Enterprise tier client paying $84k/year.

Our annual contract renewal is up on the 1st of next month. Unless this is resolved today with a definitive fix and someone from leadership gets on the phone with me, I am freezing the renewal invoice and directing our procurement committee to evaluate HubSpot and Gainsight immediately.

Call my direct cell ASAP.

Marcus Vance
VP of Global Commercial Operations
Apex Logistics Global`,
  },
  {
    id: 'ticket-api-degradation',
    title: '⚠️ Production API Latency & Timeout Spikes',
    customerName: 'Elena Rostova',
    company: 'FinPulse Systems',
    tier: 'Enterprise Tech Partner',
    arr: '$120,000 / yr',
    badge: 'High Churn Risk',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    content: `From: Elena Rostova <elena.rostova@finpulsesys.io>
To: api-support@pulsecs-demo.com
Subject: Production latency degradation (p99 > 4200ms) - SLA Breach Warning

Hi Customer Success Team,

Over the last 10 days, we have logged repeated 504 Gateway Timeouts on the /v2/transactions/stream endpoint during European peak hours (08:00 - 12:00 UTC). 

Our P99 latency has ballooned from ~180ms to over 4,200ms, causing cascading retries across our microservices. We had to throttle customer payouts twice yesterday to avoid outright database lockups.

Our contract guarantees 99.95% uptime and sub-500ms response times. We are currently calculating our SLA credit penalty. If this instability persists into next sprint, our CTO has instructed us to commence proof-of-concept migration to Datadog / Stripe Relay.

We need root-cause analysis (RCA) and a mitigation plan by tomorrow noon.

Elena Rostova
Lead Infrastructure Architect | FinPulse Systems`,
  },
  {
    id: 'ticket-billing-dispute',
    title: '💳 Unexpected Seat Overage Charge & Downgrade Notice',
    customerName: 'David Chen',
    company: 'Strata Growth Partners',
    tier: 'Mid-Market Growth',
    arr: '$32,000 / yr',
    badge: 'Disputed Invoice',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    content: `From: David Chen <dchen@stratagrowth.co>
To: billing@pulsecs-demo.com, csm@pulsecs-demo.com
Subject: Invoice #INV-2026-904 Dispute - Immediate Seat Downgrade Request

Hello,

I just reviewed our latest monthly automatic debit, and we were billed an unexpected $3,800 overage for "25 deactivated seasonal contributor seats." 

When we signed our mid-market expansion last summer, our account executive Sarah assured us in writing that deactivated team accounts would automatically roll off monthly billing without penal overage rates. 

We feel blindsided. If your billing system cannot reconcile actual active users versus archived seats, please downgrade our account back to the 50-seat Starter tier at the end of this billing cycle. I also request an immediate credit memo for the $3,800 overage.

Please have our assigned CSM reach out before our finance director initiates an automated credit card chargeback.

David Chen
Chief of Staff & Head of Finance
Strata Growth Partners`,
  },
  {
    id: 'ticket-onboarding-gaps',
    title: '💬 Team Adoption Stalled & Permission Confusion',
    customerName: 'Sarah Jenkins',
    company: 'OmniHealth Solutions',
    tier: 'Standard Corporate',
    arr: '$24,000 / yr',
    badge: 'Adoption Plateau',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    content: `From: Sarah Jenkins <s.jenkins@omnihealth.org>
To: success@pulsecs-demo.com
Subject: Help with role-based permissions and clinician onboarding

Good morning PulseCS team,

We launched the platform to our clinical compliance team three weeks ago, but only 8 out of our 40 coordinators are actively logging in. 

The biggest hurdle is that coordinators keep getting "Access Denied: Restricted Schema" errors when attempting to view patient care cohorts. The documentation on custom role inheritance is very technical, and our team does not have dedicated IT staff to debug permission matrices.

Also, is there an automated way to export weekly audit summaries to encrypted CSV? Without this, our supervisors are doing manual screenshots.

We really like the clean interface, but if the team can't use it easily, leadership is going to question our software subscription at our 60-day review. Could someone run a 30-minute refresher workshop for our supervisors?

Thanks for your guidance,

Sarah Jenkins
Operations Director | OmniHealth Solutions`,
  },
  {
    id: 'ticket-positive-expansion',
    title: '⭐ Great Q3 Results & Request for 150 Additional Seats',
    customerName: 'Rachel Thorne',
    company: 'Vanguard Media Group',
    tier: 'Enterprise Tier',
    arr: '$95,000 / yr',
    badge: 'Expansion Opportunity',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    content: `From: Rachel Thorne <rachel.t@vanguardmedia.com>
To: csm@pulsecs-demo.com
Subject: Loving the new automated reporting - Expansion to EMEA team!

Hi Team!

I wanted to share some quick positive feedback. Our APAC marketing squad finished their quarterly business review yesterday, and your platform saved our analysts over 20 hours of manual spreadsheet compilation. The executives were genuinely thrilled with the real-time cohort visibility.

Because of this success, our London and Berlin offices want to roll out PulseCS across their respective divisions starting next month. That will require adding approximately 150 additional enterprise seats and connecting 3 new regional Snowflake data lakes.

Could you schedule a call with our enterprise CSM and account executive next Tuesday to discuss volume pricing tiers and rollout timeline?

Thank you for the fantastic support as always!

Rachel Thorne
Global Head of Digital Operations
Vanguard Media Group`,
  },
];

export interface SampleDataset {
  id: string;
  name: string;
  category: string;
  description: string;
  recordsCount: number;
  data: string;
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'saas-b2b-accounts',
    name: '📊 B2B SaaS Account Health, Churn & ARR Matrix (40 Accounts)',
    category: 'Subscription Health',
    description: 'Comprehensive account-level metrics including ARR, login frequency, ticket count, CSAT, NPS, contract renewal window, and active churn risk signals.',
    recordsCount: 40,
    data: `Account_ID,Company_Name,Tier,Annual_ARR,Health_Score,NPS,Weekly_Logins,Open_Tickets,Avg_Resolution_Days,Days_To_Renewal,Churn_Risk,Primary_Risk_Factor
ACC-101,Apex Logistics Global,Enterprise,84000,42,4,12,6,5.8,28,High,Integration CRM Sync Failure
ACC-102,FinPulse Systems,Enterprise,120000,51,5,44,8,6.2,85,High,Production API SLA Violations
ACC-103,Strata Growth Partners,Mid-Market,32000,49,5,18,3,4.1,45,High,Billing Dispute & Downgrade Threat
ACC-104,OmniHealth Solutions,Mid-Market,24000,61,6,22,4,3.2,72,Medium,Adoption Plateau & Permission UX
ACC-105,Vanguard Media Group,Enterprise,95000,94,10,140,1,1.1,190,Low,Healthy - Expansion Ready
ACC-106,CloudScale Infrastructure,Enterprise,110000,88,9,98,2,1.4,140,Low,Healthy - High Engagement
ACC-107,Beacon Health Network,Enterprise,76000,58,6,28,5,4.9,52,Medium,Executive Sponsor Left Company
ACC-108,Lumina Digital Studios,Mid-Market,28000,86,8,55,1,1.8,210,Low,Consistent Active Daily Use
ACC-109,Hyperion Retail Group,Enterprise,92000,38,3,9,7,7.1,35,High,Zero C-Level Login in 60 Days
ACC-110,Nexus Cyber Defense,Enterprise,135000,91,9,165,2,1.3,165,Low,Multi-Integration Power User
ACC-111,Solaria Clean Energy,Mid-Market,36000,64,7,32,2,2.5,95,Medium,Export Feature Limitations
ACC-112,Veritas Biometrics,Mid-Market,41000,44,4,14,5,5.4,41,High,Competitor RFP Initiated
ACC-113,BlueWave Telecom,Enterprise,105000,72,7,80,3,3.0,110,Medium,Mid-Tier Feature Adoption
ACC-114,Kestrel Financial,Enterprise,68000,89,9,74,1,1.2,185,Low,Solid Net Retention Expansion
ACC-115,Cascade Logistics,Mid-Market,29000,52,5,19,4,4.6,60,High,Onboarding Incomplete at Day 45
ACC-116,Aegis Insurance Tech,Enterprise,82000,87,8,88,2,1.5,130,Low,Healthy Core Platform Usage
ACC-117,Synthetix Analytics,Mid-Market,34000,79,8,48,2,2.0,120,Low,Stable Usage Pattern
ACC-118,Orion Robotics,Enterprise,115000,60,6,42,4,3.8,80,Medium,Support Response Time Grievance
ACC-119,Metropolis Mobility,Mid-Market,22000,36,2,7,6,6.8,19,High,Pending Cancellation Notice
ACC-120,Zion BioPharma,Enterprise,140000,95,10,190,0,0.8,240,Low,Executive Advocate Champion
ACC-121,Pinnacle Advisory,Mid-Market,26000,70,7,35,2,2.2,105,Low,Moderate Engagement
ACC-122,Atlas Freight Forwarding,Enterprise,88000,45,4,16,6,5.9,32,High,Legacy Data Migration Delay
ACC-123,Quantum Retail Systems,Mid-Market,38000,83,8,52,1,1.6,150,Low,Standard Operational Health
ACC-124,Echo Stream Media,Mid-Market,31000,56,6,24,3,3.7,68,Medium,Staff Turnover in Admin Team
ACC-125,Terraform Materials,Enterprise,74000,90,9,95,1,1.2,175,Low,High Daily Active Ratio
ACC-126,Equinox Capital,Enterprise,98000,62,6,38,4,3.4,77,Medium,Custom Reporting Request Unmet
ACC-127,Novus Security,Mid-Market,27000,48,4,15,5,4.8,48,High,Low Feature Penetration
ACC-128,Horizon Healthcare,Enterprise,85000,85,8,82,2,1.9,135,Low,Good Team Satisfaction
ACC-129,Starlight Games,Mid-Market,33000,92,9,68,1,1.0,200,Low,Enthusiastic User Base
ACC-130,Prime Meridian Supply,Mid-Market,35000,41,3,11,7,6.5,25,High,Repeated System Sync Timeout
ACC-131,Centurion Aviation,Enterprise,125000,82,8,91,2,2.1,115,Low,Contract Expansion In Process
ACC-132,Oasis E-commerce,Mid-Market,29000,53,5,20,3,4.0,55,Medium,Mobile App Absence Complaint
ACC-133,Vortex Renewable Energy,Enterprise,79000,88,9,86,1,1.3,160,Low,Strong C-Suite Alignment
ACC-134,Halcyon Hospitality,Mid-Market,25000,39,3,8,6,7.0,22,High,Budget Freeze / Downsizing
ACC-135,Delta Payments,Enterprise,112000,77,7,78,3,2.8,90,Medium,Minor Performance Hiccups
ACC-136,Frontier AI Labs,Enterprise,130000,96,10,175,1,0.9,220,Low,Top Tier Power Customer
ACC-137,Sterling Legal Tech,Mid-Market,30000,66,7,30,2,2.4,100,Medium,SSO Integration Pending
ACC-138,Boreal Forestry Corp,Mid-Market,23000,47,4,13,4,5.1,44,High,Unresponsive to CSM Outreach
ACC-139,Solstice Travel Group,Mid-Market,31000,84,8,54,1,1.7,145,Low,Steady Account Usage
ACC-140,Titan Heavy Industries,Enterprise,99000,74,7,67,3,2.9,105,Medium,Needs Workflow Optimization`,
  },
  {
    id: 'cohort-retention-trends',
    name: '📈 Customer Onboarding Cohort Retention & Feature Adoption (CSV)',
    category: 'Cohort & Adoption',
    description: 'Tracks 6 monthly customer signup cohorts, onboarding checklist completion percentages, third-party connector adoption, and net retention over 180 days.',
    recordsCount: 36,
    data: `Cohort_Month,Signups_Count,Completed_Onboarding_Pct,Added_2_Integrations_Pct,Month_1_Retention,Month_2_Retention,Month_3_Retention,Month_6_Retention,Primary_Churn_Driver
2026-Jan,85,78%,62%,96.4%,92.1%,88.2%,84.7%,Integration failure during scale
2026-Feb,92,81%,67%,97.8%,94.5%,90.8%,87.2%,Lack of executive champion buy-in
2026-Mar,110,69%,44%,91.2%,83.5%,76.4%,68.1%,Self-serve drop-off / UI complexity
2026-Apr,104,72%,51%,93.0%,86.1%,80.2%,73.5%,Competitor price matching campaign
2026-May,118,84%,71%,98.2%,95.8%,92.0%,88.9%,Superb automated welcome playbook
2026-Jun,125,86%,74%,98.9%,96.2%,93.4%,90.1%,Dedicated live CSM onboarding calls
Segment_Enterprise,140,92%,88%,99.1%,97.5%,95.2%,92.8%,Unmet custom enterprise security SLA
Segment_MidMarket,260,82%,65%,96.5%,91.4%,86.3%,81.0%,Admin team turnover & training gap
Segment_GrowthSMB,234,67%,42%,89.4%,79.8%,71.2%,64.3%,Budget cuts and feature non-use`,
  },
  {
    id: 'support-ticket-csat',
    name: '🎯 Support Ticket Volume, Escalations & CSAT by Category',
    category: 'Support & Satisfaction',
    description: 'Aggregated support ticket statistics across 8 product categories, average first response time, escalation rates, customer satisfaction (CSAT), and churn correlation.',
    recordsCount: 8,
    data: `Category,Monthly_Volume,Avg_First_Response_Mins,Avg_Resolution_Hours,Escalation_Rate_Pct,CSAT_Score_OutOf_5,Churn_Correlation_Score,Customer_Sentiment_Dominant
Integrations & Webhooks,342,42,38.4,18.4%,3.2,0.88,Negative - Blocked critical data pipelines
Authentication & SSO,128,18,8.2,4.1%,4.6,0.24,Neutral - Resolved quickly once verified
Billing & Licensing,215,65,24.1,12.2%,3.4,0.72,Negative - Angry over unexpected charges
Core Dashboard Analytics,410,25,12.6,6.3%,4.3,0.38,Positive/Neutral - General how-to questions
Data Export & Reports,290,34,19.8,11.5%,3.6,0.61,Negative - Formatting & size limits
User Permissions & Roles,185,28,14.5,8.9%,3.8,0.52,Neutral - Documentation ambiguity
API Rate Limits & 504s,164,15,44.2,22.6%,2.8,0.94,Extreme Negative - Direct downtime impact
Mobile & Notification Alerts,95,30,16.0,3.2%,4.4,0.18,Positive - Quick settings adjustment`,
  },
];
