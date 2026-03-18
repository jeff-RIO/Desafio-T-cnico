import { createServer, Model, hasMany, belongsTo, Response } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    models: {
      store: Model.extend({
        products: hasMany(),
      }),
      product: Model.extend({
        store: belongsTo(),
      }),
    },

    seeds(server) {
      const store1 = server.create("store", {
        name: "Filial Centro",
        address: "Rua das Flores, 123",
      } as any);

      const store2 = server.create("store", {
        name: "Filial Sul",
        address: "Av. Paulista, 1000",
      } as any);

      server.create("product", {
        name: "Notebook Dell",
        category: "Eletrônicos",
        price: 4500,
        store: store1,
      } as any);

      server.create("product", {
        name: "Cadeira Ergonômica",
        category: "Móveis",
        price: 1200,
        store: store1,
      } as any);

      server.create("product", {
        name: "Mouse Sem Fio",
        category: "Eletrônicos",
        price: 150,
        store: store2,
      } as any);
    },

    routes() {
      this.namespace = "mock-api";
      this.timing = 750;

      this.get("/stores", (schema) => {
        const stores = schema.all("store").models;

        return {
          stores: stores.map((store: any) => ({
            id: store.id,
            name: store.name,
            address: store.address,
            productsCount: store.products.models.length,
          })),
        };
      });

      this.get("/stores/:id", (schema, request) => {
        const store: any = schema.find("store", request.params.id);

        if (!store) {
          return new Response(404, {}, { error: "Loja não encontrada" });
        }

        return {
          store: {
            id: store.id,
            name: store.name,
            address: store.address,
            productsCount: store.products.models.length,
          },
        };
      });

      this.post("/stores", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const store: any = schema.create("store", attrs);

        return {
          store: {
            id: store.id,
            name: store.name,
            address: store.address,
            productsCount: 0,
          },
        };
      });

      this.put("/stores/:id", (schema, request) => {
        const store: any = schema.find("store", request.params.id);

        if (!store) {
          return new Response(404, {}, { error: "Loja não encontrada" });
        }

        const attrs = JSON.parse(request.requestBody);
        store.update(attrs);

        return {
          store: {
            id: store.id,
            name: store.name,
            address: store.address,
            productsCount: store.products.models.length,
          },
        };
      });

      this.delete("/stores/:id", (schema, request) => {
        const store: any = schema.find("store", request.params.id);

        if (!store) {
          return new Response(404, {}, { error: "Loja não encontrada" });
        }

        store.products.models.forEach((product: any) => product.destroy());
        store.destroy();

        return { success: true };
      });

      this.get("/stores/:id/products", (schema, request) => {
        const store: any = schema.find("store", request.params.id);

        if (!store) {
          return new Response(404, {}, { error: "Loja não encontrada" });
        }

        return {
          products: store.products.models.map((product: any) => ({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            storeId: store.id,
          })),
        };
      });

      this.post("/products", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const store: any = schema.find("store", attrs.storeId);

        if (!store) {
          return new Response(404, {}, { error: "Loja não encontrada" });
        }

        const product: any = schema.create("product", {
          name: attrs.name,
          category: attrs.category,
          price: attrs.price,
          store,
        });

        return {
          product: {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            storeId: store.id,
          },
        };
      });

      this.passthrough("http://localhost:8081/**");
      this.passthrough("/_expo/**");
      this.passthrough();
    },
  });
}