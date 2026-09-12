import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WalletTransaction } from '../types';
import { useAuth } from './AuthContext';
import { FirebaseService } from '../services/firebaseService';

interface WalletContextType {
  balance: number;
  transactions: WalletTransaction[];
  canAffordFare: (amount?: number) => boolean;
  deductFare: (amount?: number, description?: string) => { success: boolean; message: string; remainingBalance: number };
  rechargeWallet: (amount: number, method?: string) => Promise<{ success: boolean; message: string }>;
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

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState<boolean>(false);
  const [rechargePresetAmount, setRechargePresetAmount] = useState<number | undefined>(undefined);
  const [neonWarningToast, setNeonWarningToast] = useState<string | null>(null);
  const [successPaymentToast, setSuccessPaymentToast] = useState<string | null>(null);

  // Restore and synchronize wallet in real-time whenever the user logs in
  useEffect(() => {
    if (!user?.uid && !user?.id) {
      setBalance(0);
      setTransactions([]);
      return;
    }

    const uid = user.uid || user.id;
    const unsubscribe = FirebaseService.listenToWallet(uid, (data) => {
      setBalance(data.balance);
      setTransactions(data.transactions);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.uid, user?.id]);

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

  const canAffordFare = (amount: number = 10): boolean => {
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
    
    const refId = `UPI-${Date.now().toString().slice(-6)}`;
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'credit',
      amount,
      description: `Wallet Top-Up via ${method}`,
      timestamp: new Date().toISOString(),
      method,
      status: 'success',
      referenceId: refId
    };

    setBalance(newBalance);
    const updatedTxList = [newTx, ...transactions];
    setTransactions(updatedTxList);

    if (user?.uid || user?.id) {
      const uid = user.uid || user.id;
      FirebaseService.recordTransaction(uid, newTx, newBalance);
    }

    triggerSuccessPaymentToast(`Payment Successful! ₹${amount} added to your VertoPay Wallet.`);

    return {
      success: true,
      message: `Successfully added ₹${amount} via ${method}`
    };
  };

  /**
   * Deducts fare (default ₹10) before ride confirmation
   */
  const deductFare = (amount: number = 10, description: string = 'Campus Ride Seat Booking'): { success: boolean; message: string; remainingBalance: number } => {
    if (balance < amount || balance < 10) {
      triggerNeonWarningToast('Insufficient Balance in VertoPay! Please top up via UPI.');
      return {
        success: false,
        message: 'Insufficient Balance in VertoPay! Please top up via UPI.',
        remainingBalance: balance
      };
    }

    const updatedBalance = Math.max(0, balance - amount);
    
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'debit',
      amount,
      description,
      timestamp: new Date().toISOString(),
      method: 'VertoPay Instant Auto Pass',
      status: 'success',
      referenceId: `VP-${Date.now().toString().slice(-6)}`
    };

    setBalance(updatedBalance);
    const updatedTxList = [newTx, ...transactions];
    setTransactions(updatedTxList);

    if (user?.uid || user?.id) {
      const uid = user.uid || user.id;
      FirebaseService.recordTransaction(uid, newTx, updatedBalance);
    }

    return {
      success: true,
      message: 'Fare deducted successfully via VertoPay.',
      remainingBalance: updatedBalance
    };
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        canAffordFare,
        deductFare,
        rechargeWallet,
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
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
