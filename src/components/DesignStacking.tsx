import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';
import card1 from '@/assets/design-ref-1-hadi.jpg';
import card2 from '@/assets/design-ref-2-kpr.jpg';
import card3 from '@/assets/design-ref-3-ascend.jpg';
import card4 from '@/assets/design-ref-4-oryzo.jpg';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { img: card1, label: 'Performance' },
  { img: card2, label: 'Bold' },
  { img: card3, label: 'Editorial' },
  { img: card4, label: 'Artesanal' },
];

/**
 * Scroll-jacked stacking cards over a giant background word — port of the
 * "MOSS VIBE" timeline from the user's reference HTML to GSAP + React.
 * Stacks 4 cards: each new card slides up from the bottom while the previous
 * card scales down and fades. Heavily GPU-accelerated.
 */
export function DesignStacking() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const wordRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(cardsRef.current[0], { scale: 1, opacity: 1, yPercent: 0 });
      gsap.set(cardsRef.current[1], { yPercent: 100, opacity: 1, scale: 1 });
      gsap.set(cardsRef.current[2], { yPercent: 100, opacity: 1, scale: 1 });
      gsap.set(cardsRef.current[3], { yPercent: 100, opacity: 1, scale: 1 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none', force3D: true } });

      // Step 1: card 2 sobe, card 1 recua
      tl.to(cardsRef.current[1], { yPercent: 0, duration: 1 }, 0)
        .to(cardsRef.current[0], { scale: 0.88, opacity: 0.35, yPercent: -10, duration: 1 }, 0)
        // Step 2: card 3 sobe, card 2 recua
        .to(cardsRef.current[2], { yPercent: 0, duration: 1 }, 1)
        .to(cardsRef.current[1], { scale: 0.9, opacity: 0.35, yPercent: -8, duration: 1 }, 1)
        // Step 3: card 4 sobe, card 3 recua
        .to(cardsRef.current[3], { yPercent: 0, duration: 1 }, 2)
        .to(cardsRef.current[2], { scale: 0.92, opacity: 0.35, yPercent: -6, duration: 1 }, 2);

      if (wordRef.current) {
        tl.fromTo(wordRef.current, { opacity: 0.08, scale: 0.95 }, { opacity: 0.18, scale: 1.05, duration: 3 }, 0);
      }

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: isMobile ? 0.6 : 1.1,
        onUpdate: self => tl.progress(self.progress),
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="design"
      ref={wrapperRef}
      className="relative w-full"
      style={{ height: isMobile ? '280vh' : '400vh' }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
        style={{ background: 'hsl(220 50% 6%)' }}
      >
        <div className="absolute top-8 md:top-12 left-0 right-0 text-center z-20 px-4">
          <span className="section-label">Design</span>
          <h2 className="font-serif italic text-3xl md:text-5xl text-foreground mt-2">
            O design quem faz é{' '}
            <span className="text-neon-gradient not-italic font-bold">você</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mt-3 font-light">
            Você escolhe a direção. Eu transformo em interface.
          </p>
        </div>

        <div
          ref={wordRef}
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0.08, willChange: 'transform, opacity' }}
        >
          <span
            className="font-display font-black text-foreground leading-none tracking-tighter"
            style={{ fontSize: '28vw', letterSpacing: '-0.06em' }}
          >
            DESIGN
          </span>
        </div>

        <div className="relative w-[82vw] max-w-md md:max-w-lg aspect-[3/4] z-10">
          {CARDS.map((card, i) => (
            <div
              key={i}
              ref={el => { if (el) cardsRef.current[i] = el; }}
              className="absolute inset-0 rounded-3xl overflow-hidden border border-foreground/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
              style={{ willChange: 'transform, opacity' }}
            >
              <img src={card.img} alt={card.label} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <span className="text-foreground font-display font-bold text-2xl md:text-3xl">
                  {card.label}
                </span>
                <span className="text-foreground/60 font-mono text-xs">
                  0{i + 1} / 0{CARDS.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
