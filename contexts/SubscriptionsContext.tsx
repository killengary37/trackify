import React, { createContext, useContext, useState, ReactNode } from 'react';
import { HOME_SUBSCRIPTIONS } from '@/constants/data';

interface SubscriptionsContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

interface SubscriptionsProviderProps {
  children: ReactNode;
}

export function SubscriptionsProvider({ children }: SubscriptionsProviderProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  const addSubscription = (subscription: Subscription) => {
    setSubscriptions(prev => [subscription, ...prev]);
  };

  return (
    <SubscriptionsContext.Provider value={{ subscriptions, addSubscription }}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionsContext);
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionsProvider');
  }
  return context;
}