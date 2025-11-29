import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';

const Desk = () => (
    <group position={[0, -2, 0]}>
        {/* Top */}
        <mesh position={[0, 2, 0]}>
            <boxGeometry args={[6, 0.2, 3]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.5} />
        </mesh>
        {/* Legs */}
        <mesh position={[-2.5, 1, 1]}>
            <boxGeometry args={[0.2, 2, 0.2]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[2.5, 1, 1]}>
            <boxGeometry args={[0.2, 2, 0.2]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[-2.5, 1, -1]}>
            <boxGeometry args={[0.2, 2, 0.2]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[2.5, 1, -1]}>
            <boxGeometry args={[0.2, 2, 0.2]} />
            <meshStandardMaterial color="#333" />
        </mesh>
    </group>
);

const Monitor = () => (
    <group position={[0, 0.5, -0.5]}>
        {/* Screen */}
        <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2, 1.2, 0.1]} />
            <meshStandardMaterial color="#050505" roughness={0.2} />
        </mesh>
        {/* Display Area */}
        <mesh position={[0, 0.5, 0.06]}>
            <planeGeometry args={[1.9, 1.1]} />
            <meshBasicMaterial color="#000" />
        </mesh>
        {/* Stand */}
        <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.1, 0.2, 0.6]} />
            <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, -0.5, 0.2]}>
            <boxGeometry args={[0.8, 0.1, 0.6]} />
            <meshStandardMaterial color="#111" />
        </mesh>
    </group>
);

export const RoomScene = () => {
    return (
        <Canvas shadows camera={{ position: [5, 5, 8], fov: 50 }}>
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 5, 0]} intensity={2} color="#ffffff" />

            {/* RGB Strip behind desk */}
            <pointLight position={[0, 1, -2]} intensity={5} color="#ff0033" distance={10} />

            <group position={[0, -1, 0]}>
                <Desk />
                <Monitor />
            </group>

            <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={20} blur={2} far={5} />
            <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>
    );
};
