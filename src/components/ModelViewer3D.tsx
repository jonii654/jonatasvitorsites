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
      <div className="container mx-auto px-4">
        {/* @ts-ignore */}
        <model-viewer
          src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
          alt="Modelo 3D de Teste"
          auto-rotate
          camera-controls
          style={{ width: '100%', height: '400px', backgroundColor: '#111', borderRadius: '16px' }}
        />
      </div>
    </section>
  );
}
