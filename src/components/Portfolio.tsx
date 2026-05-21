import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight, Play, Pause, ArrowLeft } from 'lucide-react';

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
  code: string;
  badge: string;
  accent: string; // tailwind color name for accents
  gradient: string; // bg gradient classes
  thumbGradient: string; // for player thumb
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
    code: '01 // SALES PAGE',
    badge: 'LANDING PAGE',
    accent: 'text-orange-300 border-orange-400/30 bg-orange-400/10',
    gradient: 'from-orange-900 via-zinc-950 to-rose-900',
    thumbGradient: 'linear-gradient(to top right, #7c2d12, #fb923c)',
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
    code: '02 // INSTITUTIONAL',
    badge: 'WEB DESIGN',
    accent: 'text-sky-300 border-sky-400/30 bg-sky-400/10',
    gradient: 'from-sky-950 via-zinc-950 to-blue-900',
    thumbGradient: 'linear-gradient(to top right, #0c4a6e, #38bdf8)',
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
    code: '03 // TECH BRAND',
    badge: 'UI / UX',
    accent: 'text-zinc-200 border-white/20 bg-white/5',
    gradient: 'from-zinc-800 via-zinc-950 to-stone-900',
    thumbGradient: 'linear-gradient(to top right, #27272a, #a1a1aa)',
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
    code: '04 // PERSONAL',
    badge: 'CREATIVE DIR.',
    accent: 'text-fuchsia-300 border-fuchsia-400/30 bg-fuchsia-400/10',
    gradient: 'from-fuchsia-950 via-zinc-950 to-purple-900',
    thumbGradient: 'linear-gradient(to top right, #581c87, #e879f9)',
  },
];

type Mode = 'gallery' | 'focus';

