
import React, { useEffect, useState } from 'react';
import { SPORTS, MOCK_EVENTS } from '../constants';
import { Event, Selection } from '../types';
import { TrendingUp, Clock, Info } from 'lucide-react';
import { getBettingInsights } from '../services/geminiService';

interface HomeProps {
  onAddSelection: (selection: Selection, event: Event) => void;
  onSelectEvent: (eventId: string) => void;
  selectedIds: string[];
}

const Home: React.FC<HomeProps> = ({ onAddSelection, onSelectEvent, selectedIds }) => {
  const [activeSport, setActiveSport] = useState(SPORTS[0].id);
  const [insights, setInsights] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch AI insights for featured matches
    const fetchAllInsights = async () => {
      const newInsights: Record<string, string> = {};
      for (const event of MOCK_EVENTS) {
        const topSelection = event.markets[0].selections[0];
        const res = await getBettingInsights(`${event.homeTeam} vs ${event.awayTeam}`, topSelection.odds);
        newInsights[event.id] = res;
      }
      setInsights(newInsights);
    };
    fetchAllInsights();
  }, []);

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Featured Banner */}
      <div className="relative rounded-2xl overflow-hidden h-48 lg:h-64 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 flex items-center p-8 border border-white/10 group">
        <div className="relative z-10 space-y-3 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-blue-300 border border-white/10 uppercase tracking-widest">
            <TrendingUp size={12} />
            Weekend Special
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">Double Your Odds on Champions League</h1>
          <p className="text-white/60 text-sm">Valid for all match-winner bets placed before Saturday kickoff. T&C Apply.</p>
          <button className="bg-[#fbbf24] hover:bg-[#d9a31d] text-black px-6 py-2 rounded-lg font-bold transition-transform group-hover:scale-105">Bet Now</button>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://picsum.photos/800/600?grayscale')] bg-cover opacity-20 mask-gradient-left"></div>
      </div>

      {/* Sports Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {SPORTS.map(sport => (
          <button
            key={sport.id}
            onClick={() => setActiveSport(sport.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all whitespace-nowrap ${activeSport === sport.id ? 'bg-[#fbbf24] border-[#fbbf24] text-black font-bold' : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:border-gray-700'}`}
          >
            <span className="text-xl">{sport.icon}</span>
            <span>{sport.name}</span>
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            Live Now
          </h2>
          <button className="text-[#fbbf24] text-sm hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_EVENTS.filter(e => e.status === 'LIVE').map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              insight={insights[event.id]}
              onAddSelection={onAddSelection}
              onSelect={() => onSelectEvent(event.id)}
              selectedIds={selectedIds}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-8">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock size={20} className="text-gray-400" />
            Upcoming Events
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_EVENTS.filter(e => e.status === 'UPCOMING').map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onAddSelection={onAddSelection}
              onSelect={() => onSelectEvent(event.id)}
              selectedIds={selectedIds}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface EventCardProps {
  event: Event;
  insight?: string;
  onAddSelection: (selection: Selection, event: Event) => void;
  onSelect: () => void;
  selectedIds: string[];
}

const EventCard: React.FC<EventCardProps> = ({ event, insight, onAddSelection, onSelect, selectedIds }) => (
  <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all flex flex-col group">
    <div className="p-4 flex items-center justify-between border-b border-gray-800/50 cursor-pointer" onClick={onSelect}>
      <div className="flex items-center gap-2">
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded uppercase tracking-tighter font-medium">Premier League</span>
        {event.status === 'LIVE' && <span className="text-[10px] text-red-500 font-bold border border-red-500/30 px-1.5 rounded animate-pulse">LIVE</span>}
      </div>
      <div className="text-xs text-gray-500">{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>

    <div className="p-4 space-y-4 flex-1">
      <div className="flex justify-between items-center px-2 cursor-pointer" onClick={onSelect}>
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">{event.homeTeam}</span>
            {event.status === 'LIVE' && <span className="font-bold text-[#fbbf24]">{event.score?.split('-')[0] || '1'}</span>}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">{event.awayTeam}</span>
            {event.status === 'LIVE' && <span className="font-bold text-[#fbbf24]">{event.score?.split('-')[1] || '0'}</span>}
          </div>
        </div>
      </div>

      {insight && (
        <div className="bg-blue-900/20 border border-blue-500/20 p-2.5 rounded-lg flex items-start gap-2 cursor-pointer" onClick={onSelect}>
          <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-blue-200 leading-tight italic">AI Insight: {insight}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {event.markets[0].selections.map(selection => (
          <button
            key={selection.id}
            onClick={() => onAddSelection(selection, event)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${selectedIds.includes(selection.id) ? 'bg-[#fbbf24] border-[#fbbf24] text-black scale-[0.98]' : 'bg-[#242424] border-gray-700 text-white hover:border-[#fbbf24]/50'}`}
          >
            <span className={`text-[10px] mb-1 ${selectedIds.includes(selection.id) ? 'text-black/60' : 'text-gray-400'}`}>
              {selection.name.length > 8 ? selection.name.substring(0, 8) + '...' : selection.name}
            </span>
            <span className="text-base font-bold">{selection.odds.toFixed(2)}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default Home;
