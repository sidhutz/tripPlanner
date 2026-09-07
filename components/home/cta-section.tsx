import Link from 'next/link';
import { Sparkles, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { whatsappLink, telLink } from '@/lib/site-config';

const CTA_IMAGE =
  'https://images.pexels.com/photos/39256046/pexels-photo-39256046.jpeg?auto=compress&cs=tinysrgb&w=1920';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${CTA_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-secondary/80" />

      <div className="container-wide relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-secondary-foreground sm:text-4xl lg:text-5xl">
            Ready to Experience Varanasi?
          </h2>
          <p className="mt-4 text-lg text-secondary-foreground/80">
            Get your personalized AI-crafted itinerary in minutes. It&apos;s free,
            tailored to you, and backed by local expertise.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/plan-trip">
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                <Sparkles className="h-5 w-5" />
                Plan My Trip Now
              </Button>
            </Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 border-secondary-foreground/30 bg-secondary-foreground/10 text-secondary-foreground backdrop-blur-sm hover:bg-secondary-foreground/20 hover:text-secondary-foreground sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us
              </Button>
            </a>
          </div>

          <div className="mt-6">
            <a href={telLink()}>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-foreground/70 hover:text-primary">
                <Phone className="h-4 w-4" />
                Or call us at +91 90000 00000
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
