import React, { useState } from 'react';

export interface CohortPoint {
  cohort: string;
  retention: number;
  benchmark: number;
}

interface RetentionLineChartProps {
  data: CohortPoint[];
  title?: string;
}

export const RetentionLineChart: React.FC<RetentionLineChartProps> = ({
  data,
  title = 'Cohort Retention Curve vs. 90% Target Benchmark',
}) => {
  const [activePoint, setActivePoint] = useState<CohortPoint | null>(null);

  if (!data || data.length === 0) return null;

  // Chart coordinates
  const width = 540;
  const height = 210;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Y-axis range: 50% to 105%
  const minY = 50;
  const maxY = 105;

  const getY = (val: number) => {
    return paddingTop + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight;
  };

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  // Build SVG Path for actual retention
  const points = data.map((d, i) => `${getX(i)},${getY(d.retention)}`).join(' ');
  const benchmarkPoints = data.map((d, i) => `${getX(i)},${getY(d.benchmark)}`).join(' ');

  // Gradient area path
  const areaPath = `M ${getX(0)},${getY(data[0].retention)} ` +
    data.map((d, i) => `L ${getX(i)},${getY(d.retention)}`).join(' ') +
    ` L ${getX(data.length - 1)},${paddingTop + chartHeight} L ${getX(0)},${paddingTop + chartHeight} Z`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h4>
          <p className="text-xs text-slate-500">
            Retention decay trajectory over 180 days post-onboarding
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-indigo-600 rounded-full inline-block" />
            <span className="text-slate-700">Actual Cohort</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 border-t-2 border-dashed border-emerald-500 inline-block" />
            <span className="text-slate-500">Target Benchmark</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[60, 75, 90, 100].map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* Gradient area */}
          <path d={areaPath} fill="url(#retentionGrad)" />

          {/* Benchmark line */}
          <polyline
            points={benchmarkPoints}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Actual retention line */}
          <polyline
            points={points}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.retention);
            const isActive = activePoint?.cohort === d.cohort;

            return (
              <g key={d.cohort} className="cursor-pointer" onMouseEnter={() => setActivePoint(d)} onMouseLeave={() => setActivePoint(null)}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? 6 : 4}
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  className="transition-all"
                />
                <text
                  x={cx}
                  y={paddingTop + chartHeight + 18}
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {d.cohort}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover detail tooltip */}
        {activePoint && (
          <div className="absolute top-2 right-4 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg border border-slate-700 pointer-events-none animate-fadeIn">
            <div className="font-bold text-slate-100">{activePoint.cohort}</div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-indigo-300 font-mono">Actual: {activePoint.retention}%</span>
              <span className="text-emerald-400 font-mono">Target: {activePoint.benchmark}%</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Delta: {activePoint.retention - activePoint.benchmark >= 0 ? '+' : ''}
              {activePoint.retention - activePoint.benchmark}% vs goal
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
