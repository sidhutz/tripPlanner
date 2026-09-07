import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Heart, MapPin, Users, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Kashi Yatra — our mission, our local expertise, and why we are the trusted Varanasi travel planning partner.',
};

const ABOUT_IMAGE =
  'https://images.pexels.com/photos/8112524/pexels-photo-8112524.jpeg?auto=compress&cs=tinysrgb&w=1200';

const VALUES = [
  {
    icon: Heart,
    title: 'Local Expertise',
    description: 'Our team lives and breathes Varanasi. We know the best ghats, the quietest temples, and the most authentic food stalls.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Precision',
    description: 'We combine cutting-edge AI with our verified local database to create itineraries that are both smart and authentic.',
  },
  {
    icon: Award,
    title: 'Trusted Service',
    description: '2,000+ travellers have explored Varanasi with us. We are committed to honest pricing and genuine experiences.',
  },
  {
    icon: Users,
    title: 'Personal Support',
    description: 'From the first click to your last day in Varanasi, our team is available on WhatsApp, phone, and email.',
  },
];

const STATS = [
  { value: '2,000+', label: 'Happy Travellers' },
  { value: '50+', label: 'Curated Places' },
  { value: '4.9/5', label: 'Average Rating' },
  { value: '100%', label: 'Local Expertise' },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ABOUT_IMAGE})` }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="container-wide relative z-10 text-center">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            About Kashi Yatra
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
            We are a team of Varanasi locals and travel technologists on a mission
            to make the spiritual capital of India accessible, authentic, and
            unforgettable for every traveller.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Our Story
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Kashi Yatra was born from a simple observation: travellers from
                  around the world come to Varanasi seeking something profound,
                  but often leave feeling they only scratched the surface. The city
                  is overwhelming — a maze of alleys, ghats, temples, and traditions
                  that can take years to truly understand.
                </p>
                <p>
                  We grew up here. We know which ghat is best for sunrise, which
                  temple has the quietest morning hours, and where to find the
                  best malaiyya in winter. We decided to combine this deep local
                  knowledge with modern AI technology to help every traveller
                  experience the real Varanasi — not just the tourist version.
                </p>
                <p>
                  Our AI trip planner uses a verified database of places, hotels,
                  and activities — never inventing information. Every itinerary
                  is grounded in real, checked data, and backed by our local team
                  for any assistance you need.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="https://images.pexels.com/photos/39121732/pexels-photo-39121732.jpeg?auto=compress&cs=tinysrgb&w=1000"
                  alt="Varanasi ghats at sunset"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-card p-5 shadow-lg sm:block">
                <div className="flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Based in Varanasi</p>
                    <p className="text-xs text-muted-foreground">Assi Ghat, UP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20 lg:py-28">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              What Drives Us
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our core values shape every itinerary we create and every traveller we serve.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="font-display text-4xl font-bold text-primary">{s.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-secondary" />
        <div className="container-wide relative z-10 text-center">
          <h2 className="font-display text-3xl font-bold text-secondary-foreground sm:text-4xl">
            Let&apos;s Plan Your Varanasi Journey
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-secondary-foreground/70">
            Get a personalized itinerary from people who call Varanasi home.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/plan-trip">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Plan My Trip
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-secondary-foreground/30 bg-secondary-foreground/10 text-secondary-foreground hover:bg-secondary-foreground/20 hover:text-secondary-foreground"
              >
                Contact Us
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
