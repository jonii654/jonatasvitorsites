import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import layoutTop from '@/assets/layout-mockup-top.webp';
import layoutBottom from '@/assets/layout-mockup-bottom.webp';

const WHATSAPP_NUMBER = "551931990107";

export function Hero() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero saber mais sobre criação de sites.`;
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Multi-layer parallax transforms
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  // Parallax for layout images
  const topImageY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const bottomImageY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[150vh] overflow-hidden"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects - Layer 1 (Fastest) */}
        <motion.div 
          style={{ y: layer1Y }}
          className="absolute inset-0 bg-hero-gradient"
        />
        <motion.div 
          style={{ y: layer1Y }}
          className="absolute inset-0 hex-pattern opacity-5"
        />
        
        {/* Layout Mockup Images - Top */}
        <motion.div
          style={{ y: topImageY }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 w-[90%] md:w-[70%] max-w-3xl pointer-events-none"
        >
          <img 
            src={layoutTop} 
            alt="" 
            className="w-full opacity-20 blur-[1px] rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </motion.div>

        {/* Layout Mockup Images - Bottom */}
        <motion.div
          style={{ y: bottomImageY }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 w-[90%] md:w-[70%] max-w-3xl pointer-events-none"
        >
          <img 
            src={layoutBottom} 
            alt="" 
            className="w-full opacity-20 blur-[1px] rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background" />
        </motion.div>
        
        {/* Floating Orbs - Layer 2 (Medium) - Reduced brightness */}
        <motion.div
          style={{ y: layer2Y }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div
            animate={{ 
              x: [0, 30, -20, 20, 0],
              y: [0, -20, 20, 10, 0],
              scale: [1, 1.1, 0.95, 1.05, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-cyan-glow/3 blur-[100px]"
          />
          
          <motion.div
            animate={{ 
              x: [0, -30, 20, -10, 0],
              y: [0, 20, -30, 15, 0],
              scale: [1, 0.95, 1.1, 1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full blur-[120px]"
            style={{ background: 'hsl(155 100% 50% / 0.02)' }}
          />

          {/* Central mixed glow - Reduced */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.04, 0.06, 0.04]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]"
            style={{ background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.04), hsl(155 100% 50% / 0.02))' }}
          />
        </motion.div>
        
        {/* Main Content - Layer 3 (Slowest, sticky feel) */}
        <motion.div 
          style={{ y: layer3Y, opacity: textOpacity, scale: textScale }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Text Mask Effect - Large Display Text - NO SHAKE */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight">
                <span className="block text-foreground">
                  CRIO SITES
                </span>
                <span 
                  className="block text-mask-gradient"
                  style={{
                    background: 'linear-gradient(135deg, hsl(195 100% 50%) 0%, hsl(155 100% 55%) 50%, hsl(195 100% 60%) 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 3s ease-in-out infinite'
                  }}
                >
                  QUE VENDEM
                </span>
              </h1>
            </motion.div>

            {/* Central Hero Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative max-w-lg mx-auto mb-10"
            >
              {/* Animated Glow Ring Background - Reduced */}
              <div className="absolute inset-0 rounded-3xl hero-glow-ring opacity-30" />
              
              {/* Card Container with animated border */}
              <div className="relative p-[2px] rounded-3xl border-glow-animated overflow-hidden">
                <div className="relative bg-card/95 backdrop-blur-xl rounded-[22px] p-6 md:p-8 overflow-hidden">
                  
                  {/* Inner shimmer effect - Reduced */}
                  <div className="absolute inset-0 shimmer pointer-events-none opacity-30" />
                  
                  {/* Inner glow effects - Reduced */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 blur-3xl rounded-full" />
                  <div className="absolute bottom-0 right-0 w-1/2 h-24 blur-3xl rounded-full" style={{ background: 'hsl(155 100% 50% / 0.03)' }} />
                  
                  {/* Sparkle Icon with glow - Reduced */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
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
                      style={{ background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.08), hsl(155 100% 50% / 0.04))', border: '1px solid hsl(195 100% 50% / 0.15)' }}
                    >
                      <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                    </motion.div>
                  </motion.div>

                  {/* Subheadline */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-sm md:text-base text-muted-foreground mb-6"
                  >
                    Especialista em sites institucionais e landing pages com design moderno, velocidade e foco em conversão.
                  </motion.p>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="btn-cta w-full text-base"
                    >
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        Quero meu site
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </a>
                    </Button>
                  </motion.div>

                  {/* Secondary link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
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

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card"
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Design Premium</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card"
              >
                <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(155 100% 50%)' }} />
                <span>Entrega em até 7 dias</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card"
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Suporte incluído</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
