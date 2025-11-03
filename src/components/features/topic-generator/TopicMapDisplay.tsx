'use client';

import { Fragment, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Eye, FileText, Video } from 'lucide-react';
import ContentGenerationModal from './ContentGenerationModal';

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
  // State for expandable rows on mobile
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // State for content generation modal
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [contentType, setContentType] = useState<'blog' | 'youtube' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle row expansion
  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  // Handle content generation
  const handleGenerateContent = (topic: TopicItem, type: 'blog' | 'youtube') => {
    setSelectedTopic(topic);
    setContentType(type);
    setIsModalOpen(true);
  };

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
                <TableHead className="min-w-[200px]">Topic</TableHead>
                <TableHead className="hidden md:table-cell min-w-[120px]">Platforms</TableHead>
                <TableHead className="hidden lg:table-cell min-w-[140px]">Keywords</TableHead>
                <TableHead className="min-w-[100px]">Intent</TableHead>
                <TableHead className="hidden lg:table-cell min-w-[180px]">Angle/Hook</TableHead>
                <TableHead className="hidden xl:table-cell min-w-[160px]">CTA</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topicMap.map((item, index) => (
                <Fragment key={index}>
                  <TableRow>
                    <TableCell className="font-medium whitespace-normal">
                      {item.topic}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground whitespace-normal">
                      {item.platforms}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm whitespace-normal">
                      <div className="flex flex-wrap gap-1">
                        {(typeof item.keywords === 'string' ? item.keywords.split(',') : [item.keywords]).map((keyword, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {String(keyword).trim()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <Badge variant={getIntentColor(item.intent)}>
                        {item.intent}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm whitespace-normal">
                      {item.angle}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-sm text-muted-foreground whitespace-normal">
                      {item.cta}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateContent(item, 'blog')}
                          aria-label="Generate blog post"
                          title="Generate Blog Post"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateContent(item, 'youtube')}
                          aria-label="Generate YouTube script"
                          title="Generate YouTube Script"
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(index)}
                          aria-label={expandedRows.has(index) ? 'Collapse details' : 'Expand details'}
                          title="View Details"
                          className="md:hidden"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(index) && (
                    <TableRow className="md:hidden bg-muted/50">
                      <TableCell colSpan={3} className="py-4">
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-semibold">Platforms:</span>
                            <p className="text-muted-foreground mt-1">{item.platforms}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Keywords:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(typeof item.keywords === 'string' ? item.keywords.split(',') : [item.keywords]).map((keyword, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {String(keyword).trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-semibold">Angle/Hook:</span>
                            <p className="text-muted-foreground mt-1">{item.angle}</p>
                          </div>
                          <div>
                            <span className="font-semibold">CTA:</span>
                            <p className="text-muted-foreground mt-1">{item.cta}</p>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateContent(item, 'blog')}
                              className="flex-1"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Blog Post
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateContent(item, 'youtube')}
                              className="flex-1"
                            >
                              <Video className="h-4 w-4 mr-2" />
                              YouTube Script
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Content Generation Modal */}
      <ContentGenerationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topic={selectedTopic}
        contentType={contentType}
      />
    </Card>
  );
}
