import { Link } from 'react-router-dom'
import { assetUrl, useGetStartedPath } from '../utils/landingLinks'
import { useEffect, useRef } from 'react'

import { loadMotion } from '../lib/loadMotion'
import { scrollToTarget } from './smoothScroll'

const FRAME_COUNT = 100;
const framePath = (i) =>
  `${import.meta.env.BASE_URL}frames/hero/frame_${String(i + 1).padStart(4, "0")}.jpg`;

/** Horizontal focal point for cover crop — heart sits on the right of the plate. */
function getHeroFocalX(viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024) {
  if (viewportWidth < 640) return 0.94
  if (viewportWidth < 768) return 0.86
  return 0.7
}

function coverDrawRect(img, cw, ch, focalX = 0.7, focalY = 0.5) {
  const scale = Math.max(cw / img.width, ch / img.height)
  const w = img.width * scale
  const h = img.height * scale
  return {
    x: focalX * (cw - w),
    y: focalY * (ch - h),
    w,
    h,
  }
}

/**
 * Tier-1 mechanic (wow-catalog A1): the visitor's scroll plays a generated
 * film of the glass heart coming alive. The section is pinned with
 * pinSpacing: false, so the next section slides over it like a curtain while
 * the film scrubs underneath; a full-page screenshot therefore shows no dead
 * band. First paint is the static hero image (SSR), canvas takes over only
 * after frame 1 is decoded. Reduced motion: static image, no pin, no film.
 */
