# Kashi Yatra — AI-Powered Varanasi Trip Planner

A production-ready travel planning platform that helps tourists plan personalized trips to Varanasi using AI-generated itineraries, verified place and hotel databases, cost estimates, and local expertise.

## Overview

Kashi Yatra is built around a single core flow:

**Traveller → Smart Form → Database → AI → Personalized Itinerary → Hotel/Place Recommendations → Cost Estimate → Contact/Lead → Automated Follow-up → Admin Dashboard**

The platform is designed to scale beyond Varanasi to other Indian destinations (Ayodhya, Prayagraj, Agra, Jaipur, etc.) with a future-friendly `destinations` table architecture.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 13, React, TypeScript, Tailwind CSS, shadcn/ui |
| Icons | Lucide React |
| Forms | React Hook Form, Zod validation |
| Database | Supabase (PostgreSQL), Row Level Security |
| AI | OpenAI API (structured JSON output) |
| Automation | n8n (webhooks, email, lead follow-up) |
| Maps | Google Maps JavaScript API |
| Email | Resend (or similar transactional provider) |
| Hosting | Vercel (frontend), Supabase (database), n8n Cloud (automation) |

## Current Status

### Phase 1 — Foundation (Complete)

- [x] Design system with Varanasi-inspired warm palette (saffron, maroon, Ganges teal)
- [x] Inter + Playfair Display typography
- [x] Sticky responsive navbar with scroll-aware styling
- [x] Rich footer with contact info and social links
- [x] Homepage with all 11 sections:
  - Hero with CTA buttons
  - "Plan Your Varanasi Trip with AI" (how it works)
  - Why Visit Varanasi
  - Popular attractions
  - Popular experiences
  - Featured travel packages
  - Testimonials
  - FAQ
  - Final call-to-action
- [x] About page (company story, values, stats)
- [x] Places page (12 attractions, searchable, filterable by category)
- [x] Hotels page (8 stays, filterable by type and price, honest pricing labels)
- [x] Plan Trip page (placeholder for multi-step form)
- [x] Contact page (WhatsApp, phone, email, enquiry form)
- [x] SEO: metadata, Open Graph, sitemap, robots.txt
- [x] Shared TypeScript types for full data model
- [x] Site configuration (contact details, navigation, WhatsApp links)

### Upcoming Phases

| Phase | Description | Status |
|-------|------------|--------|
| Phase 2 | Supabase schema, migrations, RLS policies, seed data | Pending |
| Phase 3 | Multi-step travel planner form with validation | Pending |
| Phase 4 | Seed Varanasi places and hotels in database | Pending |
| Phase 5 | AI itinerary engine (OpenAI, structured output) | Pending |
| Phase 6 | Personalized trip result page (`/trip/[tripId]`) | Pending |
| Phase 7 | n8n automation (trip generation, email, leads, follow-up) | Pending |
| Phase 8 | Admin dashboard (leads, travellers, trips, analytics) | Pending |
| Phase 9 | Production hardening (security, performance, deployment) | Pending |

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout (navbar, footer, fonts, metadata)
│   ├── page.tsx                # Homepage (composes all home sections)
│   ├── globals.css             # Design tokens, color system, utilities
│   ├── sitemap.ts              # SEO sitemap
│   ├── robots.ts               # SEO robots.txt
│   ├── about/page.tsx          # About page
│   ├── contact/page.tsx        # Contact page with enquiry form
│   ├── hotels/page.tsx         # Hotels listing with filters
│   ├── places/page.tsx         # Places listing with search/filters
│   └── plan-trip/page.tsx      # Trip planner (placeholder)
│
├── components/
│   ├── ui/                     # shadcn/ui component library (46 components)
│   ├── navbar/                 # Sticky responsive navbar
│   ├── footer/                 # Site footer
│   └── home/                   # Homepage section components
│       ├── hero-section.tsx
│       ├── plan-trip-section.tsx
│       ├── why-visit-section.tsx
│       ├── popular-places-section.tsx
│       ├── popular-experiences-section.tsx
│       ├── featured-packages-section.tsx
│       ├── testimonials-section.tsx
│       ├── faq-section.tsx
│       └── cta-section.tsx
│
├── hooks/
│   └── use-toast.ts            # Toast notification hook
│
├── lib/
│   ├── utils.ts                # cn() utility (clsx + tailwind-merge)
│   └── site-config.ts          # Site name, contact, nav links, WhatsApp helper
│
└── types/
    └── index.ts                 # Shared TypeScript types (full data model)
```

## Database Schema (Planned — Phase 2)

| Table | Purpose |
|-------|---------|
| `destinations` | Future-proofing for other cities beyond Varanasi |
| `travellers` | Visitor contact details |
| `trips` | Trip details (dates, group size, budget, preferences) |
| `preferences` | Interest flags per trip (temples, ghats, food, etc.) |
| `places` | Verified Varanasi attractions with maps links |
| `hotels` | Verified accommodation options with price ranges |
| `itineraries` | AI-generated day-by-day plans with cost breakdowns |
| `leads` | Lead management with status pipeline |
| `notifications` | Notification history |
| `automation_logs` | n8n/automation event and error logs |

All tables will have Row Level Security enabled with per-CRUD policies.

## Environment Variables

The following variables will be required as the project progresses through phases:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# AI
OPENAI_API_KEY=...

# Email
RESEND_API_KEY=...

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...

# n8n
N8N_WEBHOOK_URL=...
N8N_API_KEY=...

# WhatsApp
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...
```

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run typecheck
```

The dev server runs at `http://localhost:3000`.

## Design System

### Color Palette

| Token | Description | Light Mode | Dark Mode |
|-------|------------|------------|-----------|
| `primary` | Saffron | `hsl(32, 85%, 52%)` | `hsl(32, 85%, 55%)` |
| `secondary` | Deep maroon | `hsl(355, 48%, 24%)` | `hsl(355, 40%, 30%)` |
| `accent` | Ganges teal | `hsl(174, 55%, 37%)` | `hsl(174, 45%, 40%)` |
| `background` | Warm cream | `hsl(40, 50%, 98%)` | `hsl(20, 20%, 8%)` |
| `success` | Green | `hsl(142, 60%, 38%)` | `hsl(142, 55%, 42%)` |
| `warning` | Amber | `hsl(38, 92%, 50%)` | `hsl(38, 92%, 52%)` |
| `destructive` | Red | `hsl(0, 72%, 51%)` | `hsl(0, 62%, 45%)` |

### Typography

- **Body:** Inter (sans-serif)
- **Headings:** Playfair Display (serif, display)
- **Line spacing:** 150% body, 120% headings
- **Weights:** 400 (regular), 600 (semibold), 700 (bold)

### Spacing

8px spacing system throughout, with consistent alignment and visual balance.

## Key Design Decisions

1. **No fabricated data** — Hotel prices are labeled "Estimated starting price" with a disclaimer to confirm before booking
2. **Future-proof architecture** — `destinations` table allows scaling to other cities without schema changes
3. **AI safety** — The AI engine will only use verified database information, never inventing places, prices, or availability
4. **Mobile-first** — The travel planner form is specifically optimized for mobile users
5. **Progressive disclosure** — Multi-step form reveals information contextually rather than overwhelming users

## License

Proprietary — All rights reserved.
