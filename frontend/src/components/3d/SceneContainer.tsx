import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, CameraControls, Preload } from '@react-three/drei';
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
                    {/* Dramatic Lighting Setup */}
                    <ambientLight intensity={0.2} color="#0B0C10" />

                    {/* Key Light (Cool Blue/White) */}
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.3}
                        penumbra={1}
                        intensity={2}
                        color="#C5C6C7"
                        castShadow
                        shadow-bias={-0.0001}
                    />

                    {/* Rim Light (Neon Crimson) - Backlight for edge definition */}
                    <spotLight
                        position={[-5, 5, -10]}
                        angle={0.5}
                        penumbra={1}
                        intensity={5}
                        color="#FF003C"
                        castShadow
                    />

                    {/* Fill Light (Subtle Purple/Blue) */}
                    <pointLight position={[-10, -5, 5]} intensity={0.5} color="#45A29E" />

                    {/* Environment */}
                    <Environment preset="city" environmentIntensity={0.5} />

                    {/* Content */}
                    {children}

                    {/* Controls - Replaced OrbitControls with CameraControls for smooth transitions */}
                    <CameraControls makeDefault minDistance={2} maxDistance={20} />

                    {/* Post Processing */}
                    <EffectComposer enableNormalPass={false}>
                        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
                        <Noise opacity={0.05} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    </EffectComposer>

                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
};
