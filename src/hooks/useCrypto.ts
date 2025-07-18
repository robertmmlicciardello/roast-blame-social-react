
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface CryptoTransaction {
  id: string;
  type: 'payment' | 'tip' | 'nft_purchase';
  amount: number;
  currency: string;
  fromAddress?: string;
  toAddress: string;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
  userId: string;
}

interface WalletInfo {
  address: string;
  balance?: number;
  currency: string;
}

export const useCrypto = () => {
  const { user } = useAuth();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [web3Available, setWeb3Available] = useState(false);

  // Check Web3 and wallet availability
  useEffect(() => {
    const checkWeb3Availability = () => {
      const hasEthereum = typeof window !== 'undefined' && window.ethereum;
      const hasWeb3 = typeof window !== 'undefined' && window.Web3;
      setWeb3Available(!!(hasEthereum || hasWeb3));
      
      if (hasEthereum) {
        checkWalletConnection();
      }
    };

    checkWeb3Availability();
    loadUserTransactions();
  }, [user]);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setWalletConnected(true);
        setWalletAddress(accounts[0]);
        
        // Save wallet address to user profile
        if (user) {
          await saveUserWallet(accounts[0]);
        }
        
        return accounts[0];
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const disconnectWallet = useCallback(() => {
    setWalletConnected(false);
    setWalletAddress('');
  }, []);

  const saveUserWallet = async (address: string) => {
    try {
      const userData = {
        userId: user?.uid,
        walletAddress: address,
        connectedAt: new Date().toISOString()
      };
      
      const existingWallets = JSON.parse(localStorage.getItem('roastblame_wallets') || '[]');
      const updatedWallets = existingWallets.filter((w: any) => w.userId !== user?.uid);
      updatedWallets.push(userData);
      
      localStorage.setItem('roastblame_wallets', JSON.stringify(updatedWallets));
    } catch (error) {
      console.error('Error saving wallet:', error);
    }
  };

  const loadUserTransactions = useCallback(() => {
    if (!user) return;

    try {
      const savedTransactions = JSON.parse(localStorage.getItem('roastblame_crypto_transactions') || '[]');
      const userTransactions = savedTransactions.filter((tx: any) => tx.userId === user.uid);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }, [user]);

  const recordTransaction = useCallback(async (transactionData: Omit<CryptoTransaction, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;

    const transaction: CryptoTransaction = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      ...transactionData,
      createdAt: new Date(),
      userId: user.uid
    };

    try {
      const existingTransactions = JSON.parse(localStorage.getItem('roastblame_crypto_transactions') || '[]');
      existingTransactions.push(transaction);
      localStorage.setItem('roastblame_crypto_transactions', JSON.stringify(existingTransactions));
      
      setTransactions(prev => [transaction, ...prev]);
      
      return transaction;
    } catch (error) {
      console.error('Error recording transaction:', error);
      throw error;
    }
  }, [user]);

  const sendEthTransaction = useCallback(async (to: string, amount: number) => {
    if (!walletConnected || !window.ethereum) {
      throw new Error('Wallet not connected');
    }

    if (!web3Available) {
      throw new Error('Web3 not available. Please install MetaMask.');
    }

    try {
      // Check if Web3 is loaded
      if (!window.Web3) {
        // Try to load Web3 dynamically
        const Web3 = await import('web3');
        window.Web3 = Web3.default || Web3;
      }

      const web3 = new window.Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      
      const transaction = {
        from: accounts[0],
        to: to,
        value: web3.utils.toWei(amount.toString(), 'ether'),
        gas: '21000'
      };

      const txHash = await web3.eth.sendTransaction(transaction);
      
      await recordTransaction({
        type: 'tip',
        amount,
        currency: 'ETH',
        fromAddress: accounts[0],
        toAddress: to,
        txHash,
        status: 'pending'
      });

      return txHash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }, [walletConnected, recordTransaction, web3Available]);

  const getWalletBalance = useCallback(async () => {
    if (!walletConnected || !window.ethereum || !web3Available) {
      return null;
    }

    try {
      if (!window.Web3) {
        const Web3 = await import('web3');
        window.Web3 = Web3.default || Web3;
      }

      const web3 = new window.Web3(window.ethereum);
      const balance = await web3.eth.getBalance(walletAddress);
      return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }, [walletConnected, walletAddress, web3Available]);

  return {
    walletConnected,
    walletAddress,
    transactions,
    loading,
    web3Available,
    connectWallet,
    disconnectWallet,
    recordTransaction,
    sendEthTransaction,
    getWalletBalance,
    loadUserTransactions
  };
};
