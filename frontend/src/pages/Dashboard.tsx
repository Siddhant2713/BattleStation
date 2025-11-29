import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Cpu, HardDrive, Monitor, LogOut, User } from 'lucide-react';
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
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 flex justify-between items-center p-8 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neon-red flex items-center justify-center clip-corner-br">
                        <User className="text-black" />
                    </div>
                    <div>
                        <h2 className="text-xs font-mono text-gray-500 tracking-widest">OPERATIVE</h2>
                        <h1 className="text-xl font-bold brand-font uppercase">{user?.username || 'UNKNOWN_USER'}</h1>
                    </div>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut size={16} /> LOGOUT
                </Button>
            </header>

            <main className="relative z-10 p-8 h-[calc(100vh-88px)] flex gap-8">
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
                            className="h-full group relative bg-white/5 border border-white/10 p-8 clip-corner-tl cursor-pointer hover:bg-white/10 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <h3 className="text-4xl font-black brand-font italic mb-2 group-hover:text-neon-red transition-colors">INITIATE<br />NEW BUILD</h3>
                                    <p className="font-mono text-xs text-gray-400">START FROM SCRATCH // CHASSIS SELECTION</p>
                                </div>
                                <div className="self-end">
                                    <div className="w-16 h-16 rounded-full border-2 border-neon-red flex items-center justify-center group-hover:scale-110 transition-transform bg-black/50">
                                        <Plus className="text-neon-red" size={32} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div variants={item} className="h-1/3 grid grid-cols-2 gap-4">
                        <div className="bg-black/50 border border-white/10 p-4 clip-corner-br flex flex-col justify-between hover:border-neon-red/50 transition-colors">
                            <Cpu className="text-neon-red" />
                            <div>
                                <div className="text-2xl font-bold brand-font">12</div>
                                <div className="text-[10px] font-mono text-gray-500">SAVED CONFIGS</div>
                            </div>
                        </div>
                        <div className="bg-black/50 border border-white/10 p-4 clip-corner-br flex flex-col justify-between hover:border-neon-red/50 transition-colors">
                            <Monitor className="text-neon-red" />
                            <div>
                                <div className="text-2xl font-bold brand-font">4</div>
                                <div className="text-[10px] font-mono text-gray-500">COMPLETED RIGS</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Column - 3D Preview */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex-1 relative bg-black/20 border border-white/10 clip-corner-br overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start pointer-events-none">
                        <div>
                            <h3 className="text-sm font-bold brand-font text-white/80">LAST CONFIGURATION</h3>
                            <p className="text-[10px] font-mono text-neon-red">RTX 4090 // I9-14900K</p>
                        </div>
                        <div className="px-2 py-1 bg-neon-red/20 border border-neon-red text-[10px] font-mono text-neon-red">
                            EDITABLE
                        </div>
                    </div>

                    <div className="absolute inset-0">
                        <DashboardScene />
                    </div>

                    <div className="absolute bottom-0 right-0 p-8 z-10 pointer-events-none">
                        <Button onClick={() => navigate('/builder')} className="pointer-events-auto">
                            RESUME EDITING
                        </Button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};
