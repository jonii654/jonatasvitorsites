import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = "5511999999999";

export function CTASection() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero agendar uma conversa sobre criação de sites.`;

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 hex-pattern opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-glow-gradient pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Pronto para ter um site que{' '}
            <span className="gradient-text">realmente converte</span>?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Vamos conversar sobre seu projeto e criar algo incrível juntos. 
            Primeira consulta é gratuita!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="btn-cta text-base md:text-lg px-10 py-7"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar no WhatsApp
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Respondo em até 2 horas durante o horário comercial
          </p>
        </motion.div>
      </div>
    </section>
  );
}
