import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Thermometer, Cpu, Zap, Settings, Power } from 'lucide-react';

export const DashboardHUD = () => {
    const [metrics, setMetrics] = useState({
        cpuTemp: 45,
        gpuTemp: 52,
        ramUsage: 32,
        power: 120
    });

    // Simulate live metrics
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                cpuTemp: Math.min(85, Math.max(35, prev.cpuTemp + (Math.random() - 0.5) * 5)),
                gpuTemp: Math.min(90, Math.max(40, prev.gpuTemp + (Math.random() - 0.5) * 5)),
                ramUsage: Math.min(100, Math.max(10, prev.ramUsage + (Math.random() - 0.5) * 2)),
                power: Math.min(500, Math.max(80, prev.power + (Math.random() - 0.5) * 10))
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Tooltip State (Mock for now, would connect to 3D hover state via store)
    const [tooltip, setTooltip] = useState<{ x: number, y: number, text: string } | null>(null);

    return (
        <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-20">
            {/* Top Bar */}
            <header className="flex justify-between items-start">
                <div className="glass-panel px-6 py-3 clip-corner-br flex items-center gap-4">
                    <h1 className="text-2xl font-black brand-font tracking-tighter">
                        BATTLE<span className="text-neon-crimson">STATION</span>
                    </h1>
                    <span className="text-xs font-mono text-white/50">V.2.0.4 [ONLINE]</span>
                </div>

                <div className="flex gap-4">
                    <MetricCard label="CPU TEMP" value={`${metrics.cpuTemp.toFixed(0)}°C`} icon={<Thermometer size={16} />} color="text-neon-blue" />
                    <MetricCard label="GPU TEMP" value={`${metrics.gpuTemp.toFixed(0)}°C`} icon={<Activity size={16} />} color="text-neon-crimson" />
                    <MetricCard label="RAM" value={`${metrics.ramUsage.toFixed(0)}%`} icon={<Cpu size={16} />} color="text-neon-yellow" />
                </div>
            </header>

            {/* Tooltip (Dynamic) */}
            <AnimatePresence>
                {tooltip && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute pointer-events-none z-50"
                        style={{ left: tooltip.x, top: tooltip.y }}
                    >
                        <div className="glass-panel px-4 py-2 border-l-2 border-neon-crimson">
                            <span className="text-xs font-mono text-neon-crimson tracking-widest uppercase">{tooltip.text}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Bar */}
            <footer className="flex justify-between items-end">
                <div className="glass-panel p-6 clip-corner-tl w-64">
                    <h3 className="text-neon-yellow font-mono text-xs mb-4 tracking-widest">SYSTEM STATUS</h3>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex justify-between">
                            <span className="text-white/50">POWER</span>
                            <span className="text-neon-blue">STABLE</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/50">NETWORK</span>
                            <span className="text-neon-blue">CONNECTED</span>
                        </div>
                        <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-neon-crimson"
                                initial={{ width: "30%" }}
                                animate={{ width: `${metrics.ramUsage}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pointer-events-auto">
                    <IconButton icon={<Settings size={20} />} />
                    <IconButton icon={<Power size={20} />} danger />
                </div>
            </footer>
        </div>
    );
};

const MetricCard = ({ label, value, icon, color }: any) => (
    <div className="glass-panel px-4 py-2 min-w-[120px]">
        <div className={`flex items-center gap-2 ${color} mb-1`}>
            {icon}
            <span className="text-[10px] font-mono tracking-wider">{label}</span>
        </div>
        <div className="text-xl font-bold font-mono">{value}</div>
    </div>
);

const IconButton = ({ icon, danger }: any) => (
    <button className={`p-4 glass-panel hover:bg-white/10 transition-colors ${danger ? 'text-neon-crimson hover:bg-neon-crimson/20' : 'text-white'}`}>
        {icon}
    </button>
);
