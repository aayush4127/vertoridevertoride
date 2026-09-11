import React from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  Wallet, 
  PlusCircle, 
  Sparkles, 
  ArrowUpRight, 
  Zap, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';

interface VertoPayWidgetProps {
  variant?: 'glassmorphic-card' | 'topbar-pill' | 'dashboard-banner' | 'compact';
  className?: string;
  onOpenRecharge?: () => void;
}

export const VertoPayWidget: React.FC<VertoPayWidgetProps> = ({
  variant = 'glassmorphic-card',
  className = '',
  onOpenRecharge
}) => {
  const { balance, openRechargeModal } = useWallet();

  const handleRechargeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenRecharge) {
      onOpenRecharge();
    } else {
      openRechargeModal();
    }
  };

  // 1. TOPBAR PILL (for Navbar)
  if (variant === 'topbar-pill') {
    return (
      <button
        type="button"
        id="vertopay-topbar-widget"
        onClick={handleRechargeClick}
        className={`relative flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 shadow-xs hover:border-indigo-500 hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer group shrink-0 ${className}`}
        title={`VertoPay Balance: ₹${balance} • Click to Recharge`}
        aria-label={`VertoPay Balance: ₹${balance}`}
      >
        <Wallet className="w-4 h-4 xl:w-4.5 xl:h-4.5 text-emerald-400 group-hover:scale-110 transition-transform" />
        
        {/* Live balance indicator badge */}
        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-indigo-600 border border-slate-950 text-white text-[9px] font-black font-mono rounded-full leading-none shadow-xs">
          ₹{balance}
        </span>
      </button>
    );
  }

  // 2. COMPACT WIDGET (for modals or drawers)
  if (variant === 'compact') {
    return (
      <div 
        id="vertopay-compact-widget"
        className={`flex items-center justify-between p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 backdrop-blur-xs ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
              VertoPay Balance
            </span>
            <span className="text-sm font-black text-slate-900">
              ₹{balance}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRechargeClick}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Recharge</span>
        </button>
      </div>
    );
  }

  // 3. DASHBOARD BANNER
  if (variant === 'dashboard-banner') {
    return (
      <div 
        id="vertopay-dashboard-banner"
        className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl backdrop-blur-xl ${className}`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                VertoPay Digital Pass
              </span>
              <span className="text-[11px] text-slate-400 font-medium">LPU Campus Auto Pool</span>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-sm text-slate-300 font-semibold">VertoPay Balance:</span>
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ₹{balance}
              </span>
            </div>
            
            <p className="text-xs text-slate-300 max-w-md">
              Instant ₹15 auto fare deduction for student carpools. Fast boarding with zero change hassle.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:self-center shrink-0">
            <button
              type="button"
              id="vertopay-banner-recharge-btn"
              onClick={handleRechargeClick}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Recharge Wallet</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. DEFAULT: PREMIUM GLASSMORPHIC CARD (For Commuter Dashboard sidebar / overview top bar)
  return (
    <div 
      id="vertopay-wallet-widget"
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-white/75 backdrop-blur-xl border border-indigo-200/70 shadow-lg shadow-indigo-900/5 hover:border-indigo-300/80 transition-all ${className}`}
    >
      {/* Subtle glass reflection & gradient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-indigo-300/25 via-emerald-200/15 to-transparent rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Balance details */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 shrink-0">
            <Wallet className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                VertoPay Wallet
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Instant UPI Pass</span>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs text-slate-600 font-semibold">VertoPay Balance:</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                ₹{balance}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Recharge Wallet */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            id="vertopay-recharge-wallet-btn"
            onClick={handleRechargeClick}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Recharge Wallet</span>
          </button>
        </div>

      </div>
    </div>
  );
};
