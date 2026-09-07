import Link from 'next/link';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PLACES = [
  {
    name: 'Kashi Vishwanath Temple',
    category: 'Temples',
    image: 'https://images.pexels.com/photos/31598124/pexels-photo-31598124.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Vishwanath Gali, Varanasi',
    duration: '1-2 hours',
    description: 'One of the 12 Jyotirlingas, this sacred temple is the spiritual heart of Varanasi.',
  },
  {
    name: 'Dashashwamedh Ghat',
    category: 'Ghats',
    image: 'https://images.pexels.com/photos/12112985/pexels-photo-12112985.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Ganga Riverfront',
    duration: '2-3 hours',
    description: 'The most vibrant ghat, home to the spectacular evening Ganga Aarti ceremony.',
  },
  {
    name: 'Sarnath',
    category: 'Nearby Attractions',
    image: 'https://images.pexels.com/photos/37160979/pexels-photo-37160979.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: '10 km from Varanasi',
    duration: 'Half day',
    description: 'Where Buddha gave his first sermon. Ancient stupas, museums, and serene gardens.',
  },
  {
    name: 'Manikarnika Ghat',
    category: 'Ghats',
    image: 'https://images.pexels.com/photos/34741303/pexels-photo-34741303.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Ganga Riverfront',
    duration: '1-2 hours',
    description: 'The sacred cremation ghat, offering a profound perspective on the cycle of life.',
  },
  {
    name: 'Assi Ghat',
    category: 'Ghats',
    image: 'https://images.pexels.com/photos/17869831/pexels-photo-17869831.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'South end of Ghats',
    duration: '2 hours',
    description: 'A relaxed ghat popular with students, travellers, and the morning boat ride crowd.',
  },
  {
    name: 'Banarasi Silk Markets',
    category: 'Shopping',
    image: 'https://images.pexels.com/photos/33433875/pexels-photo-33433875.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Godowlia & Thatheri Bazaar',
    duration: '2-3 hours',
    description: 'Famous for handwoven Banarasi silk sarees — a centuries-old weaving tradition.',
  },
];

export function PopularPlacesSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
              Popular Attractions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From ancient temples to bustling ghats — explore the must-visit places in Varanasi.
            </p>
          </div>
          <Link href="/places">
            <span className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              View All Places
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLACES.map((place, i) => (
            <Link
              key={i}
              href={`/places/${place.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute left-3 top-3 bg-primary/90 text-primary-foreground">
                  {place.category}
                </Badge>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                  {place.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {place.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {place.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {place.duration}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
