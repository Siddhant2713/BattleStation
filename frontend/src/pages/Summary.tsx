import React from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Check, Download, Share2, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export const Summary = () => {
    const navigate = useNavigate();
    const { parts, totalPrice, totalWattage } = useBuilderStore();
    const installedParts = Object.values(parts).filter(Boolean);

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,51,0.1),transparent_70%)] pointer-events-none" />

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-4xl z-10"
            >
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-black brand-font italic mb-4">SYSTEM READY</h1>
                    <p className="font-mono text-neon-red tracking-widest">CONFIGURATION LOCKED // AWAITING DEPLOYMENT</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Parts List */}
                    <div className="md:col-span-2 bg-white/5 border border-white/10 p-8 clip-corner-tl backdrop-blur-md">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Check className="text-neon-red" /> COMPONENT MANIFEST
                        </h2>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {installedParts.length === 0 ? (
                                <div className="text-gray-500 font-mono">NO COMPONENTS INSTALLED</div>
                            ) : (
                                installedParts.map((part: any) => (
                                    <div key={part.id} className="flex justify-between items-center p-3 bg-black/50 border border-white/5">
                                        <div>
                                            <div className="text-xs text-gray-500 font-mono">{part.type}</div>
                                            <div className="font-bold">{part.name}</div>
                                        </div>
                                        <div className="text-neon-red font-mono">${part.price}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 p-8 clip-corner-br backdrop-blur-md">
                            <h2 className="text-xl font-bold mb-6">METRICS</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-mono">EST. WATTAGE</span>
                                    <span className="font-bold text-yellow-500">{totalWattage()}W</span>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-500 font-mono">TOTAL COST</span>
                                    <span className="text-4xl font-black text-neon-red">${totalPrice()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="secondary" className="w-full flex gap-2">
                                <Download size={16} /> EXPORT
                            </Button>
                            <Button variant="secondary" className="w-full flex gap-2">
                                <Share2 size={16} /> SHARE
                            </Button>
                        </div>

                        <Button onClick={() => navigate('/dashboard')} className="w-full flex gap-2">
                            <Home size={16} /> RETURN TO BASE
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
