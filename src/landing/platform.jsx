import { Link } from 'react-router-dom'
import { assetUrl } from '../utils/landingLinks'
import { useEffect, useRef } from 'react'

import { loadMotion } from '../lib/loadMotion'

const ROWS = [
  {
    index: '01',
    title: 'Samenvattingen',
    text: 'Kernstof per casus, overzichtelijk opgebouwd met tabellen en klinische toepassingen.',
    img: assetUrl('assets/row-samenvattingen.png'),
    alt: 'Geannoteerd anatomisch hartdiagram',
    to: '/summary',
  },
  {
    index: '02',
    title: 'Oefenvragen',
    text: 'Meerkeuze per onderwerp. Test je kennis gericht en zie direct wat je mist.',
    img: assetUrl('assets/row-oefenvragen.png'),
    alt: 'Waaier van studiekaarten met een cyaan vraagteken',
    to: '/oefenvragen',
  },
  {
    index: '03',
    title: 'Oefententamens',
    text: 'Casusgerichte tentamens met directe feedback en puntentelling per vraag.',
    img: assetUrl('assets/row-tentamens.png'),
    alt: 'Antwoordformulier met cyaan ingevulde cirkels',
    to: '/tentamen',
  },
  {
    index: '04',
    title: 'Flashcards',
    text: 'Herhaal kernbegrippen per onderwerp. Vraag op de voorkant, antwoord op de achterkant — ideaal voor actief onthouden.',
    img: assetUrl('assets/row-flashcards.png'),
    alt: 'Stapel medische flashcards met kernvragen per onderwerp',
    to: '/flashcards',
  },
]

/**
 * Interactive index list (board 3): four full-width hairline rows. The whole
 * row is the CTA (garment 4): on hover it shears sideways, the index digit
 * flips to cyan and a preview crop slides in from the right. On touch the
 * crops render inline as static thumbs.
 *
 * Text reveals use masked word slides and char-stagger (inspired by
 * nithinmwarrier.com portfolio motion).
 */
