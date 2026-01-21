
import React, { useState, useEffect } from 'react';
import { X, Trash2, Zap, AlertCircle, History, ReceiptText, Banknote } from 'lucide-react';
import { Selection, Event, Bet } from '../types';

interface BetSlipProps {
  selections: Array<{ selection: Selection; event: Event }>;
  bets: Bet[];
  onRemove: (selectionId: string) => void;
  onClear: () => void;
  onPlaceBet: (stake: number) => void;
  onCashOut: (betId: string, amount: number) => void;
}

const BetSlip: React.FC<BetSlipProps> = ({ selections, bets, onRemove, onClear, onPlaceBet, onCashOut }) => {
  const [activeTab, setActiveTab] = useState<'slip' | 'mybets'>('slip');
  const [stake, setStake] = useState<number>(0);
  const [mockCurrentOdds, setMockCurrentOdds] = useState<Record<string, number>>({});

  const totalOdds = selections.reduce((acc, curr) => acc * curr.selection.odds, 1);
  const potentialPayout = (stake * (selections.length > 0 ? totalOdds : 0)).toFixed(2);

  // Simulate market fluctuation for Cash Out values
  useEffect(() => {
    const interval = setInterval(() => {
      const newOdds: Record<string, number> = {};
      bets.forEach(bet => {
        // Randomly fluctuate "current market odds" around the initial odds
        const fluctuation = (Math.random() - 0.5) * 0.4;
        newOdds[bet.id] = Math.max(1.1, bet.odds + fluctuation);
      });
      setMockCurrentOdds(newOdds);
    }, 3000);
    return () => clearInterval(interval);
  }, [bets]);

  const calculateCashOut = (bet: Bet) => {
    const currentMarketOdds = mockCurrentOdds[bet.id] || bet.odds;
    // Standard formula: (Stake * Odds) / CurrentMarketOdds * (1 - margin)
    const fairValue = (bet.stake * bet.odds) / currentMarketOdds;
    const cashOutValue = fairValue * 0.92; // 8% margin for the house
    return Math.max(bet.stake * 0.1, cashOutValue); // Minimum floor
  };

  if (selections.length === 0 && (bets.length === 0 || activeTab === 'slip')) {
    if (bets.length > 0 && activeTab === 'slip') {
      // Allow switching to My Bets even if slip is empty
    } else if (selections.length === 0 && bets.length === 0) {
      return null;
    }
  }

  return (
    <div className="fixed bottom-16 right-4 lg:bottom-4 lg:right-4 w-full max-w-sm bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-800 overflow-hidden z-[60] flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button 
          onClick={() => setActiveTab('slip')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'slip' ? 'bg-[#fbbf24] text-black' : 'text-gray-400 hover:text-white'}`}
        >
          <ReceiptText size={14} />
          Bet Slip {selections.length > 0 && `(${selections.length})`}
        </button>
        <button 
          onClick={() => setActiveTab('mybets')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'mybets' ? 'bg-[#fbbf24] text-black' : 'text-gray-400 hover:text-white'}`}
        >
          <History size={14} />
          My Bets {bets.filter(b => b.status === 'PENDING').length > 0 && `(${bets.filter(b => b.status === 'PENDING').length})`}
        </button>
      </div>

      {activeTab === 'slip' ? (
        <>
          <div className="bg-[#242424] px-3 py-2 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Selections</span>
            <button onClick={onClear} className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors">
              <Trash2 size={14} />
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto p-3 space-y-3 min-h-[100px]">
            {selections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-600">
                <Zap size={32} className="mb-2 opacity-20" />
                <p className="text-xs">No selections made</p>
              </div>
            ) : (
              selections.map(({ selection, event }) => (
                <div key={selection.id} className="bg-[#242424] p-3 rounded-lg border border-gray-700 relative group animate-in slide-in-from-bottom-2">
                  <button 
                    onClick={() => onRemove(selection.id)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                  <div className="text-[10px] text-[#fbbf24] font-bold mb-1 uppercase tracking-wider">{event.homeTeam} vs {event.awayTeam}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{selection.name}</span>
                    <span className="text-lg font-bold text-[#fbbf24]">{selection.odds.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {selections.length > 0 && (
            <div className="p-4 bg-[#141414] border-t border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Odds</span>
                <span className="text-lg font-bold text-white">{totalOdds.toFixed(2)}</span>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input 
                  type="number" 
                  placeholder="Set Stake"
                  value={stake || ''}
                  onChange={(e) => setStake(Number(e.target.value))}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg py-2.5 pl-8 pr-4 text-white focus:outline-none focus:border-[#fbbf24] transition-colors"
                />
              </div>

              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                  <span>Potential Payout</span>
                </div>
                <div className="text-xl font-bold text-green-400">₹{potentialPayout}</div>
              </div>

              <button 
                disabled={stake <= 0}
                onClick={() => {
                  onPlaceBet(stake);
                  setStake(0);
                }}
                className={`w-full py-3 rounded-lg font-bold text-lg shadow-lg transform active:scale-95 transition-all ${stake > 0 ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
              >
                Place Bet
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="max-h-96 overflow-y-auto p-3 space-y-3 min-h-[300px] bg-[#0f0f0f]">
          {bets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-600">
              <ReceiptText size={48} className="mb-4 opacity-10" />
              <p className="text-sm">You have no active bets</p>
              <button 
                onClick={() => setActiveTab('slip')}
                className="mt-4 text-[#fbbf24] text-xs font-bold hover:underline"
              >
                Go to Sportsbook
              </button>
            </div>
          ) : (
            bets.slice().reverse().map(bet => {
              const cashOutValue = calculateCashOut(bet);
              const isPending = bet.status === 'PENDING';
              
              return (
                <div key={bet.id} className={`p-4 rounded-xl border transition-all ${isPending ? 'bg-[#1a1a1a] border-gray-800' : 'bg-gray-800/20 border-gray-800 opacity-60'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{bet.eventDescription}</div>
                      <div className="text-sm font-bold text-white">{bet.selectionName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500 uppercase font-bold">Odds</div>
                      <div className="text-sm font-bold text-[#fbbf24]">{bet.odds.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-y border-gray-800/50 mb-3 text-xs">
                    <div className="flex flex-col">
                      <span className="text-gray-500 uppercase text-[9px] font-bold">Stake</span>
                      <span className="text-white font-medium">₹{bet.stake}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-gray-500 uppercase text-[9px] font-bold">To Win</span>
                      <span className="text-green-400 font-bold">₹{bet.payout.toFixed(2)}</span>
                    </div>
                  </div>

                  {isPending ? (
                    <button 
                      onClick={() => onCashOut(bet.id, cashOutValue)}
                      className="w-full bg-[#242424] hover:bg-[#2a2a2a] border border-gray-700 rounded-lg p-2.5 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Banknote size={16} className="text-green-500 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-gray-300">Cash Out</span>
                      </div>
                      <span className="text-sm font-black text-white">₹{cashOutValue.toFixed(2)}</span>
                    </button>
                  ) : (
                    <div className="text-center py-1 bg-gray-800/50 rounded-md">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${bet.status === 'WON' ? 'text-green-400' : bet.status === 'CASHED_OUT' ? 'text-blue-400' : 'text-red-400'}`}>
                        {bet.status}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default BetSlip;
