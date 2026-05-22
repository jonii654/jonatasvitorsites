import { useState, useEffect } from 'react';
import { Menu, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FullscreenMenu } from './effects/FullscreenMenu';
import { useAnalytics } from '@/hooks/use-analytics';

const WHATSAPP_NUMBER = "551931990107";

const navItems = [
  { label: 'Quem Sou Eu', href: '#sobre' },
  { label: 'Benefícios', href: '#beneficios' },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Perguntas', href: '#faq' },
  { label: 'Orçamento', href: '#orcamento' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { trackCtaClick } = useAnalytics();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // (body scroll lock handled inside FullscreenMenu)

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
            {/* Logo */}
            <a href="#" className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-foreground">
                Jônatas Vitor
              </span>
              <span className="text-sm md:text-base text-muted-foreground">
                — Criador de Sites
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6 btn-ripple"
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCtaClick({ location: 'header', label: 'WhatsApp' })}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              aria-label="Abrir menu"
              className="md:hidden p-2 text-foreground z-[60]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </nav>
        </div>
      </header>

      <FullscreenMenu
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={navItems}
        whatsappLink={whatsappLink}
      />
    </>
  );
}
