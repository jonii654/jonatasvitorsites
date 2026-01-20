import { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = "551931990107";

const navItems = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'FAQ', href: '#faq' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground z-[60]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-[55] md:hidden drawer-overlay-transition ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Drawer Menu - Slides from right */}
      <div
        className={`fixed top-0 right-0 h-full w-[75%] max-w-[300px] z-[60] md:hidden drawer-menu-transition ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'hsl(220 50% 10% / 0.95)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid hsl(195 100% 50% / 0.15)',
          boxShadow: '-10px 0 40px hsl(220 50% 8% / 0.8)'
        }}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-8">
          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className="text-lg font-medium text-foreground/90 py-3 px-4 rounded-xl hover:bg-primary/10 hover:text-primary active:scale-95 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(20px)',
                  transition: 'opacity 0.3s ease-out, transform 0.3s ease-out, background 0.2s'
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* CTA Button */}
          <div
            style={{
              transitionDelay: isMobileMenuOpen ? '200ms' : '0ms',
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
            }}
          >
            <Button
              asChild
              size="lg"
              className="btn-cta w-full"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </Button>
          </div>

          {/* Decorative glow */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, hsl(195 100% 50% / 0.05), transparent)'
            }}
          />
        </div>
      </div>
    </>
  );
}
