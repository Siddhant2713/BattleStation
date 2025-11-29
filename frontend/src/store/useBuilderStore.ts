import { create } from 'zustand';

interface Component {
    id: string;
    name: string;
    type: string;
    price: number;
    image: string;
    wattage?: number;
    // Add other specs as needed
}

interface BuilderState {
    selectedParts: Record<string, Component | null>;
    totalPrice: number;
    totalWattage: number;
    draggingPart: Component | null;
    setDraggingPart: (part: Component | null) => void;
    selectPart: (type: string, part: Component) => void;
    removePart: (type: string) => void;
    clearBuild: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
    selectedParts: {
        cpu: null,
        gpu: null,
        motherboard: null,
        ram: null,
        storage: null,
        case: null,
        psu: null,
        cooling: null,
    },
    totalPrice: 0,
    totalWattage: 0,
    draggingPart: null,
    setDraggingPart: (part) => set({ draggingPart: part }),
    selectPart: (type, part) => set((state) => {
        const oldPart = state.selectedParts[type];
        const priceDiff = part.price - (oldPart?.price || 0);
        const wattDiff = (part.wattage || 0) - (oldPart?.wattage || 0);

        return {
            selectedParts: { ...state.selectedParts, [type]: part },
            totalPrice: state.totalPrice + priceDiff,
            totalWattage: state.totalWattage + wattDiff,
        };
    }),
    removePart: (type) => set((state) => {
        const part = state.selectedParts[type];
        if (!part) return state;

        return {
            selectedParts: { ...state.selectedParts, [type]: null },
            totalPrice: state.totalPrice - part.price,
            totalWattage: state.totalWattage - (part.wattage || 0),
        };
    }),
    clearBuild: () => set({
        selectedParts: {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            case: null,
            psu: null,
            cooling: null,
        },
        totalPrice: 0,
        totalWattage: 0,
    }),
}));
