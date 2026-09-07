import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { buildContactPayload, ValidationError } from "@/lib/forms/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabaseResult = getSupabaseServerClient();
  if (!supabaseResult.ok) {
    console.error("Contact form not configured:", supabaseResult.reason);
    return NextResponse.json(
      { error: "The contact form is not configured yet. Please email or call us instead." },
      { status: 503 }
    );
  }

  let payload;
  try {
    payload = buildContactPayload(await request.json());
  } catch (error) {
    const message =
      error instanceof ValidationError ? error.message : "Invalid request body.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { data, error } = await supabaseResult.client.rpc("submit_contact_message", {
    payload,
  });

  if (error) {
    console.error("Supabase submit_contact_message failed", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json(
      { error: "We could not send your message right now. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json(
    { ok: true, messageId: data ?? null },
    { status: 201, headers: { "Cache-Control": "no-store" } }
  );
}
