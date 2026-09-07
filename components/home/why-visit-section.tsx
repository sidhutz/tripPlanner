import { Flame, Waves, Sparkles, Utensils, Camera, ShoppingBag } from 'lucide-react';

const REASONS = [
  {
    icon: Flame,
    title: 'Spiritual Capital',
    description: 'The oldest living city in the world, where ancient rituals still breathe along the Ganges every dawn and dusk.',
  },
  {
    icon: Waves,
    title: 'The Ghats',
    description: 'Over 80 ghats line the river, each with its own story — from the fiery Manikarnika to the vibrant Dashashwamedh.',
  },
  {
    icon: Sparkles,
    title: 'Ganga Aarti',
    description: 'A mesmerizing ceremony of fire, lamps, and chants that draws visitors from every corner of the globe.',
  },
  {
    icon: Utensils,
    title: 'Street Food Paradise',
    description: 'From chaat at Kachori Gali to malaiyya at Godowlia — a culinary journey like no other.',
  },
  {
    icon: Camera,
    title: 'Photographer\'s Dream',
    description: 'Golden sunrises over the river, narrow alleys full of life, and silk weaving workshops frozen in time.',
  },
  {
    icon: ShoppingBag,
    title: 'Silk & Crafts',
    description: 'World-famous Banarasi silk sarees, handcrafted souvenirs, and bustling markets steeped in tradition.',
  },
];

export function WhyVisitSection() {
  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Why Visit Varanasi?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A city where life and death coexist, where every corner tells a story,
            and where the river holds a thousand prayers.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => (
            <div
              key={i}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <reason.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
