import { motion } from 'framer-motion';
import { MessageSquare, Palette, Rocket } from 'lucide-react';
import { CardKineticBackground } from './CardKineticBackground';

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Conversa inicial',
    description: 'Entendo seu negócio, público-alvo e objetivos para criar uma estratégia personalizada.',
    words: ['BRIEFING', 'ESTRATÉGIA', 'OBJETIVOS', 'PÚBLICO', 'NEGÓCIO'],
  },
  {
    icon: Palette,
    number: '02',
    title: 'Design & Desenvolvimento',
    description: 'Crio o layout focado em conversão com design moderno e responsivo.',
    words: ['DESIGN', 'UI/UX', 'LAYOUT', 'RESPONSIVO', 'MODERNO'],
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Lançamento',
    description: 'Entrego seu site pronto, otimizado para SEO e velocidade máxima.',
    words: ['DEPLOY', 'SEO', 'RÁPIDO', 'OTIMIZADO', 'PERFORMANCE'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function HowItWorks() {
  return (
    <section id="servicos" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="section-label">Como funciona</span>
          <h2 className="section-title">
            Simples e direto ao ponto
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              {/* Connector Line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="relative p-8 text-center overflow-hidden min-h-[280px]">
                {/* Kinetic Typography IS the card */}
                <CardKineticBackground words={step.words} />
                
                {/* Step Number */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full z-10">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-6 mt-8 rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content with Cylinder Focus Effect */}
                <div className="relative z-10 mx-auto max-w-[220px] p-4 rounded-2xl bg-background/60 backdrop-blur-md border border-primary/20 shadow-[0_0_30px_-5px_hsl(195_100%_50%/0.15),inset_0_1px_0_0_hsl(195_100%_50%/0.1)]">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
