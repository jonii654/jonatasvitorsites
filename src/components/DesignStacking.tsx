import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

/**
 * Letreiro DESIGN gigante de transição.
 * O efeito de cards empilhados foi movido para Interactive3DCard.
 */
export function DesignStacking() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (!wrapperRef.current || !wordRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordRef.current!,
        { opacity: 0.08, scale: 0.95 },
        {
          opacity: 0.22,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: isMobile ? 0.6 : 1.1,
          },
        }
      );
    }, wrapperRef);
    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="design"
      ref={wrapperRef}
      className="relative w-full overflow-hidden"
      style={{ height: isMobile ? '90vh' : '110vh', background: 'hsl(220 50% 6%)' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute top-10 md:top-16 left-0 right-0 text-center z-20 px-4">
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
      </div>
    </section>
  );
}
