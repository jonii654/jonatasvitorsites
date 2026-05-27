import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';

import { useDeviceTier } from '@/hooks/use-device-tier';

/**
 * Portal dimensional: duas mãos humanas (azul + verde) entram pelas laterais,
 * se apertam palma com palma no centro, geram um flash + onda de choque,
 * e a partir do "puf" nasce uma esfera branca que cresce e teletransporta
 * para a próxima seção.
 */
function HumanHand({ color, mirror = false }: { color: string; mirror?: boolean }) {
  // ID único para o filter de aura
  const auraId = `aura-${color.replace(/[^a-z0-9]/gi, '')}${mirror ? '-r' : '-l'}`;
  const gradId = `skin-${color.replace(/[^a-z0-9]/gi, '')}${mirror ? '-r' : '-l'}`;

  return (
    <svg
      viewBox="0 0 240 300"
      className="w-[160px] md:w-[240px]"
      style={{
        transform: mirror ? 'scaleX(-1)' : undefined,
        filter: `drop-shadow(0 0 14px ${color}) drop-shadow(0 0 38px ${color})`,
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="hsl(28 30% 78%)" />
          <stop offset="55%" stopColor="hsl(24 28% 62%)" />
          <stop offset="100%" stopColor="hsl(20 25% 42%)" />
        </linearGradient>
        <radialGradient id={auraId} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor={color} stopOpacity="0.7" />
          <stop offset="60%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura colorida atrás da mão */}
      <ellipse cx="120" cy="170" rx="120" ry="135" fill={`url(#${auraId})`} />

      {/* Mão humana 2D — palma + 5 dedos, lateral (palma virada pro centro) */}
      {/* Punho */}
      <path
        d="M70 295 Q70 270 80 255 L160 255 Q170 270 170 295 Z"
        fill={`url(#${gradId})`}
        stroke={color}
        strokeOpacity="0.5"
        strokeWidth="1.2"
      />
      {/* Palma + dedos */}
      <path
        d="
          M80 255
          Q70 220 72 185
          L70 120
          Q70 105 82 105
          Q94 105 94 120
          L94 165
          L100 165
          L100 70
          Q100 55 113 55
          Q126 55 126 70
          L126 165
          L132 165
          L132 60
          Q132 45 145 45
          Q158 45 158 60
          L158 168
          L164 168
          L164 80
          Q164 66 176 66
          Q188 66 188 80
          L188 180
          L194 182
          L196 150
          Q198 135 210 138
          Q222 142 218 158
          L208 210
          Q200 245 180 258
          L160 255
          Z
        "
        fill={`url(#${gradId})`}
        stroke={color}
        strokeOpacity="0.4"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Linhas da palma — sutil */}
      <path
        d="M95 200 Q120 210 150 200 M100 225 Q130 232 160 222"
        stroke="hsl(20 30% 30%)"
        strokeOpacity="0.35"
        strokeWidth="1"
        fill="none"
      />
      {/* Highlight */}
      <ellipse cx="135" cy="170" rx="22" ry="40" fill="white" opacity="0.08" />
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

  // Mãos entram das laterais e se encontram no centro — curva monotônica, reversível
  const handLeftX = useTransform(scrollYProgress, [0, 0.45], ['-55vw', '0vw']);
  const handRightX = useTransform(scrollYProgress, [0, 0.45], ['55vw', '0vw']);
  // Scale linear sem picos (evita trava ao reverter)
  const handScale = useTransform(scrollYProgress, [0, 0.45, 0.55], [1, 1.05, 1]);
  const handOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.5, 0.58],
    [0, 1, 1, 0],
  );
  // Rotação monotônica simples
  const handLeftRot = useTransform(scrollYProgress, [0, 0.45], [-10, 0]);
  const handRightRot = useTransform(scrollYProgress, [0, 0.45], [10, 0]);

  // Flash branco — entra e sai linear
  const flashOpacity = useTransform(
    scrollYProgress,
    [0.42, 0.48, 0.56],
    [0, 1, 0],
  );

  // Onda de choque — linear
  const shockScale = useTransform(scrollYProgress, [0.46, 0.62], [0, 10]);
  const shockOpacity = useTransform(scrollYProgress, [0.46, 0.5, 0.62], [0, 0.9, 0]);


  // Núcleo nasce no centro exatamente no "puf"
  const finalScale = isLight ? 40 : 70;
  const coreOpacity = useTransform(scrollYProgress, [0.46, 0.55, 0.92], [0, 1, 1]);
  const coreScale = useTransform(
    scrollYProgress,
    [0.46, 0.7, 0.92],
    [0, 3, finalScale],
  );
  const coreRotate = useTransform(scrollYProgress, [0.46, 0.92], [0, 180]);

  // Stage fade out mais rápido — sensação de teletransporte
  const stageOpacity = useTransform(scrollYProgress, [0.82, 0.95], [1, 0]);

  if (reduced) return null;

  const gpu = {
    willChange: 'transform, opacity',
    transform: 'translate3d(0,0,0)',
    backfaceVisibility: 'hidden' as const,
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Transição portal dimensional"
      className="relative w-full"
      style={{ height: '120vh' }}
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

        {/* Mão esquerda — humana com aura AZUL */}
        <motion.div
          className="absolute top-1/2 left-1/2 z-30 pointer-events-none"
          style={{
            x: handLeftX,
            y: '-50%',
            translateX: '-100%',
            scale: handScale,
            opacity: handOpacity,
            rotate: handLeftRot,
            ...gpu,
          }}
        >
          <HumanHand color="hsl(195 100% 55%)" />
        </motion.div>

        {/* Mão direita — humana com aura VERDE */}
        <motion.div
          className="absolute top-1/2 left-1/2 z-30 pointer-events-none"
          style={{
            x: handRightX,
            y: '-50%',
            scale: handScale,
            opacity: handOpacity,
            rotate: handRightRot,
            ...gpu,
          }}
        >
          <HumanHand color="hsl(155 100% 55%)" mirror />
        </motion.div>

        {/* Onda de choque */}
        <motion.div
          aria-hidden
          className="absolute top-1/2 left-1/2 z-30 w-32 h-32 rounded-full pointer-events-none"
          style={{
            x: '-50%',
            y: '-50%',
            scale: shockScale,
            opacity: shockOpacity,
            border: '2px solid hsl(0 0% 100% / 0.9)',
            boxShadow: '0 0 60px hsl(195 100% 60% / 0.6), inset 0 0 40px hsl(155 100% 60% / 0.4)',
            ...gpu,
          }}
        />

        {/* Flash branco do impacto */}
        <motion.div
          aria-hidden
          className="absolute inset-0 z-40 pointer-events-none bg-white"
          style={{ opacity: flashOpacity, mixBlendMode: 'screen' }}
        />

        {/* Núcleo — esfera branca que cresce e vira portal */}
        <motion.div
          className="absolute top-1/2 left-1/2 z-30 w-20 h-20 rounded-full flex items-center justify-center"
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
                'radial-gradient(circle, hsl(0 0% 100% / 0.9) 0%, hsl(195 100% 70% / 0.5) 40%, hsl(155 100% 60% / 0.3) 70%, transparent 90%)',
              mixBlendMode: 'screen',
            }}
          />
          <div
            className="absolute inset-4 rounded-full bg-white"
            style={{
              boxShadow:
                '0 0 28px hsl(0 0% 100% / 0.95), 0 0 60px hsl(195 100% 60% / 0.7), 0 0 90px hsl(155 100% 60% / 0.5)',
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default PortalTransition;
