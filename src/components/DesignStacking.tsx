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

          // Cards começam embaixo, fora do quadro
          gsap.set(stackRefs.current, {
            yPercent: 110,
            opacity: 1,
            scale: 1,
            force3D: true,
            transformOrigin: 'center center',
          });
          // Pilot card visível como base no início
          if (pilotRef.current) {
            gsap.set(pilotRef.current, { yPercent: 0, opacity: 1, scale: 1, force3D: true });
          }
          // Heading visível no início
          gsap.set(headingRef.current, { autoAlpha: 1, y: 0 });
          gsap.set(bgTextRef.current, { scale: 1, opacity: 0.9 });

          const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut', force3D: true },
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: mobile ? 1.6 : 1.4,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
            },
          });

          // Heading desaparece e watermark ENCOLHE ao rolar (fica legível)
          tl.to(headingRef.current, { autoAlpha: 0, y: -24, duration: 0.4, ease: 'none' }, 0)
            .to(
              bgTextRef.current,
              {
                scale: mobile ? 0.45 : 0.6,
                opacity: 0.35,
                duration: 4.6,
                ease: 'none',
              },
              0,
            );

          // Pilot card sai subindo enquanto card 1 entra de baixo
          if (pilotRef.current) {
            tl.to(pilotRef.current, { yPercent: -110, duration: 0.7 }, 0.4);
          }
          // Card 1 entra
          tl.to(stackRefs.current[0], { yPercent: 0, duration: 0.7 }, 0.5);
          // Card 1 sobe saindo / Card 2 entra
          tl.to(stackRefs.current[0], { yPercent: -110, duration: 0.7 }, 1.5)
            .to(stackRefs.current[1], { yPercent: 0, duration: 0.7 }, 1.6);
          // Card 2 sobe / Card 3 entra
          tl.to(stackRefs.current[1], { yPercent: -110, duration: 0.7 }, 2.5)
            .to(stackRefs.current[2], { yPercent: 0, duration: 0.7 }, 2.6);
          // Card 3 sobe / Card 4 (Artesanal) entra — antecipa no mobile
          const card4In = mobile ? 3.2 : 3.6;
          tl.to(stackRefs.current[2], { yPercent: -110, duration: 0.7 }, card4In - 0.4)
            .to(stackRefs.current[3], { yPercent: 0, duration: 0.7 }, card4In);
          // Hold do card 4 totalmente visível antes de sair da seção
          tl.to(stackRefs.current[3], { yPercent: 0, duration: 1.6 }, card4In + 0.9);

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
      style={{ height: isMobile ? '420vh' : '560vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-background">
        {/* Watermark DESIGN */}
        <div
          ref={bgTextRef}
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0.85, willChange: 'transform, opacity' }}
        >
          <span
            className="font-display font-black tracking-tighter leading-none text-white"
            style={{
              fontSize: 'clamp(6rem, 42vw, 60rem)',
              letterSpacing: '-0.06em',
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
          </div>

          {/* Stack container: pilot base + 4 cards subindo */}
          <div className="relative w-[72vw] max-w-[260px] md:max-w-[300px] aspect-square">
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
