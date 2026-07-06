import { Link } from 'react-router-dom'
import { assetUrl } from '../utils/landingLinks'
import { useEffect, useRef } from "react";

import { loadMotion } from "../lib/loadMotion";

const DECODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>_/";

const EXCHANGES = [
  {
    role: "user",
    text: "Wat is het verschil tussen systolisch en diastolisch hartfalen?",
  },
  {
    role: "ai",
    text: "Systolisch hartfalen: verminderde contractie van de linkerventrikel. Diastolisch: de ventrikel vult zich niet goed. Zie Samenvatting Casus 4 · Hartfalen, tabel p. 12.",
    source: "Samenvatting · Casus 4",
  },
  {
    role: "user",
    text: "Geef een korte uitleg van de renin-angiotensine-as.",
  },
  {
    role: "ai",
    text: "Renine uit de nier activeert angiotensinogeen → angiotensin I → II (ACE). Angiotensine II vernauwt vaten en stimuleert aldosteron. Kernpunt voor je tentamen: waarom ACE-remmers helpen bij hypertensie.",
    source: "Samenvatting · Nier & bloeddruk",
  },
];

/**
 * AI Chat showcase — students ask questions and get answers grounded in
 * Smartium's curriculum summaries. Product UI mockup only; no illustration overlays.
 *
 * Text reveals use masked word slides, char-stagger annotations, and a
 * sequenced chat timeline with typing beats (inspired by nithinmwarrier.com).
 */
