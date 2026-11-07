import React from 'react';
import { ActiveTab } from './Header';
import {
  Users,
  DollarSign,
  ShieldAlert,
  TrendingUp,
  Activity,
  ArrowRight,
  MessageSquare,
  BarChart3,
  CheckCircle,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { SAMPLE_TICKETS } from '../data/samples';

interface ExecutiveOverviewProps {
  onNavigateTab: (tab: ActiveTab, ticketId?: string) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ onNavigateTab }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 to-transparent pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            CS Executive Cockpit • Q4 Retention Focus
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Customer Success & Business Intelligence Portal
          </h1>

          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Welcome to the AI demonstration environment. Evaluate incoming customer communications,
            diagnose sentiment and urgency, prevent voluntary churn, and analyze cohort retention data
            using Google Gemini 3.8 Flash.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onNavigateTab('customer-success')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Analyze Support Ticket
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('customer-data')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              Explore Customer Retention Data
            </button>
          </div>
        </div>
      </div>

      {/* 4 High-Level Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Managed ARR</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">$3,420,000</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% YoY portfolio expansion</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Health Score</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">74.8 <span className="text-sm font-medium text-slate-400">/ 100</span></div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>68% of accounts in Healthy tier (&gt;75)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">ARR at Churn Risk</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">$342,000</div>
          <div className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold inline-block mt-1">
            8 Accounts flagged for urgent CSM intervention
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Resolution Time</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">4.2 hrs</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>98.1% SLA compliance for Priority 1</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Watchlist & Quick Showcase Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Urgent Account Watchlist */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Live CSM Priority Escalations Watchlist
              </h3>
              <p className="text-xs text-slate-500">
                Accounts showing elevated churn risk, pending renewals, or SLA warnings
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
              High Priority
            </span>
          </div>

          <div className="space-y-3">
            {SAMPLE_TICKETS.slice(0, 4).map((ticket) => (
              <div
                key={ticket.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {ticket.company}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ticket.badgeColor}`}>
                      {ticket.badge}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-1">{ticket.title}</div>
                  <div className="text-[11px] text-slate-400">
                    Lead Contact: {ticket.customerName} • Contract: {ticket.arr}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('customer-success', ticket.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white group-hover:bg-indigo-600 group-hover:text-white text-indigo-700 text-xs font-bold rounded-lg border border-slate-200 group-hover:border-indigo-600 transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Analyze</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights & AI Capability Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              PulseCS AI Capability Matrix
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">
                    Sentiment & Urgency Scoring
                  </strong>
                  <span className="text-slate-600">
                    Translates subtle linguistic nuance, emotional tone, and frustration signals into actionable SLA urgency levels.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">
                    Churn Risk & Warning Factor Detection
                  </strong>
                  <span className="text-slate-600">
                    Identifies competitive threats, impending contract expiration risk, and customer dissatisfaction patterns.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">
                    AI-Authored CSM Draft Responses
                  </strong>
                  <span className="text-slate-600">
                    Produces empathetic, executive, and technical drafts tailored to defuse friction and confirm concrete next steps.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">
                    Portfolio Data & Cohort Analytics
                  </strong>
                  <span className="text-slate-600">
                    Uncovers macroeconomic trends, onboarding drop-offs, and revenue concentration risk across hundreds of accounts.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
