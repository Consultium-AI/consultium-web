import { Link } from 'react-router-dom'
import { Bot, ClipboardCheck, FileText, HelpCircle } from 'lucide-react'
import { assetUrl } from '../utils/landingLinks'
import { useEffect, useLayoutEffect, useRef } from 'react'

import { loadMotion } from '../lib/loadMotion'

const FEATURED_FEATURES = [
  { Icon: FileText, label: 'Alle samenvattingen' },
  { Icon: ClipboardCheck, label: 'Oefententamens met nakijking' },
  { Icon: HelpCircle, label: 'Oefenvragen per onderwerp' },
  { Icon: Bot, label: 'Smartium AI Chat' },
]

/**
 * Asymmetric pricing (board 5): featured yearly panel left with a notched
 * corner and cyan hairline frame; free and monthly as compact ruled rows
 * right; faint anatomical sketch plate behind. Text reveals use masked line
 * slides, word stagger, and tier-label char reveals (inspired by
 * nithinmwarrier.com portfolio motion).
 */
export function LandingPrijzen() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const plateRef = useRef(null);
  const featuredBlockRef = useRef(null);
  const featuredRef = useRef(null);
  const rowRefs = useRef([]);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const card = featuredRef.current;
    if (reduced || !card) return;

    card.style.opacity = "0";
    card.style.transform = "translate3d(0, 44px, 0)";

    card
      .querySelectorAll(
        "[data-prijzen-featured-item], [data-prijzen-feature], [data-prijzen-cta], [data-prijzen-tier], [data-prijzen-price]",
      )
      .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translate3d(0, 18px, 0)";
      });
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    const headline = headlineRef.current;
    if (reduced || !section || !headline) return;

    let cancelled = false;
    let cleanup;

    void Promise.all([loadMotion(), import("split-type")]).then(
      ([{ gsap, ScrollTrigger }, { default: SplitType }]) => {
        if (cancelled) return;

        const splits = [];

        const splitOpts = {
          types: "lines,words",
          lineClass: "sm-split-line",
          wordClass: "sm-split-word",
          tagName: "span",
        };

        const headlineSplit = new SplitType(headline, splitOpts);
        splits.push(headlineSplit);

        const subtitle = subtitleRef.current;
        const subtitleSplit = subtitle ? new SplitType(subtitle, splitOpts) : null;
        if (subtitleSplit) splits.push(subtitleSplit);

        const tierLabels = [...section.querySelectorAll("[data-prijzen-tier]")].filter(
          (el) => !el.closest("[data-prijzen-featured]"),
        );
        const tierSplits = [...tierLabels].map((el) => {
          const split = new SplitType(el, {
            types: "chars",
            charClass: "sm-split-char",
          });
          splits.push(split);
          return { el, split };
        });

        const priceEls = [...section.querySelectorAll("[data-prijzen-price]")].filter(
          (el) => !el.closest("[data-prijzen-featured]"),
        );
        const priceSplits = [...priceEls].map((el) => {
          const split = new SplitType(el, {
            types: "chars",
            charClass: "sm-split-char",
          });
          splits.push(split);
          return { el, split };
        });

        const featuredTier = featuredRef.current?.querySelector(
          "[data-prijzen-tier]",
        );
        const featuredTierSplit = featuredTier
          ? new SplitType(featuredTier, {
              types: "chars",
              charClass: "sm-split-char",
            })
          : null;
        if (featuredTierSplit) splits.push(featuredTierSplit);

        const featuredPrice = featuredRef.current?.querySelector(
          "[data-prijzen-price]",
        );
        const featuredPriceSplit = featuredPrice
          ? new SplitType(featuredPrice, {
              types: "chars",
              charClass: "sm-split-char",
            })
          : null;
        if (featuredPriceSplit) splits.push(featuredPriceSplit);

        const ctx = gsap.context(() => {
          const headlineWords = headlineSplit.words;
          if (headlineWords?.length) {
            gsap.set(headlineWords, { yPercent: 112, opacity: 0 });
            gsap.to(headlineWords, {
              yPercent: 0,
              opacity: 1,
              duration: 1.05,
              ease: "power4.out",
              stagger: 0.042,
              scrollTrigger: {
                trigger: headline,
                start: "top 84%",
                toggleActions: "play none none none",
              },
            });
          }

          const headlineRule = section.querySelector("[data-prijzen-rule]");
          if (headlineRule) {
            gsap.set(headlineRule, { scaleX: 0, transformOrigin: "left center" });
            gsap.to(headlineRule, {
              scaleX: 1,
              duration: 1.1,
              ease: "power3.inOut",
              delay: 0.18,
              scrollTrigger: {
                trigger: headline,
                start: "top 84%",
                toggleActions: "play none none none",
              },
            });
          }

          const subtitleWords = subtitleSplit?.words;
          if (subtitleWords?.length) {
            gsap.set(subtitleWords, { yPercent: 108, opacity: 0 });
            gsap.to(subtitleWords, {
              yPercent: 0,
              opacity: 1,
              duration: 0.92,
              ease: "power4.out",
              stagger: 0.032,
              delay: 0.12,
              scrollTrigger: {
                trigger: subtitle,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            });
          }

          if (plateRef.current) {
            gsap.set(plateRef.current, { opacity: 0, scale: 1.04 });
            gsap.to(plateRef.current, {
              opacity: 0.3,
              scale: 1,
              duration: 1.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                toggleActions: "play none none none",
              },
            });
          }

          if (featuredRef.current && featuredBlockRef.current) {
            const card = featuredRef.current;
            const featuredItems = card.querySelectorAll(
              "[data-prijzen-featured-item]",
            );
            const featuredFeatures = card.querySelectorAll(
              "[data-prijzen-feature]",
            );
            const featuredCta = card.querySelector("[data-prijzen-cta]");
            const tierChars = featuredTierSplit?.chars;
            const priceChars = featuredPriceSplit?.chars;

            gsap.set(card, { opacity: 0, y: 44, scale: 0.985 });
            gsap.set(featuredItems, { opacity: 0, y: 18 });
            gsap.set("[data-prijzen-featured] [data-prijzen-badge]", { opacity: 0, y: 14 });
            gsap.set(featuredFeatures, { opacity: 0, x: -12 });
            if (featuredCta) gsap.set(featuredCta, { opacity: 0, y: 16 });

            if (featuredTier && tierChars?.length) {
              gsap.set(featuredTier, { letterSpacing: "0.28em", opacity: 1 });
              gsap.set(tierChars, { opacity: 0, y: 12 });
            }

            if (featuredPrice) {
              gsap.set(featuredPrice, { opacity: 1 });
            }
            if (priceChars?.length) {
              gsap.set(priceChars, { opacity: 0, yPercent: 115 });
            }

            const featuredTl = gsap.timeline({
              scrollTrigger: {
                trigger: featuredBlockRef.current,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            });

            featuredTl.to(card, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: "power4.out",
            });

            if (featuredTier && tierChars?.length) {
              featuredTl.to(
                featuredTier,
                { letterSpacing: "0.14em", duration: 0.75, ease: "power3.out" },
                0.18,
              );
              featuredTl.to(
                tierChars,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.4,
                  ease: "power3.out",
                  stagger: 0.03,
                },
                0.22,
              );
            }

            featuredTl.to(
              "[data-prijzen-featured] [data-prijzen-badge]",
              { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
              0.3,
            );

            if (priceChars?.length) {
              featuredTl.to(
                priceChars,
                {
                  opacity: 1,
                  yPercent: 0,
                  duration: 0.5,
                  ease: "power4.out",
                  stagger: 0.035,
                },
                0.38,
              );
            }

            featuredTl.to(
              featuredItems,
              { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.07 },
              0.52,
            );

            featuredTl.to(
              featuredFeatures,
              { opacity: 1, x: 0, duration: 0.55, ease: "power3.out", stagger: 0.08 },
              0.62,
            );

            if (featuredCta) {
              featuredTl.to(
                featuredCta,
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
                0.88,
              );
            }
          }

          tierSplits.forEach(({ el, split }, i) => {
            const chars = split.chars;
            if (!chars?.length) return;

            gsap.set(el, { letterSpacing: "0.28em", opacity: 0 });
            gsap.to(el, {
              letterSpacing: "0.14em",
              opacity: 1,
              duration: 0.85,
              ease: "power3.out",
              delay: 0.22 + i * 0.08,
              scrollTrigger: {
                trigger: el.closest("[data-prijzen-block]") ?? el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            });

            gsap.set(chars, { opacity: 0, y: 10 });
            gsap.to(chars, {
              opacity: 1,
              y: 0,
              duration: 0.42,
              ease: "power3.out",
              stagger: 0.035,
              delay: 0.3 + i * 0.08,
              scrollTrigger: {
                trigger: el.closest("[data-prijzen-block]") ?? el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            });
          });

          priceSplits.forEach(({ el, split }, i) => {
            const chars = split.chars;
            if (!chars?.length) return;

            gsap.set(chars, {
              opacity: 0,
              yPercent: 80,
              rotateX: -28,
              transformPerspective: 520,
            });
            gsap.to(chars, {
              opacity: 1,
              yPercent: 0,
              rotateX: 0,
              duration: 0.55,
              ease: "power4.out",
              stagger: 0.04,
              delay: 0.38 + i * 0.1,
              scrollTrigger: {
                trigger: el.closest("[data-prijzen-block]") ?? el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            });
          });

          rowRefs.current.filter(Boolean).forEach((row, i) => {
            const rule = row.querySelector("[data-prijzen-row-rule]");
            const copy = row.querySelector("[data-prijzen-copy]");

            if (rule) {
              gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
              gsap.to(rule, {
                scaleX: 1,
                duration: 0.9,
                ease: "power2.inOut",
                delay: 0.1 + i * 0.12,
                scrollTrigger: {
                  trigger: row,
                  start: "top 92%",
                  toggleActions: "play none none none",
                },
              });
            }

            if (copy) {
              const copySplit = new SplitType(copy, splitOpts);
              splits.push(copySplit);
              const words = copySplit.words;
              if (words?.length) {
                gsap.set(words, { yPercent: 105, opacity: 0 });
                gsap.to(words, {
                  yPercent: 0,
                  opacity: 1,
                  duration: 0.88,
                  ease: "power4.out",
                  stagger: 0.022,
                  delay: 0.28 + i * 0.1,
                  scrollTrigger: {
                    trigger: row,
                    start: "top 92%",
                    toggleActions: "play none none none",
                  },
                });
              }
            }

            gsap.from(row.querySelectorAll("[data-prijzen-cta]"), {
              opacity: 0,
              y: 12,
              duration: 0.65,
              ease: "power3.out",
              delay: 0.42 + i * 0.1,
              scrollTrigger: {
                trigger: row,
                start: "top 92%",
                toggleActions: "play none none none",
              },
            });
          });

          gsap.from("[data-prijzen-footnote]", {
            opacity: 0,
            letterSpacing: "0.22em",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "[data-prijzen-footnote]",
              start: "top 94%",
              toggleActions: "play none none none",
            },
          });
          gsap.to("[data-prijzen-footnote]", {
            letterSpacing: "0.14em",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "[data-prijzen-footnote]",
              start: "top 94%",
              toggleActions: "play none none none",
            },
          });
        }, section);

        cleanup = () => {
          ctx.revert();
          splits.forEach((s) => s.revert?.());
        };

        ScrollTrigger.refresh();
      },
    );

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section
      id="prijzen"
      ref={sectionRef}
      className="relative z-10 overflow-hidden border-t border-hairline bg-paper py-24 md:py-36"
    >
      {/* faint atlas sketch plate at the edges */}
      <img
        ref={plateRef}
        src={assetUrl('assets/plate-sketch.png')}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30 will-change-[opacity,transform]"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="relative max-w-2xl">
          <h2
            ref={headlineRef}
            className="text-4xl font-black leading-[1.02] tracking-tighter text-ink md:text-6xl"
          >
            Eén platform, alles inbegrepen
          </h2>
          <span
            data-prijzen-rule
            aria-hidden
            className="absolute -bottom-3 left-0 h-px w-full max-w-[min(100%,28rem)] origin-left bg-pulse/70"
          />
        </div>
        <p
          ref={subtitleRef}
          className="mt-5 max-w-md text-inkmuted"
        >
          Kies het plan dat bij je past. Maandelijks opzegbaar.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* featured yearly panel */}
          <div
            ref={featuredBlockRef}
            data-prijzen-featured
            className="relative lg:col-span-5"
            data-prijzen-block
          >
            <div
              aria-hidden
              className="absolute -right-2 -top-2 h-full w-full border border-hairline bg-panel/70 md:-right-3 md:-top-3"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)",
              }}
            />
            <div
              ref={featuredRef}
              className="relative overflow-hidden border border-pulse/45 bg-panel shadow-[0_24px_60px_-24px_rgba(11,34,48,0.16)] will-change-transform md:p-11 p-8"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pulse/50 to-transparent"
              />

              <div className="flex items-start justify-between gap-4">
                <span
                  data-prijzen-tier
                  className="sm-anno font-bold text-pulsedeep"
                >
                  Jaarlijks
                </span>
                <span
                  data-prijzen-badge
                  className="sm-anno shrink-0 rounded-full border border-pulse/40 bg-pulse/[0.08] px-3 py-1 text-pulsedeep"
                >
                  20% korting
                </span>
              </div>

              <div className="mt-8">
                <div className="flex items-end gap-2.5">
                  <span
                    data-prijzen-price
                    className="overflow-hidden text-[3.25rem] font-black leading-none tracking-tighter text-ink md:text-7xl"
                  >
                    € 7,99
                  </span>
                  <span
                    data-prijzen-featured-item
                    className="mb-1.5 text-sm font-medium text-inkmuted"
                  >
                    / maand
                  </span>
                </div>
                <p
                  data-prijzen-featured-item
                  className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm text-inkmuted"
                >
                  <span className="font-medium text-ink/80">€ 95,90 per jaar</span>
                  <span className="text-inkmuted/50">·</span>
                  <span className="text-inkmuted/60 line-through">€ 119,88</span>
                </p>
              </div>

              <ul className="mt-10 space-y-4 border-t border-hairline/90 pt-8">
                {FEATURED_FEATURES.map((f) => (
                  <li
                    key={f.label}
                    data-prijzen-feature
                    className="flex items-center gap-3.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-hairline/80 bg-paper text-pulsedeep shadow-[0_1px_0_rgba(11,34,48,0.04)]">
                      <f.Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="text-[15px] font-medium leading-snug text-ink">{f.label}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={"/login"}
                data-cursor="target"
                data-prijzen-cta
                className="group relative mt-10 block overflow-hidden rounded-sm border-2 border-ink py-4 text-center font-bold text-ink transition-shadow duration-300 hover:shadow-[0_8px_24px_-8px_rgba(11,34,48,0.25)]"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-y-100" />
                <span className="relative transition-colors duration-300 group-hover:text-paper">
                  Aan de slag
                </span>
              </Link>
            </div>
          </div>

          {/* compact ruled rows */}
          <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
            <div
              ref={(el) => {
                rowRefs.current[0] = el;
              }}
              data-prijzen-block
              className="relative py-10 md:py-11"
            >
              <span
                data-prijzen-row-rule
                aria-hidden
                className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-pulse/60 via-pulse/30 to-transparent"
              />
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <span data-prijzen-tier className="sm-anno text-inkmuted">
                    Gratis
                  </span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span
                      data-prijzen-price
                      className="text-4xl font-black leading-none tracking-tighter text-ink md:text-5xl"
                    >
                      € 0,00
                    </span>
                    <span className="text-sm font-medium text-inkmuted">/ maand</span>
                  </div>
                  <p
                    data-prijzen-copy
                    className="mt-4 max-w-[48ch] text-sm leading-relaxed text-inkmuted"
                  >
                    Start direct, zonder betaling. Beperkte toegang tot samenvattingen,
                    oefenvragen en tentamens, plus een beperkt aantal AI-tokens.
                  </p>
                </div>
                <Link
                  to={"/login"}
                  data-cursor="target"
                  data-prijzen-cta
                  className="sm-anno inline-flex shrink-0 items-center justify-center self-start border-[1.5px] border-ink/70 px-5 py-2.5 font-bold text-ink transition-all duration-150 hover:-rotate-1 hover:bg-ink/5 active:translate-y-[2px] active:skew-x-1 active:scale-[0.97]"
                >
                  Gratis starten
                </Link>
              </div>
            </div>

            <div
              ref={(el) => {
                rowRefs.current[1] = el;
              }}
              data-prijzen-block
              className="relative py-10 md:py-11"
            >
              <span
                data-prijzen-row-rule
                aria-hidden
                className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-pulse/60 via-pulse/30 to-transparent"
              />
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <span data-prijzen-tier className="sm-anno text-inkmuted">
                    Maandelijks
                  </span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span
                      data-prijzen-price
                      className="text-4xl font-black leading-none tracking-tighter text-ink md:text-5xl"
                    >
                      € 9,99
                    </span>
                    <span className="text-sm font-medium text-inkmuted">/ maand</span>
                  </div>
                  <p
                    data-prijzen-copy
                    className="mt-4 max-w-[48ch] text-sm leading-relaxed text-inkmuted"
                  >
                    Volledige toegang tot alle onderdelen. Maandelijks opzegbaar.
                  </p>
                </div>
                <Link
                  to={"/login"}
                  data-cursor="target"
                  data-prijzen-cta
                  className="group relative shrink-0 self-start pb-1.5 font-bold text-ink"
                >
                  Aan de slag
                  <span
                    aria-hidden
                    className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-2"
                  >
                    →
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-px bg-ink/20" />
                  <span className="absolute bottom-0 left-0 h-px w-1/3 bg-pulse transition-all duration-300 group-hover:left-2/3" />
                </Link>
              </div>
            </div>

            <p data-prijzen-footnote className="sm-anno mt-2 border-t border-hairline/80 pt-8 text-inkmuted/70">
              Betalen via iDEAL · Veilig via Stripe
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
