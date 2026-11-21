"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

const LAUNCH_MS = Date.parse(siteConfig.launchDateISO);
const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
] as const;

type Remaining = Record<(typeof UNITS)[number]["key"], number>;

function getRemaining(target: number): Remaining {
  const distance = Math.max(0, target - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

export function Countdown() {
  // `null` on the server avoids a hydration mismatch — dashes, then real digits.
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    if (Number.isNaN(LAUNCH_MS)) return;
    const tick = () => setRemaining(getRemaining(LAUNCH_MS));
    tick();
    const timer = window.setInterval(tick, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  if (Number.isNaN(LAUNCH_MS)) return null;

  return (
    <div className="w-full max-w-md">
      <div className="flex items-baseline justify-between gap-4">
        <span className="label text-[9px] text-ink/60">Doors open</span>
        <span className="label text-[9px] text-ink/60">
          {siteConfig.launchLabel}
        </span>
      </div>

      <div
        role="timer"
        aria-label="Time until Egypt Origin opens"
        className="mt-2 grid grid-cols-4 divide-x divide-ink/15 border-y border-ink/15"
      >
        {UNITS.map((unit) => {
          const value = remaining?.[unit.key];
          return (
            <div key={unit.key} className="min-w-0 px-3 py-2.5 first:pl-0">
              <span className="block text-[1.35rem] leading-none font-medium tracking-[-0.03em] tabular-nums">
                {value === undefined ? "––" : String(value).padStart(2, "0")}
              </span>
              <span className="label mt-1.5 block text-[9px] text-ink/60">
                {unit.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
