import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    rating: 5,
    text: 'The AI itinerary was incredibly accurate — it knew exactly how much time to spend at each ghat and even suggested the best chaat stalls. Our trip was seamless.',
    trip: '3 Days in Varanasi',
  },
  {
    name: 'James Wilson',
    location: 'London, UK',
    rating: 5,
    text: 'As a first-time visitor to India, I was nervous. The personalized plan made everything so easy — from hotel recommendations to transport options. Unforgettable experience.',
    trip: '5 Days Cultural Deep Dive',
  },
  {
    name: 'Anita Reddy',
    location: 'Bengaluru, India',
    rating: 5,
    text: 'The cost breakdown was spot on. We knew exactly what we were spending on hotels, food, and activities. The Ganga Aarti recommendation was the highlight.',
    trip: '2 Days Spiritual Weekend',
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-secondary py-20 lg:py-28">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-secondary-foreground sm:text-4xl lg:text-5xl">
            What Travellers Say
          </h2>
          <p className="mt-4 text-lg text-secondary-foreground/70">
            Real stories from travellers who explored Varanasi with Kashi Yatra.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border border-secondary-foreground/10 bg-secondary-foreground/5 p-6 backdrop-blur-sm"
            >
              <Quote className="h-8 w-8 text-primary/50" />
              <p className="mt-4 text-sm leading-relaxed text-secondary-foreground/80">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <div className="mt-4 border-t border-secondary-foreground/10 pt-4">
                <p className="font-semibold text-secondary-foreground">{t.name}</p>
                <p className="text-sm text-secondary-foreground/60">{t.location}</p>
                <p className="mt-1 text-xs text-primary">{t.trip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
