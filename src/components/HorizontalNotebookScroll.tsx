import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const slideWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / slideWidth);
      setActiveIndex(Math.min(Math.max(newIndex, 0), slides.length - 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="horizontal-notebook-scroll" className="py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-8 px-4">
        <span className="section-label">O que você ganha</span>
        <h2 className="section-title">Compromisso com qualidade</h2>
      </div>

      {/* Horizontal scroll container */}
      <div 
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className="flex-shrink-0 w-screen snap-center flex flex-col items-center justify-center px-4 py-8"
          >
            <motion.div 
              className="relative max-w-4xl w-full"
              initial={{ opacity: 0.6, scale: 0.9 }}
              animate={{ 
                opacity: index === activeIndex ? 1 : 0.6, 
                scale: index === activeIndex ? 1 : 0.9 
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Notebook mockup */}
              <div className="relative rounded-t-[20px] overflow-hidden p-[2px]" style={{ background: 'linear-gradient(135deg, #4a4a4a 0%, #1a1a1a 50%, #3a3a3a 100%)' }}>
                <div className="relative rounded-t-[18px] overflow-hidden" style={{ background: 'linear-gradient(180deg, #1f1f1f 0%, #0a0a0a 100%)', padding: '16px 16px 0 16px' }}>
                  <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover object-top" loading="lazy" />
                  </div>
                </div>
              </div>
              <div className="relative h-4" style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #252525 50%, #1a1a1a 100%)' }} />
              <div className="relative h-6 rounded-b-xl" style={{ background: 'linear-gradient(180deg, #1f1f1f 0%, #141414 100%)' }} />

              {/* Text */}
              <div className="text-center mt-6">
                <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-2">{slide.title}</h3>
                <p className="text-muted-foreground max-w-md mx-auto">{slide.description}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <div key={index} className={`w-2 h-2 rounded-full transition-all ${index === activeIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30'}`} />
        ))}
      </div>

      {/* Swipe hint */}
      <p className="text-center text-muted-foreground text-sm mt-4">← Deslize para ver mais →</p>
    </section>
  );
}
