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
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}

function ValueCard({ value, index, scrollYProgress }: ValueCardProps) {
  const totalCards = values.length;
  const segmentSize = 1 / totalCards;
  
  // Each card has its own range within the scroll
  const startRange = index * segmentSize;
  const peakStart = startRange + segmentSize * 0.2;
  const peakEnd = startRange + segmentSize * 0.8;
  const endRange = (index + 1) * segmentSize;

  // Opacity: fade in -> stay visible -> fade out
  const opacity = useTransform(
    scrollYProgress,
    [startRange, peakStart, peakEnd, endRange],
    [0, 1, 1, 0]
  );

  // Y position: come from below -> center -> exit above
  const y = useTransform(
    scrollYProgress,
    [startRange, peakStart, peakEnd, endRange],
    [60, 0, 0, -60]
  );

  // Scale: grow in -> full size -> shrink out
  const scale = useTransform(
    scrollYProgress,
    [startRange, peakStart, peakEnd, endRange],
    [0.9, 1, 1, 0.9]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-4"
      style={{ opacity, y, scale }}
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section 
      ref={containerRef}
      id="beneficios" 
      className="relative h-[300vh] md:h-[300vh]"
    >
      {/* Background Glow */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-glow-gradient pointer-events-none opacity-15" />

      {/* Sticky container */}
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

        {/* Cards container - centered */}
        <div className="flex-1 relative">
          {values.map((value, index) => (
            <ValueCard
              key={value.id}
              value={value}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
