'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface PlanFeatures {
  max_users?: string;
  api_calls_per_month?: string;
  storage_gb?: string;
  support_level?: string;
  custom_branding?: string;
  advanced_analytics?: string;
  priority_support?: string;
  sso_integration?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  stripe_product_id: string;
  amount: number;
  stripe_price_id: string;
  features: PlanFeatures;
}

interface Subscription {
  id: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  plan: Plan;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  plans: Plan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCheckoutSession: (priceId: string) => Promise<string>;
  createPortalSession: () => Promise<string>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      if (!response.ok) throw new Error('Failed to fetch plans');
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch plans');
    }
  };

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscriptions/current');
      if (!response.ok) {
        if (response.status === 404) {
          setSubscription(null);
          return;
        }
        throw new Error('Failed to fetch subscription');
      }
      const data = await response.json();
      setSubscription(data.subscription);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch subscription'
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchPlans(), fetchSubscription()]);
  };

  const createCheckoutSession = async (priceId: string): Promise<string> => {
    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      throw err;
    }
  };

  const createPortalSession = async (): Promise<string> => {
    try {
      const response = await fetch('/api/subscriptions/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error('Error creating portal session:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [user, fetchSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        plans,
        loading,
        error,
        refetch,
        createCheckoutSession,
        createPortalSession,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionProvider'
    );
  }
  return context;
}
