import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export const LoginScene = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
            groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
        }
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <color attach="background" args={['#050505']} />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <group ref={groupRef}>
                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <mesh position={[2, 1, -5]} rotation={[0, 0.5, 0]}>
                        <icosahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial
                            color="#FF0033"
                            wireframe
                            emissive="#FF0033"
                            emissiveIntensity={2}
                            transparent
                            opacity={0.3}
                        />
                    </mesh>
                </Float>

                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh position={[-3, -2, -8]} rotation={[0.5, 0, 0]}>
                        <octahedronGeometry args={[1.5, 0]} />
                        <meshStandardMaterial
                            color="#ffffff"
                            wireframe
                            emissive="#ffffff"
                            emissiveIntensity={0.5}
                            transparent
                            opacity={0.1}
                        />
                    </mesh>
                </Float>
            </group>

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#FF0033" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0000FF" />
        </>
    );
};
