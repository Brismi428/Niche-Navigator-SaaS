'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Folder } from 'lucide-react'
import Link from 'next/link'

export function DashboardContent() {
  const { user } = useAuth()
  const { subscription, loading: subscriptionLoading } = useSubscription()

  // Determine plan information
  const getPlanInfo = () => {
    if (subscriptionLoading) {
      return { name: 'Loading...', status: '' }
    }

    if (!subscription || !subscription.plan) {
      return { name: 'Free Trial', status: '14 days remaining' }
    }

    const daysRemaining = Math.ceil(
      (new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )

    return {
      name: subscription.plan.name,
      status: subscription.cancel_at_period_end
        ? `Cancels in ${daysRemaining} days`
        : `Renews in ${daysRemaining} days`
    }
  }

  const planInfo = getPlanInfo()

  // TODO: Check Supabase for saved content strategies
  // For now, show "Getting Started" state
  const hasContent = false

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.fullName || user?.email}!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {planInfo.name} {planInfo.status && `• ${planInfo.status}`}
          </p>
        </div>

        {/* First Row: Account Info and Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Email:</span>{' '}
                  <span className="text-muted-foreground">{user?.email}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Member since:</span>{' '}
                  <span className="text-muted-foreground">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Email verified:</span>{' '}
                  <span className="text-muted-foreground">
                    {user?.emailConfirmed ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-sm mb-3">
                    <span className="font-medium">Current Plan:</span>{' '}
                    <span className="text-muted-foreground">{planInfo.name}</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/subscriptions">Manage Subscription</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Generate content strategies tailored to your audience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/dashboard/generator">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate New Content Strategy
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/content">
                    <Folder className="mr-2 h-4 w-4" />
                    View My Saved Content
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row: Recent Activity or Getting Started */}
        <Card>
          {hasContent ? (
            // Recent Strategies (when user has saved content)
            <>
              <CardHeader>
                <CardTitle>Recent Strategies</CardTitle>
                <CardDescription>Your most recently generated content strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* TODO: Map through saved strategies from Supabase */}
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="font-medium">Fitness Niche Strategy</h4>
                      <p className="text-sm text-muted-foreground">Created 2 days ago</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/content/123">View</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            // Getting Started (when user has no saved content)
            <>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Generate your first content strategy in 3 easy steps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                      <span className="text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Tell us about your niche and audience</h4>
                      <p className="text-sm text-muted-foreground">
                        Share your target niche, demographics, interests, and pain points
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                      <span className="text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Review your strategic content plan</h4>
                      <p className="text-sm text-muted-foreground">
                        Get 10 audience-targeted topics with platform recommendations
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                      <span className="text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Generate blog posts or YouTube scripts</h4>
                      <p className="text-sm text-muted-foreground">
                        Click any topic to create production-ready content in minutes
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/dashboard/generator">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Start Now
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
