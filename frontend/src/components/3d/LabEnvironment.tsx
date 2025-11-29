import React, { useMemo } from 'react';
import { Box, Plane, Instances, Instance, Float, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const LabEnvironment = () => {
    // Memoize materials for performance
    const materials = useMemo(() => ({
        floor: new THREE.MeshStandardMaterial({
            color: "#050505",
            roughness: 0.1,
            metalness: 0.5,
        }),
        wall: new THREE.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0.2,
            metalness: 0.1,
        }),
        ceiling: new THREE.MeshStandardMaterial({
            color: "#f0f0f0",
            roughness: 0.5,
            metalness: 0.1,
        }),
        trim: new THREE.MeshStandardMaterial({
            color: "#000000",
            roughness: 0.2,
            metalness: 0.8,
        }),
        lightStrip: new THREE.MeshBasicMaterial({
            color: "#ffffff",
            toneMapped: false,
        }),
        accent: new THREE.MeshBasicMaterial({
            color: "#FF003C",
            toneMapped: false,
        }),
        glass: new THREE.MeshPhysicalMaterial({
            color: "#ffffff",
            metalness: 0.1,
            roughness: 0,
            transmission: 0.9,
            transparent: true,
            opacity: 0.3
        })
    }), []);

    return (
        <group>
            {/* --- FLOORING (Premium Matte Black) --- */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <MeshReflectorMaterial
                    blur={[400, 100]}
                    resolution={2048}
                    mixBlur={1}
                    mixStrength={20} // Slightly increased for premium feel
                    roughness={0.6} // Micro-texture feel
                    depthScale={1}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050505"
                    metalness={0.6}
                    mirror={0.3}
                />
            </mesh>

            {/* Floor Edge LEDs */}
            <mesh position={[0, -3.98, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.9} />
            </mesh>
            {/* Geometric Floor Pattern */}
            <gridHelper
                args={[100, 10, 0x333333, 0x080808]}
                position={[0, -3.95, 0]}
            />

            {/* --- WALLS (Geometric Paneling) --- */}
            <group>
                {/* Left Wall Panels */}
                <Instances range={5} material={materials.wall} geometry={new THREE.BoxGeometry(40, 30, 1)}>
                    <Instance position={[-40, 15, -20]} rotation={[0, Math.PI / 2, 0]} />
                    <Instance position={[-40, 15, 0]} rotation={[0, Math.PI / 2, 0]} />
                    <Instance position={[-40, 15, 20]} rotation={[0, Math.PI / 2, 0]} />
                </Instances>

                {/* Right Wall Panels */}
                <Instances range={5} material={materials.wall} geometry={new THREE.BoxGeometry(40, 30, 1)}>
                    <Instance position={[40, 15, -20]} rotation={[0, -Math.PI / 2, 0]} />
                    <Instance position={[40, 15, 0]} rotation={[0, -Math.PI / 2, 0]} />
                    <Instance position={[40, 15, 20]} rotation={[0, -Math.PI / 2, 0]} />
                </Instances>

                {/* Back Wall (Layered) */}
                <mesh position={[0, 15, -40]}>
                    <boxGeometry args={[80, 40, 1]} />
                    <primitive object={materials.wall} />
                </mesh>
                {/* Back Wall Accent Panel */}
                <mesh position={[0, 15, -39]}>
                    <boxGeometry args={[60, 30, 1]} />
                    <primitive object={materials.wall} />
                </mesh>
            </group>

            {/* --- STRUCTURAL PILLARS (Sharp Black Trims) --- */}
            <Instances range={10} material={materials.trim} geometry={new THREE.BoxGeometry(1.5, 40, 1.5)}>
                {/* Left Columns */}
                <Instance position={[-38, 10, -10]} />
                <Instance position={[-38, 10, 10]} />

                {/* Right Columns */}
                <Instance position={[38, 10, -10]} />
                <Instance position={[38, 10, 10]} />
            </Instances>

            {/* --- CEILING (Soft Diffusion) --- */}
            <group position={[0, 25, 0]}>
                {/* Main Ceiling */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <primitive object={materials.ceiling} />
                </mesh>

                {/* Embedded Light Panels */}
                {[-15, -5, 5, 15].map((x, i) => (
                    <mesh key={i} position={[x, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[2, 60]} />
                        <primitive object={materials.lightStrip} />
                    </mesh>
                ))}
            </group>

            {/* --- ACCENTS (Minimalist) --- */}
            {/* Thin Emissive Lines on Back Wall */}
            <mesh position={[0, 5, -38.4]}>
                <planeGeometry args={[60, 0.05]} />
                <primitive object={materials.accent} />
            </mesh>
            <mesh position={[0, 25, -38.4]}>
                <planeGeometry args={[60, 0.05]} />
                <primitive object={materials.accent} />
            </mesh>
        </group>
    );
};
