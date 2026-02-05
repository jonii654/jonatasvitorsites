import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import pilotImage from '@/assets/pilot-card.jpg';

export function Interactive3DCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
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
  
  const handleDragStart = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isSpinning) return;
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
    cardRef.current?.setPointerCapture(e.pointerId);
  }, [isSpinning, rotateX, rotateY]);
  
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
    if (!isDragging) return;
    setIsDragging(false);
    try {
      cardRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
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
          }, 200);
        }
      };
      requestAnimationFrame(animateSpin);
    } else {
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [isDragging, rotateX, rotateY]);

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
          
          <motion.div className="mb-16 md:mb-24 lg:mb-32 text-center" style={{ y: ctaY }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              <span 
                className="block text-white"
                style={{
                  textShadow: '0 2px 4px hsl(220 50% 5% / 0.5)'
                }}
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
            className="relative cursor-grab active:cursor-grabbing touch-none"
            style={{ perspective: 1000 }}
            onPointerMove={handleDrag}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handleDragStart}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible && imageLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="relative w-[280px] h-[180px] sm:w-[340px] sm:h-[220px] md:w-[440px] md:h-[280px] lg:w-[520px] lg:h-[330px] rounded-2xl overflow-hidden shadow-2xl"
              style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                willChange: 'transform',
              }}
            >
              <div 
                className="absolute inset-0 rounded-2xl p-[1px]"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.5), hsl(var(--accent) / 0.3))',
                }}
              >
                <div className="w-full h-full rounded-[15px] overflow-hidden bg-card/80">
                  <img 
                    src={pilotImage} 
                    alt="Design Premium" 
                    className="w-full h-full object-cover"
                    style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
                    draggable={false}
                    loading="eager"
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
              </div>
            </motion.div>
            
            <p className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 text-xs md:text-sm text-muted-foreground/50 whitespace-nowrap">
              Arraste para girar
            </p>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}