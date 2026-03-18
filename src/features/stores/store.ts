import { create } from 'zustand';
import { Store } from './types';
import { StoreRepository } from './services/storeRepository';

interface StoreState {
  stores: Store[];
  isLoading: boolean;
  fetchStores: () => Promise<void>;
  addStore: (store: Omit<Store, 'id'>) => Promise<void>;
}

export const useStoreStore = create<StoreState>((set) => ({
  stores: [],
  isLoading: false,

  fetchStores: async () => {
    set({ isLoading: true });
    try {
      const stores = await StoreRepository.getStores();
      set({ stores, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  addStore: async (store) => {
    set({ isLoading: true });
    try {
      const newStore = await StoreRepository.createStore(store);
      set((state) => ({
        stores: [...state.stores, newStore],
        isLoading: false
      }));
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  }
}));