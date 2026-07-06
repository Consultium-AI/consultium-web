import { assetUrl } from '../utils/landingLinks'
import { useEffect, useRef } from "react";

import { loadMotion } from "../lib/loadMotion";

const STEPS = [
  {
    index: "01",
    anno: "Signaal",
    text: "Het vernieuwde curriculum bracht voor veel studenten een moeilijke start: hoge uitval, veel vragen en onduidelijkheid over wat er precies verwacht werd.",
  },
  {
    index: "02",
    anno: "Diagnose",
    text: "Niet door gebrek aan inzet, maar omdat structuur, focus en richting ontbraken in het enorme aanbod aan informatie.",
  },
  {
    index: "03",
    anno: "Behandeling",
    text: "Daarom bouwden we Smartium: samenvattingen, oefenvragen, tentamens en AI-ondersteuning, samengebracht op een manier die aansluit op het nieuwe curriculum. Minder zoeken, meer echt leren.",
  },
];

/**
 * Origin story — clinical timeline (Signaal → Diagnose → Behandeling) with
 * sticky editorial crop on the right. Matches platform / AI band typography
 * and GSAP reveal patterns.
 */
export function LandingWaarom() {
  const sectionRef = useRef(null);
  const annoRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const timelineRef = useRef(null);
  const imgWrapRef = useRef(null);
  const imgFrameRef = useRef(null);
  const stepRefs = useRef([]);

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

        const stepSplits = stepRefs.current
          .filter(Boolean)
          .map((el) => {
            const textEl = el.querySelector("[data-waarom-text]");
            if (!textEl) return null;
            const split = new SplitType(textEl, splitOpts);
            splits.push(split);

            const annoEl = el.querySelector("[data-waarom-anno]");
            let stepAnnoSplit = null;
            if (annoEl?.textContent) {
              stepAnnoSplit = new SplitType(annoEl, {
                types: "chars",
                charClass: "sm-split-char",
              });
              splits.push(stepAnnoSplit);
            }
            return { block: el, split, annoSplit: stepAnnoSplit };
          })
          .filter(Boolean);

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

          gsap.set("[data-waarom-headline-line]", {
            scaleX: 0,
            transformOrigin: "left center",
          });
          gsap.to("[data-waarom-headline-line]", {
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

          if (timelineRef.current) {
            gsap.set("[data-waarom-spine]", {
              scaleY: 0,
              transformOrigin: "top center",
            });
            gsap.to("[data-waarom-spine]", {
              scaleY: 1,
              duration: 1.4,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: timelineRef.current,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            });
          }

          stepSplits.forEach(({ block, split, annoSplit: stepAnnoSplit }, i) => {
            const words = split.words;
            const indexEl = block.querySelector("[data-waarom-index]");
            const annoChars = stepAnnoSplit?.chars;

            if (indexEl) {
              gsap.set(indexEl, { opacity: 0, scale: 0.85, y: 12 });
              gsap.to(indexEl, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.75,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: block,
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
              });
            }

            if (words?.length) {
              gsap.set(words, { yPercent: 105, opacity: 0 });
              gsap.to(words, {
                yPercent: 0,
                opacity: 1,
                duration: 0.95,
                ease: "power4.out",
                stagger: 0.028,
                delay: 0.1,
                scrollTrigger: {
                  trigger: block,
                  start: "top 88%",
                  toggleActions: "play none none none",
                },
              });
            }

            if (annoChars?.length) {
              const annoEl = block.querySelector("[data-waarom-anno]");
              if (annoEl) {
                gsap.set(annoEl, { letterSpacing: "0.28em", opacity: 0 });
                gsap.to(annoEl, {
                  letterSpacing: "0.14em",
                  opacity: 1,
                  duration: 0.85,
                  ease: "power3.out",
                  delay: 0.22 + i * 0.04,
                  scrollTrigger: {
                    trigger: block,
                    start: "top 88%",
                    toggleActions: "play none none none",
                  },
                });
              }
              gsap.set(annoChars, { opacity: 0, y: 8 });
              gsap.to(annoChars, {
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: "power3.out",
                stagger: 0.04,
                delay: 0.3 + i * 0.04,
                scrollTrigger: {
                  trigger: block,
                  start: "top 88%",
                  toggleActions: "play none none none",
                },
              });
            }
          });

          if (imgFrameRef.current) {
            gsap.set(imgFrameRef.current, {
              clipPath: "inset(0 100% 0 0)",
              opacity: 0.6,
            });
            gsap.to(imgFrameRef.current, {
              clipPath: "inset(0 0% 0 0)",
              opacity: 1,
              duration: 1.35,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: imgFrameRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
          }

          if (imgWrapRef.current) {
            gsap.fromTo(
              imgWrapRef.current,
              { y: 48 },
              {
                y: -48,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.9,
                },
              },
            );
          }
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
      id="waarom"
      ref={sectionRef}
      className="relative z-10 overflow-hidden border-t border-hairline bg-paper py-24 md:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 sm-grid-paper opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] top-[10%] h-[min(70vw,36rem)] w-[min(70vw,36rem)] rounded-full bg-pulse/[0.06] blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[15%] bottom-[5%] h-[min(55vw,28rem)] w-[min(55vw,28rem)] rounded-full bg-pulsedeep/[0.04] blur-[90px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <p ref={annoRef} className="sm-anno text-pulsedeep">
          Waarom
        </p>
        <div className="relative mt-4">
          <span
            data-waarom-headline-line
            className="absolute -left-6 top-3 hidden h-px w-8 bg-pulse md:block"
            aria-hidden
          />
          <h2
            ref={headlineRef}
            className="max-w-3xl text-4xl font-black leading-[1.02] tracking-tighter text-ink md:text-6xl"
          >
            Ontstaan vanuit een duidelijke behoefte
          </h2>
        </div>
        <p ref={subtitleRef} className="mt-5 max-w-lg text-inkmuted">
          Van signaal naar structuur — het verhaal achter Smartium, in drie stappen.
        </p>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-[1400px] grid-cols-1 gap-16 px-6 lg:mt-20 lg:grid-cols-12 lg:gap-12 lg:px-10 xl:gap-16">
        <div className="lg:col-span-7">
          <div ref={timelineRef} className="relative">
            <span
              data-waarom-spine
              className="absolute bottom-4 left-[1.3125rem] top-4 w-px origin-top bg-gradient-to-b from-pulse/70 via-hairline to-transparent md:left-[1.4375rem]"
              aria-hidden
            />

            <ol className="space-y-0">
              {STEPS.map((step, i) => (
                <li
                  key={step.index}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className="group relative grid grid-cols-[auto_1fr] gap-x-5 gap-y-0 pb-10 last:pb-0 md:gap-x-7 md:pb-12"
                >
                  <div className="relative z-[1] flex flex-col items-center pt-0.5">
                    <span
                      data-waarom-index
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-pulse/35 bg-panel font-anno text-[0.6875rem] font-medium tracking-wider text-pulsedeep shadow-[0_0_0_4px_rgba(242,247,249,1),0_8px_24px_-8px_rgba(6,182,212,0.25)] transition-colors duration-300 group-hover:border-pulse/60 group-hover:bg-pulse/[0.06] md:h-12 md:w-12"
                    >
                      {step.index}
                    </span>
                  </div>

                  <article className="min-w-0 pt-1">
                    <span
                      data-waarom-anno
                      className="sm-anno inline-flex items-center gap-2 text-pulsedeep"
                    >
                      <span
                        className="h-px w-4 bg-pulse/50"
                        aria-hidden
                      />
                      {step.anno}
                    </span>
                    <p
                      data-waarom-text
                      className="mt-3 text-base leading-relaxed text-ink/90 md:text-lg md:leading-relaxed"
                    >
                      {step.text}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div
            ref={imgWrapRef}
            className="lg:sticky lg:top-28 lg:will-change-transform"
          >
            <div
              aria-hidden
              className="absolute -right-3 -top-3 h-full w-full border border-hairline bg-panel/80 md:-right-4 md:-top-4"
            />
            <div
              aria-hidden
              className="absolute -left-2 bottom-[-0.75rem] right-8 h-24 border-x border-b border-pulse/25 bg-pulse/[0.04] md:h-28"
            />

            <figure
              ref={imgFrameRef}
              className="relative overflow-hidden border border-hairline bg-panel p-2 shadow-[0_24px_60px_-24px_rgba(11,34,48,0.14)] will-change-[clip-path,opacity] md:p-3"
            >
              <div className="relative overflow-hidden">
                <img
                  src={assetUrl('assets/waarom-notes.png')}
                  alt="Aantekeningen met een anatomische schets en cyaan markeringen"
                  className="h-auto w-full"
                  loading="lazy"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper/20 via-transparent to-pulse/[0.03]"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
                <span className="sm-anno text-inkmuted/75">Fig. 01 · Blokstof</span>
                <span className="sm-anno rounded border border-pulse/35 bg-pulse/[0.06] px-2 py-0.5 text-pulsedeep">
                  Geordend
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
