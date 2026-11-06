import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDeviceTier } from '@/hooks/use-device-tier';

const steps = [
  {
    title: 'Conversa inicial',
    description: 'Entendo seu negócio, público-alvo e objetivos para criar uma estratégia personalizada.',
  },
  {
    title: 'Design & Desenvolvimento',
    description: 'Crio o layout focado em conversão com design moderno e responsivo.',
  },
  {
    title: 'Lançamento',
    description: 'Entrego seu site pronto, otimizado para SEO e velocidade máxima.',
  },
];

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned black stage: each step is "handwritten" (SVG stroke draw + clip reveal)
 * as the user scrolls; ends with a ki energy burst.
 */
export function ExpandingBars() {
  const isLight = useDeviceTier() === 'light';
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: isLight ? 0.4 : 0.8,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>('.hw-step').forEach((step) => {
        const title = step.querySelector<SVGTextElement>('.hw-title')!;
        const desc = step.querySelector<HTMLElement>('.hw-desc')!;
        const pencil = step.querySelector<HTMLElement>('.hw-pencil')!;
        tl.fromTo(step, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 })
          .fromTo(title, { strokeDashoffset: 1600, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 1 })
          .to(title, { fillOpacity: 1, duration: 0.3 })
          .fromTo(desc, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1 }, '<')
          .fromTo(pencil, { left: '0%', autoAlpha: 1 }, { left: '100%', duration: 1 }, '<')
          .to(pencil, { autoAlpha: 0, duration: 0.1 })
          .to({}, { duration: 0.3 });
      });

      tl.fromTo('.ki-burst', { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(2)' })
        .to({}, { duration: 0.6 });
    }, el);
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      ctx.revert();
    };
  }, [isLight]);

  return (
    <section
      ref={sectionRef}
      id="servicos"
      className={`relative w-full bg-[hsl(0_0%_0%)] text-foreground ${isLight ? 'h-[320vh]' : 'h-[400vh]'}`}
      aria-label="Como funciona"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
      <div className="mx-auto flex h-full max-w-4xl flex-col justify-center gap-6 px-6 md:gap-10">
        <h2 className="sr-only">Simples e direto ao ponto</h2>
        {steps.map((s) => (
          <div key={s.title} className="hw-step invisible">
            <svg viewBox="0 0 900 90" preserveAspectRatio="xMinYMid meet" className="h-12 w-full md:h-20" aria-label={s.title} role="img">
              <text
                x="0"
                y="68"
                className="hw-title"
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: 76,
                  fontWeight: 700,
                  fill: 'hsl(var(--foreground))',
                  stroke: 'hsl(var(--foreground))',
                  strokeWidth: 1.4,
                  strokeDasharray: 1600,
                }}
              >
                {s.title}
              </text>
            </svg>
            <div className="relative mt-1 inline-block">
              <p
                className="hw-desc text-base leading-snug text-muted-foreground md:text-2xl"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {s.description}
              </p>
              <span className="hw-pencil pointer-events-none absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary opacity-0 shadow-[0_0_12px_hsl(var(--primary))]" />
            </div>
          </div>
        ))}

        <div className="ki-burst invisible pointer-events-none relative mx-auto mt-2 h-32 w-32 md:h-44 md:w-44" aria-hidden>
          <div className={`absolute inset-0 rounded-full bg-[radial-gradient(circle,hsl(50_100%_70%)_0%,hsl(45_100%_55%/0.6)_35%,transparent_70%)] ${isLight ? '' : 'animate-pulse'}`} />
          {!isLight && (
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_6s_linear_infinite]">
              {Array.from({ length: 8 }).map((_, i) => (
                <path
                  key={i}
                  d="M50 50 L54 30 L49 28 L55 6"
                  stroke="hsl(50 100% 75%)"
                  strokeWidth="1.5"
                  fill="none"
                  transform={`rotate(${i * 45} 50 50)`}
                />
              ))}
            </svg>
          )}
          <span className="absolute inset-0 flex items-center justify-center text-4xl md:text-6xl">⚡</span>
        </div>
      </div>
      </div>
    </section>
  );
}
