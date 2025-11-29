import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { BuilderScene } from '../components/builder/BuilderScene';
import { PartSelector } from '../components/builder/PartSelector';
import { Button } from '../components/ui/Button';
import { useBuilderStore } from '../store/useBuilderStore';

export const Builder = () => {
    const navigate = useNavigate();
    const { totalPrice, totalWattage } = useBuilderStore();

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden">
            {/* 3D Canvas */}
            <div className="absolute inset-0 z-0">
                <Canvas shadows camera={{ position: [5, 5, 5], fov: 45 }}>
                    <BuilderScene />
                </Canvas>
            </div>

            {/* UI Overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Header */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-auto">
                    <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                        <ArrowLeft size={20} /> BACK TO DASHBOARD
                    </Button>

                    <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 clip-corner-br">
                        <div className="flex gap-8 text-right">
                            <div>
                                <div className="text-[10px] font-mono text-gray-500">EST. WATTAGE</div>
                                <div className="text-xl font-bold brand-font text-white">{totalWattage}W</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-mono text-gray-500">TOTAL COST</div>
                                <div className="text-xl font-bold brand-font text-neon-red">${totalPrice}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Part Selector (Left Sidebar) */}
                <div className="pointer-events-auto">
                    <PartSelector />
                </div>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 right-0 p-8 pointer-events-auto">
                    <Button size="lg" className="flex items-center gap-2">
                        <Save size={20} /> SAVE CONFIGURATION
                    </Button>
                </div>
            </div>
        </div>
    );
};
