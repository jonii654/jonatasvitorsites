import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  whatsappLink: string;
}

/**
 * Mobile fullscreen menu with circular clip-path reveal + giant kinetic links.
 */
export function FullscreenMenu({ open, onClose, items, whatsappLink }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="fullscreen-menu"
          initial={{ clipPath: 'circle(0% at calc(100% - 36px) 36px)' }}
          animate={{ clipPath: 'circle(150% at calc(100% - 36px) 36px)' }}
          exit={{ clipPath: 'circle(0% at calc(100% - 36px) 36px)' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[70] md:hidden"
          style={{
            background:
              'radial-gradient(circle at 80% 20%, hsl(195 100% 50% / 0.18), transparent 60%), hsl(220 50% 6%)',
          }}
        >
          {/* Close button */}
          <button
            aria-label="Fechar menu"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-foreground z-[71]"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Links */}
          <nav className="h-full flex flex-col justify-center px-6 gap-1">
            {items.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={onClose}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="block py-3 font-black uppercase leading-[0.95] tracking-tight text-foreground hover:text-primary transition-colors"
                style={{ fontSize: 'clamp(2.5rem, 11vw, 5rem)', letterSpacing: '-0.03em' }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* WhatsApp CTA */}
          <motion.a
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="absolute bottom-8 left-6 right-6 flex items-center justify-center gap-2 py-4 rounded-2xl btn-cta btn-ripple font-semibold"
          >
            <MessageCircle className="w-5 h-5" />
            Falar no WhatsApp
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
