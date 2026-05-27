import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef, useMemo, useState } from 'react';
import { useDeviceTier } from '@/hooks/use-device-tier';
import { useAnalytics } from '@/hooks/use-analytics';
import portfolioAdvocacia from '@/assets/portfolio-advocacia.png';
import portfolioBeatriz from '@/assets/portfolio-beatriz.png';
import portfolioClinica from '@/assets/portfolio-clinicaiphone.png';
import portfolioVini from '@/assets/portfolio-vinidigital.png';

const WHATSAPP_NUMBER = "551931990107";

// Ambient floating dots — denser for added depth ("poeira estelar" + glow dots)
const floatingDots = [
  // Main glow layer
  { x: '8%', y: '12%', size: 6, color: 'hsl(195 100% 50%)', duration: 6, opacity: 0.55 },
  { x: '88%', y: '18%', size: 5, color: 'hsl(155 100% 50%)', duration: 7, opacity: 0.5 },
  { x: '15%', y: '70%', size: 7, color: 'hsl(195 100% 50%)', duration: 8, opacity: 0.6 },
  { x: '78%', y: '75%', size: 5, color: 'hsl(155 100% 50%)', duration: 6.5, opacity: 0.5 },
  { x: '45%', y: '8%', size: 6, color: 'hsl(195 100% 50%)', duration: 7.5, opacity: 0.55 },
  { x: '88%', y: '50%', size: 5, color: 'hsl(195 100% 50%)', duration: 8, opacity: 0.5 },
  { x: '68%', y: '5%', size: 7, color: 'hsl(195 100% 50%)', duration: 6.5, opacity: 0.6 },
  { x: '5%', y: '40%', size: 4, color: 'hsl(155 100% 50%)', duration: 9, opacity: 0.45 },
  { x: '86%', y: '65%', size: 5, color: 'hsl(195 100% 50%)', duration: 7, opacity: 0.5 },
  { x: '25%', y: '25%', size: 4, color: 'hsl(155 100% 50%)', duration: 8.5, opacity: 0.45 },
  { x: '55%', y: '85%', size: 6, color: 'hsl(195 100% 50%)', duration: 6, opacity: 0.55 },
  { x: '35%', y: '55%', size: 4, color: 'hsl(155 100% 50%)', duration: 9.5, opacity: 0.4 },
  { x: '72%', y: '35%', size: 5, color: 'hsl(195 100% 50%)', duration: 7.5, opacity: 0.5 },
  { x: '18%', y: '88%', size: 4, color: 'hsl(155 100% 50%)', duration: 8, opacity: 0.45 },
  { x: '50%', y: '45%', size: 8, color: 'hsl(195 100% 55%)', duration: 7, opacity: 0.6 },
  { x: '62%', y: '62%', size: 6, color: 'hsl(155 100% 50%)', duration: 8, opacity: 0.5 },
  { x: '40%', y: '32%', size: 5, color: 'hsl(195 100% 50%)', duration: 9, opacity: 0.5 },
  { x: '12%', y: '55%', size: 5, color: 'hsl(155 100% 50%)', duration: 7, opacity: 0.5 },
  // Stellar dust (small, slow, low-opacity)
  { x: '22%', y: '38%', size: 2, color: 'hsl(0 0% 100%)', duration: 12, opacity: 0.25 },
  { x: '58%', y: '18%', size: 2, color: 'hsl(0 0% 100%)', duration: 14, opacity: 0.2 },
  { x: '82%', y: '32%', size: 3, color: 'hsl(0 0% 100%)', duration: 13, opacity: 0.25 },
  { x: '30%', y: '78%', size: 2, color: 'hsl(0 0% 100%)', duration: 15, opacity: 0.22 },
  { x: '65%', y: '92%', size: 2, color: 'hsl(0 0% 100%)', duration: 11, opacity: 0.2 },
  { x: '92%', y: '88%', size: 3, color: 'hsl(0 0% 100%)', duration: 14, opacity: 0.25 },
  { x: '6%', y: '24%', size: 2, color: 'hsl(0 0% 100%)', duration: 13, opacity: 0.22 },
  { x: '48%', y: '70%', size: 3, color: 'hsl(0 0% 100%)', duration: 12, opacity: 0.25 },
];

// 4 cards forming an X — corners of the viewport
const cornerCards = [
  {
    pos: 'top-[10%] left-[4%] md:left-[8%]',
    size: 'w-28 h-36 md:w-52 md:h-72',
    rot: -14,
    hoverRot: -8,
    hoverShift: 'translateY(-10px)',
    img: portfolioVini,
    accent: 'hsl(195 100% 50%)',
    alt: 'Site Vini Digital',
  },
  {
    pos: 'top-[10%] right-[4%] md:right-[8%]',
    size: 'w-28 h-36 md:w-52 md:h-72',
    rot: 14,
    hoverRot: 8,
    hoverShift: 'translateY(-10px)',
    img: portfolioAdvocacia,
    accent: 'hsl(155 100% 50%)',
    alt: 'Site Advocacia',
  },
  {
    pos: 'bottom-[10%] left-[4%] md:left-[8%]',
    size: 'w-28 h-36 md:w-52 md:h-72',
    rot: 14,
    hoverRot: 8,
    hoverShift: 'translateY(10px)',
    img: portfolioClinica,
    accent: 'hsl(155 100% 50%)',
    alt: 'Site Clínica iPhone',
  },
  {
    pos: 'bottom-[10%] right-[4%] md:right-[8%]',
    size: 'w-28 h-36 md:w-52 md:h-72',
    rot: -14,
    hoverRot: -8,
    hoverShift: 'translateY(10px)',
    img: portfolioBeatriz,
    accent: 'hsl(195 100% 50%)',
    alt: 'Site Beatriz',
  },
];

