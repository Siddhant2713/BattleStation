import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, SoftShadows } from '@react-three/drei';
import { DashboardScene } from '../components/3d/DashboardScene';
import { DashboardHUD } from '../components/dashboard/DashboardHUD';

export const HangarView = () => {
    const [dpr, setDpr] = useState(1.5); // Default to high quality

    return (
        <div className="relative w-full h-screen bg-obsidian overflow-hidden" style={{ height: '100vh' }}>
            {/* 3D Scene Layer */}
            <div className="absolute inset-0 z-0">
                <Canvas
                    shadows
                    dpr={dpr}
                    camera={{ position: [5, 2, 5], fov: 45 }}
                    gl={{ antialias: false, powerPreference: "high-performance" }}
                >
                    {/* Adaptive Performance Scaling */}
                    <PerformanceMonitor
                        onIncline={() => setDpr(2)}
                        onDecline={() => setDpr(1)}
                        flipflops={3}
                        onFallback={() => setDpr(1)}
                    />
                    <SoftShadows size={10} samples={8} focus={0.5} />

                    <DashboardScene />
                </Canvas>
            </div>

            {/* HUD Layer */}
            <DashboardHUD />

            {/* Vignette Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-50" />
        </div>
    );
};
