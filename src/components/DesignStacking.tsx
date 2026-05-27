import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';
import mosaic1 from '@/assets/portfolio-mosaic-1.webp';
import mosaic2 from '@/assets/portfolio-mosaic-2.webp';
import mosaic3 from '@/assets/portfolio-mosaic-3.webp';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { img: mosaic1, label: 'Editorial' },
  { img: mosaic2, label: 'Conversão' },
  { img: mosaic3, label: 'Marca' },
];

/**
 * Scroll-jacked stacking cards over giant background word — port of the
 * "MOSS VIBE" timeline from the reference HTML to GSAP+React.
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

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
      tl.to(cardsRef.current[1], { yPercent: 0, duration: 1 }, 0)
        .to(cardsRef.current[0], { scale: 0.88, opacity: 0.4, yPercent: -10, duration: 1 }, 0)
        .to(cardsRef.current[2], { yPercent: 0, duration: 1 }, 1)
        .to(cardsRef.current[1], { scale: 0.9, opacity: 0.4, yPercent: -8, duration: 1 }, 1);

      if (wordRef.current) {
        tl.fromTo(wordRef.current, { opacity: 0.08 }, { opacity: 0.18, duration: 2 }, 0);
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
      style={{ height: isMobile ? '220vh' : '300vh' }}
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
          style={{ opacity: 0.08 }}
        >
          <span
            className="font-display font-black text-foreground leading-none tracking-tighter"
            style={{ fontSize: '28vw', letterSpacing: '-0.06em' }}
          >
            DESIGN
          </span>
        </div>

        <div className="relative w-[80vw] max-w-md md:max-w-lg aspect-[3/4] z-10">
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
