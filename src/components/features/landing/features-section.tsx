import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, FileText, Video, DollarSign, Share2, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Audience-Targeted Strategy',
    description: 'Generate 10 strategic content topics based on your niche, demographics, and pain points. No generic suggestions.',
    features: ['Niche-Specific Topics', 'Demographic Targeting', 'Pain Point Analysis', 'Strategic Planning'],
  },
  {
    icon: FileText,
    title: 'Production-Ready Blog Posts',
    description: 'Complete 1,500-2,000 word blog posts with proper HTML formatting, SEO optimization, and CTAs. Copy and publish.',
    features: ['1,500-2,000 Words', 'HTML Formatted', 'SEO Optimized', 'Built-in CTAs'],
  },
  {
    icon: Video,
    title: 'Film-Ready YouTube Scripts',
    description: 'Full scripts with timestamps, B-roll suggestions, visual cues, and engagement hooks. Hand it to your editor.',
    features: ['Timestamps Included', 'B-roll Suggestions', 'Visual Cues', 'Engagement Hooks'],
  },
  {
    icon: DollarSign,
    title: 'Monetization Built-In',
    description: 'Every piece includes strategic CTAs, affiliate opportunities, and lead magnets. Content that converts.',
    features: ['Strategic CTAs', 'Affiliate Placements', 'Lead Magnets', 'Conversion Focus'],
  },
  {
    icon: Share2,
    title: 'Multi-Platform Strategy',
    description: 'Blog, YouTube, LinkedIn, Twitter/X - get platform-specific recommendations for maximum reach.',
    features: ['Blog Optimization', 'YouTube Scripts', 'LinkedIn Posts', 'Twitter/X Threads'],
  },
  {
    icon: Sparkles,
    title: 'Brand Voice Control',
    description: 'Set your tone (professional, casual, educational) and complexity level. AI adapts to your brand.',
    features: ['Tone Selection', 'Complexity Control', 'Brand Consistency', 'Style Customization'],
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything You Need for{' '}
            <span className="gradient-text">Content That Converts</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            AI-powered content creation that understands your audience, matches your brand, and drives results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="relative group hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  {feature.description}
                </CardDescription>
                <ul className="space-y-2">
                  {feature.features.map((item) => (
                    <li key={item} className="flex items-center text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional features grid */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">
            Plus Many More Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Keyword Research',
              'Competitor Analysis',
              'Content Calendar',
              'Topic Clustering',
              'Engagement Optimization',
              'Readability Scoring',
              'Meta Descriptions',
              'Social Media Snippets',
              'Content Repurposing',
              'A/B Testing Ideas',
              'Analytics Integration',
              'Export to Multiple Formats',
            ].map((feature) => (
              <div key={feature} className="flex items-center p-4 rounded-lg border bg-card">
                <div className="h-2 w-2 rounded-full bg-primary mr-3" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}