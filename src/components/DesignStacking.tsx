import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';
import portfolioVivendo from '@/assets/portfolio-vivendo.png';
import portfolioBeatriz from '@/assets/portfolio-beatriz.png';
import portfolioClinica from '@/assets/portfolio-clinicaiphone.png';

gsap.registerPlugin(ScrollTrigger);

/**
 * WORK stacking — 3 cards compactos atravessam a palavra gigante "WORK".
 * Inspirado em moss/namma. Z-index dos cards é maior que o texto.
 */
export function DesignStacking() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(card2Ref.current, { yPercent: 130 });
      gsap.set(card3Ref.current, { yPercent: 130 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: isMobile ? 0.7 : 1.1,
        },
      });

      tl.to(bgTextRef.current, { scale: 1.05, opacity: 0.18, duration: 1 }, 0)
        .to(card1Ref.current, { scale: 0.88, opacity: 0.35, yPercent: -10, duration: 1.5, force3D: true }, 0.5)
        .to(card2Ref.current, { yPercent: 0, duration: 2, ease: 'power2.out', force3D: true }, 0.6)
        .to(card2Ref.current, { scale: 0.9, opacity: 0.35, yPercent: -8, duration: 1.5, force3D: true }, 2.2)
        .to(card3Ref.current, { yPercent: 0, duration: 2, ease: 'power2.out', force3D: true }, 2.3);
    }, wrapperRef);
    return () => ctx.revert();
  }, [isMobile]);

  const cards = [
    {
      ref: card1Ref,
      img: portfolioVivendo,
      tag: 'SaaS & Startups',
      title: 'VIVENDO PODEROSAMENTE',
      desc: 'Landing pages de alta conversão com design limpo e moderno.',
      bg: 'hsl(220 50% 8%)',
      tagColor: 'text-muted-foreground',
      titleColor: 'text-foreground',
    },
    {
      ref: card2Ref,
      img: portfolioBeatriz,
      tag: 'Luxury Brand',
      title: 'BEATRIZ',
      desc: 'Experiência visual impecável estruturada para marcas premium.',
      bg: '#18211a',
      tagColor: 'text-[#a3bfa0]',
      titleColor: 'text-[#e8e0d5]',
    },
    {
      ref: card3Ref,
      img: portfolioClinica,
      tag: 'Tech & Service',
      title: 'CLÍNICA DO iPHONE',
      desc: 'Sistemas com conexões inteligentes e interfaces otimizadas.',
      bg: '#231d18',
      tagColor: 'text-[#d5bba0]',
      titleColor: 'text-[#e8e0d5]',
    },
  ];

  return (
    <section
      id="design"
      ref={wrapperRef}
      className="relative w-full overflow-hidden"
      style={{ height: isMobile ? '280vh' : '350vh', background: 'hsl(220 50% 6%)' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* WORK texto gigante atrás */}
        <div
          ref={bgTextRef}
          aria-hidden
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0.1, willChange: 'transform, opacity' }}
        >
          <span
            className="font-display font-black text-foreground leading-none tracking-tighter"
            style={{ fontSize: '30vw', letterSpacing: '-0.06em' }}
          >
            WORK
          </span>
        </div>

        {/* Header overlay */}
        <div className="absolute top-8 md:top-12 left-0 right-0 z-30 text-center px-4 pointer-events-none">
          <span className="section-label">Trabalhos</span>
          <h2 className="font-serif italic text-2xl md:text-4xl text-foreground mt-2">
            O design quem faz é{' '}
            <span className="text-neon-gradient not-italic font-bold">você</span>
          </h2>
        </div>

        {/* Cards compactos passando POR CIMA do texto */}
        <div className="relative w-full max-w-2xl h-[70vh] flex items-center justify-center z-10 px-4">
          {cards.map((c, i) => (
            <div
              key={i}
              ref={c.ref}
              className="absolute w-full max-w-xs md:max-w-sm rounded-3xl p-5 flex flex-col gap-4 shadow-2xl border border-foreground/5"
              style={{ background: c.bg, willChange: 'transform, opacity' }}
            >
              <div className="w-full h-36 md:h-48 rounded-2xl overflow-hidden border border-foreground/5 bg-background">
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-full h-full object-cover opacity-90"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <span className={`text-[9px] uppercase tracking-widest font-bold border border-foreground/10 px-2 py-0.5 rounded-full ${c.tagColor}`}>
                  {c.tag}
                </span>
                <h3 className={`font-display text-base font-black mt-2 mb-1 ${c.titleColor}`}>
                  {c.title}
                </h3>
                <p className="text-muted-foreground text-[11px] font-light leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
