import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SceneContainer } from '../components/3d/SceneContainer';
import { motion } from 'framer-motion';
import { Cpu, Monitor, Settings, Power, Box } from 'lucide-react';

export const HangarView = () => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="relative w-full h-screen bg-obsidian overflow-hidden">
            {/* 3D Scene Background */}
            <div className="absolute inset-0 z-0">
                <SceneContainer cameraPosition={[5, 5, 10]}>
                    {/* Placeholder for Desk and PC Case */}
                    <mesh
                        position={[0, 0, 0]}
                        onClick={() => navigate('/builder')}
                        onPointerOver={() => setIsHovered(true)}
                        onPointerOut={() => setIsHovered(false)}
                    >
                        <boxGeometry args={[2, 4, 4]} />
                        <meshStandardMaterial
                            color={isHovered ? "#FF003C" : "#1F2833"}
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </mesh>
                    {/* Desk Surface */}
                    <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[20, 20]} />
                        <meshStandardMaterial color="#050608" metalness={0.5} roughness={0.5} />
                    </mesh>
                </SceneContainer>
            </div>

            {/* HUD Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">
                {/* Top Bar */}
                <header className="flex justify-between items-center pointer-events-auto">
                    <div className="glass-panel px-6 py-3 rounded-br-2xl flex items-center gap-4">
                        <h1 className="text-2xl font-tech tracking-widest text-neon-crimson">BATTLESTATION</h1>
                        <span className="text-xs text-carbon-light font-mono">V.2.0.4 [ONLINE]</span>
                    </div>
                    <div className="glass-panel px-4 py-2 rounded-bl-2xl flex gap-4 text-sm font-mono text-neon-blue">
                        <span>CPU: 34°C</span>
                        <span>GPU: 42°C</span>
                        <span>RAM: 12%</span>
                    </div>
                </header>

                {/* Center Interaction Hint */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isHovered ? 1 : 0.5, y: 0 }}
                        className="text-white font-tech tracking-[0.5em] text-lg"
                    >
                        {isHovered ? "CLICK TO INITIALIZE" : "SYSTEM STANDBY"}
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <footer className="flex justify-between items-end pointer-events-auto">
                    {/* Status Panel */}
                    <div className="glass-panel-heavy p-6 rounded-tr-2xl w-64">
                        <h3 className="text-neon-yellow font-mono text-xs mb-2">SYSTEM STATUS</h3>
                        <div className="space-y-2 font-mono text-sm text-carbon-light">
                            <div className="flex justify-between">
                                <span>POWER</span>
                                <span className="text-neon-blue">STABLE</span>
                            </div>
                            <div className="flex justify-between">
                                <span>NETWORK</span>
                                <span className="text-neon-blue">CONNECTED</span>
                            </div>
                            <div className="w-full bg-carbon-dark h-1 mt-2 rounded-full overflow-hidden">
                                <div className="bg-neon-crimson h-full w-[75%] animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Action Menu */}
                    <div className="flex gap-2">
                        <button className="glass-panel p-4 hover:bg-neon-crimson/20 transition-colors group">
                            <Settings className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                        </button>
                        <button className="glass-panel p-4 hover:bg-neon-crimson/20 transition-colors">
                            <Power className="w-6 h-6 text-neon-crimson" />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};
