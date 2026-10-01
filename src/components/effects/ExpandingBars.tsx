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
  const cardsRef = useRef<HTMLDivElement[]>([]);

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

      cardsRef.current.forEach((card, index) => {
        const distance = isLight ? 38 : 150;
        const from = index === 0
          ? { x: -distance, y: 0, scale: 1 }
          : index === 1
            ? { x: distance, y: 0, scale: 1 }
            : { x: 0, y: isLight ? 48 : 110, scale: 0.88 };

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          },
          defaults: { force3D: true },
        });

        if (index < 2 && !isLight) {
          const brakeX = index === 0 ? 24 : -24;
          timeline
            .fromTo(card, { ...from, opacity: 0 }, { x: brakeX, opacity: 1, duration: 0.72, ease: 'power3.out' })
            .to(card, { x: 0, duration: 0.42, ease: 'back.out(1.8)' });
        } else {
          timeline.fromTo(
            card,
            { ...from, opacity: 0 },
            { x: 0, y: 0, scale: 1, opacity: 1, duration: isLight ? 0.55 : 0.8, ease: 'back.out(1.35)' },
          );
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isLight]);

  return (
    <section id="servicos" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <span className="section-label">Como funciona</span>
          <h2 className="section-title">Simples e direto ao ponto</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={el => { if (el) cardsRef.current[i] = el; }}
              className="glass-card relative min-h-[270px] md:min-h-[360px] p-6 md:p-8 flex flex-col"
              style={{
                background: `linear-gradient(180deg, ${step.accent.replace(')', ' / 0.15)')} 0%, hsl(220 50% 10%) 100%)`,
                borderTop: `2px solid ${step.accent}`,
                willChange: 'transform, opacity',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: step.accent.replace(')', ' / 0.2)') }}>
                  <step.icon className="w-7 h-7" style={{ color: step.accent }} />
                </div>
                <span className="text-xs font-mono tracking-widest" style={{ color: step.accent }}>{step.number}</span>
              </div>

              <div className="mt-auto pt-12">
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
