import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Float,
  RoundedBox,
  MeshReflectorMaterial,
} from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import gsap from 'gsap';
import { useDeviceTier } from '@/hooks/use-device-tier';
import screenTexture from '@/assets/notebook/view-1.png';

/**
 * Detailed 3D laptop (Asus-inspired) built with three.js + R3F + drei + GSAP.
 * - RoundedBox chassis + lid with chamfered edges.
 * - Keyboard built as a grid of individual keys.
 * - Trackpad inset, hinge cylinder, rubber feet, side ports.
 * - MeshPhysicalMaterial brushed aluminum with clearcoat.
 * - Studio scene: vertical gray gradient backdrop + subtle reflective floor.
 * - GSAP timeline opens the lid on mount; screen fades in.
 */

// ---------- Backdrop ----------
function GradientBackdrop() {
  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 16;
    c.height = 512;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#dcdcdc');
    g.addColorStop(0.45, '#9a9a9a');
    g.addColorStop(1, '#2c2c2c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 512);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <mesh position={[0, 1.5, -6]} rotation={[0, 0, 0]}>
      <planeGeometry args={[30, 16]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

// ---------- Keyboard ----------
function Keyboard({ tier }: { tier: 'light' | 'full' }) {
  const keyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#161616',
        metalness: 0.35,
        roughness: 0.55,
      }),
    []
  );

  if (tier === 'light') {
    // flat keyboard plate to save geometry
    return (
      <mesh position={[0, 0.066, 0.05]}>
        <planeGeometry args={[2.6, 1.05]} />
        <meshStandardMaterial
          color="#0d0d0d"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
    );
  }

  const rows = 5;
  const cols = 14;
  const keyW = 0.165;
  const keyH = 0.165;
  const gap = 0.025;
  const totalW = cols * keyW + (cols - 1) * gap;
  const totalH = rows * keyH + (rows - 1) * gap;
  const startX = -totalW / 2 + keyW / 2;
  const startZ = -totalH / 2 + keyH / 2 + 0.05;

  const keys = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (keyW + gap);
      const z = startZ + r * (keyH + gap);
      keys.push(
        <RoundedBox
          key={`${r}-${c}`}
          args={[keyW, 0.03, keyH]}
          radius={0.015}
          smoothness={2}
          position={[x, 0.078, z]}
          material={keyMat}
          castShadow={false}
        />
      );
    }
  }

  return (
    <group>
      {/* recessed plate under keys */}
      <mesh position={[0, 0.062, 0.05]}>
        <boxGeometry args={[totalW + 0.15, 0.005, totalH + 0.15]} />
        <meshStandardMaterial color="#050505" metalness={0.3} roughness={0.8} />
      </mesh>
      {keys}
    </group>
  );
}

