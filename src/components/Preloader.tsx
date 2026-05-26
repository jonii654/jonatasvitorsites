import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onFinish: () => void;
}

export function Preloader({ onFinish }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const DURATION = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DURATION);
      // ease out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => setVisible(false), 250);
        setTimeout(onFinish, 750);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Carregando experiência"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 50% at 50% 50%, hsla(195 100% 50% / 0.08), transparent 70%)',
          }}
        >
          {/* Top-left: Loading label */}
          <div className="absolute top-6 left-6 md:top-10 md:left-10 text-left">
            <p className="text-xs md:text-sm font-medium text-foreground/80 leading-tight">
              Loading
            </p>
            <p className="text-xs md:text-sm text-muted-foreground leading-tight">
              your experience…
            </p>
          </div>

          {/* Top-right: percentage */}
          <div className="absolute top-6 right-6 md:top-10 md:right-10">
            <span className="text-5xl md:text-7xl font-light tabular-nums text-foreground/70">
              {progress}%
            </span>
          </div>

          {/* Center: logo with concentric pulse */}
          <div className="relative flex flex-col items-center justify-center">
            {/* concentric rings */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute rounded-full border border-primary/30"
                initial={{ width: 80, height: 80, opacity: 0.6 }}
                animate={{
                  width: [80, 260],
                  height: [80, 260],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: i * 0.8,
                }}
              />
            ))}
            <div className="relative z-10 flex items-baseline gap-2">
              <span className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Jônatas
              </span>
              <span className="text-3xl md:text-5xl font-light text-foreground/80">
                Vitor
              </span>
            </div>
            <p className="mt-3 text-[10px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Sites que vendem
            </p>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-4 flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
              </span>
              <p className="text-[10px] md:text-xs font-medium text-yellow-300">
                Site em manutenção — pode apresentar pequenos bugs
              </p>
            </motion.div>
          </div>

          {/* Bottom labels */}
          <div className="absolute bottom-12 left-6 right-6 md:bottom-16 md:left-10 md:right-10 flex justify-between text-[10px] md:text-xs text-muted-foreground/80">
            <span>Sites que vendem</span>
            <span className="hidden md:inline">Design premium</span>
            <span>Entrega rápida</span>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-10 md:right-10 h-px bg-foreground/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
