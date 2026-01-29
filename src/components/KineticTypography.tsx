import { useEffect, useRef, memo } from 'react';

interface Word {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  layer: number; // 0 = back, 1 = mid, 2 = front
}

const techWords = [
  'LANDING PAGE', 'DESIGN', 'UI/UX', 'CÓDIGO', 'PERFORMANCE',
  'CONVERSÃO', 'RESPONSIVO', 'MODERNO', 'RÁPIDO', 'SEO',
  'TAILWIND', 'REACT', 'WEB', 'MOBILE', 'DIGITAL',
  'INOVAÇÃO', 'FUTURO', 'TECNOLOGIA', 'VELOCIDADE', 'OTIMIZADO',
  'CLEAN', 'MINIMALISTA', 'PREMIUM', 'PROFISSIONAL', 'IMPACTO',
  'RESULTADOS', 'CRESCIMENTO', 'ESTRATÉGIA', 'SUCESSO', 'QUALIDADE'
];

// Layer configuration for parallax effect
const layerConfig = [
  { speedMultiplier: 0.3, opacityRange: [0.08, 0.15], sizeRange: [12, 16] },  // Back layer
  { speedMultiplier: 0.6, opacityRange: [0.12, 0.22], sizeRange: [16, 22] },  // Mid layer
  { speedMultiplier: 1.0, opacityRange: [0.18, 0.30], sizeRange: [22, 32] },  // Front layer
];

function KineticTypographyComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const wordsRef = useRef<Word[]>([]);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      // Reinitialize words on resize
      initWords();
    };

    const initWords = () => {
      const wordCount = Math.min(Math.floor((width * height) / 25000), 40);
      wordsRef.current = [];

      for (let i = 0; i < wordCount; i++) {
        const layer = Math.floor(Math.random() * 3);
        const config = layerConfig[layer];
        
        // Random direction: 0 = right, 1 = left, 2 = down, 3 = up, 4-7 = diagonals
        const direction = Math.floor(Math.random() * 8);
        const baseSpeed = (0.3 + Math.random() * 0.5) * config.speedMultiplier;
        
        let vx = 0, vy = 0;
        switch (direction) {
          case 0: vx = baseSpeed; break;
          case 1: vx = -baseSpeed; break;
          case 2: vy = baseSpeed; break;
          case 3: vy = -baseSpeed; break;
          case 4: vx = baseSpeed * 0.7; vy = baseSpeed * 0.7; break;
          case 5: vx = -baseSpeed * 0.7; vy = baseSpeed * 0.7; break;
          case 6: vx = baseSpeed * 0.7; vy = -baseSpeed * 0.7; break;
          case 7: vx = -baseSpeed * 0.7; vy = -baseSpeed * 0.7; break;
        }

        wordsRef.current.push({
          text: techWords[Math.floor(Math.random() * techWords.length)],
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
          opacity: config.opacityRange[0] + Math.random() * (config.opacityRange[1] - config.opacityRange[0]),
          layer,
        });
      }

      // Sort by layer for correct rendering order
      wordsRef.current.sort((a, b) => a.layer - b.layer);
    };

    const animate = (time: number) => {
      // Throttle to ~60fps
      const delta = time - lastTimeRef.current;
      if (delta < 16) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = time;

      ctx.clearRect(0, 0, width, height);
      
      // Set font properties once
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      wordsRef.current.forEach((word) => {
        // Update position
        word.x += word.vx;
        word.y += word.vy;

        // Wrap around edges smoothly
        const padding = 100;
        if (word.x > width + padding) word.x = -padding;
        if (word.x < -padding) word.x = width + padding;
        if (word.y > height + padding) word.y = -padding;
        if (word.y < -padding) word.y = height + padding;

        // Draw word with cyan/primary color
        ctx.font = `600 ${word.size}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = `hsla(195, 100%, 50%, ${word.opacity})`;
        ctx.fillText(word.text, word.x, word.y);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
      aria-hidden="true"
    />
  );
}

export const KineticTypography = memo(KineticTypographyComponent);
