import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react';
import { useDeviceTier } from '@/hooks/use-device-tier';

gsap.registerPlugin(ScrollTrigger);


import portfolioVivendo from '@/assets/portfolio-vivendo.png';
import portfolioVinidigital from '@/assets/portfolio-vinidigital.png';
import portfolioClinica from '@/assets/portfolio-clinicaiphone.png';
import portfolioBeatriz from '@/assets/portfolio-beatriz.png';
import portfolioCsa from '@/assets/portfolio-csa.jpg';

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
  /** HSL trio used for the glow & accents per project */
  glow: { from: string; to: string; accent: string };
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
    code: '01',
    glow: { from: '320 90% 55%', to: '280 85% 50%', accent: '320 100% 65%' },
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
    code: '02',
    glow: { from: '195 100% 50%', to: '220 90% 45%', accent: '195 100% 60%' },
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
    code: '03',
    glow: { from: '155 100% 50%', to: '180 90% 45%', accent: '155 100% 60%' },
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
    code: '04',
    glow: { from: '35 100% 60%', to: '15 95% 55%', accent: '40 100% 65%' },
  },
  {
    id: 5,
    title: 'CSA Engenharia',
    categoryLabel: 'Site Institucional',
    subtitle: 'Engenharia Civil',
    description: 'Site institucional para empresa de engenharia civil, com identidade sóbria e foco em credibilidade.',
    image: portfolioCsa,
    type: 'Projeto Real',
    link: 'https://www.csaengenharia.org',
    code: '05',
    glow: { from: '210 80% 55%', to: '230 70% 40%', accent: '210 100% 65%' },
  },
];

export function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNavRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const tier = useDeviceTier();
  const isLight = tier === 'light';

  const active = projects[activeIndex];


  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const pauseAutoplayTemporarily = useCallback(() => {
    setIsPlaying(false);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => setIsPlaying(true), 9000);
  }, []);

  const navigate = useCallback(
    (dir: number) => {
      const now = Date.now();
      if (now - lastNavRef.current < 220) return;
      lastNavRef.current = now;
      setDirection(dir);
      setActiveIndex((i) => (i + dir + projects.length) % projects.length);
      pauseAutoplayTemporarily();
    },
    [pauseAutoplayTemporarily],
  );

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setDirection(1);
      setActiveIndex((i) => (i + 1) % projects.length);
    }, 6500);
    return () => clearInterval(id);
  }, [isPlaying]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
    pauseAutoplayTemporarily();
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  };

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28"
    >
      {/* Static gradient fallback — base layer */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at top, hsl(220 50% 12%) 0%, hsl(220 50% 6%) 60%, hsl(220 50% 4%) 100%)',
        }}
      />
      {/* Background video — visible on all devices (mobile included) */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-90"
        src="/portfolio-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />
      {/* Soft dark overlay — light so the video keeps showing through */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'linear-gradient(180deg, hsl(220 50% 4% / 0.45) 0%, hsl(220 50% 4% / 0.3) 50%, hsl(220 50% 4% / 0.6) 100%)',
        }}
      />
      {/* Subtle adaptive tint per project */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay z-0"
        animate={{
          background: `radial-gradient(ellipse 75% 60% at 50% 50%, hsl(${active.glow.from} / 0.18) 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Header */}
      <div ref={headerRef} className="container mx-auto px-4 relative z-10 text-center mb-10">
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
        <p className="mt-4 text-sm md:text-base font-light tracking-wide text-foreground/70">
          Vitrine imersiva — cada projeto pinta a sala com a própria identidade
        </p>
      </div>

      {/* Showcase */}
      <div
        className="relative z-10 container mx-auto px-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Project name (giant background type) */}
        <div className="relative h-[60vh] md:h-[70vh] max-h-[700px] flex items-center justify-center">
          {/* Giant brand text behind card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`brand-${active.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 0.08, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            >
              <span
                className="font-black uppercase whitespace-nowrap tracking-tighter text-foreground"
                style={{
                  fontSize: 'clamp(4rem, 18vw, 16rem)',
                  letterSpacing: '-0.06em',
                }}
              >
                {active.title.split(' ')[0]}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Featured card — flutuando sobre o vídeo */}
          <motion.div
            className="relative w-[88vw] max-w-[520px] aspect-[3/4] md:aspect-[4/5]"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
          >

            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.a
                key={active.id}
                href={active.link}
                target="_blank"
                rel="noopener noreferrer"
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction > 0 ? 80 : -80,
                  scale: 0.95,
                  rotateY: direction > 0 ? 8 : -8,
                }}
                animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -80 : 80,
                  scale: 0.95,
                  rotateY: direction > 0 ? -8 : 8,
                }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-3xl overflow-hidden block"
                style={{
                  boxShadow: `0 30px 70px hsl(220 50% 4% / 0.7), 0 0 80px hsl(${active.glow.accent} / 0.35), 0 0 0 1px hsl(${active.glow.accent} / 0.25) inset`,
                }}
              >
                <img
                  src={active.image}
                  alt={active.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, transparent 40%, hsl(220 50% 4% / 0.55) 75%, hsl(220 50% 4% / 0.92) 100%)`,
                  }}
                />

                {/* Top tags */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <span
                    className="text-[10px] tracking-widest font-mono px-2 py-1 rounded-full border bg-background/30 backdrop-blur"
                    style={{
                      color: `hsl(${active.glow.accent})`,
                      borderColor: `hsl(${active.glow.accent} / 0.4)`,
                    }}
                  >
                    {active.code} / {String(projects.length).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-bold px-2 py-1 rounded-full bg-foreground/10 backdrop-blur text-foreground/90 border border-foreground/20">
                    {active.type}
                  </span>
                </div>

                {/* Bottom info */}
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 text-left">
                  <p
                    className="text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold mb-2"
                    style={{ color: `hsl(${active.glow.accent})` }}
                  >
                    {active.categoryLabel}
                  </p>
                  <h3 className="text-2xl md:text-4xl font-black text-white leading-[0.95] tracking-tight mb-2">
                    {active.title}
                  </h3>
                  <p className="text-sm text-white/70 mb-4">{active.subtitle}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 uppercase tracking-wider">
                    Ver projeto
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.a>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-6 md:mt-10">
          <button
            aria-label="Projeto anterior"
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full border border-foreground/25 bg-foreground/5 backdrop-blur hover:bg-foreground/10 transition flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => {
                  setDirection(i > activeIndex ? 1 : -1);
                  setActiveIndex(i);
                  pauseAutoplayTemporarily();
                }}
                aria-label={`Projeto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === activeIndex ? 'w-8' : 'w-1.5 bg-foreground/30 hover:bg-foreground/60'
                }`}
                style={
                  i === activeIndex
                    ? { background: `hsl(${active.glow.accent})`, boxShadow: `0 0 10px hsl(${active.glow.accent} / 0.7)` }
                    : undefined
                }
              />
            ))}
          </div>

          <button
            aria-label="Próximo projeto"
            onClick={() => navigate(1)}
            className="w-11 h-11 rounded-full border border-foreground/25 bg-foreground/5 backdrop-blur hover:bg-foreground/10 transition flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Counter */}
        <div className="text-center mt-4 text-[10px] tracking-[0.4em] uppercase text-foreground/50 font-bold">
          {String(activeIndex + 1).padStart(2, '0')} — {String(projects.length).padStart(2, '0')}
        </div>
      </div>
    </section>
  );
}
