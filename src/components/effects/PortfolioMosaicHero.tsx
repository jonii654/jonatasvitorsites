import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useDeviceTier } from '@/hooks/use-device-tier';
import portfolioVivendo from '@/assets/portfolio-vivendo.webp';
import portfolioVinidigital from '@/assets/portfolio-vinidigital.webp';
import portfolioClinica from '@/assets/portfolio-clinicaiphone.webp';
import portfolioBeatriz from '@/assets/portfolio-beatriz.webp';

const tiles = [
  { src: portfolioVivendo, span: 'col-span-2 row-span-2', y: [-40, 40] as [number, number] },
  { src: portfolioVinidigital, span: 'col-span-1 row-span-1', y: [40, -40] as [number, number] },
  { src: portfolioClinica, span: 'col-span-1 row-span-2', y: [-20, 20] as [number, number] },
  { src: portfolioBeatriz, span: 'col-span-1 row-span-1', y: [30, -30] as [number, number] },
];

/**
 * v8 - Moss/Webflow style: GIANT typography + photo mosaic surrounding it.
 */
export function PortfolioMosaicHero() {
  const tier = useDeviceTier();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={ref} className="relative overflow-hidden py-10 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="section-label">Portfólio</span>
        </div>

        {tier === 'light' ? (
          <>
            <h2
              className="font-black leading-[0.85] tracking-tight uppercase text-center gradient-text px-2"
              style={{ fontSize: 'clamp(2.5rem, 13vw, 6rem)', letterSpacing: '-0.05em', wordBreak: 'keep-all' }}
            >
              Trabalhos
            </h2>
            <div className="grid grid-cols-2 gap-3 mt-8 max-w-md mx-auto">
              {tiles.map((t, i) => (
                <img
                  key={i}
                  src={t.src}
                  alt=""
                  className="w-full aspect-[4/3] object-cover rounded-xl border border-border/40"
                  loading="lazy"
                />
              ))}
            </div>
          </>
        ) : (
          <div className="relative max-w-6xl mx-auto">
            {/* Background mosaic with parallax */}
            <div className="grid grid-cols-4 grid-rows-2 gap-4 md:gap-6 absolute inset-0 -z-0">
              {tiles.map((t, i) => (
                <ParallaxTile key={i} tile={t} progress={scrollYProgress} />
              ))}
            </div>

            {/* Giant title in foreground */}
            <div className="relative z-10 flex items-center justify-center min-h-[400px] md:min-h-[520px] pointer-events-none px-4">
              <motion.h2
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-black leading-[0.8] tracking-tight uppercase text-center"
                style={{
                  fontSize: 'clamp(4rem, 15vw, 14rem)',
                  letterSpacing: '-0.06em',
                  background: 'linear-gradient(135deg, hsl(195 100% 60%), hsl(155 100% 55%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 30px 60px hsl(0 0% 0% / 0.5)',
                  wordBreak: 'keep-all',
                }}
              >
                TRABALHOS
              </motion.h2>
            </div>
          </div>
        )}

        <p className="text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
          Exemplos do que entrego: sites institucionais, landing pages e marcas pessoais.
        </p>
      </div>
    </div>
  );
}

function ParallaxTile({
  tile,
  progress,
}: {
  tile: (typeof tiles)[number];
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const y = useTransform(progress, [0, 1], tile.y);
  return (
    <motion.div
      style={{ y }}
      className={`relative overflow-hidden rounded-2xl border border-border/30 opacity-40 ${tile.span}`}
    >
      <img src={tile.src} alt="" className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-background/40" />
    </motion.div>
  );
}
