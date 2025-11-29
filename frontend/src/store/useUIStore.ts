import { create } from 'zustand';

interface UIState {
    isLoading: boolean;
    loadingMessage: string;
    setLoading: (isLoading: boolean, message?: string) => void;
    activeModal: string | null;
    openModal: (modalName: string) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isLoading: false,
    loadingMessage: '',
    setLoading: (isLoading, message = '') => set({ isLoading, loadingMessage: message }),
    activeModal: null,
    openModal: (modalName) => set({ activeModal: modalName }),
    closeModal: () => set({ activeModal: null }),
}));
