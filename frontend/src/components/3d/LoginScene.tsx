import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Cloud, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

export const LoginScene = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Subtle parallax based on mouse position
            const { x, y } = state.mouse;
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.05, 0.05);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.05, 0.05);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Deep Space Background */}
            <color attach="background" args={['#050000']} />
            <fog attach="fog" args={['#050000', 5, 20]} />
            <Sparkles
                count={200}
                scale={12}
                size={2}
                speed={0.4}
                opacity={0.5}
                color="#FF003C"
                noise={0.5}
            />

            {/* Volumetric Light Shafts (Simulated with planes) */}
            <mesh position={[0, 5, -5]} rotation={[0, 0, Math.PI / 4]}>
                <planeGeometry args={[20, 20]} />
                <meshBasicMaterial
                    color="#FF003C"
                    transparent
                    opacity={0.02}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};
