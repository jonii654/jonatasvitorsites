import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  { icon: 'primary', text: 'Design Premium' },
  { icon: 'green', text: 'Entrega em até 7 dias' },
  { icon: 'primary', text: 'Suporte incluído' }
];

export function BenefitsBar() {
  return (
    <div className="relative h-[50vh]">
      {/* Sticky container */}
      <div className="sticky top-1/2 -translate-y-1/2 z-30 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4"
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            {benefits.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <CheckCircle2 
                  className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" 
                  style={{ 
                    color: item.icon === 'green' ? 'hsl(155 100% 50%)' : 'hsl(195 100% 50%)',
                    filter: `drop-shadow(0 0 12px ${item.icon === 'green' ? 'hsl(155 100% 50% / 0.6)' : 'hsl(195 100% 50% / 0.6)'})`
                  }} 
                />
                <span 
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-white whitespace-nowrap"
                  style={{
                    textShadow: '0 2px 8px hsl(220 50% 5% / 0.6)'
                  }}
                >
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
