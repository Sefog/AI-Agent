import React, { useState } from 'react';
import { SAMPLE_DATASETS, SampleDataset } from '../data/samples';
import { HealthDonutChart, HealthSlice } from './charts/HealthDonutChart';
import { RetentionLineChart, CohortPoint } from './charts/RetentionLineChart';
import { RiskBarChart, TierRisk } from './charts/RiskBarChart';
import { FrictionDriversChart, FrictionFactor } from './charts/FrictionDriversChart';
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  TrendingDown,
  Layers,
  Database,
  ArrowUpRight,
  ShieldCheck,
  DollarSign,
  Users,
} from 'lucide-react';

export interface DataAnalysisResult {
  datasetSummary: {
    totalRecords: number;
    timePeriod: string;
    keyMetrics: {
      label: string;
      value: string;
      change?: string;
      status: 'good' | 'warning' | 'danger' | string;
    }[];
  };
  identifiedTrends: {
    title: string;
    description: string;
    direction: 'positive' | 'negative' | 'neutral' | string;
    significance: string;
  }[];
  retentionProblems: {
    issue: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | string;
    affectedSegment: string;
    estimatedLossARR: string;
    warningIndicators: string[];
  }[];
  businessFindings: {
    category: string;
    finding: string;
    strategicImpact: string;
  }[];
  recommendations: {
    title: string;
    priority: 'High' | 'Medium' | 'Low' | string;
    timeframe: string;
    expectedImpact: string;
    actionItems: string[];
  }[];
  chartData: {
    healthDistribution: HealthSlice[];
    cohortRetention: CohortPoint[];
    churnRiskByTier: TierRisk[];
    topFrictionFactors: FrictionFactor[];
  };
  _warning?: string;
}

