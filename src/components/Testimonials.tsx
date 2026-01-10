import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Carlos Silva',
    role: 'CEO, TechStart',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    content: 'O site superou todas as expectativas. Em 2 meses, triplicamos nossos leads qualificados. Profissionalismo e qualidade impressionantes!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Ana Rodrigues',
    role: 'Fotógrafa',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    content: 'Meu portfólio ficou incrível! Os clientes elogiam muito e as solicitações de orçamento aumentaram 60%.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ricardo Mendes',
    role: 'Dono, Clínica Sorriso',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    content: 'Entrega rápida e resultado excelente. O agendamento online automatizou todo nosso processo. Recomendo muito!',
    rating: 5,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-glow-gradient pointer-events-none opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="section-label">Depoimentos</span>
          <h2 className="section-title">
            O que dizem os clientes
          </h2>
        </motion.div>

        <div 
          className="max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 md:p-12 text-center"
          >
            {/* Quote Icon */}
            <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Quote className="w-6 h-6 text-primary" />
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-primary fill-primary" />
              ))}
            </div>

            {/* Content */}
            <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
              "{testimonials[currentIndex].content}"
            </p>

            {/* Author */}
            <div className="flex items-center justify-center gap-4">
              <img
                src={testimonials[currentIndex].avatar}
                alt={testimonials[currentIndex].name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30"
              />
              <div className="text-left">
                <div className="font-semibold text-foreground">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonials[currentIndex].role}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
