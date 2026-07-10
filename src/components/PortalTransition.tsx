import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from 'framer-motion';

import { useDeviceTier } from '@/hooks/use-device-tier';




/**
 * Portal dimensional: duas mãos humanas (azul + verde) entram pelas laterais,
 * se apertam palma com palma no centro, geram um flash + onda de choque,
 * e a partir do "puf" nasce uma esfera branca que cresce e teletransporta
 * para a próxima seção.
 */
function HumanHand({ color, mirror = false }: { color: string; mirror?: boolean }) {
  const auraId = `aura-${color.replace(/[^a-z0-9]/gi, '')}${mirror ? '-r' : '-l'}`;
  const gradId = `skin-${color.replace(/[^a-z0-9]/gi, '')}${mirror ? '-r' : '-l'}`;

  return (
    <svg
      viewBox="0 0 260 220"
      className="w-[170px] md:w-[250px]"
      style={{
        transform: mirror ? 'scaleX(-1)' : undefined,
        filter: `drop-shadow(0 0 14px ${color}) drop-shadow(0 0 38px ${color})`,
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="hsl(28 32% 82%)" />
          <stop offset="55%" stopColor="hsl(24 28% 64%)" />
          <stop offset="100%" stopColor="hsl(20 25% 42%)" />
        </linearGradient>
        <radialGradient id={auraId} cx="0.55" cy="0.5" r="0.6">
          <stop offset="0%" stopColor={color} stopOpacity="0.7" />
          <stop offset="60%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura */}
      <ellipse cx="140" cy="120" rx="140" ry="105" fill={`url(#${auraId})`} />

      {/*
        Mão vista de cima/lado — inspirada em "A Criação de Adão".
        Punho no canto esquerdo, indicador estendido apontando pra direita,
        polegar acima, e demais dedos recolhidos.
      */}
      {/* Antebraço/punho */}
      <path
        d="M0 140 Q10 120 40 118 L90 118 Q108 118 118 128 L118 168 Q108 178 90 178 L40 178 Q10 176 0 158 Z"
        fill={`url(#${gradId})`}
        stroke={color}
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      {/* Palma */}
      <path
        d="M90 112 Q140 108 168 120 Q180 126 180 140 L180 160 Q180 176 164 180 L100 180 Q88 180 88 168 L88 122 Q88 114 90 112 Z"
        fill={`url(#${gradId})`}
        stroke={color}
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      {/* Polegar (dobrado por cima) */}
      <path
        d="M112 118 Q118 96 138 92 Q152 90 156 100 Q158 110 150 118 Q140 124 132 122 Z"
        fill={`url(#${gradId})`}
        stroke={color}
        strokeOpacity="0.4"
        strokeWidth="1.1"
      />
      {/* Dedos recolhidos (médio/anelar/mindinho, empilhados) */}
      <path
        d="M168 124 Q200 126 208 138 Q212 148 202 156 Q188 162 168 158 Z"
        fill={`url(#${gradId})`}
        stroke={color}
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <path
        d="M172 148 Q198 150 204 160 Q208 168 198 174 Q182 178 168 174 Z"
        fill={`url(#${gradId})`}
        stroke={color}
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      {/* Indicador estendido — ponto de contato */}
      <path
        d="M168 132 Q210 128 240 132 Q252 134 252 140 Q252 146 240 148 Q210 152 168 148 Z"
        fill={`url(#${gradId})`}
        stroke={color}
        strokeOpacity="0.5"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Unha do indicador — sutil highlight */}
      <ellipse cx="246" cy="140" rx="5" ry="4" fill="white" opacity="0.35" />
      {/* Highlight na palma */}
      <ellipse cx="130" cy="150" rx="26" ry="12" fill="white" opacity="0.1" />
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

  // Suaviza o progresso do scroll com mola — elimina jank ao reverter direção
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.35,
    restDelta: 0.001,
  });

  // Mãos entram das laterais; param com pequeno gap (dedos indicadores quase se tocando)
  const handLeftX = useTransform(progress, [0, 0.42], ['-55vw', '-4vw']);
  const handRightX = useTransform(progress, [0, 0.42], ['55vw', '4vw']);
  const handScale = useTransform(progress, [0, 0.42], [1, 1.02]);
  const handOpacity = useTransform(
    progress,
    [0, 0.08, 0.46, 0.52],
    [0, 1, 1, 0],
  );
  // Sem rotação final "fechando palma" — mãos permanecem horizontais
  const handLeftRot = useTransform(progress, [0, 0.42], [-4, 0]);
  const handRightRot = useTransform(progress, [0, 0.42], [4, 0]);

  // Flash: pico curto e sai rápido — sensação de "faísca" no toque
  const flashOpacity = useTransform(
    progress,
    [0.42, 0.46, 0.52],
    [0, 0.95, 0],
  );

  // Onda de choque acelerada
  const shockScale = useTransform(progress, [0.44, 0.58], [0, 10]);
  const shockOpacity = useTransform(progress, [0.44, 0.48, 0.58], [0, 0.9, 0]);

  // Núcleo cresce rápido — imersão instantânea
  const finalScale = isLight ? 22 : 40;
  const coreOpacity = useTransform(progress, [0.44, 0.5, 0.62, 0.72], [0, 1, 1, 0]);
  const coreScale = useTransform(
    progress,
    [0.44, 0.55, 0.66],
    [0, 6, finalScale],
  );
  const coreRotate = useTransform(progress, [0.44, 0.72], [0, 90]);

  // Stage sai cedo — emenda direto no DesignStacking (imersão instantânea)
  const stageOpacity = useTransform(progress, [0.5, 0.62], [1, 0]);


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
      style={{ height: '80vh' }}
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

        {/* Onda de choque — branca */}
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

        {/* Onda de choque — ciano (segunda camada) */}
        <motion.div
          aria-hidden
          className="absolute top-1/2 left-1/2 z-30 w-24 h-24 rounded-full pointer-events-none"
          style={{
            x: '-50%',
            y: '-50%',
            scale: shockScale,
            opacity: shockOpacity,
            border: '2px solid hsl(195 100% 65% / 0.8)',
            ...gpu,
          }}
        />

        {/* Sparks radiais no impacto */}
        <Sparks progress={progress} />


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

function Sparks({ progress }: { progress: import('framer-motion').MotionValue<number> }) {
  const N = 16;
  const sparks = Array.from({ length: N }, (_, i) => {
    const angle = (i / N) * Math.PI * 2;
    return { angle, dist: 120 + (i % 3) * 50, color: i % 2 === 0 ? 'hsl(195 100% 60%)' : 'hsl(155 100% 60%)' };
  });
  return (
    <>
      {sparks.map((s, i) => (
        <Spark key={i} progress={progress} angle={s.angle} dist={s.dist} color={s.color} />
      ))}
    </>
  );
}

function Spark({
  progress,
  angle,
  dist,
  color,
}: {
  progress: import('framer-motion').MotionValue<number>;
  angle: number;
  dist: number;
  color: string;
}) {
  const x = useTransform(progress, [0.44, 0.58], [0, Math.cos(angle) * dist]);
  const y = useTransform(progress, [0.44, 0.58], [0, Math.sin(angle) * dist]);
  const opacity = useTransform(progress, [0.44, 0.48, 0.58], [0, 1, 0]);
  const scale = useTransform(progress, [0.44, 0.58], [0.6, 1.4]);
  return (
    <motion.div
      aria-hidden
      className="absolute top-1/2 left-1/2 z-30 w-2 h-2 rounded-full pointer-events-none"
      style={{
        x,
        y,
        opacity,
        scale,
        translateX: '-50%',
        translateY: '-50%',
        background: color,
        boxShadow: `0 0 12px ${color}, 0 0 24px ${color}`,
      }}
    />
  );
}

export default PortalTransition;

