import { create } from "zustand";

export type StoreItem = {
  id: string;
  name: string;
  address: string;
  products?: string[];
};

export type ProductItem = {
  id: string;
  name: string;
  category: string;
  price: number;
};

type StoreState = {
  stores: StoreItem[];
  selectedStore: StoreItem | null;
  storeProducts: ProductItem[];
  isLoading: boolean;
  fetchStores: () => Promise<void>;
  fetchStoreById: (id: string) => Promise<void>;
  fetchProductsByStore: (storeId: string) => Promise<void>;
  addStore: (data: { name: string; address: string }) => Promise<void>;
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return response.json();
}

export const useStoreStore = create<StoreState>((set) => ({
  stores: [],
  selectedStore: null,
  storeProducts: [],
  isLoading: false,

  fetchStores: async () => {
    set({ isLoading: true });

    try {
      const data = await request<{ stores: StoreItem[] }>("/mock-api/stores");
      set({ stores: data.stores ?? [] });
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
      set({ stores: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStoreById: async (id: string) => {
    set({ isLoading: true, selectedStore: null });

    try {
      const data = await request<{ store: StoreItem }>(`/mock-api/stores/${id}`);
      set({ selectedStore: data.store ?? null });
    } catch (error) {
      console.error("Erro ao buscar loja:", error);
      set({ selectedStore: null });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProductsByStore: async (storeId: string) => {
    set({ isLoading: true, storeProducts: [] });

    try {
      const data = await request<{ products: ProductItem[] }>(
        `/mock-api/stores/${storeId}/products`
      );
      set({ storeProducts: data.products ?? [] });
    } catch (error) {
      console.error("Erro ao buscar produtos da loja:", error);
      set({ storeProducts: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addStore: async (payload) => {
    set({ isLoading: true });

    try {
      await request("/mock-api/stores", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await request<{ stores: StoreItem[] }>("/mock-api/stores");
      set({ stores: data.stores ?? [] });
    } catch (error) {
      console.error("Erro ao cadastrar loja:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));