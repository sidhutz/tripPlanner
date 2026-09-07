import { HeroSection } from '@/components/home/hero-section';
import { PlanTripSection } from '@/components/home/plan-trip-section';
import { WhyVisitSection } from '@/components/home/why-visit-section';
import { PopularPlacesSection } from '@/components/home/popular-places-section';
import { PopularExperiencesSection } from '@/components/home/popular-experiences-section';
import { FeaturedPackagesSection } from '@/components/home/featured-packages-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { FaqSection } from '@/components/home/faq-section';
import { CtaSection } from '@/components/home/cta-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <PlanTripSection />
      <WhyVisitSection />
      <PopularPlacesSection />
      <PopularExperiencesSection />
      <FeaturedPackagesSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
