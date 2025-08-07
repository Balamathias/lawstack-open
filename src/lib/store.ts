import { create } from 'zustand';

interface StoreState {
    action: 'search' | 'chat';
    setAction: (action: 'search' | 'chat') => void;
}

export const useStore = create<StoreState>((set) => ({
    action: 'search',
    setAction: (action) => set({ action }),
}))
