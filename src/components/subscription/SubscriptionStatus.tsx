'use client';

import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Subscription {
  id: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  plan: {
    name: string;
    amount: number;
  };
}

interface SubscriptionStatusProps {
  subscription: Subscription | null;
  onManageSubscription: () => void;
  loading?: boolean;
}

export function SubscriptionStatus({
  subscription,
  onManageSubscription,
  loading = false,
}: SubscriptionStatusProps) {
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don&apos;t have an active subscription. Choose a plan below to get
            started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case 'past_due':
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Past Due
          </Badge>
        );
      case 'canceled':
        return (
          <Badge variant="secondary">
            <XCircle className="mr-1 h-3 w-3" />
            Canceled
          </Badge>
        );
      case 'trialing':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            Trial
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (amount: number) => {
    return (amount / 100).toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Current Subscription</CardTitle>
          {getStatusBadge(subscription.status)}
        </div>
        <CardDescription>
          Manage your subscription and billing details
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="text-lg font-semibold">{subscription.plan.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-lg font-semibold">
              ${formatPrice(subscription.plan.amount)}/month
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            {subscription.cancel_at_period_end
              ? 'Subscription ends on'
              : 'Next billing date'}
          </p>
          <p className="text-lg font-semibold">
            {formatDate(subscription.current_period_end)}
          </p>
        </div>

        {subscription.cancel_at_period_end && (
          <div className="rounded-lg border border-yellow-500 bg-yellow-50 dark:bg-yellow-950 p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Your subscription will be canceled at the end of the current billing
              period. You&apos;ll continue to have access until{' '}
              {formatDate(subscription.current_period_end)}.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={onManageSubscription}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Loading...' : 'Manage Subscription'}
        </Button>
      </CardFooter>
    </Card>
  );
}
