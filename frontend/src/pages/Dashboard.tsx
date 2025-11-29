import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Cpu, HardDrive, Monitor, LogOut, User, Settings, Zap } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { DashboardScene } from '../components/3d/DashboardScene';
import { useUserStore } from '../store/useUserStore';
import { Button } from '../components/ui/Button';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useUserStore();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans selection:bg-neon-red selection:text-white">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-red/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 flex justify-between items-center p-8 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neon-red flex items-center justify-center clip-path-polygon-[0_0,100%_0,100%_70%,80%_100%,0_100%]">
                        <User className="text-black" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xs font-mono text-gray-500 tracking-widest mb-1">OPERATIVE STATUS: ONLINE</h2>
                        <h1 className="text-2xl font-black brand-font uppercase tracking-tighter">{user?.username || 'UNKNOWN_USER'}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                        <Settings size={20} />
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-neon-red hover:bg-neon-red/10">
                        <LogOut size={16} /> LOGOUT
                    </Button>
                </div>
            </header>

            <main className="relative z-10 p-8 h-[calc(100vh-100px)] flex gap-8">
                {/* Left Column - Actions */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="w-1/3 flex flex-col gap-6"
                >
                    {/* New Build Card */}
                    <motion.div variants={item} className="flex-1">
                        <div
                            onClick={() => navigate('/builder')}
                            className="h-full group relative bg-white/5 border border-white/10 p-8 cursor-pointer hover:bg-white/10 transition-all duration-300 overflow-hidden clip-path-polygon-[0_0,100%_0,100%_90%,90%_100%,0_100%]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                                <Plus size={100} className="text-white" strokeWidth={0.5} />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 bg-neon-red rounded-full animate-pulse" />
                                        <span className="text-xs font-mono text-neon-red">SYSTEM READY</span>
                                    </div>
                                    <h3 className="text-5xl font-black brand-font italic mb-2 group-hover:text-neon-red transition-colors leading-none">
                                        INITIATE<br />NEW BUILD
                                    </h3>
                                    <p className="font-mono text-xs text-gray-400 mt-4 max-w-[200px]">
                                        START FROM SCRATCH // CHASSIS SELECTION // COMPONENT CONFIGURATION
                                    </p>
                                </div>
                                <div className="self-end">
                                    <div className="w-16 h-16 rounded-full border-2 border-neon-red flex items-center justify-center group-hover:scale-110 transition-transform bg-black/50 group-hover:bg-neon-red group-hover:text-black">
                                        <Plus size={32} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div variants={item} className="h-1/3 grid grid-cols-2 gap-4">
                        <div className="bg-black/50 border border-white/10 p-6 flex flex-col justify-between hover:border-neon-red/50 transition-colors group">
                            <div className="flex justify-between items-start">
                                <Cpu className="text-gray-500 group-hover:text-neon-red transition-colors" />
                                <span className="text-[10px] font-mono text-gray-600">DB_01</span>
                            </div>
                            <div>
                                <div className="text-4xl font-bold brand-font group-hover:text-white transition-colors">12</div>
                                <div className="text-[10px] font-mono text-gray-500 mt-1">SAVED CONFIGURATIONS</div>
                            </div>
                        </div>
                        <div className="bg-black/50 border border-white/10 p-6 flex flex-col justify-between hover:border-neon-red/50 transition-colors group">
                            <div className="flex justify-between items-start">
                                <Zap className="text-gray-500 group-hover:text-neon-red transition-colors" />
                                <span className="text-[10px] font-mono text-gray-600">DB_02</span>
                            </div>
                            <div>
                                <div className="text-4xl font-bold brand-font group-hover:text-white transition-colors">4</div>
                                <div className="text-[10px] font-mono text-gray-500 mt-1">COMPLETED RIGS</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Column - 3D Preview */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex-1 relative bg-black/20 border border-white/10 overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
                        <div>
                            <h3 className="text-sm font-bold brand-font text-white/80">LAST CONFIGURATION</h3>
                            <p className="text-[10px] font-mono text-neon-red">RTX 4090 // I9-14900K // 64GB DDR5</p>
                        </div>
                        <div className="px-3 py-1 bg-neon-red/10 border border-neon-red text-[10px] font-mono text-neon-red animate-pulse">
                            EDITABLE
                        </div>
                    </div>

                    <div className="absolute inset-0">
                        <Canvas shadows dpr={[1, 2]} camera={{ position: [4, 2, 5], fov: 45 }}>
                            <DashboardScene />
                        </Canvas>
                    </div>

                    <div className="absolute bottom-0 right-0 p-8 z-10 pointer-events-none">
                        <Button onClick={() => navigate('/builder')} className="pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20">
                            RESUME EDITING
                        </Button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};
