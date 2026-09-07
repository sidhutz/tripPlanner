import Link from 'next/link';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_IMAGE =
  'https://images.pexels.com/photos/38857186/pexels-photo-38857186.jpeg?auto=compress&cs=tinysrgb&w=1920';

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100vh] items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="container-wide relative z-10 pt-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-white/90">
              AI-Powered Trip Planning
            </span>
          </div>

          <h1 className="animate-slide-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Discover the Soul of
            <br />
            <span className="text-primary">Varanasi</span>
          </h1>

          <p className="mt-6 max-w-xl animate-fade-in text-lg leading-relaxed text-white/80 sm:text-xl">
            Get a personalized day-by-day itinerary crafted by AI, with handpicked
            places to visit, stay recommendations, and cost estimates — all tailored
            to your dates, budget, and interests.
          </p>

          <div className="mt-8 flex animate-fade-in flex-col gap-4 sm:flex-row">
            <Link href="/plan-trip">
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                <Sparkles className="h-5 w-5" />
                Plan My Trip
              </Button>
            </Link>
            <Link href="/places">
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:w-auto"
              >
                Explore Varanasi
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex animate-fade-in items-center gap-6 text-white/70">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white/30 bg-gradient-to-br from-primary to-accent"
                  />
                ))}
              </div>
              <span className="text-sm font-medium">2,000+ travellers</span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm">Based in Varanasi, India</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
