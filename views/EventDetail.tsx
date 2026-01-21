
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, TrendingUp, TrendingDown, Clock, Activity, Trophy, Info, Zap } from 'lucide-react';
import { Event, Selection, EventStatus } from '../types';
import { getBettingInsights } from '../services/geminiService';

interface EventDetailProps {
  event: Event;
  onBack: () => void;
  onAddSelection: (selection: Selection, event: Event) => void;
  selectedIds: string[];
}

interface MatchStats {
  attacks: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  possession: { home: number; away: number };
  corners: { home: number; away: number };
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onBack, onAddSelection, selectedIds }) => {
  const [liveEvent, setLiveEvent] = useState<Event>(event);
  const [oddsTrend, setOddsTrend] = useState<Record<string, 'up' | 'down' | null>>({});
  const [insight, setInsight] = useState<string>("");
  const [stats, setStats] = useState<MatchStats>({
    attacks: { home: 84, away: 62 },
    shotsOnTarget: { home: 5, away: 3 },
    possession: { home: 58, away: 42 },
    corners: { home: 7, away: 4 }
  });
  
  const oddsUpdateInterval = useRef<number | null>(null);

  useEffect(() => {
    // Initial AI Insight
    const fetchInsight = async () => {
      const topSelection = event.markets[0].selections[0];
      const res = await getBettingInsights(`${event.homeTeam} vs ${event.awayTeam}`, topSelection.odds);
      setInsight(res);
    };
    fetchInsight();

    // Simulating Live Odds and Stats Updates
    if (event.status === EventStatus.LIVE) {
      oddsUpdateInterval.current = window.setInterval(() => {
        // Update Odds
        setLiveEvent(prev => {
          const newMarkets = prev.markets.map(m => ({
            ...m,
            selections: m.selections.map(s => {
              const change = (Math.random() - 0.5) * 0.1;
              const newOdds = Math.max(1.01, s.odds + change);
              
              setOddsTrend(trends => ({
                ...trends,
                [s.id]: change > 0 ? 'up' : 'down'
              }));

              // Clear trend indicator after a short delay
              setTimeout(() => {
                setOddsTrend(trends => ({ ...trends, [s.id]: null }));
              }, 2000);

              return { ...s, odds: parseFloat(newOdds.toFixed(2)) };
            })
          }));
          return { ...prev, markets: newMarkets };
        });

        // Update Stats
        setStats(prev => {
          const isHomeAttacking = Math.random() > 0.5;
          const isCorner = Math.random() > 0.9;
          const isShot = Math.random() > 0.85;

          const newStats = { ...prev };

          // Update Attacks
          if (isHomeAttacking) newStats.attacks.home += Math.floor(Math.random() * 2);
          else newStats.attacks.away += Math.floor(Math.random() * 2);

          // Update Corners
          if (isCorner) {
            if (isHomeAttacking) newStats.corners.home += 1;
            else newStats.corners.away += 1;
          }

          // Update Shots
          if (isShot) {
            if (isHomeAttacking) newStats.shotsOnTarget.home += 1;
            else newStats.shotsOnTarget.away += 1;
          }

          // Subtle Possession Shift
          const shift = (Math.random() - 0.5) * 2;
          const newHomePoss = Math.min(70, Math.max(30, prev.possession.home + shift));
          newStats.possession = {
            home: Math.round(newHomePoss),
            away: 100 - Math.round(newHomePoss)
          };

          return newStats;
        });
      }, 5000);
    }

    return () => {
      if (oddsUpdateInterval.current) clearInterval(oddsUpdateInterval.current);
    };
  }, [event]);

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in slide-in-from-right-4 duration-300 pb-12">
      {/* Event Header */}
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-b border-gray-800 p-4 lg:p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ChevronLeft size={20} />
          <span>Back to Sportsbook</span>
        </button>

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full text-xs font-bold text-gray-400">
            <Trophy size={14} className="text-[#fbbf24]" />
            Champions League • Group Stage
          </div>
          
          <div className="flex items-center justify-between w-full max-w-2xl gap-8">
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#242424] rounded-full flex items-center justify-center text-2xl shadow-xl border border-gray-700">🏰</div>
              <span className="text-xl lg:text-2xl font-bold">{liveEvent.homeTeam}</span>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <div className="text-4xl lg:text-5xl font-black tracking-tighter text-[#fbbf24]">
                {liveEvent.status === EventStatus.LIVE ? (liveEvent.score || '0 - 0') : 'VS'}
              </div>
              {liveEvent.status === EventStatus.LIVE && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  LIVE 74'
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#242424] rounded-full flex items-center justify-center text-2xl shadow-xl border border-gray-700">🛡️</div>
              <span className="text-xl lg:text-2xl font-bold">{liveEvent.awayTeam}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Markets */}
        <div className="lg:col-span-8 space-y-6">
          {/* AI Insights Bar */}
          {insight && (
            <div className="bg-[#1a1a1a] border border-blue-500/20 p-4 rounded-xl flex items-start gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity size={20} className="text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-400 mb-1">Live AI Analysis</h4>
                <p className="text-sm text-gray-300 italic">"{insight}"</p>
              </div>
            </div>
          )}

          {/* Markets */}
          {liveEvent.markets.map(market => (
            <div key={market.id} className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden shadow-lg">
              <div className="bg-[#242424] px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                   <Zap size={18} className="text-[#fbbf24]" />
                   {market.name}
                </h3>
                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest border border-green-500/20">
                  Real-time update active
                </span>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {market.selections.map(selection => (
                  <button
                    key={selection.id}
                    onClick={() => onAddSelection(selection, liveEvent)}
                    className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                      selectedIds.includes(selection.id)
                        ? 'bg-[#fbbf24] border-[#fbbf24] text-black scale-95'
                        : 'bg-[#0f0f0f] border-gray-800 text-white hover:border-gray-600'
                    }`}
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedIds.includes(selection.id) ? 'text-black/60' : 'text-gray-500'}`}>
                      {selection.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black">{selection.odds.toFixed(2)}</span>
                      {oddsTrend[selection.id] === 'up' && <TrendingUp size={16} className="text-green-500 animate-bounce" />}
                      {oddsTrend[selection.id] === 'down' && <TrendingDown size={16} className="text-red-500 animate-bounce" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Stats and Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Stats Simulation */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 space-y-6">
            <h3 className="font-bold text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-green-500" />
                Live Stats
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase animate-pulse">Updating...</div>
            </h3>
            <div className="space-y-5">
              <StatBar label="Attacks" home={stats.attacks.home} away={stats.attacks.away} />
              <StatBar label="Shots on Target" home={stats.shotsOnTarget.home} away={stats.shotsOnTarget.away} />
              <StatBar label="Possession" home={stats.possession.home} away={stats.possession.away} isPercentage />
              <StatBar label="Corners" home={stats.corners.home} away={stats.corners.away} />
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Clock size={20} className="text-gray-400" />
              Match Info
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{new Date(liveEvent.startTime).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Venue</span>
                <span className="font-medium">Santiago Bernabéu</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Referee</span>
                <span className="font-medium">Michael Oliver</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm">
              <Info size={16} />
              Responsible Gaming
            </div>
            <p className="text-xs text-yellow-500/70 leading-relaxed">
              Odds and statistics shown are subject to change based on real-time match events. Ensure you place bets within your set limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBar = ({ label, home, away, isPercentage = false }: { label: string; home: number; away: number; isPercentage?: boolean }) => {
  const total = home + away;
  const homeWidth = total === 0 ? 50 : (home / total) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
        <span className={homeWidth >= 50 ? 'text-white' : 'text-gray-500'}>{home}{isPercentage ? '%' : ''}</span>
        <span className="text-gray-400 text-[10px]">{label}</span>
        <span className={homeWidth < 50 ? 'text-white' : 'text-gray-500'}>{away}{isPercentage ? '%' : ''}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-800/50 rounded-full flex overflow-hidden border border-gray-700/50">
        <div 
          className="h-full bg-[#fbbf24] transition-all duration-1000 ease-out" 
          style={{ width: `${homeWidth}%` }}
        ></div>
        <div className="h-full bg-white/20 flex-1"></div>
      </div>
    </div>
  );
};

export default EventDetail;
