import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const MODEL_URL = 'https://static.poly.pizza/af6774b2-c748-47e6-9454-119e9e34c976.glb.br';

function WindowsScreen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  if (!canvasRef.current) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    const bg = ctx.createLinearGradient(0, 0, 512, 320);
    bg.addColorStop(0, '#1a73e8');
    bg.addColorStop(0.5, '#0d47a1');
    bg.addColorStop(1, '#002171');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 320);

    const icons = [
      { x: 30, y: 20, label: 'Este PC', color: '#FFD54F' },
      { x: 30, y: 90, label: 'Documentos', color: '#42A5F5' },
      { x: 30, y: 160, label: 'Lixeira', color: '#BDBDBD' },
    ];
    icons.forEach(({ x, y, label, color }) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 32, 28);
      ctx.fillStyle = '#fff';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + 16, y + 42);
    });

    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 290, 512, 30);
    ctx.fillStyle = '#0078D4';
    ctx.fillRect(4, 294, 22, 22);
    ctx.fillStyle = '#fff';
    [8, 16].forEach(x => [298, 306].forEach(y => ctx.fillRect(x, y, 6, 6)));

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.roundRect(32, 295, 140, 20, 3);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🔍 Pesquisar', 40, 309);

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('14:32', 500, 306);
    ctx.fillText('11/03/2026', 500, 316);

    canvasRef.current = canvas;
    textureRef.current = new THREE.CanvasTexture(canvas);
    textureRef.current.colorSpace = THREE.SRGBColorSpace;
  }

  return (
    <mesh position={[0, 1.02, -0.18]} rotation={[-0.18, 0, 0]}>
      <planeGeometry args={[2.05, 1.3]} />
      <meshStandardMaterial
        map={textureRef.current}
        emissive={new THREE.Color(0x444444)}
        emissiveMap={textureRef.current}
        emissiveIntensity={0.12}
        roughness={0.5}
        metalness={0}
        toneMapped={true}
      />
    </mesh>
  );
}

function LaptopScene() {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.25;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <Center>
      <group ref={groupRef}>
        <primitive object={scene} />
        <WindowsScreen />
      </group>
    </Center>
  );
}

useGLTF.preload(MODEL_URL);

export function ModelViewer3D() {
  return (
    <section className="relative py-8 md:py-16">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl font-semibold text-muted-foreground mb-6 tracking-wide uppercase"
          style={{ letterSpacing: '0.15em' }}
        >
          Explore em 3D
        </motion.h3>
        <div className="w-full" style={{ maxWidth: 800, height: 550 }}>
          <Canvas
            camera={{ position: [3, 2, 4], fov: 35 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 5, 5]} intensity={0.7} />
              <directionalLight position={[-3, 2, -2]} intensity={0.2} />
              <LaptopScene />
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={3}
                maxDistance={8}
                minPolarAngle={Math.PI / 5}
                maxPolarAngle={Math.PI / 2.2}
                autoRotate
                autoRotateSpeed={1.5}
                target={[0, 0.5, 0]}
              />
              <Environment preset="studio" />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
}
