import { motion, useScroll, useTransform } from 'framer-motion';
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
    title: 'E-commerce de Moda',
    category: 'E-commerce',
    description: 'Loja virtual completa com checkout otimizado e design premium.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    type: 'Protótipo',
    hasVideo: true,
  },
  {
    id: 2,
    title: 'Landing Page SaaS',
    category: 'Landing Page',
    description: 'Página de captura com design moderno para software B2B.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    type: 'Protótipo',
  },
  {
    id: 3,
    title: 'Portfólio Fotógrafo',
    category: 'Portfólio',
    description: 'Galeria interativa com carregamento rápido e visual impactante.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop',
    type: 'Protótipo',
  },
  {
    id: 4,
    title: 'Clínica Odontológica',
    category: 'Landing Page',
    description: 'Site institucional com design profissional e moderno.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop',
    type: 'Protótipo',
  },
];

export function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Horizontal scroll transform based on vertical scroll
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section id="portfolio" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-glow-gradient pointer-events-none opacity-30" />
      
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
            Exemplos do que posso criar
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Esses são modelos e protótipos para demonstrar meu estilo e qualidade de trabalho
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scrolling Portfolio with Parallax */}
      <div ref={containerRef} className="relative">
        <motion.div 
          style={{ x }}
          className="flex gap-6 px-4 md:px-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-[85vw] md:w-[500px] lg:w-[600px]"
            >
              <div className="glass-card-hover group overflow-hidden h-full">
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Multi-layer parallax overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"
                    initial={{ opacity: 0.5 }}
                    whileHover={{ opacity: 0.8 }}
                  />
                  
                  {/* Video Badge */}
                  {project.hasVideo && (
                    <motion.div 
                      className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play className="w-3 h-3 text-primary-foreground" fill="currentColor" />
                      <span className="text-xs font-medium text-primary-foreground">Vídeo</span>
                    </motion.div>
                  )}

                  {/* Category Tag */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-background/80 backdrop-blur-sm text-primary border border-primary/30">
                      {project.category}
                    </span>
                  </div>

                  {/* Overlay on Hover */}
                  <motion.div 
                    className="absolute inset-0 bg-background/60 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button variant="secondary" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Ver projeto
                    </Button>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">Tipo:</span>
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {project.type}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

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
            Deslize para ver mais
            <motion.span
              animate={{ x: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
