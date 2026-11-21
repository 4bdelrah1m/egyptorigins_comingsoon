import { NextResponse } from "next/server";
import { addToWaitlist } from "@/lib/waitlist-store";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    if (buckets.size > 500) {
      for (const [entryKey, entry] of buckets) {
        if (entry.resetAt <= now) buckets.delete(entryKey);
      }
    }
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_REQUESTS;
}

function cleanString(value: unknown, maxLength: number): string {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

async function mirrorToWebhook(payload: Record<string, unknown>) {
  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (!webhook) return;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3_000),
    });
  } catch (error) {
    // The local write already succeeded; never fail the visitor for this.
    console.error("waitlist webhook failed", error);
  }
}

export async function POST(request: Request) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const payload = body as Record<string, unknown>;

  // Honeypot: accept silently so bots don't learn the trap.
  if (cleanString(payload.company, 100).length > 0) {
    return NextResponse.json({
      ok: true,
      position: 0,
      total: 0,
      alreadyRegistered: true,
    });
  }

  const email = cleanString(payload.email, 254).toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 422 },
    );
  }

  const source = cleanString(payload.source, 64) || "direct";
  const campaign = cleanString(payload.campaign, 64) || null;

  try {
    const result = await addToWaitlist({ email, source, campaign });

    if (!result.alreadyRegistered) {
      await mirrorToWebhook({
        event: "waitlist.signup",
        email,
        source,
        campaign,
        position: result.position,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("waitlist persistence failed", error);
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't save your spot. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
