import { motion } from 'framer-motion';

export function ModelViewer3D() {
  return (
    <section className="relative py-8 md:py-16">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl font-semibold text-muted-foreground mb-6 tracking-wide uppercase"
          style={{ letterSpacing: '0.15em' }}
        >
          Explore em 3D
        </motion.h3>
        <div className="w-full rounded-2xl overflow-hidden" style={{ maxWidth: 800, height: 550 }}>
          <iframe
            title="Asus NoteBook"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src="https://sketchfab.com/models/acde12c15de34befbe4dc0fd32489ab8/embed?autospin=1&preload=1&dnt=1&ui_theme=dark&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&ui_vr=0"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </section>
  );
}
