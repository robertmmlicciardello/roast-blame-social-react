
import React, { useState, useEffect } from 'react';
import { Bitcoin, Coins, DollarSign, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface CryptoPaymentProps {
  premiumTier: 'basic' | 'premium' | 'pro';
  onPaymentSuccess: () => void;
  onClose: () => void;
}

export const CryptoPayment: React.FC<CryptoPaymentProps> = ({
  premiumTier,
  onPaymentSuccess,
  onClose
}) => {
  const { user } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState<'BTC' | 'ETH' | 'USDT'>('ETH');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  const premiumPrices = {
    basic: { BTC: 0.0001, ETH: 0.002, USDT: 5 },
    premium: { BTC: 0.0003, ETH: 0.006, USDT: 15 },
    pro: { BTC: 0.0005, ETH: 0.01, USDT: 25 }
  };

  const cryptoIcons = {
    BTC: <Bitcoin className="h-6 w-6 text-orange-500" />,
    ETH: <Coins className="h-6 w-6 text-blue-500" />,
    USDT: <DollarSign className="h-6 w-6 text-green-500" />
  };

  // Check if MetaMask is available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setWalletConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "Wallet Not Found",
          description: "Please install MetaMask to continue with crypto payments",
          variant: "destructive"
        });
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletConnected(true);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask"
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateInvoice = async () => {
    setPaymentStatus('processing');
    
    try {
      // In production, this would call your backend API
      // which integrates with Coinbase Commerce or BitPay
      const mockInvoice = {
        id: `invoice_${Date.now()}`,
        amount: premiumPrices[premiumTier][selectedCurrency],
        currency: selectedCurrency,
        address: selectedCurrency === 'BTC' 
          ? '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' 
          : '0x742B2f61F0b3b8fE26e726e43D73B9F0B1b65d0d',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      };
      
      setInvoiceData(mockInvoice);
      
      // Simulate payment monitoring
      setTimeout(() => {
        setPaymentStatus('success');
        toast({
          title: "Payment Confirmed",
          description: "Your premium subscription has been activated!"
        });
        onPaymentSuccess();
      }, 3000);
      
    } catch (error) {
      console.error('Invoice generation error:', error);
      setPaymentStatus('error');
      toast({
        title: "Payment Failed",
        description: "Unable to generate payment invoice. Please try again.",
        variant: "destructive"
      });
    }
  };

  const initializeWeb3Payment = async () => {
    if (!walletConnected) {
      await connectWallet();
      return;
    }
    
    try {
      setPaymentStatus('processing');
      
      if (!window.ethereum) {
        throw new Error('MetaMask not available');
      }

      const web3 = new (window as any).Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      
      if (selectedCurrency === 'ETH') {
        const transaction = {
          from: accounts[0],
          to: '0x742B2f61F0b3b8fE26e726e43D73B9F0B1b65d0d', // Platform wallet
          value: web3.utils.toWei(premiumPrices[premiumTier][selectedCurrency].toString(), 'ether'),
          gas: '21000'
        };
        
        const txHash = await web3.eth.sendTransaction(transaction);
        
        // Log transaction for verification
        console.log('Transaction hash:', txHash);
        
        setPaymentStatus('success');
        onPaymentSuccess();
      }
      
    } catch (error) {
      console.error('Web3 payment error:', error);
      setPaymentStatus('error');
      toast({
        title: "Transaction Failed",
        description: "Payment transaction was cancelled or failed.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Crypto Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            {premiumTier.charAt(0).toUpperCase() + premiumTier.slice(1)} Plan
          </h3>
          <p className="text-gray-400 text-sm">Choose your preferred cryptocurrency</p>
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(['BTC', 'ETH', 'USDT'] as const).map((currency) => (
            <button
              key={currency}
              onClick={() => setSelectedCurrency(currency)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCurrency === currency
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                {cryptoIcons[currency]}
                <span className="text-white font-medium">{currency}</span>
                <span className="text-gray-400 text-sm">
                  {premiumPrices[premiumTier][currency]} {currency}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Wallet Connection Status */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Wallet className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-white font-medium">
                {walletConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
              </p>
              <p className="text-gray-400 text-sm">
                {walletConnected ? 'Ready for payment' : 'Connect your wallet to continue'}
              </p>
            </div>
            {walletConnected && <CheckCircle className="h-5 w-5 text-green-500" />}
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus === 'processing' && (
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
              <span className="text-blue-400">Processing payment...</span>
            </div>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400">Payment successful!</span>
            </div>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-400">Payment failed. Please try again.</span>
            </div>
          </div>
        )}

        {/* Invoice Display */}
        {invoiceData && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-white font-medium mb-2">Payment Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white">{invoiceData.amount} {invoiceData.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Address:</span>
                <span className="text-white font-mono text-xs break-all">{invoiceData.address}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!walletConnected ? (
            <Button onClick={connectWallet} className="w-full bg-purple-600 hover:bg-purple-700">
              Connect Wallet
            </Button>
          ) : (
            <Button 
              onClick={selectedCurrency === 'ETH' ? initializeWeb3Payment : generateInvoice}
              disabled={paymentStatus === 'processing'}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {paymentStatus === 'processing' ? 'Processing...' : `Pay with ${selectedCurrency}`}
            </Button>
          )}
          
          <Button onClick={onClose} variant="outline" className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
