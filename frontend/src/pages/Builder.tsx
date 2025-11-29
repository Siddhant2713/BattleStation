import React, { useEffect, useState } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { BuilderScene } from '../components/builder/BuilderScene';
import { getComponents } from '../services/api';
import { PartType, PCPart } from '../types';
import { ChevronLeft, ShoppingCart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const Builder = () => {
    const navigate = useNavigate();
    const { setDraggingPart, totalPrice, totalWattage } = useBuilderStore();
    const [components, setComponents] = useState<PCPart[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<PartType>(PartType.CASE);

    useEffect(() => {
        getComponents().then(setComponents).catch(console.error);
    }, []);

    const filteredComponents = components.filter(c => c.type === selectedCategory);

    return (
        <div className="h-screen flex bg-black text-white overflow-hidden select-none">
            {/* Sidebar */}
            <div className="w-96 bg-black/90 border-r border-white/10 flex flex-col z-20 backdrop-blur-xl shadow-[5px_0_30px_rgba(0,0,0,0.5)]">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="hover:text-neon-red transition-colors">
                        <ChevronLeft />
                    </button>
                    <h1 className="text-xl font-black brand-font italic">ASSEMBLY_LINE</h1>
                </div>

                {/* Categories */}
                <div className="p-4 grid grid-cols-4 gap-2 border-b border-white/10">
                    {Object.values(PartType).map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedCategory(type)}
                            className={`p-2 text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 clip-corner-br ${selectedCategory === type
                                    ? 'bg-neon-red text-white border-neon-red shadow-[0_0_10px_rgba(255,0,51,0.5)]'
                                    : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Component List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {filteredComponents.length === 0 ? (
                        <div className="text-center text-gray-500 font-mono text-xs py-10">NO COMPONENTS FOUND</div>
                    ) : (
                        filteredComponents.map(part => (
                            <div
                                key={part.id}
                                className="group relative bg-white/5 border border-white/10 p-4 clip-corner-tl cursor-grab active:cursor-grabbing hover:bg-white/10 hover:border-neon-red/50 transition-all duration-300"
                                onPointerDown={() => setDraggingPart(part)}
                            >
                                <div className="absolute top-0 right-0 w-2 h-2 bg-white/10 group-hover:bg-neon-red transition-colors" />

                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-sm brand-font group-hover:text-neon-red transition-colors">{part.name}</h3>
                                    <div className="px-2 py-0.5 bg-black/50 border border-white/10 text-[10px] font-mono text-neon-red">
                                        ${part.price}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
                                    {part.power && (
                                        <span className="flex items-center gap-1">
                                            <Zap size={10} className="text-yellow-500" /> {part.power}W
                                        </span>
                                    )}
                                    {part.specs && <span>{part.specs}</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Stats */}
                <div className="p-6 bg-black/50 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-gray-500">TOTAL DRAW</span>
                        <span className="text-lg font-bold font-mono text-yellow-500 flex items-center gap-2">
                            <Zap size={16} /> {totalWattage()}W
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-gray-500">ESTIMATED COST</span>
                        <span className="text-2xl font-black brand-font text-white flex items-center gap-2">
                            <ShoppingCart size={20} className="text-neon-red" /> ${totalPrice()}
                        </span>
                    </div>
                    <Button className="w-full" onClick={() => navigate('/summary')}>
                        FINALIZE BUILD
                    </Button>
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 relative bg-gradient-to-b from-gray-900 to-black" onPointerUp={() => setDraggingPart(null)}>
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

                <BuilderScene />

                {/* Overlay Instructions */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
                    <p className="text-white/20 font-mono text-xs tracking-[0.5em] uppercase">
                        Drag components to install
                    </p>
                </div>
            </div>
        </div>
    );
};
