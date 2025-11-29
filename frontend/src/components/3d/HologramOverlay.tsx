import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

interface HologramOverlayProps {
    visible: boolean;
    label: string;
    stats?: { label: string; value: string }[];
    position?: [number, number, number];
}

export const HologramOverlay = ({ visible, label, stats = [], position = [0, 0, 0] }: HologramOverlayProps) => {
    const ringRef = useRef<THREE.Mesh>(null);
    const innerRingRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (visible && ringRef.current && innerRingRef.current) {
            ringRef.current.rotation.z += delta * 0.5;
            innerRingRef.current.rotation.z -= delta * 1;
        }
    });

    if (!visible) return null;

    return (
        <group position={position}>
            {/* Rotating Rings */}
            <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.2, 1.25, 32]} />
                <meshBasicMaterial color="#00FFFF" transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.8, 0.82, 32]} />
                <meshBasicMaterial color="#00FFFF" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>

            {/* Connecting Line */}
            <mesh position={[1.5, 0.5, 0]}>
                <boxGeometry args={[1, 0.02, 0.02]} />
                <meshBasicMaterial color="#00FFFF" transparent opacity={0.5} />
            </mesh>

            {/* Info Panel (Billboard to face camera) */}
            <Billboard position={[2.5, 1, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
                <group>
                    {/* Background Panel */}
                    <mesh position={[0, -0.5, 0]}>
                        <planeGeometry args={[2, 1.5]} />
                        <meshBasicMaterial color="#000000" transparent opacity={0.6} />
                    </mesh>
                    {/* Border */}
                    <mesh position={[-1, -0.5, 0]}>
                        <boxGeometry args={[0.05, 1.5, 0.01]} />
                        <meshBasicMaterial color="#00FFFF" />
                    </mesh>

                    {/* Text Content */}
                    <Text
                        position={[-0.8, 0, 0.01]}
                        fontSize={0.2}
                        color="#ffffff"
                        anchorX="left"
                        anchorY="middle"
                        font="https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDWRRFmbURQJxsGH5yRCg.woff" // Web font URL or local
                    >
                        {label}
                    </Text>

                    {stats.map((stat, i) => (
                        <group key={i} position={[-0.8, -0.3 - (i * 0.2), 0.01]}>
                            <Text
                                fontSize={0.1}
                                color="#aaaaaa"
                                anchorX="left"
                                anchorY="middle"
                            >
                                {stat.label}
                            </Text>
                            <Text
                                position={[1.5, 0, 0]}
                                fontSize={0.1}
                                color="#00FFFF"
                                anchorX="right"
                                anchorY="middle"
                            >
                                {stat.value}
                            </Text>
                        </group>
                    ))}
                </group>
            </Billboard>
        </group>
    );
};
