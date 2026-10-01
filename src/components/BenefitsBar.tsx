import { CheckCircle2 } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDeviceTier } from '@/hooks/use-device-tier';

const benefits = [
  { icon: 'primary', text: 'Design Premium' },
  { icon: 'green', text: 'Entrega em até 7 dias' },
  { icon: 'primary', text: 'Suporte incluído' }
];

export function BenefitsBar() {
  const tier = useDeviceTier();
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const arrowRefs = useRef<SVGPathElement[]>([]);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(itemRefs.current, {
        opacity: 0,
        y: tier === 'light' ? 14 : 24,
        duration: 0.55,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true,
        },
      });

      arrowRefs.current.forEach((path, index) => {
        gsap.fromTo(
          path,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: path,
              start: `top ${78 - index * 4}%`,
              end: `top ${58 - index * 4}%`,
              scrub: tier === 'light' ? 0.35 : 0.65,
            },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [tier]);

  return (
    <div className="py-20 md:py-28" ref={sectionRef}>
      <div className="container mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex max-w-6xl mx-auto justify-center items-center gap-0">
          {benefits.map((item, i) => (
            <div key={i} className="flex items-center">
              {i > 0 && (
                <svg className="mx-3 h-8 w-16 lg:mx-5 lg:w-20 overflow-visible flex-none" viewBox="0 0 84 24" fill="none" aria-hidden>
                  <path d="M2 12H82M72 3L82 12L72 21" className="stroke-primary/15" strokeWidth="2" />
                  <path
                    ref={el => { if (el) arrowRefs.current[i - 1] = el; }}
                    d="M2 12H82M72 3L82 12L72 21"
                    className="stroke-primary"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength="1"
                    style={{ filter: 'drop-shadow(0 0 7px hsl(var(--primary) / 0.8))' }}
                  />
                </svg>
              )}

              <div
                ref={el => { if (el) itemRefs.current[i] = el; }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <CheckCircle2
                    className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 relative z-10"
                    style={{
                      color: item.icon === 'green' ? 'hsl(155 100% 50%)' : 'hsl(195 100% 50%)',
                      filter: `drop-shadow(0 0 8px ${item.icon === 'green' ? 'hsl(155 100% 50% / 0.5)' : 'hsl(195 100% 50% / 0.5)'})`
                    }}
                  />
                </div>

                <span
                  className="text-xl lg:text-2xl font-bold text-foreground whitespace-nowrap"
                >
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col items-center">
          {benefits.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              {i > 0 && (
                <svg className="my-3 h-16 w-8 overflow-visible" viewBox="0 0 24 84" fill="none" aria-hidden>
                  <path d="M12 2V82M3 72L12 82L21 72" className="stroke-primary/15" strokeWidth="2" />
                  <path
                    ref={el => { if (el) arrowRefs.current[i + 1] = el; }}
                    d="M12 2V82M3 72L12 82L21 72"
                    className="stroke-primary"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength="1"
                    style={{ filter: 'drop-shadow(0 0 7px hsl(var(--primary) / 0.8))' }}
                  />
                </svg>
              )}

              <div
                ref={el => { if (el) itemRefs.current[i + benefits.length] = el; }}
                className="flex items-center gap-3 py-2"
              >
                <div className="relative">
                  <CheckCircle2
                    className="w-7 h-7 flex-shrink-0 relative z-10"
                    style={{
                      color: item.icon === 'green' ? 'hsl(155 100% 50%)' : 'hsl(195 100% 50%)',
                      filter: `drop-shadow(0 0 8px ${item.icon === 'green' ? 'hsl(155 100% 50% / 0.5)' : 'hsl(195 100% 50% / 0.5)'})`
                    }}
                  />
                </div>

                <span
                  className="text-lg font-bold text-foreground whitespace-nowrap"
                >
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
