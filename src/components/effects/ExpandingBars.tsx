import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Palette, Rocket, type LucideIcon } from 'lucide-react';
import { useDeviceTier } from '@/hooks/use-device-tier';

interface Step {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
  accent: string;
}

const steps: Step[] = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Conversa inicial',
    description:
      'Entendo seu negócio, público-alvo e objetivos para criar uma estratégia personalizada.',
    accent: 'hsl(195 100% 50%)',
  },
  {
    icon: Palette,
    number: '02',
    title: 'Design & Desenvolvimento',
    description: 'Crio o layout focado em conversão com design moderno e responsivo.',
    accent: 'hsl(195 100% 55%)',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Lançamento',
    description: 'Entrego seu site pronto, otimizado para SEO e velocidade máxima.',
    accent: 'hsl(155 100% 50%)',
  },
];

gsap.registerPlugin(ScrollTrigger);

/**
 * Thin vertical bars that expand into full cards as they enter the viewport.
 * GSAP ScrollTrigger drives flex/opacity scrub.
 */
export function ExpandingBars() {
  const tier = useDeviceTier();
  const isLight = tier === 'light';
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);
  const contentsRef = useRef<HTMLDivElement[]>([]);
  const lightCardsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Header reveal (both tiers)
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
      });

      if (isLight) {
        gsap.from(lightCardsRef.current, {
          opacity: 0,
          x: -24,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.1,
          force3D: true,
          scrollTrigger: {
            trigger: lightCardsRef.current[0],
            start: 'top 88%',
            once: true,
          },
        });
        return;
      }

      // Desktop: expanding bars driven by scroll progress (scrub)
      barsRef.current.forEach((bar, i) => {
        const content = contentsRef.current[i];
        const total = barsRef.current.length;
        const startFrac = i / total;
        const endFrac = (i + 0.6) / total;
        const accent = steps[i].accent;

        const tween = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: 1.1,
          },
          defaults: { ease: 'none', force3D: true },
        });

        tween.fromTo(
          bar,
          {
            flexGrow: 0.4,
            boxShadow: `0 0 0 ${accent.replace(')', ' / 0)')}`,
          },
          {
            flexGrow: 3,
            boxShadow: `0 0 60px ${accent.replace(')', ' / 0.5)')}`,
          },
          startFrac
        ).fromTo(
          content,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: endFrac - startFrac },
          startFrac + 0.05
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isLight]);

  if (isLight) {
    return (
      <section id="servicos" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div ref={headerRef} className="text-center mb-12">
            <span className="section-label">Como funciona</span>
            <h2 className="section-title">Simples e direto ao ponto</h2>
          </div>
          <div className="max-w-md mx-auto space-y-5">
            {steps.map((s, i) => (
              <div
                key={i}
                ref={el => { if (el) lightCardsRef.current[i] = el; }}
                className="glass-card p-5 flex gap-4"
                style={{ borderColor: s.accent.replace(')', ' / 0.3)'), willChange: 'transform, opacity' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-none"
                  style={{ background: s.accent.replace(')', ' / 0.18)') }}
                >
                  <s.icon className="w-6 h-6" style={{ color: s.accent }} />
                </div>
                <div>
                  <div className="text-xs font-mono text-muted-foreground mb-0.5">{s.number}</div>
                  <h3 className="text-base font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="servicos" ref={sectionRef} className="py-20 md:py-40 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div ref={headerRef} className="text-center mb-16">
          <span className="section-label">Como funciona</span>
          <h2 className="section-title">Simples e direto ao ponto</h2>
        </div>

        <div className="flex justify-center gap-4 md:gap-6 max-w-5xl mx-auto h-[460px]">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={el => { if (el) barsRef.current[i] = el; }}
              className="relative h-full rounded-3xl overflow-hidden cursor-pointer"
              style={{
                flex: '0.4 1 0%',
                background: `linear-gradient(180deg, ${step.accent.replace(')', ' / 0.15)')} 0%, hsl(220 50% 10%) 100%)`,
                borderTop: `2px solid ${step.accent}`,
                willChange: 'flex-grow, box-shadow',
              }}
            >
              <div
                className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-mono tracking-widest"
                style={{ color: step.accent }}
              >
                {step.number}
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: step.accent.replace(')', ' / 0.2)') }}
                >
                  <step.icon className="w-7 h-7" style={{ color: step.accent }} />
                </div>
              </div>

              <div
                ref={el => { if (el) contentsRef.current[i] = el; }}
                className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-center"
                style={{ opacity: 0, willChange: 'transform, opacity' }}
              >
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
