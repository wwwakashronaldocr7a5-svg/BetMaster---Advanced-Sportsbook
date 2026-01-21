
import React from 'react';
import { Home, Wallet, ShieldCheck, PieChart, UserCircle, Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
  userBalance: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, userBalance }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-800 rounded-lg lg:hidden">
            <Menu size={20} />
          </button>
          <div className="text-[#fbbf24] font-bold text-xl flex items-center gap-1 cursor-pointer" onClick={() => onViewChange('home')}>
            <span className="bg-[#fbbf24] text-black px-1.2 rounded text-sm mr-1">AI</span>
            BETMASTER
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-gray-400">Balance</span>
            <span className="font-bold text-green-400">₹{userBalance.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => onViewChange('wallet')}
            className="bg-[#fbbf24] hover:bg-[#d9a31d] text-black font-bold py-1.5 px-4 rounded-md transition-colors"
          >
            Deposit
          </button>
          <UserCircle size={28} className="text-gray-400 cursor-pointer" onClick={() => onViewChange('profile')} />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#141414] border-r border-gray-800 p-4 space-y-2">
          <NavItem active={activeView === 'home'} icon={<Home size={20}/>} label="Sportsbook" onClick={() => onViewChange('home')} />
          <NavItem active={activeView === 'admin'} icon={<PieChart size={20}/>} label="Admin Studio" onClick={() => onViewChange('admin')} />
          <NavItem active={activeView === 'responsible'} icon={<ShieldCheck size={20}/>} label="Responsible Play" onClick={() => onViewChange('responsible')} />
          <NavItem active={activeView === 'wallet'} icon={<Wallet size={20}/>} label="Wallet & KYC" onClick={() => onViewChange('wallet')} />
        </aside>

        {/* View Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Bottom Nav (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 flex justify-around py-3">
        <button onClick={() => onViewChange('home')} className={`flex flex-col items-center ${activeView === 'home' ? 'text-[#fbbf24]' : 'text-gray-400'}`}>
          <Home size={20} />
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button onClick={() => onViewChange('admin')} className={`flex flex-col items-center ${activeView === 'admin' ? 'text-[#fbbf24]' : 'text-gray-400'}`}>
          <PieChart size={20} />
          <span className="text-[10px] mt-1">Admin</span>
        </button>
        <button onClick={() => onViewChange('responsible')} className={`flex flex-col items-center ${activeView === 'responsible' ? 'text-[#fbbf24]' : 'text-gray-400'}`}>
          <ShieldCheck size={20} />
          <span className="text-[10px] mt-1">Safety</span>
        </button>
        <button onClick={() => onViewChange('wallet')} className={`flex flex-col items-center ${activeView === 'wallet' ? 'text-[#fbbf24]' : 'text-gray-400'}`}>
          <Wallet size={20} />
          <span className="text-[10px] mt-1">Wallet</span>
        </button>
      </nav>
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-[#fbbf24] text-black font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Layout;
