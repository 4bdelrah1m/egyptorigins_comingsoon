"use client";

import { useRef, useState } from "react";
import { IconArrowRight, IconCheck } from "@/components/icons";
import { trackClarityEvent, trackEvent } from "@/lib/analytics";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = "idle" | "submitting" | "success";

type ApiResponse = {
  ok?: boolean;
  position?: number;
  alreadyRegistered?: boolean;
  error?: string;
};

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const started = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);

  function handleStart() {
    if (started.current) return;
    started.current = true;
    trackEvent("waitlist_form_start", { form: "coming_soon_waitlist" });
    trackClarityEvent("waitlist_form_start");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setError(null);
    const cleaned = email.trim().toLowerCase();

    if (cleaned.length > 254 || !EMAIL_PATTERN.test(cleaned)) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");

    try {
      // Attribution is captured here so the API can store where a signup came from.
      const params = new URLSearchParams(window.location.search);
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleaned,
          company: honeypot.current?.value ?? "",
          source: params.get("utm_source") ?? params.get("ref") ?? "direct",
          campaign: params.get("utm_campaign") ?? "",
        }),
      });

      const data: ApiResponse = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error ?? "We couldn't save your spot. Please try again.",
        );
      }

      setPosition(typeof data.position === "number" ? data.position : null);
      setAlreadyRegistered(Boolean(data.alreadyRegistered));
      setStatus("success");

      trackEvent("generate_lead", {
        method: "waitlist",
        form: "coming_soon_waitlist",
        already_registered: Boolean(data.alreadyRegistered),
      });
      trackClarityEvent("waitlist_signup");
    } catch (caught) {
      setStatus("idle");
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="w-full max-w-md border border-ink/25 p-4"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <span className="mt-px grid h-6 w-6 shrink-0 place-items-center bg-ink text-paper">
            <IconCheck className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          <div>
            <p className="label text-[9px] font-medium">
              {alreadyRegistered
                ? "Already on the list"
                : `Confirmed — No. ${String(position ?? 1).padStart(3, "0")}`}
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink/65">
              {alreadyRegistered
                ? "This address is already registered. We'll write once, when the doors open."
                : "You're on the first list. One email when the doors open."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="label mb-2 flex items-baseline justify-between gap-4 text-[9px] text-ink/60">
        <span>Join the first list</span>
        <span>One email at launch</span>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col border border-ink/30 transition-colors focus-within:border-ink focus-within:ring-1 focus-within:ring-ink sm:flex-row"
      >
        <div className="relative flex-1">
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <input
            id="waitlist-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            disabled={status === "submitting"}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
            }}
            onFocus={handleStart}
            placeholder="you@example.com"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "waitlist-error" : "waitlist-hint"}
            className="h-12 w-full bg-transparent px-3.5 text-[16px] text-ink placeholder:text-ink/60 sm:text-[14px] focus-visible:outline-none disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group label inline-flex h-12 items-center justify-center gap-2 border-t border-ink/30 bg-ink px-5 text-[9px] font-medium text-paper transition-colors hover:bg-ink/85 disabled:cursor-wait disabled:opacity-70 sm:border-t-0 sm:border-l"
        >
          {status === "submitting" ? (
            <>
              <span
                aria-hidden="true"
                className="spin-ring h-3.5 w-3.5 rounded-full border border-paper/30 border-t-paper"
              />
              Sending
            </>
          ) : (
            <>
              Request access
              <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        {/* Bot trap — humans never see or reach this field. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="waitlist-company">Company</label>
          <input
            ref={honeypot}
            id="waitlist-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </form>

      {error ? (
        <p
          id="waitlist-error"
          role="alert"
          className="mt-2.5 border-l-2 border-ink pl-2.5 text-[11px] font-medium text-ink"
        >
          {error}
        </p>
      ) : (
        <p
          id="waitlist-hint"
          className="label mt-2.5 text-[9px] text-ink/60"
        >
          No spam. No noise. Unsubscribe anytime.
        </p>
      )}
    </div>
  );
}