export function Hero() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero saber mais sobre criação de sites.`;
  const sectionRef = useRef<HTMLElement>(null);
  const tier = useDeviceTier();
  const isLight = tier === 'light';
  const { trackCtaClick } = useAnalytics();
  const [ctaHover, setCtaHover] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, isLight ? -40 : -120]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, isLight ? -15 : -50]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  const dots = useMemo(
    () => (isLight ? floatingDots.slice(0, 10) : floatingDots),
    [isLight],
  );

  return (
    <section ref={sectionRef} className="relative min-h-[150vh] overflow-hidden">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <motion.div style={{ y: layer1Y }} className="absolute inset-0 bg-hero-gradient" />
        <motion.div style={{ y: layer1Y }} className="absolute inset-0 hex-pattern opacity-5" />

        {/* Subtle radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'hsl(195 100% 50% / 0.05)', filter: 'blur(120px)' }}
        />

        {/* Ambient floating dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {dots.map((dot, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: dot.x,
                top: dot.y,
                width: dot.size,
                height: dot.size,
                background: dot.color,
                boxShadow: `0 0 ${dot.size * 2}px ${dot.color}`,
                opacity: dot.opacity,
                animation: `floatDot${i % 3} ${dot.duration}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* 4 corner cards forming an X — real portfolio screenshots */}
        <div className="absolute inset-0 pointer-events-none">
          {cornerCards.map((c, i) => {
            const baseTransform = `rotate(${c.rot}deg)`;
            const hoverTransform = `rotate(${c.hoverRot}deg) ${c.hoverShift}`;
            return (
              <div
                key={i}
                className={`absolute ${c.pos} ${c.size} rounded-lg shadow-2xl overflow-hidden border transition-all duration-700 ease-out`}
                style={{
                  borderColor: `${c.accent.replace(')', ' / 0.35)')}`,
                  boxShadow: `0 12px 40px hsl(220 50% 4% / 0.55), 0 0 28px ${c.accent.replace(')', ' / 0.18)')}`,
                  transform: ctaHover ? hoverTransform : baseTransform,
                }}
              >
                <img
                  src={c.img}
                  alt={c.alt}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${c.accent.replace(')', ' / 0.15)')} 0%, hsl(220 50% 4% / 0.55) 100%)`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <motion.div
          style={{ y: layer3Y, opacity: textOpacity, scale: textScale }}
          className="container mx-auto px-4 relative z-20"
        >
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            {/* Eyebrow */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-[hsl(155_100%_50%)] text-[0.7rem] md:text-xs font-semibold tracking-[0.3em] uppercase mb-5"
            >
              Criador de Sites & Landing Pages
            </motion.span>

            {/* Editorial headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif italic text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85] tracking-tight flex flex-col mb-10"
            >
              <span className="block">Crio</span>
              <span className="block flex items-center justify-center gap-6 md:gap-16">
                <span className="font-display not-italic font-light text-2xl md:text-4xl lg:text-5xl tracking-[0.2em] text-white/40 uppercase translate-y-1 md:translate-y-2">
                  sites
                </span>
                <span className="text-[hsl(195_100%_55%)]">que</span>
              </span>
              <span className="block text-[hsl(155_100%_50%)]">Vendem</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="font-display text-slate-300 text-base md:text-xl font-light leading-relaxed max-w-xl mb-8"
            >
              Especialista em sites institucionais e landing pages com design moderno,
              velocidade e foco em conversão.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCtaHover(true)}
                onMouseLeave={() => setCtaHover(false)}
                onClick={() => trackCtaClick({ location: 'hero', label: 'Quero meu site' })}
                className="cta-primary group/cta px-8 py-4 rounded-full font-bold text-[hsl(220_50%_8%)] font-display transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] btn-ripple"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(195 100% 55%) 0%, hsl(155 100% 50%) 100%)',
                  boxShadow: ctaHover
                    ? '0 0 32px hsl(155 100% 50% / 0.55), 0 0 64px hsl(195 100% 50% / 0.25)'
                    : '0 0 20px hsl(195 100% 50% / 0.3)',
                }}
              >
                Quero meu site
              </a>

              <a
                href="#portfolio"
                className="font-display px-6 py-4 text-white font-medium flex items-center gap-2 hover:text-[hsl(155_100%_50%)] transition-colors group/sec"
              >
                Ver portfólio
                <ArrowRight className="w-4 h-4 group-hover/sec:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