export function LandingPlatform() {
  const sectionRef = useRef(null);
  const annoRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const listRef = useRef(null);
  const rowRefs = useRef([]);

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

        let subtitleSplit = null;
        if (subtitleRef.current) {
          subtitleSplit = new SplitType(subtitleRef.current, splitOpts);
          splits.push(subtitleSplit);
        }

        let annoSplit = null;
        if (annoRef.current) {
          annoSplit = new SplitType(annoRef.current, {
            types: "chars",
            charClass: "sm-split-char",
          });
          splits.push(annoSplit);
        }

        const rowSplits = rowRefs.current
          .filter(Boolean)
          .map((row) => {
            const titleEl = row.querySelector("[data-platform-title]");
            const textEl = row.querySelector("[data-platform-text]");

            const titleSplit = titleEl
              ? new SplitType(titleEl, splitOpts)
              : null;
            if (titleSplit) splits.push(titleSplit);

            const textSplit = textEl ? new SplitType(textEl, splitOpts) : null;
            if (textSplit) splits.push(textSplit);

            return { row, titleSplit, textSplit };
          });

        const ctx = gsap.context(() => {
          if (annoSplit?.chars?.length && annoRef.current) {
            const annoEl = annoRef.current;
            gsap.set(annoEl, { letterSpacing: "0.28em", opacity: 0 });
            gsap.to(annoEl, {
              letterSpacing: "0.14em",
              opacity: 1,
              duration: 0.95,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            });
            gsap.set(annoSplit.chars, { opacity: 0, y: 10 });
            gsap.to(annoSplit.chars, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.035,
              delay: 0.12,
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            });
          }

          gsap.set("[data-platform-headline-line]", {
            scaleX: 0,
            transformOrigin: "left center",
          });
          gsap.to("[data-platform-headline-line]", {
            scaleX: 1,
            duration: 1,
            ease: "power2.inOut",
            delay: 0.2,
            scrollTrigger: {
              trigger: headline,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });

          const headlineWords = headlineSplit.words;
          if (headlineWords?.length) {
            gsap.set(headlineWords, { yPercent: 110, opacity: 0 });
            gsap.to(headlineWords, {
              yPercent: 0,
              opacity: 1,
              duration: 1.05,
              ease: "power4.out",
              stagger: 0.04,
              delay: 0.15,
              scrollTrigger: {
                trigger: headline,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
          }

          if (subtitleSplit?.words?.length) {
            gsap.set(subtitleSplit.words, { yPercent: 105, opacity: 0 });
            gsap.to(subtitleSplit.words, {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.022,
              delay: 0.45,
              scrollTrigger: {
                trigger: headline,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
          }

          if (listRef.current) {
            gsap.set("[data-platform-list-line]", {
              scaleX: 0,
              transformOrigin: "left center",
            });
            gsap.to("[data-platform-list-line]", {
              scaleX: 1,
              duration: 1.2,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: listRef.current,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            });
          }

          rowSplits.forEach(({ row, titleSplit, textSplit }, i) => {
            const border = row.querySelector("[data-platform-row-line]");
            const indexEl = row.querySelector("[data-platform-index]");
            const arrow = row.querySelector("[data-platform-arrow]");
            const preview = row.querySelector("[data-platform-preview]");
            const thumb = row.querySelector("[data-platform-thumb]");

            if (border) {
              gsap.set(border, { scaleX: 0, transformOrigin: "left center" });
              gsap.to(border, {
                scaleX: 1,
                duration: 0.85,
                ease: "power2.inOut",
                scrollTrigger: {
                  trigger: row,
                  start: "top 92%",
                  toggleActions: "play none none none",
                },
              });
            }

            if (indexEl) {
              gsap.set(indexEl, { opacity: 0, x: -18, scale: 0.92 });
              gsap.to(indexEl, {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.8,
                ease: "power4.out",
                delay: 0.06,
                scrollTrigger: {
                  trigger: row,
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
              });
            }

            const titleWords = titleSplit?.words;
            if (titleWords?.length) {
              gsap.set(titleWords, { yPercent: 108, opacity: 0 });
              gsap.to(titleWords, {
                yPercent: 0,
                opacity: 1,
                duration: 0.95,
                ease: "power4.out",
                stagger: 0.038,
                delay: 0.14,
                scrollTrigger: {
                  trigger: row,
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
              });
            }

            const textWords = textSplit?.words;
            if (textWords?.length) {
              gsap.set(textWords, { yPercent: 105, opacity: 0 });
              gsap.to(textWords, {
                yPercent: 0,
                opacity: 1,
                duration: 0.85,
                ease: "power4.out",
                stagger: 0.018,
                delay: 0.3 + i * 0.02,
                scrollTrigger: {
                  trigger: row,
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
              });
            }

            if (arrow) {
              gsap.set(arrow, { opacity: 0, x: -10 });
              gsap.to(arrow, {
                opacity: 1,
                x: 0,
                duration: 0.65,
                ease: "power3.out",
                delay: 0.42,
                scrollTrigger: {
                  trigger: row,
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
              });
            }

            const revealCrop = (el, delay) => {
              gsap.set(el, {
                clipPath: "inset(0 100% 0 0)",
                opacity: 0.55,
              });
              gsap.to(el, {
                clipPath: "inset(0 0% 0 0)",
                opacity: 1,
                duration: 1.1,
                ease: "power3.inOut",
                delay,
                scrollTrigger: {
                  trigger: row,
                  start: "top 88%",
                  toggleActions: "play none none none",
                },
              });
            };

            if (preview) revealCrop(preview, 0.22);
            if (thumb) revealCrop(thumb, 0.35);
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
      id="platform"
      ref={sectionRef}
      className="relative z-10 overflow-hidden border-t border-hairline bg-panel py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p ref={annoRef} className="sm-anno text-pulsedeep">
          Platform
        </p>
        <div className="relative mt-4">
          <span
            data-platform-headline-line
            className="absolute -left-6 top-3 hidden h-px w-8 bg-pulse md:block"
            aria-hidden
          />
          <h2
            ref={headlineRef}
            className="max-w-2xl text-4xl font-black leading-[1.02] tracking-tighter text-ink md:text-6xl"
          >
            Alles voor je blok, op één plek
          </h2>
        </div>
        <p ref={subtitleRef} className="mt-5 max-w-md text-inkmuted">
          Vier onderdelen die samen je voorbereiding compleet maken.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-[1400px] px-6 lg:px-10">
        <div className="relative">
          <span
            data-platform-list-line
            className="absolute inset-x-0 top-0 h-px origin-left bg-hairline"
            aria-hidden
          />
          <ul ref={listRef}>
            {ROWS.map((row, i) => (
              <li
                key={row.index}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className="relative"
              >
                <span
                  data-platform-row-line
                  className="absolute inset-x-0 bottom-0 h-px origin-left bg-hairline"
                  aria-hidden
                />
                <Link
                  to={row.to}
                  data-cursor="target"
                  className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-5 overflow-hidden py-7 transition-transform duration-300 ease-out md:grid-cols-[90px_1fr_minmax(0,320px)_auto] md:gap-8 md:py-9 md:hover:translate-x-2"
                >
                  <span
                    data-platform-index
                    className="font-anno text-2xl font-bold tracking-widest text-inkmuted/50 transition-colors duration-300 group-hover:text-pulse md:text-4xl"
                    aria-hidden
                  >
                    {row.index}
                  </span>

                  <div className="min-w-0">
                    <h3
                      data-platform-title
                      className="text-2xl font-bold tracking-tight text-ink md:text-4xl"
                    >
                      {row.title}
                    </h3>
                    <p
                      data-platform-text
                      className="mt-2 max-w-[48ch] text-sm leading-relaxed text-inkmuted md:text-base"
                    >
                      {row.text}
                    </p>
                    <img
                      data-platform-thumb
                      src={row.img}
                      alt={row.alt}
                      loading="lazy"
                      className="mt-4 h-28 w-44 border border-hairline object-cover will-change-[clip-path,opacity] md:hidden"
                    />
                  </div>

                  <div
                    data-platform-preview
                    className="relative hidden h-32 overflow-hidden border border-transparent transition-colors duration-500 will-change-[clip-path,opacity] group-hover:border-hairline md:block"
                  >
                    <img
                      src={row.img}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="h-full w-full translate-x-6 scale-110 object-cover opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100"
                    />
                  </div>

                  <span
                    data-platform-arrow
                    aria-hidden
                    className="text-xl text-inkmuted transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-pulse md:text-2xl"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
