import { motion } from 'framer-motion';
import photo1 from '@/assets/jonatas-photo-1.jpg';
import { StickerAvatar } from './effects/StickerAvatar';
import { WordRevealText } from './effects/WordRevealText';

export function AboutMe() {
  return (
    <section
      id="sobre"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center">

            {/* v6 - Sticker avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="order-1 md:order-1"
            >
              <StickerAvatar
                src={photo1}
                alt="Jônatas Vitor - Criador de Sites"
                name="Jônatas Vitor"
                role="Criador de Sites"
              />
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-2 text-center md:text-left"
            >
              <span className="section-label">Sobre mim</span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Prazer, sou o{' '}
                <span className="gradient-text">Jônatas</span>
              </h2>

              {/* v5 - Word-by-word reveal */}
              <div className="space-y-4 text-base md:text-lg leading-relaxed">
                <WordRevealText
                  text="Tenho 21 anos e sou especialista em criar landing pages que realmente convertem."
                  className="block"
                />
                <WordRevealText
                  text="Minha missão é te ajudar a ter uma presença digital profissional que transmite credibilidade e gera resultados."
                  className="block"
                />
                <WordRevealText
                  text="Cada projeto que desenvolvo é pensado estrategicamente para atrair, engajar e converter seus visitantes em clientes."
                  className="block"
                />
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8 grid grid-cols-2 gap-4"
              >
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold gradient-text">7</p>
                  <p className="text-xs text-muted-foreground">Dias de entrega</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold gradient-text">100%</p>
                  <p className="text-xs text-muted-foreground">Dedicação</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
