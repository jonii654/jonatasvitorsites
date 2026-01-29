import { useEffect, useRef, memo } from 'react';

interface CardKineticBackgroundProps {
  words: string[];
}

interface Word {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

function CardKineticBackgroundComponent({ words }: CardKineticBackgroundProps) {
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
      
      initWords();
    };

    const initWords = () => {
      const wordCount = Math.min(words.length, 6);
      wordsRef.current = [];

      for (let i = 0; i < wordCount; i++) {
        const direction = Math.floor(Math.random() * 8);
        const baseSpeed = 0.15 + Math.random() * 0.2;
        
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
          text: words[i % words.length],
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          size: 10 + Math.random() * 6,
          opacity: 0.12 + Math.random() * 0.1,
        });
      }
    };

    const animate = (time: number) => {
      const delta = time - lastTimeRef.current;
      if (delta < 16) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = time;

      ctx.clearRect(0, 0, width, height);
      
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      wordsRef.current.forEach((word) => {
        word.x += word.vx;
        word.y += word.vy;

        const padding = 50;
        if (word.x > width + padding) word.x = -padding;
        if (word.x < -padding) word.x = width + padding;
        if (word.y > height + padding) word.y = -padding;
        if (word.y < -padding) word.y = height + padding;

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
  }, [words]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl"
        aria-hidden="true"
      />
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-background/60 rounded-2xl pointer-events-none" />
    </>
  );
}

export const CardKineticBackground = memo(CardKineticBackgroundComponent);
