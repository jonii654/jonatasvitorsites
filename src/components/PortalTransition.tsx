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
  const uid = `${color.replace(/[^a-z0-9]/gi, '')}${mirror ? 'r' : 'l'}`;
  const skin = `skin-${uid}`;
  const shade = `shade-${uid}`;
  const aura = `aura-${uid}`;

  return (
    <svg
      viewBox="0 0 320 200"
      className="w-[200px] md:w-[300px]"
      style={{
        transform: mirror ? 'scaleX(-1)' : undefined,
        filter: `drop-shadow(0 8px 24px rgba(0,0,0,0.55)) drop-shadow(0 0 22px ${color}) drop-shadow(0 0 60px ${color})`,
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient id={skin} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(28 40% 82%)" />
          <stop offset="45%" stopColor="hsl(24 38% 68%)" />
          <stop offset="100%" stopColor="hsl(18 32% 42%)" />
        </linearGradient>
        <radialGradient id={shade} cx="0.3" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={aura} cx="0.7" cy="0.5" r="0.7">
          <stop offset="0%" stopColor={color} stopOpacity="0.55" />
          <stop offset="55%" stopColor={color} stopOpacity="0.14" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura suave em volta */}
      <ellipse cx="200" cy="100" rx="170" ry="120" fill={`url(#${aura})`} />

      {/*
        Mão "Criação de Adão" — vista lateral, palma para baixo,
        indicador estendido apontando para a direita, polegar levantado,
        demais dedos suavemente curvados.
      */}
      <g stroke="hsl(18 40% 28%)" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
        {/* Antebraço */}
        <path
          d="M0 118 Q30 100 78 104 L108 108 Q118 120 118 132 L118 148 Q112 160 96 162 L40 162 Q12 158 0 144 Z"
          fill={`url(#${skin})`}
        />
        {/* Palma / dorso */}
        <path
          d="M96 96 Q140 88 176 96 Q198 102 208 118 L208 148 Q206 162 190 168 L118 168 Q100 166 96 152 Z"
          fill={`url(#${skin})`}
        />
        {/* Polegar levantado */}
        <path
          d="M118 100 Q126 68 148 60 Q168 56 176 72 Q180 88 168 100 Q156 108 140 106 Z"
          fill={`url(#${skin})`}
        />
        {/* Dedos curvados (médio/anelar) — atrás do indicador */}
        <path
          d="M188 108 Q222 106 234 122 L234 138 Q228 150 210 150 L188 148 Z"
          fill={`url(#${skin})`}
          opacity="0.92"
        />
        <path
          d="M188 138 Q220 140 230 154 L228 168 Q216 176 198 172 L186 166 Z"
          fill={`url(#${skin})`}
          opacity="0.9"
        />
        {/* Indicador estendido — ponto de contato */}
        <path
          d="M198 108
             Q240 100 278 104
             Q300 106 306 116
             Q308 124 300 128
             Q262 134 220 132
             Q200 130 196 122 Z"
          fill={`url(#${skin})`}
        />
        {/* Ponta do indicador (falange distal) */}
        <path
          d="M292 108 Q310 110 312 120 Q312 128 300 130 Q290 130 286 122 Z"
          fill={`url(#${skin})`}
        />
      </g>

      {/* Highlight geral (luz) */}
      <path
        d="M96 96 Q140 88 176 96 Q198 102 208 118 L208 130 Q160 118 120 122 Q100 122 96 132 Z"
        fill={`url(#${shade})`}
      />
      {/* Unha do indicador */}
      <ellipse cx="304" cy="118" rx="5" ry="3.5" fill="white" opacity="0.45" />
      {/* Micro glow no dedo — ponto de contato */}
      <circle cx="310" cy="120" r="4" fill="white" opacity="0.85" />
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

  // Mãos entram das laterais e param com pequeno gap — indicadores quase se tocando
  const handLeftX = useTransform(progress, [0, 0.5], ['-60vw', '-3vw']);
  const handRightX = useTransform(progress, [0, 0.5], ['60vw', '3vw']);
  const handScale = useTransform(progress, [0, 0.5, 0.58], [0.9, 1.05, 1.1]);
  const handOpacity = useTransform(
    progress,
    [0, 0.08, 0.54, 0.6],
    [0, 1, 1, 0],
  );
  // Rotação sutil ao aproximar — mãos ficam praticamente horizontais no toque
  const handLeftRot = useTransform(progress, [0, 0.5], [-8, 0]);
  const handRightRot = useTransform(progress, [0, 0.5], [8, 0]);

  // Flash do toque: pico curtíssimo (faísca)
  const flashOpacity = useTransform(
    progress,
    [0.5, 0.54, 0.6],
    [0, 1, 0],
  );

  // Onda de choque expandindo do ponto de toque
  const shockScale = useTransform(progress, [0.52, 0.68], [0, 14]);
  const shockOpacity = useTransform(progress, [0.52, 0.56, 0.68], [0, 0.95, 0]);

  // Núcleo cresce rápido — "sugando" para dentro
  const finalScale = isLight ? 26 : 50;
  const coreOpacity = useTransform(progress, [0.5, 0.56, 0.72, 0.82], [0, 1, 1, 0]);
  const coreScale = useTransform(
    progress,
    [0.5, 0.62, 0.76],
    [0, 8, finalScale],
  );
  const coreRotate = useTransform(progress, [0.5, 0.82], [0, 120]);

  // Stage some rápido logo após o flash — emenda instantânea no DesignStacking
  const stageOpacity = useTransform(progress, [0.56, 0.7], [1, 0]);


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

