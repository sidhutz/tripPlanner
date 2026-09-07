/**
 * Shared, framework-free validation + payload builders for the public forms.
 *
 * Kept separate from the route handlers so the same logic can be unit tested
 * in plain Node (no Next.js runtime needed) and reused if another entry point
 * ever needs it.
 */

export const INTEREST_KEYS = [
  "temples",
  "ghats",
  "ganga_aarti",
  "spirituality",
  "history",
  "culture",
  "food",
  "shopping",
  "photography",
  "family",
  "nightlife",
  "sarnath",
  "nearby_destinations",
] as const;

export type InterestKey = (typeof INTEREST_KEYS)[number];

/** Thrown for user-fixable input problems. The message is shown to the user. */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/** Trim a value to a string, or return null when it is empty/not a string. */
export function optionalText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** True only for a real calendar date in strict YYYY-MM-DD form. */
export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** Accepts numbers and numeric strings; rejects "", null, NaN and junk. */
function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export interface TripPayload {
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  arrival_date: string;
  departure_date: string;
  adults: number;
  children: number;
  budget: number | null;
  accommodation_preference: string;
  transport_preference: string;
  additional_requirements: string | null;
  preferences: Record<InterestKey, boolean>;
}

/**
 * Validate the plan-trip form body and shape it into the jsonb payload the
 * `submit_trip` Postgres function expects. Throws ValidationError on bad input.
 */
export function buildTripPayload(input: unknown): TripPayload {
  if (typeof input !== "object" || input === null) {
    throw new ValidationError("Invalid request body.");
  }
  const data = input as Record<string, unknown>;

  const name = optionalText(data.name, 120);
  const email = optionalText(data.email, 254)?.toLowerCase() ?? null;
  if (!name) throw new ValidationError("Please enter your name.");
  if (!email || !EMAIL_PATTERN.test(email)) {
    throw new ValidationError("Please enter a valid email address.");
  }

  if (!isIsoDate(data.arrival_date) || !isIsoDate(data.departure_date)) {
    throw new ValidationError("Please select valid arrival and departure dates.");
  }
  if (data.departure_date <= data.arrival_date) {
    throw new ValidationError("Departure date must be after arrival date.");
  }

  const adults = toNumber(data.adults);
  const children = data.children === "" || data.children == null ? 0 : toNumber(data.children);
  if (adults === null || !Number.isInteger(adults) || adults < 1 || adults > 100) {
    throw new ValidationError("Number of adults must be between 1 and 100.");
  }
  if (children === null || !Number.isInteger(children) || children < 0 || children > 100) {
    throw new ValidationError("Number of children must be between 0 and 100.");
  }

  let budget: number | null = null;
  if (data.budget !== "" && data.budget != null) {
    budget = toNumber(data.budget);
    if (budget === null || budget < 0 || budget > 100_000_000) {
      throw new ValidationError("Please enter a valid budget amount.");
    }
  }

  return {
    name,
    email,
    phone: optionalText(data.phone, 40),
    country: optionalText(data.country, 80),
    city: optionalText(data.city, 80),
    arrival_date: data.arrival_date,
    departure_date: data.departure_date,
    adults,
    children,
    budget,
    accommodation_preference: optionalText(data.accommodation_preference, 80) ?? "Hotel",
    transport_preference: optionalText(data.transport_preference, 80) ?? "Auto / Cab",
    additional_requirements: optionalText(data.additional_requirements, 2000),
    preferences: Object.fromEntries(
      INTEREST_KEYS.map((key) => [key, data[key] === true])
    ) as Record<InterestKey, boolean>,
  };
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
}

/** Validate the contact form body for the `submit_contact_message` function. */
export function buildContactPayload(input: unknown): ContactPayload {
  if (typeof input !== "object" || input === null) {
    throw new ValidationError("Invalid request body.");
  }
  const data = input as Record<string, unknown>;

  const name = optionalText(data.name, 120);
  const email = optionalText(data.email, 254)?.toLowerCase() ?? null;
  const message = optionalText(data.message, 4000);

  if (!name) throw new ValidationError("Please enter your name.");
  if (!email || !EMAIL_PATTERN.test(email)) {
    throw new ValidationError("Please enter a valid email address.");
  }
  if (!message) throw new ValidationError("Please enter a message.");

  return {
    name,
    email,
    message,
    phone: optionalText(data.phone, 40),
    subject: optionalText(data.subject, 200),
  };
}
