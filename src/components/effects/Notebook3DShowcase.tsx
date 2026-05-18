import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import gsap from 'gsap';
import { useDeviceTier } from '@/hooks/use-device-tier';
import screenTexture from '@/assets/notebook/view-1.png';

/**
 * Real 3D notebook built with Three.js / react-three-fiber.
 * - Aluminum body (base + lid) modeled with BoxGeometry + bevel-like materials.
 * - Screen displays one of the uploaded notebook photos as texture.
 * - GSAP timeline opens the lid on mount, then enters idle float + slow rotation.
 * - OrbitControls: drag to rotate (desktop). Touch enabled on mobile but with damping.
 */

function Laptop({ tier }: { tier: 'light' | 'full' }) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const screenMap = useLoader(TextureLoader, screenTexture);

  useEffect(() => {
    if (screenMap) {
      screenMap.colorSpace = THREE.SRGBColorSpace;
      screenMap.anisotropy = 8;
    }
  }, [screenMap]);

  // Open lid animation on mount
  useEffect(() => {
    if (!lidRef.current) return;
    lidRef.current.rotation.x = 0; // closed
    gsap.to(lidRef.current.rotation, {
      x: -Math.PI / 2 + 0.25, // open ~ 100deg
      duration: 1.8,
      delay: 0.3,
      ease: 'power3.out',
    });
    if (groupRef.current) {
      gsap.from(groupRef.current.position, {
        y: -1.5,
        duration: 1.4,
        ease: 'power3.out',
      });
      gsap.from(groupRef.current.rotation, {
        y: -Math.PI * 0.6,
        duration: 2,
        ease: 'power3.out',
      });
    }
  }, []);

  // Idle float
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.05;
  });

  // Materials
  const bodyMat = new THREE.MeshStandardMaterial({
    color: '#1a1a1c',
    metalness: 0.9,
    roughness: 0.35,
  });
  const screenBezelMat = new THREE.MeshStandardMaterial({
    color: '#050505',
    metalness: 0.6,
    roughness: 0.4,
  });
  const screenMat = new THREE.MeshBasicMaterial({
    map: screenMap,
    toneMapped: false,
  });
  const keyboardMat = new THREE.MeshStandardMaterial({
    color: '#0a0a0a',
    metalness: 0.4,
    roughness: 0.6,
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} rotation={[0, 0, 0]}>
      {/* Base */}
      <mesh material={bodyMat} castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.12, 2.2]} />
      </mesh>
      {/* Keyboard inset */}
      <mesh material={keyboardMat} position={[0, 0.062, 0.15]}>
        <boxGeometry args={[2.7, 0.005, 1.4]} />
      </mesh>
      {/* Trackpad */}
      <mesh material={keyboardMat} position={[0, 0.063, 1.0]}>
        <boxGeometry args={[1.0, 0.005, 0.55]} />
      </mesh>

      {/* Lid pivot at back edge */}
      <group ref={lidRef} position={[0, 0.06, -1.05]}>
        {/* Lid back */}
        <mesh material={bodyMat} castShadow position={[0, 1.0, -0.03]}>
          <boxGeometry args={[3.2, 2.0, 0.06]} />
        </mesh>
        {/* Bezel */}
        <mesh material={screenBezelMat} position={[0, 1.0, 0.001]}>
          <boxGeometry args={[3.1, 1.9, 0.02]} />
        </mesh>
        {/* Screen */}
        <mesh material={screenMat} position={[0, 1.0, 0.015]}>
          <planeGeometry args={[2.9, 1.7]} />
        </mesh>
      </group>
    </group>
  );
}

function Scene({ tier }: { tier: 'light' | 'full' }) {
  return (
    <>
      <color attach="background" args={['#00000000']} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 6, 4]}
        intensity={1.2}
        castShadow={tier === 'full'}
        shadow-mapSize={tier === 'full' ? 1024 : 256}
      />
      <directionalLight position={[-4, 3, -2]} intensity={0.4} color="#4fc3ff" />
      <pointLight position={[0, 2, 3]} intensity={0.6} color="#00e5ff" />

      <Float
        speed={1.2}
        rotationIntensity={tier === 'light' ? 0 : 0.15}
        floatIntensity={tier === 'light' ? 0 : 0.3}
      >
        <Laptop tier={tier} />
      </Float>

      <ContactShadows
        position={[0, -0.55, 0]}
        opacity={0.55}
        scale={8}
        blur={2.4}
        far={3}
      />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
    </>
  );
}

export function Notebook3DShowcase() {
  const tier = useDeviceTier();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative w-full max-w-[820px] mx-auto select-none">
      {/* Glow base */}
      <div
        className="absolute inset-x-8 bottom-4 h-20 rounded-full blur-3xl opacity-60 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, hsl(195 100% 50% / 0.45), transparent 70%)',
        }}
      />

      <div
        className="relative w-full"
        style={{ height: 'min(70vh, 520px)', minHeight: 360 }}
      >
        {mounted && (
          <Canvas
            shadows={tier === 'full'}
            dpr={tier === 'light' ? [1, 1.3] : [1, 2]}
            camera={{ position: [0, 1.6, 5.2], fov: 38 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <Scene tier={tier} />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableDamping
              dampingFactor={0.08}
              autoRotate
              autoRotateSpeed={tier === 'light' ? 0.6 : 0.9}
              minPolarAngle={Math.PI / 3.4}
              maxPolarAngle={Math.PI / 2.05}
            />
          </Canvas>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-2 tracking-[0.2em] uppercase">
        Arraste para girar · 3D Real
      </p>
    </div>
  );
}
