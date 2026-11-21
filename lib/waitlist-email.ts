/**
 * Owner notification for new waitlist signups.
 *
 * Uses FormSubmit's keyless AJAX endpoint, so there is no account or API key to
 * configure. On the first ever submission FormSubmit emails the recipient a
 * confirmation link — it must be clicked once before notifications arrive.
 * After that, every new signup is forwarded to the inbox.
 */
const DEFAULT_NOTIFICATION_EMAIL = "abdelrahim.nabil.hamad@gmail.com";

export type SignupNotification = {
  email: string;
  source: string;
  campaign: string | null;
  position: number;
  createdAt: string;
};

export async function notifyOwnerOfSignup(
  signup: SignupNotification,
): Promise<void> {
  const to =
    process.env.WAITLIST_NOTIFICATION_EMAIL?.trim() ||
    DEFAULT_NOTIFICATION_EMAIL;
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(to)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      // Our own honeypot + rate limiting already guard the endpoint.
      _captcha: "false",
      _template: "table",
      _subject: `New Egypt Origin signup — ${signup.email}`,
      _replyto: signup.email,
      "Subscriber email": signup.email,
      Source: signup.source,
      Campaign: signup.campaign ?? "—",
      "Waitlist number": signup.position,
      "Signed up": signup.createdAt,
    }),
    signal: AbortSignal.timeout(8_000),
  });

  // FormSubmit answers HTTP 200 even for refusals (e.g. "needs Activation"),
  // with success as the STRING "false" — `response.ok` alone is not enough.
  const data = (await response.json().catch(() => ({}))) as {
    success?: unknown;
    message?: string;
  };

  if (!response.ok || String(data.success) !== "true") {
    throw new Error(
      `FormSubmit ${response.status}: ${data.message ?? "unexpected response"}`,
    );
  }
}
