
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertModal } from '@/components/ui/alert-modal';

interface AlertConfig {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
}

interface AlertContextType {
  showAlert: (config: AlertConfig) => void;
  showConfirm: (config: AlertConfig) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showAlert = (config: AlertConfig) => {
    setAlertConfig({ ...config, showCancel: false });
    setIsOpen(true);
  };

  const showConfirm = (config: AlertConfig) => {
    setAlertConfig({ ...config, showCancel: true });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setAlertConfig(null), 300); // Delay to allow animation
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {alertConfig && (
        <AlertModal
          isOpen={isOpen}
          onClose={handleClose}
          onConfirm={alertConfig.onConfirm}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          confirmText={alertConfig.confirmText}
          cancelText={alertConfig.cancelText}
          showCancel={alertConfig.showCancel}
        />
      )}
    </AlertContext.Provider>
  );
};
