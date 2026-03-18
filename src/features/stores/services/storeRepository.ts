import { Store } from '../types';

export const StoreRepository = {
  getStores: async (): Promise<Store[]> => {
    const response = await fetch('/mock-api/stores');
    const data = await response.json();
    return data.stores;
  },

  createStore: async (store: Omit<Store, 'id'>): Promise<Store> => {
    const response = await fetch('/mock-api/stores', {
      method: 'POST',
      body: JSON.stringify(store),
    });
    const data = await response.json();
    return data.store;
  }
};