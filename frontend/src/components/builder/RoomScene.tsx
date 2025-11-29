import React, { useRef } from 'react';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';

export const RoomScene = () => {
    return (
        <>
            <OrbitControls makeDefault maxPolarAngle={Math.PI / 2} />
            <Stage environment="city" intensity={0.5}>
                {/* Desk */}
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[4, 2]} />
                    <meshStandardMaterial color="#111" roughness={0.5} metalness={0.5} />
                </mesh>

                {/* Monitor */}
                <mesh position={[0, 0.5, -0.5]}>
                    <boxGeometry args={[1.5, 0.8, 0.1]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
                <mesh position={[0, 0.5, -0.44]}>
                    <planeGeometry args={[1.4, 0.7]} />
                    <meshBasicMaterial color="#000" />
                </mesh>

                {/* Keyboard */}
                <mesh position={[0, 0.05, 0.3]}>
                    <boxGeometry args={[0.8, 0.05, 0.3]} />
                    <meshStandardMaterial color="#333" />
                </mesh>

                {/* Mouse */}
                <mesh position={[0.6, 0.05, 0.3]}>
                    <sphereGeometry args={[0.08]} />
                    <meshStandardMaterial color="#333" />
                </mesh>

                {/* RGB Strip */}
                <pointLight position={[0, 0.5, -0.6]} color="#FF0033" intensity={2} distance={3} />
            </Stage>
        </>
    );
};
