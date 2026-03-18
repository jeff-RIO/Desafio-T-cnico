export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  storeId: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  products?: Product[];
}