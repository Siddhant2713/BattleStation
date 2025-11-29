import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { RoomScene } from '../components/builder/RoomScene';
import { Button } from '../components/ui/Button';

export const Accessories = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Canvas shadows camera={{ position: [3, 3, 3], fov: 45 }}>
                    <RoomScene />
                </Canvas>
            </div>

            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-auto">
                    <Button variant="ghost" onClick={() => navigate('/builder')} className="flex items-center gap-2">
                        <ArrowLeft size={20} /> BACK TO BUILDER
                    </Button>
                    <h1 className="text-2xl font-black brand-font text-white">ACCESSORIES SETUP</h1>
                </div>

                {/* Accessory Selector (Bottom) */}
                <div className="absolute bottom-0 left-0 w-full p-8 flex justify-center gap-4 pointer-events-auto">
                    {['DESK', 'MONITOR', 'CHAIR', 'PERIPHERALS'].map((item) => (
                        <div key={item} className="bg-black/80 border border-white/10 p-4 hover:border-neon-red cursor-pointer transition-colors">
                            <div className="text-xs font-mono text-gray-400">SELECT</div>
                            <div className="text-lg font-bold brand-font text-white">{item}</div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-0 right-0 p-8 pointer-events-auto">
                    <Button size="lg" onClick={() => navigate('/simulation')} className="flex items-center gap-2">
                        SIMULATION <ArrowRight size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
