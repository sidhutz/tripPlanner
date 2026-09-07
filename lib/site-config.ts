export const SITE_CONFIG = {
  name: 'Kashi Yatra',
  tagline: 'AI-Powered Varanasi Trip Planner',
  description:
    'Plan your perfect Varanasi trip with AI. Personalized itineraries, hotel recommendations, cost estimates, and local expertise.',
  phone: '+91 90000 00000',
  whatsapp: '919000000000',
  email: 'hello@kashiyatra.travel',
  address: 'Assi Ghat, Varanasi, Uttar Pradesh 221005, India',
  whatsappMessage: 'Hello, I would like help planning my Varanasi trip.',
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
  },
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Places', href: '/places' },
  { label: 'Hotels', href: '/hotels' },
  { label: 'Plan Trip', href: '/plan-trip' },
  { label: 'Contact', href: '/contact' },
];

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(
    message || SITE_CONFIG.whatsappMessage
  );
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${text}`;
}

export function telLink() {
  return `tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`;
}