export function LandingHero() {
  const getStarted = useGetStartedPath()
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const scanRef = useRef(null);
  const primaryRef = useRef(null);
  const waveRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (reduced || !section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let cleanup;

    void loadMotion().then(({ ScrollTrigger }) => {
      if (cancelled) return;

      const small = window.innerWidth < 768;
      const step = small ? 2 : 1;
      const indices = [];
      for (let i = 0; i < FRAME_COUNT; i += step) indices.push(i);

      const images = indices.map(() => null);
      const loaded = indices.map(() => false);
      let current = 0;
      let idleTween = null;
      let userScrolled = false;

      const draw = (slot) => {
        // nearest loaded frame at or below the requested slot
        let use = slot;
        while (use > 0 && !loaded[use]) use -= 1;
        if (!loaded[use]) return;
        const img = images[use];
        if (!img) return;
        const cw = canvas.width;
        const ch = canvas.height;
        const focalX = getHeroFocalX(window.innerWidth);
        const { x, y, w, h } = coverDrawRect(img, cw, ch, focalX, 0.5);
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, x, y, w, h);
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        draw(current);
      };
      resize();
      window.addEventListener("resize", resize);

      indices.forEach((frameIdx, slot) => {
        const img = new Image();
        img.src = framePath(frameIdx);
        img.decoding = "async";
        img.onload = () => {
          images[slot] = img;
          loaded[slot] = true;
          if (slot === 0) {
            canvas.style.opacity = "1";
            draw(0);
          }
          if (slot === current) draw(slot);
        };
        img.onerror = () => {
          loaded[slot] = false;
        };
      });

      void loadMotion().then(({ gsap }) => {
        if (cancelled) return;
        const idleMax = Math.min(24, indices.length - 1);
        const idleProxy = { slot: 0 };
        idleTween = gsap.to(idleProxy, {
          slot: idleMax,
          duration: 5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          onUpdate: () => {
            if (userScrolled) return;
            const slot = Math.round(idleProxy.slot);
            if (slot !== current) {
              current = slot;
              draw(slot);
            }
          },
        });
      });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=140%",
        pin: true,
        pinSpacing: false,
        scrub: 0.6,
        onUpdate: (self) => {
          if (self.progress > 0.02) {
            userScrolled = true;
            idleTween?.kill();
            idleTween = null;
          }
          const slot = Math.min(
            indices.length - 1,
            Math.floor(self.progress * (indices.length - 1)),
          );
          if (slot !== current) {
            current = slot;
            draw(slot);
          }
          if (scanRef.current) {
            scanRef.current.textContent = String(Math.round(self.progress * 100)).padStart(3, "0");
          }
        },
      });

      cleanup = () => {
        window.removeEventListener("resize", resize);
        idleTween?.kill();
        st.kill();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  // Magnetic pull on the primary CTA (pointer physics via quickTo, no state)
  useEffect(() => {
    const el = primaryRef.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let cancelled = false;
    let cleanup;

    void loadMotion().then(({ gsap }) => {
      if (cancelled) return;

      const qx = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const qy = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist < 120) {
          qx((e.clientX - cx) * 0.28);
          qy((e.clientY - cy) * 0.28);
        } else {
          qx(0);
          qy(0);
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      cleanup = () => window.removeEventListener("pointermove", onMove);
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  // ECG underline draws itself in on mount (visible section, mount-fired)
  useEffect(() => {
    const path = waveRef.current;
    if (!path) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let cancelled = false;

    void loadMotion().then(({ gsap }) => {
      if (cancelled) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      gsap.to(path, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", delay: 0.5 });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="sm-grid-paper relative z-0 h-dvh overflow-hidden bg-paper"
      aria-label="Study Smarter, studiemateriaal voor geneeskunde"
    >
      {/* Film layer: static hero still under the canvas, canvas fades in over it */}
      <img
        src={assetUrl('assets/hero-heart.png')}
        alt="Glazen anatomisch hart met een lichtgevende cyaan kern"
        className="absolute inset-0 h-full w-full object-cover object-[94%_center] sm:object-[86%_center] md:object-[70%_center]"
        fetchPriority="high"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300"
        aria-hidden
      />

      {/* Text block, bottom-left over the plate */}
      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-12 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20">
        <div className="max-w-xl">
          <p className="sm-anno text-pulsedeep">Nieuw curriculum · Geneeskunde</p>
          <h1 className="mt-3 sm:mt-4 text-[clamp(2.5rem,11vw,6.75rem)] font-black leading-[0.95] tracking-tighter text-ink sm:whitespace-nowrap sm:leading-none">
            Study Smarter
          </h1>
          <p className="mt-4 max-w-[18rem] text-sm leading-relaxed text-inkmuted sm:mt-5 sm:max-w-md sm:text-base md:text-lg">
            Samenvattingen, oefenvragen en tentamens die aansluiten op jouw blok.
            Alles op één plek.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 sm:mt-9 sm:gap-x-10 sm:gap-y-5">
            {/* CTA garment 2: oversized text link, ECG-waveform underline, magnetic */}
            <Link
              ref={primaryRef}
              to={getStarted}
              className="group relative inline-block text-xl font-bold text-ink will-change-transform sm:text-2xl md:text-3xl"
            >
              Aan de slag
              <svg
                className="absolute -bottom-3 left-0 w-full"
                viewBox="0 0 220 18"
                fill="none"
                aria-hidden
              >
                <path
                  ref={waveRef}
                  d="M0 12 H60 L70 12 L78 3 L86 16 L94 8 L102 12 H140 L148 12 L154 6 L160 14 L166 12 H220"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-[stroke] duration-300 group-hover:stroke-[#0e7490]"
                />
              </svg>
            </Link>

            {/* CTA garment 3: viewfinder corner brackets close around the label */}
            <button
              type="button"
              data-cursor="target"
              onClick={() => scrollToTarget("#platform")}
              className="group relative px-5 py-3 text-sm font-semibold text-ink"
            >
              <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-ink/50 transition-all duration-300 group-hover:h-full group-hover:w-full group-hover:border-pulse" />
              <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-ink/50 transition-all duration-300 group-hover:h-full group-hover:w-full group-hover:border-pulse" />
              Bekijk platform
            </button>
          </div>
        </div>

        {/* Scan readout: the scroll IS the scan */}
        <div className="absolute bottom-16 right-6 hidden items-baseline gap-2 md:flex lg:right-10 lg:bottom-20">
          <span className="sm-anno text-inkmuted">Scan</span>
          <span className="sm-anno text-2xl font-bold tracking-widest text-pulsedeep">
            <span ref={scanRef}>000</span>%
          </span>
        </div>
      </div>
    </section>
  );
}
