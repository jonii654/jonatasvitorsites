import { MessageCircle, Instagram, Linkedin, Mail } from 'lucide-react';

const WHATSAPP_NUMBER = "5511999999999";

const socialLinks = [
  { icon: MessageCircle, href: `https://wa.me/${WHATSAPP_NUMBER}`, label: 'WhatsApp' },
  { icon: Instagram, href: 'https://instagram.com/', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:contato@jonatas.dev', label: 'Email' },
];

const footerLinks = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'FAQ', href: '#faq' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <a href="#" className="text-xl font-bold text-foreground">
              Jonatas <span className="text-muted-foreground font-normal">— Criador de Sites</span>
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              © {currentYear} Todos os direitos reservados.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
