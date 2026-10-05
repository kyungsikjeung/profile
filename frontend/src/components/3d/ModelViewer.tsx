'use client';

import { Component, Suspense, useMemo, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function RemoteModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

/** GLB 로드 실패 시 플레이스홀더로 폴백 (mock URL·404·깨진 파일 대비). */
class GLBErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return <PlaceholderModel />;
    return this.props.children;
  }
}

function PlaceholderModel({ color = '#6366f1' }: { color?: string }) {
  return (
    <mesh rotation={[0.4, 0.6, 0]}>
      <boxGeometry args={[1.6, 1.6, 1.6]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
    </mesh>
  );
}

interface Props {
  /** 변환된 GLB URL (없으면 플레이스홀더 렌더) */
  url?: string;
  previewImage?: string;
  className?: string;
}

/**
 * 기본 3D 뷰어 (FR-018: 회전/줌).
 * - frameloop="demand" + DPR 상한 2 (성능 예산 NFR-002/003)
 * - ?no3d=1 또는 reduced-motion 시 정적 폴백 (접근성 UX-013)
 */
export function ModelViewer({ url, previewImage, className }: Props) {
  const staticOnly = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('no3d') === '1') return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  if (staticOnly) {
    return (
      <div className={`grid min-h-[320px] place-items-center ${className ?? ''}`}>
        {previewImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewImage} alt="3D 모델 정적 미리보기" className="max-h-[420px] rounded-xl" />
        ) : (
          <p className="text-fog">정적 미리보기 모드 (?no3d=1)</p>
        )}
      </div>
    );
  }

  return (
    <div className={`h-[420px] overflow-hidden rounded-xl md:h-[480px] ${className ?? ''}`}>
      <Canvas frameloop="demand" dpr={[1, 2]} camera={{ position: [3, 2, 4], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Suspense fallback={<PlaceholderModel />}>
          <GLBErrorBoundary key={url ?? 'placeholder'}>
            {url ? <RemoteModel url={url} /> : <PlaceholderModel />}
          </GLBErrorBoundary>
        </Suspense>
        <OrbitControls enablePan makeDefault />
      </Canvas>
    </div>
  );
}
