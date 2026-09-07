'use client';

import { useState, useMemo } from 'react';
import { MapPin, Star, ExternalLink, Search, Filter, BadgeCheck } from 'lucide-react';
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

type HotelItem = {
  name: string;
  slug: string;
  image: string;
  location: string;
  hotelType: string;
  priceMin: number;
  priceMax: number;
  rating: number;
  amenities: string[];
  description: string;
  mapsUrl: string;
};

const HOTELS: HotelItem[] = [
  {
    name: 'Ganga View Heritage Hotel',
    slug: 'ganga-view-heritage-hotel',
    image: 'https://images.pexels.com/photos/33803745/pexels-photo-33803745.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Dashashwamedh Ghat area',
    hotelType: 'Luxury Hotel',
    priceMin: 8000,
    priceMax: 15000,
    rating: 4.7,
    amenities: ['River View', 'Restaurant', 'Wi-Fi', 'AC', 'Airport Pickup', 'Rooftop Cafe'],
    description: 'A heritage property with stunning Ganga views, traditional architecture, and modern comforts. Rooftop dining overlooking the ghats.',
    mapsUrl: 'https://maps.google.com/?q=Dashashwamedh+Ghat+Varanasi',
  },
  {
    name: 'Assi Ghat Guest House',
    slug: 'assi-ghat-guest-house',
    image: 'https://images.pexels.com/photos/19332135/pexels-photo-19332135.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Assi Ghat',
    hotelType: 'Guest House',
    priceMin: 1200,
    priceMax: 2500,
    rating: 4.3,
    amenities: ['River View', 'Wi-Fi', 'AC', 'Common Kitchen', 'Bike Rental'],
    description: 'A cozy guest house steps from Assi Ghat. Popular with backpackers and long-stay travellers. Friendly, homely atmosphere.',
    mapsUrl: 'https://maps.google.com/?q=Assi+Ghat+Varanasi',
  },
  {
    name: 'Kashi Boutique Stay',
    slug: 'kashi-boutique-stay',
    image: 'https://images.pexels.com/photos/18368842/pexels-photo-18368842.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Godowlia, Old City',
    hotelType: 'Mid-range Hotel',
    priceMin: 3500,
    priceMax: 6000,
    rating: 4.5,
    amenities: ['AC', 'Wi-Fi', 'Restaurant', 'Tour Desk', 'Laundry', 'Room Service'],
    description: 'A boutique hotel in the heart of the old city. Walking distance to Kashi Vishwanath Temple and major ghats.',
    mapsUrl: 'https://maps.google.com/?q=Godowlia+Varanasi',
  },
  {
    name: 'Sarnath Retreat Homestay',
    slug: 'sarnath-retreat-homestay',
    image: 'https://images.pexels.com/photos/9491328/pexels-photo-9491328.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Sarnath, near Deer Park',
    hotelType: 'Homestay',
    priceMin: 1800,
    priceMax: 3500,
    rating: 4.6,
    amenities: ['Garden', 'Home Cooked Meals', 'Wi-Fi', 'Bicycle Rental', 'Yoga Sessions'],
    description: 'A peaceful homestay near Sarnath\'s Buddhist sites. Run by a local family offering authentic home-cooked meals.',
    mapsUrl: 'https://maps.google.com/?q=Sarnath+Varanasi',
  },
  {
    name: 'Varanasi Backpackers Hostel',
    slug: 'varanasi-backpackers-hostel',
    image: 'https://images.pexels.com/photos/35213900/pexels-photo-35213900.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Near Assi Ghat',
    hotelType: 'Hostel',
    priceMin: 400,
    priceMax: 800,
    rating: 4.1,
    amenities: ['Dorm Beds', 'Wi-Fi', 'Common Area', 'Kitchen Access', 'Lockers', 'Book Exchange'],
    description: 'A social backpacker hostel with dorm beds and private rooms. Great for meeting fellow travellers. Walking distance to Assi Ghat.',
    mapsUrl: 'https://maps.google.com/?q=Assi+Ghat+Varanasi',
  },
  {
    name: 'Royal Kashi Palace Hotel',
    slug: 'royal-kashi-palace-hotel',
    image: 'https://images.pexels.com/photos/33824477/pexels-photo-33824477.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Cantonment area',
    hotelType: 'Luxury Hotel',
    priceMin: 10000,
    priceMax: 20000,
    rating: 4.8,
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Business Center', 'Airport Transfer', 'Concierge'],
    description: 'A grand luxury hotel in the Cantonment area. Features a pool, spa, multiple dining options, and impeccable service.',
    mapsUrl: 'https://maps.google.com/?q=Cantonment+Varanasi',
  },
  {
    name: 'Ghatside Budget Inn',
    slug: 'ghatside-budget-inn',
    image: 'https://images.pexels.com/photos/19332135/pexels-photo-19332135.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Shivala Ghat area',
    hotelType: 'Budget Hotel',
    priceMin: 800,
    priceMax: 1800,
    rating: 3.9,
    amenities: ['AC', 'Wi-Fi', 'Hot Water', 'Room Service'],
    description: 'A no-frills budget hotel near the ghats. Clean rooms, basic amenities, and an unbeatable location for budget travellers.',
    mapsUrl: 'https://maps.google.com/?q=Shivala+Ghat+Varanasi',
  },
  {
    name: 'BrijRama Palace Heritage',
    slug: 'brijrama-palace-heritage',
    image: 'https://images.pexels.com/photos/33803745/pexels-photo-33803745.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Darbhanga Ghat',
    hotelType: 'Luxury Hotel',
    priceMin: 12000,
    priceMax: 25000,
    rating: 4.9,
    amenities: ['River View', 'Fine Dining', 'Spa', 'Heritage Tours', 'Boat Rides', 'Butler Service', 'Yoga'],
    description: 'A restored 18th-century palace on the Ganges. Offers a royal experience with period furnishings, fine dining, and panoramic river views.',
    mapsUrl: 'https://maps.google.com/?q=Darbhanga+Ghat+Varanasi',
  },
];

