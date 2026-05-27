import { useState, useEffect } from 'react';
import { Menu, MessageCircle } from 'lucide-react';
import { RippleMenu } from './effects/RippleMenu';
import { useAnalytics } from '@/hooks/use-analytics';

const WHATSAPP_NUMBER = "551931990107";

const navItems = [
  { label: 'Início', href: '#top' },
  { label: 'Design', href: '#design' },
  { label: 'Quem Sou Eu', href: '#sobre' },
  { label: 'Como Funciona', href: '#servicos' },
  { label: 'Trabalhos', href: '#portfolio' },
  { label: 'Contato', href: '#contato' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { trackCtaClick } = useAnalytics();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de saber mais sobre criação de sites.`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 header-transition ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16 md:h-20">
            <a href="#" className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-foreground">
                Jônatas Vitor
              </span>
              <span className="hidden sm:inline text-sm md:text-base text-muted-foreground">
                — Criador de Sites
              </span>
            </a>

            <div className="flex items-center gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCtaClick({ location: 'header', label: 'WhatsApp' })}
                className="hidden md:inline-flex btn-lemon text-xs"
              >
                <span className="uppercase tracking-widest text-[10px]">WhatsApp</span>
                <span className="lemon-circle">
                  <MessageCircle className="w-4 h-4" />
                </span>
              </a>

              {/* Menu trigger — visível em todos breakpoints; origem do ripple */}
              <button
                aria-label="Abrir menu"
                className="p-2 text-foreground z-[60] rounded-full border border-foreground/15 bg-foreground/5 hover:bg-foreground/10 transition-colors"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <RippleMenu
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        items={navItems}
        whatsappLink={whatsappLink}
      />
    </>
  );
}
