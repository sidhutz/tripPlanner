/**
 * Local stand-in for the Supabase REST layer, used to test the API routes
 * without touching the real project.
 *
 * It implements the two RPC endpoints the app calls and mirrors the semantics
 * of the SQL in supabase/migrations/202609050001_submit_trip.sql: the same
 * jsonb keys, the same NOT NULL / CHECK constraints, and the same derived
 * columns (number_of_days, total_travellers).
 *
 * Usage:
 *   node scripts/mock-supabase.mjs [port]
 *
 * Inspect what was "inserted" via GET /_state
 */

import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const port = Number(process.argv[2]) || 54321;

const db = { travellers: [], trips: [], preferences: [], contact_messages: [] };

const INTEREST_COLUMNS = [
  "temples", "ghats", "ganga_aarti", "spirituality", "history", "culture",
  "food", "shopping", "photography", "family", "nightlife", "sarnath",
  "nearby_destinations",
];

/** Postgres-style error the supabase-js client will surface as `error`. */
class PgError extends Error {
  constructor(message, code = "P0001") {
    super(message);
    this.code = code;
  }
}

const notBlank = (value) =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : null;

function parseDate(value, column) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new PgError(`invalid input syntax for type date: "${value}" (${column})`, "22007");
  }
  const ms = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(ms)) {
    throw new PgError(`date/time field value out of range: "${value}"`, "22008");
  }
  return ms;
}

/** Mirrors public.submit_trip(payload jsonb). */
function submitTrip(payload) {
  const name = notBlank(payload?.name);
  const email = notBlank(payload?.email);
  if (!name) throw new PgError("name is required");
  if (!email) throw new PgError("email is required");

  const arrivalMs = parseDate(payload.arrival_date, "arrival_date");
  const departureMs = parseDate(payload.departure_date, "departure_date");
  if (departureMs <= arrivalMs) {
    throw new PgError("departure_date must be after arrival_date");
  }

  const adults = payload.adults == null ? 1 : Number(payload.adults);
  const children = payload.children == null ? 0 : Number(payload.children);
  if (!Number.isInteger(adults)) throw new PgError("invalid integer: adults", "22P02");
  if (!Number.isInteger(children)) throw new PgError("invalid integer: children", "22P02");
  if (adults <= 0) throw new PgError('violates check constraint "trips_adults_check"', "23514");
  if (children < 0) throw new PgError('violates check constraint "trips_children_check"', "23514");

  let budget = null;
  if (payload.budget !== "" && payload.budget != null) {
    budget = Number(payload.budget);
    if (!Number.isFinite(budget)) throw new PgError("invalid numeric: budget", "22P02");
    if (budget < 0) throw new PgError('violates check constraint "trips_budget_check"', "23514");
  }

  const travellerId = randomUUID();
  const tripId = randomUUID();
  const now = new Date().toISOString();
  const prefs = payload.preferences ?? {};

  db.travellers.push({
    id: travellerId, name, email: email.toLowerCase(),
    phone: notBlank(payload.phone), country: notBlank(payload.country),
    city: notBlank(payload.city), created_at: now, updated_at: now,
  });

  db.trips.push({
    id: tripId,
    traveller_id: travellerId,
    arrival_date: payload.arrival_date,
    departure_date: payload.departure_date,
    number_of_days: Math.round((departureMs - arrivalMs) / 86_400_000),
    adults,
    children,
    total_travellers: adults + children,
    budget,
    currency: "INR",
    accommodation_preference: notBlank(payload.accommodation_preference) ?? "Hotel",
    transport_preference: notBlank(payload.transport_preference) ?? "Auto / Cab",
    additional_requirements: notBlank(payload.additional_requirements),
    status: "new",
    created_at: now,
    updated_at: now,
  });

  db.preferences.push({
    id: randomUUID(),
    trip_id: tripId,
    ...Object.fromEntries(INTEREST_COLUMNS.map((c) => [c, prefs[c] === true])),
    created_at: now,
  });

  return tripId;
}

/** Mirrors public.submit_contact_message(payload jsonb). */
function submitContactMessage(payload) {
  const name = notBlank(payload?.name);
  const email = notBlank(payload?.email);
  const message = notBlank(payload?.message);
  if (!name) throw new PgError("name is required");
  if (!email) throw new PgError("email is required");
  if (!message) throw new PgError("message is required");

  const id = randomUUID();
  db.contact_messages.push({
    id, name, email: email.toLowerCase(),
    phone: notBlank(payload.phone), subject: notBlank(payload.subject),
    message, created_at: new Date().toISOString(),
  });
  return id;
}

const RPC = { submit_trip: submitTrip, submit_contact_message: submitContactMessage };

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${port}`);
  const send = (status, body) => {
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify(body));
  };

  if (request.method === "GET" && url.pathname === "/_state") {
    return send(200, db);
  }
  if (request.method === "POST" && url.pathname === "/_reset") {
    for (const key of Object.keys(db)) db[key] = [];
    return send(200, { ok: true });
  }

  // Supabase requires an apikey on every request.
  if (!request.headers.apikey) {
    return send(401, { message: "No API key found in request" });
  }

  const rpcMatch = url.pathname.match(/^\/rest\/v1\/rpc\/(.+)$/);
  if (request.method === "POST" && rpcMatch) {
    const fn = RPC[rpcMatch[1]];
    if (!fn) {
      return send(404, {
        code: "PGRST202",
        message: `Could not find the function public.${rpcMatch[1]} in the schema cache`,
      });
    }
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    let body;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
    } catch {
      return send(400, { code: "PGRST102", message: "Invalid JSON body" });
    }
    try {
      return send(200, fn(body.payload));
    } catch (error) {
      return send(400, {
        code: error.code ?? "P0001",
        message: error.message,
        details: null,
        hint: null,
      });
    }
  }

  // Anything else: mimic RLS blocking direct table access (empty result).
  if (request.method === "GET" && url.pathname.startsWith("/rest/v1/")) {
    return send(200, []);
  }

  send(404, { message: "Not found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`mock supabase listening on http://127.0.0.1:${port}`);
});
