
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertTriangle, Users, Wallet, Target, Activity } from 'lucide-react';

const MOCK_REVENUE_DATA = [
  { name: 'Mon', revenue: 4000, risk: 2400 },
  { name: 'Tue', revenue: 3000, risk: 1398 },
  { name: 'Wed', revenue: 2000, risk: 9800 },
  { name: 'Thu', revenue: 2780, risk: 3908 },
  { name: 'Fri', revenue: 1890, risk: 4800 },
  { name: 'Sat', revenue: 6390, risk: 3800 },
  { name: 'Sun', revenue: 8490, risk: 4300 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Studio</h1>
          <p className="text-gray-400 text-sm">Operator control panel & risk insights</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm shadow-lg shadow-red-900/20">
            <Activity size={18} />
            Emergency Pause
          </button>
          <button className="bg-[#fbbf24] hover:bg-[#d9a31d] text-black px-4 py-2 rounded-lg font-bold text-sm">
            Export Audit Log
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Wallet className="text-green-400" />} label="Gross Gaming Revenue" value="₹2,45,000" trend="+12.5%" />
        <StatCard icon={<Users className="text-blue-400" />} label="Active Bettors" value="1,284" trend="+3.2%" />
        <StatCard icon={<Target className="text-yellow-400" />} label="Total Exposure" value="₹8,12,000" trend="-4.1%" />
        <StatCard icon={<AlertTriangle className="text-red-400" />} label="Anomalies Detected" value="7" trend="High Risk" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Heatmap Visualization */}
        <div className="lg:col-span-2 bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">GGR vs Risk Exposure (Weekly)</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-blue-400"><div className="w-2 h-2 rounded-full bg-blue-400"></div> GGR</span>
              <span className="flex items-center gap-1 text-xs text-red-400"><div className="w-2 h-2 rounded-full bg-red-400"></div> Liability</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="risk" stroke="#ef4444" fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Risk Alerts */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-500" />
            Priority Alerts
          </h3>
          <div className="space-y-3">
            <AlertItem title="Large Stake" description="User_882 placed ₹50,000 on Australia @ 2.25" time="2m ago" severity="high" />
            <AlertItem title="Odds Anomaly" description="IPL 2024: Mumbai vs RCB. Market Suspended." time="15m ago" severity="medium" />
            <AlertItem title="Syndicate Detected" description="3 accounts linked to same IP in Lucknow" time="1h ago" severity="high" />
            <AlertItem title="KYC Expiry" description="12 Verified accounts need re-verification" time="3h ago" severity="low" />
          </div>
          <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors">
            View All Intelligence
          </button>
        </div>
      </div>

      {/* Market Management Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-bold">Active Markets (Manual Override)</h3>
          <input type="text" placeholder="Search markets..." className="bg-gray-800 border-none rounded-lg px-4 py-2 text-sm w-64 focus:ring-1 ring-[#fbbf24]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#242424] text-gray-400 uppercase text-[10px] tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Event / Match</th>
                <th className="px-6 py-4">Current Pool</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <MarketRow name="India vs Australia (Cricket)" pool="₹4,20,500" status="ACTIVE" />
              <MarketRow name="Real Madrid vs Barcelona (Football)" pool="₹8,12,000" status="SUSPENDED" />
              <MarketRow name="Djokovic vs Alcaraz (Tennis)" pool="₹1,25,000" status="ACTIVE" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }: any) => (
  <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 space-y-2 relative overflow-hidden">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-gray-800 rounded-lg">{icon}</div>
      <span className={`text-xs font-bold ${trend.startsWith('+') ? 'text-green-400' : trend.startsWith('-') ? 'text-red-400' : 'text-gray-400'}`}>{trend}</span>
    </div>
    <div className="space-y-1">
      <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
);

const AlertItem = ({ title, description, time, severity }: any) => (
  <div className={`p-3 rounded-xl border-l-4 ${severity === 'high' ? 'bg-red-500/10 border-red-500' : severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500' : 'bg-blue-500/10 border-blue-500'}`}>
    <div className="flex justify-between items-start mb-1">
      <span className="font-bold text-xs">{title}</span>
      <span className="text-[10px] text-gray-500">{time}</span>
    </div>
    <p className="text-[11px] text-gray-400 line-clamp-2">{description}</p>
  </div>
);

const MarketRow = ({ name, pool, status }: any) => (
  <tr className="hover:bg-gray-800/50 transition-colors">
    <td className="px-6 py-4 font-medium">{name}</td>
    <td className="px-6 py-4 text-gray-400">{pool}</td>
    <td className="px-6 py-4">
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{status}</span>
    </td>
    <td className="px-6 py-4 text-right">
      <button className="text-blue-400 hover:text-blue-300 mr-4 font-semibold">Edit Odds</button>
      <button className="text-red-400 hover:text-red-300 font-semibold">Suspend</button>
    </td>
  </tr>
);

export default AdminDashboard;
