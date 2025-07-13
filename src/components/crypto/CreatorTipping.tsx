import React, { useState } from 'react';
import { Heart, DollarSign, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface CreatorTippingProps {
  postId: string;
  creatorId: string;
  creatorWallet?: string;
  onTipSent: (amount: number, currency: string) => void;
}

export const CreatorTipping: React.FC<CreatorTippingProps> = ({
  postId,
  creatorId,
  creatorWallet,
  onTipSent
}) => {
  const { user } = useAuth();
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0.001);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'ETH' | 'DOGE' | 'MATIC'>('ETH');
  const [isSending, setIsSending] = useState(false);

  const quickAmounts = {
    ETH: [0.001, 0.005, 0.01],
    DOGE: [1, 5, 10],
    MATIC: [0.1, 0.5, 1]
  };

  const sendTip = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to tip creators",
        variant: "destructive"
      });
      return;
    }

    if (!creatorWallet) {
      toast({
        title: "Wallet Not Available",
        description: "Creator hasn't set up their wallet for receiving tips",
        variant: "destructive"
      });
      return;
    }

    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask to send tips",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    try {
      const web3 = new (window as any).Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      
      if (accounts.length === 0) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }

      const tipAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
      
      if (currency === 'ETH') {
        const transaction = {
          from: accounts[0],
          to: creatorWallet,
          value: web3.utils.toWei(tipAmount.toString(), 'ether'),
          gas: '21000'
        };

        const txHash = await web3.eth.sendTransaction(transaction);
        
        // Log the tip transaction
        await logTipTransaction({
          postId,
          creatorId,
          senderId: user.uid,
          amount: tipAmount,
          currency,
          txHash,
          timestamp: new Date()
        });

        onTipSent(tipAmount, currency);
        setShowTipModal(false);
        
        toast({
          title: "Tip Sent Successfully!",
          description: `Sent ${tipAmount} ${currency} to creator`
        });
      }
      
    } catch (error) {
      console.error('Tip sending error:', error);
      toast({
        title: "Transaction Failed",
        description: "Failed to send tip. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const logTipTransaction = async (tipData: any) => {
    // In production, this would save to Firestore
    try {
      const existingTips = JSON.parse(localStorage.getItem('roastblame_tips') || '[]');
      existingTips.push({
        id: 'tip_' + Math.random().toString(36).substr(2, 9),
        ...tipData
      });
      localStorage.setItem('roastblame_tips', JSON.stringify(existingTips));
    } catch (error) {
      console.error('Error logging tip:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowTipModal(true)}
        className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300 transition-colors"
        title="Tip Creator"
      >
        <Zap className="h-4 w-4" />
        <span className="text-sm">Tip</span>
      </button>

      {showTipModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Tip Creator</h3>
              <button 
                onClick={() => setShowTipModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Currency Selection */}
            <div className="mb-4">
              <label className="block text-white font-medium mb-2">Currency</label>
              <div className="grid grid-cols-3 gap-2">
                {(['ETH', 'DOGE', 'MATIC'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`p-3 rounded-lg border transition-all ${
                      currency === curr
                        ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Amounts */}
            <div className="mb-4">
              <label className="block text-white font-medium mb-2">Quick Amounts</label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts[currency].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedAmount === amount && !customAmount
                        ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {amount} {currency}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Custom Amount</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
                />
                <span className="absolute right-3 top-3 text-gray-400">{currency}</span>
              </div>
            </div>

            {/* Tip Summary */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">You're tipping:</span>
                <span className="text-white font-bold">
                  {customAmount || selectedAmount} {currency}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={sendTip}
                disabled={isSending || (!customAmount && !selectedAmount)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
              >
                {isSending ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    <span>Sending Tip...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Send Tip</span>
                  </div>
                )}
              </Button>
              
              <Button 
                onClick={() => setShowTipModal(false)} 
                variant="outline" 
                className="w-full"
              >
                Cancel
              </Button>
            </div>

            <p className="text-gray-400 text-xs text-center mt-4">
              Tips are sent directly to the creator's wallet. Transaction fees may apply.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
