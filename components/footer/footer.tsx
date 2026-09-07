import Link from 'next/link';
import { Sparkles, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { SITE_CONFIG, NAV_LINKS, whatsappLink, telLink } from '@/lib/site-config';

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="container-wide py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Kashi<span className="text-primary">Yatra</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-secondary-foreground/70">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-foreground/10 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-foreground/10 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-foreground/10 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-foreground/90">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/70 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-foreground/90">
              Popular
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/places?category=Temples" className="text-sm text-secondary-foreground/70 transition-colors hover:text-primary">
                  Temples in Varanasi
                </Link>
              </li>
              <li>
                <Link href="/places?category=Ghats" className="text-sm text-secondary-foreground/70 transition-colors hover:text-primary">
                  Varanasi Ghats
                </Link>
              </li>
              <li>
                <Link href="/places?category=Food" className="text-sm text-secondary-foreground/70 transition-colors hover:text-primary">
                  Street Food
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-sm text-secondary-foreground/70 transition-colors hover:text-primary">
                  Hotels & Stays
                </Link>
              </li>
              <li>
                <Link href="/plan-trip" className="text-sm text-secondary-foreground/70 transition-colors hover:text-primary">
                  AI Trip Planner
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-foreground/90">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-secondary-foreground/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {SITE_CONFIG.address}
              </li>
              <li>
                <a href={telLink()} className="flex items-center gap-2.5 text-sm text-secondary-foreground/70 transition-colors hover:text-primary">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2.5 text-sm text-secondary-foreground/70 transition-colors hover:text-primary">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-secondary-foreground/10 pt-8 sm:flex-row">
          <p className="text-xs text-secondary-foreground/50">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-secondary-foreground/50 transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-secondary-foreground/50 transition-colors hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
