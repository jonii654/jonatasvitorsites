import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D realistic-ish human hand built from primitives (palm + 5 fingers with joints).
 * Rendered inside a transparent Canvas so the parent aura still shows through.
 * Kept lightweight (no external GLB) so it works offline and mobile-safe when the
 * caller decides to mount it.
 */

interface Hand3DProps {
  /** Aura / rim light color (e.g. 'hsl(195 100% 55%)') */
  auraColor: string;
  /** Mirror horizontally (right hand vs left hand) */
  mirror?: boolean;
  /** Container className */
  className?: string;
}

const SKIN = '#d9a488';
const SKIN_DARK = '#8f5f42';

function Finger({
  position,
  rotation = [0, 0, 0],
  length = 1,
  radius = 0.09,
  segments = 3,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
  radius?: number;
  segments?: number;
}) {
  const segLen = length / segments;
  const parts = Array.from({ length: segments });
  return (
    <group position={position} rotation={rotation}>
      {parts.map((_, i) => (
        <group key={i} position={[0, i * segLen, 0]} rotation={[i === 0 ? 0 : -0.12, 0, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[radius, segLen * 0.85, 6, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.55} metalness={0} />
          </mesh>
          {/* knuckle */}
          <mesh position={[0, segLen * 0.5, 0]}>
            <sphereGeometry args={[radius * 1.05, 12, 10]} />
            <meshStandardMaterial color={SKIN_DARK} roughness={0.7} />
          </mesh>
        </group>
      ))}
      {/* fingertip */}
      <mesh position={[0, length, 0]}>
        <sphereGeometry args={[radius * 0.9, 12, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.5} />
      </mesh>
    </group>
  );
}

function HandMesh({ auraColor, mirror }: { auraColor: string; mirror?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // subtle breathing / life
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.6) * 0.04;
    groupRef.current.position.y = Math.sin(t * 0.9) * 0.04;
  });

  const scaleX = mirror ? -1 : 1;

  return (
    <group ref={groupRef} scale={[scaleX * 1.05, 1.05, 1.05]} rotation={[0, -0.35, 0]}>
      {/* Forearm stub */}
      <mesh position={[0, -1.6, -0.1]}>
        <cylinderGeometry args={[0.42, 0.5, 1.2, 24]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.7} />
      </mesh>

      {/* Palm (flattened box) */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <boxGeometry args={[1.05, 1.1, 0.42]} />
        <meshStandardMaterial color={SKIN} roughness={0.55} metalness={0} />
      </mesh>
      {/* palm highlight sphere for softness */}
      <mesh position={[0, -0.4, 0.22]}>
        <sphereGeometry args={[0.55, 20, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.4} />
      </mesh>

      {/* Thumb — angled out */}
      <Finger
        position={[-0.55, -0.55, 0.08]}
        rotation={[0, 0, 1.15]}
        length={0.75}
        radius={0.11}
        segments={2}
      />

      {/* Index */}
      <Finger position={[-0.36, 0.15, 0.05]} rotation={[-0.08, 0, 0.05]} length={0.95} />
      {/* Middle */}
      <Finger position={[-0.12, 0.18, 0.05]} length={1.05} />
      {/* Ring */}
      <Finger position={[0.12, 0.15, 0.05]} rotation={[-0.05, 0, -0.03]} length={0.95} />
      {/* Pinky */}
      <Finger position={[0.34, 0.05, 0.05]} rotation={[-0.05, 0, -0.1]} length={0.75} radius={0.075} />

      {/* Aura glow (back sphere with emissive) */}
      <mesh position={[0, -0.2, -0.6]}>
        <sphereGeometry args={[1.4, 24, 20]} />
        <meshBasicMaterial color={auraColor} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export function Hand3D({ auraColor, mirror = false, className = '' }: Hand3DProps) {
  const dirColor = useMemo(() => new THREE.Color(auraColor), [auraColor]);
  return (
    <div className={className} style={{ width: 260, height: 340 }}>
      <Canvas
        dpr={[1, 1.6]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 4.2], fov: 32 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 5]} intensity={1.1} color={'#ffffff'} />
        <pointLight position={[mirror ? -2 : 2, 0, 2.5]} intensity={2.4} color={dirColor} distance={8} />
        <pointLight position={[0, -2, 2]} intensity={0.6} color={dirColor} />
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <HandMesh auraColor={auraColor} mirror={mirror} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Hand3D;
