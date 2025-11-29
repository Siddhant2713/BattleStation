import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows } from '@react-three/drei';
import { CaseModel, GPUModel, FanModel } from '../Three/PCModels';

export const DashboardScene = () => {
    return (
        <Canvas shadows camera={{ position: [6, 3, 6], fov: 40 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow color="#ffffff" />
            <pointLight position={[-5, 5, -5]} intensity={5} color="#ff0033" distance={10} />

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <group position={[0, -1.5, 0]}>
                    <CaseModel />
                    <GPUModel rgbColor="#ff0033" />
                    <FanModel position={[0, 0.5, 1.9]} rgbColor="#ff0033" />
                    <FanModel position={[0, 1.5, 1.9]} rgbColor="#ff0033" />
                    <FanModel position={[0, 2.5, 1.9]} rgbColor="#ff0033" />
                </group>
            </Float>

            <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={15} blur={2} far={4} color="#000" />
            <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
        </Canvas>
    );
};
