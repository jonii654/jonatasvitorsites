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
  const ghostRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    const track = stripRef.current;
    if (!el || !track) return;
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.fold-panel', track);
      const setters = panels.map((p) => ({
        r: gsap.quickSetter(p, 'rotationY', 'deg'),
        z: gsap.quickSetter(p, 'z', 'px'),
        o: gsap.quickSetter(p, 'opacity'),
      }));
      let centers: number[] = [];
      let vw = window.innerWidth;
      const measure = () => {
        vw = window.innerWidth;
        centers = panels.map((p) => p.offsetLeft + p.offsetWidth / 2);
      };
      measure();
      const ghost = ghostRef.current;
      const ghostO = ghost ? gsap.quickTo(ghost, 'opacity', { duration: 0.35, ease: 'power2.out' }) : null;
      const ghostX = ghost ? gsap.quickTo(ghost, 'x', { duration: 0.35, ease: 'power2.out' }) : null;

      const apply = () => {
        const x = gsap.getProperty(track, 'x') as number;
        if (ghost) gsap.set(ghost, { '--tx': `${x}px` } as gsap.TweenVars);
        for (let i = 0; i < panels.length; i++) {
          const d = gsap.utils.clamp(-1.4, 1.4, (centers[i] + x - vw / 2) / (vw / 2));
          const a = Math.abs(d);
          setters[i].r(d * 42);
          setters[i].z(-a * 120);
          setters[i].o(1 - Math.max(0, a - 0.8) * 1.4);
        }
      };

      gsap.fromTo(
        track,
        { x: () => vw * 0.5 - (centers[0] ?? 0) },
        {
          x: () => vw * 0.5 - (centers[centers.length - 1] ?? 0),
          ease: 'none',
          onUpdate: apply,
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
            onUpdate: (self) => {
              if (!ghostO || !ghostX) return;
              const v = self.getVelocity();
              const g = Math.min(1, Math.abs(v) / 2500);
              ghostO(g * 0.55);
              ghostX(Math.sign(v) * g * -10);
            },
          },
        },
      );
      apply();
      if (ghostO) ScrollTrigger.addEventListener('scrollEnd', () => ghostO(0));
    }, el);
    return () => ctx.revert();
  }, [isLight]);

  const panelCls = 'fold-panel relative h-[64vh] w-[62vw] shrink-0 overflow-hidden md:h-[70vh] md:w-[26vw]';

  return (
    <section ref={sectionRef} id="beneficios" className="relative h-[320vh] bg-background">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="relative z-20 pt-24 text-center md:pt-28">
          <span className="section-label">Por que me escolher</span>
          <h2 className="section-title">Meu compromisso com você</h2>
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-0 flex items-center" style={{ perspective: '900px' }}>
            <div ref={stripRef} className="flex w-max will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
              {strip.map((s, i) => (
                <div key={i} className={panelCls}>
                  <img src={s.image} alt={s.title} loading="eager" decoding="async" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-[22%] px-5 md:px-7">
                    <h3 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {!isLight && (
            <div
              ref={ghostRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden opacity-0 mix-blend-screen md:block"
              style={{ background: 'linear-gradient(90deg, hsl(350 100% 55% / 0.35), transparent 30%, transparent 70%, hsl(190 100% 55% / 0.35))' }}
            />
          )}
          {/* moldura côncava: cima e baixo */}
          <svg className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[16%] w-full" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden>
            <path d="M0,0 H100 V2 Q50,34 0,2 Z" fill="hsl(var(--background))" />
          </svg>
          <svg className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[16%] w-full" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden>
            <path d="M0,20 H100 V18 Q50,-14 0,18 Z" fill="hsl(var(--background))" />
          </svg>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[12%] bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[12%] bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}
