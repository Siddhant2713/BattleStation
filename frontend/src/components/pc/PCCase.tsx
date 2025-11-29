import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { Motherboard, GPU, CPUCooler, RAMSticks, CaseFans } from './PCComponents';

export const PCCase = ({ onFocus }: { onFocus?: (pos: THREE.Vector3) => void }) => {
    const [hovered, setHovered] = useState(false);

    // Materials - Memoized for performance
    const chassisMaterial = React.useMemo(() => new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        metalness: 0.8,
        roughness: 0.2,
    }), []);

    const glassMaterial = React.useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.95,
        thickness: 0.5,
        transparent: true,
        opacity: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0,
    }), []);

    const meshMaterial = React.useMemo(() => new THREE.MeshStandardMaterial({
        color: '#000000',
        metalness: 0.5,
        roughness: 0.8,
    }), []);

    const handleDoubleClick = (e: any) => {
        e.stopPropagation();
        // Logic to focus camera would go here, requires access to CameraControls ref
        // For now, we can just log or trigger a visual effect
        console.log("Focus on component");
    };

    return (
        <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onDoubleClick={handleDoubleClick}
        >
            {/* Main Chassis Frame (ATX Mid Tower dimensions approx) */}
            {/* Bottom */}
            <RoundedBox args={[2.2, 0.1, 4.5]} position={[0, 0, 0]} radius={0.05} material={chassisMaterial} />
            {/* Top */}
            <RoundedBox args={[2.2, 0.1, 4.5]} position={[0, 4.5, 0]} radius={0.05} material={chassisMaterial} />
            {/* Front Panel Frame */}
            <RoundedBox args={[2.2, 4.6, 0.1]} position={[0, 2.25, 2.25]} radius={0.02} material={chassisMaterial} />
            {/* Back Panel */}
            <RoundedBox args={[2.2, 4.6, 0.1]} position={[0, 2.25, -2.25]} radius={0.02} material={chassisMaterial} />
            {/* Motherboard Tray / Right Side Panel (Opaque) */}
            <RoundedBox args={[0.1, 4.4, 4.4]} position={[-1.05, 2.25, 0]} radius={0.02} material={chassisMaterial} />

            {/* Tempered Glass Side Panel (Left) */}
            <RoundedBox args={[0.05, 4.2, 4.2]} position={[1.05, 2.25, 0]} radius={0.02} material={glassMaterial} />

            {/* Front Mesh Intake */}
            <mesh position={[0, 2.25, 2.31]}>
                <planeGeometry args={[1.8, 4]} />
                <meshStandardMaterial color="#111" metalness={0.5} roughness={0.8} />
            </mesh>

            {/* Internal Components */}
            <group>
                <Motherboard onFocus={onFocus} />
                <GPU onFocus={onFocus} />
                <CPUCooler onFocus={onFocus} />
                <RAMSticks onFocus={onFocus} />
                <CaseFans onFocus={onFocus} />
            </group>

            {/* Feet */}
            <mesh position={[0.8, -0.1, 1.8]} material={chassisMaterial}><cylinderGeometry args={[0.1, 0.1, 0.2]} /></mesh>
            <mesh position={[-0.8, -0.1, 1.8]} material={chassisMaterial}><cylinderGeometry args={[0.1, 0.1, 0.2]} /></mesh>
            <mesh position={[0.8, -0.1, -1.8]} material={chassisMaterial}><cylinderGeometry args={[0.1, 0.1, 0.2]} /></mesh>
            <mesh position={[-0.8, -0.1, -1.8]} material={chassisMaterial}><cylinderGeometry args={[0.1, 0.1, 0.2]} /></mesh>

            {/* Power Button Glow */}
            <mesh position={[0.8, 4.56, 2]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.08]} />
                <meshBasicMaterial color={hovered ? "#FF003C" : "#333"} />
            </mesh>
        </group>
    );
};
