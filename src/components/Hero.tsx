import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef, useMemo, useState } from 'react';
import { useDeviceTier } from '@/hooks/use-device-tier';
import { useAnalytics } from '@/hooks/use-analytics';
import heroRef1 from '@/assets/hero-ref-1-shopify.jpg';
import heroRef2 from '@/assets/hero-ref-2-cleo.jpg';
import heroRef3 from '@/assets/hero-ref-3-igloo.jpg';
import heroRef4 from '@/assets/hero-ref-4-buttermax.jpg';

const WHATSAPP_NUMBER = "551931990107";

// Ambient floating dots — denser ("poeira estelar" + glow dots)
const floatingDots = [
  { x: '8%', y: '12%', size: 6, color: 'hsl(195 100% 50%)', duration: 6, opacity: 0.65 },
  { x: '88%', y: '18%', size: 5, color: 'hsl(155 100% 50%)', duration: 7, opacity: 0.6 },
  { x: '15%', y: '70%', size: 7, color: 'hsl(195 100% 50%)', duration: 8, opacity: 0.7 },
  { x: '78%', y: '75%', size: 5, color: 'hsl(155 100% 50%)', duration: 6.5, opacity: 0.6 },
  { x: '45%', y: '8%', size: 6, color: 'hsl(195 100% 50%)', duration: 7.5, opacity: 0.65 },
  { x: '88%', y: '50%', size: 5, color: 'hsl(195 100% 50%)', duration: 8, opacity: 0.6 },
  { x: '68%', y: '5%', size: 7, color: 'hsl(195 100% 50%)', duration: 6.5, opacity: 0.7 },
  { x: '5%', y: '40%', size: 4, color: 'hsl(155 100% 50%)', duration: 9, opacity: 0.55 },
  { x: '86%', y: '65%', size: 5, color: 'hsl(195 100% 50%)', duration: 7, opacity: 0.6 },
  { x: '25%', y: '25%', size: 4, color: 'hsl(155 100% 50%)', duration: 8.5, opacity: 0.55 },
  { x: '55%', y: '85%', size: 6, color: 'hsl(195 100% 50%)', duration: 6, opacity: 0.65 },
  { x: '35%', y: '55%', size: 4, color: 'hsl(155 100% 50%)', duration: 9.5, opacity: 0.5 },
  { x: '72%', y: '35%', size: 5, color: 'hsl(195 100% 50%)', duration: 7.5, opacity: 0.6 },
  { x: '18%', y: '88%', size: 4, color: 'hsl(155 100% 50%)', duration: 8, opacity: 0.55 },
  { x: '50%', y: '45%', size: 8, color: 'hsl(195 100% 55%)', duration: 7, opacity: 0.7 },
  { x: '62%', y: '62%', size: 6, color: 'hsl(155 100% 50%)', duration: 8, opacity: 0.6 },
  { x: '40%', y: '32%', size: 5, color: 'hsl(195 100% 50%)', duration: 9, opacity: 0.6 },
  { x: '12%', y: '55%', size: 5, color: 'hsl(155 100% 50%)', duration: 7, opacity: 0.6 },
  // Extras
  { x: '28%', y: '15%', size: 6, color: 'hsl(155 100% 55%)', duration: 6.8, opacity: 0.6 },
  { x: '74%', y: '22%', size: 5, color: 'hsl(195 100% 55%)', duration: 7.3, opacity: 0.55 },
  { x: '10%', y: '82%', size: 6, color: 'hsl(155 100% 50%)', duration: 8.2, opacity: 0.6 },
  { x: '92%', y: '40%', size: 5, color: 'hsl(195 100% 50%)', duration: 6.7, opacity: 0.55 },
  { x: '38%', y: '92%', size: 6, color: 'hsl(195 100% 55%)', duration: 7.6, opacity: 0.6 },
  { x: '60%', y: '28%', size: 5, color: 'hsl(155 100% 50%)', duration: 8.4, opacity: 0.55 },
  { x: '80%', y: '88%', size: 6, color: 'hsl(155 100% 55%)', duration: 6.4, opacity: 0.6 },
  // Stellar dust
  { x: '22%', y: '38%', size: 2, color: 'hsl(0 0% 100%)', duration: 12, opacity: 0.3 },
  { x: '58%', y: '18%', size: 2, color: 'hsl(0 0% 100%)', duration: 14, opacity: 0.25 },
  { x: '82%', y: '32%', size: 3, color: 'hsl(0 0% 100%)', duration: 13, opacity: 0.3 },
  { x: '30%', y: '78%', size: 2, color: 'hsl(0 0% 100%)', duration: 15, opacity: 0.27 },
  { x: '65%', y: '92%', size: 2, color: 'hsl(0 0% 100%)', duration: 11, opacity: 0.25 },
  { x: '92%', y: '88%', size: 3, color: 'hsl(0 0% 100%)', duration: 14, opacity: 0.3 },
  { x: '6%', y: '24%', size: 2, color: 'hsl(0 0% 100%)', duration: 13, opacity: 0.27 },
  { x: '48%', y: '70%', size: 3, color: 'hsl(0 0% 100%)', duration: 12, opacity: 0.3 },
];

