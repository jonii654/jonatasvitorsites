import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';
import pilotImage from '@/assets/pilot-card.jpg';
import card1 from '@/assets/design-ref-1-hadi.jpg';
import card2 from '@/assets/design-ref-2-kpr.jpg';
import card3 from '@/assets/design-ref-3-ascend.jpg';
import card4 from '@/assets/design-ref-4-oryzo.jpg';

gsap.registerPlugin(ScrollTrigger);

const STACK_CARDS = [
  { img: card1, label: 'Performance' },
  { img: card2, label: 'Bold' },
  { img: card3, label: 'Editorial' },
  { img: card4, label: 'Artesanal' },
];

/**
 * "O design quem faz é você" — heading + subtítulo somem ao rolar,
 * deixando a palavra gigante DESIGN como watermark. Pilot card serve de
 * base e os 4 design-refs sobem por cima, inspirado no MOSS template.
 */
export function DesignStacking() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const pilotRef = useRef<HTMLDivElement>(null);
  const stackRefs = useRef<HTMLDivElement[]>([]);
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '100px' }
    );
    if (wrapperRef.current) obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: '(max-width: 767px)',
          isDesktop: '(min-width: 768px)',
        },
        (context) => {
          const { isMobile: mobile } = context.conditions as { isMobile: boolean };

          gsap.set(stackRefs.current, {
            yPercent: 100,
            opacity: 1,
            scale: 1,
            force3D: true,
            transformOrigin: 'center center',
          });

          const tl = gsap.timeline({ paused: true, defaults: { ease: 'none', force3D: true } });

          tl.to(headingRef.current, { autoAlpha: 0, y: -24, duration: 0.5 }, 0)
            .to(bgTextRef.current, { scale: 1.04, opacity: 0.18, duration: 4.5 }, 0);

          tl.to(stackRefs.current[0], { yPercent: 0, duration: 1 }, 0.6);
          if (pilotRef.current) {
            tl.to(pilotRef.current, { scale: 0.88, opacity: 0.35, yPercent: -10, duration: 1 }, 0.6);
          }
          tl.to(stackRefs.current[1], { yPercent: 0, duration: 1 }, 1.6)
            .to(stackRefs.current[0], { scale: 0.92, opacity: 0.45, yPercent: -8, duration: 1 }, 1.6);
          tl.to(stackRefs.current[2], { yPercent: 0, duration: 1 }, 2.6)
            .to(stackRefs.current[1], { scale: 0.93, opacity: 0.45, yPercent: -6, duration: 1 }, 2.6);
          tl.to(stackRefs.current[3], { yPercent: 0, duration: 1 }, 3.6)
            .to(stackRefs.current[2], { scale: 0.94, opacity: 0.45, yPercent: -5, duration: 1 }, 3.6);

          ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: mobile ? 1.2 : 1.1,
            fastScrollEnd: true,
            preventOverlaps: true,
            onUpdate: (self) => tl.progress(self.progress),
          });
        }
      );
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="design"
      ref={wrapperRef}
      className="relative w-full"
      style={{ height: isMobile ? '280vh' : '560vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-background">
        {/* Watermark DESIGN */}
        <div
          ref={bgTextRef}
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0.12, willChange: 'transform, opacity' }}
        >
          <span
            className="font-display font-black tracking-tighter leading-none text-white"
            style={{
              fontSize: 'clamp(16rem, 55vw, 44rem)',
              letterSpacing: '-0.05em',
            }}
          >
            DESIGN
          </span>
        </div>

        {/* Glow — apenas desktop (blur é caro no mobile) */}
        {isVisible && !isMobile && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
        )}


  return (
    <section
      id="design"
      ref={wrapperRef}
      className="relative w-full"
      style={{ height: isMobile ? '380vh' : '560vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-background">
        {/* Watermark DESIGN */}
        <div
          ref={bgTextRef}
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0.08, willChange: 'transform, opacity' }}
        >
          <span
            className="font-display font-black tracking-tighter leading-none text-white"
            style={{
              fontSize: 'clamp(12rem, 32vw, 28rem)',
              letterSpacing: '-0.05em',
            }}
          >
            DESIGN
          </span>
        </div>

        {/* Glow */}
        {isVisible && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
        )}

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center">
          {/* Heading que some no scroll */}
          <div
            ref={headingRef}
            className="mb-10 md:mb-14 text-center"
            style={{ willChange: 'transform, opacity' }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              <span className="block text-white" style={{ textShadow: '0 2px 4px hsl(220 50% 5% / 0.5)' }}>
                O DESIGN
              </span>
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, hsl(155 100% 55%) 0%, hsl(195 100% 60%) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                QUEM FAZ É VOCÊ!
              </span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
              Role para revelar as direções de design — cada card é uma linguagem visual possível.
            </p>
          </div>

          {/* Stack container: pilot base + 4 cards subindo */}
          <div className="relative w-[88vw] max-w-md md:max-w-2xl aspect-[16/10]">
            {/* Pilot card (base) */}
            <div
              ref={pilotRef}
              className="absolute inset-0 z-0 rounded-2xl overflow-hidden border border-foreground/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
              style={{ willChange: 'transform, opacity' }}
            >
              <div
                className="absolute inset-0 rounded-2xl p-[1px]"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.5), hsl(var(--accent) / 0.3))',
                }}
              >
                <div className="w-full h-full rounded-[15px] overflow-hidden bg-card/80">
                  <img
                    src={pilotImage}
                    alt="Design Premium"
                    className="w-full h-full object-cover"
                    draggable={false}
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            {/* Stack de 4 cards */}
            {STACK_CARDS.map((card, i) => (
              <div
                key={i}
                ref={el => { if (el) stackRefs.current[i] = el; }}
                className="absolute inset-0 rounded-2xl overflow-hidden border border-foreground/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
                style={{ willChange: 'transform, opacity', zIndex: i + 1 }}
              >
                <img src={card.img} alt={card.label} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <span className="text-foreground font-display font-bold text-xl md:text-2xl">
                    {card.label}
                  </span>
                  <span className="text-foreground/60 font-mono text-xs">
                    0{i + 1} / 0{STACK_CARDS.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
