import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import pilotImage from '@/assets/pilot-card.jpg';

export function Interactive3DCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Parallax effect for CTA
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  
  // CTA moves up faster (parallax) and fades slightly
  const ctaY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -150]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.3]);
  
  // Motion values for rotation - no clamping for free 360 spin
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Spring physics for smooth rotation
  const springConfig = { damping: 15, stiffness: 100, mass: 0.8 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  
  // Glow effect based on rotation
  const glowX = useTransform(springRotateY, [-45, 45], [-20, 20]);
  const glowY = useTransform(springRotateX, [-45, 45], [20, -20]);
  
  const handlePointerLeave = () => {
    if (!isDragging && !isSpinning) {
      rotateX.set(0);
      rotateY.set(0);
    }
  };
  
  // Drag functionality with velocity tracking for inertia
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const initialRotateX = useRef(0);
  const initialRotateY = useRef(0);
  
  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
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
    
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
  };
  
  const handleDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const now = Date.now();
    const dt = Math.max(now - lastTime.current, 1);
    
    // Calculate velocity (pixels per ms)
    velocityX.current = (e.clientX - lastX.current) / dt;
    velocityY.current = (e.clientY - lastY.current) / dt;
    
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    lastTime.current = now;
    
    const deltaX = e.clientX - dragStartX.current;
    const deltaY = e.clientY - dragStartY.current;
    
    // Higher sensitivity for responsive 360° rotation
    const sensitivity = 0.8;
    const newRotateY = initialRotateY.current + deltaX * sensitivity;
    const newRotateX = initialRotateX.current - deltaY * sensitivity;
    
    // Only clamp X rotation (vertical tilt), Y is free for 360° spins
    rotateY.set(newRotateY);
    rotateX.set(Math.max(-45, Math.min(45, newRotateX)));
  };
  
  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (cardRef.current) {
      try {
        cardRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer was already released
      }
    }
    
    // Get final velocity and apply inertia spin
    const vx = velocityX.current;
    const vy = velocityY.current;
    const speed = Math.sqrt(vx * vx + vy * vy);
    
    // Apply momentum based on velocity - allows full 360° spins
    if (speed > 0.2) {
      setIsSpinning(true);
      
      // Calculate spin amount based on velocity (faster = more rotation)
      const spinMultiplier = 200; // Increased for easier 360° spins
      const targetRotateY = rotateY.get() + vx * spinMultiplier;
      const targetRotateX = Math.max(-45, Math.min(45, rotateX.get() - vy * spinMultiplier * 0.3));
      
      // Duration based on speed (faster swipe = longer spin)
      const duration = Math.min(1000 + speed * 600, 2500);
      
      let start: number | null = null;
      const startRotateY = rotateY.get();
      const startRotateX = rotateX.get();
      
      const animateSpin = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        
        // Ease out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        rotateY.set(startRotateY + (targetRotateY - startRotateY) * easeOut);
        rotateX.set(startRotateX + (targetRotateX - startRotateX) * easeOut);
        
        if (progress < 1) {
          requestAnimationFrame(animateSpin);
        } else {
          // Normalize rotation and smoothly return to neutral
          setTimeout(() => {
            rotateX.set(0);
            rotateY.set(0);
            setIsSpinning(false);
          }, 400);
        }
      };
      
      requestAnimationFrame(animateSpin);
    } else {
      // Slow drag, just return to neutral
      setTimeout(() => {
        rotateX.set(0);
        rotateY.set(0);
      }, 150);
    }
  };

  // Auto-rotate subtle animation when idle
  useEffect(() => {
    if (isDragging || isSpinning) return;
    
    let animationFrame: number;
    let time = 0;
    
    const animate = () => {
      time += 0.01;
      const idleRotateX = Math.sin(time * 0.5) * 3;
      const idleRotateY = Math.cos(time * 0.3) * 4;
      
      if (!isDragging && !isSpinning && rotateX.get() === 0 && rotateY.get() === 0) {
        rotateX.set(idleRotateX);
        rotateY.set(idleRotateY);
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    const timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, 2000);
    
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [isDragging, isSpinning, rotateX, rotateY]);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Dark background with subtle gradient */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Ambient glow behind card */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-[100px] md:blur-[150px] pointer-events-none"
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, hsl(195 100% 50% / 0.25) 0%, hsl(195 100% 50% / 0.05) 60%, transparent 80%)'
        }}
      />
      
      {/* Secondary subtle glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full blur-[80px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(155 100% 50% / 0.12) 0%, transparent 70%)'
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              background: i % 2 === 0 ? 'hsl(195 100% 50%)' : 'hsl(155 100% 50%)',
              opacity: 0.4,
              animation: `floatDot${i % 3} ${6 + i}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh] pt-8 md:pt-0">
          
          {/* Floating CTA above card with parallax */}
          <motion.div
            className="mb-20 md:mb-32 lg:mb-40 text-center"
            style={{
              y: ctaY,
              opacity: ctaOpacity,
            }}
          >
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
              style={{
                background: 'linear-gradient(135deg, hsl(195 100% 60%) 0%, hsl(155 100% 50%) 50%, hsl(195 100% 70%) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px hsl(195 100% 50% / 0.3)',
                filter: 'drop-shadow(0 0 20px hsl(155 100% 50% / 0.2))',
              }}
              animate={{
                textShadow: [
                  '0 0 40px hsl(195 100% 50% / 0.3)',
                  '0 0 60px hsl(155 100% 50% / 0.4)',
                  '0 0 40px hsl(195 100% 50% / 0.3)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              O Design Quem Faz É Você!
            </motion.h2>
          </motion.div>
          
          {/* 3D Card Container */}
          <motion.div
            ref={cardRef}
            className="relative cursor-grab active:cursor-grabbing touch-none"
            style={{
              perspective: 1200,
              transformStyle: 'preserve-3d',
            }}
            onPointerMove={handleDrag}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handleDragStart}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Card with 3D transform */}
            <motion.div
              className="relative w-[280px] h-[180px] sm:w-[360px] sm:h-[230px] md:w-[480px] md:h-[300px] lg:w-[560px] lg:h-[350px] rounded-2xl md:rounded-3xl overflow-hidden"
              style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Glassmorphism border */}
              <div 
                className="absolute inset-0 rounded-2xl md:rounded-3xl p-[1px]"
                style={{
                  background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.4), hsl(155 100% 50% / 0.2), hsl(195 100% 50% / 0.1))',
                }}
              >
                <div 
                  className="w-full h-full rounded-[15px] md:rounded-[23px] overflow-hidden"
                  style={{
                    background: 'hsl(220 50% 8% / 0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Image */}
                  <img 
                    src={pilotImage} 
                    alt="Design Premium" 
                    className="w-full h-full object-cover"
                    style={{
                      imageRendering: 'crisp-edges',
                    }}
                    draggable={false}
                  />
                  
                  {/* Overlay gradient for depth */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.08) 0%, transparent 50%, hsl(155 100% 50% / 0.05) 100%)'
                    }}
                  />
                  
                  {/* Shine effect */}
                  <motion.div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.1) 50%, transparent 60%)',
                      transform: 'translateX(-100%)',
                    }}
                    animate={{
                      transform: ['translateX(-100%)', 'translateX(100%)'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 5,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </div>
              
              {/* Reflection effect below card */}
              <div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-4 rounded-full blur-md"
                style={{
                  background: 'hsl(195 100% 50% / 0.2)',
                  transform: 'translateZ(-10px) translateX(-50%)',
                }}
              />
            </motion.div>
            
            {/* Floating label */}
            <motion.div
              className="absolute -bottom-12 md:-bottom-16 left-1/2 -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-xs md:text-sm text-muted-foreground/60">
                Arraste para girar livremente
              </p>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}