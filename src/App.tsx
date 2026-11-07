import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { CustomerSuccessSection } from './components/CustomerSuccessSection';
import { CustomerDataSection } from './components/CustomerDataSection';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { Shield, Sparkles, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('customer-success');

  const handleNavigateTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'customer-success' && <CustomerSuccessSection />}
        {activeTab === 'customer-data' && <CustomerDataSection />}
        {activeTab === 'overview' && <ExecutiveOverview onNavigateTab={handleNavigateTab} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">PulseCS AI Suite</span>
            <span>•</span>
            <span>Customer Success & Business Analytics Demonstration</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Safe Sandbox Environment • No live emails sent</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-indigo-600 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Gemini 3.8 Flash</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
