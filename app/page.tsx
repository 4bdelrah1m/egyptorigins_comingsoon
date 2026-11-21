import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { IconArrowUpRight } from "@/components/icons";
import { WaitlistForm } from "@/components/waitlist-form";
import { siteConfig } from "@/lib/site";



const structuredData = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": `${siteConfig.url}/#atelier`,
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  image: `${siteConfig.url}/images/og-giza.webp`,
  logo: `${siteConfig.url}/images/logo.png`,
  email: siteConfig.email,
  sameAs: [siteConfig.instagram],
  areaServed: "Egypt",
};

export default function Home() {
  return (
    <main className="min-h-svh bg-paper text-ink">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 sm:px-8 lg:px-10">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-ink/15 sm:h-24">
          <Link
            href="/"
            aria-label="Egypt Origin — home"
            className="flex items-center"
          >
            <Image
              src="/images/logo.png"
              alt="Egypt Origin"
              width={300}
              height={300}
              preload
              sizes="(min-width: 640px) 148px, 104px"
              className="h-10 w-[104px] object-cover object-center mix-blend-multiply invert sm:h-14 sm:w-[148px]"
            />
          </Link>

          <div className="flex items-center gap-6">
            <span className="label flex items-center gap-2 text-[9px] text-ink/65">
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-ink" />
              Opening Soon
            </span>
          </div>
        </header>

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="grid flex-1 gap-10 py-10 sm:py-14 lg:grid-cols-12 lg:gap-12 lg:py-16">
          <div className="flex flex-col lg:col-span-7">
            <div className="label flex items-center justify-between gap-4 border-b border-ink/15 pb-3 text-[9px] text-ink/60">
              <span className="hidden sm:block">Send your inquiry</span>
            </div>

            <h1 className="mt-8 text-[clamp(2.25rem,6.4vw,5.2rem)] leading-[0.94] font-medium tracking-[-0.045em] sm:mt-10">
              Ancient Egypt.
              <br />
              Modern logistics.
            </h1>

            <p className="mt-5 max-w-[44ch] text-[14px] leading-[1.65] text-ink/65 sm:mt-6 sm:text-[15px]">
              Discover the timeless beauty of Egypt with us.
              We create unforgettable travel experiences, 
              carefully planned tours, and exceptional hospitality.
              From the ancient wonders of the Pharaohs to the beauty of the Nile,
              we make every journey a story worth telling.
            </p>
            <p className="font-bold">
              Explore Egypt. Experience History. Travel Beyond Expectations.

            </p>

            <div className="mt-8 sm:mt-9">
              <WaitlistForm />
            </div>

            <div className="mt-10 sm:mt-12 lg:mt-auto lg:pt-12">
              <Countdown />
            </div>
          </div>

          {/* ── Field plate ──────────────────────────────────────────────── */}
          <figure className="w-full max-w-sm sm:ml-auto lg:col-span-5 lg:ml-0 lg:max-w-none">
            <div className="border border-ink/20">
              <div className="label flex items-center justify-between border-b border-ink/15 px-3 py-2 text-[9px] text-ink/60">
                <span>Don&apos;t Hesitate to Contact US</span>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden bg-paper-deep">
                <Image
                  src="/images/hero-pyramids.webp"
                  alt="The pyramids of Giza at dusk"
                  fill
                  quality={85}
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 24rem, 100vw"
                  className="object-cover object-[50%_60%] contrast-[1.05]"
                />
              </div>

              <figcaption className="label flex items-center justify-between gap-3 border-t border-ink/15 px-3 py-2 text-[9px] text-ink/60">
                <span>29.9792° N / 31.1342° E</span>
                <span>Limestone</span>
              </figcaption>
              
            </div>
          </figure>
        </section>

 
        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="mt-auto border-t border-ink py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="label text-xs font-bold text-ink/60">
              © 2026 Egypt Origin
            </p>
            <a
              href="https://instagram.com/abdelrahim.nabil/"
              className="group inline-flex items-center gap-1 transition-colors hover:text-ink"
            >
              <span className="label text-xs font-bold leading-relaxed text-ink/60">
                Abdelrahim Nabil
              </span>
              <IconArrowUpRight className="h-6 w-6 font-bold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <p className="label mt-2 text-[9px] leading-relaxed text-ink/60">
            Photograph —{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:Sunset_at_the_Pyramids.jpg"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-ink/25 underline-offset-2 transition-colors hover:text-ink/80"
            >
              Spottedviper
            </a>{" "}
            /{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-ink/25 underline-offset-2 transition-colors hover:text-ink/80"
            >
              CC BY-SA 4.0
            </a>
          </p>
        </footer>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
