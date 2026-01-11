import { motion } from 'framer-motion';
import { Zap, Clock, Smartphone, Shield } from 'lucide-react';

const results = [
  {
    icon: Zap,
    value: 'Alta',
    label: 'Performance',
    description: 'Sites rápidos e otimizados',
  },
  {
    icon: Clock,
    value: '7 dias',
    label: 'Prazo de entrega',
    description: 'do início ao lançamento',
  },
  {
    icon: Smartphone,
    value: '100%',
    label: 'Responsivo',
    description: 'funciona em qualquer tela',
  },
  {
    icon: Shield,
    value: 'Total',
    label: 'Suporte',
    description: 'acompanhamento pós-entrega',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Results() {
  return (
    <section id="resultados" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-glow-gradient pointer-events-none opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="section-label">O que você ganha</span>
          <h2 className="section-title">
            Compromisso com qualidade
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {results.map((result, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card-hover p-6 md:p-8 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-primary/10 flex items-center justify-center">
                <result.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {result.value}
              </div>
              <div className="text-foreground font-medium mb-1">
                {result.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {result.description}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
