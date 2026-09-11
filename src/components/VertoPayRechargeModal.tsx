import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  X, 
  Wallet, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard,
  QrCode,
  Zap,
  Lock,
  RefreshCw,
  IndianRupee
} from 'lucide-react';

interface VertoPayRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetAmount?: number;
}

type UpiProvider = 'gpay' | 'phonepe' | 'paytm' | 'bhim';

export const VertoPayRechargeModal: React.FC<VertoPayRechargeModalProps> = ({
  isOpen,
  onClose,
  presetAmount
}) => {
  const { balance, rechargeWallet } = useWallet();
  const [selectedAmount, setSelectedAmount] = useState<number>(presetAmount || 100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<UpiProvider>('gpay');
  const [upiId, setUpiId] = useState<string>('student@okhdfcbank');
  
  // Payment processing states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successAmount, setSuccessAmount] = useState<number>(0);
  const [transactionRef, setTransactionRef] = useState<string>('');

  useEffect(() => {
    if (presetAmount) {
      setSelectedAmount(presetAmount);
      setCustomAmount('');
    }
  }, [presetAmount]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setIsProcessing(false);
      setIsSuccess(false);
      setProcessingStep('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentRechargeAmount = customAmount ? (parseInt(customAmount, 10) || 0) : selectedAmount;

  const upiProviders: { id: UpiProvider; name: string; tag: string; bg: string; border: string; activeRing: string }[] = [
    {
      id: 'gpay',
      name: 'Google Pay',
      tag: 'GPay',
      bg: 'bg-white hover:bg-slate-50',
      border: 'border-slate-200',
      activeRing: 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40'
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      tag: 'PhonePe',
      bg: 'bg-white hover:bg-slate-50',
      border: 'border-slate-200',
      activeRing: 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/40'
    },
    {
      id: 'paytm',
      name: 'Paytm UPI',
      tag: 'Paytm',
      bg: 'bg-white hover:bg-slate-50',
      border: 'border-slate-200',
      activeRing: 'border-cyan-500 ring-2 ring-cyan-500/20 bg-cyan-50/40'
    },
    {
      id: 'bhim',
      name: 'BHIM / Any UPI',
      tag: 'BHIM UPI',
      bg: 'bg-white hover:bg-slate-50',
      border: 'border-slate-200',
      activeRing: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40'
    }
  ];

  const handleSelectQuickAmount = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) {
      setSelectedAmount(0);
    } else {
      setSelectedAmount(100);
    }
  };

  const handlePayViaUpi = async () => {
    const amountToPay = currentRechargeAmount;
    if (amountToPay <= 0) return;

    setIsProcessing(true);
    setProcessingStep('Connecting to NPCI UPI Gateway...');

    // 2-second glowing spinner/loader as requested
    setTimeout(() => {
      setProcessingStep('Verifying VPA & Authorizing Mock Transaction...');
    }, 1000);

    setTimeout(async () => {
      const providerName = upiProviders.find((p) => p.id === selectedProvider)?.name || 'UPI';
      const ref = `UPI-${Date.now().toString().slice(-6)}`;
      setTransactionRef(ref);
      setSuccessAmount(amountToPay);

      await rechargeWallet(amountToPay, providerName);

      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div 
        id="vertopay-recharge-modal"
        className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-indigo-100 relative overflow-y-auto max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] my-auto space-y-3.5 sm:space-y-4 animate-in zoom-in-95 duration-200"
      >
        {/* Top glow accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        
        {/* Close button */}
        {!isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
            title="Close Recharge Modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* 1. SUCCESS STATE */}
        {isSuccess ? (
          <div className="py-6 text-center space-y-5 animate-in fade-in">
            {/* Animated glowing checkmark */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40">
                <CheckCircle2 className="w-11 h-11" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Instant Credit
              </span>
              <h3 className="text-2xl font-black text-slate-900 pt-2">
                Payment Successful!
              </h3>
              <p className="text-xs text-slate-500">
                ₹{successAmount} has been credited to your VertoPay Wallet.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between text-slate-600">
                <span>Updated VertoPay Balance:</span>
                <span className="font-extrabold text-emerald-600 text-sm">₹{balance}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Mode:</span>
                <span className="font-bold text-slate-800">
                  {upiProviders.find((p) => p.id === selectedProvider)?.name}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transaction Ref:</span>
                <span className="font-mono text-[11px] text-slate-500 font-semibold">{transactionRef}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero convenience fee. Instant Campus Auto boarding enabled!</span>
              </div>
            </div>

            <button
              type="button"
              id="vertopay-success-done-btn"
              onClick={handleDone}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 active:scale-98 transition-all cursor-pointer"
            >
              Continue to Commuter Dashboard
            </button>
          </div>
        ) : isProcessing ? (
          /* 2. PROCESSING STATE (2-second glowing spinner/loader) */
          <div className="py-10 text-center space-y-6 animate-in fade-in">
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              {/* Glowing ring animation */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-emerald-400 to-purple-600 animate-spin blur-md opacity-70" />
              <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-inner">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                Processing UPI Payment
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {processingStep || 'Processing payment securely with Mock UPI...'}
              </p>
              <div className="pt-2 flex items-center justify-center gap-2 text-indigo-600 text-xs font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit Bank Grade Security</span>
              </div>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs font-semibold text-indigo-900">
              Adding <span className="font-extrabold text-sm text-indigo-700">₹{currentRechargeAmount}</span> to VertoPay Wallet
            </div>
          </div>
        ) : (
          /* 3. DEFAULT INPUT & PAYMENT FORM */
          <>
            {/* Header */}
            <div className="space-y-1 pr-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    Recharge <span className="text-indigo-600">Verto</span><span className="text-emerald-600">Pay</span>
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-slate-500">
                    Instant Campus Auto Pass & Student Ride Pool Wallet
                  </p>
                </div>
              </div>
            </div>

            {/* Current Balance & Top-up Card */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-md border border-indigo-500/20 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-300 mb-0.5">
                <span>Current VertoPay Balance</span>
                <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">
                  Active Pass
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center">
                <span>₹{balance}</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">
                Used for instant ₹15 Campus Auto seat boarding & ride shares
              </p>
            </div>

            {/* Quick Amount Selection Buttons (+₹50, +₹100, +₹200) */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] sm:text-xs font-bold text-slate-800">
                  Select Recharge Amount
                </label>
                <span className="text-[10px] sm:text-[11px] text-slate-500">Quick-Add</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 200].map((amt) => {
                  const isSelected = selectedAmount === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      id={`vertopay-quick-${amt}-btn`}
                      onClick={() => handleSelectQuickAmount(amt)}
                      className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl font-black text-xs sm:text-sm transition-all border cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-102'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <span>+₹{amt}</span>
                      <span className={`text-[9px] sm:text-[10px] font-medium ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {amt === 50 ? '3 Rides' : amt === 100 ? '6+ Rides' : '13+ Rides'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom amount input */}
              <div className="pt-0.5">
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-bold text-xs sm:text-sm">₹</span>
                  <input
                    type="text"
                    id="vertopay-custom-amount-input"
                    placeholder="Or enter custom amount (e.g. 150)"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl pl-7 sm:pl-8 pr-3.5 py-1.5 sm:py-2 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  />
                  {customAmount && (
                    <button
                      type="button"
                      onClick={() => setCustomAmount('')}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Clickable UPI Logos: Google Pay, PhonePe, Paytm */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Select Mock UPI Payment App</span>
                <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Instant Approval
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {/* 1. Google Pay */}
                <button
                  type="button"
                  id="vertopay-upi-gpay"
                  onClick={() => setSelectedProvider('gpay')}
                  className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all text-left flex items-center gap-2 cursor-pointer ${
                    selectedProvider === 'gpay'
                      ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-2xs shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 block truncate">Google Pay</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 block truncate">GPay UPI</span>
                  </div>
                </button>

                {/* 2. PhonePe */}
                <button
                  type="button"
                  id="vertopay-upi-phonepe"
                  onClick={() => setSelectedProvider('phonepe')}
                  className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all text-left flex items-center gap-2 cursor-pointer ${
                    selectedProvider === 'phonepe'
                      ? 'border-purple-600 ring-2 ring-purple-500/20 bg-purple-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-2xs shrink-0">
                    पे
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 block truncate">PhonePe</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 block truncate">PhonePe UPI</span>
                  </div>
                </button>

                {/* 3. Paytm */}
                <button
                  type="button"
                  id="vertopay-upi-paytm"
                  onClick={() => setSelectedProvider('paytm')}
                  className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all text-left flex items-center gap-2 cursor-pointer ${
                    selectedProvider === 'paytm'
                      ? 'border-cyan-600 ring-2 ring-cyan-500/20 bg-cyan-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#002e6e] text-[#00baf2] flex items-center justify-center font-black text-[10px] shadow-2xs shrink-0">
                    Paytm
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 block truncate">Paytm</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 block truncate">Wallet/UPI</span>
                  </div>
                </button>

                {/* 4. BHIM / Any UPI */}
                <button
                  type="button"
                  id="vertopay-upi-bhim"
                  onClick={() => setSelectedProvider('bhim')}
                  className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all text-left flex items-center gap-2 cursor-pointer ${
                    selectedProvider === 'bhim'
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 via-white to-green-600 border border-slate-200 flex items-center justify-center font-black text-[9px] sm:text-[10px] text-slate-800 shadow-2xs shrink-0">
                    UPI
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 block truncate">BHIM UPI</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 block truncate">Any VPA</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Total Summary and Pay CTA Button */}
            <div className="pt-1 sm:pt-2 space-y-1.5 sm:space-y-2">
              <button
                type="button"
                id="vertopay-pay-upi-btn"
                disabled={currentRechargeAmount <= 0}
                onClick={handlePayViaUpi}
                className="w-full py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 active:scale-98 text-white transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Pay ₹{currentRechargeAmount} via UPI</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] text-slate-400 text-center">
                <Lock className="w-3 h-3 shrink-0" />
                <span>Simulated Sandbox • Balance updated in localStorage</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
