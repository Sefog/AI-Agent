import React, { useState } from 'react';

export interface HealthSlice {
  name: string;
  count: number;
  arr: number;
  color: string;
}

interface HealthDonutChartProps {
  data: HealthSlice[];
  title?: string;
}

export const HealthDonutChart: React.FC<HealthDonutChartProps> = ({
  data,
  title = 'Account Health & Revenue At Risk',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const totalARR = data.reduce((sum, item) => sum + item.arr, 0);

  // SVG parameters
  const size = 200;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h4>
          <p className="text-xs text-slate-500">Distribution across active portfolio accounts</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
          {totalCount} Total Accounts
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Donut representation */}
        <div className="md:col-span-5 flex justify-center relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
            {data.map((slice, index) => {
              const slicePercent = slice.count / (totalCount || 1);
              const strokeDasharray = `${circumference * slicePercent} ${circumference}`;
              const strokeDashoffset = -(circumference * cumulativePercent);
              cumulativePercent += slicePercent;

              const isHovered = hoveredIndex === index;

              return (
                <circle
                  key={slice.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {hoveredIndex !== null ? (
              <>
                <span className="text-xs font-medium text-slate-500 line-clamp-1 max-w-[100px]">
                  {data[hoveredIndex].name.split(' ')[0]}
                </span>
                <span className="text-lg font-black text-slate-900 leading-tight">
                  {data[hoveredIndex].count} accts
                </span>
                <span className="text-[11px] font-semibold text-slate-600">
                  ${(data[hoveredIndex].arr / 1000).toFixed(0)}k ARR
                </span>
              </>
            ) : (
              <>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Total ARR
                </span>
                <span className="text-base font-extrabold text-slate-900 leading-tight">
                  ${(totalARR / 1000000).toFixed(2)}M
                </span>
                <span className="text-[11px] text-slate-500">Portfolio</span>
              </>
            )}
          </div>
        </div>

        {/* Legend & Breakdown */}
        <div className="md:col-span-7 flex flex-col gap-2.5">
          {data.map((item, index) => {
            const pct = Math.round((item.count / (totalCount || 1)) * 100);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isHovered
                    ? 'border-indigo-300 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-700">
                    {item.count} accts ({pct}%)
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>ARR Contribution</span>
                  <span className="font-mono font-semibold text-slate-900">
                    ${(item.arr / 1000).toLocaleString()}k
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
