import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MessageSquare, Palette, Rocket } from 'lucide-react';
import { CardKineticBackground } from './CardKineticBackground';

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Conversa inicial',
    description: 'Entendo seu negócio, público-alvo e objetivos para criar uma estratégia personalizada.',
    words: ['BRIEFING', 'ESTRATÉGIA', 'OBJETIVOS', 'PÚBLICO', 'NEGÓCIO'],
  },
  {
    icon: Palette,
    number: '02',
    title: 'Design & Desenvolvimento',
    description: 'Crio o layout focado em conversão com design moderno e responsivo.',
    words: ['DESIGN', 'UI/UX', 'LAYOUT', 'RESPONSIVO', 'MODERNO'],
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Lançamento',
    description: 'Entrego seu site pronto, otimizado para SEO e velocidade máxima.',
    words: ['DEPLOY', 'SEO', 'RÁPIDO', 'OTIMIZADO', 'PERFORMANCE'],
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [stepTops, setStepTops] = useState<number[]>([]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.6'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Calculate when each step's node is reached
  const step1Active = useTransform(scrollYProgress, (v) => v > 0.05);
  const step2Active = useTransform(scrollYProgress, (v) => v > 0.4);
  const step3Active = useTransform(scrollYProgress, (v) => v > 0.75);
  const stepActives = [step1Active, step2Active, step3Active];

  return (
    <section id="servicos" className="py-20 md:py-32 relative overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="section-label">Como funciona</span>
          <h2 className="section-title">Simples e direto ao ponto</h2>
        </motion.div>

        <div className="relative max-w-lg mx-auto" ref={timelineRef}>
          {/* Background line (dim) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] rounded-full"
            style={{
              background: 'hsl(var(--primary) / 0.15)',
            }}
          />

          {/* Active line (glowing, scroll-driven) */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] rounded-full origin-top"
            style={{
              height: lineHeight,
              background: 'linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--primary) / 0.8))',
              boxShadow: '0 0 8px hsl(var(--primary) / 0.4), 0 0 20px hsl(var(--primary) / 0.2)',
            }}
          />

          {steps.map((step, index) => (
            <TimelineStep
              key={index}
              step={step}
              index={index}
              scrollProgress={scrollYProgress}
              threshold={index === 0 ? 0.05 : index === 1 ? 0.4 : 0.75}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineStep({
  step,
  index,
  scrollProgress,
  threshold,
}: {
  step: typeof steps[number];
  index: number;
  scrollProgress: any;
  threshold: number;
}) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollProgress.on('change', (v: number) => {
      setIsActive(v >= threshold);
    });
    return unsubscribe;
  }, [scrollProgress, threshold]);

  return (
    <div className={`relative pb-8 ${index === 0 ? 'pt-0' : ''}`}>
      {/* Node dot */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-4 z-20 w-5 h-5 rounded-full border-2 transition-all duration-500"
        style={{
          backgroundColor: isActive ? 'hsl(var(--primary))' : 'hsl(var(--background))',
          borderColor: isActive ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)',
          boxShadow: isActive
            ? '0 0 12px hsl(var(--primary) / 0.6), 0 0 24px hsl(var(--primary) / 0.3)'
            : 'none',
        }}
      >
        {/* Inner glow dot */}
        <div
          className="absolute inset-1 rounded-full transition-opacity duration-500"
          style={{
            backgroundColor: 'hsl(var(--primary-foreground))',
            opacity: isActive ? 1 : 0,
          }}
        />
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.15 }}
        className="relative group"
      >
        <div
          className="relative p-8 pt-12 text-center overflow-hidden min-h-[260px] transition-opacity duration-700"
          style={{ opacity: isActive ? 1 : 0.4 }}
        >
          <CardKineticBackground words={step.words} />

          {/* Icon */}
          <div
            className="relative z-10 w-16 h-16 mx-auto mb-6 mt-6 rounded-2xl backdrop-blur-sm flex items-center justify-center transition-all duration-500"
            style={{
              backgroundColor: isActive ? 'hsl(var(--primary) / 0.25)' : 'hsl(var(--primary) / 0.1)',
            }}
          >
            <step.icon
              className="w-8 h-8 transition-colors duration-500"
              style={{ color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.4)' }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-[220px] p-4 rounded-2xl bg-background/60 backdrop-blur-md border border-primary/20 shadow-[0_0_30px_-5px_hsl(195_100%_50%/0.15),inset_0_1px_0_0_hsl(195_100%_50%/0.1)]">
            <h3
              className="text-xl font-bold mb-2 transition-colors duration-500"
              style={{ color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.4)' }}
            >
              {step.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {step.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
