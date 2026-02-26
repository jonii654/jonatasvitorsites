import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import pilotCard from '@/assets/pilot-card.jpg';

function LaptopModel() {
  const { scene } = useGLTF('https://static.poly.pizza/af6774b2-c748-47e6-9454-119e9e34c976.glb.br');
  const texture = useTexture(pilotCard);
  const groupRef = useRef<THREE.Group>(null);

  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;

  useEffect(() => {
    const screenKeywords = ['screen', 'display', 'monitor', 'lcd', 'tela'];
    let screenMesh: THREE.Mesh | null = null;
    let darkestMesh: THREE.Mesh | null = null;
    let darkestLuminance = 1;

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      
      console.log('Mesh found:', child.name, child.geometry?.boundingBox);

      const name = child.name.toLowerCase();
      if (screenKeywords.some((kw) => name.includes(kw))) {
        screenMesh = child;
      }

      const mat = child.material as THREE.MeshStandardMaterial;
      if (mat?.color) {
        const hsl = { h: 0, s: 0, l: 0 };
        mat.color.getHSL(hsl);
        if (hsl.l < darkestLuminance) {
          darkestLuminance = hsl.l;
          darkestMesh = child;
        }
      }
    });

    console.log('Screen mesh:', screenMesh?.name, 'Darkest mesh:', darkestMesh?.name);

    const target = screenMesh || darkestMesh;
    if (target) {
      const screenMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        emissive: new THREE.Color(0xffffff),
        emissiveMap: texture,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.1,
      });
      (target as THREE.Mesh).material = screenMaterial;
    }
  }, [scene, texture]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={3} position={[0, -1, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('https://static.poly.pizza/af6774b2-c748-47e6-9454-119e9e34c976.glb.br');

export function ModelViewer3D() {
  return (
    <section className="relative py-8 md:py-12">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h3
          className="text-lg md:text-xl font-semibold text-muted-foreground mb-4 tracking-wide uppercase"
          style={{ letterSpacing: '0.15em' }}
        >
          Explore em 3D
        </h3>
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            height: '400px',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <Canvas
            camera={{ position: [0, 1, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} />
              <LaptopModel />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
                autoRotate
                autoRotateSpeed={1}
              />
              <Environment preset="studio" />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
}
