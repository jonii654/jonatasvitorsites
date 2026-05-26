import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useDeviceTier } from '@/hooks/use-device-tier';

/**
 * Portal cósmico: transição imersiva entre Hero e a seção
 * "O DESIGN QUEM FAZ É VOCÊ". Inspiração: Shopify Editions / Apple.
 * 100% framer-motion + SVG/CSS — sem canvas, sem WebGL.
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

  // Cena A — texto guia (0–25%)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -40]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.96]);

  // Cena B — linhas convergentes (0–50%)
  const handLeftX = useTransform(scrollYProgress, [0, 0.45], ['-30vw', '14vw']);
  const handRightX = useTransform(scrollYProgress, [0, 0.45], ['30vw', '-14vw']);
  const handOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.7],
    [0, 0.85, 0.85, 0],
  );

  // Cena C — núcleo (35–60%)
  const coreOpacity = useTransform(scrollYProgress, [0.3, 0.45, 0.95], [0, 1, 1]);
  const finalScale = isLight ? 35 : 60;
  const coreScale = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.95],
    [0.4, 1.8, finalScale],
  );
  const coreRotate = useTransform(scrollYProgress, [0.3, 0.95], [0, 220]);

  // Cena D — portal abrindo (55–95%)
  const clipPct = useTransform(scrollYProgress, [0.55, 0.95], [0, 160]);
  const clipPath = useMotionTemplate`circle(${clipPct}% at 50% 50%)`;
  const revealOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const revealY = useTransform(scrollYProgress, [0.6, 0.95], [40, 0]);

  // Modo reduzido: mostra a cena final estática
  if (reduced) {
    return (
      <section className="relative min-h-[60vh] bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <span className="font-display text-[hsl(155_100%_50%)] text-xs font-semibold tracking-[0.3em] uppercase mb-4 block">
            Próximo capítulo
          </span>
          <h2 className="font-serif italic text-white text-4xl md:text-6xl leading-tight">
            Atravesse o portal
          </h2>
        </div>
      </section>
    );
  }

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
      style={{ height: '320vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-background">
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

        {/* ===== Cena A — texto guia ===== */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center"
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale, ...gpu }}
        >
          <span className="font-display text-[hsl(155_100%_50%)] text-[0.7rem] md:text-xs font-semibold tracking-[0.3em] uppercase mb-5">
            Portal criativo
          </span>
          <h2 className="font-serif italic text-white text-5xl sm:text-6xl md:text-8xl leading-[0.9] tracking-tight max-w-3xl">
            Atravesse a <span className="text-[hsl(195_100%_55%)]">porta</span>
          </h2>
          <p className="font-display text-slate-400 text-sm md:text-base font-light mt-6 max-w-md">
            Role para abrir o portal e revelar o próximo capítulo.
          </p>
          <div className="mt-10 text-[0.65rem] font-bold tracking-[0.3em] text-slate-500 uppercase animate-pulse flex items-center gap-2">
            <ArrowDown className="w-3 h-3" />
            Continue rolando
          </div>
        </motion.div>

        {/* ===== Cena B — linhas convergentes ===== */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-y-1/2 z-30 pointer-events-none"
          style={{
            x: handLeftX,
            opacity: handOpacity,
            marginLeft: '-50vw',
            ...gpu,
          }}
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
          style={{
            x: handRightX,
            opacity: handOpacity,
            marginRight: '-50vw',
            ...gpu,
          }}
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

        {/* ===== Cena C — núcleo de explosão ===== */}
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

        {/* ===== Cena D — portal abrindo (clip-path) ===== */}
        <motion.div
          className="absolute inset-0 z-40 bg-background flex items-center justify-center px-4"
          style={{ clipPath, ...gpu }}
        >
          {/* malha de fundo do interior */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(to right, hsl(0 0% 100% / 0.02) 1px, transparent 1px), linear-gradient(to bottom, hsl(0 0% 100% / 0.02) 1px, transparent 1px)',
              backgroundSize: '4rem 4rem',
            }}
          />
          {/* halo verde-ciano */}
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, hsl(155 100% 50% / 0.12) 0%, transparent 60%)',
            }}
          />

          <motion.div
            className="relative z-10 text-center max-w-3xl"
            style={{ opacity: revealOpacity, y: revealY }}
          >
            <span className="font-display text-[hsl(155_100%_50%)] text-[0.7rem] md:text-xs font-semibold tracking-[0.3em] uppercase mb-5 block">
              Próximo capítulo
            </span>
            <h2 className="font-black text-3xl sm:text-5xl md:text-7xl leading-tight tracking-tight">
              <span
                className="block text-white"
                style={{ textShadow: '0 2px 4px hsl(220 50% 5% / 0.5)' }}
              >
                O DESIGN
              </span>
              <span
                className="block"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(155 100% 55%) 0%, hsl(195 100% 60%) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                QUEM FAZ É VOCÊ!
              </span>
            </h2>
            <p className="font-display text-slate-300 text-sm md:text-lg font-light mt-6 max-w-xl mx-auto">
              Você está dentro do portal. Continue para experimentar.
            </p>
            <motion.div
              className="mt-10 inline-flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.3em] text-[hsl(155_100%_50%)] uppercase"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-3 h-3" />
              Toque para girar
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default PortalTransition;
