'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface TopicItem {
  topic: string;
  platforms: string;
  keywords: string;
  intent: string;
  angle: string;
  cta: string;
}

interface TopicMapDisplayProps {
  topicMap: TopicItem[];
}

export default function TopicMapDisplay({ topicMap }: TopicMapDisplayProps) {
  // Empty state
  if (topicMap.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Your Topic Map</CardTitle>
          <CardDescription>
            Your generated topic map will appear here after you submit the form
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center text-muted-foreground">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm font-medium">No topics generated yet</p>
            <p className="text-xs mt-1">
              Fill out the form on the left to generate your topic map
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get intent badge color
  const getIntentColor = (intent: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const intentLower = intent.toLowerCase();
    if (intentLower.includes('informational')) return 'default';
    if (intentLower.includes('commercial')) return 'secondary';
    if (intentLower.includes('transactional')) return 'destructive';
    if (intentLower.includes('navigational')) return 'outline';
    return 'default';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Generated Topic Map</CardTitle>
        <CardDescription>
          {topicMap.length} content topics tailored to your niche and audience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">Topic</TableHead>
                <TableHead className="w-[15%]">Platforms</TableHead>
                <TableHead className="w-[15%]">Keywords</TableHead>
                <TableHead className="w-[10%]">Intent</TableHead>
                <TableHead className="w-[20%]">Angle/Hook</TableHead>
                <TableHead className="w-[20%]">CTA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topicMap.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {item.topic}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.platforms}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-wrap gap-1">
                      {item.keywords.split(',').slice(0, 2).map((keyword, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {keyword.trim()}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getIntentColor(item.intent)}>
                      {item.intent}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.angle}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.cta}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
