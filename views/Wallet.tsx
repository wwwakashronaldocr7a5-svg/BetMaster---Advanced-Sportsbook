
import React, { useState, useEffect } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  Smartphone, 
  CreditCard, 
  Landmark, 
  UserCheck, 
  Camera, 
  FileText, 
  AlertCircle,
  ChevronRight,
  Clock,
  X,
  Copy,
  Check,
  Building2,
  QrCode,
  Zap,
  Info,
  Lock,
  CreditCard as CardIcon
} from 'lucide-react';

interface WalletProps {
  balance: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  kycStatus: 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  onKycSubmit: () => void;
}

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Google_Pay_Logo.svg' },
  { id: 'phonepe', name: 'PhonePe', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg' },
  { id: 'paytm', name: 'Paytm', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo.svg' },
];

const MOCK_BANKS = [
  { id: 'b1', name: 'HDFC Bank', acc: '**** 4421', icon: <Landmark className="text-blue-400" size={24} /> },
  { id: 'b2', name: 'ICICI Bank', acc: '**** 8812', icon: <Landmark className="text-orange-400" size={24} /> },
  { id: 'b3', name: 'State Bank of India', acc: '**** 9901', icon: <Landmark className="text-blue-600" size={24} /> },
  { id: 'b4', name: 'Axis Bank', acc: '**** 1122', icon: <Landmark className="text-purple-600" size={24} /> },
];

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

const Wallet: React.FC<WalletProps> = ({ balance, onDeposit, onWithdraw, kycStatus, onKycSubmit }) => {
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
  
  // Deposit State
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [depositMethod, setDepositMethod] = useState<'upi' | 'card' | 'bank'>('upi');
  const [paymentStep, setPaymentStep] = useState<'options' | 'initiating' | 'upi' | 'processing' | 'success'>('options');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);
  const [upiId, setUpiId] = useState('');
  const [copied, setCopied] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Withdrawal State
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [withdrawalMethod, setWithdrawalMethod] = useState<'bank' | 'upi'>('upi');
  const [selectedBankId, setSelectedBankId] = useState('b1');
  const [withdrawUpiId, setWithdrawUpiId] = useState('');
  const [withdrawStep, setWithdrawStep] = useState<'options' | 'processing' | 'success'>('options');
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  
  // KYC State
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycStep, setKycStep] = useState(1);
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);

  const handleUpiAppSelect = (appId: string) => {
    setSelectedUpiApp(appId);
    setPaymentStep('initiating');
    setTimeout(() => {
      setPaymentStep('upi');
    }, 1500);
  };

  const simulatePayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      onDeposit(depositAmount);
      setPaymentStep('success');
    }, 2500);
  };

  const simulateWithdrawal = () => {
    if (withdrawalAmount > balance) return;
    setShowWithdrawConfirm(false);
    setWithdrawStep('processing');
    setTimeout(() => {
      onWithdraw(withdrawalAmount);
      setWithdrawStep('success');
    }, 2500);
  };

  const resetDeposit = () => {
    setPaymentStep('options');
    setDepositMethod('upi');
    setSelectedUpiApp(null);
    setUpiId('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
  };

  const resetWithdrawal = () => {
    setWithdrawStep('options');
    setWithdrawalAmount(0);
    setWithdrawUpiId('');
    setShowWithdrawConfirm(false);
  };

  const copyVPA = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKycStepNext = () => {
    if (kycStep < 3) {
      setKycStep(kycStep + 1);
    } else {
      setIsSubmittingKyc(true);
      setTimeout(() => {
        onKycSubmit();
        setIsSubmittingKyc(false);
        setShowKycModal(false);
      }, 3000);
    }
  };

  const selectedBank = MOCK_BANKS.find(b => b.id === selectedBankId);

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Balance Card */}
        <div className="flex-1 bg-gradient-to-br from-[#fbbf24] to-[#d9a31d] p-8 rounded-3xl text-black shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <WalletIcon size={160} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 opacity-80 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck size={14} />
              {kycStatus === 'VERIFIED' ? 'Verified Wallet' : 'Unverified Account'}
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium opacity-80">Total Balance</div>
              <div className="text-5xl font-black">₹{balance.toLocaleString()}</div>
            </div>
            <div className="flex gap-4 pt-4">
              <div className="flex-1 bg-black/10 backdrop-blur-md rounded-2xl p-3 border border-black/5">
                <div className="text-[10px] uppercase font-bold opacity-60">Withdrawable</div>
                <div className="text-lg font-bold">₹{(balance * 0.95).toLocaleString()}</div>
              </div>
              <div className="flex-1 bg-black/10 backdrop-blur-md rounded-2xl p-3 border border-black/5">
                <div className="text-[10px] uppercase font-bold opacity-60">Bonus</div>
                <div className="text-lg font-bold">₹{(balance * 0.05).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions / Mode Toggles */}
        <div className="md:w-64 flex flex-col gap-4">
          <button 
            onClick={() => {
              setMode('deposit');
              resetDeposit();
            }}
            className={`flex-1 border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all group ${mode === 'deposit' ? 'bg-[#fbbf24] border-[#fbbf24] text-black shadow-lg shadow-[#fbbf24]/20' : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${mode === 'deposit' ? 'bg-black/10 text-black' : 'bg-green-500/10 text-green-500'}`}>
              <ArrowUpRight size={24} />
            </div>
            <span className="font-bold text-sm">Deposit</span>
          </button>
          <button 
            disabled={kycStatus !== 'VERIFIED'}
            onClick={() => {
              setMode('withdraw');
              resetWithdrawal();
            }}
            className={`flex-1 border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all group ${kycStatus !== 'VERIFIED' ? 'opacity-50 cursor-not-allowed' : mode === 'withdraw' ? 'bg-[#fbbf24] border-[#fbbf24] text-black shadow-lg shadow-[#fbbf24]/20' : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${mode === 'withdraw' ? 'bg-black/10 text-black' : 'bg-blue-500/10 text-blue-500'}`}>
              <ArrowDownLeft size={24} />
            </div>
            <span className="font-bold text-sm">Withdraw</span>
          </button>
        </div>
      </div>

      {/* KYC Status Banner */}
      {kycStatus !== 'VERIFIED' && (
        <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${kycStatus === 'PENDING' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${kycStatus === 'PENDING' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
              {kycStatus === 'PENDING' ? <Clock size={24} /> : <AlertCircle size={24} />}
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-lg">
                {kycStatus === 'PENDING' ? 'KYC Under Review' : 'Identity Verification Required'}
              </h4>
              <p className="text-sm text-gray-400">
                {kycStatus === 'PENDING' 
                  ? 'We are verifying your documents. This usually takes 2-4 hours.' 
                  : 'Verify your identity to unlock higher limits and withdrawals.'}
              </p>
            </div>
          </div>
          {kycStatus === 'NOT_STARTED' && (
            <button 
              onClick={() => setShowKycModal(true)}
              className="bg-[#fbbf24] hover:bg-[#d9a31d] text-black px-6 py-2 rounded-xl font-bold transition-all shadow-lg whitespace-nowrap"
            >
              Start KYC
            </button>
          )}
        </div>
      )}

      {/* Interface Toggle Container */}
      <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800 overflow-hidden shadow-xl min-h-[500px]">
        {mode === 'deposit' ? (
          <>
            <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ArrowUpRight className="text-[#fbbf24]" />
                Secure Deposit
              </h3>
              <div className="flex items-center gap-1 text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded-full font-bold self-start sm:self-auto">
                <CheckCircle2 size={10} />
                INSTANT CREDIT
              </div>
            </div>

            <div className="p-6 lg:p-8">
              {paymentStep === 'options' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enter Amount</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#fbbf24]">₹</span>
                      <input 
                        type="number" 
                        value={depositAmount || ''}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="w-full bg-[#0f0f0f] border-2 border-gray-800 rounded-2xl py-6 pl-12 pr-6 text-3xl font-black focus:outline-none focus:border-[#fbbf24] transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_AMOUNTS.map(amt => (
                        <button 
                          key={amt}
                          onClick={() => setDepositAmount(amt)}
                          className={`py-3 rounded-xl border font-bold text-sm transition-all ${depositAmount === amt ? 'bg-[#fbbf24] border-[#fbbf24] text-black' : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:border-gray-600'}`}
                        >
                          +₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Payment Method</label>
                    <div className="flex bg-[#0f0f0f] p-1 rounded-xl border border-gray-800">
                      <button 
                        onClick={() => setDepositMethod('upi')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs transition-all ${depositMethod === 'upi' ? 'bg-[#fbbf24] text-black shadow-md' : 'text-gray-500 hover:text-white'}`}
                      >
                        <Smartphone size={16} /> UPI
                      </button>
                      <button 
                        onClick={() => setDepositMethod('card')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs transition-all ${depositMethod === 'card' ? 'bg-[#fbbf24] text-black shadow-md' : 'text-gray-500 hover:text-white'}`}
                      >
                        <CardIcon size={16} /> Card
                      </button>
                      <button 
                        onClick={() => setDepositMethod('bank')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs transition-all ${depositMethod === 'bank' ? 'bg-[#fbbf24] text-black shadow-md' : 'text-gray-500 hover:text-white'}`}
                      >
                        <Building2 size={16} /> Net Banking
                      </button>
                    </div>
                  </div>

                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    {depositMethod === 'upi' && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Choose UPI App</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {UPI_APPS.map(app => (
                              <button 
                                key={app.id}
                                onClick={() => handleUpiAppSelect(app.id)}
                                className="p-6 bg-[#0f0f0f] border-2 border-gray-800 rounded-2xl flex flex-col items-center gap-3 hover:border-[#fbbf24] hover:bg-[#1a1a1a] transition-all group relative overflow-hidden"
                              >
                                <img src={app.icon} alt={app.name} className="h-8 grayscale group-hover:grayscale-0 transition-all" />
                                <span className="text-xs font-bold text-gray-400 group-hover:text-white">{app.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or Pay via UPI ID</label>
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="example@upi"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="flex-1 bg-[#0f0f0f] border-2 border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fbbf24] transition-all"
                            />
                            <button 
                              disabled={!upiId.includes('@')}
                              onClick={() => simulatePayment()}
                              className={`px-6 rounded-xl font-bold transition-all ${upiId.includes('@') ? 'bg-[#fbbf24] text-black shadow-lg' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                            >
                              Pay
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {depositMethod === 'card' && (
                      <div className="space-y-6 bg-[#0f0f0f] p-6 rounded-2xl border border-gray-800">
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cardholder Name</label>
                            <input 
                              type="text" 
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              placeholder="Full Name" 
                              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 focus:border-[#fbbf24] focus:outline-none transition-colors" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Card Number</label>
                            <div className="relative">
                               <input 
                                type="text" 
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="0000 0000 0000 0000" 
                                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 pl-12 focus:border-[#fbbf24] focus:outline-none transition-colors font-mono" 
                              />
                              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expiry</label>
                              <input 
                                type="text" 
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="MM/YY" 
                                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 focus:border-[#fbbf24] focus:outline-none transition-colors font-mono" 
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">CVV</label>
                              <div className="relative">
                                <input 
                                  type="password" 
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  placeholder="***" 
                                  maxLength={3}
                                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 focus:border-[#fbbf24] focus:outline-none transition-colors font-mono" 
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={simulatePayment}
                          className="w-full bg-[#fbbf24] text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#d9a31d] transition-all"
                        >
                          <ShieldCheck size={20} />
                          Pay ₹{depositAmount.toLocaleString()} Securely
                        </button>
                        <div className="flex items-center justify-center gap-4 opacity-40">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                           <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.svg" className="h-4" alt="Rupay" />
                        </div>
                      </div>
                    )}

                    {depositMethod === 'bank' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-3">
                          {MOCK_BANKS.map(bank => (
                            <button 
                              key={bank.id}
                              onClick={() => {
                                setSelectedBankId(bank.id);
                                simulatePayment();
                              }}
                              className="p-4 bg-[#0f0f0f] border-2 border-gray-800 rounded-2xl flex items-center justify-between hover:border-[#fbbf24] hover:bg-[#1a1a1a] transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-800 rounded-xl group-hover:bg-[#fbbf24]/10 group-hover:text-[#fbbf24] transition-colors">
                                  {bank.icon}
                                </div>
                                <span className="font-bold text-gray-300 group-hover:text-white">{bank.name}</span>
                              </div>
                              <ChevronRight className="text-gray-600 group-hover:text-[#fbbf24]" size={20} />
                            </button>
                          ))}
                        </div>
                        <button className="w-full text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                          View All 50+ Banks
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {paymentStep === 'initiating' && (
                <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
                   <div className="relative">
                      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                        <img src={UPI_APPS.find(a => a.id === selectedUpiApp)?.icon} className="h-10" alt="" />
                      </div>
                      <div className="absolute inset-0 border-4 border-[#fbbf24] border-t-transparent rounded-full animate-spin"></div>
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-2xl font-bold">Requesting {UPI_APPS.find(a => a.id === selectedUpiApp)?.name}</h4>
                      <p className="text-gray-500">Checking for the app on your device...</p>
                   </div>
                </div>
              )}

              {paymentStep === 'upi' && (
                <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-[#fbbf24] rounded-2xl mx-auto flex items-center justify-center text-black mb-6">
                     <Smartphone size={40} />
                  </div>
                  <h4 className="text-2xl font-bold">Waiting for Payment</h4>
                  <p className="text-gray-400 max-w-sm mx-auto">
                    Please complete the payment of <span className="text-white font-bold font-mono text-lg">₹{depositAmount.toLocaleString()}</span> in your {UPI_APPS.find(a => a.id === selectedUpiApp)?.name} app.
                  </p>
                  
                  <div className="bg-[#0f0f0f] border-2 border-gray-800 rounded-2xl p-6 max-w-sm mx-auto space-y-4">
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Merchant UPI ID</div>
                    <div className="flex items-center justify-center gap-3">
                       <span className="font-mono font-bold text-lg">betmaster@axisbank</span>
                       <button onClick={copyVPA} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                       </button>
                    </div>
                  </div>

                  <div className="pt-8 flex flex-col gap-4 max-w-sm mx-auto">
                    <button 
                      onClick={simulatePayment}
                      className="w-full bg-[#fbbf24] text-black py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-[#d9a31d] transition-all transform active:scale-95"
                    >
                      I've Paid ₹{depositAmount}
                    </button>
                    <button 
                      onClick={() => setPaymentStep('options')}
                      className="text-gray-500 font-bold hover:text-white transition-colors"
                    >
                      Cancel Transaction
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'processing' && (
                <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="relative">
                    <Loader2 className="w-20 h-20 text-[#fbbf24] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <ShieldCheck size={32} className="text-[#fbbf24]/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold">Verifying Transaction</h4>
                    <p className="text-gray-500">Connecting with your bank for real-time confirmation...</p>
                  </div>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="py-12 lg:py-20 flex flex-col items-center justify-center space-y-6 text-center animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-green-500/20">
                    <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-green-500">Deposit Success!</h4>
                    <p className="text-gray-400 text-lg">₹{depositAmount.toLocaleString()} credited to your wallet instantly.</p>
                  </div>
                  <button 
                    onClick={resetDeposit}
                    className="bg-white text-black px-12 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-xl"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Smartphone className="text-[#fbbf24]" />
                Real-time UPI Withdrawal
              </h3>
              <div className="flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full font-bold self-start sm:self-auto uppercase tracking-widest">
                <Zap size={10} className="text-[#fbbf24]" />
                Instant Payout
              </div>
            </div>

            <div className="p-6 lg:p-8">
              {withdrawStep === 'options' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                  {/* Method Toggle */}
                  <div className="flex bg-[#0f0f0f] p-1 rounded-xl border border-gray-800">
                    <button 
                      onClick={() => setWithdrawalMethod('upi')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${withdrawalMethod === 'upi' ? 'bg-[#fbbf24] text-black shadow-md' : 'text-gray-500 hover:text-white'}`}
                    >
                      <Zap size={14} /> UPI Payout
                    </button>
                    <button 
                      onClick={() => setWithdrawalMethod('bank')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${withdrawalMethod === 'bank' ? 'bg-[#fbbf24] text-black shadow-md' : 'text-gray-500 hover:text-white'}`}
                    >
                      <Building2 size={14} /> Bank Account
                    </button>
                  </div>

                  {withdrawalMethod === 'upi' ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enter Your UPI ID (VPA)</label>
                      <input 
                        type="text" 
                        placeholder="yourname@upi"
                        value={withdrawUpiId}
                        onChange={(e) => setWithdrawUpiId(e.target.value)}
                        className="w-full bg-[#0f0f0f] border-2 border-gray-800 rounded-xl px-4 py-4 text-white font-mono focus:outline-none focus:border-[#fbbf24] transition-all"
                      />
                      <p className="text-[10px] text-gray-500">Ensure the UPI ID belongs to your verified KYC account name.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Linked Bank Account</label>
                      <div className="grid grid-cols-1 gap-3">
                        {MOCK_BANKS.map(bank => (
                          <button 
                            key={bank.id}
                            onClick={() => setSelectedBankId(bank.id)}
                            className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedBankId === bank.id ? 'bg-[#fbbf24]/5 border-[#fbbf24]' : 'bg-[#0f0f0f] border-gray-800 hover:border-gray-700'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${selectedBankId === bank.id ? 'bg-[#fbbf24] text-black' : 'bg-gray-800 text-gray-400'}`}>
                                {bank.icon}
                              </div>
                              <div className="text-left">
                                <div className="font-bold text-white">{bank.name}</div>
                                <div className="text-xs text-gray-500 font-mono">{bank.acc}</div>
                              </div>
                            </div>
                            {selectedBankId === bank.id && (
                              <div className="w-6 h-6 bg-[#fbbf24] rounded-full flex items-center justify-center text-black">
                                <Check size={14} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Withdrawal Amount</label>
                      <button 
                        onClick={() => setWithdrawalAmount(balance)}
                        className="text-[10px] font-bold text-[#fbbf24] uppercase tracking-widest hover:underline"
                      >
                        Max ₹{balance.toLocaleString()}
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#fbbf24]">₹</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={withdrawalAmount || ''}
                        onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                        className="w-full bg-[#0f0f0f] border-2 border-gray-800 rounded-2xl py-6 pl-12 pr-6 text-3xl font-black focus:outline-none focus:border-[#fbbf24] transition-all"
                      />
                    </div>
                    {withdrawalAmount > balance && (
                      <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-500/10 p-2 rounded-lg">
                        <AlertCircle size={14} />
                        Insufficient balance
                      </div>
                    )}
                  </div>

                  <button 
                    disabled={withdrawalAmount <= 0 || withdrawalAmount > balance || (withdrawalMethod === 'upi' && !withdrawUpiId.includes('@'))}
                    onClick={() => setShowWithdrawConfirm(true)}
                    className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 ${withdrawalAmount > 0 && withdrawalAmount <= balance ? 'bg-[#fbbf24] text-black hover:bg-[#d9a31d]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                  >
                    {withdrawalMethod === 'upi' && <Zap size={20} />}
                    Confirm {withdrawalMethod === 'upi' ? 'Instant' : ''} Withdrawal
                  </button>
                </div>
              )}

              {withdrawStep === 'processing' && (
                <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="relative">
                    <Loader2 className="w-20 h-20 text-[#fbbf24] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       {withdrawalMethod === 'upi' ? <Zap size={32} className="text-[#fbbf24]/50" /> : <Landmark size={32} className="text-[#fbbf24]/50" />}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold">Processing {withdrawalMethod === 'upi' ? 'Real-time' : ''} Payout</h4>
                    <p className="text-gray-500">Initiating request to {withdrawalMethod === 'upi' ? 'UPI Gateway' : 'Bank Server'}...</p>
                  </div>
                </div>
              )}

              {withdrawStep === 'success' && (
                <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-blue-500">
                      {withdrawalMethod === 'upi' ? 'Instant Success!' : 'Request Sent!'}
                    </h4>
                    <p className="text-gray-400 text-lg px-8">₹{withdrawalAmount.toLocaleString()} has been sent to your {withdrawalMethod === 'upi' ? 'UPI ID' : 'Bank Account'}.</p>
                  </div>
                  {withdrawalMethod === 'upi' ? (
                    <div className="bg-green-500/10 text-green-400 p-4 rounded-xl text-xs font-bold border border-green-500/20">
                      Transaction Ref: UPI-{Math.floor(Math.random() * 1000000000)}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 bg-gray-800/50 p-4 rounded-xl border border-gray-800">
                      Funds will reflect in your account within 2-24 hours.
                    </div>
                  )}
                  <button 
                    onClick={resetWithdrawal}
                    className="bg-white text-black px-12 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-xl"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Withdrawal Confirmation Modal */}
      {showWithdrawConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#1a1a1a] w-full max-w-md rounded-3xl border border-gray-800 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">Confirm Payout</h3>
              <button onClick={() => setShowWithdrawConfirm(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Withdrawal Amount</div>
                <div className="text-4xl font-black text-white">₹{withdrawalAmount.toLocaleString()}</div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#0f0f0f] p-5 rounded-2xl border border-gray-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold uppercase tracking-wider">Payout Method</span>
                    <span className="text-[#fbbf24] font-bold uppercase tracking-wider">{withdrawalMethod === 'upi' ? 'UPI Payout' : 'Bank Transfer'}</span>
                  </div>
                  <div className="flex items-center gap-4 py-2 border-t border-gray-800/50">
                    <div className="p-3 bg-gray-800 rounded-xl text-[#fbbf24]">
                      {withdrawalMethod === 'upi' ? <Smartphone size={20} /> : <Landmark size={20} />}
                    </div>
                    <div className="text-left overflow-hidden">
                       <div className="text-sm font-bold text-white truncate">
                         {withdrawalMethod === 'upi' ? withdrawUpiId : selectedBank?.name}
                       </div>
                       <div className="text-[10px] text-gray-500 font-mono">
                         {withdrawalMethod === 'upi' ? 'Verified VPA' : selectedBank?.acc}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-blue-400/80 leading-relaxed font-medium">
                    {withdrawalMethod === 'upi' 
                      ? "Funds are usually settled instantly. Ensure your UPI ID is linked to your own bank account to avoid transaction failure."
                      : "Bank transfers are processed via IMPS/NEFT. Funds usually reflect within a few hours but may take up to 24 hours depending on your bank."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowWithdrawConfirm(false)}
                  className="py-4 bg-gray-800 hover:bg-gray-700 text-gray-400 font-bold rounded-2xl transition-all"
                >
                  Edit / Cancel
                </button>
                <button 
                  onClick={simulateWithdrawal}
                  className="py-4 bg-[#fbbf24] hover:bg-[#d9a31d] text-black font-black rounded-2xl shadow-xl shadow-[#fbbf24]/10 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Confirm Payout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KYC Modal */}
      {showKycModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1a1a] w-full max-w-xl rounded-3xl border border-gray-800 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#fbbf24]/10 rounded-lg text-[#fbbf24]">
                  <UserCheck size={20} />
                </div>
                <h3 className="text-xl font-bold">Identity Verification</h3>
              </div>
              <button onClick={() => setShowKycModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 lg:p-8 space-y-8">
              <div className="flex items-center justify-between relative px-4">
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-800 -translate-y-1/2 z-0"></div>
                {[1, 2, 3].map(step => (
                  <div key={step} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${kycStep >= step ? 'bg-[#fbbf24] text-black shadow-lg shadow-[#fbbf24]/20' : 'bg-gray-800 text-gray-500'}`}>
                    {kycStep > step ? <Check size={20} /> : step}
                  </div>
                ))}
              </div>

              <div className="min-h-[320px] flex flex-col justify-center">
                {isSubmittingKyc ? (
                  <div className="flex flex-col items-center justify-center space-y-6 text-center py-12">
                    <Loader2 className="w-16 h-16 text-[#fbbf24] animate-spin" />
                    <div className="space-y-2">
                      <h4 className="text-2xl font-bold">Submitting Documents</h4>
                      <p className="text-gray-500">Encrypting and uploading to our secure servers...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {kycStep === 1 && (
                      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="text-center space-y-2">
                          <h4 className="text-2xl font-bold">Personal Details</h4>
                          <p className="text-sm text-gray-400">Please provide your official information.</p>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name (As on ID)</label>
                            <input type="text" placeholder="e.g. Rahul Sharma" className="w-full bg-[#0f0f0f] border border-gray-800 rounded-xl px-4 py-3 focus:border-[#fbbf24] focus:outline-none transition-colors" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">PAN / Aadhaar Number</label>
                            <input type="text" placeholder="XXXX XXXX XXXX" className="w-full bg-[#0f0f0f] border border-gray-800 rounded-xl px-4 py-3 focus:border-[#fbbf24] focus:outline-none transition-colors" />
                          </div>
                        </div>
                      </div>
                    )}

                    {kycStep === 2 && (
                      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="text-center space-y-2">
                          <h4 className="text-2xl font-bold">Document Upload</h4>
                          <p className="text-sm text-gray-400">Upload a clear photo of your ID card.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <button className="flex items-center justify-center gap-4 p-8 border-2 border-dashed border-gray-800 rounded-2xl hover:border-[#fbbf24] hover:bg-[#fbbf24]/5 transition-all group">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#fbbf24] group-hover:bg-[#fbbf24]/10 transition-all">
                              <Camera size={24} />
                            </div>
                            <div className="text-left">
                              <div className="font-bold">Take Live Photo</div>
                              <p className="text-xs text-gray-500">Front and back of your ID</p>
                            </div>
                          </button>
                          <button className="flex items-center justify-center gap-4 p-6 border border-gray-800 rounded-2xl hover:bg-gray-800 transition-all group">
                            <FileText size={20} className="text-gray-500 group-hover:text-white" />
                            <span className="text-sm font-bold text-gray-400 group-hover:text-white">Upload from Gallery</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {kycStep === 3 && (
                      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="text-center space-y-2">
                          <h4 className="text-2xl font-bold">Liveness Check</h4>
                          <p className="text-sm text-gray-400">We need a quick selfie to verify it's really you.</p>
                        </div>
                        <div className="w-48 h-48 mx-auto rounded-full border-4 border-[#fbbf24]/20 overflow-hidden relative group cursor-pointer">
                          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                            <Camera size={40} className="text-gray-500" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center border-4 border-[#fbbf24] border-t-transparent animate-spin rounded-full opacity-20"></div>
                        </div>
                        <p className="text-center text-[10px] text-gray-500 max-w-[200px] mx-auto uppercase font-bold tracking-widest leading-relaxed">Position your face inside the circle and follow instructions</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {!isSubmittingKyc && (
                <div className="flex gap-4">
                  <button 
                    onClick={() => kycStep === 1 ? setShowKycModal(false) : setKycStep(kycStep - 1)}
                    className="flex-1 py-4 bg-gray-800 rounded-2xl font-bold text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                  >
                    {kycStep === 1 ? 'Cancel' : 'Back'}
                  </button>
                  <button 
                    onClick={handleKycStepNext}
                    className="flex-[2] py-4 bg-[#fbbf24] text-black rounded-2xl font-black text-lg shadow-xl shadow-[#fbbf24]/20 hover:bg-[#d9a31d] transition-all flex items-center justify-center gap-2"
                  >
                    {kycStep === 3 ? 'Submit Verification' : 'Continue'}
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Security Footer */}
      <div className="flex flex-wrap items-center justify-center gap-6 opacity-30 mt-12 pb-12">
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"><ShieldCheck size={12}/> PCI DSS Compliant</div>
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"><ShieldCheck size={12}/> SSL Encrypted</div>
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"><ShieldCheck size={12}/> RBI Licensed Gateway</div>
      </div>
    </div>
  );
};

export default Wallet;
