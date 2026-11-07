import React from 'react';

export interface TierRisk {
  tier: string;
  safe: number;
  atRisk: number;
  arrAtRisk: number;
}

interface RiskBarChartProps {
  data: TierRisk[];
  title?: string;
}

export const RiskBarChart: React.FC<RiskBarChartProps> = ({
  data,
  title = 'Churn Exposure & ARR At Risk by Segment',
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h4>
          <p className="text-xs text-slate-500">Safe vs. At-Risk accounts with financial exposure</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md">
          ARR Concentration
        </span>
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const total = item.safe + item.atRisk;
          const safePct = Math.round((item.safe / (total || 1)) * 100);
          const riskPct = 100 - safePct;

          return (
            <div key={item.tier} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{item.tier}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    <strong className="text-slate-800">{item.atRisk}</strong> of {total} at risk
                  </span>
                  <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    ${(item.arrAtRisk / 1000).toLocaleString()}k ARR
                  </span>
                </div>
              </div>

              {/* Stacked Bar */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${safePct}%` }}
                  className="bg-emerald-500 transition-all duration-500 rounded-l-full"
                  title={`Safe: ${item.safe} accounts (${safePct}%)`}
                />
                <div
                  style={{ width: `${riskPct}%` }}
                  className="bg-rose-500 transition-all duration-500 rounded-r-full"
                  title={`At Risk: ${item.atRisk} accounts (${riskPct}%)`}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Healthy: {safePct}%</span>
                <span className="text-rose-500 font-semibold">At Risk: {riskPct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Low Risk / Retained</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>High Churn Probability</span>
        </div>
      </div>
    </div>
  );
};
