import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
  method?: string;
  status: 'success' | 'pending' | 'failed';
  referenceId?: string;
}

interface WalletContextType {
  balance: number;
  transactions: WalletTransaction[];
  rechargeWallet: (amount: number, method: string) => Promise<{ success: boolean; message: string }>;
  deductFare: (amount: number, description?: string) => { success: boolean; message: string; remainingBalance: number };
  canAffordFare: (amount?: number) => boolean;
  isRechargeModalOpen: boolean;
  openRechargeModal: (presetAmount?: number) => void;
  closeRechargeModal: () => void;
  rechargePresetAmount?: number;
  neonWarningToast: string | null;
  triggerNeonWarningToast: (msg: string) => void;
  clearNeonWarningToast: () => void;
  successPaymentToast: string | null;
  triggerSuccessPaymentToast: (msg: string) => void;
  clearSuccessPaymentToast: () => void;
}

const WALLET_BALANCE_KEY = 'vertopay_balance';
const WALLET_TRANSACTIONS_KEY = 'vertopay_transactions';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(WALLET_BALANCE_KEY);
      if (stored !== null && !isNaN(Number(stored))) {
        return Number(stored);
      }
      // Default initial balance: 0 as requested ("VertoPay Balance: ₹0")
      return 0;
    } catch {
      return 0;
    }
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(WALLET_TRANSACTIONS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState<boolean>(false);
  const [rechargePresetAmount, setRechargePresetAmount] = useState<number | undefined>(undefined);
  const [neonWarningToast, setNeonWarningToast] = useState<string | null>(null);
  const [successPaymentToast, setSuccessPaymentToast] = useState<string | null>(null);

  // Sync balance changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WALLET_BALANCE_KEY, balance.toString());
      // Also broadcast storage event for any multi-window / sub-tree sync
      window.dispatchEvent(new Event('vertopay_balance_updated'));
    } catch (e) {
      console.error('Failed to save VertoPay balance to localStorage', e);
    }
  }, [balance]);

  // Sync transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WALLET_TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save VertoPay transactions', e);
    }
  }, [transactions]);

  // Listen for storage changes from other tabs or windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WALLET_BALANCE_KEY && e.newValue !== null) {
        const val = Number(e.newValue);
        if (!isNaN(val)) {
          setBalance(val);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const openRechargeModal = (presetAmount?: number) => {
    if (presetAmount) setRechargePresetAmount(presetAmount);
    setIsRechargeModalOpen(true);
  };

  const closeRechargeModal = () => {
    setIsRechargeModalOpen(false);
    setRechargePresetAmount(undefined);
  };

  const triggerNeonWarningToast = (msg: string) => {
    setNeonWarningToast(msg);
    setTimeout(() => {
      setNeonWarningToast((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const clearNeonWarningToast = () => setNeonWarningToast(null);

  const triggerSuccessPaymentToast = (msg: string) => {
    setSuccessPaymentToast(msg);
    setTimeout(() => {
      setSuccessPaymentToast((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const clearSuccessPaymentToast = () => setSuccessPaymentToast(null);

  const canAffordFare = (amount: number = 15): boolean => {
    return balance >= amount;
  };

  /**
   * Recharge VertoPay wallet via UPI (with simulated 2-second processing in modal)
   */
  const rechargeWallet = async (amount: number, method: string = 'UPI'): Promise<{ success: boolean; message: string }> => {
    if (amount <= 0) {
      return { success: false, message: 'Please enter a valid amount' };
    }

    const newBalance = balance + amount;
    setBalance(newBalance);

    const refId = `UPI-${Date.now().toString().slice(-6)}`;
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'credit',
      amount,
      description: `Wallet Top-Up via ${method}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method,
      status: 'success',
      referenceId: refId
    };

    setTransactions((prev) => [newTx, ...prev]);
    triggerSuccessPaymentToast(`Payment Successful! ₹${amount} added to your VertoPay Wallet.`);

    return {
      success: true,
      message: `Successfully added ₹${amount} via ${method}`
    };
  };

  /**
   * Deducts exactly the fare (default ₹15) before ride confirmation
   */
  const deductFare = (amount: number = 15, description: string = 'Campus Ride Seat Booking'): { success: boolean; message: string; remainingBalance: number } => {
    // Check if balance is less than 15 or less than 10
    if (balance < amount || balance < 10) {
      triggerNeonWarningToast('Insufficient Balance in VertoPay! Please top up via UPI.');
      return {
        success: false,
        message: 'Insufficient Balance in VertoPay! Please top up via UPI.',
        remainingBalance: balance
      };
    }

    const updatedBalance = Math.max(0, balance - amount);
    setBalance(updatedBalance);

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'debit',
      amount,
      description,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method: 'VertoPay Instant Auto Pass',
      status: 'success',
      referenceId: `VP-${Date.now().toString().slice(-6)}`
    };

    setTransactions((prev) => [newTx, ...prev]);
    triggerSuccessPaymentToast(`₹${amount} successfully deducted from VertoPay!`);

    return {
      success: true,
      message: `Payment of ₹${amount} successful via VertoPay.`,
      remainingBalance: updatedBalance
    };
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        rechargeWallet,
        deductFare,
        canAffordFare,
        isRechargeModalOpen,
        openRechargeModal,
        closeRechargeModal,
        rechargePresetAmount,
        neonWarningToast,
        triggerNeonWarningToast,
        clearNeonWarningToast,
        successPaymentToast,
        triggerSuccessPaymentToast,
        clearSuccessPaymentToast
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
