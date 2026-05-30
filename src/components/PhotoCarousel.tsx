import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import photo1 from '@/assets/jonatas-photo-1.jpg';
import photo2 from '@/assets/jonatas-photo-2.jpg';

const photos = [
  { src: photo1, alt: 'Jônatas Vitor — Criador de Sites' },
  { src: photo2, alt: 'Jônatas Vitor' },
];

/**
 * "Card deck" — both photos visible at once, fanned out in an X shape like
 * holding two playing cards. Hover/tap fans them out further. Tapping the
 * back card brings it to the front.
 */
export function PhotoCarousel() {
  const [frontIndex, setFrontIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'center 50%'],
  });
  const brightness = useTransform(scrollYProgress, [0, 1], [0.25, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.4, 1]);

  const backIndex = (frontIndex + 1) % photos.length;

  // Rotation/offset: larger when "open" (hover/tap), tighter at rest
  const restRot = 6;
  const openRot = 14;
  const restX = 14; // %
  const openX = 28; // %

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto"
      style={{ aspectRatio: '4 / 5' }}
    >
      {/* Glow behind */}
      <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl pointer-events-none" />

      <motion.div
        className="relative w-full h-full"
        style={{ opacity, perspective: 1200 }}
        onHoverStart={() => setOpen(true)}
        onHoverEnd={() => setOpen(false)}
        onTapStart={() => setOpen(true)}
        onTap={() => setOpen(false)}
      >
        {/* BACK card (left, rotated negative) */}
        <motion.button
          type="button"
          aria-label="Trazer outra foto para frente"
          onClick={(e) => {
            e.stopPropagation();
            setFrontIndex(backIndex);
          }}
          className="absolute inset-0 rounded-3xl overflow-hidden border border-border/40 bg-background/40 cursor-pointer"
          animate={{
            rotate: open ? -openRot : -restRot,
            x: open ? `-${openX}%` : `-${restX}%`,
            y: open ? '2%' : '0%',
            scale: 0.96,
            zIndex: 1,
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ transformOrigin: 'bottom center' }}
        >
          <motion.img
            src={photos[backIndex].src}
            alt={photos[backIndex].alt}
            loading="eager"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: useTransform(brightness, (b) => `brightness(${b * 0.85})`) as any }}
          />
          {/* Subtle dim so back card reads as background */}
          <div className="absolute inset-0 bg-background/20 pointer-events-none" />
        </motion.button>

        {/* FRONT card (right, rotated positive) */}
        <motion.div
          className="absolute inset-0 rounded-3xl overflow-hidden border border-border/40 bg-background/40 shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
          animate={{
            rotate: open ? openRot : restRot,
            x: open ? `${openX}%` : `${restX}%`,
            y: open ? '-1%' : '0%',
            scale: 1,
            zIndex: 2,
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ transformOrigin: 'bottom center' }}
        >
          <motion.img
            key={frontIndex}
            src={photos[frontIndex].src}
            alt={photos[frontIndex].alt}
            loading="eager"
            {...({ fetchpriority: 'high' } as any)}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: useTransform(brightness, (b) => `brightness(${b})`) as any }}
          />
        </motion.div>
      </motion.div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {photos.map((_, i) => (
          <button
            key={i}
            aria-label={`Trazer foto ${i + 1} para frente`}
            onClick={() => setFrontIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === frontIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
