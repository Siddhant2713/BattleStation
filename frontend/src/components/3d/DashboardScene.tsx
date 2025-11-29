import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Stage, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

export const DashboardScene = () => {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <>
            <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
                <Stage environment="city" intensity={0.6} castShadow={false}>
                    <group ref={meshRef}>
                        {/* PC Case Placeholder */}
                        <mesh position={[0, 1, 0]}>
                            <boxGeometry args={[2, 4, 4]} />
                            <meshStandardMaterial
                                color="#1a1a1a"
                                roughness={0.2}
                                metalness={0.8}
                            />
                        </mesh>
                        {/* Glass Panel */}
                        <mesh position={[1.01, 1, 0]}>
                            <planeGeometry args={[0, 3.8, 3.8]} />
                            <meshPhysicalMaterial
                                color="#ffffff"
                                transmission={0.9}
                                opacity={0.5}
                                transparent
                                roughness={0}
                                ior={1.5}
                            />
                        </mesh>
                        {/* Internal RGB Glow */}
                        <pointLight position={[0, 1, 0]} color="#FF0033" intensity={2} distance={5} />
                    </group>
                </Stage>
            </PresentationControls>
        </>
    );
};
