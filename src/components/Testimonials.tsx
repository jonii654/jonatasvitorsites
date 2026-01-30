import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Lightbulb, Rocket, Target } from 'lucide-react';
import valueDesign from '@/assets/value-design.webp';
import valueResults from '@/assets/value-results.webp';
import valueSpeed from '@/assets/value-speed.webp';

const values = [
  {
    id: 1,
    icon: Lightbulb,
    title: 'Design estratégico',
    description:
      'Cada elemento do seu site é pensado para guiar o visitante até a ação desejada. Nada é por acaso.',
    image: valueDesign,
  },
  {
    id: 2,
    icon: Target,
    title: 'Foco em resultados',
    description:
      'Sites bonitos são ótimos, mas sites que convertem são ainda melhores. Meu objetivo é te ajudar a crescer.',
    image: valueResults,
  },
  {
    id: 3,
    icon: Rocket,
    title: 'Entrega rápida',
    description:
      'Prazo de 7 dias do início ao lançamento. Sem enrolação, sem atrasos. Seu tempo é valioso.',
    image: valueSpeed,
  },
];

function ValueCard({ value, isActive }: { value: (typeof values)[number]; isActive: boolean }) {
  return (
    <motion.div
      className="glass-card overflow-hidden max-w-md w-full"
      animate={{ opacity: isActive ? 1 : 0.6, scale: isActive ? 1 : 0.96 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={value.image}
          alt={value.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
          <value.icon className="w-7 h-7 text-primary" />
        </div>
      </div>

      <div className="p-8 text-center">
        <h3 className="text-2xl font-bold text-foreground mb-4">{value.title}</h3>
        <p className="text-muted-foreground leading-relaxed text-lg">{value.description}</p>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Travado: o scroll vertical controla qual bloco está visível (um por tela)
  const y = useTransform(scrollYProgress, [0, 1], [0, -((values.length - 1) * viewportHeight)]);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (latest) => {
      const idx = Math.round(latest * (values.length - 1));
      setActiveIndex(Math.min(Math.max(idx, 0), values.length - 1));
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      id="beneficios"
      className="relative"
      style={{ height: `${values.length * 100}vh` }}
    >
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-glow-gradient pointer-events-none opacity-15" />

      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Header fixo */}
        <div className="absolute top-16 inset-x-0 z-10 text-center px-4">
          <span className="section-label">Por que me escolher</span>
          <h2 className="section-title">Meu compromisso com você</h2>
        </div>

        {/* Conteúdo (cada bloco vem de baixo / aparece sozinho) */}
        <motion.div className="flex flex-col" style={{ y }}>
          {values.map((value, index) => (
            <div key={value.id} className="h-screen w-full flex items-center justify-center px-4 pt-24">
              <ValueCard value={value} isActive={index === activeIndex} />
            </div>
          ))}
        </motion.div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {values.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
