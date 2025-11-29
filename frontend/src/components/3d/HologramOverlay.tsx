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
    if (!visible) return null;

    return (
        <group position={position}>
            {/* Connecting Line (Thin & Sharp) */}
            <mesh position={[1.5, 0.5, 0]}>
                <boxGeometry args={[1, 0.01, 0.01]} />
                <meshBasicMaterial color="#00FFFF" transparent opacity={0.8} />
            </mesh>

            {/* Info Panel (Billboard to face camera) */}
            <Billboard position={[2.5, 1, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
                <group>
                    {/* Glass Panel Background */}
                    <mesh position={[0, -0.5, 0]}>
                        <planeGeometry args={[2.2, 1.6]} />
                        <meshBasicMaterial color="#000000" transparent opacity={0.8} side={THREE.DoubleSide} />
                    </mesh>

                    {/* Thin Cyan Border */}
                    <mesh position={[0, -0.5, 0]}>
                        <boxGeometry args={[2.22, 1.62, 0.001]} />
                        <meshBasicMaterial color="#00FFFF" transparent opacity={0.3} wireframe />
                    </mesh>

                    {/* Header Bar */}
                    <mesh position={[0, 0.2, 0.01]}>
                        <planeGeometry args={[2, 0.02]} />
                        <meshBasicMaterial color="#00FFFF" />
                    </mesh>

                    {/* Text Content */}
                    <Text
                        position={[-0.9, 0, 0.02]}
                        fontSize={0.18}
                        color="#ffffff"
                        anchorX="left"
                        anchorY="middle"
                        font="https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDWRRFmbURQJxsGH5yRCg.woff"
                    >
                        {label}
                    </Text>

                    {stats.map((stat, i) => (
                        <group key={i} position={[-0.9, -0.3 - (i * 0.25), 0.02]}>
                            <Text
                                fontSize={0.12}
                                color="#aaaaaa"
                                anchorX="left"
                                anchorY="middle"
                                font="https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDWRRFmbURQJxsGH5yRCg.woff"
                            >
                                {stat.label}
                            </Text>
                            <Text
                                position={[1.8, 0, 0]}
                                fontSize={0.12}
                                color="#00FFFF"
                                anchorX="right"
                                anchorY="middle"
                                font="https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDWRRFmbURQJxsGH5yRCg.woff"
                            >
                                {stat.value}
                            </Text>
                            {/* Separator Line */}
                            <mesh position={[0.9, -0.12, 0]}>
                                <planeGeometry args={[1.8, 0.005]} />
                                <meshBasicMaterial color="#00FFFF" transparent opacity={0.2} />
                            </mesh>
                        </group>
                    ))}
                </group>
            </Billboard>
        </group>
    );
};
