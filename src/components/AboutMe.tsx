import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import profileImage from '@/assets/jonatas-profile.webp';

export function AboutMe() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Subtle parallax - optimized for mobile
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);

  return (
    <section 
      ref={sectionRef}
      id="sobre"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            
            {/* Profile Image Card */}
            <motion.div
              style={{ y, opacity }}
              className="relative order-1 md:order-1"
            >
              <div className="relative max-w-sm mx-auto">
                {/* Animated Glow Ring */}
                <div className="absolute inset-0 rounded-3xl hero-glow-ring" />
                
                {/* Image Container with neon border */}
                <div className="relative p-1 rounded-3xl bg-gradient-to-br from-primary/60 via-primary/30 to-cyan-light/40">
                  <div className="relative overflow-hidden rounded-[22px] aspect-[3/4] bg-card">
                    <img
                      src={profileImage}
                      alt="Jônatas Vitor - Criador de Sites"
                      className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    
                    {/* Name badge at bottom */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="glass-card px-4 py-3">
                        <p className="text-lg font-bold text-foreground">Jônatas Vitor</p>
                        <p className="text-sm text-primary">Criador de Sites</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-2 text-center md:text-left"
            >
              <span className="section-label">Sobre mim</span>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Prazer, sou o{' '}
                <span className="gradient-text">Jônatas</span>
              </h2>
              
              <div className="space-y-4 text-muted-foreground text-base md:text-lg">
                <p>
                  Tenho <span className="text-foreground font-semibold">21 anos</span> e sou especialista em criar landing pages que realmente convertem.
                </p>
                <p>
                  Minha missão? Ajudar você a ter uma <span className="text-primary font-semibold">presença digital profissional</span> que transmite credibilidade e gera resultados.
                </p>
                <p>
                  Cada projeto que desenvolvo é pensado estrategicamente para <span className="text-foreground font-semibold">atrair, engajar e converter</span> seus visitantes em clientes.
                </p>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8 grid grid-cols-2 gap-4"
              >
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold gradient-text">7</p>
                  <p className="text-xs text-muted-foreground">Dias de entrega</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold gradient-text">100%</p>
                  <p className="text-xs text-muted-foreground">Dedicação</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
