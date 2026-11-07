import React from 'react';
import {
  Activity,
  MessageSquareText,
  BarChart2,
  Sparkles,
  LayoutDashboard,
  ShieldAlert,
} from 'lucide-react';

export type ActiveTab = 'customer-success' | 'customer-data' | 'overview';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-900 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                  Pulse<span className="text-indigo-600">CS</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Customer Success & Business Analytics AI Assistant
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('customer-success')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'customer-success'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MessageSquareText className="w-4 h-4 text-indigo-600" />
              <span>Customer Success</span>
            </button>

            <button
              onClick={() => setActiveTab('customer-data')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'customer-data'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>Data Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Portfolio Overview</span>
              <span className="md:hidden">Overview</span>
            </button>
          </nav>

          {/* Status badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gemini 3.8 Flash Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
