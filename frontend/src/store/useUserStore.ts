import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    user: { id: string; username: string } | null;
    token: string | null;
    login: (user: { id: string; username: string }, token: string) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            login: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
        }),
        {
            name: 'battlestation-user-storage',
        }
    )
);
