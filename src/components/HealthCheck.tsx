
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { isFirebaseConfigured, useMockData } from '@/lib/firebase';

export const HealthCheck: React.FC = () => {
  const [status, setStatus] = useState({
    firebase: false,
    web3: false,
    mockData: false
  });

  useEffect(() => {
    const checkHealth = () => {
      const firebaseStatus = isFirebaseConfigured();
      const web3Status = !!(window.ethereum || window.Web3);
      const mockDataStatus = useMockData();

      setStatus({
        firebase: firebaseStatus,
        web3: web3Status,
        mockData: mockDataStatus
      });
    };

    checkHealth();
  }, []);

  if (import.meta.env.PROD) {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
      <div className="font-bold mb-2">System Status</div>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          {status.firebase ? (
            <CheckCircle className="h-3 w-3 text-green-400" />
          ) : (
            <XCircle className="h-3 w-3 text-red-400" />
          )}
          <span>Firebase: {status.firebase ? 'Connected' : 'Mock Mode'}</span>
        </div>
        <div className="flex items-center space-x-2">
          {status.web3 ? (
            <CheckCircle className="h-3 w-3 text-green-400" />
          ) : (
            <AlertCircle className="h-3 w-3 text-yellow-400" />
          )}
          <span>Web3: {status.web3 ? 'Available' : 'Not Available'}</span>
        </div>
        <div className="flex items-center space-x-2">
          {status.mockData ? (
            <AlertCircle className="h-3 w-3 text-yellow-400" />
          ) : (
            <CheckCircle className="h-3 w-3 text-green-400" />
          )}
          <span>Data: {status.mockData ? 'Mock' : 'Live'}</span>
        </div>
      </div>
    </div>
  );
};
