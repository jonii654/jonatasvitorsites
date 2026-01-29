import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import the mockup images for notebook screens
import layoutTop from '@/assets/layout-mockup-top.webp';
import layoutLeft from '@/assets/layout-mockup-left.webp';
import layoutRight from '@/assets/layout-mockup-right.webp';
import layoutBottom from '@/assets/layout-mockup-bottom.webp';

interface NotebookSlide {
  id: number;
  title: string;
  description: string;
  image: string;
}

const slides: NotebookSlide[] = [
  {
    id: 1,
    title: 'Design Estratégico',
    description: 'Cada elemento pensado para converter visitantes em clientes.',
    image: layoutTop,
  },
  {
    id: 2,
    title: 'Responsivo',
    description: 'Perfeito em qualquer dispositivo, do celular ao desktop.',
    image: layoutLeft,
  },
  {
    id: 3,
    title: 'Alta Performance',
    description: 'Sites rápidos que ranqueiam melhor no Google.',
    image: layoutRight,
  },
  {
    id: 4,
    title: 'Entrega em 7 Dias',
    description: 'Do briefing ao lançamento, sem enrolação.',
    image: layoutBottom,
  },
];

function NotebookFrame({ slide, isActive }: { slide: NotebookSlide; isActive: boolean }) {
  return (
    <motion.div
      className="flex-shrink-0 w-screen h-screen flex items-center justify-center px-4 snap-center"
      initial={{ opacity: 0.5, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.5, 
        scale: isActive ? 1 : 0.9 
      }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="relative max-w-4xl w-full">
        {/* Notebook Frame */}
        <div className="relative">
          {/* Screen bezel */}
          <div 
            className="relative rounded-t-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
              padding: '12px 12px 0 12px',
            }}
          >
            {/* Camera dot */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-muted" />
            
            {/* Screen */}
            <div 
              className="relative rounded-t-lg overflow-hidden bg-background"
              style={{ aspectRatio: '16/10' }}
            >
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <motion.h3 
                  className="text-2xl md:text-4xl font-bold text-foreground mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  {slide.title}
                </motion.h3>
                <motion.p 
                  className="text-base md:text-lg text-muted-foreground"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {slide.description}
                </motion.p>
              </div>
            </div>
          </div>
          
          {/* Keyboard base */}
          <div 
            className="relative h-4 md:h-6 rounded-b-xl"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
            }}
          >
            {/* Hinge detail */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-1 rounded-b-sm"
              style={{ background: '#2a2a2a' }}
            />
          </div>
          
          {/* Shadow */}
          <div 
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-xl"
            style={{ background: 'hsl(var(--primary) / 0.2)' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function HorizontalNotebookScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Convert vertical scroll to horizontal position
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `-${(slides.length - 1) * 100}%`]
  );

  // Update active index based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const index = Math.round(latest * (slides.length - 1));
      setActiveIndex(Math.min(Math.max(index, 0), slides.length - 1));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Intersection observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="horizontal-notebook-scroll" 
      ref={sectionRef}
      className="relative"
      style={{ height: `${slides.length * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-glow-gradient opacity-30 pointer-events-none" />
        
        {/* Header */}
        <motion.div 
          className="absolute top-8 md:top-16 left-0 right-0 z-20 text-center px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">O que você ganha</span>
          <h2 className="section-title">Compromisso com qualidade</h2>
        </motion.div>

        {/* Horizontal scroll container */}
        <motion.div 
          ref={scrollContainerRef}
          className="flex h-full items-center pt-20"
          style={{ x }}
        >
          {slides.map((slide, index) => (
            <NotebookFrame 
              key={slide.id} 
              slide={slide} 
              isActive={index === activeIndex}
            />
          ))}
        </motion.div>

        {/* Progress indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full"
              animate={{
                backgroundColor: index === activeIndex 
                  ? 'hsl(var(--primary))' 
                  : 'hsl(var(--muted-foreground) / 0.3)',
                scale: index === activeIndex ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div 
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 text-muted-foreground text-sm flex items-center gap-2"
          animate={{ opacity: activeIndex === 0 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span>Role para explorar</span>
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            →
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
