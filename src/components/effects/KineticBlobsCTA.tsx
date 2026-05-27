import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeviceTier } from '@/hooks/use-device-tier';
import { useAnalytics } from '@/hooks/use-analytics';

interface KineticBlobsCTAProps {
  whatsappLink: string;
}

/**
 * Final CTA inspired by Sonneto: GIANT kinetic headline + organic morphing blobs.
 * Light devices get static blobs.
 */
export function KineticBlobsCTA({ whatsappLink }: KineticBlobsCTAProps) {
  const tier = useDeviceTier();
  const animate = tier === 'full';
  const { trackCtaClick } = useAnalytics();

  return (
    <section
      id="orcamento"
      className="relative overflow-hidden py-24 md:py-40 bg-hero-gradient"
    >
      <div className="absolute inset-0 hex-pattern opacity-10 pointer-events-none" />

      {/* Organic blobs */}
      <Blob
        animate={animate}
        className="absolute top-[10%] left-[8%] w-[42vw] max-w-[460px] aspect-square"
        color="hsl(155 100% 50% / 0.55)"
        delay={0}
      />
      <Blob
        animate={animate}
        className="absolute bottom-[8%] right-[6%] w-[36vw] max-w-[400px] aspect-square"
        color="hsl(195 100% 55% / 0.55)"
        delay={2}
      />
      <Blob
        animate={animate}
        className="absolute top-[35%] right-[20%] w-[18vw] max-w-[200px] aspect-square hidden md:block"
        color="hsl(155 100% 55% / 0.45)"
        delay={4}
      />

      {/* Kinetic giant headline */}
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-black leading-[0.85] tracking-tight uppercase mix-blend-screen"
          style={{
            fontSize: 'clamp(3.5rem, 14vw, 12rem)',
            color: 'hsl(0 0% 100%)',
            letterSpacing: '-0.04em',
          }}
        >
          <span className="block">BORA</span>
          <span
            className="block"
            style={{
              background: 'linear-gradient(135deg, hsl(195 100% 60%), hsl(155 100% 55%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            COMEÇAR?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mt-8 mb-10"
        >
          Vamos conversar sobre seu projeto. Primeira consulta é gratuita.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative inline-block"
        >
          {animate && (
            <motion.div
              aria-hidden
              className="absolute inset-0 blur-2xl rounded-full bg-primary/40"
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
          )}

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick({ location: 'cta_section', label: 'Falar no WhatsApp' })}
            className="btn-lemon font-display text-base md:text-lg"
          >
            <span className="uppercase tracking-widest">Falar no WhatsApp</span>
            <span className="lemon-circle">
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>

        </motion.div>

        <p className="text-sm text-muted-foreground mt-6">
          Vem criar sua presença digital
        </p>
      </div>
    </section>
  );
}

function Blob({
  className,
  color,
  animate,
  delay,
}: {
  className?: string;
  color: string;
  animate: boolean;
  delay: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={className}
      style={{
        background: color,
        filter: 'blur(4px)',
        mixBlendMode: 'screen',
        borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
      }}
      animate={
        animate
          ? {
              borderRadius: [
                '60% 40% 55% 45% / 50% 60% 40% 50%',
                '40% 60% 45% 55% / 60% 40% 60% 40%',
                '55% 45% 60% 40% / 45% 55% 50% 60%',
                '60% 40% 55% 45% / 50% 60% 40% 50%',
              ],
              rotate: [0, 25, -15, 0],
              scale: [1, 1.08, 0.96, 1],
            }
          : undefined
      }
      transition={{
        duration: 14,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}
