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

// Individual scroll reveal variants for each card
const cardRevealVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], // Custom cubic bezier
    },
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              variants={cardRevealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ 
                once: true, 
                amount: 0.4, // Card só aparece quando 40% estiver visível
                margin: "-50px" // Offset negativo para trigger mais preciso
              }}
              className="glass-card overflow-hidden group hover:bg-card/60 transition-colors duration-300"
              style={{
                // Delay progressivo para desktop (lado a lado)
                transitionDelay: `${index * 0.1}s`
              }}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <motion.img 
                  src={value.image} 
                  alt={value.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                
                {/* Icon overlay with individual animation */}
                <motion.div 
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ 
                    delay: 0.3,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <value.icon className="w-6 h-6 text-primary" />
                </motion.div>
              </div>

              {/* Content with staggered reveal */}
              <div className="p-6 text-center">
                <motion.h3 
                  className="text-xl font-bold text-foreground mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {value.title}
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  {value.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
