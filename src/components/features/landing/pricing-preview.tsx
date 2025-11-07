import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import Link from 'next/link';

const pricingTiers = [
  {
    name: 'Creator',
    price: 149,
    description: 'Perfect for individual content creators',
    features: [
      'Unlimited content strategies',
      '30 blog posts per month',
      '30 YouTube scripts per month',
      'Export to Google Docs',
      'All features included',
    ],
    limitations: [],
    cta: 'Start Free Trial',
    ctaLink: '/dashboard/generator',
    popular: false,
  },
  {
    name: 'Agency',
    price: 399,
    description: 'Best for agencies and teams managing multiple clients',
    features: [
      'Everything in Creator',
      'Unlimited generations',
      'Client workspaces (coming soon)',
      'White-label branding (coming soon)',
      'Priority support',
    ],
    limitations: [],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'Custom solutions for large organizations',
    features: [
      'Everything in Agency',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantees',
      'Volume discounts',
    ],
    limitations: [],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    popular: false,
  },
];

export function PricingPreview() {
  return (
    <section id="pricing" className="py-20 sm:py-32 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, Transparent{' '}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your content creation needs. Start with a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={`relative ${tier.popular ? 'border-primary shadow-glow scale-105' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    <Star className="h-3 w-3 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="mt-4">
                  {tier.price === null ? (
                    <div className="text-3xl font-bold">Custom</div>
                  ) : (
                    <div className="text-4xl font-bold">
                      ${tier.price}
                      <span className="text-lg font-normal text-muted-foreground">/month</span>
                    </div>
                  )}
                </div>
                <CardDescription className="mt-2">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button
                  className={`w-full mb-6 ${tier.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={tier.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link href={tier.ctaLink}>
                    {tier.cta}
                  </Link>
                </Button>

                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-4 w-4 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {tier.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start text-muted-foreground">
                      <Check className="h-4 w-4 text-muted-foreground mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}