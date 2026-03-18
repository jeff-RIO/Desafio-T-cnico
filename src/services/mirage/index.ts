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
        return schema.all("store");
      });

      this.get("/stores/:id", (schema, request) => {
        const store = schema.find("store", request.params.id);

        if (!store) {
          return new Response(404, {}, { error: "Loja não encontrada" });
        }

        return store;
      });

      this.post("/stores", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create("store", attrs);
      });

      this.get("/stores/:id/products", (schema, request) => {
        const store = schema.find("store", request.params.id);

        if (!store) {
          return new Response(404, {}, { error: "Loja não encontrada" });
        }

        return store.products.models;
      });

      this.passthrough("http://localhost:8081/**");
      this.passthrough("/_expo/**");
      this.passthrough();
    },
  });
}