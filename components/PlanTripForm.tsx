"use client";

import { useMemo, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";

const INTERESTS = [
  ["temples", "Temples"],
  ["ghats", "Ghats"],
  ["ganga_aarti", "Ganga Aarti"],
  ["spirituality", "Spirituality"],
  ["history", "History"],
  ["culture", "Culture"],
  ["food", "Food"],
  ["shopping", "Shopping"],
  ["photography", "Photography"],
  ["family", "Family"],
  ["nightlife", "Nightlife"],
  ["sarnath", "Sarnath"],
  ["nearby_destinations", "Nearby Destinations"],
] as const;

const ACCOMMODATION_OPTIONS = [
  "Hotel",
  "Budget Hotel",
  "Hostel",
  "Guest House",
  "Luxury Hotel",
  "Homestay",
] as const;

const TRANSPORT_OPTIONS = [
  "Auto / Cab",
  "Public Transport",
  "Rental Bike",
  "Private Cab",
  "Walking",
] as const;

/** All numeric inputs are kept as strings so the fields can be cleared. */
const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  arrival_date: "",
  departure_date: "",
  adults: "1",
  children: "0",
  budget: "",
  accommodation_preference: "Hotel" as string,
  transport_preference: "Auto / Cab" as string,
  additional_requirements: "",
  interests: {} as Record<string, boolean>,
};

type FormState = typeof INITIAL_FORM;

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30";

const isStaticSite = process.env.NEXT_PUBLIC_STATIC_SITE === "true";

/** Today in YYYY-MM-DD, used as the `min` for the date pickers. */
function todayIso() {
  const now = new Date();
  const offsetMs = now.getTime() - now.getTimezoneOffset() * 60_000;
  return new Date(offsetMs).toISOString().slice(0, 10);
}

