import { Sparkles, Calendar, Map, Wallet, Hotel, Car, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const STEPS = [
  {
    icon: Calendar,
    title: 'Share Your Trip Details',
    description: 'Tell us your travel dates, group size, and budget. It takes less than 3 minutes.',
  },
  {
    icon: Sparkles,
    title: 'AI Builds Your Itinerary',
    description: 'Our AI analyzes your preferences and crafts a personalized day-by-day plan using our verified database of places and hotels.',
  },
  {
    icon: Map,
    title: 'Get Recommendations',
    description: 'Receive curated places to visit, hotel options within your budget, and an estimated trip cost breakdown.',
  },
  {
    icon: Wallet,
    title: 'Book with Confidence',
    description: 'Connect with our local team for bookings, assistance, and any adjustments to your plan.',
  },
];

export function PlanTripSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">How It Works</span>
          </div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Plan Your Varanasi Trip with AI
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From ghats to temples, food to festivals — get a personalized travel plan
            in minutes, not days.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="absolute right-5 top-5 text-4xl font-bold text-muted/50">
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/plan-trip">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Start Planning — It&apos;s Free
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <Hotel className="h-8 w-8 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold">Curated Hotels</p>
              <p className="text-xs text-muted-foreground">Verified stays for every budget</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <Map className="h-8 w-8 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold">50+ Places</p>
              <p className="text-xs text-muted-foreground">Temples, ghats, food spots & more</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <Car className="h-8 w-8 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold">Local Transport</p>
              <p className="text-xs text-muted-foreground">E-rickshaw, boat, cab & walking</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
