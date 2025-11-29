import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export const SimulationScene = () => {
    const screenRef = useRef<THREE.MeshBasicMaterial>(null);

    useFrame((state) => {
        if (screenRef.current) {
            // Simulate screen activity with color shifting
            const time = state.clock.getElapsedTime();
            screenRef.current.color.setHSL((time * 0.1) % 1, 0.8, 0.5);
        }
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 2]} />
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />

            <group position={[0, -0.5, 0]}>
                {/* Monitor Frame */}
                <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[1.6, 0.95, 0.05]} />
                    <meshStandardMaterial color="#111" />
                </mesh>

                {/* Screen */}
                <mesh position={[0, 0.5, 0.03]}>
                    <planeGeometry args={[1.5, 0.85]} />
                    <meshBasicMaterial ref={screenRef} color="#000" toneMapped={false} />
                </mesh>

                {/* Desk Glow */}
                <pointLight position={[0, 0.5, 0.5]} intensity={0.5} color="#fff" />
            </group>

            <ambientLight intensity={0.1} />
        </>
    );
};
