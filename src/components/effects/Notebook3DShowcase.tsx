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
import screenTexture from '@/assets/notebook/screen-poster.jpg';

/**
 * Premium 3D laptop: chamfered chassis, individual keys, speaker grills,
 * power key, bezel + chin with discreet logo, GSAP open animation.
 * Purple studio backdrop tuned to match the on-screen poster.
 */

// ---------- Backdrop ----------
function GradientBackdrop() {
  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 16;
    c.height = 512;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#2a1a4a');
    g.addColorStop(0.5, '#1a0d2e');
    g.addColorStop(1, '#0a0512');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 512);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <mesh position={[0, 1.5, -6]}>
      <planeGeometry args={[30, 16]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

// ---------- Speaker grill (procedural dots) ----------
function useGrillTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 32;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 256, 32);
    ctx.fillStyle = '#1c1c1e';
    for (let y = 4; y < 32; y += 5) {
      for (let x = 4; x < 256; x += 5) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
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
  const powerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0a0a',
        metalness: 0.6,
        roughness: 0.3,
        emissive: '#a78bfa',
        emissiveIntensity: 0.25,
      }),
    []
  );

  if (tier === 'light') {
    return (
      <mesh position={[0, 0.066, 0.05]}>
        <planeGeometry args={[2.6, 1.05]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.3} roughness={0.7} />
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
      const isPower = r === 0 && c === cols - 1;
      keys.push(
        <RoundedBox
          key={`${r}-${c}`}
          args={[keyW, 0.03, keyH]}
          radius={0.015}
          smoothness={2}
          position={[x, 0.078, z]}
          material={isPower ? powerMat : keyMat}
        />
      );
    }
  }

  return (
    <group>
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
  const grillTex = useGrillTexture();

  useEffect(() => {
    if (screenMap) {
      screenMap.colorSpace = THREE.SRGBColorSpace;
      screenMap.anisotropy = 8;
    }
  }, [screenMap]);

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
      metalness: 0.9,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.2,
    });
  }, [tier]);

  const bezelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#030303',
        metalness: 0.4,
        roughness: 0.55,
      }),
    []
  );

  useEffect(() => {
    if (!lidRef.current) return;
    // closed: tampa deitada sobre a base (rotação PI/2 = deitada para frente)
    lidRef.current.rotation.x = Math.PI / 2;
    if (screenMatRef.current) {
      screenMatRef.current.opacity = 0;
      screenMatRef.current.transparent = true;
    }

    const tl = gsap.timeline();
    // aberta: levemente reclinada para trás (~100°)
    tl.to(
      lidRef.current.rotation,
      { x: -0.18, duration: 1.8, ease: 'power4.out' },
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

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.04;
  });

  const baseW = 3.2;
  const baseD = 2.25;
  const baseH = 0.16;
  const lidH = 1.95;
  const screenW = 3.04;
  const screenH = 1.84;
  // imagem 3:4 vertical. "cover" no plano horizontal: crop vertical, preenche tudo.
  const imgAspect = 3 / 4;
  const screenAspect = screenW / screenH;
  const repeatY = imgAspect / screenAspect; // <1
  useEffect(() => {
    if (!screenMap) return;
    screenMap.wrapS = THREE.ClampToEdgeWrapping;
    screenMap.wrapT = THREE.ClampToEdgeWrapping;
    screenMap.repeat.set(1, repeatY);
    screenMap.offset.set(0, (1 - repeatY) / 2);
    screenMap.needsUpdate = true;
  }, [screenMap, repeatY]);

  return (
    <group ref={groupRef} position={[0, -0.25, 0]}>
      {/* Chassis base */}
      <RoundedBox
        args={[baseW, baseH, baseD]}
        radius={0.06}
        smoothness={6}
        material={bodyMat}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      />

      <Keyboard tier={tier} />

      {/* Speaker grills flanking keyboard (full tier) */}
      {tier === 'full' && (
        <>
          <mesh position={[-1.3, 0.082, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.16, 1.05]} />
            <meshStandardMaterial map={grillTex} roughness={0.9} />
          </mesh>
          <mesh position={[1.3, 0.082, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.16, 1.05]} />
            <meshStandardMaterial map={grillTex} roughness={0.9} />
          </mesh>
        </>
      )}

      {/* Trackpad */}
      <group position={[0, 0.082, 0.85]}>
        <mesh>
          <boxGeometry args={[1.05, 0.004, 0.6]} />
          <meshStandardMaterial color="#0f0f10" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.003, 0]}>
          <boxGeometry args={[1.08, 0.008, 0.63]} />
          <meshStandardMaterial color="#050505" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>

      {/* Hinge */}
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

      {/* Side ports */}
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

      {/* Lid */}
      <group ref={lidRef} position={[0, baseH / 2, -baseD / 2 + 0.02]}>
        {/* Lid back panel - clean, no logo card */}
        <RoundedBox
          args={[baseW, lidH, 0.05]}
          radius={0.06}
          smoothness={6}
          material={bodyMat}
          castShadow
          position={[0, lidH / 2 + 0.05, -0.02]}
        />

        {/* Bezel frame (rounded) */}
        <RoundedBox
          args={[baseW - 0.08, lidH - 0.04, 0.012]}
          radius={0.04}
          smoothness={4}
          material={bezelMat}
          position={[0, lidH / 2 + 0.05, 0.008]}
        />

        {/* Screen poster (cover-fit, fills entire bezel) */}
        <mesh position={[0, lidH / 2 + 0.05, 0.016]}>
          <planeGeometry args={[screenW, screenH]} />
          <meshBasicMaterial
            ref={screenMatRef}
            map={screenMap}
            toneMapped={false}
            transparent
          />
        </mesh>

        {/* Glass reflection removida — causava artefato visual no centro da tela */}

        {/* Camera */}
        <mesh position={[0, lidH - 0.02, 0.014]}>
          <circleGeometry args={[0.022, 16]} />
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

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 7, 5]}
        intensity={1.3}
        color="#fff5e8"
        castShadow={tier === 'full'}
        shadow-mapSize={tier === 'full' ? 1024 : 256}
      />
      <directionalLight position={[-5, 4, 2]} intensity={0.55} color="#b8a4ff" />
      <spotLight
        position={[0, 4, -4]}
        intensity={1.3}
        angle={0.6}
        penumbra={1}
        color="#a78bfa"
      />

      <Float
        speed={1.1}
        rotationIntensity={tier === 'light' ? 0 : 0.12}
        floatIntensity={tier === 'light' ? 0 : 0.25}
      >
        <Laptop tier={tier} />
      </Float>

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
            mixStrength={0.5}
            roughness={0.9}
            depthScale={1}
            minDepthThreshold={0.85}
            color="#1a0d2e"
            metalness={0.4}
            mirror={0}
          />
        </mesh>
      )}

      <ContactShadows
        position={[0, -0.54, 0]}
        opacity={0.75}
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
            'linear-gradient(180deg, #2a1a4a 0%, #1a0d2e 50%, #0a0512 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {mounted && (
          <Canvas
            shadows={tier === 'full'}
            dpr={tier === 'light' ? [1, 1.3] : [1, 2]}
            camera={{ position: [0, 0.5, 5.6], fov: 32 }}
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
              autoRotate={false}
              minPolarAngle={Math.PI / 2.4}
              maxPolarAngle={Math.PI / 2.05}
              minAzimuthAngle={-Math.PI / 6}
              maxAzimuthAngle={Math.PI / 6}
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
