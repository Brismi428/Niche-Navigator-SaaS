'use client';

import { useState } from 'react';
import NicheInputForm, { type FormData } from '@/components/features/topic-generator/NicheInputForm';
import TopicMapDisplay, { type TopicItem } from '@/components/features/topic-generator/TopicMapDisplay';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

export default function TopicGeneratorPage() {
  const [topicMap, setTopicMap] = useState<TopicItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setTopicMap([]);

    try {
      const response = await fetch('/api/generate-topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate topics');
      }

      const result = await response.json();
      setTopicMap(result.topics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error generating topics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Topic Map Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate SEO-optimized content strategies tailored to your niche and audience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input Form */}
        <div className="space-y-4">
          <NicheInputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Right Column: Results Display */}
        <div className="space-y-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-sm font-medium">Generating your topic map...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This may take a few moments
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results Display */}
          {!isLoading && !error && (
            <TopicMapDisplay topicMap={topicMap} />
          )}
        </div>
      </div>
    </div>
  );
}
