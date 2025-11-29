import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const Screen = () => {
    const ref = useRef<THREE.MeshBasicMaterial>(null);

    useFrame((state) => {
        if (ref.current) {
            // Simulate screen flickering/gaming
            const t = state.clock.getElapsedTime();
            const r = 0.5 + Math.sin(t * 10) * 0.5;
            const g = 0.5 + Math.cos(t * 8) * 0.5;
            const b = 0.5 + Math.sin(t * 5) * 0.5;
            ref.current.color.setRGB(r, g, b);
        }
    });

    return (
        <mesh position={[0, 0.5, 0.06]}>
            <planeGeometry args={[1.9, 1.1]} />
            <meshBasicMaterial ref={ref} toneMapped={false} />
        </mesh>
    );
};

const Monitor = () => (
    <group position={[0, 0.5, -0.5]}>
        <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2, 1.2, 0.1]} />
            <meshStandardMaterial color="#050505" roughness={0.2} />
        </mesh>
        <Screen />
        <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.1, 0.2, 0.6]} />
            <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, -0.5, 0.2]}>
            <boxGeometry args={[0.8, 0.1, 0.6]} />
            <meshStandardMaterial color="#111" />
        </mesh>
    </group>
);

export const SimulationScene = () => {
    return (
        <Canvas shadows camera={{ position: [0, 1, 3], fov: 60 }}>
            {/* Dark Environment */}
            <color attach="background" args={['#000']} />

            {/* Screen Glow */}
            <pointLight position={[0, 1, 0.5]} intensity={2} distance={5} decay={2} />

            <group position={[0, -1, 0]}>
                <Monitor />
            </group>

            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} minAzimuthAngle={-0.2} maxAzimuthAngle={0.2} />
        </Canvas>
    );
};
