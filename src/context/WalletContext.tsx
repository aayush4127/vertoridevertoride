import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

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
  rechargeWallet: (amount: number, method?: string) => Promise<{ success: boolean; message: string }>;
  deductFare: (amount?: number, description?: string) => { success: boolean; message: string; remainingBalance: number };
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

const GLOBAL_BALANCE_KEY = 'vertopay_balance';
const GLOBAL_TRANSACTIONS_KEY = 'vertopay_transactions';
const USERS_STORAGE_KEY = 'vertoride_registered_users';
const AUTH_STORAGE_KEY = 'vertoride_auth_user';

const getUserStorageKey = (emailOrId?: string, suffix: string = 'balance'): string => {
  if (!emailOrId) return `vertopay_${suffix}_guest`;
  const clean = emailOrId.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  return `vertopay_${suffix}_${clean}`;
};

const loadUserWalletData = (emailOrId?: string): { balance: number; transactions: WalletTransaction[] } => {
  try {
    const userBalKey = getUserStorageKey(emailOrId, 'balance');
    const userTxKey = getUserStorageKey(emailOrId, 'transactions');

    const storedUserBal = localStorage.getItem(userBalKey);
    const storedUserTx = localStorage.getItem(userTxKey);

    if (storedUserBal !== null && !isNaN(Number(storedUserBal))) {
      return {
        balance: Number(storedUserBal),
        transactions: storedUserTx ? JSON.parse(storedUserTx) : []
      };
    }

    // Check if user account in registered accounts has a balance
    if (emailOrId) {
      try {
        const rawAccounts = localStorage.getItem(USERS_STORAGE_KEY);
        if (rawAccounts) {
          const accounts = JSON.parse(rawAccounts);
          const userAccount = accounts[emailOrId.toLowerCase().trim()];
          if (userAccount?.profile?.walletBalance !== undefined && !isNaN(Number(userAccount.profile.walletBalance))) {
            const accBal = Number(userAccount.profile.walletBalance);
            localStorage.setItem(userBalKey, accBal.toString());
            return {
              balance: accBal,
              transactions: storedUserTx ? JSON.parse(storedUserTx) : []
            };
          }
        }
      } catch (e) {
        console.error('Error reading account balance', e);
      }
    }

    // Check global fallback balance
    const globalBal = localStorage.getItem(GLOBAL_BALANCE_KEY);
    const globalTx = localStorage.getItem(GLOBAL_TRANSACTIONS_KEY);

    if (globalBal !== null && !isNaN(Number(globalBal))) {
      const fallbackBal = Number(globalBal);
      const fallbackTx = globalTx ? JSON.parse(globalTx) : [];
      if (emailOrId) {
        localStorage.setItem(userBalKey, fallbackBal.toString());
        localStorage.setItem(userTxKey, JSON.stringify(fallbackTx));
      }
      return {
        balance: fallbackBal,
        transactions: fallbackTx
      };
    }

    return { balance: 0, transactions: [] };
  } catch (e) {
    console.error('Error loading wallet data', e);
    return { balance: 0, transactions: [] };
  }
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const currentEmailOrId = user?.email || user?.id || '';

  const [balance, setBalance] = useState<number>(() => {
    return loadUserWalletData(currentEmailOrId).balance;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    return loadUserWalletData(currentEmailOrId).transactions;
  });

  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState<boolean>(false);
  const [rechargePresetAmount, setRechargePresetAmount] = useState<number | undefined>(undefined);
  const [neonWarningToast, setNeonWarningToast] = useState<string | null>(null);
  const [successPaymentToast, setSuccessPaymentToast] = useState<string | null>(null);

  // Restore and synchronize wallet whenever the user logs in, switches accounts, or returns
  useEffect(() => {
    if (currentEmailOrId) {
      const { balance: savedBal, transactions: savedTx } = loadUserWalletData(currentEmailOrId);
      setBalance(savedBal);
      setTransactions(savedTx);
    }
  }, [currentEmailOrId]);

  // Sync balance changes to per-user key, global key, and account profile
  const persistBalance = useCallback((newBal: number, targetEmailOrId?: string) => {
    try {
      const email = targetEmailOrId || currentEmailOrId;
      if (email) {
        const userBalKey = getUserStorageKey(email, 'balance');
        localStorage.setItem(userBalKey, newBal.toString());

        // Also persist inside registered accounts object for complete durability
        const rawAccounts = localStorage.getItem(USERS_STORAGE_KEY);
        if (rawAccounts) {
          const accounts = JSON.parse(rawAccounts);
          const cleanEmail = email.toLowerCase().trim();
          if (accounts[cleanEmail]) {
            accounts[cleanEmail].profile = {
              ...accounts[cleanEmail].profile,
              walletBalance: newBal
            };
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
          }
        }

        // Also update auth user session if matching
        const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
        if (rawSession) {
          const session = JSON.parse(rawSession);
          if (session.email?.toLowerCase().trim() === email.toLowerCase().trim()) {
            session.walletBalance = newBal;
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
          }
        }
      }

      localStorage.setItem(GLOBAL_BALANCE_KEY, newBal.toString());
      window.dispatchEvent(new Event('vertopay_balance_updated'));
    } catch (e) {
      console.error('Failed to save VertoPay balance', e);
    }
  }, [currentEmailOrId]);

  // Sync transactions to per-user key and global key
  const persistTransactions = useCallback((newTxList: WalletTransaction[], targetEmailOrId?: string) => {
    try {
      const email = targetEmailOrId || currentEmailOrId;
      if (email) {
        const userTxKey = getUserStorageKey(email, 'transactions');
        localStorage.setItem(userTxKey, JSON.stringify(newTxList));
      }
      localStorage.setItem(GLOBAL_TRANSACTIONS_KEY, JSON.stringify(newTxList));
    } catch (e) {
      console.error('Failed to save VertoPay transactions', e);
    }
  }, [currentEmailOrId]);

  // Listen for storage changes from other tabs or windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const targetKey = currentEmailOrId ? getUserStorageKey(currentEmailOrId, 'balance') : GLOBAL_BALANCE_KEY;
      if ((e.key === targetKey || e.key === GLOBAL_BALANCE_KEY) && e.newValue !== null) {
        const val = Number(e.newValue);
        if (!isNaN(val)) {
          setBalance(val);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentEmailOrId]);

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
   * Recharge VertoPay wallet via UPI
   */
  const rechargeWallet = async (amount: number, method: string = 'UPI'): Promise<{ success: boolean; message: string }> => {
    if (amount <= 0) {
      return { success: false, message: 'Please enter a valid amount' };
    }

    const newBalance = balance + amount;
    setBalance(newBalance);
    persistBalance(newBalance, currentEmailOrId);

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

    const updatedTxList = [newTx, ...transactions];
    setTransactions(updatedTxList);
    persistTransactions(updatedTxList, currentEmailOrId);

    triggerSuccessPaymentToast(`Payment Successful! ₹${amount} added to your VertoPay Wallet.`);

    return {
      success: true,
      message: `Successfully added ₹${amount} via ${method}`
    };
  };

  /**
   * Deducts fare (default ₹15) before ride confirmation
   */
  const deductFare = (amount: number = 15, description: string = 'Campus Ride Seat Booking'): { success: boolean; message: string; remainingBalance: number } => {
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
    persistBalance(updatedBalance, currentEmailOrId);

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

    const updatedTxList = [newTx, ...transactions];
    setTransactions(updatedTxList);
    persistTransactions(updatedTxList, currentEmailOrId);

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

