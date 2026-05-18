import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Layers, Smartphone, Gauge, Rocket } from 'lucide-react';
import { useDeviceTier } from '@/hooks/use-device-tier';

const cards = [
  {
    icon: Layers,
    title: 'Design Estratégico',
    description: 'Cada elemento pensado para converter visitantes em clientes.',
    accent: 'hsl(195 100% 50%)',
  },
  {
    icon: Smartphone,
    title: 'Responsivo',
    description: 'Perfeito em qualquer dispositivo, do celular ao desktop.',
    accent: 'hsl(155 100% 50%)',
  },
  {
    icon: Gauge,
    title: 'Alta Performance',
    description: 'Sites rápidos que ranqueiam melhor no Google.',
    accent: 'hsl(195 100% 60%)',
  },
  {
    icon: Rocket,
    title: 'Entrega em 7 Dias',
    description: 'Do briefing ao lançamento, sem enrolação.',
    accent: 'hsl(155 100% 55%)',
  },
];

/**
 * v2 - Jeton Card style: sticky giant headline + feature cards sliding horizontally
 * over it on vertical scroll. Light devices get vertical stacked cards with fade-in.
 */
export function HorizontalCards() {
  const tier = useDeviceTier();

  if (tier === 'light') {
    return <LightVariant />;
  }

  return <FullVariant />;
}

function FullVariant() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Cards travel from right to left: start at 100% (off-screen right), end at -((n-1)*width)
  const totalTravel = cards.length;
  const x = useTransform(scrollYProgress, [0, 1], [`100vw`, `${-totalTravel * 90}vw`]);

  return (
    <section
      ref={sectionRef}
      id="horizontal-notebook-scroll"
      className="relative"
      style={{ height: `${(cards.length + 1) * 90}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Sticky giant headline */}
        <div className="relative z-10 pt-20 pb-6 text-center px-4">
          <span className="section-label">O que você ganha</span>
          <h2 className="font-black leading-[0.9] tracking-tight uppercase gradient-text"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 7rem)', letterSpacing: '-0.03em' }}>
            Compromisso
            <br />
            com qualidade
          </h2>
        </div>

        {/* Horizontal sliding track */}
        <motion.div
          className="flex items-center gap-8 px-8 absolute top-1/2 -translate-y-1/2 will-change-transform"
          style={{ x }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className="glass-card p-8 md:p-10 flex-none flex flex-col gap-5 shadow-2xl"
              style={{
                width: 'clamp(280px, 70vw, 480px)',
                height: 'clamp(360px, 60vh, 520px)',
                borderColor: card.accent,
                boxShadow: `0 20px 60px -20px ${card.accent.replace(')', ' / 0.45)')}`,
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: card.accent.replace(')', ' / 0.18)') }}
              >
                <card.icon className="w-8 h-8" style={{ color: card.accent }} />
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                0{i + 1}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">{card.title}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed flex-1">
                {card.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function LightVariant() {
  return (
    <section id="horizontal-notebook-scroll" className="py-20 md:py-32 px-4">
      <div className="text-center mb-12">
        <span className="section-label">O que você ganha</span>
        <h2 className="section-title">Compromisso com qualidade</h2>
      </div>
      <div className="max-w-md mx-auto space-y-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-card p-6 flex gap-4"
            style={{
              borderColor: card.accent.replace(')', ' / 0.35)'),
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-none"
              style={{ background: card.accent.replace(')', ' / 0.18)') }}
            >
              <card.icon className="w-6 h-6" style={{ color: card.accent }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
