import { motion } from 'framer-motion';
import { Sparkles, Zap, Star } from 'lucide-react';
import { useDeviceTier } from '@/hooks/use-device-tier';

interface StickerAvatarProps {
  src: string;
  alt: string;
  name: string;
  role: string;
}

/**
 * Bold portrait hero with floating typography stickers (Lando Norris-style).
 * On light devices, stickers render statically without float animation.
 */
export function StickerAvatar({ src, alt, name, role }: StickerAvatarProps) {
  const tier = useDeviceTier();
  const animate = tier === 'full';

  return (
    <div className="relative max-w-sm mx-auto">
      {/* Animated neon halo behind portrait */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[28px] -z-10"
        animate={
          animate
            ? {
                boxShadow: [
                  '0 0 40px hsl(195 100% 50% / 0.35), 0 0 80px hsl(155 100% 50% / 0.18)',
                  '0 0 60px hsl(155 100% 50% / 0.45), 0 0 110px hsl(195 100% 50% / 0.25)',
                  '0 0 40px hsl(195 100% 50% / 0.35), 0 0 80px hsl(155 100% 50% / 0.18)',
                ],
              }
            : undefined
        }
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={
          !animate
            ? { boxShadow: '0 0 40px hsl(195 100% 50% / 0.3), 0 0 80px hsl(155 100% 50% / 0.15)' }
            : undefined
        }
      />

      {/* Portrait */}
      <div className="relative p-1 rounded-[28px] bg-gradient-to-br from-primary/60 via-primary/30 to-cyan-light/40">
        <div className="relative overflow-hidden rounded-[24px] aspect-[3/4] bg-card">
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          {/* Name plate */}
          <div className="absolute bottom-4 left-4 right-4 glass-card px-4 py-3">
            <p className="text-lg font-bold text-foreground leading-tight">{name}</p>
            <p className="text-sm text-primary">{role}</p>
          </div>
        </div>
      </div>

      {/* Floating stickers */}
      <Sticker
        animate={animate}
        className="absolute -top-4 -left-6 rotate-[-12deg] bg-primary text-primary-foreground"
        delay={0}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Web Designer</span>
      </Sticker>

      <Sticker
        animate={animate}
        className="absolute -top-2 -right-8 rotate-[8deg] bg-foreground text-background"
        delay={0.4}
      >
        <Zap className="w-3.5 h-3.5" />
        <span>7 dias</span>
      </Sticker>

      <Sticker
        animate={animate}
        className="absolute bottom-20 -left-10 rotate-[6deg] bg-cyan-light text-background hidden sm:flex"
        delay={0.8}
      >
        <Star className="w-3.5 h-3.5 fill-current" />
        <span>21 anos</span>
      </Sticker>

      <Sticker
        animate={animate}
        className="absolute -bottom-3 -right-4 rotate-[-6deg] bg-primary/90 text-primary-foreground"
        delay={1.2}
      >
        <span>Sites que vendem</span>
      </Sticker>
    </div>
  );
}

function Sticker({
  children,
  className,
  animate,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  animate: boolean;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute z-20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg ${className}`}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 220, damping: 14, delay }}
      animate={
        animate
          ? { y: [0, -6, 0], rotate: ['var(--r,0)', 'var(--r,0)'] }
          : undefined
      }
      style={
        animate
          ? {
              animation: `floatSticker ${4 + delay}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
