import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Clock, Smartphone, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const results = [
  { icon: Zap, value: 'Alta', label: 'Performance', description: 'Sites rápidos e otimizados, prontos para escalar.' },
  { icon: Clock, value: '7 dias', label: 'Prazo de entrega', description: 'Do briefing ao lançamento, com etapas claras.' },
  { icon: Smartphone, value: '100%', label: 'Responsivo', description: 'Experiência fluida em qualquer tela e dispositivo.' },
  { icon: Shield, value: 'Total', label: 'Suporte', description: 'Acompanhamento próximo durante e após a entrega.' },
];

export function Results() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
      });

      // Vertical neon line that lights up on scroll
      if (lineFillRef.current && timelineRef.current) {
        gsap.fromTo(
          lineFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 75%',
              end: 'bottom 70%',
              scrub: 0.5,
            },
          },
        );
      }

      // Each item reveal + node activation
      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.05,
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        });

        const node = el.querySelector<HTMLElement>('[data-node]');
        if (node) {
          gsap.fromTo(
            node,
            { boxShadow: '0 0 0 0 hsl(195 100% 50% / 0)', backgroundColor: 'hsl(220 50% 12%)' },
            {
              boxShadow:
                '0 0 0 4px hsl(195 100% 50% / 0.2), 0 0 24px hsl(155 100% 50% / 0.6), 0 0 48px hsl(195 100% 50% / 0.4)',
              backgroundColor: 'hsl(220 50% 8%)',
              scrollTrigger: { trigger: el, start: 'top 70%', once: true },
              duration: 0.6,
              ease: 'power2.out',
            },
          );
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="resultados" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-glow-gradient pointer-events-none opacity-40" />

      <div className="container mx-auto px-4 relative z-10">
        <div ref={headerRef} className="text-center mb-16">
          <span className="section-label">O que você ganha</span>
          <h2 className="section-title">Compromisso com qualidade</h2>
        </div>

        <div ref={timelineRef} className="relative max-w-3xl mx-auto">
          {/* Vertical track */}
          <div
            aria-hidden
            className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-foreground/10"
          />
          {/* Animated neon fill */}
          <div
            ref={lineFillRef}
            aria-hidden
            className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] origin-top rounded-full"
            style={{
              background:
                'linear-gradient(180deg, hsl(195 100% 55%) 0%, hsl(155 100% 50%) 100%)',
              filter: 'drop-shadow(0 0 8px hsl(195 100% 50% / 0.7))',
            }}
          />

          <div className="flex flex-col gap-12 md:gap-16">
            {results.map((r, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  ref={(el) => {
                    if (el) itemsRef.current[i] = el;
                  }}
                  className={`relative md:grid md:grid-cols-2 md:gap-12 items-center ${
                    isLeft ? '' : 'md:[&>div:first-child]:order-2'
                  }`}
                >
                  {/* Content */}
                  <div className={`pl-20 md:pl-0 ${isLeft ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                    <div className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-1">
                      {r.value}
                    </div>
                    <div className="text-base md:text-lg font-bold text-foreground/90 mb-2 uppercase tracking-wider">
                      {r.label}
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm md:max-w-none md:ml-auto">
                      {r.description}
                    </p>
                  </div>

                  {/* Node */}
                  <div
                    data-node
                    className="absolute left-6 md:left-1/2 top-2 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full border border-primary/40 flex items-center justify-center z-10 bg-background"
                  >
                    <r.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-foreground/60">
                      0{i + 1}
                    </span>
                  </div>

                  {/* Spacer (other half on desktop) */}
                  <div className="hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