export function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('gallery');
  const [openId, setOpenId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const active = projects[activeIndex];

  // Autoplay
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % projects.length);
    }, 6000);
    return () => clearInterval(id);
  }, [isPlaying]);

  const navigate = useCallback((dir: number) => {
    setActiveIndex((i) => (i + dir + projects.length) % projects.length);
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openId !== null) {
        if (e.key === 'Escape') setOpenId(null);
        return;
      }
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'Escape' && mode === 'focus') setMode('gallery');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, mode, openId]);

  // Body scroll lock on modal
  useEffect(() => {
    if (openId === null) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openId]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  };

  const handleCardClick = (idx: number) => {
    if (mode === 'gallery') {
      setActiveIndex(idx);
      setMode('focus');
    } else {
      if (idx === activeIndex) setOpenId(projects[idx].id);
      else setActiveIndex(idx);
    }
  };

  const openProject = projects.find((p) => p.id === openId);

  // Card layout per mode
  const getCardStyle = (idx: number) => {
    const isActive = idx === activeIndex;
    if (mode === 'gallery') {
      return {
        flex: isActive ? '2.5 1 0%' : '1 1 0%',
        maxWidth: isActive ? 320 : 180,
        minWidth: 50,
        opacity: 1,
        transform: 'translateX(0) translateY(0) scale(1)',
        zIndex: isActive ? 10 : 0,
      };
    }
    // focus
    const isLeft = idx === (activeIndex - 1 + projects.length) % projects.length;
    const isRight = idx === (activeIndex + 1) % projects.length;
    if (isActive) {
      return {
        flex: '0 0 auto',
        width: 'min(85vw, 340px)',
        maxWidth: 340,
        minWidth: 240,
        opacity: 1,
        transform: 'translateY(-10px) scale(1)',
        zIndex: 30,
      };
    }
    if (isLeft || isRight) {
      return {
        flex: '0 0 auto',
        width: 130,
        maxWidth: 150,
        minWidth: 100,
        opacity: 0.3,
        transform: `translateX(${isLeft ? 10 : -10}px) scale(0.9)`,
        zIndex: 20,
      };
    }
    return {
      flex: '0 0 auto',
      width: 0,
      maxWidth: 0,
      minWidth: 0,
      opacity: 0,
      transform: 'scale(0.75)',
      zIndex: 0,
    };
  };

  const leftPercents = projects.map((_, i) => (100 / (projects.length + 1)) * (i + 1));

  return (
    <section id="portfolio" className="py-20 md:py-28 relative overflow-hidden">
      {/* Adaptive glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse 70% 55% at 50% 45%, ${active.thumbGradient.match(/#[a-f0-9]+/i)?.[1] ?? '#222'}22 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.8 }}
      />

      <div className="container mx-auto px-4 relative z-10 text-center mb-6">
        <span className="section-label">Portfólio</span>
        <h2
          className="font-black leading-[0.85] tracking-tight uppercase mt-4"
          style={{
            fontSize: 'clamp(2.5rem, 11vw, 7rem)',
            letterSpacing: '-0.05em',
            background: 'linear-gradient(135deg, hsl(195 100% 60%), hsl(155 100% 55%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Trabalhos
        </h2>
      </div>

      {/* Category header (gallery mode) */}
      <motion.div
        animate={{
          opacity: mode === 'gallery' ? 1 : 0,
          y: mode === 'gallery' ? 0 : -24,
        }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4 px-4"
      >
        <div className="flex justify-center items-center gap-4 text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-bold mb-1">
          <span>PORTFOLIO</span>
          <span className="h-1 w-1 bg-muted-foreground/40 rounded-full" />
          <span>EDITION 2026</span>
        </div>
        <p className="text-sm md:text-base font-light tracking-wide text-foreground/70">
          Exemplos do que entrego: sites institucionais e landing pages
        </p>
      </motion.div>

      {/* Decorative thin line */}
      <div className="relative w-full max-w-4xl mx-auto h-[1px] mb-6 overflow-hidden px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
        <motion.div
          className="absolute h-[1px] w-1/4 bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{ left: `${leftPercents[activeIndex] - 12.5}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <LayoutGroup id="portfolio-cards">
        <div
          ref={wrapperRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="w-full max-w-6xl mx-auto flex justify-center items-center h-[380px] md:h-[460px] gap-2 md:gap-3 px-3 md:px-6"
        >
          {projects.map((project, idx) => {
            const isActive = idx === activeIndex;
            const showPoster = mode === 'focus' && isActive;
            const style = getCardStyle(idx);

            return (
              <motion.button
                key={project.id}
                layoutId={`card-${project.id}`}
                onClick={() => handleCardClick(idx)}
                animate={style}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`relative group cursor-pointer overflow-hidden h-full block ${
                  mode === 'focus' && isActive
                    ? 'rounded-3xl border border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
                    : mode === 'gallery' && isActive
                    ? 'rounded-2xl border border-border/40 shadow-[0_10px_35px_rgba(0,0,0,0.5)]'
                    : 'rounded-2xl border border-transparent'
                }`}
                style={style}
              >
                {/* Background image */}
                <motion.img
                  layoutId={`img-${project.id}`}
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Gradient overlay tinted by project */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60 mix-blend-multiply`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                {/* Poster top elements (focus mode active only) */}
                <AnimatePresence>
                  {showPoster && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.25, duration: 0.5 }}
                      className="absolute top-0 inset-x-0 p-5 flex justify-between items-start z-10"
                    >
                      <span className={`text-[9px] tracking-widest font-mono ${project.accent.split(' ')[0]}`}>
                        {project.code}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 border rounded-full ${project.accent}`}>
                        {project.badge}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom info */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 z-10 text-left">
                  <h3 className={`font-bold tracking-tight text-white leading-tight ${
                    mode === 'focus' && isActive ? 'text-xl md:text-2xl' : 'text-sm md:text-base'
                  }`}>
                    {project.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-white/70 tracking-wider uppercase font-medium mt-1 truncate">
                    {project.categoryLabel}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Focus navigation */}
        <motion.div
          animate={{
            opacity: mode === 'focus' ? 1 : 0,
            y: mode === 'focus' ? 0 : 24,
            pointerEvents: mode === 'focus' ? 'auto' : 'none',
          }}
          transition={{ duration: 0.6 }}
          className="mt-8 flex flex-col items-center gap-4 px-4"
        >
          <span className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase font-bold">
            Projeto selecionado
          </span>
          <div className="flex items-center gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(i);
                }}
                aria-label={`Projeto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setMode('gallery')}
            className="glass-card hover:bg-foreground hover:text-background px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar à Lista
          </button>
        </motion.div>

        {/* Player footer */}
        <div className="container mx-auto px-4 mt-10">
          <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left: project info */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="h-10 w-10 rounded-lg border border-border/40 overflow-hidden flex-shrink-0">
                <motion.div
                  className="h-full w-full"
                  animate={{ background: active.thumbGradient }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold tracking-tight text-foreground truncate">
                    {active.title}
                  </h4>
                  <span className="h-1 w-1 bg-muted-foreground/60 rounded-full flex-shrink-0" />
                  <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0">
                    {String(activeIndex + 1).padStart(2, '0')}/{String(projects.length).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{active.categoryLabel}</p>
              </div>
            </div>

            {/* Center: controls */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate(-1)}
                aria-label="Anterior"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                className="h-11 w-11 rounded-full bg-foreground hover:bg-primary text-background flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button
                onClick={() => navigate(1)}
                aria-label="Próximo"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right: status */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <span className="text-[9px] text-muted-foreground tracking-wider uppercase font-bold block">
                  Interativo
                </span>
                <span className={`text-xs font-medium ${isPlaying ? 'text-primary' : 'text-muted-foreground'}`}>
                  {isPlaying ? 'Auto-Play Ativo' : 'Pausado'}
                </span>
              </div>
              <div
                className={`h-10 w-10 rounded-full border-2 border-border bg-background/80 flex items-center justify-center ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '8s' }}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-background" />
                </div>
              </div>
            </div>
          </div>
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
