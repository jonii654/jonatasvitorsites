import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useDeviceTier } from '@/hooks/use-device-tier';
import view1 from '@/assets/notebook/view-1.png';
import view2 from '@/assets/notebook/view-2.png';
import view3 from '@/assets/notebook/view-3.png';
import view4 from '@/assets/notebook/view-4.png';
import view5 from '@/assets/notebook/view-5.png';
import view6 from '@/assets/notebook/view-6.png';
import view7 from '@/assets/notebook/view-7.png';

const frames = [view1, view2, view3, view4, view5, view6, view7];

/**
 * Pseudo-3D notebook showcase using a pre-rendered image sequence.
 * Desktop: drag to rotate + slow auto-rotation.
 * Mobile: auto-rotation only (no drag) for performance.
 * No WebGL — pure CSS/JS.
 */
export function Notebook3DShowcase() {
  const tier = useDeviceTier();
  const [frame, setFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; frame: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto rotation
  useEffect(() => {
    if (isDragging) return;
    const speed = tier === 'light' ? 220 : 160;
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % frames.length);
    }, speed);
    return () => clearInterval(id);
  }, [isDragging, tier]);

  // Drag handlers (desktop only)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (tier === 'light') return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, frame };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStart.current) return;
    const delta = e.clientX - dragStart.current.x;
    const step = Math.round(delta / 30);
    const next = (dragStart.current.frame + step + frames.length * 10) % frames.length;
    setFrame(next);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[720px] mx-auto select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Glow base */}
      <div
        className="absolute inset-x-8 bottom-2 h-16 rounded-full blur-3xl opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at center, hsl(195 100% 50% / 0.35), transparent 70%)',
        }}
      />

      <motion.div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative aspect-square ${tier === 'full' ? 'cursor-grab active:cursor-grabbing' : ''}`}
        animate={tier === 'light' ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Preload all frames stacked; show only current */}
        {frames.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={i === 0 ? 'Notebook em 3D — vista frontal' : ''}
            draggable={false}
            loading={i === 0 ? 'eager' : 'lazy'}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{
              opacity: i === frame ? 1 : 0,
              transition: 'opacity 120ms linear',
            }}
          />
        ))}
      </motion.div>

      {/* Hint */}
      {tier === 'full' && (
        <p className="text-xs text-muted-foreground text-center mt-2 tracking-wider uppercase">
          Arraste para girar
        </p>
      )}
    </div>
  );
}
