import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verify(rawBody: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i), p.slice(i + 1)];
    })
  );
  const t = Number(parts.t);
  const v1 = parts.v1;
  if (!t || !v1) return false;
  if (Math.abs(Date.now() / 1000 - t) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${parts.t}.${rawBody}`).digest("hex");
  return v1.length === expected.length && timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
}

export async function POST(req: Request) {
  const secret = process.env.NOTESAPP_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not configured" }, { status: 500 });

  const raw = await req.text();
  const sig = req.headers.get("notesapp-signature") || "";
  if (!verify(raw, sig, secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const evt = JSON.parse(raw) as { id: string; type: string; created: number; data: unknown };
  // Doc id = event id, so redeliveries/resends are idempotent.
  await adminDb()
    .collection("notesappEvents")
    .doc(evt.id)
    .set({ type: evt.type, created: evt.created, data: evt.data, receivedAt: new Date().toISOString() });

  return NextResponse.json({ received: true });
}
