import Link from 'next/link';
import { Star, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PACKAGES = [
  {
    name: 'Spiritual Weekend',
    duration: '2 Days / 1 Night',
    price: '₹4,999',
    perPerson: true,
    highlights: ['Kashi Vishwanath Temple', 'Ganga Aarti at Dashashwamedh', 'Sunrise Boat Ride', 'Sarnath Visit'],
    image: 'https://images.pexels.com/photos/36613136/pexels-photo-36613136.jpeg?auto=compress&cs=tinysrgb&w=800',
    popular: false,
  },
  {
    name: 'Classic Varanasi',
    duration: '3 Days / 2 Nights',
    price: '₹8,999',
    perPerson: true,
    highlights: ['All Major Ghats', 'Temples & Sarnath', 'Street Food Tour', 'Silk Market Visit', 'Evening Aarti'],
    image: 'https://images.pexels.com/photos/38857186/pexels-photo-38857186.jpeg?auto=compress&cs=tinysrgb&w=800',
    popular: true,
  },
  {
    name: 'Deep Cultural Dive',
    duration: '5 Days / 4 Nights',
    price: '₹16,999',
    perPerson: true,
    highlights: ['Old City Walk', 'Weaving Workshop', 'Ramnagar Fort', 'Ganga Heritage Walk', 'Cooking Class', 'Day Trip to Vindhyachal'],
    image: 'https://images.pexels.com/photos/17869831/pexels-photo-17869831.jpeg?auto=compress&cs=tinysrgb&w=800',
    popular: false,
  },
];

export function FeaturedPackagesSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Featured Travel Packages
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Handcrafted itineraries by our local experts. Or let our AI build one
            tailored just for you.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PACKAGES.map((pkg, i) => (
            <div
              key={i}
              className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-xl ${
                pkg.popular ? 'border-primary shadow-lg lg:scale-105' : 'border-border'
              }`}
            >
              {pkg.popular && (
                <div className="absolute right-4 top-4 z-10">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {pkg.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Per person
                  </span>
                </div>

                <ul className="mt-5 flex-1 space-y-2">
                  {pkg.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-border pt-5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">{pkg.price}</span>
                      <span className="text-sm text-muted-foreground"> /person</span>
                    </div>
                  </div>
                  <Link href="/plan-trip" className="mt-4 block">
                    <Button
                      className="w-full"
                      variant={pkg.popular ? 'default' : 'outline'}
                    >
                      Customize This Trip
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Prices are estimates based on standard inclusions. Actual costs may vary based on
            availability and season.
          </p>
        </div>
      </div>
    </section>
  );
}
