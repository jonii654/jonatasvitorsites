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
    offset: ["start end", "center center"]
  });

  // Glow/blur intensity increases as user scrolls into view
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.7, 1]);
  const blurAmount = useTransform(scrollYProgress, [0, 0.5, 1], [4, 1, 0]);
  const scaleVal = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 0.96, 1]);

  return (
    <div className="py-20 md:py-28" ref={sectionRef}>
      <motion.div
        style={{ opacity: glowOpacity, scale: scaleVal }}
        className="container mx-auto px-4"
      >
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-center items-center">
          {benefits.map((item, i) => (
            <div key={i} className="flex items-center">
              {/* Connecting line BEFORE the icon (between items) */}
              {i > 0 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                  className="w-12 lg:w-20 h-[3px] origin-left"
                  style={{
                    background: 'linear-gradient(90deg, hsl(195 100% 50% / 0.8), hsl(155 100% 50% / 0.6), hsl(195 100% 50% / 0.8))',
                    boxShadow: '0 0 12px hsl(195 100% 50% / 0.6), 0 0 24px hsl(195 100% 50% / 0.3), 0 0 48px hsl(155 100% 50% / 0.15)',
                  }}
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-center gap-4"
              >
                {/* Icon with connecting dot glow */}
                <motion.div
                  style={{ filter: blurAmount.get() > 0 ? `blur(${blurAmount.get()}px)` : 'none' }}
                  className="relative"
                >
                  <CheckCircle2 
                    className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 relative z-10" 
                    style={{ 
                      color: item.icon === 'green' ? 'hsl(155 100% 50%)' : 'hsl(195 100% 50%)',
                      filter: `drop-shadow(0 0 20px ${item.icon === 'green' ? 'hsl(155 100% 50% / 0.9)' : 'hsl(195 100% 50% / 0.9)'}) drop-shadow(0 0 40px ${item.icon === 'green' ? 'hsl(155 100% 50% / 0.5)' : 'hsl(195 100% 50% / 0.5)'})`
                    }} 
                  />
                  {/* Glow orb behind icon */}
                  <div 
                    className="absolute inset-0 rounded-full blur-xl -z-10"
                    style={{
                      background: item.icon === 'green' ? 'hsl(155 100% 50% / 0.3)' : 'hsl(195 100% 50% / 0.3)',
                      transform: 'scale(2)',
                    }}
                  />
                </motion.div>

                <span 
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-white whitespace-nowrap"
                  style={{
                    textShadow: '0 0 20px hsl(195 100% 50% / 0.5), 0 0 40px hsl(195 100% 50% / 0.25), 0 2px 8px hsl(220 50% 5% / 0.6)',
                  }}
                >
                  {item.text}
                </span>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col items-center">
          {benefits.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Vertical connecting line BEFORE item (between icons) */}
              {i > 0 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                  className="w-[3px] h-14 origin-top my-1"
                  style={{
                    background: 'linear-gradient(180deg, hsl(195 100% 50% / 0.8), hsl(155 100% 50% / 0.6), hsl(195 100% 50% / 0.8))',
                    boxShadow: '0 0 12px hsl(195 100% 50% / 0.6), 0 0 24px hsl(195 100% 50% / 0.3), 0 0 48px hsl(155 100% 50% / 0.15)',
                  }}
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-center gap-4 py-3"
              >
                <div className="relative">
                  <CheckCircle2 
                    className="w-9 h-9 flex-shrink-0 relative z-10" 
                    style={{ 
                      color: item.icon === 'green' ? 'hsl(155 100% 50%)' : 'hsl(195 100% 50%)',
                      filter: `drop-shadow(0 0 20px ${item.icon === 'green' ? 'hsl(155 100% 50% / 0.9)' : 'hsl(195 100% 50% / 0.9)'}) drop-shadow(0 0 40px ${item.icon === 'green' ? 'hsl(155 100% 50% / 0.5)' : 'hsl(195 100% 50% / 0.5)'})`
                    }} 
                  />
                  <div 
                    className="absolute inset-0 rounded-full blur-xl -z-10"
                    style={{
                      background: item.icon === 'green' ? 'hsl(155 100% 50% / 0.3)' : 'hsl(195 100% 50% / 0.3)',
                      transform: 'scale(2)',
                    }}
                  />
                </div>

                <span 
                  className="text-xl font-bold text-white whitespace-nowrap"
                  style={{
                    textShadow: '0 0 20px hsl(195 100% 50% / 0.5), 0 0 40px hsl(195 100% 50% / 0.25), 0 2px 8px hsl(220 50% 5% / 0.6)',
                  }}
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
