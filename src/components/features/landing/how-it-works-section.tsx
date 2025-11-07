import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Tell Us About Your Audience',
    description: 'Input niche, demographics, interests, and pain points',
  },
  {
    number: '02',
    title: 'Get Your Strategic Content Plan',
    description: '10 topics with platforms, keywords, and unique angles',
  },
  {
    number: '03',
    title: 'Generate Production-Ready Content',
    description: 'Click any topic → Get full blog post OR YouTube script',
  },
  {
    number: '04',
    title: 'Copy, Publish, Grow',
    description: 'Professional content ready to post. No editing required.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From audience insight to published content in four simple steps
          </p>
        </div>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20"
                 style={{ marginLeft: '10%', marginRight: '10%' }} />

            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {/* Step number circle */}
                  <div className="flex justify-center mb-6">
                    <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-primary to-accent shadow-lg">
                      <span className="text-4xl font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-16 right-0 hidden xl:block">
                      <ArrowRight className="h-6 w-6 text-primary -mr-12" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile & Tablet: Vertical timeline */}
        <div className="lg:hidden max-w-2xl mx-auto">
          <div className="relative">
            {/* Vertical connection line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary to-primary/20" />

            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={step.number} className="relative flex gap-6">
                  {/* Step number circle */}
                  <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-primary to-accent shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-semibold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow to next step */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-7 top-20">
                      <ArrowRight className="h-5 w-5 text-primary rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
