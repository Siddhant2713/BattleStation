import React from 'react';
import { RoomScene } from '../components/builder/RoomScene';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Accessories = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex bg-black text-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-black/80 border-r border-white/10 flex flex-col z-10 backdrop-blur-md">
                <div className="p-6 border-b border-white/10 flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="hover:text-neon-red transition-colors">
                        <ChevronLeft />
                    </button>
                    <h1 className="text-xl font-black brand-font italic">BATTLE_ROOM</h1>
                </div>
                <div className="p-6">
                    <p className="text-gray-500 font-mono text-xs">ACCESSORIES CONFIGURATOR COMING SOON</p>
                </div>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 relative">
                <RoomScene />
            </div>
        </div>
    );
};
