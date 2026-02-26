import { useEffect } from 'react';

export function ModelViewer3D() {
  useEffect(() => {
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className="relative py-8 md:py-12">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h3
          className="text-lg md:text-xl font-semibold text-muted-foreground mb-4 tracking-wide uppercase"
          style={{ letterSpacing: '0.15em' }}
        >
          Explore em 3D
        </h3>
        {/* @ts-ignore */}
        <model-viewer
          src="/models/laptop.glb"
          alt="Modelo 3D — Notebook representando criação de sites"
          auto-rotate
          camera-controls
          shadow-intensity="1"
          environment-image="neutral"
          exposure="1"
          style={{
            width: '100%',
            maxWidth: '600px',
            height: '400px',
            backgroundColor: 'transparent',
            borderRadius: '16px',
            '--poster-color': 'transparent',
          } as React.CSSProperties}
        />
      </div>
    </section>
  );
}
