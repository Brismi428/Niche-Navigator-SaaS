import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Target, Zap, Heart } from 'lucide-react'

export const metadata = {
  title: 'About Us',
  description: 'Learn more about Niche Navigator and our mission to help you build amazing products',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4">About Niche Navigator</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Building the Future of SaaS
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're on a mission to empower developers and entrepreneurs to build, launch, and scale their SaaS products faster than ever before.
        </p>
      </div>

      {/* Mission & Values */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
        <Card>
          <CardHeader>
            <Target className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Simplify the process of building production-ready SaaS applications with modern tools and best practices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Innovation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Leverage cutting-edge technologies like Next.js 15, React 19, and Supabase to stay ahead of the curve.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Build together with a thriving community of developers, sharing knowledge and growing together.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Heart className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Excellence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Deliver exceptional quality with comprehensive testing, documentation, and support.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Our Story */}
      <div className="max-w-4xl mx-auto mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Our Story</CardTitle>
            <CardDescription>How Niche Navigator came to be</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Niche Navigator was born from the frustration of repeatedly building the same foundational features for every new SaaS project. Authentication, payments, user management, analytics—these are essential but time-consuming to implement correctly.
            </p>
            <p className="text-muted-foreground">
              We realized that developers and entrepreneurs shouldn't have to reinvent the wheel every time they want to launch a new product. So we built Niche Navigator—a production-ready SaaS accelerator that handles all the boilerplate, so you can focus on what makes your product unique.
            </p>
            <p className="text-muted-foreground">
              Today, Niche Navigator powers hundreds of successful SaaS applications, helping founders go from idea to launch in days instead of months. Built with Next.js 15, TypeScript, Supabase, and Stripe, it represents the best practices we've learned from building and scaling SaaS products over the years.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tech Stack */}
      <div className="max-w-4xl mx-auto mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Built With Modern Technology</CardTitle>
            <CardDescription>The tools powering Niche Navigator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Frontend</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Next.js 15 with App Router</li>
                  <li>• React 19</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS 4</li>
                  <li>• shadcn/ui components</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Backend & Services</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Supabase (Auth & Database)</li>
                  <li>• Stripe (Payments)</li>
                  <li>• Server Components & API Routes</li>
                  <li>• Middleware-based protection</li>
                  <li>• JWT token authentication</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          We're a small but mighty team of developers, designers, and product enthusiasts dedicated to building the best SaaS starter kit.
        </p>
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">JD</span>
              </div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>Founder & Lead Developer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Full-stack engineer with 10+ years building scalable SaaS applications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">JS</span>
              </div>
              <CardTitle>Jane Smith</CardTitle>
              <CardDescription>Product Designer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                UI/UX designer passionate about creating intuitive user experiences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">MJ</span>
              </div>
              <CardTitle>Mike Johnson</CardTitle>
              <CardDescription>DevOps Engineer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Infrastructure expert ensuring reliability, security, and performance.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Build Something Amazing?</CardTitle>
            <CardDescription>
              Join thousands of developers who are building their SaaS products with Niche Navigator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Get Started Free
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Contact Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
