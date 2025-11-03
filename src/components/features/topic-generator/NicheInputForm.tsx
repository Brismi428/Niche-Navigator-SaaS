'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  primaryNiche: z.string().min(3, {
    message: 'Primary niche must be at least 3 characters.',
  }).max(100, {
    message: 'Primary niche must be less than 100 characters.',
  }),
  targetAudience: z.string().min(10, {
    message: 'Target audience description must be at least 10 characters.',
  }).max(500, {
    message: 'Target audience description must be less than 500 characters.',
  }),
  subNicheIdeas: z.string().max(500, {
    message: 'Sub-niche ideas must be less than 500 characters.',
  }).optional(),
  tone: z.string({
    required_error: 'Please select a tone.',
  }),
  complexity: z.string({
    required_error: 'Please select a complexity level.',
  }),
});

export type FormData = z.infer<typeof formSchema>;

interface NicheInputFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export default function NicheInputForm({ onSubmit, isLoading }: NicheInputFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryNiche: '',
      targetAudience: '',
      subNicheIdeas: '',
      tone: '',
      complexity: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="primaryNiche"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Niche</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., AI Automation, Sustainable Living, Digital Marketing"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter your primary content niche or topic area
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your target audience: demographics, interests, pain points, goals..."
                  className="min-h-[100px] resize-none"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about who you&apos;re creating content for
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subNicheIdeas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Sub-Niche Ideas (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., AI chatbots for small business, workflow automation tools, content generation..."
                  className="min-h-[80px] resize-none"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide specific sub-topics or areas within your niche (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Tone</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="entertaining">Entertaining</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the tone that matches your brand voice
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="complexity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Complexity</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select complexity level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner-Friendly</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert-Level</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the technical depth of your content
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Topic Map...
            </>
          ) : (
            'Generate Topic Map'
          )}
        </Button>
      </form>
    </Form>
  );
}
