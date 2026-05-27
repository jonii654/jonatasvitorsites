import { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';
import pilotImage from '@/assets/pilot-card.jpg';
import card1 from '@/assets/design-ref-1-hadi.jpg';
import card2 from '@/assets/design-ref-2-kpr.jpg';
import card3 from '@/assets/design-ref-3-ascend.jpg';
import card4 from '@/assets/design-ref-4-oryzo.jpg';

gsap.registerPlugin(ScrollTrigger);

const STACK_CARDS = [
  { img: card1, label: 'Performance' },
  { img: card2, label: 'Bold' },
  { img: card3, label: 'Editorial' },
  { img: card4, label: 'Artesanal' },
];

export function Interactive3DCard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const pilotWrapRef = useRef<HTMLDivElement>(null);
  const stackRefs = useRef<HTMLDivElement[]>([]);
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pilotInteractive, setPilotInteractive] = useState(true);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120, mass: 0.4 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const dynamicShadow = useMotionValue('0px 20px 40px hsl(220 50% 5% / 0.5)');
  const highlightX = useMotionValue('50%');

  // Detect touch device
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    const update = () => {
      setIsTouchDevice(mq.matches);
      setIsUnlocked(!mq.matches);
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

  // GSAP stacking timeline — pilot card recedes, 4 design cards rise on top
  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const ctx = gsap.context(() => {
      // initial: stack cards parked below
      gsap.set(stackRefs.current, { yPercent: 100, opacity: 1, scale: 1, force3D: true });

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none', force3D: true } });

      // Step 1: card1 sobe; pilot recua pro fundo
      tl.to(stackRefs.current[0], { yPercent: 0, duration: 1 }, 0);
      if (pilotWrapRef.current) {
        tl.to(pilotWrapRef.current, { scale: 0.88, opacity: 0.35, yPercent: -10, duration: 1 }, 0);
      }
      // Step 2
      tl.to(stackRefs.current[1], { yPercent: 0, duration: 1 }, 1)
        .to(stackRefs.current[0], { scale: 0.9, opacity: 0.4, yPercent: -8, duration: 1 }, 1);
      // Step 3
      tl.to(stackRefs.current[2], { yPercent: 0, duration: 1 }, 2)
        .to(stackRefs.current[1], { scale: 0.92, opacity: 0.4, yPercent: -6, duration: 1 }, 2);
      // Step 4
      tl.to(stackRefs.current[3], { yPercent: 0, duration: 1 }, 3)
        .to(stackRefs.current[2], { scale: 0.94, opacity: 0.4, yPercent: -5, duration: 1 }, 3);

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: isMobile ? 0.6 : 1.1,
        onUpdate: (self) => {
          tl.progress(self.progress);
          setPilotInteractive(self.progress < 0.08);
        },
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, [isMobile]);

  // Auto-lock (touch)
  const idleTimer = useRef<number | null>(null);
  const scheduleAutoLock = useCallback(() => {
    if (!isTouchDevice) return;
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIsUnlocked(false), 2500);
  }, [isTouchDevice]);
  const cancelAutoLock = useCallback(() => {
    if (idleTimer.current) {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isUnlocked || !isTouchDevice) return;
    const onDocPointer = (e: PointerEvent) => {
      if (!cardRef.current) return;
      if (!cardRef.current.contains(e.target as Node)) setIsUnlocked(false);
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
    if (!pilotInteractive) return;
    if (isSpinning) return;
    if (e.pointerType === 'touch' && !isUnlocked) {
      handleDoubleTapCheck(e);
      return;
    }
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
    try { cardRef.current?.setPointerCapture(e.pointerId); } catch { /* ignore */ }
  }, [pilotInteractive, isSpinning, isUnlocked, handleDoubleTapCheck, cancelAutoLock, rotateX, rotateY]);

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
    try { cardRef.current?.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
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
    <section
      ref={wrapperRef}
      className="relative w-full"
      style={{ height: isMobile ? '320vh' : '500vh' }}
    >
      <div
        ref={sectionRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-background"
      >
        {isVisible && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[350px] md:h-[350px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        )}

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center">
          <h2 className="mb-10 md:mb-16 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            <span className="block text-white" style={{ textShadow: '0 2px 4px hsl(220 50% 5% / 0.5)' }}>
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

          {/* Stack container: pilot-card base + 4 cards subindo */}
          <div className="relative w-[88vw] max-w-md md:max-w-2xl aspect-[16/10] md:aspect-[16/10]">
            {/* Pilot card (camada base — recua quando o stack começa) */}
            <motion.div
              ref={pilotWrapRef}
              className="absolute inset-0 z-0"
              style={{ willChange: 'transform, opacity', perspective: 1200 }}
            >
              <motion.div
                ref={cardRef}
                className={`relative w-full h-full rounded-2xl overflow-hidden ${
                  pilotInteractive
                    ? (isUnlocked ? 'cursor-grab active:cursor-grabbing touch-none' : 'cursor-pointer touch-pan-y')
                    : 'pointer-events-none'
                }`}
                style={{
                  rotateX: springRotateX,
                  rotateY: springRotateY,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
                onPointerMove={handleDrag}
                onPointerLeave={handlePointerLeave}
                onPointerDown={handleDragStart}
                onPointerUp={handleDragEnd}
                onPointerCancel={handleDragEnd}
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
                  </div>
                </div>

                <AnimatePresence>
                  {isUnlocked && isTouchDevice && pilotInteractive && (
                    <motion.div
                      aria-hidden
                      className="absolute -inset-1 rounded-2xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ boxShadow: '0 0 0 2px hsl(195 100% 55% / 0.5), 0 0 30px hsl(195 100% 55% / 0.4)' }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {pilotInteractive && (
                <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs md:text-sm text-muted-foreground/60 whitespace-nowrap">
                  {showLockedHint ? 'Toque 2x para girar' : 'Arraste para girar'}
                </p>
              )}
            </motion.div>

            {/* Stack de 4 cards que sobem no scroll */}
            {STACK_CARDS.map((card, i) => (
              <div
                key={i}
                ref={el => { if (el) stackRefs.current[i] = el; }}
                className="absolute inset-0 rounded-2xl overflow-hidden border border-foreground/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
                style={{ willChange: 'transform, opacity', zIndex: i + 1 }}
              >
                <img src={card.img} alt={card.label} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <span className="text-foreground font-display font-bold text-xl md:text-2xl">
                    {card.label}
                  </span>
                  <span className="text-foreground/60 font-mono text-xs">
                    0{i + 1} / 0{STACK_CARDS.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
