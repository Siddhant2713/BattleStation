import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Box, Info } from 'lucide-react';
import { getAllCabinets } from '../config/cabinets';

export const SidebarCabinetSelector = ({ onSelect, selectedId }) => {
    const [isOpen, setIsOpen] = useState(true);
    const cabinets = getAllCabinets();

    return (
        <>
            {/* Sidebar Panel - Optimized: Transform instead of Width */}
            {/* Sidebar Panel - Optimized: Transform instead of Width */}
            <motion.div
                initial={{ x: -320 }}
                animate={{ x: isOpen ? 0 : -320 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }} // Snappy but smooth
                className="w-80 h-full bg-black/80 backdrop-blur-xl border-r border-white/10 overflow-hidden flex flex-col fixed left-0 top-24 bottom-0 z-40"
            >
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-black brand-font italic flex items-center gap-2">
                        <Box className="text-neon-red" />
                        CHASSIS SELECT
                    </h2>
                    <p className="text-[10px] font-mono text-gray-500 mt-1">
                        SELECT ACTIVE FRAMEWORK
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                    {cabinets.map((cabinet) => (
                        <motion.div
                            key={cabinet.id}
                            onClick={() => onSelect(cabinet.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                                relative group cursor-pointer border p-4 transition-all duration-300
                                ${selectedId === cabinet.id
                                    ? 'bg-neon-red/10 border-neon-red'
                                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}
                            `}
                        >
                            {/* Active Indicator */}
                            {selectedId === cabinet.id && (
                                <div className="absolute top-2 right-2 w-2 h-2 bg-neon-red rounded-full animate-pulse shadow-[0_0_10px_#ff2a00]" />
                            )}

                            {/* Thumbnail Placeholder */}
                            <div className="w-full h-32 bg-black/50 mb-4 rounded-sm overflow-hidden relative">
                                {cabinet.thumbnail ? (
                                    <img
                                        src={cabinet.thumbnail}
                                        alt={cabinet.name}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-mono text-xs hidden">
                                    NO PREVIEW
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className={`font-bold brand-font text-lg ${selectedId === cabinet.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                        {cabinet.name}
                                    </h3>
                                    <p className="text-[10px] font-mono text-gray-500 line-clamp-2 mt-1">
                                        {cabinet.description}
                                    </p>
                                </div>
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-red/0 via-neon-red/0 to-neon-red/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10 bg-black/90">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                        <Info size={12} />
                        <span>{cabinets.length} MODULES AVAILABLE</span>
                    </div>
                </div>
            </motion.div>

            {/* Toggle Button - Independent Floating Element */}
            <motion.div
                animate={{ x: isOpen ? 320 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-1/2 -translate-y-1/2 left-0 z-50 pointer-events-auto"
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-6 h-12 bg-neon-red flex items-center justify-center hover:w-8 transition-all clip-path-polygon-[0_0,100%_10%,100%_90%,0_100%] shadow-[0_0_15px_rgba(255,42,0,0.5)]"
                >
                    <ChevronRight
                        size={16}
                        className={`text-black transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
            </motion.div>
        </>
    );
};
