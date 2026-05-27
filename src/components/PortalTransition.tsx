import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';

import { useDeviceTier } from '@/hooks/use-device-tier';

/**
 * Portal cósmico: duas mãos com luvas (azul + verde) entram pelas laterais,
 * batem palma no centro e a partir do "puf" nasce uma bolinha de energia
 * que cresce e revela a próxima seção.
 */
function GloveHand({ color, mirror = false }: { color: string; mirror?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-[180px] md:w-[260px]"
      style={{ transform: mirror ? 'scaleX(-1)' : undefined }}
    >
      <defs>
        <linearGradient id={`glove-${color.replace(/\s/g, '')}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.65" />
        </linearGradient>
      </defs>
      {/* Punho/luva */}
      <path
        d="M40 160 Q35 120 50 95 Q55 75 75 70 L75 50 Q75 35 90 35 Q105 35 105 50 L105 70 Q120 68 122 80 L122 55 Q122 40 137 40 Q152 40 152 55 L152 82 Q165 82 165 95 L165 120 Q165 165 130 175 Q90 185 60 178 Q45 172 40 160 Z"
        fill={`url(#glove-${color.replace(/\s/g, '')})`}
        stroke={color}
        strokeWidth="2"
      />
      {/* Punho cuff */}
      <rect x="55" y="155" width="90" height="22" rx="6" fill={color} opacity="0.55" />
      <line x1="55" y1="166" x2="145" y2="166" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
      {/* Detalhe brilho */}
      <ellipse cx="95" cy="100" rx="14" ry="28" fill="white" opacity="0.15" />
    </svg>
  );
}

export function PortalTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const isLight = tier === 'light';

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Mãos entram das laterais e se encontram no centro em ~0.45
  const handLeftX = useTransform(scrollYProgress, [0, 0.45], ['-50vw', '0vw']);
  const handRightX = useTransform(scrollYProgress, [0, 0.45], ['50vw', '0vw']);
  const handScale = useTransform(scrollYProgress, [0.4, 0.48, 0.55], [1, 1.18, 1]);
  const handOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.48, 0.56],
    [0, 1, 1, 0],
  );

  // Flash branco no impacto
  const flashOpacity = useTransform(
    scrollYProgress,
    [0.46, 0.5, 0.58],
    [0, 0.85, 0],
  );

  // Núcleo nasce no centro exatamente no "puf"
  const finalScale = isLight ? 35 : 60;
  const coreOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.95], [0, 1, 1]);
  const coreScale = useTransform(
    scrollYProgress,
    [0.45, 0.7, 0.95],
    [0, 2, finalScale],
  );
  const coreRotate = useTransform(scrollYProgress, [0.45, 0.95], [0, 220]);

  // Stage fade out no final — revela próxima seção
  const stageOpacity = useTransform(scrollYProgress, [0.92, 1], [1, 0]);

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
      style={{ height: '170vh' }}
    >
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
        style={{
          opacity: stageOpacity,
          background:
            'radial-gradient(ellipse at center, hsl(220 60% 12%) 0%, hsl(220 50% 8%) 60%, hsl(220 50% 6%) 100%)',
        }}
      >
        {/* Grid radial sutil */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(hsl(220 30% 14%) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Halo de fundo */}
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, hsl(195 100% 50% / 0.1) 0%, hsl(155 100% 50% / 0.06) 40%, transparent 70%)',
            filter: isLight ? 'none' : 'blur(60px)',
          }}
        />

        {/* Mão esquerda — luva AZUL */}
        <motion.div
          className="absolute top-1/2 left-1/2 z-30 pointer-events-none"
          style={{
            x: handLeftX,
            y: '-50%',
            translateX: '-100%',
            scale: handScale,
            opacity: handOpacity,
            filter: isLight ? 'none' : 'drop-shadow(0 0 18px hsl(195 100% 50% / 0.6))',
            ...gpu,
          }}
        >
          <GloveHand color="hsl(195 100% 50%)" />
        </motion.div>

        {/* Mão direita — luva VERDE */}
        <motion.div
          className="absolute top-1/2 left-1/2 z-30 pointer-events-none"
          style={{
            x: handRightX,
            y: '-50%',
            scale: handScale,
            opacity: handOpacity,
            filter: isLight ? 'none' : 'drop-shadow(0 0 18px hsl(155 100% 50% / 0.6))',
            ...gpu,
          }}
        >
          <GloveHand color="hsl(155 100% 50%)" mirror />
        </motion.div>

        {/* Flash branco do impacto */}
        <motion.div
          aria-hidden
          className="absolute inset-0 z-40 pointer-events-none bg-white"
          style={{ opacity: flashOpacity, mixBlendMode: 'screen' }}
        />

        {/* Núcleo — nasce no centro exato */}
        <motion.div
          className="absolute top-1/2 left-1/2 z-30 w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            x: '-50%',
            y: '-50%',
            opacity: coreOpacity,
            scale: coreScale,
            rotate: coreRotate,
            transformOrigin: '50% 50%',
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
                'radial-gradient(circle, hsl(155 100% 50% / 0.6) 0%, hsl(195 100% 50% / 0.3) 50%, transparent 75%)',
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
      </motion.div>
    </section>
  );
}

export default PortalTransition;
