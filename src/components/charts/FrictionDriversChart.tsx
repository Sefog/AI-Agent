import React from 'react';
import { AlertTriangle } from 'lucide-react';

export interface FrictionFactor {
  factor: string;
  count: number;
  impactScore: number; // 0 to 100
}

interface FrictionDriversChartProps {
  data: FrictionFactor[];
  title?: string;
}

export const FrictionDriversChart: React.FC<FrictionDriversChartProps> = ({
  data,
  title = 'Top Customer Friction Drivers Impacting Retention',
}) => {
  const maxImpact = Math.max(...data.map((d) => d.impactScore), 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h4>
          <p className="text-xs text-slate-500">Root friction patterns ranked by churn severity</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md font-semibold border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Priority Fixes</span>
        </div>
      </div>

      <div className="space-y-3.5">
        {data.map((item, idx) => {
          const barWidth = Math.round((item.impactScore / maxImpact) * 100);
          const isExtreme = item.impactScore >= 80;

          return (
            <div key={item.factor} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {item.factor}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">{item.count} occurrences</span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      isExtreme ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Impact {item.impactScore}/100
                  </span>
                </div>
              </div>

              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${barWidth}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    isExtreme
                      ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
