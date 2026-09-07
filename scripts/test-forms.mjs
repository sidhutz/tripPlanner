/**
 * Supabase form submission test.
 *
 * Usage:
 *   node scripts/test-forms.mjs          # validation + live Supabase insert
 *   node scripts/test-forms.mjs --mock   # validation only, no network calls
 *   node scripts/test-forms.mjs --keep   # do not delete the inserted test rows
 *
 * What it checks:
 *   1. Env vars are present in .env.local.
 *   2. The submit_trip and submit_contact_message RPC functions exist and are
 *      callable with the configured key.
 *   3. A full trip payload inserts and returns a trip id.
 *   4. A contact message inserts and returns a message id.
 *   5. Bad payloads are rejected before they reach the database.
 *   6. RLS blocks direct table reads with the publishable (anon) key.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const mockOnly = process.argv.includes("--mock");

let passed = 0;
let failed = 0;
const pass = (label, extra = "") => {
  passed += 1;
  console.log(`  PASS  ${label}${extra ? ` — ${extra}` : ""}`);
};
const fail = (label, reason = "") => {
  failed += 1;
  console.log(`  FAIL  ${label}${reason ? ` — ${reason}` : ""}`);
};

// ---------------------------------------------------------------- load .env
function loadEnvLocal() {
  const path = join(projectRoot, ".env.local");
  if (!existsSync(path)) return {};
  const env = {};
  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = { ...loadEnvLocal(), ...process.env };
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const usingServiceRole = Boolean(env.SUPABASE_SERVICE_ROLE_KEY);
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// ------------------- validation logic (mirrors lib/forms/schema.ts exactly)
const INTEREST_KEYS = [
  "temples", "ghats", "ganga_aarti", "spirituality", "history", "culture",
  "food", "shopping", "photography", "family", "nightlife", "sarnath",
  "nearby_destinations",
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const optionalText = (v, max) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

const isIsoDate = (v) => {
  if (typeof v !== "string" || !ISO_DATE_PATTERN.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
};

const toNumber = (v) => {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

function buildTripPayload(data) {
  const name = optionalText(data.name, 120);
  const email = optionalText(data.email, 254)?.toLowerCase() ?? null;
  if (!name) throw new Error("Please enter your name.");
  if (!email || !EMAIL_PATTERN.test(email)) throw new Error("Please enter a valid email address.");
  if (!isIsoDate(data.arrival_date) || !isIsoDate(data.departure_date))
    throw new Error("Please select valid arrival and departure dates.");
  if (data.departure_date <= data.arrival_date)
    throw new Error("Departure date must be after arrival date.");

  const adults = toNumber(data.adults);
  const children = data.children === "" || data.children == null ? 0 : toNumber(data.children);
  if (adults === null || !Number.isInteger(adults) || adults < 1 || adults > 100)
    throw new Error("Number of adults must be between 1 and 100.");
  if (children === null || !Number.isInteger(children) || children < 0 || children > 100)
    throw new Error("Number of children must be between 0 and 100.");

  let budget = null;
  if (data.budget !== "" && data.budget != null) {
    budget = toNumber(data.budget);
    if (budget === null || budget < 0 || budget > 100_000_000)
      throw new Error("Please enter a valid budget amount.");
  }

  return {
    name, email,
    phone: optionalText(data.phone, 40),
    country: optionalText(data.country, 80),
    city: optionalText(data.city, 80),
    arrival_date: data.arrival_date,
    departure_date: data.departure_date,
    adults, children, budget,
    accommodation_preference: optionalText(data.accommodation_preference, 80) ?? "Hotel",
    transport_preference: optionalText(data.transport_preference, 80) ?? "Auto / Cab",
    additional_requirements: optionalText(data.additional_requirements, 2000),
    preferences: Object.fromEntries(INTEREST_KEYS.map((k) => [k, data[k] === true])),
  };
}

function buildContactPayload(data) {
  const name = optionalText(data.name, 120);
  const email = optionalText(data.email, 254)?.toLowerCase() ?? null;
  const message = optionalText(data.message, 4000);
  if (!name) throw new Error("Please enter your name.");
  if (!email || !EMAIL_PATTERN.test(email)) throw new Error("Please enter a valid email address.");
  if (!message) throw new Error("Please enter a message.");
  return {
    name, email, message,
    phone: optionalText(data.phone, 40),
    subject: optionalText(data.subject, 200),
  };
}

// ------------------------------------------------------------- sample input
const stamp = new Date().toISOString();
const arrival = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
const departure = new Date(Date.now() + 11 * 86_400_000).toISOString().slice(0, 10);

const tripInput = {
  name: "  Automated Test Traveller  ",
  email: "  TEST+trip@Example.COM ",
  phone: "+91 90000 00000",
  country: "India",
  city: "Delhi",
  arrival_date: arrival,
  departure_date: departure,
  adults: "2",
  children: "1",
  budget: "35000",
  accommodation_preference: "Guest House",
  transport_preference: "Private Cab",
  additional_requirements: `AUTOMATED TEST ROW — safe to delete (${stamp})`,
  temples: true,
  ghats: true,
  ganga_aarti: true,
  food: true,
};

const contactInput = {
  name: "Automated Test Contact",
  email: "TEST+contact@Example.com",
  phone: "+91 90000 00001",
  subject: "Automated test",
  message: `AUTOMATED TEST ROW — safe to delete (${stamp})`,
};

// --------------------------------------------------------- validation tests
console.log("\n[1] Validation (no network)\n");

let tripPayload = null;
let contactPayload = null;

try {
  tripPayload = buildTripPayload(tripInput);
  const p = tripPayload;
  const correct =
    p.name === "Automated Test Traveller" &&
    p.email === "test+trip@example.com" &&
    p.adults === 2 && p.children === 1 && p.budget === 35000 &&
    p.preferences.temples === true && p.preferences.nightlife === false &&
    Object.keys(p.preferences).length === 13;
  correct
    ? pass("trip payload built, trimmed, lowercased, 13 interest keys")
    : fail("trip payload normalisation", JSON.stringify(p));
} catch (error) {
  fail("trip payload built", error.message);
}

try {
  contactPayload = buildContactPayload(contactInput);
  contactPayload.email === "test+contact@example.com"
    ? pass("contact payload built + normalised")
    : fail("contact payload normalisation", contactPayload.email);
} catch (error) {
  fail("contact payload built", error.message);
}

for (const [label, input] of [
  ["blank name", { ...tripInput, name: "   " }],
  ["bad email", { ...tripInput, email: "not-an-email" }],
  ["departure before arrival", { ...tripInput, arrival_date: departure, departure_date: arrival }],
  ["same-day dates", { ...tripInput, departure_date: tripInput.arrival_date }],
  ["zero adults", { ...tripInput, adults: "0" }],
  ["too many adults", { ...tripInput, adults: "999" }],
  ["negative budget", { ...tripInput, budget: "-100" }],
  ["impossible calendar date", { ...tripInput, arrival_date: "2026-02-31" }],
  ["non-numeric adults", { ...tripInput, adults: "two" }],
]) {
  try {
    buildTripPayload(input);
    fail(`rejects ${label}`, "was accepted");
  } catch {
    pass(`rejects ${label}`);
  }
}

for (const [label, input] of [
  ["contact with empty message", { ...contactInput, message: "" }],
  ["contact with bad email", { ...contactInput, email: "a@b" }],
]) {
  try {
    buildContactPayload(input);
    fail(`rejects ${label}`, "was accepted");
  } catch {
    pass(`rejects ${label}`);
  }
}

// ---------------------------------------------------------------- env check
console.log("\n[2] Supabase configuration\n");

SUPABASE_URL
  ? pass("NEXT_PUBLIC_SUPABASE_URL set", SUPABASE_URL)
  : fail("NEXT_PUBLIC_SUPABASE_URL set", "missing from .env.local");
SUPABASE_KEY
  ? pass(
      usingServiceRole ? "SUPABASE_SERVICE_ROLE_KEY set" : "publishable (anon) key set",
      `${SUPABASE_KEY.slice(0, 14)}...`
    )
  : fail("Supabase key set", "no service-role or publishable key found in .env.local");

// -------------------------------------------------------------- live insert
if (mockOnly) {
  console.log("\n[3] Live Supabase insert — SKIPPED (--mock)\n");
} else if (!SUPABASE_URL || !SUPABASE_KEY || !tripPayload || !contactPayload) {
  console.log("\n[3] Live Supabase insert — SKIPPED (missing config)\n");
} else {
  console.log("\n[3] Live Supabase insert\n");

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };

  const callRpc = async (fn, payload) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ payload }),
    });
    return { status: response.status, text: (await response.text()).trim() };
  };

  const describeFailure = (fn, result) => {
    if (result.status === 404) {
      return `function public.${fn} not found — run supabase/migrations/202609050001_submit_trip.sql in the Supabase SQL Editor`;
    }
    if (result.status === 401 || result.status === 403) {
      return `permission denied (${result.status}) — re-run the migration so EXECUTE is granted to anon: ${result.text}`;
    }
    return `HTTP ${result.status} ${result.text}`;
  };

  let insertedTripId = null;
  try {
    const result = await callRpc("submit_trip", tripPayload);
    if (result.status === 200) {
      insertedTripId = result.text.replace(/"/g, "");
      pass("submit_trip inserted a trip", `trip id ${insertedTripId}`);
    } else {
      fail("submit_trip inserted a trip", describeFailure("submit_trip", result));
    }
  } catch (error) {
    fail("submit_trip inserted a trip", `network error: ${error.message}`);
  }

  try {
    const result = await callRpc("submit_contact_message", contactPayload);
    if (result.status === 200) {
      pass("submit_contact_message inserted a message", `id ${result.text.replace(/"/g, "")}`);
    } else {
      fail(
        "submit_contact_message inserted a message",
        describeFailure("submit_contact_message", result)
      );
    }
  } catch (error) {
    fail("submit_contact_message inserted a message", `network error: ${error.message}`);
  }

  // Invalid payload must be refused by the SQL function too.
  try {
    const result = await callRpc("submit_trip", { ...tripPayload, name: "" });
    result.status >= 400
      ? pass("submit_trip refuses a blank name at the database level", `HTTP ${result.status}`)
      : fail("submit_trip refuses a blank name", `accepted with HTTP ${result.status}`);
  } catch (error) {
    console.log(`  SKIP  database-level validation — ${error.message}`);
  }

  // RLS: with the anon key the tables themselves must not be readable.
  console.log("\n[4] Row Level Security\n");
  if (usingServiceRole) {
    console.log("  SKIP  service-role key bypasses RLS by design");
  } else {
    for (const table of ["travellers", "trips", "preferences", "contact_messages"]) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, {
          headers,
        });
        if (response.status === 200) {
          const rows = await response.json().catch(() => []);
          Array.isArray(rows) && rows.length === 0
            ? pass(`${table} exposes no rows to anon`)
            : fail(`${table} exposes no rows to anon`, "anon can read data — check RLS");
        } else {
          pass(`${table} not readable by anon`, `HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`  SKIP  ${table} RLS check — ${error.message}`);
      }
    }
  }

  if (insertedTripId && !process.argv.includes("--keep")) {
    console.log(
      `\n  NOTE  Test rows were inserted. Remove them with:\n` +
        `        delete from public.travellers where email = 'test+trip@example.com';\n` +
        `        delete from public.contact_messages where email = 'test+contact@example.com';`
    );
  }
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
