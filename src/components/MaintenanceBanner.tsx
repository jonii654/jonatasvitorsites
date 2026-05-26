import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function MaintenanceBanner() {
  const [open, setOpen] = useState(true);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-0 z-[100] w-full border-b border-yellow-400/30 bg-yellow-400/10 backdrop-blur-md"
        >
          <div className="container mx-auto flex items-center justify-center gap-2 px-4 py-2 relative">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
            </span>
            <p className="text-[11px] md:text-xs font-medium text-yellow-200 text-center">
              🛠️ Site em manutenção — pode apresentar pequenos bugs enquanto melhoramos a experiência.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar aviso de manutenção"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-200/80 hover:text-yellow-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
