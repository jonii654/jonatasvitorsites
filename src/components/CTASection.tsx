import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = "551931990107";

export function CTASection() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero agendar uma conversa sobre criação de sites.`;

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 hex-pattern opacity-10" />
      
      {/* Animated Background Waves */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: ['-100%', '100%'],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-1/4 left-0 w-[200%] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
        <motion.div
          animate={{ 
            x: ['100%', '-100%'],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-3/4 left-0 w-[200%] h-[2px] bg-gradient-to-r from-transparent via-cyan-glow/20 to-transparent"
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 2 === 0 ? 'hsl(195 100% 50% / 0.5)' : 'hsl(155 100% 50% / 0.5)',
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
            className="mb-8"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center relative"
              style={{ 
                background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.15), hsl(155 100% 50% / 0.1))',
                border: '1px solid hsl(195 100% 50% / 0.3)'
              }}
            >
              <Zap className="w-10 h-10 text-primary" />
              
              {/* Pulse rings */}
              <motion.div
                animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl border-2 border-primary/50"
              />
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                className="absolute inset-0 rounded-2xl border-2 border-primary/30"
              />
            </motion.div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            Pronto para ter um site que{' '}
            <motion.span 
              className="gradient-text inline-block"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              realmente converte
            </motion.span>?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto"
          >
            Vamos conversar sobre seu projeto e criar algo incrível juntos. 
            Primeira consulta é gratuita!
          </motion.p>

          {/* CTA Button with special effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="relative inline-block"
          >
            {/* Glow behind button */}
            <motion.div
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 blur-xl rounded-full bg-primary/30"
            />
            
            <Button
              asChild
              size="lg"
              className="btn-cta text-base md:text-lg px-10 py-7 relative overflow-hidden group"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
                
                <MessageCircle className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Falar no WhatsApp</span>
                <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground mt-6"
          >
            Respondo em até 2 horas durante o horário comercial
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
