import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import the mockup images for notebook screens
import layoutTop from '@/assets/layout-mockup-top.webp';
import layoutLeft from '@/assets/layout-mockup-left.webp';
import layoutRight from '@/assets/layout-mockup-right.webp';
import layoutBottom from '@/assets/layout-mockup-bottom.webp';

const slides = [
  { id: 1, title: 'Design Estratégico', description: 'Cada elemento pensado para converter visitantes em clientes.', image: layoutTop },
  { id: 2, title: 'Responsivo', description: 'Perfeito em qualquer dispositivo, do celular ao desktop.', image: layoutLeft },
  { id: 3, title: 'Alta Performance', description: 'Sites rápidos que ranqueiam melhor no Google.', image: layoutRight },
  { id: 4, title: 'Entrega em 7 Dias', description: 'Do briefing ao lançamento, sem enrolação.', image: layoutBottom },
];

export function HorizontalNotebookScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Scroll vertical controla o deslocamento horizontal (em px) — 1 tela por card
  const x = useTransform(scrollYProgress, [0, 1], [0, -((slides.length - 1) * viewportWidth)]);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (latest) => {
      const idx = Math.round(latest * (slides.length - 1));
      setActiveIndex(Math.min(Math.max(idx, 0), slides.length - 1));
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      id="horizontal-notebook-scroll"
      className="relative"
      style={{ height: `${slides.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Header fixo */}
        <div className="absolute top-16 inset-x-0 z-10 text-center px-4">
          <span className="section-label">O que você ganha</span>
          <h2 className="section-title">Compromisso com qualidade</h2>
        </div>

        {/* Conteúdo: scroll vertical vira movimento horizontal */}
        <motion.div className="flex h-full will-change-transform" style={{ x }}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="h-screen w-screen flex-none flex items-center justify-center px-4 pt-24"
            >
              <motion.div
                className="relative max-w-4xl w-full"
                animate={{ opacity: index === activeIndex ? 1 : 0.6, scale: index === activeIndex ? 1 : 0.9 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Notebook mockup with neon green glow */}
                <div
                  className="relative rounded-t-[20px] overflow-hidden p-[2px]"
                  style={{
                    background:
                      'linear-gradient(135deg, #4a4a4a 0%, #1a1a1a 50%, #3a3a3a 100%)',
                    boxShadow:
                      index === activeIndex
                        ? '0 0 30px hsl(155 100% 50% / 0.5), 0 0 60px hsl(155 100% 50% / 0.3), 0 0 100px hsl(155 100% 50% / 0.15)'
                        : '0 0 20px hsl(155 100% 50% / 0.2)',
                  }}
                >
                  <div
                    className="relative rounded-t-[18px] overflow-hidden"
                    style={{
                      background: 'linear-gradient(180deg, #1f1f1f 0%, #0a0a0a 100%)',
                      padding: '16px 16px 0 16px',
                    }}
                  >
                    <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="relative h-4"
                  style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #252525 50%, #1a1a1a 100%)' }}
                />
                <div
                  className="relative h-6 rounded-b-xl"
                  style={{ background: 'linear-gradient(180deg, #1f1f1f 0%, #141414 100%)' }}
                />

                {/* Text */}
                <div className="text-center mt-6">
                  <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-2">{slide.title}</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">{slide.description}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, index) => (
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
