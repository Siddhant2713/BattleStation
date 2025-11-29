import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';

interface SceneContainerProps {
    children: React.ReactNode;
    className?: string;
    cameraPosition?: [number, number, number];
}

export const SceneContainer: React.FC<SceneContainerProps> = ({
    children,
    className = "w-full h-full",
    cameraPosition = [0, 0, 5]
}) => {
    return (
        <div className={className}>
            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: cameraPosition, fov: 45 }}
                gl={{ antialias: false }} // Post-processing handles AA usually, or turn on if needed
            >
                <Suspense fallback={null}>
                    {/* Lighting */}
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={1} />

                    {/* Environment */}
                    <Environment preset="city" />

                    {/* Content */}
                    {children}

                    {/* Controls */}
                    <OrbitControls makeDefault />

                    {/* Post Processing */}
                    <EffectComposer disableNormalPass>
                        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
                        <Noise opacity={0.02} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    </EffectComposer>

                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
};
