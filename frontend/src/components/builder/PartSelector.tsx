import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Button } from '../ui/Button';

const MOCK_PARTS = [
    { id: 'gpu1', name: 'RTX 4090', type: 'gpu', price: 1600, image: 'gpu.png' },
    { id: 'cpu1', name: 'Intel i9-14900K', type: 'cpu', price: 600, image: 'cpu.png' },
    { id: 'ram1', name: 'Corsair 64GB', type: 'ram', price: 300, image: 'ram.png' },
];

export const PartSelector = () => {
    const { setDraggingPart } = useBuilderStore();

    return (
        <div className="absolute left-0 top-0 h-full w-80 bg-black/80 backdrop-blur-md border-r border-white/10 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold brand-font mb-6 text-neon-red">COMPONENTS</h2>

            <div className="space-y-4">
                {MOCK_PARTS.map((part) => (
                    <div
                        key={part.id}
                        className="p-4 border border-white/10 bg-white/5 hover:border-neon-red transition-colors cursor-grab active:cursor-grabbing"
                        onPointerDown={() => setDraggingPart(part)}
                    >
                        <div className="text-sm font-bold">{part.name}</div>
                        <div className="text-xs text-gray-400 font-mono uppercase">{part.type}</div>
                        <div className="text-neon-red font-mono mt-2">${part.price}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
