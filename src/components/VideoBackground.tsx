export function VideoBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: 0.12,
          filter: 'blur(1px) saturate(1.3)',
          position: 'sticky',
          top: 0,
        }}
      >
        <source src="/videos/background-effect.mp4" type="video/mp4" />
      </video>
      
      {/* Gradient overlay to blend with theme */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, hsl(220 50% 8% / 0.8) 0%, hsl(220 50% 8% / 0.6) 50%, hsl(220 50% 8% / 0.8) 100%)'
        }}
      />
      
      {/* Subtle color accent */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 30% 30%, hsl(195 100% 50% / 0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 70% 70%, hsl(155 100% 50% / 0.03) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
