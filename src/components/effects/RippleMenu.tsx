import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MessageCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAnalytics } from '@/hooks/use-analytics';
import jonatas1 from '@/assets/jonatas-photo-1.jpg';
import jonatas2 from '@/assets/jonatas-photo-2.jpg';
import portfolioVivendo from '@/assets/portfolio-vivendo.png';
import portfolioCsa from '@/assets/portfolio-csa.jpg';

interface NavItem { label: string; href: string; }

interface Props {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  whatsappLink: string;
}

const PHOTOS = [jonatas1, jonatas2, portfolioVivendo, portfolioCsa];

/**
 * Ripple-reveal fullscreen menu (GSAP).
 * Desktop: circular clip-path reveal + lateral photo swap on hover.
 * Mobile: simplified opacity/y reveal (no clip-path for perf).
 */
export function RippleMenu({ open, onClose, items, whatsappLink }: Props) {
  const isMobile = useIsMobile();
  const { trackCtaClick } = useAnalytics();
  const containerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [hoverIdx, setHoverIdx] = useState(0);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(containerRef.current!, {
        autoAlpha: 0,
        pointerEvents: 'none',
        ...(isMobile
          ? { y: -20, clipPath: 'none' }
          : { clipPath: 'circle(0% at calc(100% - 36px) 36px)', y: 0 }),
      });
      gsap.set(linksRef.current.filter(Boolean), { y: 30, autoAlpha: 0 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
      if (isMobile) {
        tl.to(containerRef.current!,
          { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          0
        );
      } else {
        tl.to(containerRef.current!,
          { autoAlpha: 1, clipPath: 'circle(160% at calc(100% - 36px) 36px)', duration: 0.75 },
          0
        );
      }
      tl.to(linksRef.current.filter(Boolean),
        { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out' },
        isMobile ? 0.12 : 0.3
      );
      tl.eventCallback('onReverseComplete', () => {
        if (containerRef.current) {
          gsap.set(containerRef.current, { pointerEvents: 'none' });
        }
      });
      tlRef.current = tl;
    }, containerRef);
    return () => {
      tlRef.current?.kill();
      tlRef.current = null;
      ctx.revert();
    };
  }, [isMobile]);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl || !containerRef.current) return;
    if (open) {
      gsap.set(containerRef.current, { pointerEvents: 'auto' });
      tl.play(0);
    } else {
      tl.reverse();
    }
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[70]"
      style={{
        visibility: 'hidden',
        background:
          'radial-gradient(circle at 80% 20%, hsl(195 100% 50% / 0.16), transparent 60%), hsl(220 50% 6%)',
      }}
      aria-hidden={!open}
    >
      <button
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-8 w-12 h-12 rounded-full bg-foreground/5 border border-foreground/15 text-foreground hover:bg-foreground/10 transition-colors z-[72] flex items-center justify-center"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {!isMobile && (
        <div className="hidden md:block absolute right-10 top-1/2 -translate-y-1/2 w-[28vw] max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden border border-foreground/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          {PHOTOS.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-500 ease-out"
              style={{ opacity: i === hoverIdx ? 1 : 0 }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          ))}
        </div>
      )}

      <nav className="h-full flex flex-col justify-center pl-6 pr-6 md:pl-20 gap-2 md:gap-3 max-w-[60vw]">
        {items.map((item, i) => (
          <a
            key={item.label}
            ref={el => { if (el) linksRef.current[i] = el; }}
            href={item.href}
            onClick={onClose}
            onMouseEnter={() => setHoverIdx(i % PHOTOS.length)}
            className="namma-link font-display font-bold uppercase leading-[0.95] tracking-tight w-fit"
            style={{ fontSize: 'clamp(2.2rem, 7vw, 5.5rem)', letterSpacing: '-0.03em' }}
          >
            <span className="text-foreground/40 text-xs md:text-sm font-mono mr-3 align-top">
              0{i + 1}
            </span>
            {item.label}
          </a>
        ))}
      </nav>

      <a
        ref={el => { if (el) linksRef.current[items.length] = el; }}
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackCtaClick({ location: 'fullscreen_menu', label: 'WhatsApp' });
          onClose();
        }}
        className="btn-lemon absolute bottom-8 left-6 md:bottom-10 md:left-20"
      >
        <span className="uppercase tracking-widest text-xs">Falar no WhatsApp</span>
        <span className="lemon-circle">
          <MessageCircle className="w-4 h-4" />
        </span>
      </a>
    </div>
  );
}
