import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Box } from 'lucide-react';
import { getAllCabinets } from '../config/cabinets';

export const BottomCabinetSelector = ({ onSelect, selectedId }) => {
    const cabinets = getAllCabinets();
    const currentIndex = cabinets.findIndex(c => c.id === selectedId);

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % cabinets.length;
        onSelect(cabinets[nextIndex].id);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + cabinets.length) % cabinets.length;
        onSelect(cabinets[prevIndex].id);
    };

    const currentCabinet = cabinets[currentIndex];

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4 w-full max-w-2xl pointer-events-none">

            {/* Main Selector Control */}
            <div className="flex items-center gap-8 pointer-events-auto">
                {/* Prev Button */}
                <button
                    onClick={handlePrev}
                    className="group relative w-12 h-12 flex items-center justify-center bg-black/50 border border-white/10 hover:border-neon-red/50 hover:bg-neon-red/10 transition-all duration-300 clip-path-polygon-[20%_0,100%_0,80%_100%,0%_100%]"
                >
                    <ChevronLeft className="text-white group-hover:text-neon-red transition-colors" size={24} />
                </button>

                {/* Center Display */}
                <div className="relative min-w-[300px] text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentCabinet.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <div className="flex items-center gap-2 mb-1 justify-center">
                                <Box size={14} className="text-neon-red" />
                                <span className="text-[10px] font-mono text-neon-red tracking-widest">CHASSIS MODULE</span>
                            </div>
                            <h2 className="text-3xl font-black brand-font italic text-white uppercase tracking-tighter">
                                {currentCabinet.name}
                            </h2>
                            <p className="text-[10px] font-mono text-gray-400 mt-1 max-w-[250px] line-clamp-1">
                                {currentCabinet.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress Indicators */}
                    <div className="flex justify-center gap-1 mt-4">
                        {cabinets.map((c, idx) => (
                            <div
                                key={c.id}
                                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-neon-red' : 'w-2 bg-white/20'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    className="group relative w-12 h-12 flex items-center justify-center bg-black/50 border border-white/10 hover:border-neon-red/50 hover:bg-neon-red/10 transition-all duration-300 clip-path-polygon-[20%_0,100%_0,80%_100%,0%_100%]"
                >
                    <ChevronRight className="text-white group-hover:text-neon-red transition-colors" size={24} />
                </button>
            </div>
        </div>
    );
};
