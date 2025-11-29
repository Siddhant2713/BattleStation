import React, { useEffect, useState } from 'react';
import { SimulationScene } from '../components/builder/SimulationScene';
import { ChevronLeft, Activity, Cpu, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Simulation = () => {
    const navigate = useNavigate();
    const [fps, setFps] = useState(0);
    const [cpuLoad, setCpuLoad] = useState(0);
    const [gpuLoad, setGpuLoad] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFps(Math.floor(120 + Math.random() * 40));
            setCpuLoad(Math.floor(40 + Math.random() * 20));
            setGpuLoad(Math.floor(80 + Math.random() * 20));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen flex flex-col bg-black text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start pointer-events-none">
                <button onClick={() => navigate('/builder')} className="pointer-events-auto hover:text-neon-red transition-colors flex items-center gap-2">
                    <ChevronLeft /> <span className="font-bold brand-font">ABORT SIMULATION</span>
                </button>

                <div className="flex flex-col items-end">
                    <div className="text-4xl font-black brand-font text-neon-red animate-pulse">
                        {fps} <span className="text-sm text-white">FPS</span>
                    </div>
                    <div className="text-xs font-mono text-gray-500">CYBERPUNK 2077 // ULTRA PRESET</div>
                </div>
            </div>

            <div className="flex-1 relative">
                <SimulationScene />

                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Crosshair */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-neon-red rounded-full" />
                    </div>

                    {/* Bottom Stats */}
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 clip-corner-tl w-64">
                            <div className="flex items-center gap-2 mb-2 text-neon-red font-bold">
                                <Cpu size={16} /> CPU LOAD
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-neon-red"
                                    animate={{ width: `${cpuLoad}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <div className="text-right font-mono text-xs mt-1">{cpuLoad}%</div>
                        </div>

                        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 clip-corner-br w-64">
                            <div className="flex items-center gap-2 mb-2 text-neon-red font-bold">
                                <Activity size={16} /> GPU LOAD
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-neon-red"
                                    animate={{ width: `${gpuLoad}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <div className="text-right font-mono text-xs mt-1">{gpuLoad}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
