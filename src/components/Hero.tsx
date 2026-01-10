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
      <div className="absolute inset-0 hex-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-glow-gradient pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">+50 projetos entregues</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Crio sites que{' '}
            <span className="gradient-text">vendem</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Landing pages e portfólios com design moderno, velocidade e foco em conversão.
          </motion.p>

          {/* Hero Image Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative max-w-3xl mx-auto mb-10"
          >
            <div className="video-card group transition-all duration-500 hover:scale-[1.02]">
              <div className="relative aspect-video bg-card overflow-hidden rounded-2xl">
                <img
                  src={heroImage}
                  alt="Design de sites profissionais"
                  className="w-full h-full object-cover"
                />
                
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

                {/* Animated Glow Ring on Hover */}
                <div className="absolute inset-0 rounded-2xl animate-pulse-glow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              asChild
              size="lg"
              className="btn-cta text-base md:text-lg px-8 py-6"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                Quero meu site
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 px-8 py-6"
              asChild
            >
              <a href="#portfolio">
                Ver portfólio
              </a>
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
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
