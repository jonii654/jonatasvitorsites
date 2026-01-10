import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = "5511999999999";

export function Hero() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero saber mais sobre criação de sites.`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 hex-pattern opacity-20" />
      
      {/* Floating Orbs - Cyan */}
      <motion.div
        animate={{ 
          x: [0, 30, -20, 20, 0],
          y: [0, -20, 20, 10, 0],
          scale: [1, 1.1, 0.95, 1.05, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-cyan-glow/20 blur-[80px] pointer-events-none"
      />
      
      {/* Floating Orbs - Green */}
      <motion.div
        animate={{ 
          x: [0, -30, 20, -10, 0],
          y: [0, 20, -30, 15, 0],
          scale: [1, 0.95, 1.1, 1, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'hsl(155 100% 50% / 0.15)' }}
      />

      {/* Central mixed glow */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.25), hsl(155 100% 50% / 0.2))' }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Central Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative max-w-lg mx-auto mb-10"
          >
            {/* Animated Glow Ring Background */}
            <div className="absolute inset-0 rounded-3xl hero-glow-ring" />
            
            {/* Card Container with animated border */}
            <div className="relative p-[2px] rounded-3xl border-glow-animated overflow-hidden">
              <div className="relative bg-card/95 backdrop-blur-xl rounded-[22px] p-8 md:p-10 overflow-hidden">
                
                {/* Inner shimmer effect */}
                <div className="absolute inset-0 shimmer pointer-events-none" />
                
                {/* Inner glow effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/15 blur-3xl rounded-full" />
                <div className="absolute bottom-0 right-0 w-1/2 h-24 blur-3xl rounded-full" style={{ background: 'hsl(155 100% 50% / 0.1)' }} />
                
                {/* Sparkle Icon with glow */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                  className="relative mb-6"
                >
                  <motion.div 
                    animate={{ 
                      boxShadow: [
                        '0 0 20px hsl(195 100% 50% / 0.4), 0 0 40px hsl(155 100% 50% / 0.2)',
                        '0 0 30px hsl(155 100% 50% / 0.5), 0 0 60px hsl(195 100% 50% / 0.3)',
                        '0 0 20px hsl(195 100% 50% / 0.4), 0 0 40px hsl(155 100% 50% / 0.2)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.15), hsl(155 100% 50% / 0.1))', border: '1px solid hsl(195 100% 50% / 0.3)' }}
                  >
                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                  </motion.div>
                </motion.div>

                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                  style={{ background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.1), hsl(155 100% 50% / 0.1))', border: '1px solid hsl(195 100% 50% / 0.2)' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium gradient-text">+50 projetos entregues</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                >
                  Transformo ideias em{' '}
                  <span className="gradient-text">sites que vendem</span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-sm md:text-base text-muted-foreground mb-8"
                >
                  Landing pages e portfólios com design moderno, velocidade e foco em conversão para sua presença digital.
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
            className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card"
            >
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Média de 20%+ conversão</span>
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
      </div>
    </section>
  );
}
