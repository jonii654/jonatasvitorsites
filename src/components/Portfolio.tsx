import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

import portfolioVivendo from '@/assets/portfolio-vivendo.png';
import portfolioVinidigital from '@/assets/portfolio-vinidigital.png';
import portfolioClinica from '@/assets/portfolio-clinicaiphone.png';
import portfolioBeatriz from '@/assets/portfolio-beatriz.png';

interface Project {
  id: number;
  title: string;
  titleHighlight: string;
  category: string;
  categoryLabel: string;
  description: string;
  image: string;
  type: string;
  link?: string;
  bgColor: string; // HSL glow color matching the site
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Landing Page',
    titleHighlight: 'Venda',
    category: 'Landing Page',
    categoryLabel: 'LANDING PAGE',
    description: 'Página de vendas com design impactante para curso de transformação pessoal.',
    image: portfolioVivendo,
    type: 'Projeto Real',
    link: 'https://www.vivendopoderosamente.com.br/',
    bgColor: '30 80% 50%',   // warm orange/gold
  },
  {
    id: 2,
    title: 'ViniDigital',
    titleHighlight: 'Segurança',
    category: 'Site Institucional',
    categoryLabel: 'SITE INSTITUCIONAL',
    description: 'Site institucional para empresa de CFTV, Elétrica e Automação com design moderno.',
    image: portfolioVinidigital,
    type: 'Projeto Real',
    link: 'https://www.vinidigtal.com.br/',
    bgColor: '220 70% 45%',  // deep blue
  },
  {
    id: 3,
    title: 'Clínica do',
    titleHighlight: 'iPhone',
    category: 'Site Institucional',
    categoryLabel: 'SITE MODELO',
    description: 'Site modelo para assistência técnica de iPhones com design moderno e profissional.',
    image: portfolioClinica,
    type: 'Site Modelo',
    link: 'https://clinicadoiphonesite.lovable.app',
    bgColor: '0 0% 85%',     // white/light
  },
  {
    id: 4,
    title: 'Beatriz',
    titleHighlight: 'Marca Pessoal',
    category: 'Site Pessoal',
    categoryLabel: 'MARCA PESSOAL',
    description: 'Site modelo para estrategista digital e mentora com design elegante e sofisticado.',
    image: portfolioBeatriz,
    type: 'Site Modelo',
    link: 'https://testedoteusitebeatriz.lovable.app',
    bgColor: '280 50% 45%',  // purple
  },
];

export function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);

  const goTo = useCallback((index: number) => {
    const len = projects.length;
    setActiveIndex(((index % len) + len) % len);
  }, []);

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) next();
    else if (info.offset.x > threshold) prev();
    // Prevent click after drag
    isDragging.current = true;
    setTimeout(() => { isDragging.current = false; }, 200);
  }, [next, prev]);

  const getVisibleProjects = () => {
    const len = projects.length;
    const prevIdx = ((activeIndex - 1) % len + len) % len;
    const nextIdx = (activeIndex + 1) % len;
    return [
      { project: projects[prevIdx], position: 'left' as const },
      { project: projects[activeIndex], position: 'center' as const },
      { project: projects[nextIdx], position: 'right' as const },
    ];
  };

  const visible = getVisibleProjects();
  const active = projects[activeIndex];

  return (
    <section id="portfolio" className="py-20 md:py-32 relative overflow-hidden">
      {/* Adaptive background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, hsla(${active.bgColor} / 0.12) 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-4 relative z-10 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="section-label">Portfólios</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">Trabalhos Já Feitos</span>{' '}
            <span className="gradient-text">/ Protótipos</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Exemplos do meu trabalho abaixo.
          </p>
        </motion.div>
      </div>

      {/* Carousel with swipe */}
      <motion.div
        className="relative z-10 w-full overflow-hidden touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ cursor: 'grab' }}
        whileDrag={{ cursor: 'grabbing' }}
      >
        <div
          className="relative flex items-center justify-center select-none"
          style={{ height: 'clamp(260px, 45vw, 420px)' }}
        >
          {visible.map(({ project, position }) => {
            const isCenter = position === 'center';
            const isLeft = position === 'left';

            return (
              <motion.div
                key={`${project.id}-${position}`}
                className="absolute"
                onClick={() => {
                  if (isDragging.current) return;
                  if (isLeft) prev();
                  if (position === 'right') next();
                  if (isCenter && project.link) window.open(project.link, '_blank');
                }}
                initial={false}
                animate={{
                  x: isCenter ? '0%' : isLeft ? '-75%' : '75%',
                  scale: isCenter ? 1 : 0.75,
                  opacity: isCenter ? 1 : 0.5,
                  zIndex: isCenter ? 10 : 5,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ width: 'clamp(280px, 55vw, 580px)' }}
              >
                <div
                  className={`relative overflow-hidden rounded-[20px] md:rounded-[30px] border transition-shadow duration-500 ${
                    isCenter
                      ? 'border-primary/30'
                      : 'border-border/20'
                  }`}
                  style={isCenter ? {
                    boxShadow: `0 0 60px -15px hsla(${active.bgColor} / 0.35)`,
                  } : undefined}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover will-change-transform"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  {isCenter && project.link && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[20px] md:rounded-[30px]">
                      <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        <ExternalLink className="w-4 h-4" />
                        Ver projeto
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-semibold tracking-widest text-primary uppercase">
                {active.categoryLabel}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              <span className="text-foreground">{active.title}</span>{' '}
              <span className="text-muted-foreground">{active.titleHighlight}</span>
            </h3>

            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              {active.description}
            </p>

            <div className="mt-4">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {active.type}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="relative z-10 flex items-center justify-center gap-6 mt-8">
        <button
          onClick={prev}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir para projeto ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-8 bg-primary'
                  : 'w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-all duration-200"
          aria-label="Próximo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
