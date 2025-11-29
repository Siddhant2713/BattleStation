import React, { useMemo } from 'react';
import { Box, Plane, Instances, Instance, Float, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const LabEnvironment = () => {
    // Memoize materials for performance
    const materials = useMemo(() => ({
        floor: new THREE.MeshStandardMaterial({
            color: "#0a0a0a",
            roughness: 0.3,
            metalness: 0.8,
        }),
        pillar: new THREE.MeshStandardMaterial({
            color: "#050505",
            roughness: 0.2,
            metalness: 0.9,
        }),
        emissive: new THREE.MeshBasicMaterial({
            color: "#FF003C",
            toneMapped: false,
        }),
        vent: new THREE.MeshStandardMaterial({
            color: "#111",
            roughness: 0.7,
            metalness: 0.5,
        })
    }), []);

    return (
        <group>
            {/* --- FLOORING (High-End Reflection) --- */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={40}
                    roughness={0.4}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050505"
                    metalness={0.8}
                    mirror={0.5}
                />
            </mesh>

            {/* Floor Grid Inlay */}
            <gridHelper
                args={[100, 20, 0x333333, 0x050505]}
                position={[0, -3.98, 0]}
            />

            {/* --- ARCHITECTURAL PILLARS (Instanced for Performance) --- */}
            <Instances range={10} material={materials.pillar} geometry={new THREE.BoxGeometry(4, 40, 4)}>
                {/* Left Row */}
                <Instance position={[-30, 10, -20]} />
                <Instance position={[-30, 10, 0]} />
                <Instance position={[-30, 10, 20]} />

                {/* Right Row */}
                <Instance position={[30, 10, -20]} />
                <Instance position={[30, 10, 0]} />
                <Instance position={[30, 10, 20]} />
            </Instances>

            {/* Pillar Accents (Emissive Strips) */}
            <Instances range={10} material={materials.emissive} geometry={new THREE.PlaneGeometry(0.2, 35)}>
                <Instance position={[-27.9, 10, -20]} rotation={[0, Math.PI / 2, 0]} />
                <Instance position={[-27.9, 10, 0]} rotation={[0, Math.PI / 2, 0]} />
                <Instance position={[-27.9, 10, 20]} rotation={[0, Math.PI / 2, 0]} />

                <Instance position={[27.9, 10, -20]} rotation={[0, -Math.PI / 2, 0]} />
                <Instance position={[27.9, 10, 0]} rotation={[0, -Math.PI / 2, 0]} />
                <Instance position={[27.9, 10, 20]} rotation={[0, -Math.PI / 2, 0]} />
            </Instances>

            {/* --- CEILING STRUCTURE (Industrial Rails) --- */}
            <group position={[0, 25, 0]}>
                {/* Main Rails */}
                {[-10, 0, 10].map((x, i) => (
                    <mesh key={i} position={[x, 0, 0]}>
                        <boxGeometry args={[1, 1, 100]} />
                        <meshStandardMaterial color="#111" metalness={0.9} />
                    </mesh>
                ))}

                {/* Cross Beams */}
                {[-20, 0, 20].map((z, i) => (
                    <mesh key={i} position={[0, 1, z]}>
                        <boxGeometry args={[60, 1, 1]} />
                        <meshStandardMaterial color="#222" metalness={0.8} />
                    </mesh>
                ))}

                {/* Overhead Light Arrays */}
                {[-15, 15].map((z, i) => (
                    <mesh key={i} position={[0, -0.5, z]} rotation={[Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[40, 2]} />
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
                    </mesh>
                ))}
            </group>

            {/* --- BACK WALL (The "Vault Door") --- */}
            <group position={[0, 0, -40]}>
                {/* Main Door Slab */}
                <mesh position={[0, 10, 0]}>
                    <boxGeometry args={[40, 40, 2]} />
                    <meshStandardMaterial color="#080808" metalness={0.8} roughness={0.4} />
                </mesh>

                {/* Door Seam */}
                <mesh position={[0, 10, 1.1]}>
                    <planeGeometry args={[0.5, 40]} />
                    <meshBasicMaterial color="#000" />
                </mesh>

                {/* Locking Mechanisms */}
                {[-15, 15].map((x, i) => (
                    <mesh key={i} position={[x, 10, 1.5]}>
                        <cylinderGeometry args={[2, 2, 4, 6]} />
                        <meshStandardMaterial color="#333" metalness={1} />
                    </mesh>
                ))}
            </group>

            {/* --- ATMOSPHERIC PARTICLES --- */}
            <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-2, 2]}>
                {[...Array(20)].map((_, i) => (
                    <mesh key={i} position={[
                        (Math.random() - 0.5) * 60,
                        (Math.random() * 30),
                        (Math.random() - 0.5) * 60
                    ]}>
                        <sphereGeometry args={[0.05]} />
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
                    </mesh>
                ))}
            </Float>
        </group>
    );
};
