import { motion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  type: string;
  hasVideo?: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Landing Page Advocacia',
    category: 'Landing Page',
    description: 'Página de alta conversão para escritório de advocacia com design sofisticado.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=500&fit=crop',
    type: 'Protótipo',
  },
  {
    id: 2,
    title: 'Site Institucional Clínica',
    category: 'Site Institucional',
    description: 'Site profissional para clínica médica com agendamento integrado.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop',
    type: 'Protótipo',
    hasVideo: true,
  },
  {
    id: 3,
    title: 'Landing Page SaaS',
    category: 'Landing Page',
    description: 'Página de captura com design moderno para software B2B.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    type: 'Protótipo',
  },
];

export function Portfolio() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="portfolio" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-glow-gradient pointer-events-none opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="section-label">Protótipos</span>
          <h2 className="section-title">
            Especialista em Landing Pages & Sites Institucionais
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Foco total em criar páginas que convertem visitantes em clientes. Confira exemplos do meu trabalho.
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scrolling Portfolio - Native Scroll */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide pb-4 cursor-grab active:cursor-grabbing"
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory'
        }}
      >
        <div className="flex gap-6 px-4 md:px-8 w-max">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-[80vw] md:w-[380px] lg:w-[420px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="glass-card-hover group overflow-hidden h-full">
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                  
                  {/* Video Badge */}
                  {project.hasVideo && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full">
                      <Play className="w-3 h-3 text-primary-foreground" fill="currentColor" />
                      <span className="text-xs font-medium text-primary-foreground">Vídeo</span>
                    </div>
                  )}

                  {/* Category Tag */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-background/80 backdrop-blur-sm text-primary border border-primary/30">
                      {project.category}
                    </span>
                  </div>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Ver projeto
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">Tipo:</span>
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {project.type}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="flex justify-center mt-8 gap-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <motion.span
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ←
          </motion.span>
          Arraste para ver mais
          <motion.span
            animate={{ x: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </span>
      </motion.div>
    </section>
  );
}
