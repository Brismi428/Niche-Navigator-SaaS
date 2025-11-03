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
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Topical Map Generator</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Generate SEO-optimized content strategies tailored to your niche and audience
        </p>
      </div>

      {/* Show form only when no results or there's an error */}
      {(topicMap.length === 0 || error) && (
        <div className="max-w-2xl mx-auto">
          <NicheInputForm onSubmit={handleSubmit} isLoading={isLoading} />

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center min-h-[200px] mt-6">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-sm font-medium">Generating your topical map...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This may take a few moments
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Results Display - Full width when topics are generated */}
      {topicMap.length > 0 && !isLoading && !error && (
        <TopicMapDisplay topicMap={topicMap} />
      )}
    </div>
  );
}
