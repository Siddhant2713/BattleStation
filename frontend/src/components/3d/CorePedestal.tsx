import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Ring } from '@react-three/drei';
import * as THREE from 'three';

export const CorePedestal = () => {
    const platformRef = useRef<THREE.Group>(null);
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);
    const energyCoilRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Levitation effect
        if (platformRef.current) {
            platformRef.current.position.y = Math.sin(t * 0.5) * 0.1;
        }

        // Ring rotation
        if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.2;
        if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.15;

        // Energy pulse
        if (energyCoilRef.current) {
            (energyCoilRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(t * 2) * 0.2;
        }
    });

    return (
        <group position={[0, -2, 0]}>
            {/* --- BASE STRUCTURE --- */}
            {/* Main Floor Mount */}
            <Cylinder args={[3, 4, 1, 8]} position={[0, -0.5, 0]}>
                <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.4} />
            </Cylinder>

            {/* Glowing Floor Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <ringGeometry args={[3.2, 3.5, 32]} />
                <meshBasicMaterial color="#FF003C" toneMapped={false} transparent opacity={0.5} />
            </mesh>

            {/* --- LEVITATING PLATFORM --- */}
            <group ref={platformRef} position={[0, 1, 0]}>
                {/* Platform Top */}
                <Box args={[3, 0.2, 5]}>
                    <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
                </Box>

                {/* Tech Detail Sides */}
                <Box args={[3.2, 0.1, 5.2]} position={[0, -0.1, 0]}>
                    <meshStandardMaterial color="#222" metalness={0.9} />
                </Box>

                {/* Energy Coils (Underneath) */}
                <mesh ref={energyCoilRef} position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[1, 1, 4, 16, 1, true]} />
                    <meshBasicMaterial color="#00FFFF" transparent opacity={0.6} side={THREE.DoubleSide} />
                </mesh>

                {/* Holographic Rings */}
                <group position={[0, 0.5, 0]}>
                    <mesh ref={ring1Ref} rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[3.5, 3.6, 64]} />
                        <meshBasicMaterial color="#00FFFF" transparent opacity={0.3} side={THREE.DoubleSide} />
                    </mesh>
                    <mesh ref={ring2Ref} rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[3.8, 3.85, 64]} />
                        <meshBasicMaterial color="#FF003C" transparent opacity={0.2} side={THREE.DoubleSide} />
                    </mesh>
                </group>

                {/* Front Label */}
                <Box args={[1, 0.1, 0.05]} position={[0, 0.11, 2.5]}>
                    <meshBasicMaterial color="#FF003C" />
                </Box>


            </group>
        </group>
    );
};
