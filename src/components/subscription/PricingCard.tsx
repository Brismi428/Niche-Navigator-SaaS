'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Plan {
  id: string;
  name: string;
  description: string;
  amount: number;
  stripe_price_id: string;
  features: Record<string, any>;
}

interface PricingCardProps {
  plan: Plan;
  currentPlanId?: string;
  onSubscribe: (priceId: string) => void;
  loading?: boolean;
}

export function PricingCard({
  plan,
  currentPlanId,
  onSubscribe,
  loading = false,
}: PricingCardProps) {
  const isCurrentPlan = currentPlanId === plan.id;
  const isFree = plan.amount === 0;
  const isPopular = plan.name === 'Pro';

  const formatPrice = (amount: number) => {
    return (amount / 100).toFixed(2);
  };

  const getFeatureList = (features: Record<string, any>) => {
    const featureList = [];

    if (features.max_users) {
      const users = features.max_users === '-1' ? 'Unlimited' : features.max_users;
      featureList.push(`${users} users`);
    }

    if (features.api_calls_per_month) {
      const calls = features.api_calls_per_month === '-1'
        ? 'Unlimited'
        : `${parseInt(features.api_calls_per_month).toLocaleString()}`;
      featureList.push(`${calls} API calls/month`);
    }

    if (features.storage_gb) {
      const storage = features.storage_gb === '-1'
        ? 'Unlimited'
        : `${features.storage_gb} GB`;
      featureList.push(`${storage} storage`);
    }

    if (features.support_level) {
      featureList.push(`${features.support_level.replace(/"/g, '')} support`);
    }

    if (features.custom_branding === 'true') {
      featureList.push('Custom branding');
    }

    if (features.advanced_analytics === 'true') {
      featureList.push('Advanced analytics');
    }

    if (features.priority_support === 'true') {
      featureList.push('Priority support');
    }

    if (features.sso_integration === 'true') {
      featureList.push('SSO integration');
    }

    return featureList;
  };

  const featureList = getFeatureList(plan.features);

  return (
    <Card
      className={`relative flex flex-col ${
        isPopular ? 'border-primary shadow-lg scale-105' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="text-4xl font-bold">${formatPrice(plan.amount)}</span>
          <span className="text-muted-foreground">/month</span>
        </div>

        <ul className="space-y-3">
          {featureList.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onSubscribe(plan.stripe_price_id)}
          disabled={loading || isCurrentPlan}
          variant={isPopular ? 'default' : 'outline'}
        >
          {isCurrentPlan
            ? 'Current Plan'
            : isFree
            ? 'Get Started'
            : 'Subscribe'}
        </Button>
      </CardFooter>
    </Card>
  );
}
