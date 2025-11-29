import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { LoginScene } from '../components/3d/LoginScene';
import { HolographicLogo } from '../components/login/HolographicLogo';
import { LoginForm } from '../components/login/LoginForm';

export const Login = () => {
    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* 3D Background Layer */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <LoginScene />
                </Canvas>
            </div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80" />

            {/* Scanline Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoNHYxSDB6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-20" />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
                <HolographicLogo />
                <LoginForm />
            </div>

            {/* Footer Status */}
            <div className="absolute bottom-8 left-8 text-[10px] font-mono text-white/20 tracking-widest pointer-events-none">
                <div>SECURE CONNECTION ESTABLISHED</div>
                <div>LATENCY: 12ms</div>
                <div>ENCRYPTION: AES-256</div>
            </div>

            <div className="absolute bottom-8 right-8 text-[10px] font-mono text-white/20 tracking-widest pointer-events-none text-right">
                <div>SYSTEM V.2.0.4</div>
                <div>SERVER: US-EAST-1</div>
            </div>
        </div>
    );
};