export function LandingAiChatBand() {
  const sectionRef = useRef(null);
  const annoRef = useRef(null);
  const headlineRef = useRef(null);
  const bodyRef = useRef(null);
  const listRef = useRef(null);
  const ctaRef = useRef(null);
  const chatWrapRef = useRef(null);
  const chatPanelRef = useRef(null);
  const chatHeaderRef = useRef(null);
  const chatInputRef = useRef(null);
  const msgRefs = useRef([]);

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

        let annoSplit = null;
        if (annoRef.current) {
          annoSplit = new SplitType(annoRef.current, {
            types: "chars",
            charClass: "sm-split-char",
          });
          splits.push(annoSplit);
        }

        let bodySplit = null;
        if (bodyRef.current) {
          bodySplit = new SplitType(bodyRef.current, splitOpts);
          splits.push(bodySplit);
        }

        const aiSplits = msgRefs.current
          .map((wrapEl, i) => {
            if (!wrapEl || EXCHANGES[i]?.role !== "ai") return null;
            const bubbleEl = wrapEl.querySelector("[data-chat-ai-bubble]");
            const textEl = wrapEl.querySelector("[data-chat-ai-text]");
            if (!bubbleEl || !textEl) return null;
            const split = new SplitType(textEl, splitOpts);
            splits.push(split);
            const sourceEl = wrapEl.querySelector("[data-chat-ai-source]");
            const sourceSplit = sourceEl
              ? new SplitType(sourceEl, {
                  types: "chars",
                  charClass: "sm-split-char",
                })
              : null;
            if (sourceSplit) splits.push(sourceSplit);
            const typingEl = wrapEl.querySelector("[data-chat-typing]");
            return { wrapEl, bubbleEl, split, sourceSplit, typingEl };
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

          gsap.set("[data-chat-headline-line]", {
            scaleX: 0,
            transformOrigin: "left center",
          });
          gsap.to("[data-chat-headline-line]", {
            scaleX: 1,
            duration: 1,
            ease: "power2.inOut",
            delay: 0.18,
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
              stagger: 0.038,
              delay: 0.12,
              scrollTrigger: {
                trigger: headline,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
          }

          if (bodySplit?.words?.length) {
            gsap.set(bodySplit.words, { yPercent: 105, opacity: 0 });
            gsap.to(bodySplit.words, {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.022,
              delay: 0.42,
              scrollTrigger: {
                trigger: headline,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
          }

          if (listRef.current) {
            gsap.from("[data-chat-bullet]", {
              scale: 0,
              opacity: 0,
              duration: 0.45,
              ease: "back.out(2)",
              stagger: 0.08,
              delay: 0.55,
              scrollTrigger: {
                trigger: listRef.current,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            });
            gsap.from("[data-chat-li]", {
              x: -14,
              opacity: 0,
              duration: 0.65,
              ease: "power3.out",
              stagger: 0.1,
              delay: 0.62,
              scrollTrigger: {
                trigger: listRef.current,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            });
          }

          if (ctaRef.current) {
            gsap.from(ctaRef.current, {
              y: 16,
              opacity: 0,
              duration: 0.75,
              ease: "power3.out",
              delay: 0.85,
              scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 92%",
                toggleActions: "play none none none",
              },
            });
          }

          const panel = chatPanelRef.current;
          const chatHeader = chatHeaderRef.current;
          const chatInput = chatInputRef.current;

          if (panel && msgRefs.current.some(Boolean)) {
            gsap.set(panel, { clipPath: "inset(0 100% 0 0)", opacity: 0.85 });
            gsap.set("[data-chat-typing]", { opacity: 0 });
            if (chatHeader) gsap.set(chatHeader, { opacity: 0, y: 10 });
            if (chatInput) gsap.set(chatInput, { opacity: 0, y: 12 });

            EXCHANGES.forEach((exchange, i) => {
              const msgEl = msgRefs.current[i];
              if (!msgEl || exchange.role !== "user") return;
              gsap.set(msgEl, { x: 36, opacity: 0 });
            });
            aiSplits.forEach(({ bubbleEl }) => {
              gsap.set(bubbleEl, { y: 14, opacity: 0 });
            });
            aiSplits.forEach(({ split }) => {
              const words = split.words;
              if (words?.length) gsap.set(words, { yPercent: 108, opacity: 0 });
            });
            aiSplits.forEach(({ sourceSplit }) => {
              const chars = sourceSplit?.chars;
              if (chars?.length) gsap.set(chars, { opacity: 0, y: 6 });
            });

            const chatTl = gsap.timeline({
              scrollTrigger: {
                trigger: chatWrapRef.current ?? panel,
                start: "top 78%",
                toggleActions: "play none none none",
              },
            });

            chatTl.to(panel, {
              clipPath: "inset(0 0% 0 0)",
              opacity: 1,
              duration: 1.15,
              ease: "power3.inOut",
            });

            if (chatHeader) {
              chatTl.to(
                chatHeader,
                { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
                "-=0.55",
              );
            }

            let aiIdx = 0;
            let msgStep = 0;
            EXCHANGES.forEach((exchange, i) => {
              const msgEl = msgRefs.current[i];
              if (!msgEl) return;

              const stepOffset = msgStep === 0 ? "-=0.15" : "+=0.35";
              msgStep += 1;

              if (exchange.role === "user") {
                chatTl.to(
                  msgEl,
                  {
                    opacity: 1,
                    x: 0,
                    duration: 0.55,
                    ease: "power3.out",
                  },
                  stepOffset,
                );
              } else {
                const ai = aiSplits[aiIdx];
                aiIdx += 1;
                if (!ai) return;

                const { bubbleEl, split, sourceSplit, typingEl } = ai;
                const words = split.words;
                const sourceChars = sourceSplit?.chars;

                if (typingEl) {
                  chatTl.to(
                    typingEl,
                    { opacity: 1, duration: 0.25, ease: "power2.out" },
                    stepOffset,
                  );
                  chatTl.to(
                    typingEl.querySelectorAll("[data-chat-dot]"),
                    {
                      opacity: 0.35,
                      duration: 0.32,
                      stagger: 0.14,
                      repeat: 2,
                      yoyo: true,
                      ease: "power1.inOut",
                    },
                    "<",
                  );
                  chatTl.to(typingEl, { opacity: 0, duration: 0.2 }, "+=0.05");
                }

                chatTl.to(
                  bubbleEl,
                  { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
                  "-=0.08",
                );

                if (words?.length) {
                  chatTl.to(
                    words,
                    {
                      yPercent: 0,
                      opacity: 1,
                      duration: 0.72,
                      ease: "power4.out",
                      stagger: 0.024,
                    },
                    "-=0.2",
                  );
                }

                if (sourceChars?.length) {
                  chatTl.to(
                    sourceChars,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.38,
                      ease: "power3.out",
                      stagger: 0.022,
                    },
                    "-=0.35",
                  );
                }
              }
            });

            if (chatInput) {
              chatTl.to(
                chatInput,
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
                "+=0.25",
              );
            }
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

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const label = el.querySelector("[data-decode]");
    if (!label) return;
    const original = label.textContent ?? "";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    let raf = 0;
    const scramble = () => {
      frame += 1;
      const settled = Math.floor(frame / 2.2);
      label.textContent = original
        .split("")
        .map((ch, i) => {
          if (ch === " " || i < settled) return ch;
          return DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)];
        })
        .join("");
      if (settled < original.length) {
        raf = requestAnimationFrame(scramble);
      } else {
        label.textContent = original;
      }
    };
    const onEnter = () => {
      cancelAnimationFrame(raf);
      frame = 0;
      raf = requestAnimationFrame(scramble);
    };
    el.addEventListener("pointerenter", onEnter);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      cancelAnimationFrame(raf);
      label.textContent = original;
    };
  }, []);

  return (
    <section
      id="ai-chat"
      ref={sectionRef}
      className="sm-grid-paper relative z-10 overflow-hidden border-t border-hairline bg-paper py-24 md:py-36"
      aria-label="Smartium AI Chat"
    >
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <div className="lg:col-span-5">
          <p ref={annoRef} className="sm-anno text-pulsedeep">
            AI Chat
          </p>
          <div className="relative mt-4">
            <span
              data-chat-headline-line
              className="absolute -left-6 top-3 hidden h-px w-8 origin-left bg-pulse md:block"
              aria-hidden
            />
            <h2
              ref={headlineRef}
              className="text-4xl font-black leading-[1.02] tracking-tighter text-ink md:text-5xl"
            >
              Leerstof
            </h2>
          </div>
          <p
            ref={bodyRef}
            className="mt-5 max-w-md text-base leading-relaxed text-inkmuted md:text-lg"
          >
            Stel vragen over de stof en krijg antwoorden met bronverwijzing naar de
            Smartium-samenvattingen voor jouw blok. Geen losse zoekresultaten, maar uitleg
            die aansluit op het curriculum.
          </p>

          <ul ref={listRef} className="mt-8 space-y-3 text-sm text-ink/85">
            <li data-chat-li className="flex items-start gap-3">
              <span
                data-chat-bullet
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pulse"
                aria-hidden
              />
              Vraag over casussen, anatomie of farmacologie
            </li>
            <li data-chat-li className="flex items-start gap-3">
              <span
                data-chat-bullet
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pulse"
                aria-hidden
              />
              Bronverwijzing naar relevante samenvattingen
            </li>
            <li data-chat-li className="flex items-start gap-3">
              <span
                data-chat-bullet
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pulse"
                aria-hidden
              />
              Beschikbaar in elk betaald plan
            </li>
          </ul>

          <Link
            ref={ctaRef}
            to={"/chat"}
            data-cursor="target"
            className="sm-anno group mt-10 inline-flex items-center gap-3 border border-pulse/60 bg-panel px-5 py-3.5 text-pulsedeep transition-colors duration-300 hover:border-pulse hover:bg-pulse/5"
          >
            <span aria-hidden>&gt;_</span>
            <span data-decode>Probeer AI Chat</span>
          </Link>
        </div>

        {/* live chat mockup */}
        <div ref={chatWrapRef} className="relative lg:col-span-7">
          <div
            ref={chatPanelRef}
            className="border border-hairline bg-panel/95 p-4 shadow-[0_24px_60px_-20px_rgba(11,34,48,0.18)] backdrop-blur-sm will-change-[clip-path,opacity] md:p-6"
          >
            <div
              ref={chatHeaderRef}
              className="flex items-center justify-between border-b border-hairline pb-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={assetUrl('assets/smartium-logo.png')}
                  alt=""
                  className="h-9 w-9 object-contain"
                />
                <div>
                  <p className="text-sm font-bold text-ink">Smartium AI Chat</p>
                  <p className="sm-anno text-inkmuted/80">Bron: Smartium-samenvattingen</p>
                </div>
              </div>
              <span className="sm-anno rounded border border-pulse/40 px-2 py-1 text-pulsedeep">
                Actief
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {EXCHANGES.map((msg, i) =>
                msg.role === "user" ? (
                  <div
                    key={i}
                    ref={(el) => {
                      msgRefs.current[i] = el;
                    }}
                    className="flex justify-end will-change-transform"
                  >
                    <div className="max-w-[85%] border border-hairline bg-paper px-4 py-3 text-sm leading-relaxed text-ink">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div
                    key={i}
                    ref={(el) => {
                      msgRefs.current[i] = el;
                    }}
                    className="space-y-2"
                  >
                    <div
                      data-chat-typing
                      className="flex justify-start pl-1"
                      aria-hidden
                    >
                      <span className="inline-flex items-center gap-1 rounded border border-pulse/25 bg-pulse/5 px-3 py-2">
                        <span
                          data-chat-dot
                          className="h-1.5 w-1.5 rounded-full bg-pulse/70"
                        />
                        <span
                          data-chat-dot
                          className="h-1.5 w-1.5 rounded-full bg-pulse/70"
                        />
                        <span
                          data-chat-dot
                          className="h-1.5 w-1.5 rounded-full bg-pulse/70"
                        />
                      </span>
                    </div>
                    <div
                      data-chat-ai-bubble
                      className="flex justify-start will-change-transform"
                    >
                      <div className="max-w-[90%] border border-pulse/30 bg-pulse/5 px-4 py-3">
                        <p
                          data-chat-ai-text
                          className="text-sm leading-relaxed text-ink"
                        >
                          {msg.text}
                        </p>
                        <p
                          data-chat-ai-source
                          className="sm-anno mt-2 text-pulsedeep"
                        >
                          {msg.source}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div
              ref={chatInputRef}
              className="mt-5 flex items-center gap-3 border border-hairline bg-paper px-4 py-3 will-change-transform"
            >
              <span className="flex-1 text-sm text-inkmuted">Stel een vraag over je stof…</span>
              <span className="sm-anno text-pulse">↵</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
