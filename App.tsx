
import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './views/Home';
import AdminDashboard from './views/AdminDashboard';
import ResponsibleGaming from './views/ResponsibleGaming';
import EventDetail from './views/EventDetail';
import Wallet from './views/Wallet';
import BetSlip from './components/BetSlip';
import { Selection, Event, Bet } from './types';
import { MOCK_EVENTS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState(25000);
  const [kycStatus, setKycStatus] = useState<'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('NOT_STARTED');
  const [selections, setSelections] = useState<Array<{ selection: Selection; event: Event }>>([]);
  const [bets, setBets] = useState<Bet[]>([]);

  const handleAddSelection = (selection: Selection, event: Event) => {
    setSelections(prev => {
      const exists = prev.find(s => s.selection.id === selection.id);
      if (exists) {
        return prev.filter(s => s.selection.id !== selection.id);
      }
      return [...prev, { selection, event }];
    });
  };

  const handlePlaceBet = (stake: number) => {
    if (stake > userBalance) {
      alert("Insufficient balance!");
      return;
    }

    const totalOdds = selections.reduce((acc, curr) => acc * curr.selection.odds, 1);
    const newBet: Bet = {
      id: Math.random().toString(36).substring(7),
      eventId: selections[0].event.id,
      selectionId: selections[0].selection.id,
      selectionName: selections[0].selection.name,
      eventDescription: selections.length > 1 
        ? `${selections.length} Selection Multi` 
        : `${selections[0].event.homeTeam} vs ${selections[0].event.awayTeam}`,
      odds: totalOdds,
      stake: stake,
      payout: stake * totalOdds,
      status: 'PENDING',
      placedAt: new Date().toISOString(),
    };

    setBets([...bets, newBet]);
    setUserBalance(prev => prev - stake);
    setSelections([]);
  };

  const handleCashOut = (betId: string, amount: number) => {
    setBets(prev => prev.map(bet => 
      bet.id === betId ? { ...bet, status: 'CASHED_OUT' as const } : bet
    ));
    setUserBalance(prev => prev + amount);
    alert(`Cashed out for ₹${amount.toFixed(2)}`);
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setActiveView('event-detail');
  };

  const handleDeposit = (amount: number) => {
    setUserBalance(prev => prev + amount);
  };

  const handleWithdraw = (amount: number) => {
    if (amount > userBalance) {
      alert("Insufficient funds for withdrawal");
      return;
    }
    setUserBalance(prev => prev - amount);
  };

  const handleKycSubmit = () => {
    setKycStatus('PENDING');
    // Simulate approval after 10 seconds for demo purposes
    setTimeout(() => {
      setKycStatus('VERIFIED');
    }, 10000);
  };

  const renderView = () => {
    if (activeView === 'event-detail' && selectedEventId) {
      const event = MOCK_EVENTS.find(e => e.id === selectedEventId);
      if (event) {
        return (
          <EventDetail 
            event={event} 
            onBack={() => {
              setActiveView('home');
              setSelectedEventId(null);
            }} 
            onAddSelection={handleAddSelection}
            selectedIds={selections.map(s => s.selection.id)}
          />
        );
      }
    }

    switch (activeView) {
      case 'home':
        return (
          <Home 
            onAddSelection={handleAddSelection} 
            onSelectEvent={handleSelectEvent}
            selectedIds={selections.map(s => s.selection.id)} 
          />
        );
      case 'admin':
        return <AdminDashboard />;
      case 'responsible':
        return <ResponsibleGaming />;
      case 'wallet':
        return (
          <Wallet 
            balance={userBalance} 
            onDeposit={handleDeposit} 
            onWithdraw={handleWithdraw}
            kycStatus={kycStatus}
            onKycSubmit={handleKycSubmit}
          />
        );
      default:
        return <Home onAddSelection={handleAddSelection} onSelectEvent={handleSelectEvent} selectedIds={selections.map(s => s.selection.id)} />;
    }
  };

  return (
    <Layout 
      activeView={activeView === 'event-detail' ? 'home' : activeView} 
      onViewChange={(view) => {
        setActiveView(view);
        setSelectedEventId(null);
      }} 
      userBalance={userBalance}
    >
      {renderView()}
      
      <BetSlip 
        selections={selections}
        bets={bets}
        onRemove={(id) => setSelections(prev => prev.filter(s => s.selection.id !== id))}
        onClear={() => setSelections([])}
        onPlaceBet={handlePlaceBet}
        onCashOut={handleCashOut}
      />
    </Layout>
  );
};

export default App;
