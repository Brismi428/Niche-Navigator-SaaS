import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How is this different from ChatGPT?',
    answer: 'We generate complete, audience-targeted content strategies with production-ready output. ChatGPT gives you generic responses that need heavy editing.',
  },
  {
    question: "What if I don't like the content?",
    answer: "Regenerate with one click. Adjust tone, complexity, or provide more specific guidance. Unlimited generations.",
  },
  {
    question: 'Can I customize the output?',
    answer: 'Yes. Set brand voice, tone, complexity level. Add specific sub-niche focus. The AI adapts to your preferences.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, 14-day money-back guarantee. No questions asked.',
  },
  {
    question: 'Can I export the content?',
    answer: 'Yes. Copy to clipboard, export to Google Docs, or download as HTML. Use it anywhere.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our content generation platform
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Additional help section */}
        <div className="mx-auto max-w-2xl text-center mt-16">
          <div className="rounded-lg border bg-card p-8">
            <h3 className="text-xl font-semibold mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
