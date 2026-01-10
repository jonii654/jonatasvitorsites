import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';

const WHATSAPP_NUMBER = "5511999999999";

export function Hero() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero saber mais sobre criação de sites.`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 hex-pattern opacity-20" />
      
      {/* Main Glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Central Hero Card with Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative max-w-md mx-auto mb-10"
          >
            {/* Animated Glow Ring Background */}
            <div className="absolute inset-0 rounded-3xl hero-glow-ring" />
            
            {/* Card Container */}
            <div className="relative p-1 rounded-3xl bg-gradient-to-br from-primary/50 via-primary/20 to-cyan-light/30 group">
              <div className="relative bg-card/90 backdrop-blur-xl rounded-[22px] p-6 md:p-8 overflow-hidden">
                
                {/* Inner glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/20 blur-3xl rounded-full" />
                
                {/* Profile Image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="relative mb-6"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-2 border-primary/40 shadow-glow">
                    <img
                      src={heroImage}
                      alt="Criador de sites profissionais"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary">+50 projetos entregues</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight"
                >
                  Crio sites que{' '}
                  <span className="gradient-text">vendem</span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-sm md:text-base text-muted-foreground mb-6"
                >
                  Landing pages e portfólios com design moderno, velocidade e foco em conversão.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
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

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Média de 20%+ conversão</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Entrega em até 7 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Suporte incluído</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
