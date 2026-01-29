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
      className="flex-shrink-0 w-screen h-screen flex flex-col items-center justify-center px-4 snap-center"
      initial={{ opacity: 0.5, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.5, 
        scale: isActive ? 1 : 0.9 
      }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="relative max-w-4xl w-full scale-[0.65] md:scale-100 origin-center">
        {/* Outer glow effect when active */}
        <motion.div 
          className="absolute -inset-4 rounded-3xl pointer-events-none"
          animate={{
            opacity: isActive ? 1 : 0,
            boxShadow: isActive 
              ? '0 0 60px hsl(var(--primary) / 0.3), 0 0 120px hsl(var(--primary) / 0.15)' 
              : 'none'
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Notebook Frame */}
        <div className="relative">
          {/* Screen lid - outer frame with metallic gradient */}
          <div 
            className="relative rounded-t-[20px] overflow-hidden p-[2px]"
            style={{
              background: 'linear-gradient(135deg, #4a4a4a 0%, #1a1a1a 50%, #3a3a3a 100%)',
            }}
          >
            {/* Inner bezel */}
            <div 
              className="relative rounded-t-[18px] overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #1f1f1f 0%, #0a0a0a 100%)',
                padding: '16px 16px 0 16px',
              }}
            >
              {/* Top bezel details */}
              <div className="absolute top-0 left-0 right-0 h-[16px] flex items-center justify-center gap-2">
                {/* Camera housing */}
                <div 
                  className="relative w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)' }}
                >
                  {/* Camera lens */}
                  <div className="w-2 h-2 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#1a3a4a]" />
                  </div>
                  {/* Camera indicator light */}
                  <motion.div 
                    className="absolute -right-0.5 top-0.5 w-1 h-1 rounded-full"
                    animate={{ 
                      backgroundColor: isActive ? 'hsl(155 100% 50%)' : '#333',
                      boxShadow: isActive ? '0 0 4px hsl(155 100% 50%)' : 'none'
                    }}
                  />
                </div>
              </div>
              
              {/* Screen with glass effect */}
              <div 
                className="relative rounded-lg overflow-hidden"
                style={{ aspectRatio: '16/10' }}
              >
                {/* Screen inner shadow */}
                <div 
                  className="absolute inset-0 z-10 pointer-events-none rounded-lg"
                  style={{
                    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                />
                
                {/* Screen content */}
                <div className="relative bg-background">
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  
                  {/* Screen reflection overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.01) 100%)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom chin / hinge area */}
          <div 
            className="relative h-3 md:h-4"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a 0%, #252525 50%, #1a1a1a 100%)',
              borderBottomLeftRadius: '4px',
              borderBottomRightRadius: '4px',
            }}
          >
            {/* Hinge groove */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, #0a0a0a 20%, #0a0a0a 80%, transparent 100%)'
              }}
            />
          </div>
          
          {/* Keyboard base */}
          <div 
            className="relative h-5 md:h-7 rounded-b-xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #1f1f1f 0%, #141414 100%)',
            }}
          >
            {/* Keyboard top edge highlight */}
            <div 
              className="absolute top-0 left-4 right-4 h-px"
              style={{ background: 'linear-gradient(90deg, transparent 0%, #3a3a3a 50%, transparent 100%)' }}
            />
            
            {/* Keyboard keys indication */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-px opacity-30">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-4 md:w-6 h-2 md:h-3 rounded-sm"
                  style={{ background: '#2a2a2a' }}
                />
              ))}
            </div>
            
            {/* Trackpad */}
            <div 
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-16 md:w-24 h-2 md:h-3 rounded-sm"
              style={{ 
                background: 'linear-gradient(180deg, #1a1a1a 0%, #252525 100%)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
              }}
            />
            
            {/* Side vents */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2 flex gap-0.5 opacity-40">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-px h-2 bg-[#3a3a3a]" />
              ))}
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 flex gap-0.5 opacity-40">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-px h-2 bg-[#3a3a3a]" />
              ))}
            </div>
          </div>
          
          {/* Premium shadow layers */}
          <div 
            className="absolute -bottom-3 left-[5%] right-[5%] h-3 rounded-full blur-md"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          />
          <div 
            className="absolute -bottom-6 left-[10%] right-[10%] h-6 rounded-full blur-xl"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          />
          <motion.div 
            className="absolute -bottom-8 left-[15%] right-[15%] h-8 rounded-full blur-2xl"
            animate={{
              background: isActive 
                ? 'hsl(var(--primary) / 0.25)' 
                : 'rgba(0,0,0,0.2)'
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Text content below notebook */}
        <div className="text-center mt-4 md:mt-8 px-4">
          <motion.h3 
            className="text-xl md:text-4xl font-bold text-foreground mb-2 md:mb-3"
            style={{
              textShadow: isActive ? '0 0 20px hsl(var(--primary) / 0.5)' : 'none'
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {slide.title}
          </motion.h3>
          <motion.p 
            className="text-sm md:text-xl text-muted-foreground max-w-md mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {slide.description}
          </motion.p>
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
          className="absolute top-4 md:top-16 left-0 right-0 z-20 text-center px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label text-xs md:text-sm">O que você ganha</span>
          <h2 className="section-title text-xl md:text-4xl">Compromisso com qualidade</h2>
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
