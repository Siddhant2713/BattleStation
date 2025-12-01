import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, CameraControls, Preload, PerformanceMonitor, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

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
    const [dpr, setDpr] = useState(1.5);

    return (
        <div className={className}>
            <Canvas
                shadows={false} // Disable default heavy shadow maps
                dpr={dpr}
                camera={{ position: cameraPosition, fov: 45 }}
                gl={{
                    antialias: false, // Post-processing handles AA or we rely on DPR
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true
                }}
            >
                {/* Dynamic Resolution Scaling */}
                <PerformanceMonitor
                    onIncline={() => setDpr(1.5)}
                    onDecline={() => setDpr(0.75)}
                    flipflops={3}
                    onFallback={() => setDpr(0.75)}
                />

                <Suspense fallback={null}>
                    {/* Efficient Lighting Setup */}
                    <ambientLight intensity={0.4} color="#0B0C10" />

                    {/* Key Light - Static if possible, or minimal shadow map */}
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.3}
                        penumbra={1}
                        intensity={2}
                        color="#C5C6C7"
                        castShadow={false} // Disable expensive dynamic shadows
                    />

                    {/* Rim Light */}
                    <spotLight
                        position={[-5, 5, -10]}
                        angle={0.5}
                        penumbra={1}
                        intensity={5}
                        color="#FF003C"
                        castShadow={false}
                    />

                    {/* Fill Light */}
                    <pointLight position={[-10, -5, 5]} intensity={0.5} color="#45A29E" />

                    {/* Environment - Low Res for lighting */}
                    <Environment preset="city" environmentIntensity={0.5} resolution={256} />

                    {/* Content */}
                    {children}

                    {/* Baked-like Soft Shadows */}
                    <ContactShadows
                        position={[0, -4, 0]}
                        opacity={0.6}
                        scale={20}
                        blur={2}
                        far={4.5}
                    />

                    {/* Controls */}
                    <CameraControls makeDefault minDistance={2} maxDistance={20} smoothTime={0.25} />

                    {/* Optimized Post Processing */}
                    <EffectComposer>
                        <Bloom
                            luminanceThreshold={1.2} // Only very bright things glow
                            mipmapBlur
                            intensity={0.8}
                            radius={0.4}
                            levels={4} // Reduce levels for performance
                        />
                    </EffectComposer>

                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
};