export const CustomerDataSection: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>(SAMPLE_DATASETS[0].data);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(SAMPLE_DATASETS[0].id);
  const [selectedDataset, setSelectedDataset] = useState<SampleDataset | null>(SAMPLE_DATASETS[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DataAnalysisResult | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const handleSelectDataset = (ds: SampleDataset) => {
    setSelectedDatasetId(ds.id);
    setSelectedDataset(ds);
    setDataInput(ds.data);
    setAnalysis(null);
  };

  const handleAnalyzeData = async () => {
    if (!dataInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawData: dataInput,
          dataType: selectedDataset ? selectedDataset.category : 'Customer Dataset',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result: DataAnalysisResult = await response.json();
      setAnalysis(result);
    } catch (err: any) {
      console.error('Error analyzing customer data:', err);
      setError('Unable to analyze data. Please verify format and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!analysis) return;
    const brief = `=== CUSTOMER SUCCESS & BUSINESS ANALYTICS REPORT ===
Time Period: ${analysis.datasetSummary.timePeriod}
Total Records: ${analysis.datasetSummary.totalRecords}

--- KEY METRICS ---
${analysis.datasetSummary.keyMetrics.map((m) => `• ${m.label}: ${m.value} (${m.change || ''})`).join('\n')}

--- RETENTION PROBLEMS IDENTIFIED ---
${analysis.retentionProblems.map((p) => `• [${p.severity.toUpperCase()}] ${p.issue} | Impact: ${p.estimatedLossARR}\n  Segment: ${p.affectedSegment}`).join('\n')}

--- STRATEGIC BUSINESS FINDINGS ---
${analysis.businessFindings.map((f) => `• [${f.category}] ${f.finding}\n  Impact: ${f.strategicImpact}`).join('\n')}

--- ACTIONABLE RECOMMENDATIONS ---
${analysis.recommendations.map((r) => `• [Priority: ${r.priority}] ${r.title} (${r.timeframe})\n  Expected Impact: ${r.expectedImpact}`).join('\n')}
`;
    navigator.clipboard.writeText(brief);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const getMetricStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'danger':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'warning':
      default:
        return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold';
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Customer Retention & Business Intelligence Engine
            </div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">
              Customer Data & Retention Analytics
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Paste customer data (CSV, JSON, or tabular records) to identify macro trends, isolate
              churn exposure, evaluate retention cohorts, and receive prioritized executive recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={handleAnalyzeData}
              disabled={loading || !dataInput.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing Dataset...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Customer Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dataset Preset Selector */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Sample Business Dataset:
            </span>
            <span className="text-xs text-slate-400">Ready to demonstrate with 1 click</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SAMPLE_DATASETS.map((ds) => {
              const isSelected = selectedDatasetId === ds.id;
              return (
                <button
                  key={ds.id}
                  onClick={() => handleSelectDataset(ds)}
                  className={`text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900 mb-1 line-clamp-1">{ds.name}</div>
                  <p className="text-slate-500 text-[11px] line-clamp-2 mb-2 leading-relaxed">
                    {ds.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 pt-1 border-t border-slate-100">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                      {ds.category}
                    </span>
                    <span>{ds.recordsCount} Sample Rows</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Input Data Accordion / Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            Raw Customer Data Input (CSV, Tabular, or JSON)
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setDataInput('');
                setSelectedDatasetId('');
                setSelectedDataset(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear input
            </button>
          </div>
        </div>

        <textarea
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          placeholder="Paste CSV rows, spreadsheet columns, or JSON objects here..."
          rows={6}
          className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 transition-all resize-y"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs text-slate-500">
          <span>
            {dataInput.split('\n').filter(Boolean).length} rows detected • {dataInput.length} chars
          </span>
          <button
            onClick={handleAnalyzeData}
            disabled={loading || !dataInput.trim()}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold rounded-lg text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Run Business Intelligence Analysis
          </button>
        </div>
      </div>

      {/* Main Analysis View */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!analysis && !loading && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Data Analysis Engine Ready
          </h3>
          <p className="text-xs text-slate-500 max-w-md mb-6">
            Click <strong>"Analyze Customer Data"</strong> to discover retention drop-offs, churn exposure,
            cohort benchmarks, and actionable CSM playbooks.
          </p>
          <button
            onClick={handleAnalyzeData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-all cursor-pointer"
          >
            Run Demo Analysis on 40 SaaS Accounts
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center flex flex-col items-center justify-center min-h-[380px]">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
            <Database className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Synthesizing Customer Cohorts & Financial Risk...
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Evaluating account health distribution, identifying churn clusters, and compiling executive findings...
          </p>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Executive Summary Ribbon & Copy Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-900 text-white rounded-2xl p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Customer Success Executive Intelligence Brief
              </div>
              <h3 className="text-lg font-bold">
                Analysis for {analysis.datasetSummary.totalRecords} Accounts ({analysis.datasetSummary.timePeriod})
              </h3>
            </div>
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-bold rounded-xl transition-all border border-white/20 cursor-pointer"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Copied Report!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Executive Brief
                </>
              )}
            </button>
          </div>

          {/* 4 Key Performance Indicator Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {analysis.datasetSummary.keyMetrics.map((kpi, idx) => {
              const statusClass = getMetricStatusStyle(kpi.status);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {kpi.label}
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight my-1">
                    {kpi.value}
                  </div>
                  {kpi.change && (
                    <div
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border self-start ${statusClass}`}
                    >
                      {kpi.change}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Health & ARR Distribution */}
            {analysis.chartData.healthDistribution && (
              <HealthDonutChart
                data={analysis.chartData.healthDistribution}
                title="Account Health Breakdown & ARR Distribution"
              />
            )}

            {/* Churn Risk Exposure by Segment */}
            {analysis.chartData.churnRiskByTier && (
              <RiskBarChart
                data={analysis.chartData.churnRiskByTier}
                title="Churn Exposure & ARR At Risk by Segment"
              />
            )}

            {/* Cohort Retention Progression */}
            {analysis.chartData.cohortRetention && (
              <RetentionLineChart
                data={analysis.chartData.cohortRetention}
                title="Customer Cohort Retention Trajectory vs Benchmark"
              />
            )}

            {/* Top Friction Root Causes */}
            {analysis.chartData.topFrictionFactors && (
              <FrictionDriversChart
                data={analysis.chartData.topFrictionFactors}
                title="Top Customer Friction Drivers Impacting Retention"
              />
            )}
          </div>

          {/* Identified Trends and Patterns */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Identified Trends & Usage Patterns
                </h3>
                <p className="text-xs text-slate-500">
                  Key behavioural correlations driving user engagement and account health
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.identifiedTrends.map((trend, i) => {
                const isPositive = trend.direction.toLowerCase() === 'positive';
                const isNegative = trend.direction.toLowerCase() === 'negative';

                return (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm leading-snug">
                        {trend.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isNegative
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {trend.direction} trend
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{trend.description}</p>

                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700">Business Takeaway:</span>
                      <span className="truncate">{trend.significance}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Potential Customer Retention Problems */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Potential Customer Retention Problems & Warning Flags
                  </h3>
                  <p className="text-xs text-slate-500">
                    Accounts and segments presenting high risk of voluntary churn or contraction
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                Active Churn Risks
              </span>
            </div>

            <div className="space-y-3.5">
              {analysis.retentionProblems.map((prob, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 hover:bg-rose-50/50 transition-all space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${getSeverityBadge(
                          prob.severity
                        )}`}
                      >
                        {prob.severity} Severity
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">{prob.issue}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500">{prob.affectedSegment}</span>
                      <span className="font-mono font-bold text-rose-600 bg-white px-2.5 py-1 rounded-md border border-rose-200">
                        Exposure: {prob.estimatedLossARR}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-rose-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Observed Warning Indicators:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {prob.warningIndicators.map((indicator, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-slate-700 flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-100"
                        >
                          <span className="text-rose-500 font-bold shrink-0">⚠</span>
                          <span className="line-clamp-2">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Business Findings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Key Strategic Business Findings
                </h3>
                <p className="text-xs text-slate-500">
                  High-level organizational discoveries synthesized from portfolio metrics
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.businessFindings.map((finding, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded inline-block mb-2">
                      {finding.category}
                    </span>
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {finding.finding}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-700 block mb-0.5">Strategic Impact:</span>
                    {finding.strategicImpact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practical CSM Recommendations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Practical CSM Recommendations & Interventions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Prescriptive, prioritized playbooks to arrest churn and protect revenue
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Action-Ready
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {analysis.recommendations.map((rec, i) => {
                const isHigh = rec.priority.toLowerCase() === 'high';
                return (
                  <div
                    key={i}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-4 hover:shadow-xs transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                            isHigh
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}
                        >
                          {rec.priority} Priority
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {rec.timeframe}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm mb-2">
                        {rec.title}
                      </h4>

                      <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-800 font-medium mb-3">
                        <strong className="block text-[10px] uppercase text-emerald-900">Expected Outcome:</strong>
                        {rec.expectedImpact}
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Action Items:
                        </div>
                        {rec.actionItems.map((act, actIdx) => (
                          <div
                            key={actIdx}
                            className="text-xs text-slate-700 flex items-start gap-1.5"
                          >
                            <span className="text-indigo-600 font-bold shrink-0">✓</span>
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
