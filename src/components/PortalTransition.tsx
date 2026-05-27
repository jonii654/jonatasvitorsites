import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';

import { useDeviceTier } from '@/hooks/use-device-tier';

/**
 * Portal cósmico: a bolinha nasce no centro, cresce e "rasga" o fundo,
 * revelando direto a próxima seção (Interactive3DCard).
 */
export function PortalTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const isLight = tier === 'light';

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Linhas convergentes (0 → 50%)
  const handLeftX = useTransform(scrollYProgress, [0, 0.45], ['-30vw', '12vw']);
  const handRightX = useTransform(scrollYProgress, [0, 0.45], ['30vw', '-12vw']);
  const handOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.45, 0.6],
    [0, 0.85, 0.85, 0],
  );

  // Núcleo — nasce no meio, cresce ocupando tudo
  const finalScale = isLight ? 35 : 60;
  const coreOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9], [0, 1, 1]);
  const coreScale = useTransform(
    scrollYProgress,
    [0, 0.45, 0.9],
    [0, 1.8, finalScale],
  );
  const coreRotate = useTransform(scrollYProgress, [0, 0.9], [0, 220]);

  // Fade final — a bolinha gigante "abre" e revela suavemente o que vem depois
  const stageOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);



  if (reduced) return null;

  const gpu = {
    willChange: 'transform, opacity',
    transform: 'translate3d(0,0,0)',
    backfaceVisibility: 'hidden' as const,
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Transição portal cósmico"
      className="relative w-full"
      style={{ height: '220vh' }}
    >
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-background"
        style={{ opacity: stageOpacity }}
      >

        {/* Grid radial sutil */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(hsl(220 30% 12%) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Halo radial de fundo */}
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, hsl(195 100% 50% / 0.08) 0%, transparent 60%)',
            filter: isLight ? 'none' : 'blur(60px)',
          }}
        />

        {/* Linhas convergentes */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-y-1/2 z-30 pointer-events-none"
          style={{ x: handLeftX, opacity: handOpacity, marginLeft: '-50vw', ...gpu }}
        >
          <svg
            viewBox="0 0 200 100"
            className="w-[260px] md:w-[420px] text-[hsl(195_100%_55%)]"
            fill="none"
            style={{
              filter: isLight
                ? 'none'
                : 'drop-shadow(0 0 10px hsl(195 100% 50% / 0.5))',
            }}
          >
            <path
              d="M10,60 C30,55 50,58 70,52 C90,46 110,35 130,35 C140,35 160,40 175,38 C185,36 195,30 200,31"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeDasharray="2 3"
            />
            <circle cx="130" cy="35" r="2.5" fill="currentColor" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-1/2 -translate-y-1/2 z-30 pointer-events-none"
          style={{ x: handRightX, opacity: handOpacity, marginRight: '-50vw', ...gpu }}
        >
          <svg
            viewBox="0 0 200 100"
            className="w-[260px] md:w-[420px] text-[hsl(155_100%_50%)]"
            fill="none"
            style={{
              filter: isLight
                ? 'none'
                : 'drop-shadow(0 0 10px hsl(155 100% 50% / 0.5))',
            }}
          >
            <path
              d="M190,60 C170,55 150,58 130,52 C110,46 90,35 70,35 C60,35 40,40 25,38 C15,36 5,30 0,31"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeDasharray="2 3"
            />
            <circle cx="70" cy="35" r="2.5" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Núcleo — nasce no meio */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            opacity: coreOpacity,
            scale: coreScale,
            rotate: coreRotate,
            ...gpu,
          }}
        >
          {!isLight && (
            <div className="absolute inset-[-18px] rounded-full border border-[hsl(155_100%_50%/0.4)] animate-ping" />
          )}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle, hsl(155 100% 50% / 0.55) 0%, hsl(195 100% 50% / 0.25) 50%, transparent 75%)',
              mixBlendMode: 'screen',
            }}
          />
          <div
            className="absolute inset-3 rounded-full bg-white"
            style={{
              boxShadow:
                '0 0 18px hsl(0 0% 100% / 0.95), 0 0 40px hsl(195 100% 60% / 0.6)',
            }}
          />
        </motion.div>

      </div>
    </section>
  );
}

export default PortalTransition;
