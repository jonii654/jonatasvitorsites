import { motion } from 'framer-motion';
import { Notebook3DShowcase } from './effects/Notebook3DShowcase';

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
        <Notebook3DShowcase />
      </div>
    </section>
  );
}
