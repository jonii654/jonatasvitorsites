import { motion } from 'framer-motion';
import { Zap, Clock, Smartphone, Shield } from 'lucide-react';

const commitments = [
  {
    icon: Zap,
    title: 'Design Estratégico',
    description: 'Cada elemento pensado para converter visitantes em clientes.',
  },
  {
    icon: Clock,
    title: 'Entrega em 7 Dias',
    description: 'Do briefing ao lançamento, sem enrolação.',
  },
  {
    icon: Smartphone,
    title: '100% Responsivo',
    description: 'Perfeito em qualquer dispositivo, do celular ao desktop.',
  },
  {
    icon: Shield,
    title: 'Alta Performance',
    description: 'Sites rápidos que ranqueiam melhor no Google.',
  },
];

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function MyCommitment() {
  return (
    <section id="compromisso" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-glow-gradient pointer-events-none opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="section-label">O que você ganha</span>
          <h2 className="section-title">
            Meu compromisso com você
          </h2>
        </motion.div>

        {/* Cards Grid - Each card reveals individually */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {commitments.map((commitment, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ 
                once: true, 
                amount: 0.4, // Card triggers when 40% visible
                margin: "-50px" // Slight offset to delay trigger
              }}
              className="glass-card-hover p-6 md:p-8 text-center group"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <commitment.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-foreground mb-3">
                {commitment.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {commitment.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
