'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { SITE_CONFIG, whatsappLink, telLink } from '@/lib/site-config';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({
        title: 'Please fill in all required fields',
        description: 'Name, email, and message are required.',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not send your message. Please try again.');
      toast({ title: 'Message sent!', description: 'We will get back to you within 24 hours.' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast({ title: 'Message not sent', description: error instanceof Error ? error.message : 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/8112524/pexels-photo-8112524.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="container-wide relative z-10 text-center">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
            Have questions about your Varanasi trip? We are here to help — reach
            out through any of the channels below.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-4">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">WhatsApp</h3>
                  <p className="text-sm text-muted-foreground">Chat with us instantly</p>
                  <p className="mt-1 text-sm font-medium text-success">Send a message</p>
                </div>
              </a>

              <a
                href={telLink()}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-sm text-muted-foreground">Call us directly</p>
                  <p className="mt-1 text-sm font-medium text-primary">{SITE_CONFIG.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-muted-foreground">We reply within 24 hours</p>
                  <p className="mt-1 text-sm font-medium text-accent">{SITE_CONFIG.email}</p>
                </div>
              </a>

              <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Visit Us</h3>
                  <p className="text-sm text-muted-foreground">{SITE_CONFIG.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Hours</h3>
                  <p className="text-sm text-muted-foreground">Mon - Sun: 6 AM - 10 PM IST</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:p-8">
                <h2 className="font-display text-2xl font-bold">Send Us a Message</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill out the form below and our team will get back to you shortly.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone / WhatsApp</Label>
                      <Input
                        id="phone"
                        placeholder="+91 90000 00000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Trip enquiry"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your trip plans..."
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
                    {submitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
