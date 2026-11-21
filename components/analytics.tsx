import Script from "next/script";

/**
 * Google Analytics 4 + Microsoft Clarity.
 *
 * Both IDs are public by design and supplied through environment variables:
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 *   NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
 *
 * Nothing is injected when an ID is missing — safe for local development.
 * GA loads after hydration so it never blocks the hero paint; Clarity waits
 * for the browser to go idle. Clarity records sessions: enable input masking
 * in Clarity → Settings → Sensitive data before sharing the link publicly.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export function Analytics() {
  if (!GA_ID && !CLARITY_ID) return null;

  return (
    <>
      {GA_ID ? (
        <>
          <Script
            id="ga-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});`}
          </Script>
        </>
      ) : null}

      {CLARITY_ID ? (
        <Script id="ms-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      ) : null}
    </>
  );
}
