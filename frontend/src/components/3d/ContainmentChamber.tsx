import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface ContainmentChamberProps {
    isOpen: boolean;
    onToggle: () => void;
}

export const ContainmentChamber = ({ isOpen, onToggle }: ContainmentChamberProps) => {
    const leftDoorRef = useRef<THREE.Group>(null);
    const rightDoorRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = React.useState(false);

    useCursor(hovered);

    useEffect(() => {
        if (leftDoorRef.current && rightDoorRef.current) {
            const targetX = isOpen ? 4 : 1.5; // Slide out distance

            gsap.to(leftDoorRef.current.position, {
                x: -targetX,
                duration: 1.5,
                ease: "power3.inOut"
            });

            gsap.to(rightDoorRef.current.position, {
                x: targetX,
                duration: 1.5,
                ease: "power3.inOut"
            });
        }
    }, [isOpen]);

    return (
        <group>
            {/* Base Platform */}
            <Box args={[6, 0.2, 6]} position={[0, -1.6, 0]}>
                <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
            </Box>
            {/* Emissive Ring on Base */}
            <mesh position={[0, -1.59, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.5, 2.6, 32]} />
                <meshBasicMaterial color={isOpen ? "#00FFFF" : "#FF003C"} toneMapped={false} />
            </mesh>

            {/* Left Door Panel */}
            <group ref={leftDoorRef} position={[-1.5, 1.5, 0]}>
                <Box args={[0.1, 6, 6]}>
                    <meshPhysicalMaterial
                        color="#ffffff"
                        metalness={0.1}
                        roughness={0.1}
                        transmission={0.9}
                        thickness={0.5}
                        transparent
                        opacity={0.3}
                    />
                </Box>
                {/* Frame/Edges */}
                <Box args={[0.15, 6.1, 0.2]} position={[0, 0, 3]}>
                    <meshStandardMaterial color="#333" metalness={0.8} />
                </Box>
                <Box args={[0.15, 6.1, 0.2]} position={[0, 0, -3]}>
                    <meshStandardMaterial color="#333" metalness={0.8} />
                </Box>
                {/* Neon Edge */}
                <mesh position={[0.06, 0, 3]}>
                    <boxGeometry args={[0.01, 6, 0.05]} />
                    <meshBasicMaterial color="#FF003C" toneMapped={false} />
                </mesh>
            </group>

            {/* Right Door Panel */}
            <group ref={rightDoorRef} position={[1.5, 1.5, 0]}>
                <Box args={[0.1, 6, 6]}>
                    <meshPhysicalMaterial
                        color="#ffffff"
                        metalness={0.1}
                        roughness={0.1}
                        transmission={0.9}
                        thickness={0.5}
                        transparent
                        opacity={0.3}
                    />
                </Box>
                {/* Frame/Edges */}
                <Box args={[0.15, 6.1, 0.2]} position={[0, 0, 3]}>
                    <meshStandardMaterial color="#333" metalness={0.8} />
                </Box>
                <Box args={[0.15, 6.1, 0.2]} position={[0, 0, -3]}>
                    <meshStandardMaterial color="#333" metalness={0.8} />
                </Box>
                {/* Neon Edge */}
                <mesh position={[-0.06, 0, 3]}>
                    <boxGeometry args={[0.01, 6, 0.05]} />
                    <meshBasicMaterial color="#FF003C" toneMapped={false} />
                </mesh>
            </group>

            {/* Interaction Trigger Zone (Invisible) */}
            <mesh
                position={[0, 1.5, 4]}
                visible={false}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={onToggle}
            >
                <boxGeometry args={[4, 4, 1]} />
            </mesh>
        </group>
    );
};
