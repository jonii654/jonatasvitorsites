import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lightbulb, Rocket, Target, type LucideIcon } from 'lucide-react';
import { useDeviceTier } from '@/hooks/use-device-tier';
import valueDesign from '@/assets/value-design.webp';
import valueResults from '@/assets/value-results.webp';
import valueSpeed from '@/assets/value-speed.webp';

interface Slide {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
}

const slides: Slide[] = [
  {
    icon: Lightbulb,
    title: 'Design estratégico',
    description:
      'Cada elemento do seu site é pensado para guiar o visitante até a ação desejada. Nada é por acaso.',
    image: valueDesign,
  },
  {
    icon: Target,
    title: 'Foco em resultados',
    description:
      'Sites bonitos são ótimos, mas sites que convertem são ainda melhores. Meu objetivo é te ajudar a crescer.',
    image: valueResults,
  },
  {
    icon: Rocket,
    title: 'Entrega rápida',
    description:
      'Prazo de 7 dias do início ao lançamento. Sem enrolação, sem atrasos. Seu tempo é valioso.',
    image: valueSpeed,
  },
];

/**
 * v9 - Coverflow 3D: cards arranged on a curved arc, center card in focus.
 * Light devices get a horizontal scroll-snap carousel.
 */
export function Coverflow3D() {
  const tier = useDeviceTier();
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((i) => (i + 1) % slides.length), []);
  const prev = useCallback(
    () => setActive((i) => (i - 1 + slides.length) % slides.length),
    [],
  );

  // Auto-rotate every 5s on full tier
  useEffect(() => {
    if (tier !== 'full') return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [tier, next]);

  return (
    <section id="beneficios" className="relative py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <span className="section-label">Por que me escolher</span>
          <h2 className="section-title">Meu compromisso com você</h2>
        </div>

        {tier === 'light' ? (
          <LightVariant />
        ) : (
          <FullVariant active={active} setActive={setActive} prev={prev} next={next} />
        )}
      </div>
    </section>
  );
}

function FullVariant({
  active,
  setActive,
  prev,
  next,
}: {
  active: number;
  setActive: (i: number) => void;
  prev: () => void;
  next: () => void;
}) {
  return (
    <div>
      <div
        className="relative mx-auto"
        style={{
          height: 'clamp(380px, 50vw, 560px)',
          perspective: '1400px',
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {slides.map((s, i) => {
            let diff = i - active;
            if (diff > slides.length / 2) diff -= slides.length;
            if (diff < -slides.length / 2) diff += slides.length;
            const isCenter = diff === 0;

            return (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Mostrar ${s.title}`}
                className="absolute glass-card overflow-hidden w-[clamp(260px,32vw,400px)] h-[clamp(360px,48vw,520px)] text-left"
                animate={{
                  x: `${diff * 60}%`,
                  rotateY: -diff * 35,
                  z: isCenter ? 0 : -140,
                  scale: isCenter ? 1 : 0.78,
                  opacity: Math.abs(diff) > 1 ? 0 : isCenter ? 1 : 0.55,
                  zIndex: 10 - Math.abs(diff),
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                style={{
                  transformStyle: 'preserve-3d',
                  pointerEvents: Math.abs(diff) > 1 ? 'none' : 'auto',
                  boxShadow: isCenter
                    ? '0 30px 80px -20px hsl(195 100% 50% / 0.45), 0 0 0 1px hsl(195 100% 50% / 0.4)'
                    : '0 10px 30px -10px hsl(0 0% 0% / 0.5)',
                }}
              >
                <div className="relative h-1/2 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-primary/25 backdrop-blur-sm flex items-center justify-center border border-primary/40">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? 'w-8 bg-primary' : 'w-3 bg-muted-foreground/30'
              }`}
              aria-label={`Ir para card ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-all"
          aria-label="Próximo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function LightVariant() {
  return (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-2 -mx-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className="glass-card flex-none w-[80vw] max-w-sm snap-center overflow-hidden"
        >
          <div className="relative h-40 overflow-hidden">
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-11 h-11 rounded-xl bg-primary/25 backdrop-blur-sm flex items-center justify-center border border-primary/40">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="p-5 text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
