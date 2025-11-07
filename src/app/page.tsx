import { HeroSection } from '@/components/features/landing/hero-section';
import { FeaturesSection } from '@/components/features/landing/features-section';
import { HowItWorksSection } from '@/components/features/landing/how-it-works-section';
import { PricingPreview } from '@/components/features/landing/pricing-preview';
import { FAQSection } from '@/components/features/landing/faq-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingPreview />
      <FAQSection />
    </>
  );
}
