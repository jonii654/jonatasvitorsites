import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useMemo, useEffect } from 'react';
import layoutTop from '@/assets/layout-mockup-top.webp';
import layoutBottom from '@/assets/layout-mockup-bottom.webp';
import layoutLeft from '@/assets/layout-mockup-left.webp';
import layoutRight from '@/assets/layout-mockup-right.webp';

const WHATSAPP_NUMBER = "551931990107";

// Floating dots configuration
// More floating dots - using CSS animations for performance (no JS)
const floatingDots = [
  { x: '8%', y: '12%', size: 6, color: 'hsl(195 100% 50%)', duration: 6 },
  { x: '88%', y: '18%', size: 5, color: 'hsl(155 100% 50%)', duration: 7 },
  { x: '15%', y: '70%', size: 7, color: 'hsl(195 100% 50%)', duration: 8 },
  { x: '78%', y: '75%', size: 5, color: 'hsl(155 100% 50%)', duration: 6.5 },
  { x: '45%', y: '8%', size: 6, color: 'hsl(195 100% 50%)', duration: 7.5 },
  { x: '88%', y: '50%', size: 5, color: 'hsl(195 100% 50%)', duration: 8 },
  { x: '68%', y: '5%', size: 7, color: 'hsl(195 100% 50%)', duration: 6.5 },
  { x: '5%', y: '40%', size: 4, color: 'hsl(155 100% 50%)', duration: 9 },
  { x: '86%', y: '65%', size: 5, color: 'hsl(195 100% 50%)', duration: 7 },
  { x: '25%', y: '25%', size: 4, color: 'hsl(155 100% 50%)', duration: 8.5 },
  { x: '55%', y: '85%', size: 6, color: 'hsl(195 100% 50%)', duration: 6 },
  { x: '35%', y: '55%', size: 4, color: 'hsl(155 100% 50%)', duration: 9.5 },
  { x: '72%', y: '35%', size: 5, color: 'hsl(195 100% 50%)', duration: 7.5 },
  { x: '18%', y: '88%', size: 4, color: 'hsl(155 100% 50%)', duration: 8 },
];

