import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Clock, Smartphone, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const results = [
  { icon: Zap, value: 'Alta', label: 'Performance', description: 'Sites rápidos e otimizados' },
  { icon: Clock, value: '7 dias', label: 'Prazo de entrega', description: 'do início ao lançamento' },
  { icon: Smartphone, value: '100%', label: 'Responsivo', description: 'funciona em qualquer tela' },
  { icon: Shield, value: 'Total', label: 'Suporte', description: 'acompanhamento pós-entrega' },
];

export function Results() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
          once: true,
        },
      });

      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        force3D: true,
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: 'top 88%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="resultados" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-glow-gradient pointer-events-none opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div ref={headerRef} className="text-center mb-16">
          <span className="section-label">O que você ganha</span>
          <h2 className="section-title">Compromisso com qualidade</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((result, index) => (
            <div
              key={index}
              ref={el => { if (el) cardsRef.current[index] = el; }}
              className="glass-card-hover p-6 md:p-8 text-center"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-primary/10 flex items-center justify-center">
                <result.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{result.value}</div>
              <div className="text-foreground font-medium mb-1">{result.label}</div>
              <div className="text-sm text-muted-foreground">{result.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
