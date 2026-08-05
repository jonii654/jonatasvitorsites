import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from 'framer-motion';

import { useDeviceTier } from '@/hooks/use-device-tier';
import { useIsMobile } from '@/hooks/use-mobile';
import handLeftImg from '@/assets/hand-left-realistic.webp';
import handRightImg from '@/assets/hand-right-realistic.webp';

/**
 * Portal dimensional inspirado em "A Criação de Adão":
 * duas mãos humanas fotorrealistas entram pelas laterais, os indicadores
 * se tocam no centro, geram um flash + onda de choque, e a partir do "puf"
 * nasce uma esfera branca que cresce e teletransporta para a próxima seção.
 */
function HumanHand({
  src,
  color,
  side,
}: {
  src: string;
  color: string;
  side: 'left' | 'right';
}) {
  return (
    <div
      className="relative w-[240px] md:w-[360px]"
      style={{
        filter: `drop-shadow(0 10px 28px rgba(0,0,0,0.55)) drop-shadow(0 0 26px ${color}) drop-shadow(0 0 70px ${color})`,
      }}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        width={1024}
        height={640}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="w-full h-auto select-none"
        style={{
          transformOrigin: side === 'left' ? 'right center' : 'left center',
        }}
      />

    </div>
  );
}

export function PortalTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const isLight = tier === 'light';

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Suaviza o progresso — movimento orgânico das mãos (leve)
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.3,
    restDelta: 0.002,
  });

  // ETAPA 1 — Mãos entram das laterais e SE TOCAM no centro em 0.40
  const TOUCH = 0.4;
  // ETAPA 2 — pausa de contato (mãos encostadas) até 0.52
  const HOLD = 0.52;

  const handLeftX = useTransform(progress, [0, TOUCH], ['-70vw', '5vw']);
  const handRightX = useTransform(progress, [0, TOUCH], ['70vw', '-5vw']);
  // Mãos "respiram" só depois de encostar, sem antecipar a explosão
  const handScale = useTransform(progress, [0, TOUCH, HOLD], [0.9, 1, 1.04]);
  // Mãos ficam visíveis durante todo o contato e somem no flash
  const handOpacity = useTransform(
    progress,
    [0, 0.06, HOLD, HOLD + 0.06],
    [0, 1, 1, 0],
  );
  // Rotação sutil ao aproximar — mãos ficam horizontais no toque
  const handLeftRot = useTransform(progress, [0, TOUCH], [-6, 0]);
  const handRightRot = useTransform(progress, [0, TOUCH], [6, 0]);

  // ETAPA 3 — Flash SÓ depois do contato manter-se (nunca antes do toque)
  const flashOpacity = useTransform(
    progress,
    [HOLD, HOLD + 0.03, HOLD + 0.09],
    [0, 1, 0],
  );

  // Onda de choque expandindo do ponto de toque — só após o flash
  const shockScale = useTransform(progress, [HOLD + 0.02, 0.82], [0, 16]);
  const shockOpacity = useTransform(
    progress,
    [HOLD + 0.02, HOLD + 0.08, 0.82],
    [0, 0.95, 0],
  );

  // Núcleo cresce rápido — "sugando" para dentro após o flash
  const finalScale = isLight ? 26 : 46;
  const coreOpacity = useTransform(
    progress,
    [HOLD + 0.03, HOLD + 0.1, 0.9, 0.99],
    [0, 1, 1, 0],
  );
  const coreScale = useTransform(
    progress,
    [HOLD + 0.03, 0.8, 0.95],
    [0, 10, finalScale],
  );
  const coreRotate = useTransform(progress, [HOLD + 0.03, 0.99], [0, 80]);

  // Stage some só no fim — emenda direta no DesignStacking
  const stageOpacity = useTransform(progress, [0.9, 0.995], [1, 0]);


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
      style={{ height: isMobile ? '200vh' : '250vh' }}
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

        {/* Mão esquerda — humana com aura AZUL, âncora direita no centro */}
        <motion.div
          className="absolute top-1/2 left-1/2 z-30 pointer-events-none"
          style={{
            x: handLeftX,
            y: '-50%',
            translateX: '-100%',
            scale: handScale,
            opacity: handOpacity,
            rotate: handLeftRot,
            transformOrigin: 'right center',
            ...gpu,
          }}
        >
          <HumanHand src={handLeftImg} color="hsl(195 100% 55%)" side="left" />
        </motion.div>

        {/* Mão direita — humana com aura VERDE, âncora esquerda no centro */}
        <motion.div
          className="absolute top-1/2 left-1/2 z-30 pointer-events-none"
          style={{
            x: handRightX,
            y: '-50%',
            scale: handScale,
            opacity: handOpacity,
            rotate: handRightRot,
            transformOrigin: 'left center',
            ...gpu,
          }}
        >
          <HumanHand src={handRightImg} color="hsl(155 100% 55%)" side="right" />
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

        {/* Sparks radiais no impacto — depois do toque */}
        <Sparks progress={progress} start={HOLD + 0.02} count={isLight ? 8 : 14} />


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

function Sparks({
  progress,
  start,
  count,
}: {
  progress: import('framer-motion').MotionValue<number>;
  start: number;
  count: number;
}) {
  const sparks = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return { angle, dist: 120 + (i % 3) * 50, color: i % 2 === 0 ? 'hsl(195 100% 60%)' : 'hsl(155 100% 60%)' };
  });
  return (
    <>
      {sparks.map((s, i) => (
        <Spark key={i} progress={progress} start={start} angle={s.angle} dist={s.dist} color={s.color} />
      ))}
    </>
  );
}

function Spark({
  progress,
  start,
  angle,
  dist,
  color,
}: {
  progress: import('framer-motion').MotionValue<number>;
  start: number;
  angle: number;
  dist: number;
  color: string;
}) {
  const end = start + 0.15;
  const x = useTransform(progress, [start, end], [0, Math.cos(angle) * dist]);
  const y = useTransform(progress, [start, end], [0, Math.sin(angle) * dist]);
  const opacity = useTransform(progress, [start, start + 0.03, end], [0, 1, 0]);
  const scale = useTransform(progress, [start, end], [0.6, 1.6]);

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
