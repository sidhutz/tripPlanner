import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { buildTripPayload, ValidationError } from "@/lib/forms/schema";

// Supabase writes must happen on the server at request time.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabaseResult = getSupabaseServerClient();
  if (!supabaseResult.ok) {
    console.error("Trip submission not configured:", supabaseResult.reason);
    return NextResponse.json(
      { error: "Trip submission is not configured yet. Please contact us directly." },
      { status: 503 }
    );
  }

  let payload;
  try {
    payload = buildTripPayload(await request.json());
  } catch (error) {
    const message =
      error instanceof ValidationError ? error.message : "Invalid request body.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { data, error } = await supabaseResult.client.rpc("submit_trip", { payload });

  if (error) {
    // Full detail server-side; generic message to the client.
    console.error("Supabase submit_trip failed", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json(
      { error: "We could not save your trip right now. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json(
    { ok: true, tripId: data ?? null },
    { status: 201, headers: { "Cache-Control": "no-store" } }
  );
}
