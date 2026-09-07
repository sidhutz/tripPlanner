/**
 * Tests the live API routes through a running Next.js server.
 *
 * Start the dev server first, then run this in a second terminal:
 *   npm run dev
 *   npm run test:api
 *
 * Options:
 *   --base=http://localhost:3000   server to test (default)
 *   --mock                         point the routes at scripts/mock-supabase.mjs
 *                                  instead of the real project (see README)
 *
 * Unlike test-forms.mjs (which calls Supabase directly), this exercises the
 * real request path: browser fetch -> Next.js route handler -> Supabase.
 */

const baseArg = process.argv.find((a) => a.startsWith("--base="));
const BASE = baseArg ? baseArg.split("=")[1] : "http://localhost:3000";

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

const post = async (path, body) => {
  const response = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await response.json().catch(() => ({}));
  return { status: response.status, json, headers: response.headers };
};

const stamp = new Date().toISOString();
const arrival = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
const departure = new Date(Date.now() + 11 * 86_400_000).toISOString().slice(0, 10);

const goodTrip = {
  name: "  API Test Traveller  ",
  email: " TEST+api@Example.COM ",
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
  additional_requirements: `AUTOMATED API TEST — safe to delete (${stamp})`,
  temples: true,
  ghats: true,
  ganga_aarti: true,
  food: true,
};

console.log(`\nTesting ${BASE}\n`);

// Confirm the server is up before running anything else.
try {
  const response = await fetch(BASE, { method: "GET" });
  pass("server reachable", `HTTP ${response.status}`);
} catch (error) {
  console.log(`  FAIL  server reachable — ${error.message}`);
  console.log("\nStart the dev server first:  npm run dev\n");
  process.exit(1);
}

console.log("\n[1] POST /api/trips — valid submission\n");
{
  const result = await post("/api/trips", goodTrip);
  if (result.status === 201 && result.json.ok) {
    pass("trip accepted and saved", `trip id ${result.json.tripId ?? "(none returned)"}`);
  } else if (result.status === 503) {
    fail("trip accepted and saved", `not configured: ${result.json.error} — check .env.local`);
  } else if (result.status === 502) {
    fail(
      "trip accepted and saved",
      "Supabase rejected the write — run the migration SQL, then check the dev server console for the exact Postgres error"
    );
  } else {
    fail("trip accepted and saved", `HTTP ${result.status} ${JSON.stringify(result.json)}`);
  }
}

console.log("\n[2] POST /api/trips — invalid submissions must be rejected\n");
for (const [label, body] of [
  ["blank name", { ...goodTrip, name: "   " }],
  ["invalid email", { ...goodTrip, email: "nope" }],
  ["departure before arrival", { ...goodTrip, arrival_date: departure, departure_date: arrival }],
  ["zero adults", { ...goodTrip, adults: "0" }],
  ["negative budget", { ...goodTrip, budget: "-500" }],
  ["empty body", {}],
]) {
  const result = await post("/api/trips", body);
  result.status === 400 && result.json.error
    ? pass(`400 for ${label}`, result.json.error)
    : fail(`400 for ${label}`, `HTTP ${result.status} ${JSON.stringify(result.json)}`);
}

console.log("\n[3] POST /api/contact\n");
{
  const result = await post("/api/contact", {
    name: "API Test Contact",
    email: "TEST+apicontact@Example.com",
    phone: "+91 90000 00001",
    subject: "Automated API test",
    message: `AUTOMATED API TEST — safe to delete (${stamp})`,
  });
  result.status === 201 && result.json.ok
    ? pass("contact message accepted and saved", `id ${result.json.messageId ?? "(none)"}`)
    : fail("contact message accepted and saved", `HTTP ${result.status} ${JSON.stringify(result.json)}`);

  const bad = await post("/api/contact", { name: "x", email: "x@y.com", message: "" });
  bad.status === 400
    ? pass("400 for empty message")
    : fail("400 for empty message", `HTTP ${bad.status}`);
}

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed === 0) {
  console.log("Check the data in Supabase -> Table Editor -> travellers / trips / preferences / contact_messages\n");
}
process.exit(failed > 0 ? 1 : 0);
