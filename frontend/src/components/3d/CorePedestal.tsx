import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Ring } from '@react-three/drei';
import * as THREE from 'three';

export const CorePedestal = () => {
    const platformRef = useRef<THREE.Group>(null);
    const energyCoilRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Gentle Levitation
        if (platformRef.current) {
            platformRef.current.position.y = Math.sin(t * 0.5) * 0.05;
        }

        // Subtle Pulse
        if (energyCoilRef.current) {
            (energyCoilRef.current.material as THREE.MeshBasicMaterial).opacity = 0.8 + Math.sin(t * 2) * 0.2;
        }
    });

    return (
        <group position={[0, -2, 0]}>
            {/* --- BASE (Matte Black) --- */}
            <Box args={[4, 0.5, 4]} position={[0, -1.5, 0]}>
                <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.2} />
            </Box>

            {/* --- LEVITATING PLATFORM (Pure White) --- */}
            <group ref={platformRef} position={[0, 0, 0]}>
                {/* Main Slab */}
                <Box args={[3, 0.2, 3]}>
                    <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.1} />
                </Box>

                {/* Black Tech Trim */}
                <Box args={[3.05, 0.15, 3.05]} position={[0, -0.05, 0]}>
                    <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.2} />
                </Box>

                {/* Central Glow (Under PC) */}
                <mesh ref={energyCoilRef} position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[1.5, 1.5]} />
                    <meshBasicMaterial color="#00FFFF" transparent opacity={0.5} />
                </mesh>

                {/* Front Status Light */}
                <Box args={[0.5, 0.05, 0.02]} position={[0, 0, 1.53]}>
                    <meshBasicMaterial color="#FF003C" toneMapped={false} />
                </Box>
            </group>
        </group>
    );
};
