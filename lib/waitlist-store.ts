import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export type WaitlistEntry = {
  id: string;
  email: string;
  source: string;
  campaign: string | null;
  createdAt: string;
};

export type AddResult = {
  position: number;
  total: number;
  alreadyRegistered: boolean;
};

/**
 * Signups live in `data/waitlist.json` (git-ignored).
 *
 * Writes are serialized and atomic (temp file + rename) so concurrent
 * requests can never truncate the list. This works on a long-running Node
 * host; on an ephemeral/serverless filesystem also set WAITLIST_WEBHOOK_URL
 * (see README) to mirror every new signup to durable storage.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "waitlist.json");

let queue: Promise<unknown> = Promise.resolve();

function serialize<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function isEntry(value: unknown): value is WaitlistEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    typeof entry.email === "string" &&
    typeof entry.createdAt === "string"
  );
}

async function readEntries(): Promise<WaitlistEntry[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export function addToWaitlist(input: {
  email: string;
  source: string;
  campaign: string | null;
}): Promise<AddResult> {
  return serialize(async () => {
    const entries = await readEntries();
    const existingIndex = entries.findIndex(
      (entry) => entry.email === input.email,
    );

    if (existingIndex !== -1) {
      return {
        position: existingIndex + 1,
        total: entries.length,
        alreadyRegistered: true,
      };
    }

    entries.push({
      id: randomUUID(),
      email: input.email,
      source: input.source,
      campaign: input.campaign,
      createdAt: new Date().toISOString(),
    });

    await fs.mkdir(DATA_DIR, { recursive: true });
    const tempFile = `${FILE}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tempFile, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
    await fs.rename(tempFile, FILE);

    return {
      position: entries.length,
      total: entries.length,
      alreadyRegistered: false,
    };
  });
}