// 4 cards — cantos, pequenos no mobile, como fundo 3D intocável
const cornerCards = [
  {
    pos: 'top-[3%] left-[2%] md:left-[3%]',
    size: 'w-20 h-28 md:w-64 md:h-80',
    floatY: [0, -10, 0],
    img: heroRef1,
    accent: 'hsl(195 100% 50%)',
    alt: 'Referência de design — editorial premium',
  },
  {
    pos: 'top-[3%] right-[2%] md:right-[3%]',
    size: 'w-20 h-28 md:w-64 md:h-80',
    floatY: [0, -8, 0],
    img: heroRef2,
    accent: 'hsl(75 100% 60%)',
    alt: 'Referência de design — mobile app',
  },
  {
    pos: 'bottom-[3%] left-[2%] md:left-[3%]',
    size: 'w-20 h-28 md:w-64 md:h-80',
    floatY: [0, 9, 0],
    img: heroRef3,
    accent: 'hsl(155 100% 50%)',
    alt: 'Referência de design — cinemático',
  },
  {
    pos: 'bottom-[3%] right-[2%] md:right-[3%]',
    size: 'w-20 h-28 md:w-64 md:h-80',
    floatY: [0, 11, 0],
    img: heroRef4,
    accent: 'hsl(75 100% 60%)',
    alt: 'Referência de design — bold colorblock',
  },
];

