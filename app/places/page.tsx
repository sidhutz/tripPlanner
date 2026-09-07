'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Clock, MapPin, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PlaceItem = {
  name: string;
  slug: string;
  category: string;
  image: string;
  location: string;
  duration: string;
  description: string;
  bestTime: string;
  entryFee: string | null;
};

const PLACES: PlaceItem[] = [
  {
    name: 'Kashi Vishwanath Temple',
    slug: 'kashi-vishwanath-temple',
    category: 'Temples',
    image: 'https://images.pexels.com/photos/31598124/pexels-photo-31598124.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Vishwanath Gali, Varanasi',
    duration: '1-2 hours',
    description: 'One of the 12 Jyotirlingas of Lord Shiva and the most sacred temple in Varanasi. A gold-plated spire rises above the sanctum.',
    bestTime: 'Early morning (5-7 AM)',
    entryFee: 'Free',
  },
  {
    name: 'Dashashwamedh Ghat',
    slug: 'dashashwamedh-ghat',
    category: 'Ghats',
    image: 'https://images.pexels.com/photos/12112985/pexels-photo-12112985.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Ganga Riverfront',
    duration: '2-3 hours',
    description: 'The most vibrant and famous ghat in Varanasi. Home to the spectacular Ganga Aarti held every evening at sunset.',
    bestTime: 'Evening (5-7 PM for Aarti)',
    entryFee: 'Free',
  },
  {
    name: 'Manikarnika Ghat',
    slug: 'manikarnika-ghat',
    category: 'Ghats',
    image: 'https://images.pexels.com/photos/34741303/pexels-photo-34741303.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Ganga Riverfront',
    duration: '1-2 hours',
    description: 'The main cremation ghat of Varanasi. A profound and sobering place that offers a deep perspective on the Hindu cycle of life and death.',
    bestTime: 'Daytime',
    entryFee: 'Free',
  },
  {
    name: 'Assi Ghat',
    slug: 'assi-ghat',
    category: 'Ghats',
    image: 'https://images.pexels.com/photos/17869831/pexels-photo-17869831.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'South end of Ghats',
    duration: '2 hours',
    description: 'A relaxed and popular ghat at the southern end. Favored by students, travellers, and the morning boat ride crowd.',
    bestTime: 'Sunrise (5-6 AM)',
    entryFee: 'Free',
  },
  {
    name: 'Sarnath',
    slug: 'sarnath',
    category: 'Nearby Attractions',
    image: 'https://images.pexels.com/photos/37160979/pexels-photo-37160979.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: '10 km from Varanasi',
    duration: 'Half day',
    description: 'Where Buddha gave his first sermon. Features the ancient Dhamek Stupa, Chaukhandi Stupa, and the Sarnath Archaeological Museum.',
    bestTime: 'Morning (9 AM - 12 PM)',
    entryFee: '₹25 (Indian), ₹300 (Foreign)',
  },
  {
    name: 'Banarasi Silk Markets',
    slug: 'banarasi-silk-markets',
    category: 'Shopping',
    image: 'https://images.pexels.com/photos/33433875/pexels-photo-33433875.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Godowlia & Thatheri Bazaar',
    duration: '2-3 hours',
    description: 'Famous for handwoven Banarasi silk sarees. Visit traditional weaving workshops and shop for authentic, centuries-old craftsmanship.',
    bestTime: 'Late morning to evening',
    entryFee: 'Free',
  },
  {
    name: 'Kachori Gali Food Trail',
    slug: 'kachori-gali-food-trail',
    category: 'Food',
    image: 'https://images.pexels.com/photos/5321638/pexels-photo-5321638.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Old City, near Vishwanath Temple',
    duration: '1-2 hours',
    description: 'The legendary food street of Varanasi. Try kachori-sabzi, chaat, dahi chena vada, and seasonal malaiyya.',
    bestTime: 'Morning (7-10 AM)',
    entryFee: 'Free (pay for food)',
  },
  {
    name: 'Ramnagar Fort',
    slug: 'ramnagar-fort',
    category: 'Historical',
    image: 'https://images.pexels.com/photos/17869813/pexels-photo-17869813.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Opposite Varanasi Ghats, across Ganga',
    duration: '2-3 hours',
    description: 'An 18th-century fort and palace of the Maharaja of Varanasi. Features a museum with vintage cars, weapons, and royal artifacts.',
    bestTime: 'Afternoon (2-5 PM)',
    entryFee: '₹75 (Indian), ₹200 (Foreign)',
  },
  {
    name: 'Bharat Mata Temple',
    slug: 'bharat-mata-temple',
    category: 'Spiritual',
    image: 'https://images.pexels.com/photos/19272040/pexels-photo-19272040.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Mahatma Gandhi Kashi Vidyapeeth',
    duration: '1 hour',
    description: 'A unique temple dedicated to Mother India, featuring a large relief map of undivided India carved in marble.',
    bestTime: 'Morning',
    entryFee: 'Free',
  },
  {
    name: 'Durga Temple',
    slug: 'durga-temple',
    category: 'Temples',
    image: 'https://images.pexels.com/photos/27403387/pexels-photo-27403387.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Durga Kund, Tulsi Ghat area',
    duration: '1 hour',
    description: 'An 18th-century temple with a red ochre exterior, dedicated to Goddess Durga. Known for the sacred kund (pond) beside it.',
    bestTime: 'Morning or evening',
    entryFee: 'Free',
  },
  {
    name: 'Tulsi Manas Temple',
    slug: 'tulsi-manas-temple',
    category: 'Spiritual',
    image: 'https://images.pexels.com/photos/31498388/pexels-photo-31498388.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Durga Kund Road',
    duration: '1 hour',
    description: 'A modern temple marking where Tulsidas composed the Ramcharitmanas. Walls are inscribed with verses from the epic.',
    bestTime: 'Morning',
    entryFee: 'Free',
  },
  {
    name: 'Sunrise Boat Ride',
    slug: 'sunrise-boat-ride',
    category: 'Photography',
    image: 'https://images.pexels.com/photos/38857186/pexels-photo-38857186.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Dashashwamedh or Assi Ghat',
    duration: '1-1.5 hours',
    description: 'The quintessential Varanasi experience — a boat ride at dawn along the ghats, watching the city wake up in golden light.',
    bestTime: 'Sunrise (5-6 AM)',
    entryFee: '₹200-500 per person',
  },
];

const CATEGORIES = [
  'All',
  'Temples',
  'Ghats',
  'Spiritual',
  'Historical',
  'Cultural',
  'Food',
  'Shopping',
  'Photography',
  'Family',
  'Nearby Attractions',
];

export default function PlacesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return PLACES.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <>
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/18435639/pexels-photo-18435639.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="container-wide relative z-10 text-center">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Places to Visit in Varanasi
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
            Explore temples, ghats, food streets, and nearby attractions — each
            with practical details to help you plan your visit.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search places..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">
            Showing {filtered.length} {filtered.length === 1 ? 'place' : 'places'}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((place, i) => (
              <Link
                key={i}
                href={`/places/${place.slug}`}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {place.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {place.duration}
                    </span>
                  </div>
                  {place.entryFee && (
                    <p className="mt-2 text-xs font-medium text-accent">
                      Entry: {place.entryFee}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold">No places found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filter.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
