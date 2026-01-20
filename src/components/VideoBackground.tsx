export function VideoBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none video-bg-container">
      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: 0.25,
          filter: 'blur(2px) saturate(1.3)',
          transform: 'scale(1.05)',
        }}
      >
        <source src="/videos/background-effect.mp4" type="video/mp4" />
      </video>
      
      {/* Gradient overlay for theme blend */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, hsl(220 50% 8% / 0.7) 0%, hsl(220 50% 8% / 0.5) 50%, hsl(220 50% 8% / 0.7) 100%)'
        }}
      />
      
      {/* Cyan glow effect */}
      <div 
        className="absolute inset-0 video-glow-overlay"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 30% 20%, hsl(195 100% 50% / 0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 70% 80%, hsl(155 100% 50% / 0.06) 0%, transparent 60%)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
