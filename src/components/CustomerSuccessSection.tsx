import React, { useState } from 'react';
import {
  SAMPLE_TICKETS,
  SampleTicket,
} from '../data/samples';
import { SentimentGauge } from './charts/SentimentGauge';
import {
  Sparkles,
  AlertOctagon,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  Send,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Edit3,
  FileText,
  User,
  Building,
  DollarSign,
  ChevronRight,
  TrendingDown,
  Quote,
} from 'lucide-react';

export interface TicketAnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative' | string;
  sentimentScore: number;
  sentimentAnalysis: string;
  mainProblem: string;
  problemCategory: string;
  problemDetails: string;
  urgency: 'low' | 'medium' | 'high' | string;
  urgencyScore: number;
  urgencyReasoning: string;
  churnRisk: 'low' | 'medium' | 'high' | string;
  churnRiskPercentage: number;
  churnRiskFactors: string[];
  recommendedNextStep: string;
  csmActionPlan: {
    step: number;
    priority: string;
    role: string;
    action: string;
  }[];
  draftResponse: string;
  draftVariants?: {
    executive?: string;
    technical?: string;
  };
  keyPhrases: string[];
  _warning?: string;
}

export const CustomerSuccessSection: React.FC = () => {
  const [ticketText, setTicketText] = useState<string>(SAMPLE_TICKETS[0].content);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SAMPLE_TICKETS[0].id);
  const [selectedPreset, setSelectedPreset] = useState<SampleTicket | null>(SAMPLE_TICKETS[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TicketAnalysisResult | null>(null);

  // Draft response controls
  const [activeDraftTone, setActiveDraftTone] = useState<'standard' | 'executive' | 'technical'>('standard');
  const [editableDraft, setEditableDraft] = useState<string>('');
  const [isEditingDraft, setIsEditingDraft] = useState<boolean>(false);
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);

  const handleSelectPreset = (ticket: SampleTicket) => {
    setSelectedPresetId(ticket.id);
    setSelectedPreset(ticket);
    setTicketText(ticket.content);
    setAnalysis(null);
    setIsEditingDraft(false);
  };

  const handleAnalyze = async () => {
    if (!ticketText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ticketText,
          context: selectedPreset
            ? {
                customerName: selectedPreset.customerName,
                company: selectedPreset.company,
                tier: selectedPreset.tier,
                arr: selectedPreset.arr,
              }
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: TicketAnalysisResult = await response.json();
      setAnalysis(data);
      setEditableDraft(data.draftResponse);
      setIsEditingDraft(false);
    } catch (err: any) {
      console.error('Error analyzing ticket:', err);
      setError('Unable to analyze message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDraft = () => {
    let textToCopy = editableDraft;
    if (activeDraftTone === 'executive' && analysis?.draftVariants?.executive) {
      textToCopy = analysis.draftVariants.executive;
    } else if (activeDraftTone === 'technical' && analysis?.draftVariants?.technical) {
      textToCopy = analysis.draftVariants.technical;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          dot: 'bg-rose-500',
          label: 'High Urgency (SLA < 2h)',
        };
      case 'medium':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          dot: 'bg-amber-500',
          label: 'Medium Urgency (SLA < 8h)',
        };
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dot: 'bg-emerald-500',
          label: 'Low Urgency (Standard SLA)',
        };
    }
  };

  const getChurnRiskBadge = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          label: 'High Churn Risk',
        };
      case 'medium':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          label: 'Moderate Churn Risk',
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          label: 'Low Churn Risk',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Customer Success Intelligence Engine
            </div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">
              Customer Message & Ticket Analyzer
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Paste any customer email, escalation, or support ticket to automatically diagnose
              sentiment, urgency, root cause, churn likelihood, and generate ready-to-send CSM responses.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={handleAnalyze}
              disabled={loading || !ticketText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Message...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Demo Example Presets Selector */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              One-Click Demonstration Scenarios:
            </span>
            <span className="text-xs text-slate-400">Click any preset to test immediately</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {SAMPLE_TICKETS.map((ticket) => {
              const isSelected = selectedPresetId === ticket.id;
              return (
                <button
                  key={ticket.id}
                  onClick={() => handleSelectPreset(ticket)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900 truncate mb-1">{ticket.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">{ticket.company}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${ticket.badgeColor}`}>
                      {ticket.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                Customer Email / Support Ticket Text
              </label>
              <button
                onClick={() => {
                  setTicketText('');
                  setSelectedPresetId('');
                  setSelectedPreset(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear text
              </button>
            </div>

            <textarea
              value={ticketText}
              onChange={(e) => setTicketText(e.target.value)}
              placeholder="Paste customer email, ZenDesk ticket, Intercom chat, or feedback note here..."
              rows={12}
              className="w-full p-3.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y text-slate-800"
            />

            <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
              <span>{ticketText.length} characters • {ticketText.split(/\s+/).filter(Boolean).length} words</span>
              {selectedPreset && (
                <span className="font-medium text-indigo-600">
                  {selectedPreset.company} ({selectedPreset.arr})
                </span>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !ticketText.trim()}
              className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Run Customer Success Diagnostics
                </>
              )}
            </button>
          </div>

          {/* Quick Context Card */}
          {selectedPreset && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs space-y-2">
              <div className="font-bold text-slate-700 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                Selected Account Context
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Account Sponsor</span>
                  <span className="font-semibold text-slate-800">{selectedPreset.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Annual Contract Value</span>
                  <span className="font-semibold text-slate-800 font-mono">{selectedPreset.arr}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Service Tier</span>
                  <span className="font-semibold text-slate-800">{selectedPreset.tier}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Renewal Status</span>
                  <span className="font-semibold text-amber-700">{selectedPreset.badge}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          {!analysis && !loading && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[440px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Ready for AI Customer Success Diagnostics
              </h3>
              <p className="text-xs text-slate-500 max-w-md mb-6">
                Click <strong>"Analyze with AI"</strong> above to extract customer sentiment, urgency,
                churn danger, root cause, CSM next steps, and instant email draft.
              </p>
              <button
                onClick={handleAnalyze}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-all cursor-pointer"
              >
                Launch Demo Analysis
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[440px]">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                <Sparkles className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Evaluating Customer Sentiment & Churn Signals...
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Synthesizing emotional tone, identifying root friction, and drafting response...
              </p>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-5 animate-fadeIn">
              {/* Top KPI Ribbon: Sentiment, Urgency, Churn Risk */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Sentiment Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between mb-1">
                    <span>Sentiment</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {analysis.sentimentScore}/100
                    </span>
                  </div>
                  <SentimentGauge score={analysis.sentimentScore} sentiment={analysis.sentiment} size={135} />
                  <p className="text-[11px] text-slate-500 text-center line-clamp-2 mt-1">
                    {analysis.sentimentAnalysis}
                  </p>
                </div>

                {/* Urgency Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between mb-1">
                      <span>Assessed Urgency</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    {(() => {
                      const badge = getUrgencyBadge(analysis.urgency);
                      return (
                        <div className={`mt-2 p-2.5 rounded-lg border flex items-center gap-2 ${badge.bg}`}>
                          <span className={`w-2.5 h-2.5 rounded-full ${badge.dot} animate-pulse`} />
                          <span className="text-xs font-bold uppercase">{analysis.urgency} Urgency</span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="my-2">
                    <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                      <span>Urgency Score</span>
                      <span className="font-bold">{analysis.urgencyScore} / 10</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${(analysis.urgencyScore / 10) * 100}%` }}
                        className={`h-full ${
                          analysis.urgency.toLowerCase() === 'high'
                            ? 'bg-rose-500'
                            : analysis.urgency.toLowerCase() === 'medium'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {analysis.urgencyReasoning}
                  </p>
                </div>

                {/* Churn Risk Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between mb-1">
                      <span>Estimated Churn Risk</span>
                      <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    {(() => {
                      const riskBadge = getChurnRiskBadge(analysis.churnRisk);
                      return (
                        <div className={`mt-2 p-2.5 rounded-lg border flex items-center justify-between ${riskBadge.bg}`}>
                          <span className="text-xs font-bold uppercase">{analysis.churnRisk} Risk</span>
                          <span className="text-xs font-black font-mono">{analysis.churnRiskPercentage}%</span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="my-2 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Identified Warning Flags</span>
                    {analysis.churnRiskFactors.slice(0, 2).map((factor, i) => (
                      <div key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold shrink-0">•</span>
                        <span className="truncate">{factor}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-slate-400">
                    Proactive intervention recommended
                  </div>
                </div>
              </div>

              {/* Identified Main Problem Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Identified Main Problem
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {analysis.problemCategory}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mb-1.5">
                  {analysis.mainProblem}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysis.problemDetails}
                </p>

                {analysis.keyPhrases && analysis.keyPhrases.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                      <Quote className="w-3 h-3" /> Customer Quote Triggers:
                    </span>
                    {analysis.keyPhrases.map((phrase, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono border border-slate-200"
                      >
                        "{phrase}"
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Next Step & CSM Action Plan */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="bg-gradient-to-r from-indigo-50 via-indigo-50/50 to-slate-50 border border-indigo-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Recommended CSM Next Step (Highest Priority)
                  </div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    {analysis.recommendedNextStep}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    CSM Resolution Action Plan
                  </h4>
                  <div className="space-y-2">
                    {analysis.csmActionPlan.map((item) => (
                      <div
                        key={item.step}
                        className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 text-xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {item.step}
                        </span>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="font-bold text-slate-900">{item.role}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs leading-normal">{item.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Draft Professional Response */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      AI-Drafted Customer Response
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Tone Switcher */}
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs font-medium">
                      <button
                        onClick={() => {
                          setActiveDraftTone('standard');
                          setEditableDraft(analysis.draftResponse);
                        }}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          activeDraftTone === 'standard'
                            ? 'bg-white text-indigo-700 font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Empathetic
                      </button>
                      <button
                        onClick={() => {
                          setActiveDraftTone('executive');
                          if (analysis.draftVariants?.executive) {
                            setEditableDraft(analysis.draftVariants.executive);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          activeDraftTone === 'executive'
                            ? 'bg-white text-indigo-700 font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Executive
                      </button>
                      <button
                        onClick={() => {
                          setActiveDraftTone('technical');
                          if (analysis.draftVariants?.technical) {
                            setEditableDraft(analysis.draftVariants.technical);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          activeDraftTone === 'technical'
                            ? 'bg-white text-indigo-700 font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Technical
                      </button>
                    </div>

                    <button
                      onClick={() => setIsEditingDraft(!isEditingDraft)}
                      className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      {isEditingDraft ? 'Done' : 'Edit'}
                    </button>

                    <button
                      onClick={handleCopyDraft}
                      className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer transition-all"
                    >
                      {copiedDraft ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy Draft
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {isEditingDraft ? (
                  <textarea
                    value={editableDraft}
                    onChange={(e) => setEditableDraft(e.target.value)}
                    rows={8}
                    className="w-full p-3.5 text-xs font-sans bg-slate-50 border border-indigo-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 leading-relaxed"
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
                    {editableDraft || analysis.draftResponse}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Demonstration Mode • No live emails will be dispatched</span>
                  <span>Tone: {activeDraftTone.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
