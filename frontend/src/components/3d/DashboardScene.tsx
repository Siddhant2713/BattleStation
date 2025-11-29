import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, CameraControls, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { PCCase } from '../pc/PCCase';

export const DashboardScene = () => {
    return (
        <>
            {/* Camera Rig - Unlocked 360, Smooth, Collision Safe */}
            <CameraControls
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 1.5} // Prevent going too far below
                minDistance={4}
                maxDistance={12}
                smoothTime={0.4}
                draggingSmoothTime={0.2}
                truckSpeed={0} // Disable panning for now to keep focus on center
            />

            {/* Lighting & Environment */}
            <Environment preset="city" background={false} blur={0.8} />
            <ambientLight intensity={0.3} />

            {/* Key Light */}
            <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={80}
                castShadow
            />
            {/* Rim Light */}
            <pointLight position={[-10, 5, -10]} intensity={40} color="#FF003C" />

            {/* Interior Fill Lights for Visibility */}
            <pointLight position={[0, 2, 0]} intensity={5} distance={3} color="#ffffff" />

            {/* Main PC Case Model - Scaled Down */}
            <Suspense fallback={null}>
                <group position={[0, -1.5, 0]} scale={0.7}>
                    <PCCase />
                    <ContactShadows
                        position={[0, -0.01, 0]}
                        opacity={0.6}
                        scale={10}
                        blur={2}
                        far={4}
                    />
                </group>
            </Suspense>

            {/* Post Processing */}
            <EffectComposer>
                <Bloom luminanceThreshold={1} mipmapBlur intensity={1.2} radius={0.6} />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={1.0} />
            </EffectComposer>
        </>
    );
};
