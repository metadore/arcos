"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useAppStore } from '@/store/useAppStore';


function PastRetroLab() {
  return (
    <Float>
      <mesh>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#FFD700" wireframe />
      </mesh>
    </Float>
  );
}

export default function Scene() {
  const timelineState = useAppStore(state => state.timelineState);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {timelineState === 'PAST' && <PastRetroLab />}

        <OrbitControls enableZoom={false} enablePan={false} autoRotate={timelineState === 'PAST'} autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
