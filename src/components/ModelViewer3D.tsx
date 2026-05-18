import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Notebook3DShowcase } from './effects/Notebook3DShowcase';

export function ModelViewer3D() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax suave: o notebook sobe levemente conforme a seção atravessa a viewport
  const y = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [80, -80]);
  // Fade + zoom sutis na entrada e saída
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 1], [0.94, 1, 1.02]);

  return (
    <section ref={ref} className="relative py-8 md:py-16">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-3xl md:text-5xl font-bold text-foreground mb-8 tracking-wide uppercase"
          style={{ letterSpacing: '0.15em' }}
        >
          Explore em 3D
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex justify-center will-change-transform"
        >
          <motion.div
            style={{ y, opacity, scale }}
            className="w-full flex justify-center will-change-transform"
          >
            <Notebook3DShowcase />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
