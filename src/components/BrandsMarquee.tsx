import portfolioCsa from '@/assets/portfolio-csa.jpg';

const BRANDS =
  "Vivendo · ViniDigital · Clínica · Beatriz · CSA · Hadi · KPR · Ascend · Oryzo · Buttermax · Igloo · Cleo · Shopify · ";

/**
 * Faixa de marcas com marquee infinito (duas direções)
 * + moldura central com gradiente neon.
 */
export function BrandsMarquee() {
  return (
    <section
      id="brands"
      className="relative py-20 md:py-28 overflow-hidden border-y border-border/40"
      style={{ background: 'hsl(220 50% 6%)' }}
    >
      {/* Faixa de cima — esquerda */}
      <div className="flex whitespace-nowrap overflow-hidden select-none mb-8 md:mb-12">
        <div className="marquee-track-left flex gap-10 font-display font-black uppercase tracking-widest text-foreground/[0.06]"
             style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
          <span>{BRANDS}{BRANDS}</span>
          <span>{BRANDS}{BRANDS}</span>
        </div>
      </div>

      {/* Moldura central */}
      <div className="max-w-2xl mx-auto px-4 my-6 md:my-10 relative z-10">
        <div className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-foreground/10 bg-card flex items-center justify-center shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(155_100%_50%/0.18)] via-transparent to-[hsl(195_100%_50%/0.18)] pointer-events-none" />
          <img
            src={portfolioCsa}
            alt="Marcas e Projetos"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
          />
          <div className="relative z-10 text-center px-6">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-neon-gradient">
              Studio Exclusive
            </span>
            <h3 className="font-display text-2xl md:text-4xl font-black mt-3 text-foreground">
              Marcas e Projetos
            </h3>
            <p className="text-muted-foreground text-xs md:text-sm max-w-md mx-auto mt-2 font-light">
              Soluções digitais impecáveis desenvolvidas para dominar a percepção de mercado.
            </p>
          </div>
        </div>
      </div>

      {/* Faixa de baixo — direita */}
      <div className="flex whitespace-nowrap overflow-hidden select-none mt-8 md:mt-12">
        <div className="marquee-track-right flex gap-10 font-display font-black uppercase tracking-widest text-foreground/[0.06]"
             style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
          <span>{BRANDS}{BRANDS}</span>
          <span>{BRANDS}{BRANDS}</span>
        </div>
      </div>
    </section>
  );
}
