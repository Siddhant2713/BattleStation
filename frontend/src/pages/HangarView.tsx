import React from 'react';
import { Canvas } from '@react-three/fiber';
import { DashboardScene } from '../components/3d/DashboardScene';
import { DashboardHUD } from '../components/dashboard/DashboardHUD';

export const HangarView = () => {
    return (
        <div className="relative w-full h-screen bg-obsidian overflow-hidden" style={{ height: '100vh' }}>
            {/* 3D Scene Layer */}
            <div className="absolute inset-0 z-0">
                <Canvas shadows camera={{ position: [5, 2, 5], fov: 45 }}>
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