export function Hero() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero saber mais sobre criação de sites.`;
  const sectionRef = useRef<HTMLElement>(null);
  
  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring physics for ultra light 3D tilt
  const springConfig = { damping: 30, stiffness: 100 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);
  
  // Handle mouse move for tilt effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Multi-layer parallax transforms
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  // Parallax for layout images
  const topImageY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const bottomImageY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const leftImageY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const rightImageY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  const dots = useMemo(() => floatingDots, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[150vh] overflow-hidden"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <motion.div 
          style={{ y: layer1Y }}
          className="absolute inset-0 bg-hero-gradient"
        />
        <motion.div 
          style={{ y: layer1Y }}
          className="absolute inset-0 hex-pattern opacity-5"
        />

        {/* Floating Dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {dots.map((dot, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: dot.x,
                top: dot.y,
                width: dot.size,
                height: dot.size,
                background: dot.color,
                boxShadow: `0 0 ${dot.size * 2}px ${dot.color}`,
                opacity: 0.6,
                animation: `floatDot${i % 3} ${dot.duration}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* Ambient glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full blur-[100px] opacity-20"
            style={{ background: 'hsl(195 100% 50%)' }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full blur-[120px] opacity-15"
            style={{ background: 'hsl(155 100% 50%)' }}
          />
        </div>
        
        {/* Layout Mockup Images - Top with 3D Tilt */}
        <motion.div
          style={{ 
            y: topImageY,
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: 'preserve-3d',
            perspective: 1000
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 w-[60%] md:w-[75%] max-w-4xl pointer-events-none z-[1]"
        >
          <motion.img 
            src={layoutTop} 
            alt="" 
            className="w-full opacity-40 rounded-xl shadow-2xl"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(20px)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </motion.div>

        {/* Layout Mockup Images - Left with 3D Tilt */}
        <motion.div
          style={{ 
            y: leftImageY,
            rotateX: rotateX,
            rotateY: useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig),
            transformStyle: 'preserve-3d',
            perspective: 1000
          }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute top-1/2 -translate-y-1/2 left-2 md:left-8 w-[18%] md:w-[20%] max-w-xs pointer-events-none z-[1]"
        >
          <motion.img 
            src={layoutLeft} 
            alt="" 
            className="w-full opacity-35 rounded-xl shadow-2xl"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(30px)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        </motion.div>

        {/* Layout Mockup Images - Right with 3D Tilt */}
        <motion.div
          style={{ 
            y: rightImageY,
            rotateX: rotateX,
            rotateY: useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig),
            transformStyle: 'preserve-3d',
            perspective: 1000
          }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute top-1/2 -translate-y-1/2 right-2 md:right-8 w-[18%] md:w-[20%] max-w-xs pointer-events-none z-[1]"
        >
          <motion.img 
            src={layoutRight} 
            alt="" 
            className="w-full opacity-35 rounded-xl shadow-2xl"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(30px)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-transparent" />
        </motion.div>

        {/* Layout Mockup Images - Bottom with 3D Tilt */}
        <motion.div
          style={{ 
            y: bottomImageY,
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: 'preserve-3d',
            perspective: 1000
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-[60%] md:w-[75%] max-w-4xl pointer-events-none z-[1]"
        >
          <motion.img 
            src={layoutBottom} 
            alt="" 
            className="w-full opacity-40 rounded-xl shadow-2xl"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(20px)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
        
        {/* Main Content - Layer 3 (Slowest, sticky feel) */}
        <motion.div 
          style={{ y: layer3Y, opacity: textOpacity, scale: textScale }}
          className="container mx-auto px-4 relative z-20"
        >
          <div className="max-w-4xl mx-auto text-center pt-16 md:pt-0">
            
            {/* Clean, Bold Headline */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight">
                <span 
                  className="block text-white"
                  style={{
                    textShadow: '0 2px 4px hsl(220 50% 5% / 0.5)'
                  }}
                >
                  CRIO SITES
                </span>
                <span 
                  className="block"
                  style={{
                    background: 'linear-gradient(135deg, hsl(195 100% 60%) 0%, hsl(155 100% 55%) 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: 'none'
                  }}
                >
                  QUE VENDEM
                </span>
              </h1>
            </motion.div>

            {/* Central Hero Card - Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative max-w-lg mx-auto mb-10"
            >
              {/* Animated Glow Ring Background */}
              <div className="absolute inset-0 rounded-3xl hero-glow-ring opacity-25" />
              
              {/* Glassmorphism Card Container */}
              <div className="relative p-[1px] rounded-3xl overflow-hidden" style={{
                background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.3), hsl(155 100% 50% / 0.2), hsl(195 100% 50% / 0.1))'
              }}>
                <div 
                  className="relative rounded-[23px] p-6 md:p-8 overflow-hidden"
                  style={{
                    background: 'hsl(220 50% 10% / 0.7)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    border: '1px solid hsl(195 100% 50% / 0.15)'
                  }}
                >
                  
                  {/* Inner shimmer effect */}
                  <div className="absolute inset-0 shimmer pointer-events-none opacity-20" />
                  
                  {/* Inner glow effects */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/8 blur-3xl rounded-full" />
                  <div className="absolute bottom-0 right-0 w-1/2 h-24 blur-3xl rounded-full" style={{ background: 'hsl(155 100% 50% / 0.05)' }} />
                  
                  {/* Sparkle Icon with glow */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                    className="relative mb-4"
                  >
                    <motion.div 
                      animate={{ 
                        boxShadow: [
                          '0 0 10px hsl(195 100% 50% / 0.15), 0 0 20px hsl(155 100% 50% / 0.08)',
                          '0 0 15px hsl(155 100% 50% / 0.2), 0 0 30px hsl(195 100% 50% / 0.1)',
                          '0 0 10px hsl(195 100% 50% / 0.15), 0 0 20px hsl(155 100% 50% / 0.08)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-14 h-14 md:w-16 md:h-16 mx-auto rounded-2xl flex items-center justify-center"
                      style={{ 
                        background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.1), hsl(155 100% 50% / 0.05))', 
                        border: '1px solid hsl(195 100% 50% / 0.2)',
                        backdropFilter: 'blur(12px)'
                      }}
                    >
                      <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                    </motion.div>
                  </motion.div>

                  {/* Subheadline - Fade in */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-sm md:text-base text-muted-foreground mb-6"
                  >
                    Especialista em sites institucionais e landing pages com design moderno, velocidade e foco em conversão.
                  </motion.p>

                  {/* Pulsating CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="relative"
                  >
                    {/* Pulse glow behind button */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{
                        boxShadow: [
                          '0 0 20px hsl(195 100% 50% / 0.4), 0 0 40px hsl(155 100% 50% / 0.2)',
                          '0 0 40px hsl(195 100% 50% / 0.6), 0 0 80px hsl(155 100% 50% / 0.4)',
                          '0 0 20px hsl(195 100% 50% / 0.4), 0 0 40px hsl(155 100% 50% / 0.2)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        asChild
                        size="lg"
                        className="btn-cta w-full text-base relative z-10 btn-ripple"
                      >
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                          <motion.span
                            animate={{ opacity: [1, 0.8, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            Quero meu site
                          </motion.span>
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </a>
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Secondary link - Fade in */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-4"
                  >
                    <a 
                      href="#portfolio" 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Ver portfólio →
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
