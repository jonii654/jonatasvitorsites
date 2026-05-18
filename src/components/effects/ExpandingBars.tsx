import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
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

/**
 * v3 - Thin vertical bars that expand into full cards as they enter the viewport.
 */
export function ExpandingBars() {
  const tier = useDeviceTier();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.7', 'end 0.4'],
  });

  if (tier === 'light') {
    return (
      <section id="servicos" className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-label">Como funciona</span>
            <h2 className="section-title">Simples e direto ao ponto</h2>
          </div>
          <div className="max-w-md mx-auto space-y-5">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-5 flex gap-4"
                style={{ borderColor: s.accent.replace(')', ' / 0.3)') }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-none"
                  style={{ background: s.accent.replace(')', ' / 0.18)') }}
                >
                  <s.icon className="w-6 h-6" style={{ color: s.accent }} />
                </div>
                <div>
                  <div className="text-xs font-mono text-muted-foreground mb-0.5">
                    {s.number}
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="servicos" ref={sectionRef} className="py-20 md:py-40 relative overflow-hidden">
      <div className="container mx-auto px-4">
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

        <div className="flex justify-center gap-4 md:gap-6 max-w-5xl mx-auto h-[460px]">
          {steps.map((step, i) => (
            <ExpandingBar
              key={i}
              step={step}
              progress={scrollYProgress}
              range={[i / steps.length, (i + 0.6) / steps.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpandingBar({
  step,
  progress,
  range,
}: {
  step: Step;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const flex = useTransform(progress, range, [0.4, 3]);
  const contentOpacity = useTransform(progress, [range[0] + 0.05, range[1]], [0, 1]);
  const barGlow = useTransform(
    progress,
    range,
    [`0 0 0 ${step.accent.replace(')', ' / 0)')}`, `0 0 60px ${step.accent.replace(')', ' / 0.5)')}`],
  );

  return (
    <motion.div
      className="relative h-full rounded-3xl overflow-hidden cursor-pointer"
      style={{
        flex,
        background: `linear-gradient(180deg, ${step.accent.replace(')', ' / 0.15)')} 0%, hsl(220 50% 10%) 100%)`,
        borderTop: `2px solid ${step.accent}`,
        boxShadow: barGlow as unknown as string,
      }}
    >
      {/* Number always visible at top */}
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-mono tracking-widest"
        style={{ color: step.accent }}
      >
        {step.number}
      </div>

      {/* Icon - centered when collapsed */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: step.accent.replace(')', ' / 0.2)') }}
        >
          <step.icon className="w-7 h-7" style={{ color: step.accent }} />
        </div>
      </div>

      {/* Expanded content */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-center"
        style={{ opacity: contentOpacity }}
      >
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{step.title}</h3>
        <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
      </motion.div>
    </motion.div>
  );
}
