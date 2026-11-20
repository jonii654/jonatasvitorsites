import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDeviceTier } from '@/hooks/use-device-tier';
import valueDesign from '@/assets/value-design.webp';
import valueResults from '@/assets/value-results.webp';
import valueSpeed from '@/assets/value-speed.webp';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    title: 'Design estratégico',
    description: 'Cada elemento do seu site é pensado para guiar o visitante até a ação desejada. Nada é por acaso.',
    image: valueDesign,
  },
  {
    title: 'Foco em resultados',
    description: 'Sites bonitos são ótimos, mas sites que convertem são ainda melhores. Meu objetivo é te ajudar a crescer.',
    image: valueResults,
  },
  {
    title: 'Entrega rápida',
    description: 'Prazo de 7 dias do início ao lançamento. Sem enrolação, sem atrasos. Seu tempo é valioso.',
    image: valueSpeed,
  },
];
const strip = [...slides, ...slides];

/**
 * FoldStrip: sticky section; an accordion-folded strip of curved panels slides
 * horizontally with scroll. Scroll velocity drives an RGB-split glitch (full tier).
 */
export function Coverflow3D() {
  const isLight = useDeviceTier() === 'light';
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    const track = stripRef.current;
    if (!el || !track) return;
    const ctx = gsap.context(() => {
      const setGlitch = gsap.quickSetter(track, 'css');
      gsap.fromTo(
        track,
        { x: () => window.innerWidth * 0.6 },
        {
          x: () => -(track.scrollWidth - window.innerWidth * 0.4),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: isLight ? 0.4 : 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (isLight) return;
              const g = Math.min(8, Math.abs(self.getVelocity()) / 400);
              setGlitch({
                filter: g > 0.4
                  ? `drop-shadow(${g}px 0 0 hsl(350 100% 55% / 0.7)) drop-shadow(${-g}px 0 0 hsl(190 100% 55% / 0.7))`
                  : 'none',
              });
            },
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [isLight]);

  return (
    <section ref={sectionRef} id="beneficios" className="relative h-[320vh]">
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="fold-curve" clipPathUnits="objectBoundingBox">
            <path d="M0,0 Q0.5,0.16 1,0 L1,1 Q0.5,0.84 0,1 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mb-6 text-center md:mb-10">
          <span className="section-label">Por que me escolher</span>
          <h2 className="section-title">Meu compromisso com você</h2>
        </div>
        <div style={{ perspective: '1100px' }}>
          <div ref={stripRef} className="flex w-max will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
            {strip.map((s, i) => (
              <div
                key={i}
                className="relative h-[58vh] w-[70vw] shrink-0 md:h-[62vh] md:w-[30vw]"
                style={{
                  transform: `rotateY(${i % 2 ? -18 : 18}deg)`,
                  transformOrigin: i % 2 ? 'left center' : 'right center',
                  clipPath: 'url(#fold-curve)',
                }}
              >
                <img src={s.image} alt={s.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-[14%] px-5 md:px-7">
                  <h3 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
