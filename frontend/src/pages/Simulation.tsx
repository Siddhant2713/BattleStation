import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { SimulationScene } from '../components/builder/SimulationScene';
import { SimulationPanel } from '../components/ui/SimulationPanel';
import { Button } from '../components/ui/Button';

export const Simulation = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Canvas shadows>
                    <SimulationScene />
                </Canvas>
            </div>

            <div className="absolute inset-0 z-10 pointer-events-none flex">
                <div className="flex-1 p-6 flex flex-col justify-between pointer-events-auto">
                    <Button variant="ghost" onClick={() => navigate('/accessories')} className="self-start flex items-center gap-2">
                        <ArrowLeft size={20} /> BACK TO ACCESSORIES
                    </Button>

                    <div className="self-start">
                        <h1 className="text-4xl font-black brand-font text-white mb-2">GAME SIMULATION</h1>
                        <p className="text-gray-400 font-mono">TESTING CONFIGURATION PERFORMANCE</p>
                    </div>

                    <Button size="lg" onClick={() => navigate('/summary')} className="self-start flex items-center gap-2">
                        FINALIZE BUILD <CheckCircle size={20} />
                    </Button>
                </div>

                <div className="pointer-events-auto">
                    <SimulationPanel />
                </div>
            </div>
        </div>
    );
};
