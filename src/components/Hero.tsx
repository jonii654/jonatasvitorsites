import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef, useMemo, useState } from 'react';
import { useDeviceTier } from '@/hooks/use-device-tier';
import { useAnalytics } from '@/hooks/use-analytics';

const WHATSAPP_NUMBER = "551931990107";

// Ambient floating dots (kept from original — performant pure CSS)
const floatingDots = [
  { x: '8%', y: '12%', size: 6, color: 'hsl(195 100% 50%)', duration: 6 },
  { x: '88%', y: '18%', size: 5, color: 'hsl(155 100% 50%)', duration: 7 },
  { x: '15%', y: '70%', size: 7, color: 'hsl(195 100% 50%)', duration: 8 },
  { x: '78%', y: '75%', size: 5, color: 'hsl(155 100% 50%)', duration: 6.5 },
  { x: '45%', y: '8%', size: 6, color: 'hsl(195 100% 50%)', duration: 7.5 },
  { x: '88%', y: '50%', size: 5, color: 'hsl(195 100% 50%)', duration: 8 },
  { x: '68%', y: '5%', size: 7, color: 'hsl(195 100% 50%)', duration: 6.5 },
  { x: '5%', y: '40%', size: 4, color: 'hsl(155 100% 50%)', duration: 9 },
  { x: '86%', y: '65%', size: 5, color: 'hsl(195 100% 50%)', duration: 7 },
  { x: '25%', y: '25%', size: 4, color: 'hsl(155 100% 50%)', duration: 8.5 },
  { x: '55%', y: '85%', size: 6, color: 'hsl(195 100% 50%)', duration: 6 },
  { x: '35%', y: '55%', size: 4, color: 'hsl(155 100% 50%)', duration: 9.5 },
  { x: '72%', y: '35%', size: 5, color: 'hsl(195 100% 50%)', duration: 7.5 },
  { x: '18%', y: '88%', size: 4, color: 'hsl(155 100% 50%)', duration: 8 },
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

  const dots = useMemo(() => (isLight ? floatingDots.slice(0, 5) : floatingDots), [isLight]);

  // Reactive tilted background cards — shift on CTA hover
  const cardStyle = (base: string) =>
    `absolute bg-slate-800/40 border border-white/10 rounded-lg shadow-2xl backdrop-blur-sm overflow-hidden transition-all duration-700 ease-out ${base}`;

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
                opacity: 0.5,
                animation: `floatDot${i % 3} ${dot.duration}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* Tilted decorative cards — react to CTA hover */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={cardStyle('top-[15%] left-[6%] md:left-[10%] w-32 md:w-48 h-44 md:h-64 -rotate-12')}
            style={{ transform: ctaHover ? 'rotate(-6deg) translateY(-8px)' : undefined }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[hsl(195_100%_50%/0.25)] to-transparent" />
          </div>
          <div
            className={cardStyle('bottom-[8%] right-[6%] md:right-[12%] w-36 md:w-56 h-48 md:h-72 rotate-6')}
            style={{ transform: ctaHover ? 'rotate(12deg) translateY(8px)' : undefined }}
          >
            <div className="w-full h-full bg-gradient-to-tr from-[hsl(155_100%_50%/0.18)] to-transparent" />
          </div>
          <div
            className={cardStyle('top-[18%] right-[14%] w-28 md:w-40 h-36 md:h-52 rotate-12 hidden md:block')}
            style={{ transform: ctaHover ? 'rotate(15deg) translateX(8px)' : undefined }}
          >
            <div className="w-full h-full bg-gradient-to-bl from-[hsl(195_100%_55%/0.18)] to-transparent" />
          </div>

          {/* Floating UI icons */}
          <div
            className="absolute top-[34%] right-[20%] text-white/20 hidden md:block transition-all duration-700 ease-out"
            style={{
              transform: ctaHover
                ? 'translate(-16px,-32px) rotate(0deg)'
                : 'rotate(-12deg)',
              color: ctaHover ? 'hsl(0 0% 100% / 0.45)' : undefined,
            }}
          >
            <svg width="40" height="60" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8h8V0H8Z" fill="currentColor" />
              <path d="M24 0c-4.42 0-8 3.58-8 8v8h8c4.42 0 8-3.58 8-8s-3.58-8-8-8Z" fill="currentColor" />
              <path d="M8 16c-4.42 0-8 3.58-8 8s3.58 8 8 8h8V16H8Z" fill="currentColor" />
              <path d="M8 32c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8v-8H8Z" fill="currentColor" />
              <path d="M24 16c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8Z" fill="currentColor" />
            </svg>
          </div>

          <div
            className="absolute bottom-[28%] left-[16%] text-[hsl(155_100%_50%/0.35)] hidden md:block transition-all duration-700 ease-out"
            style={{
              transform: ctaHover
                ? 'translate(32px,24px) rotate(0deg)'
                : 'rotate(12deg)',
              color: ctaHover ? 'hsl(155 100% 50% / 0.55)' : undefined,
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>

          <div
            className="absolute top-[10%] left-[28%] text-[hsl(195_100%_50%/0.22)] hidden md:block transition-all duration-1000 ease-out"
            style={{
              transform: ctaHover ? 'translate(-48px,16px)' : 'rotate(-6deg)',
              color: ctaHover ? 'hsl(195 100% 50% / 0.45)' : undefined,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 16 4-4-4-4" />
              <path d="m6 8-4 4 4 4" />
              <path d="m14.5 4-5 16" />
            </svg>
          </div>
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
