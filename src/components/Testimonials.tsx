import { useRef } from 'react';
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
  index: number;
  totalCards: number;
}

function ValueCard({ value, index, totalCards }: ValueCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start center'],
  });

  // Animate from below and fade in
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <motion.div
      ref={cardRef}
      className="w-full max-w-md mx-auto"
      style={{ opacity, y, scale }}
    >
      <div className="glass-card overflow-hidden">
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
      
      {/* Connector line between cards (except last) */}
      {index < totalCards - 1 && (
        <div className="flex justify-center py-8">
          <motion.div 
            className="w-px h-16 bg-gradient-to-b from-primary/50 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      )}
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <section 
      id="beneficios" 
      className="relative py-20 md:py-32"
    >
      {/* Background Glow */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-glow-gradient pointer-events-none opacity-15" />
      <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-glow-gradient pointer-events-none opacity-10" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
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

        {/* Cards - each appears one by one as you scroll */}
        <div className="flex flex-col items-center gap-0">
          {values.map((value, index) => (
            <ValueCard
              key={value.id}
              value={value}
              index={index}
              totalCards={values.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
