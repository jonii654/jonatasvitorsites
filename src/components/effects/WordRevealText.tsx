import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useDeviceTier } from '@/hooks/use-device-tier';

interface WordRevealTextProps {
  text: string;
  className?: string;
  /** Color of the dim (not-yet-revealed) words */
  dimClassName?: string;
  /** Color of the revealed words */
  brightClassName?: string;
}

/**
 * Reveals text word-by-word as the user scrolls through it.
 * Each word transitions from a dim color to a bright one based on scroll progress.
 * Falls back to a single fade-in on light devices.
 */
export function WordRevealText({
  text,
  className = '',
  dimClassName = 'text-muted-foreground/30',
  brightClassName = 'text-foreground',
}: WordRevealTextProps) {
  const tier = useDeviceTier();
  const containerRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.55'],
  });

  const words = text.split(' ');

  if (tier === 'light') {
    return (
      <motion.p
        ref={containerRef}
        className={`${className} ${brightClassName}`}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        {text}
      </motion.p>
    );
  }

  return (
    <p ref={containerRef} className={className}>
      {words.map((w, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          dimClassName={dimClassName}
          brightClassName={brightClassName}
        >
          {w + (i === words.length - 1 ? '' : ' ')}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  dimClassName,
  brightClassName,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  dimClassName: string;
  brightClassName: string;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <span className="relative inline">
      <span className={`absolute inset-0 ${dimClassName}`}>{children}</span>
      <motion.span style={{ opacity }} className={brightClassName}>
        {children}
      </motion.span>
    </span>
  );
}
