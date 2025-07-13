
import React, { useState } from 'react';
import { Crown, Star, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CryptoPayment } from './CryptoPayment';
import { useAuth } from '@/hooks/useAuth';

interface PremiumTier {
  id: 'basic' | 'premium' | 'pro';
  name: string;
  price: number;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

export const PremiumSubscription: React.FC = () => {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium' | 'pro' | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const tiers: PremiumTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 5,
      icon: <Star className="h-6 w-6" />,
      features: [
        'Ad-free browsing',
        'Custom reactions',
        'Priority support',
        'Basic analytics'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 15,
      icon: <Crown className="h-6 w-6" />,
      popular: true,
      features: [
        'Everything in Basic',
        'Post boosting',
        'Advanced analytics',
        'Custom badges',
        'Early access to features'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 25,
      icon: <Zap className="h-6 w-6" />,
      features: [
        'Everything in Premium',
        'NFT creation tools',
        'Creator monetization',
        'API access',
        'White-label options'
      ]
    }
  ];

  const handleSelectTier = (tierId: 'basic' | 'premium' | 'pro') => {
    if (!user) {
      // Redirect to login
      return;
    }
    setSelectedTier(tierId);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    // Update user's premium status
    console.log(`Premium ${selectedTier} subscription activated`);
    setShowPayment(false);
    setSelectedTier(null);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Upgrade to Premium
          </h2>
          <p className="text-purple-200 text-lg">
            Unlock exclusive features and support creators with cryptocurrency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 hover:bg-white/15 ${
                tier.popular
                  ? 'border-yellow-400 ring-2 ring-yellow-400/50'
                  : 'border-white/20'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="flex justify-center mb-3 text-purple-400">
                  {tier.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-white mb-1">
                  ${tier.price}
                </div>
                <p className="text-purple-200 text-sm">per month</p>
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-white text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectTier(tier.id)}
                className={`w-full ${
                  tier.popular
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-black'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                Pay with Crypto
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-purple-200 text-sm">
            💰 Pay with Bitcoin, Ethereum, or USDT • 🔒 Secure blockchain transactions
          </p>
        </div>
      </div>

      {showPayment && selectedTier && (
        <CryptoPayment
          premiumTier={selectedTier}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => {
            setShowPayment(false);
            setSelectedTier(null);
          }}
        />
      )}
    </>
  );
};
