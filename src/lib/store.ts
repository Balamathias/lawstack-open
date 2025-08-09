import { create } from 'zustand';

interface StoreState {
    action: 'search' | 'chat' | 'none';
    setAction: (action: 'search' | 'chat' | 'none') => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const useStore = create<StoreState>((set) => ({
    action: 'none',
    setAction: (action) => set({ action }),
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
    searchQuery: '',
    setSearchQuery: (searchQuery) => set({ searchQuery }),
}))
