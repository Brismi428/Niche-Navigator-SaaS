'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, Check, FileText, Video } from 'lucide-react';
import { TopicItem } from './TopicMapDisplay';

interface ContentGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: TopicItem | null;
  contentType: 'blog' | 'youtube' | null;
}

export default function ContentGenerationModal({
  isOpen,
  onClose,
  topic,
  contentType,
}: ContentGenerationModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate content
  const handleGenerate = async () => {
    if (!topic || !contentType) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedContent('');

    try {
      const endpoint = contentType === 'blog' ? '/api/generate-blog' : '/api/generate-youtube-script';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.topic,
          keywords: topic.keywords,
          intent: topic.intent,
          angle: topic.angle,
          platforms: topic.platforms,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to generate ${contentType} content`);
      }

      const result = await response.json();
      setGeneratedContent(result.content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error generating content:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Reset modal state on close
  const handleClose = () => {
    setGeneratedContent('');
    setError(null);
    setIsCopied(false);
    onClose();
  };

  if (!topic || !contentType) return null;

  const contentTypeLabel = contentType === 'blog' ? 'Blog Post' : 'YouTube Script';
  const Icon = contentType === 'blog' ? FileText : Video;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Generate {contentTypeLabel}
          </DialogTitle>
          <DialogDescription>
            Generate a complete {contentTypeLabel.toLowerCase()} for: <strong>{topic.topic}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Topic Details */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
            <div>
              <span className="font-semibold">Keywords:</span> {topic.keywords}
            </div>
            <div>
              <span className="font-semibold">Intent:</span> {topic.intent}
            </div>
            <div>
              <span className="font-semibold">Angle:</span> {topic.angle}
            </div>
          </div>

          {/* Generate Button */}
          {!generatedContent && !isGenerating && (
            <Button onClick={handleGenerate} className="w-full" size="lg">
              <Icon className="h-4 w-4 mr-2" />
              Generate {contentTypeLabel}
            </Button>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm font-medium">Generating your {contentTypeLabel.toLowerCase()}...</p>
              <p className="text-xs text-muted-foreground">This may take 30-60 seconds</p>
            </div>
          )}

          {/* Error State */}
          {error && !isGenerating && (
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
              <Button onClick={handleGenerate} variant="outline" className="mt-2" size="sm">
                Try Again
              </Button>
            </div>
          )}

          {/* Generated Content */}
          {generatedContent && !isGenerating && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="generated-content">Generated {contentTypeLabel}</Label>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="generated-content"
                value={generatedContent}
                readOnly
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={handleGenerate} variant="outline" className="flex-1">
                  Regenerate
                </Button>
                <Button onClick={handleClose} variant="default" className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