export default function PlanTripForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const minDate = useMemo(todayIso, []);

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleInterest = (key: string, checked: boolean) =>
    setForm((prev) => ({
      ...prev,
      interests: { ...prev.interests, [key]: checked },
    }));

  /** Nights between the two dates, or null when the range is empty/invalid. */
  const numberOfDays = useMemo(() => {
    if (!form.arrival_date || !form.departure_date) return null;
    const arrival = Date.parse(`${form.arrival_date}T00:00:00Z`);
    const departure = Date.parse(`${form.departure_date}T00:00:00Z`);
    if (Number.isNaN(arrival) || Number.isNaN(departure)) return null;
    const days = Math.round((departure - arrival) / 86_400_000);
    return days > 0 ? days : null;
  }, [form.arrival_date, form.departure_date]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    // Client-side checks mirror the server so users get instant feedback.
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.email.trim()) return setError("Please enter your email.");
    if (!form.arrival_date || !form.departure_date) {
      return setError("Please select your arrival and departure dates.");
    }
    if (!numberOfDays) {
      return setError("Departure date must be after the arrival date.");
    }
    const adults = Number(form.adults);
    if (!Number.isInteger(adults) || adults < 1) {
      return setError("There must be at least one adult traveller.");
    }
    if (isStaticSite) {
      return setError(
        "Trip submissions are unavailable on this GitHub Pages preview. Please contact us by WhatsApp or email."
      );
    }

    setLoading(true);
    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          city: form.city,
          arrival_date: form.arrival_date,
          departure_date: form.departure_date,
          adults: form.adults,
          children: form.children === "" ? 0 : form.children,
          budget: form.budget,
          accommodation_preference: form.accommodation_preference,
          transport_preference: form.transport_preference,
          additional_requirements: form.additional_requirements,
          // Flatten interests to top-level booleans, as the API expects.
          ...Object.fromEntries(
            INTERESTS.map(([key]) => [key, form.interests[key] === true])
          ),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          result.error || "We could not save your trip. Please try again."
        );
      }

      setSuccess(
        "Your trip details have been saved. Our team will reach out to you shortly."
      );
      setForm(INITIAL_FORM);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Status messages are announced to screen readers. */}
      <div aria-live="polite">
        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-success">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------ traveller details */}
      <fieldset className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <legend className="px-2 font-display text-xl font-bold">
          Traveller Details
        </legend>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="trip-name" className="mb-2 block text-sm font-medium">
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              id="trip-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Your name"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="trip-email" className="mb-2 block text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              id="trip-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="you@example.com"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="trip-phone" className="mb-2 block text-sm font-medium">
              Phone / WhatsApp
            </label>
            <input
              id="trip-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="+91 90000 00000"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="trip-country" className="mb-2 block text-sm font-medium">
              Country
            </label>
            <input
              id="trip-country"
              type="text"
              autoComplete="country-name"
              value={form.country}
              onChange={(e) => setField("country", e.target.value)}
              placeholder="India"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="trip-city" className="mb-2 block text-sm font-medium">
              City
            </label>
            <input
              id="trip-city"
              type="text"
              autoComplete="address-level2"
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              placeholder="Delhi"
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {/* ----------------------------------------------------- trip details */}
      <fieldset className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <legend className="px-2 font-display text-xl font-bold">Trip Details</legend>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="trip-arrival" className="mb-2 block text-sm font-medium">
              Arrival Date <span className="text-destructive">*</span>
            </label>
            <input
              id="trip-arrival"
              type="date"
              min={minDate}
              value={form.arrival_date}
              onChange={(e) => setField("arrival_date", e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="trip-departure" className="mb-2 block text-sm font-medium">
              Departure Date <span className="text-destructive">*</span>
            </label>
            <input
              id="trip-departure"
              type="date"
              min={form.arrival_date || minDate}
              value={form.departure_date}
              onChange={(e) => setField("departure_date", e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {numberOfDays && (
            <p className="rounded-lg bg-primary/10 p-4 text-sm text-primary md:col-span-2">
              Planning a <strong>{numberOfDays}-day</strong> trip to Varanasi.
            </p>
          )}

          <div>
            <label htmlFor="trip-adults" className="mb-2 block text-sm font-medium">
              Adults
            </label>
            <input
              id="trip-adults"
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={form.adults}
              onChange={(e) => setField("adults", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="trip-children" className="mb-2 block text-sm font-medium">
              Children
            </label>
            <input
              id="trip-children"
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              value={form.children}
              onChange={(e) => setField("children", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="trip-budget" className="mb-2 block text-sm font-medium">
              Approximate Budget (INR)
            </label>
            <input
              id="trip-budget"
              type="number"
              inputMode="numeric"
              min={0}
              value={form.budget}
              onChange={(e) => setField("budget", e.target.value)}
              placeholder="30000"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="trip-accommodation"
              className="mb-2 block text-sm font-medium"
            >
              Accommodation
            </label>
            <select
              id="trip-accommodation"
              value={form.accommodation_preference}
              onChange={(e) => setField("accommodation_preference", e.target.value)}
              className={inputClass}
            >
              {ACCOMMODATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="trip-transport" className="mb-2 block text-sm font-medium">
              Transport
            </label>
            <select
              id="trip-transport"
              value={form.transport_preference}
              onChange={(e) => setField("transport_preference", e.target.value)}
              className={inputClass}
            >
              {TRANSPORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Prices, timings and availability change often. Please verify current
          details before you travel.
        </p>
      </fieldset>

      {/* -------------------------------------------------------- interests */}
      <fieldset className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <legend className="px-2 font-display text-xl font-bold">
          What are you interested in?
        </legend>
        <p className="mt-2 text-sm text-muted-foreground">
          Select everything you would like to experience.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {INTERESTS.map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <input
                type="checkbox"
                checked={form.interests[key] === true}
                onChange={(e) => toggleInterest(key, e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* ------------------------------------------ additional requirements */}
      <fieldset className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <legend className="px-2 font-display text-xl font-bold">
          Additional Requirements
        </legend>
        <label htmlFor="trip-notes" className="sr-only">
          Additional requirements
        </label>
        <textarea
          id="trip-notes"
          value={form.additional_requirements}
          onChange={(e) => setField("additional_requirements", e.target.value)}
          placeholder="Dietary needs, accessibility, guide language, anything else..."
          rows={5}
          maxLength={2000}
          className={`mt-4 ${inputClass}`}
        />
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Saving your trip...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" aria-hidden="true" />
            Plan My Varanasi Trip
          </>
        )}
      </button>
    </form>
  );
}
