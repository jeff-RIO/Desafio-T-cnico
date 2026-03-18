import { create } from "zustand";

export type StoreItem = {
  id: string;
  name: string;
  address: string;
  productsCount: number;
};

export type ProductItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  storeId?: string;
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
  updateStore: (id: string, data: { name: string; address: string }) => Promise<void>;
  removeStore: (id: string) => Promise<void>;
  addProduct: (data: {
    name: string;
    category: string;
    price: number;
    storeId: string;
  }) => Promise<void>;
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

export const useStoreStore = create<StoreState>((set, get) => ({
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

  updateStore: async (id, payload) => {
    set({ isLoading: true });

    try {
      const response = await request<{ store: StoreItem }>(`/mock-api/stores/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const currentStores = get().stores;
      const currentSelectedStore = get().selectedStore;

      set({
        stores: currentStores.map((store) =>
          store.id === id ? response.store : store
        ),
        selectedStore:
          currentSelectedStore?.id === id ? response.store : currentSelectedStore,
      });
    } catch (error) {
      console.error("Erro ao editar loja:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeStore: async (id) => {
    set({ isLoading: true });

    try {
      await request<{ success: boolean }>(`/mock-api/stores/${id}`, {
        method: "DELETE",
      });

      const currentStores = get().stores.filter((store) => store.id !== id);

      set({
        stores: currentStores,
        selectedStore: null,
        storeProducts: [],
      });
    } catch (error) {
      console.error("Erro ao excluir loja:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (payload) => {
    set({ isLoading: true });

    try {
      const response = await request<{ product: ProductItem }>("/mock-api/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const currentProducts = get().storeProducts;
      const currentSelectedStore = get().selectedStore;
      const currentStores = get().stores;

      set({
        storeProducts: [...currentProducts, response.product],
        selectedStore: currentSelectedStore
          ? {
              ...currentSelectedStore,
              productsCount: currentSelectedStore.productsCount + 1,
            }
          : currentSelectedStore,
        stores: currentStores.map((store) =>
          store.id === payload.storeId
            ? { ...store, productsCount: store.productsCount + 1 }
            : store
        ),
      });
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));