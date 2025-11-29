import { create } from 'zustand';
import { PCPart, PartType, BuildState, AccessoryType, Accessory } from '../types';

interface BuilderStore extends BuildState {
    draggingPart: PCPart | null;
    setDraggingPart: (part: PCPart | null) => void;
    setPart: (type: PartType, part: PCPart) => void;
    removePart: (type: PartType) => void;
    setAccessory: (type: AccessoryType, accessory: Accessory) => void;
    resetBuild: () => void;
    totalPrice: () => number;
    totalWattage: () => number;
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
    parts: {},
    accessories: {},
    draggingPart: null,
    setDraggingPart: (part) => set({ draggingPart: part }),
    setPart: (type, part) => set((state) => ({ parts: { ...state.parts, [type]: part } })),
    removePart: (type) => set((state) => {
        const newParts = { ...state.parts };
        delete newParts[type];
        return { parts: newParts };
    }),
    setAccessory: (type, accessory) => set((state) => ({ accessories: { ...state.accessories, [type]: accessory } })),
    resetBuild: () => set({ parts: {}, accessories: {} }),
    totalPrice: () => {
        const { parts } = get();
        return Object.values(parts).reduce((sum, part) => sum + (part?.price || 0), 0);
    },
    totalWattage: () => {
        const { parts } = get();
        return Object.values(parts).reduce((sum, part) => sum + (part?.power || 0), 0);
    },
}));
