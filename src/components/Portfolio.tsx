import { motion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';
import { useState } from 'react';
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

const categories = ['Todos', 'Landing Page', 'Portfólio', 'E-commerce'];

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

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredProjects = activeCategory === 'Todos'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-glow-gradient pointer-events-none opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-label">Protótipos</span>
          <h2 className="section-title">
            Exemplos do que posso criar
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Esses são modelos e protótipos para demonstrar meu estilo e qualidade de trabalho
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'glass-card text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              layout
              className="glass-card-hover group overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative md:w-1/2 aspect-video md:aspect-auto overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Video Badge */}
                  {project.hasVideo && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full">
                      <Play className="w-3 h-3 text-primary-foreground" fill="currentColor" />
                      <span className="text-xs font-medium text-primary-foreground">Vídeo</span>
                    </div>
                  )}

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Ver projeto
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mt-2 mb-3">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tipo:</span>
                      <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">{project.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
