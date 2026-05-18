import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import photo1 from '@/assets/jonatas-photo-1.jpg';
import photo2 from '@/assets/jonatas-photo-2.jpg';

const photos = [
  { src: photo1, alt: 'Jônatas Vitor — Criador de Sites' },
  { src: photo2, alt: 'Jônatas Vitor' },
];

/**
 * Two-photo carousel with a "emerge from darkness" scroll-driven effect.
 * Each photo enters dark + scaled-up and brightens to full as it scrolls into view.
 */
export function PhotoCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'center 50%'],
  });

  const brightness = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.3, 1]);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + photos.length) % photos.length);
  };

  // Swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
    touchStart.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto"
      style={{ aspectRatio: '4 / 5' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Subtle glow behind */}
      <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border/40 bg-background/40">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={index}
            src={photos[index].src}
            alt={photos[index].alt}
            custom={direction}
            initial={{ opacity: 0, x: direction === 0 ? 0 : direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 40 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              filter: useTransform(brightness, (b) => `brightness(${b})`),
              scale,
              opacity,
            } as any}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </AnimatePresence>

        {/* Arrows - desktop */}
        <button
          aria-label="Foto anterior"
          onClick={() => go(-1)}
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center bg-background/60 backdrop-blur-md border border-border/40 hover:bg-background/80 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          aria-label="Próxima foto"
          onClick={() => go(1)}
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center bg-background/60 backdrop-blur-md border border-border/40 hover:bg-background/80 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {photos.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir para foto ${i + 1}`}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
