import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Lightbulb, Target, Rocket } from 'lucide-react';
import valueDesign from '@/assets/value-design.webp';
import valueResults from '@/assets/value-results.webp';
import valueSpeed from '@/assets/value-speed.webp';

const values = [
  {
    id: 1,
    icon: Lightbulb,
    title: 'Design estratégico',
    description: 'Cada elemento do seu site é pensado para guiar o visitante até a ação desejada. Nada é por acaso.',
    image: valueDesign,
  },
  {
    id: 2,
    icon: Target,
    title: 'Foco em resultados',
    description: 'Sites bonitos são ótimos, mas sites que convertem são ainda melhores. Meu objetivo é te ajudar a crescer.',
    image: valueResults,
  },
  {
    id: 3,
    icon: Rocket,
    title: 'Entrega rápida',
    description: 'Prazo de 7 dias do início ao lançamento. Sem enrolação, sem atrasos. Seu tempo é valioso.',
    image: valueSpeed,
  },
];

interface ValueCardProps {
  value: typeof values[0];
  isActive: boolean;
}

function ValueCard({ value, isActive }: ValueCardProps) {
  return (
    <motion.div
      className="flex-shrink-0 w-screen min-w-[100vw] h-full flex items-center justify-center px-4"
      animate={{ 
        opacity: isActive ? 1 : 0.4, 
        scale: isActive ? 1 : 0.85 
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="glass-card overflow-hidden max-w-md w-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={value.image} 
            alt={value.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {/* Icon overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
            <value.icon className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {value.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {value.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Horizontal movement based on vertical scroll
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0vw', `-${(values.length - 1) * 100}vw`]
  );

  // Update active index based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const index = Math.round(latest * (values.length - 1));
      setActiveIndex(Math.min(Math.max(index, 0), values.length - 1));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section 
      ref={sectionRef}
      id="beneficios" 
      className="relative"
      style={{ height: `${values.length * 100}vh` }}
    >
      {/* Background Glow */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-glow-gradient pointer-events-none opacity-15" />

      {/* Sticky container - pinned while section scrolls */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Header - stays at top */}
        <div className="pt-20 md:pt-24 pb-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">Por que me escolher</span>
            <h2 className="section-title">
              Meu compromisso com você
            </h2>
          </motion.div>
        </div>

        {/* Horizontal carousel container */}
        <div className="flex-1 relative overflow-hidden">
          <motion.div 
            className="flex h-full"
            style={{ x }}
          >
            {values.map((value, index) => (
              <ValueCard
                key={value.id}
                value={value}
                isActive={index === activeIndex}
              />
            ))}
          </motion.div>
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {values.map((_, index) => (
            <div 
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
