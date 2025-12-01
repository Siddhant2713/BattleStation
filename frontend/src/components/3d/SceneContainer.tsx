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
                shadows={false}
                dpr={dpr}
                camera={{ position: cameraPosition, fov: 45 }}
                gl={{
                    antialias: false,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true,
                    alpha: false // Optimization: Disable alpha buffer if not needed
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
                    {/* Efficient Lighting Setup: 2 Dynamic Lights Max + Environment */}

                    {/* Key Light */}
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.3}
                        penumbra={1}
                        intensity={2}
                        color="#C5C6C7"
                        castShadow={false}
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

                    {/* Ambient Fill via Environment */}
                    <Environment preset="city" environmentIntensity={0.5} resolution={256} />

                    {/* Content */}
                    {children}

                    {/* Baked-like Soft Shadows - Single Instance */}
                    <ContactShadows
                        position={[0, -4, 0]}
                        opacity={0.6}
                        scale={20}
                        blur={2}
                        far={4.5}
                        resolution={256} // Lower resolution for performance
                        frames={1} // Bake once
                    />

                    {/* Controls */}
                    <CameraControls makeDefault minDistance={2} maxDistance={20} smoothTime={0.25} />

                    {/* Optimized Post Processing - Bloom Only */}
                    <EffectComposer enableNormalPass={false}>
                        <Bloom
                            luminanceThreshold={1.2}
                            mipmapBlur
                            intensity={0.8}
                            radius={0.4}
                            levels={4}
                        />
                    </EffectComposer>

                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
};
