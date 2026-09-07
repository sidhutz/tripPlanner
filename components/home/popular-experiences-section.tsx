import { Ship, Flame, Utensils, Camera, Sunrise, ShoppingBag } from 'lucide-react';

const EXPERIENCES = [
  {
    icon: Sunrise,
    title: 'Sunrise Boat Ride',
    description: 'Glide along the Ganges as the city wakes up — golden light, seagulls, and ancient ghats.',
    image: 'https://images.pexels.com/photos/38857186/pexels-photo-38857186.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Flame,
    title: 'Ganga Aarti',
    description: 'Witness the spectacular fire ceremony at Dashashwamedh Ghat every evening at sunset.',
    image: 'https://images.pexels.com/photos/36613136/pexels-photo-36613136.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Utensils,
    title: 'Street Food Trail',
    description: 'Chaat, kachori, chena dahi vada, and the legendary malaiyya — a food lover\'s paradise.',
    image: 'https://images.pexels.com/photos/5321638/pexels-photo-5321638.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Ship,
    title: 'Rituals & Ceremonies',
    description: 'Participate in age-old rituals, from morning prayers to sacred dips in the Ganges.',
    image: 'https://images.pexels.com/photos/19272040/pexels-photo-19272040.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: ShoppingBag,
    title: 'Silk Weaving Tour',
    description: 'Visit traditional weaving workshops and shop for authentic Banarasi silk sarees.',
    image: 'https://images.pexels.com/photos/2477363/pexels-photo-2477363.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Camera,
    title: 'Photography Walk',
    description: 'Capture the soul of Varanasi — from narrow alleys to riverside ghats at golden hour.',
    image: 'https://images.pexels.com/photos/39121732/pexels-photo-39121732.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export function PopularExperiencesSection() {
  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Popular Experiences
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Curated experiences that capture the essence of Varanasi — from spiritual
            rituals to culinary adventures.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((exp, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <exp.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
