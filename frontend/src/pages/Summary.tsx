import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Download, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useBuilderStore } from '../store/useBuilderStore';

export const Summary = () => {
    const navigate = useNavigate();
    const { selectedParts, totalPrice, totalWattage } = useBuilderStore();

    const partsList = Object.entries(selectedParts).filter(([_, part]) => part !== null);

    return (
        <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Background Particles (CSS or Canvas) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full bg-white/5 border border-white/10 p-8 backdrop-blur-md relative"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-red via-purple-500 to-neon-red" />

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black brand-font mb-2">SYSTEM CONFIGURATION COMPLETE</h1>
                    <p className="text-gray-400 font-mono">READY FOR DEPLOYMENT</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold brand-font text-neon-red border-b border-white/10 pb-2">COMPONENT LIST</h2>
                        {partsList.length > 0 ? (
                            partsList.map(([type, part]) => (
                                <div key={type} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400 uppercase font-mono">{type}</span>
                                    <span className="font-bold">{part?.name}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 italic">No components selected.</div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold brand-font text-neon-red border-b border-white/10 pb-2">PERFORMANCE STATS</h2>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-mono">TOTAL WATTAGE</span>
                            <span className="text-2xl font-bold">{totalWattage}W</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-mono">ESTIMATED COST</span>
                            <span className="text-4xl font-bold text-neon-red">${totalPrice}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <Button onClick={() => navigate('/dashboard')} variant="secondary" className="flex items-center gap-2">
                        <Home size={20} /> DASHBOARD
                    </Button>
                    <Button className="flex items-center gap-2">
                        <Share2 size={20} /> SHARE BUILD
                    </Button>
                    <Button className="flex items-center gap-2">
                        <Download size={20} /> EXPORT PDF
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
