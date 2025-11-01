'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock } from 'lucide-react';

function RateLimitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(0);

  const retryAfter = parseInt(searchParams.get('retry') || '60', 10);
  const returnPath = searchParams.get('return') || '/';

  useEffect(() => {
    setCountdown(retryAfter);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [retryAfter]);

  const handleRetry = () => {
    router.push(returnPath);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Too Many Requests</CardTitle>
          <CardDescription>
            You&apos;ve exceeded the rate limit for this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Please wait</span>
            </div>
            <div className="mt-2 text-3xl font-bold tabular-nums">
              {countdown > 0 ? (
                <>
                  {Math.floor(countdown / 60)}:
                  {(countdown % 60).toString().padStart(2, '0')}
                </>
              ) : (
                'Ready'
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {countdown > 0 ? 'Time remaining until you can try again' : 'You can now try again'}
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Why did this happen?</strong>
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Too many requests in a short period</li>
              <li>Automated script or bot activity detected</li>
              <li>Multiple failed login attempts</li>
            </ul>
          </div>

          <Button
            onClick={handleRetry}
            disabled={countdown > 0}
            className="w-full"
          >
            {countdown > 0 ? `Retry in ${countdown}s` : 'Try Again'}
          </Button>

          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full"
          >
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RateLimitErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <RateLimitContent />
    </Suspense>
  );
}
