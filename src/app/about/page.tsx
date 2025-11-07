import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Lightbulb, Rocket, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About Us',
  description: 'Learn how Niche Navigator transforms content creation with AI-powered strategies and production-ready blog posts and YouTube scripts',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4">About Niche Navigator</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Content Creation Shouldn&apos;t Take Days
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We built Niche Navigator to help creators, agencies, and businesses generate audience-targeted content strategies and production-ready content in minutes, not hours.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="max-w-4xl mx-auto mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Our Mission</CardTitle>
            <CardDescription>Making strategic content creation accessible to everyone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Every day, content creators waste hours staring at blank pages. Marketing agencies pay thousands per month for writers. Businesses struggle to maintain consistent content schedules.
            </p>
            <p className="text-muted-foreground">
              We believe content creation should be strategic, fast, and accessible to everyone.
            </p>
            <p className="text-muted-foreground">
              Niche Navigator uses AI to transform the content creation process—from understanding your audience, to generating strategic topic plans, to producing publication-ready blog posts and YouTube scripts. All in minutes.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Why We Built This */}
      <div className="max-w-4xl mx-auto mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Why We Built This</CardTitle>
            <CardDescription>The problems we set out to solve</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. Generic Content</h3>
                <p className="text-muted-foreground">
                  Most AI tools generate bland, one-size-fits-all content that doesn&apos;t connect with specific audiences.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2. Incomplete Solutions</h3>
                <p className="text-muted-foreground">
                  Some tools help with strategy. Others help with writing. None do both seamlessly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3. Time Sink</h3>
                <p className="text-muted-foreground">
                  Even with AI assistance, creating content takes hours of editing, formatting, and optimization.
                </p>
              </div>
            </div>

            <p className="text-muted-foreground font-medium pt-4 border-t">
              Niche Navigator solves all three. We generate audience-specific strategies, then create production-ready content tailored to that strategy—complete with SEO, formatting, and CTAs.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What Makes Us Different */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">What Makes Us Different</h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <Target className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Audience-First Approach</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Unlike generic AI tools, we start by understanding your specific audience—their demographics, interests, and pain points. Every piece of content is tailored to connect with real people.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lightbulb className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Strategy + Execution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We don&apos;t just generate content. We create the strategic plan first, then produce content that fits that plan. Think of us as your AI content strategist AND writer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Rocket className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Production-Ready Output</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our blog posts come with proper HTML formatting, SEO optimization, and internal linking suggestions. Our YouTube scripts include timestamps, B-roll suggestions, and visual cues. Copy, paste, publish.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-4xl mx-auto mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Our Values</CardTitle>
            <CardDescription>The principles that guide everything we do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Quality Over Quantity</h3>
                  <p className="text-sm text-muted-foreground">
                    Every piece of content should add value, not just fill space.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Speed Without Compromise</h3>
                  <p className="text-sm text-muted-foreground">
                    Fast generation doesn&apos;t mean generic output. We deliver both.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Creator Empowerment</h3>
                  <p className="text-sm text-muted-foreground">
                    We build tools that amplify human creativity, not replace it.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tech Stack */}
      <div className="max-w-4xl mx-auto mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Built With Modern Tech</CardTitle>
            <CardDescription>The technologies powering Niche Navigator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">AI & Content Generation</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Google Gemini AI for intelligent content generation</li>
                  <li>• Advanced prompt engineering for audience targeting</li>
                  <li>• Multi-stage generation for strategy + content</li>
                  <li>• Brand voice customization</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Platform & Infrastructure</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Next.js 15 with App Router</li>
                  <li>• Supabase for authentication & data</li>
                  <li>• Vercel for global deployment</li>
                  <li>• Stripe for secure payment processing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Transform Your Content Creation?</CardTitle>
            <CardDescription>
              Join creators and agencies using Niche Navigator to generate audience-targeted content in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/generator"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Generate Your First Content Strategy
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
