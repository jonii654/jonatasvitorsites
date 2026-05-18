import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioMosaicHero } from './effects/PortfolioMosaicHero';

import portfolioVivendo from '@/assets/portfolio-vivendo.png';
import portfolioVinidigital from '@/assets/portfolio-vinidigital.png';
import portfolioClinica from '@/assets/portfolio-clinicaiphone.png';
import portfolioBeatriz from '@/assets/portfolio-beatriz.png';

interface Project {
  id: number;
  title: string;
  categoryLabel: string;
  subtitle: string;
  description: string;
  image: string;
  type: string;
  link?: string;
  bgColor: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Vivendo Poderosamente',
    categoryLabel: 'Landing Page',
    subtitle: 'Curso de transformação pessoal',
    description: 'Página de vendas com design impactante para curso de transformação pessoal.',
    image: portfolioVivendo,
    type: 'Projeto Real',
    link: 'https://www.vivendopoderosamente.com.br/',
    bgColor: '30 80% 50%',
  },
  {
    id: 2,
    title: 'ViniDigital',
    categoryLabel: 'Site Institucional',
    subtitle: 'CFTV, Elétrica e Automação',
    description: 'Site institucional para empresa de CFTV, Elétrica e Automação com design moderno.',
    image: portfolioVinidigital,
    type: 'Projeto Real',
    link: 'https://www.vinidigtal.com.br/',
    bgColor: '220 70% 45%',
  },
  {
    id: 3,
    title: 'Clínica do iPhone',
    categoryLabel: 'Site Modelo',
    subtitle: 'Assistência técnica',
    description: 'Site modelo para assistência técnica de iPhones com design moderno e profissional.',
    image: portfolioClinica,
    type: 'Site Modelo',
    link: 'https://iphoneclinica.lovable.app',
    bgColor: '0 0% 85%',
  },
  {
    id: 4,
    title: 'Beatriz',
    categoryLabel: 'Marca Pessoal',
    subtitle: 'Estrategista digital',
    description: 'Site modelo para estrategista digital e mentora com design elegante e sofisticado.',
    image: portfolioBeatriz,
    type: 'Site Modelo',
    link: 'https://marketingpessoal.lovable.app',
    bgColor: '280 50% 45%',
  },
];

export function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(Math.floor(projects.length / 2));
  const [openId, setOpenId] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const active = projects[activeIndex] ?? projects[0];

  // Center the active card when it changes
  useEffect(() => {
    const el = trackRef.current?.querySelector<HTMLElement>(
      `[data-card-index="${activeIndex}"]`
    );
    if (el && trackRef.current) {
      const track = trackRef.current;
      const left = el.offsetLeft - track.clientWidth / 2 + el.clientWidth / 2;
      track.scrollTo({ left, behavior: 'smooth' });
    }
  }, [activeIndex]);

  // Detect which card is centered on scroll
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let min = Infinity;
    track.querySelectorAll<HTMLElement>('[data-card-index]').forEach((el) => {
      const c = el.offsetLeft + el.clientWidth / 2;
      const d = Math.abs(c - center);
      if (d < min) {
        min = d;
        nearest = Number(el.dataset.cardIndex);
      }
    });
    setActiveIndex((prev) => (prev === nearest ? prev : nearest));
  }, []);

  // Close on escape
  useEffect(() => {
    if (openId === null) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenId(null);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openId]);

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(projects.length - 1, i + 1));

  const openProject = projects.find((p) => p.id === openId);

  return (
    <section id="portfolio" className="py-20 md:py-32 relative overflow-hidden">
      {/* Adaptive glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse 70% 55% at 50% 45%, hsla(${active.bgColor} / 0.14) 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      <PortfolioMosaicHero />

      <LayoutGroup id="portfolio-cards">
        {/* Horizontal coverflow track */}
        <div className="relative z-10">
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="flex items-end gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-[35vw] md:px-[38vw] pb-8 pt-4 no-scrollbar"
            style={{
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {projects.map((project, index) => {
              const isCenter = index === activeIndex;
              return (
                <div
                  key={project.id}
                  data-card-index={index}
                  className="snap-center shrink-0 flex flex-col items-center"
                >
                  {/* Title above card */}
                  <motion.p
                    animate={{
                      opacity: isCenter ? 1 : 0.45,
                      y: isCenter ? 0 : 2,
                    }}
                    className="text-[10px] md:text-xs font-semibold tracking-[0.18em] uppercase text-foreground/80 mb-3 text-center max-w-[180px] truncate"
                  >
                    {project.categoryLabel}
                  </motion.p>

                  <motion.button
                    layoutId={`card-${project.id}`}
                    onClick={() => {
                      if (isCenter) setOpenId(project.id);
                      else setActiveIndex(index);
                    }}
                    animate={{
                      scale: isCenter ? 1 : 0.78,
                      opacity: isCenter ? 1 : 0.5,
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    className="relative block overflow-hidden rounded-2xl md:rounded-3xl border border-border/30 bg-muted"
                    style={{
                      width: 'clamp(180px, 30vw, 280px)',
                      aspectRatio: '3 / 5',
                      boxShadow: isCenter
                        ? `0 30px 80px -25px hsla(${project.bgColor} / 0.5), 0 0 0 1px hsla(${project.bgColor} / 0.25)`
                        : '0 10px 30px -15px hsla(0 0% 0% / 0.4)',
                      cursor: isCenter ? 'pointer' : 'pointer',
                    }}
                  >
                    <motion.img
                      layoutId={`img-${project.id}`}
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="w-full h-full object-cover"
                    />
                    {/* Bottom gradient overlay (center only) */}
                    {isCenter && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-x-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
                      >
                        <h3 className="text-white font-bold text-lg md:text-2xl leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-white/70 text-xs md:text-sm mt-1">
                          {project.subtitle}
                        </p>
                      </motion.div>
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={goPrev}
              aria-label="Anterior"
              className="w-10 h-10 rounded-full bg-muted/40 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Projeto ${i + 1}`}
                  className={`h-1 rounded-full transition-all ${
                    i === activeIndex ? 'w-8 bg-primary' : 'w-3 bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={goNext}
              aria-label="Próximo"
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground/70 mt-3">
            Toque no card central para abrir
          </p>
        </div>

        {/* Expanded overlay */}
        <AnimatePresence>
          {openProject && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 bg-background/85 backdrop-blur-xl"
              onClick={() => setOpenId(null)}
            >
              <motion.div
                layoutId={`card-${openProject.id}`}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl md:rounded-3xl border border-border/40 bg-card flex flex-col md:flex-row"
                style={{
                  boxShadow: `0 40px 100px -20px hsla(${openProject.bgColor} / 0.55)`,
                }}
                transition={{ type: 'spring', stiffness: 240, damping: 28 }}
              >
                <button
                  onClick={() => setOpenId(null)}
                  aria-label="Fechar"
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-background/80 border border-border/50 flex items-center justify-center hover:bg-background transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden bg-muted">
                  <motion.img
                    layoutId={`img-${openProject.id}`}
                    src={openProject.image}
                    alt={openProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs font-semibold tracking-widest text-primary uppercase">
                      {openProject.categoryLabel}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold text-foreground leading-tight">
                    {openProject.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {openProject.description}
                  </p>
                  <span className="self-start text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {openProject.type}
                  </span>
                  {openProject.link && (
                    <a
                      href={openProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 mt-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver projeto
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}
