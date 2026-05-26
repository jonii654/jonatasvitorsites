import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import pilotImage from '@/assets/pilot-card.jpg';

export function Interactive3DCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const ctaY = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -80]);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120, mass: 0.4 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Reactive shadow that follows rotation
  const dynamicShadow = useTransform(
    springRotateY,
    (v) => `${-v * 0.6}px 20px 40px hsl(220 50% 5% / 0.5), ${-v * 0.3}px 10px 60px hsl(195 100% 55% / 0.18)`
  );
  // Specular highlight that moves with rotateY
  const highlightX = useTransform(springRotateY, [-45, 0, 45], ['85%', '50%', '15%']);
  const highlightBg = useTransform(
    highlightX,
    (x) => `radial-gradient(circle at ${x} 30%, hsl(0 0% 100% / 0.18), transparent 55%)`
  );

  // Detect touch device
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    const update = () => {
      setIsTouchDevice(mq.matches);
      setIsUnlocked(!mq.matches); // desktop = always unlocked
    };
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-lock after inactivity (touch only)
  const idleTimer = useRef<number | null>(null);
  const scheduleAutoLock = useCallback(() => {
    if (!isTouchDevice) return;
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      setIsUnlocked(false);
    }, 2500);
  }, [isTouchDevice]);
  const cancelAutoLock = useCallback(() => {
    if (idleTimer.current) {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  }, []);

  // Click-outside to lock
  useEffect(() => {
    if (!isUnlocked || !isTouchDevice) return;
    const onDocPointer = (e: PointerEvent) => {
      if (!cardRef.current) return;
      if (!cardRef.current.contains(e.target as Node)) {
        setIsUnlocked(false);
      }
    };
    document.addEventListener('pointerdown', onDocPointer);
    return () => document.removeEventListener('pointerdown', onDocPointer);
  }, [isUnlocked, isTouchDevice]);

  const handlePointerLeave = useCallback(() => {
    if (!isDragging && !isSpinning) {
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [isDragging, isSpinning, rotateX, rotateY]);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const initialRotateX = useRef(0);
  const initialRotateY = useRef(0);

  // Double-tap detection
  const lastTapTime = useRef(0);
  const handleDoubleTapCheck = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch') return false;
    const now = Date.now();
    const delta = now - lastTapTime.current;
    lastTapTime.current = now;
    if (delta > 0 && delta < 320) {
      setIsUnlocked(true);
      navigator.vibrate?.(15);
      scheduleAutoLock();
      lastTapTime.current = 0;
      return true;
    }
    return false;
  }, [scheduleAutoLock]);

  const handleDragStart = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isSpinning) return;

    // Touch + locked: let the page scroll, just listen for double-tap
    if (e.pointerType === 'touch' && !isUnlocked) {
      handleDoubleTapCheck(e);
      return;
    }

    // Touch + unlocked: refresh lastTapTime so a second tap doesn't re-trigger
    if (e.pointerType === 'touch') {
      lastTapTime.current = Date.now();
      cancelAutoLock();
    }

    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    lastTime.current = Date.now();
    velocityX.current = 0;
    velocityY.current = 0;
    initialRotateX.current = rotateX.get();
    initialRotateY.current = rotateY.get();
    try {
      cardRef.current?.setPointerCapture(e.pointerId);
    } catch { /* ignore */ }
  }, [isSpinning, isUnlocked, handleDoubleTapCheck, cancelAutoLock, rotateX, rotateY]);

  const handleDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const now = Date.now();
    const dt = Math.max(now - lastTime.current, 1);
    velocityX.current = (e.clientX - lastX.current) / dt;
    velocityY.current = (e.clientY - lastY.current) / dt;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    lastTime.current = now;
    const deltaX = e.clientX - dragStartX.current;
    const deltaY = e.clientY - dragStartY.current;
    const sensitivity = 0.6;
    const newRotateY = initialRotateY.current + deltaX * sensitivity;
    const newRotateX = initialRotateX.current - deltaY * sensitivity;
    rotateY.set(newRotateY);
    rotateX.set(Math.max(-45, Math.min(45, newRotateX)));
  }, [isDragging, rotateX, rotateY]);

  const handleDragEnd = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      if (e.pointerType === 'touch' && isUnlocked) scheduleAutoLock();
      return;
    }
    setIsDragging(false);
    try {
      cardRef.current?.releasePointerCapture(e.pointerId);
    } catch { /* ignore */ }
    const vx = velocityX.current;
    const vy = velocityY.current;
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > 0.3) {
      setIsSpinning(true);
      const spinMultiplier = 150;
      const targetRotateY = rotateY.get() + vx * spinMultiplier;
      const targetRotateX = Math.max(-45, Math.min(45, rotateX.get() - vy * spinMultiplier * 0.3));
      const duration = Math.min(800 + speed * 400, 1800);
      let start: number | null = null;
      const startRotateY = rotateY.get();
      const startRotateX = rotateX.get();
      const animateSpin = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        rotateY.set(startRotateY + (targetRotateY - startRotateY) * easeOut);
        rotateX.set(startRotateX + (targetRotateX - startRotateX) * easeOut);
        if (progress < 1) {
          requestAnimationFrame(animateSpin);
        } else {
          setTimeout(() => {
            rotateX.set(0);
            rotateY.set(0);
            setIsSpinning(false);
            if (e.pointerType === 'touch' && isUnlocked) scheduleAutoLock();
          }, 200);
        }
      };
      requestAnimationFrame(animateSpin);
    } else {
      rotateX.set(0);
      rotateY.set(0);
      if (e.pointerType === 'touch' && isUnlocked) scheduleAutoLock();
    }
  }, [isDragging, isUnlocked, scheduleAutoLock, rotateX, rotateY]);

  const showLockedHint = isTouchDevice && !isUnlocked;

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 lg:py-36">
      <div className="absolute inset-0 bg-background" />

      {isVisible && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[350px] md:h-[350px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[45vh] md:min-h-[55vh] pt-6 md:pt-0">

          <motion.div
            className="mb-16 md:mb-24 lg:mb-32 text-center"
            style={{ y: ctaY }}
            initial={{ opacity: 0, scale: 0.3 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              <span
                className="block text-white"
                style={{ textShadow: '0 2px 4px hsl(220 50% 5% / 0.5)' }}
              >
                O DESIGN
              </span>
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, hsl(155 100% 55%) 0%, hsl(195 100% 60%) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                QUEM FAZ É VOCÊ!
              </span>
            </h2>
          </motion.div>

          <motion.div
            ref={cardRef}
            className={`relative ${isUnlocked ? 'cursor-grab active:cursor-grabbing touch-none' : 'cursor-pointer touch-pan-y'}`}
            style={{ perspective: 1200 }}
            onPointerMove={handleDrag}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handleDragStart}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={isVisible && imageLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="relative w-[280px] h-[180px] sm:w-[340px] sm:h-[220px] md:w-[500px] md:h-[320px] lg:w-[640px] lg:h-[400px] xl:w-[720px] xl:h-[450px] rounded-2xl overflow-hidden"
              style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: 'preserve-3d',
                boxShadow: dynamicShadow,
                willChange: 'transform',
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl p-[1px]"
                style={{
                  background: isUnlocked
                    ? 'linear-gradient(135deg, hsl(195 100% 60% / 0.9), hsl(155 100% 55% / 0.6))'
                    : 'linear-gradient(135deg, hsl(var(--primary) / 0.5), hsl(var(--accent) / 0.3))',
                  transition: 'background 0.4s ease',
                }}
              >
                <div className="w-full h-full rounded-[15px] overflow-hidden bg-card/80 relative">
                  <img
                    src={pilotImage}
                    alt="Design Premium"
                    className="w-full h-full object-cover"
                    style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.18s ease-out' }}
                    draggable={false}
                    loading="eager"
                    {...({ fetchpriority: 'high' } as any)}
                    onLoad={() => setImageLoaded(true)}
                  />
                  {/* Specular highlight overlay */}
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: useTransform(
                        highlightX,
                        (x) => `radial-gradient(circle at ${x} 30%, hsl(0 0% 100% / 0.18), transparent 55%)`
                      ),
                      mixBlendMode: 'overlay',
                    }}
                  />
                </div>
              </div>

              {/* Unlocked glow ring */}
              <AnimatePresence>
                {isUnlocked && isTouchDevice && (
                  <motion.div
                    aria-hidden
                    className="absolute -inset-1 rounded-2xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      boxShadow: '0 0 0 2px hsl(195 100% 55% / 0.5), 0 0 30px hsl(195 100% 55% / 0.4)',
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Active mode badge */}
            <AnimatePresence>
              {isUnlocked && isTouchDevice && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md whitespace-nowrap"
                  style={{
                    background: 'hsl(220 50% 8% / 0.8)',
                    border: '1px solid hsl(195 100% 55% / 0.4)',
                    boxShadow: '0 4px 20px hsl(195 100% 55% / 0.25)',
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-[hsl(155_100%_55%)] animate-pulse" />
                  <span className="text-xs font-medium text-white">Modo 3D ativo</span>
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setIsUnlocked(false);
                      cancelAutoLock();
                    }}
                    className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Sair do modo 3D"
                  >
                    <X size={12} className="text-white/70" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 text-xs md:text-sm text-muted-foreground/60 whitespace-nowrap">
              {showLockedHint ? 'Toque 2x para girar' : 'Arraste para girar'}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
