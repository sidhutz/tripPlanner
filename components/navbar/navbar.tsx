'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NAV_LINKS, SITE_CONFIG, telLink } from '@/lib/site-config';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/95 shadow-md backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <nav className="container-wide flex h-16 items-center justify-between lg:h-20">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <span
            className={cn(
              'text-xl font-bold tracking-tight transition-colors',
              scrolled ? 'text-foreground' : 'text-white'
            )}
          >
            Kashi<span className="text-primary">Yatra</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                scrolled
                  ? isActive(link.href)
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-foreground'
                  : isActive(link.href)
                    ? 'text-primary'
                    : 'text-white/80 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={telLink()}>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Phone className="h-4 w-4" />
              Call
            </Button>
          </a>
          <Link href="/plan-trip">
            <Button size="sm" className="gap-1.5">
              <Sparkles className="h-4 w-4" />
              Plan My Trip
            </Button>
          </Link>
        </div>

        <button
          className={cn(
            'lg:hidden',
            scrolled ? 'text-foreground' : 'text-white'
          )}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-wide flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-4 py-3 text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/plan-trip" className="mt-2">
              <Button className="w-full gap-1.5">
                <Sparkles className="h-4 w-4" />
                Plan My Trip
              </Button>
            </Link>
            <a href={telLink()} className="mt-1">
              <Button variant="outline" className="w-full gap-1.5">
                <Phone className="h-4 w-4" />
                {SITE_CONFIG.phone}
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
