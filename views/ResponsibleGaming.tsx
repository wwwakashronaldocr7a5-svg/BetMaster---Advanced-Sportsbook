
import React, { useState, useEffect } from 'react';
import { Shield, Target, Clock, AlertTriangle, HelpCircle, BrainCircuit } from 'lucide-react';
import { getRiskScore } from '../services/geminiService';

const ResponsibleGaming: React.FC = () => {
  const [safetyScore, setSafetyScore] = useState<{score: number; recommendation: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      setLoading(true);
      const res = await getRiskScore({ bets: 12, losses: 400, winRate: 0.66, frequency: 'daily' });
      setSafetyScore(res);
      setLoading(false);
    };
    fetchScore();
  }, []);

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="text-[#fbbf24]" />
          Safe Play Center
        </h1>
        <p className="text-gray-400">Manage your gaming experience and keep it fun and safe.</p>
      </div>

      {/* AI Risk Score Analysis */}
      <div className="bg-[#1a1a1a] p-6 lg:p-8 rounded-2xl border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BrainCircuit size={120} className="text-[#fbbf24]" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
          <div className="space-y-4 lg:col-span-2">
            <h2 className="text-xl font-bold text-[#fbbf24] flex items-center gap-2">
              <BrainCircuit size={20} />
              AI Play Pattern Analysis
            </h2>
            <p className="text-gray-300 leading-relaxed italic">
              "Based on your recent 14-day activity, your play style remains within healthy parameters. We've detected consistent stake sizing and regular breaks."
            </p>
            {safetyScore ? (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <p className="text-green-400 font-bold mb-1">AI Recommendation:</p>
                <p className="text-sm text-gray-400">{safetyScore.recommendation}</p>
              </div>
            ) : (
              <div className="h-20 animate-pulse bg-gray-800 rounded-xl"></div>
            )}
          </div>
          
          <div className="flex flex-col items-center justify-center p-6 bg-[#242424] rounded-2xl border border-gray-700 shadow-xl">
            <div className="relative w-32 h-32 flex items-center justify-center">
               <svg className="w-full h-full -rotate-90">
                 <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                 <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * (safetyScore?.score || 10)) / 100}
                    className="text-green-500 transition-all duration-1000" 
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{safetyScore?.score || '--'}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Safety Score</span>
               </div>
            </div>
            <div className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Calculated by AI</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Deposit Limit */}
        <LimitCard 
          icon={<Target size={24} className="text-blue-400" />} 
          title="Deposit Limit" 
          description="Control how much you can deposit in 24 hours."
          current="₹10,000"
          onUpdate={() => {}}
        />
        {/* Time Limit */}
        <LimitCard 
          icon={<Clock size={24} className="text-purple-400" />} 
          title="Session Timer" 
          description="Automatic logout after a set period of activity."
          current="2 Hours"
          onUpdate={() => {}}
        />
      </div>

      {/* Self-Exclusion Area */}
      <div className="bg-red-900/10 border border-red-500/30 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-bold text-red-500">Need a longer break?</h3>
            <p className="text-gray-400 text-sm mt-1">Self-exclusion will permanently or temporarily block access to your account across our entire network.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="p-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-xl border border-red-900 font-bold transition-all text-sm">24 Hours</button>
          <button className="p-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-xl border border-red-900 font-bold transition-all text-sm">1 Week</button>
          <button className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-red-900/20">Permanent</button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <HelpCircle size={32} className="text-gray-600" />
          <div>
            <h4 className="font-bold">Help is available</h4>
            <p className="text-xs text-gray-500">Reach out to our professional support line 24/7 if you have concerns.</p>
          </div>
        </div>
        <button className="text-[#fbbf24] font-bold underline">Talk to someone</button>
      </div>
    </div>
  );
};

const LimitCard = ({ icon, title, description, current, onUpdate }: any) => (
  <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 space-y-4 hover:border-gray-700 transition-colors">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-gray-800 rounded-xl">{icon}</div>
      <div className="text-right">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Current</span>
        <div className="text-lg font-bold text-white">{current}</div>
      </div>
    </div>
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
    <button 
      onClick={onUpdate}
      className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-[#fbbf24] rounded-lg font-bold transition-all text-sm"
    >
      Modify Limit
    </button>
  </div>
);

export default ResponsibleGaming;
