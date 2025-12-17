import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Cpu, HardDrive, Monitor, LogOut, User, Settings, Zap } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { DashboardScene } from '../components/3d/DashboardScene';
import { useUserStore } from '../store/useUserStore';
import { Button } from '../components/ui/Button';
import { BottomCabinetSelector } from '../components/BottomCabinetSelector.jsx';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useUserStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const [selectedCabinetId, setSelectedCabinetId] = React.useState('ducati-monster');

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans selection:bg-neon-red selection:text-white">
            {/* Background Grid - Enhanced */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80 pointer-events-none" />

            {/* Ambient Glow - Subtle */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-neon-red/5 blur-[150px] rounded-full pointer-events-none" />

            {/* Navbar - Glassmorphic & Minimal */}
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 pointer-events-none">
                <div className="flex items-center gap-4 pointer-events-auto">
                    {/* Logo */}
                    <div className="w-12 h-12 flex items-center justify-center">
                        <img
                            src="/battlestation_logo_v3.png"
                            alt="BattleStation Logo"
                            className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,42,0,0.8)]"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black brand-font italic tracking-tighter text-white leading-none">
                            BATTLE<span className="text-neon-red">STATION</span>
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <h2 className="text-[10px] font-mono text-gray-500 tracking-widest">SYSTEM ONLINE</h2>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 pointer-events-auto">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-xs font-bold text-white">{user?.username || 'OPERATOR'}</span>
                        <span className="text-[10px] font-mono text-neon-red">LEVEL 1 CLEARANCE</span>
                    </div>
                    <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all">
                        <Settings size={20} />
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className="text-gray-400 hover:text-neon-red hover:bg-neon-red/10 rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all">
                        <LogOut size={20} />
                    </Button>
                </div>
            </header>

            {/* Main Content - Full Screen 3D View */}
            <main className="relative w-full h-screen overflow-hidden">
                {/* 3D Scene */}
                <div className="absolute inset-0 z-0">
                    <Canvas
                        shadows
                        camera={{ position: [4, 2, 5], fov: 45 }}
                        gl={{ antialias: true }}
                    >
                        <DashboardScene cabinetId={selectedCabinetId} />
                    </Canvas>
                </div>

                {/* Overlay Stats - Floating */}
                <div className="absolute top-24 right-8 z-10 flex flex-col gap-3 pointer-events-none">
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-lg flex items-center gap-4 w-48"
                    >
                        <div className="w-10 h-10 bg-white/5 rounded-md flex items-center justify-center text-neon-red">
                            <Cpu size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold brand-font text-white leading-none">12</div>
                            <div className="text-[9px] font-mono text-gray-400">SAVED CONFIGS</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-lg flex items-center gap-4 w-48"
                    >
                        <div className="w-10 h-10 bg-white/5 rounded-md flex items-center justify-center text-neon-red">
                            <Zap size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold brand-font text-white leading-none">04</div>
                            <div className="text-[9px] font-mono text-gray-400">COMPLETED</div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Cabinet Selector */}
                <BottomCabinetSelector
                    selectedId={selectedCabinetId}
                    onSelect={setSelectedCabinetId}
                />
            </main>
        </div>
    );
};