export function Hero() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero saber mais sobre criação de sites.`;
  const sectionRef = useRef<HTMLElement>(null);
  const tier = useDeviceTier();
  const isLight = tier === 'light';
  const { trackCtaClick } = useAnalytics();
  const [ctaHover, setCtaHover] = useState(false);
  const [ctaBurst, setCtaBurst] = useState(false);

  const triggerBurst = () => {
    setCtaBurst(true);
    window.setTimeout(() => setCtaBurst(false), 700);
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, isLight ? -40 : -120]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, isLight ? -15 : -50]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  const dots = useMemo(
    () => (isLight ? floatingDots.slice(0, 12) : floatingDots),
    [isLight],
  );

  // Desktop-only mouse interactivity
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.4 });

  // Cursor spotlight position (percent)
  const spotX = useTransform(smoothX, (v) => `${v * 100}%`);
  const spotY = useTransform(smoothY, (v) => `${v * 100}%`);
  const spotlightBg = useMotionTemplate`radial-gradient(360px circle at ${spotX} ${spotY}, hsl(195 100% 55% / 0.18), hsl(155 100% 50% / 0.08) 35%, transparent 65%)`;

  // Tilt for cards (per index)
  const rx = useTransform(smoothY, [0, 1], [8, -8]);
  const ry = useTransform(smoothX, [0, 1], [-8, 8]);

  // Text counter-parallax
  const textPX = useTransform(smoothX, [0, 1], [10, -10]);
  const textPY = useTransform(smoothY, [0, 1], [8, -8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isLight) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[150vh] overflow-hidden"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <motion.div style={{ y: layer1Y }} className="absolute inset-0 bg-hero-gradient" />
        <motion.div style={{ y: layer1Y }} className="absolute inset-0 hex-pattern opacity-5" />

        {/* Subtle radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'hsl(195 100% 50% / 0.05)', filter: 'blur(120px)' }}
        />

        {/* Desktop only: ambient orbs */}
        {!isLight && (
          <>
            <div
              className="floating-orb floating-orb-cyan pointer-events-none"
              style={{ width: 380, height: 380, top: '15%', left: '20%' }}
            />
            <div
              className="floating-orb floating-orb-green pointer-events-none"
              style={{ width: 420, height: 420, top: '50%', right: '15%', animationDelay: '2s' }}
            />
            <div
              className="floating-orb floating-orb-cyan pointer-events-none"
              style={{ width: 320, height: 320, bottom: '10%', left: '40%', animationDelay: '4s' }}
            />
          </>
        )}

        {/* Desktop only: cursor spotlight */}
        {!isLight && (
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{
              background: spotlightBg,
              mixBlendMode: 'screen',
            }}
          />
        )}

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
                boxShadow: `0 0 ${dot.size * 3}px ${dot.color}, 0 0 ${dot.size * 6}px ${dot.color}`,
                opacity: dot.opacity,
                animation: `floatDot${i % 3} ${dot.duration}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* 4 cards flutuantes — vitrine de sites */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={!isLight ? { perspective: '1200px' } : undefined}
        >
          {cornerCards.map((c, i) => (
            <motion.div
              key={i}
              className={`absolute ${c.pos} ${c.size} rounded-xl shadow-2xl overflow-hidden border`}
              style={{
                borderColor: c.accent.replace(')', ' / 0.4)'),
                boxShadow: `0 18px 50px hsl(220 50% 4% / 0.65), 0 0 48px ${c.accent.replace(')', ' / 0.3)')}`,
                rotateX: isLight ? 0 : rx,
                rotateY: isLight ? 0 : ry,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
              animate={{ y: c.floatY }}
              transition={{
                duration: 6 + i * 0.7,
                repeat: Infinity,
                ease: 'easeInOut',
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
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <motion.div
          style={{
            y: layer3Y,
            opacity: textOpacity,
            scale: textScale,
            x: isLight ? 0 : textPX,
            translateY: isLight ? undefined : textPY,
          }}
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
              <span
                className="block"
                style={{
                  textShadow:
                    '0 1px 0 hsl(220 50% 14%), 0 2px 0 hsl(220 50% 12%), 0 3px 0 hsl(220 50% 10%), 0 4px 0 hsl(220 50% 8%), 0 5px 0 hsl(220 50% 6%), 0 6px 0 hsl(220 50% 4%), 0 10px 24px hsl(220 50% 0% / 0.75), 0 0 50px hsl(195 100% 50% / 0.4)',
                }}
              >
                Crio
              </span>
              <span className="block flex items-center justify-center gap-6 md:gap-16">
                <span
                  className="font-display not-italic font-light text-3xl md:text-5xl lg:text-6xl tracking-[0.2em] text-white/70 uppercase translate-y-1 md:translate-y-2"
                  style={{
                    textShadow:
                      '0 2px 6px hsl(220 50% 0% / 0.8), 0 0 24px hsl(0 0% 100% / 0.25), 0 0 40px hsl(195 100% 55% / 0.2)',
                  }}
                >
                  sites
                </span>
                <span
                  className="text-[hsl(195_100%_55%)]"
                  style={{
                    textShadow:
                      '0 2px 0 hsl(195 100% 25%), 0 4px 0 hsl(195 100% 18%), 0 6px 18px hsl(220 50% 0% / 0.7), 0 0 40px hsl(195 100% 55% / 0.6)',
                  }}
                >
                  que
                </span>
              </span>
              <span
                className="block text-neon-gradient"
                style={{
                  textShadow:
                    '0 6px 18px hsl(220 50% 0% / 0.7), 0 10px 26px hsl(220 50% 0% / 0.55)',
                }}
              >
                Vendem
              </span>
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
                onClick={() => {
                  triggerBurst();
                  trackCtaClick({ location: 'hero', label: 'Quero meu site' });
                }}
                className={`btn-lemon font-display text-sm md:text-base ${ctaBurst ? 'cta-burst' : ''}`}
              >
                <span className="uppercase tracking-widest">Quero meu site</span>
                <span className="lemon-circle">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>

              <a
                href="#portfolio"
                className="btn-gumroad font-display text-sm md:text-base"
              >
                Ver portfólio
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