const HOTEL_TYPES = ['All', 'Hostel', 'Guest House', 'Homestay', 'Budget Hotel', 'Mid-range Hotel', 'Luxury Hotel'];

const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under ₹2,000', value: '0-2000' },
  { label: '₹2,000 - ₹5,000', value: '2000-5000' },
  { label: '₹5,000 - ₹10,000', value: '5000-10000' },
  { label: '₹10,000+', value: '10000-999999' },
];

export default function HotelsPage() {
  const [search, setSearch] = useState('');
  const [hotelType, setHotelType] = useState('All');
  const [priceRange, setPriceRange] = useState('all');

  const filtered = useMemo(() => {
    return HOTELS.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase());
      const matchesType = hotelType === 'All' || h.hotelType === hotelType;
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        matchesPrice = h.priceMin >= min && h.priceMin < max;
      }
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [search, hotelType, priceRange]);

  return (
    <>
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/33803745/pexels-photo-33803745.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="container-wide relative z-10 text-center">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Hotels &amp; Stays in Varanasi
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
            From riverside heritage hotels to budget-friendly guest houses — find
            the perfect stay for your Varanasi trip.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search hotels or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={hotelType} onValueChange={setHotelType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {HOTEL_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_RANGES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">
            Showing {filtered.length} {filtered.length === 1 ? 'hotel' : 'hotels'}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((hotel, i) => (
              <div
                key={i}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute left-3 top-3 bg-primary/90 text-primary-foreground">
                    {hotel.hotelType}
                  </Badge>
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    {hotel.rating}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                    {hotel.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {hotel.location}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {hotel.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {hotel.amenities.slice(0, 4).map((a, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">
                        {a}
                      </Badge>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{hotel.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                  <div className="mt-5 border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Estimated starting price</p>
                        <p className="text-lg font-bold text-primary">
                          ₹{hotel.priceMin.toLocaleString('en-IN')}
                          <span className="text-sm font-normal text-muted-foreground"> /night</span>
                        </p>
                      </div>
                      <a href={hotel.mapsUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="gap-1">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Map
                        </Button>
                      </a>
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-xs text-warning">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Prices and availability should be confirmed before booking.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold">No hotels found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setHotelType('All');
                  setPriceRange('all');
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