// ---------- Laptop ----------
function Laptop({ tier }: { tier: 'light' | 'full' }) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const screenMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const screenMap = useLoader(TextureLoader, screenTexture);

  useEffect(() => {
    if (screenMap) {
      screenMap.colorSpace = THREE.SRGBColorSpace;
      screenMap.anisotropy = 8;
    }
  }, [screenMap]);

  // Body material - brushed aluminum
  const bodyMat = useMemo(() => {
    if (tier === 'light') {
      return new THREE.MeshStandardMaterial({
        color: '#1c1c1e',
        metalness: 0.8,
        roughness: 0.4,
      });
    }
    return new THREE.MeshPhysicalMaterial({
      color: '#1c1c1e',
      metalness: 0.88,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.25,
    });
  }, [tier]);

  const bezelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#040404',
        metalness: 0.4,
        roughness: 0.6,
      }),
    []
  );

  // Open lid + screen-on
  useEffect(() => {
    if (!lidRef.current) return;
    lidRef.current.rotation.x = 0.05;
    if (screenMatRef.current) {
      screenMatRef.current.opacity = 0;
      screenMatRef.current.transparent = true;
    }

    const tl = gsap.timeline();
    tl.to(
      lidRef.current.rotation,
      {
        x: -Math.PI / 2 + 0.2,
        duration: 1.6,
        ease: 'power4.out',
      },
      0.3
    );
    if (screenMatRef.current) {
      tl.to(
        screenMatRef.current,
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        1.2
      );
    }
    if (groupRef.current) {
      gsap.from(groupRef.current.position, {
        y: -1.2,
        duration: 1.4,
        ease: 'power3.out',
      });
      gsap.from(groupRef.current.rotation, {
        y: -Math.PI * 0.45,
        duration: 1.8,
        ease: 'power3.out',
      });
    }
  }, []);

  // Idle float
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.04;
  });

  const baseW = 3.2;
  const baseD = 2.25;
  const baseH = 0.16;

  return (
    <group ref={groupRef} position={[0, -0.25, 0]}>
      {/* Chassis base with rounded corners */}
      <RoundedBox
        args={[baseW, baseH, baseD]}
        radius={0.04}
        smoothness={4}
        material={bodyMat}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      />

      {/* Keyboard */}
      <Keyboard tier={tier} />

      {/* Trackpad - recessed */}
      <group position={[0, 0.082, 0.85]}>
        <mesh>
          <boxGeometry args={[1.05, 0.004, 0.6]} />
          <meshStandardMaterial
            color="#0f0f10"
            metalness={0.5}
            roughness={0.35}
          />
        </mesh>
        {/* trackpad bezel */}
        <mesh position={[0, -0.003, 0]}>
          <boxGeometry args={[1.08, 0.008, 0.63]} />
          <meshStandardMaterial
            color="#050505"
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* Hinge cylinder */}
      <mesh
        position={[0, 0.05, -baseD / 2 + 0.04]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.05, 0.05, baseW - 0.4, 24]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Rubber feet */}
      {[
        [-1.4, -0.08, -0.9],
        [1.4, -0.08, -0.9],
        [-1.4, -0.08, 0.9],
        [1.4, -0.08, 0.9],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
        </mesh>
      ))}

      {/* Side ports (left + right) */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[(baseW / 2) * side, 0, -0.4]}>
            <boxGeometry args={[0.04, 0.05, 0.18]} />
            <meshStandardMaterial color="#000" roughness={0.9} />
          </mesh>
          <mesh position={[(baseW / 2) * side, 0, -0.1]}>
            <boxGeometry args={[0.04, 0.04, 0.12]} />
            <meshStandardMaterial color="#000" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Lid pivot at back edge */}
      <group ref={lidRef} position={[0, baseH / 2, -baseD / 2 + 0.02]}>
        {/* Lid back panel - rounded */}
        <RoundedBox
          args={[baseW, 1.95, 0.05]}
          radius={0.04}
          smoothness={4}
          material={bodyMat}
          castShadow
          position={[0, 1.0, -0.02]}
        />

        {/* Asus-style logo accent (emissive square) */}
        <mesh position={[0, 1.0, -0.05]}>
          <planeGeometry args={[0.4, 0.08]} />
          <meshStandardMaterial
            color="#888"
            emissive="#aaccff"
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>

        {/* Front bezel frame */}
        <mesh material={bezelMat} position={[0, 1.0, 0.005]}>
          <boxGeometry args={[3.1, 1.88, 0.015]} />
        </mesh>

        {/* Screen image */}
        <mesh position={[0, 1.02, 0.014]}>
          <planeGeometry args={[2.92, 1.7]} />
          <meshBasicMaterial
            ref={screenMatRef}
            map={screenMap}
            toneMapped={false}
            transparent
          />
        </mesh>

        {/* Glass reflection layer */}
        {tier === 'full' && (
          <mesh position={[0, 1.02, 0.018]}>
            <planeGeometry args={[2.92, 1.7]} />
            <meshPhysicalMaterial
              transparent
              opacity={0.08}
              roughness={0.05}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.05}
              color="#ffffff"
            />
          </mesh>
        )}

        {/* Camera notch */}
        <mesh position={[0, 1.92, 0.012]}>
          <circleGeometry args={[0.025, 16]} />
          <meshStandardMaterial color="#000" roughness={0.2} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// ---------- Scene ----------
function Scene({ tier }: { tier: 'light' | 'full' }) {
  return (
    <>
      <GradientBackdrop />

      <ambientLight intensity={0.45} />
      {/* Key light */}
      <directionalLight
        position={[5, 7, 5]}
        intensity={1.4}
        color="#fff5e8"
        castShadow={tier === 'full'}
        shadow-mapSize={tier === 'full' ? 1024 : 256}
      />
      {/* Fill */}
      <directionalLight
        position={[-5, 4, 2]}
        intensity={0.6}
        color="#b8d4ff"
      />
      {/* Rim */}
      <spotLight
        position={[0, 4, -4]}
        intensity={1.2}
        angle={0.6}
        penumbra={1}
        color="#ffffff"
      />

      <Float
        speed={1.1}
        rotationIntensity={tier === 'light' ? 0 : 0.12}
        floatIntensity={tier === 'light' ? 0 : 0.25}
      >
        <Laptop tier={tier} />
      </Float>

      {/* Reflective floor (desktop only) */}
      {tier === 'full' && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.55, 0]}
          receiveShadow
        >
          <planeGeometry args={[30, 30]} />
          <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={0.6}
            roughness={0.9}
            depthScale={1}
            minDepthThreshold={0.85}
            color="#5a5a5a"
            metalness={0.4}
            mirror={0}
          />
        </mesh>
      )}

      <ContactShadows
        position={[0, -0.54, 0]}
        opacity={0.7}
        scale={9}
        blur={2.6}
        far={3}
      />

      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>
    </>
  );
}

// ---------- Wrapper ----------
export function Notebook3DShowcase() {
  const tier = useDeviceTier();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative w-full max-w-[880px] mx-auto select-none">
      <div
        className="relative w-full overflow-hidden rounded-3xl"
        style={{
          height: 'min(72vh, 560px)',
          minHeight: 380,
          background:
            'linear-gradient(180deg, #dcdcdc 0%, #9a9a9a 45%, #2c2c2c 100%)',
        }}
      >
        {/* Vignette overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)',
          }}
        />

        {mounted && (
          <Canvas
            shadows={tier === 'full'}
            dpr={tier === 'light' ? [1, 1.3] : [1, 2]}
            camera={{ position: [0, 1.4, 5.4], fov: 36 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
          >
            <Scene tier={tier} />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableDamping
              dampingFactor={0.08}
              autoRotate={tier === 'full'}
              autoRotateSpeed={0.8}
              minPolarAngle={Math.PI / 3.4}
              maxPolarAngle={Math.PI / 2.05}
            />
          </Canvas>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-3 tracking-[0.2em] uppercase">
        Arraste para girar · 3D Real
      </p>
    </div>
  );
}
