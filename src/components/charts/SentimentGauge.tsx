import React from 'react';

interface SentimentGaugeProps {
  score: number; // 0 to 100
  sentiment: 'positive' | 'neutral' | 'negative' | string;
  size?: number;
}

export const SentimentGauge: React.FC<SentimentGaugeProps> = ({ score, sentiment, size = 160 }) => {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const radius = 58;
  const stroke = 12;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let color = '#10b981'; // emerald
  let label = 'Positive';
  let bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (sentiment.toLowerCase() === 'negative' || normalizedScore < 40) {
    color = '#ef4444'; // red
    label = 'Negative';
    bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (sentiment.toLowerCase() === 'neutral' || normalizedScore < 70) {
    color = '#f59e0b'; // amber
    label = 'Neutral';
    bgClass = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  // Pointer angle: 180 to 0 degrees
  const angle = 180 - (normalizedScore / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  const pointerX = 80 + (radius - 12) * Math.cos(rad);
  const pointerY = 75 - (radius - 12) * Math.sin(rad);

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <svg viewBox="0 0 160 95" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 18 80 A 62 62 0 0 1 142 80"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <path
            d="M 18 80 A 62 62 0 0 1 142 80"
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference * 1.05}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Center Indicator Pin */}
          <circle cx="80" cy="80" r="6" fill="#1e293b" />
          <line
            x1="80"
            y1="80"
            x2={pointerX}
            y2={pointerY}
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
            {normalizedScore}
            <span className="text-xs font-medium text-slate-400">/100</span>
          </span>
        </div>
      </div>

      <div className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full border ${bgClass}`}>
        {label} Sentiment
      </div>
    </div>
  );
};
