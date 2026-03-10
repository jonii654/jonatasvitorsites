import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, OrbitControls, Environment, Center } from '@react-three/drei';
import * as THREE from 'three';
import pilotCard from '@/assets/pilot-card.jpg';

const MODEL_URL = 'https://static.poly.pizza/af6774b2-c748-47e6-9454-119e9e34c976.glb.br';

function ScreenPlane() {
  const texture = useTexture(pilotCard);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh position={[0, 1.02, -0.18]} rotation={[-0.18, 0, 0]}>
      <planeGeometry args={[2.05, 1.3]} />
      <meshStandardMaterial
        map={texture}
        emissive={new THREE.Color(0x666666)}
        emissiveMap={texture}
        emissiveIntensity={0.15}
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
        <ScreenPlane />
      </group>
    </Center>
  );
}

useGLTF.preload(MODEL_URL);

export function ModelViewer3D() {
  return (
    <section className="relative py-8 md:py-16">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h3
          className="text-lg md:text-xl font-semibold text-muted-foreground mb-6 tracking-wide uppercase"
          style={{ letterSpacing: '0.15em' }}
        >
          Explore em 3D
        </h3>
        <div className="w-full" style={{ maxWidth: 700, height: 500 }}>
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
                enableZoom={false}
                enablePan={false}
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
