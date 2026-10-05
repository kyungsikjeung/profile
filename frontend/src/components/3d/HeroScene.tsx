'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Parallax = { current: { x: number; y: number } };

/** 중앙 조형물: 솔리드 토러스낫 + 와이어프레임 쉘 + 궤도 위성. */
function Sculpture({ parallax, reduce }: { parallax: Parallax; reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  const sat = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (reduce) return;
    const t = state.clock.getElapsedTime();
    const g = group.current;
    if (g) {
      g.position.y = Math.sin(t * 0.6) * 0.12;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, t * 0.12 + parallax.current.x * 0.45, 2.5, delta);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, parallax.current.y * 0.28, 2.5, delta);
    }
    if (sat.current) {
      const a = t * 0.45;
      sat.current.position.set(Math.cos(a) * 2.3, Math.sin(a * 0.8) * 0.7, Math.sin(a) * 2.3);
      sat.current.rotation.x = a;
      sat.current.rotation.y = a * 1.4;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <torusKnotGeometry args={[1.05, 0.32, 220, 36]} />
        <meshStandardMaterial color="#8f96ff" metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh scale={1.004}>
        <torusKnotGeometry args={[1.05, 0.32, 64, 12]} />
        <meshBasicMaterial color="#c7d2fe" wireframe transparent opacity={0.14} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[2.05, 0.012, 8, 128]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 1.8, -0.4, 0.2]}>
        <torusGeometry args={[2.5, 0.008, 8, 128]} />
        <meshBasicMaterial color="#9aa3b2" transparent opacity={0.28} />
      </mesh>
      <mesh ref={sat}>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial color="#e0e7ff" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** 주변 더스트 파티클. */
function Dust({ count, reduce }: { count: number; reduce: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi) - 1;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (reduce || !ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#818cf8" size={0.035} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/**
 * 랜딩 히어로 3D 모먼트 (페이지당 유일한 3D 씬).
 * 포인터 패럴랙스는 ref에만 기록 (리렌더 없음), reduced-motion 시 정지 프레임.
 */
export function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const parallax = useRef({ x: 0, y: 0 });
  const [env] = useState(() => ({
    coarse: typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
    reduce: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));

  return (
    <div
      ref={wrap}
      className="h-[420px] overflow-hidden md:h-[520px]"
      onPointerMove={(e) => {
        const r = wrap.current?.getBoundingClientRect();
        if (!r) return;
        parallax.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        parallax.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        parallax.current.x = 0;
        parallax.current.y = 0;
      }}
    >
      <Canvas
        frameloop={env.reduce ? 'demand' : 'always'}
        dpr={env.coarse ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0.4, 7.4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 5, 6]} intensity={1.6} color="#f4f6fb" />
        <pointLight position={[-5, -2, 3]} intensity={30} color="#6366f1" />
        <pointLight position={[4, -3, -2]} intensity={12} color="#9aa3b2" />
        <Sculpture parallax={parallax} reduce={env.reduce} />
        <Dust count={env.coarse ? 140 : 320} reduce={env.reduce} />
      </Canvas>
    </div>
  );
}
