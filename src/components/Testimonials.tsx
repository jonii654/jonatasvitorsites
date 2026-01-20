import { motion } from 'framer-motion';
import { Lightbulb, Target, Rocket } from 'lucide-react';
import valueDesign from '@/assets/value-design.webp';
import valueResults from '@/assets/value-results.webp';
import valueSpeed from '@/assets/value-speed.webp';

const values = [
  {
    id: 1,
    icon: Lightbulb,
    title: 'Design estratégico',
    description: 'Cada elemento do seu site é pensado para guiar o visitante até a ação desejada. Nada é por acaso.',
    image: valueDesign,
  },
  {
    id: 2,
    icon: Target,
    title: 'Foco em resultados',
    description: 'Sites bonitos são ótimos, mas sites que convertem são ainda melhores. Meu objetivo é te ajudar a crescer.',
    image: valueResults,
  },
  {
    id: 3,
    icon: Rocket,
    title: 'Entrega rápida',
    description: 'Prazo de 7 dias do início ao lançamento. Sem enrolação, sem atrasos. Seu tempo é valioso.',
    image: valueSpeed,
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Testimonials() {
  return (
    <section id="beneficios" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Glow - Reduced */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-glow-gradient pointer-events-none opacity-15" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="section-label">Por que me escolher</span>
          <h2 className="section-title">
            Meu compromisso com você
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {values.map((value) => (
            <motion.div
              key={value.id}
              variants={itemVariants}
              className="glass-card overflow-hidden group hover:bg-card/60 transition-colors duration-300"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={value.image} 
                  alt={value.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                
                {/* Icon overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
