import { CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const benefits = [
  { icon: 'primary', text: 'Design Premium' },
  { icon: 'green', text: 'Entrega em até 7 dias' },
  { icon: 'primary', text: 'Suporte incluído' }
];

export function BenefitsBar() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Fade in when entering, fade out when leaving
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0.9, 1, 1, 1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [40, 0, 0, -40]);

  return (
    <div className="py-20 md:py-28" ref={sectionRef}>
      <motion.div
        style={{ opacity, scale, y }}
        className="container mx-auto px-4"
      >
        {/* Desktop Layout - Icons in a column on left, lines between icons, text beside each */}
        <div className="hidden md:flex justify-center items-center gap-0">
          {benefits.map((item, i) => (
            <div key={i} className="flex items-center">
              {/* Horizontal connecting line between icons */}
              {i > 0 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                  className="w-16 lg:w-24 h-[2px] origin-left"
                  style={{
                    background: 'linear-gradient(90deg, hsl(195 100% 50% / 0.5), hsl(155 100% 50% / 0.35), hsl(195 100% 50% / 0.5))',
                    boxShadow: '0 0 8px hsl(195 100% 50% / 0.3), 0 0 16px hsl(195 100% 50% / 0.15)',
                  }}
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <CheckCircle2 
                    className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 relative z-10" 
                    style={{ 
                      color: item.icon === 'green' ? 'hsl(155 100% 50%)' : 'hsl(195 100% 50%)',
                      filter: `drop-shadow(0 0 8px ${item.icon === 'green' ? 'hsl(155 100% 50% / 0.5)' : 'hsl(195 100% 50% / 0.5)'})`
                    }} 
                  />
                </div>

                <span 
                  className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground whitespace-nowrap"
                >
                  {item.text}
                </span>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Mobile Layout - Icons connected vertically, text beside each icon */}
        <div className="flex md:hidden flex-col items-center">
          {benefits.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Vertical connecting line between icons */}
              {i > 0 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                  className="w-[2px] h-10 origin-top"
                  style={{
                    background: 'linear-gradient(180deg, hsl(195 100% 50% / 0.5), hsl(155 100% 50% / 0.35), hsl(195 100% 50% / 0.5))',
                    boxShadow: '0 0 8px hsl(195 100% 50% / 0.3), 0 0 16px hsl(195 100% 50% / 0.15)',
                  }}
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-center gap-3 py-2"
              >
                <div className="relative">
                  <CheckCircle2 
                    className="w-7 h-7 flex-shrink-0 relative z-10" 
                    style={{ 
                      color: item.icon === 'green' ? 'hsl(155 100% 50%)' : 'hsl(195 100% 50%)',
                      filter: `drop-shadow(0 0 8px ${item.icon === 'green' ? 'hsl(155 100% 50% / 0.5)' : 'hsl(195 100% 50% / 0.5)'})`
                    }} 
                  />
                </div>

                <span 
                  className="text-lg font-bold text-foreground whitespace-nowrap"
                >
                  {item.text}
                </span>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
