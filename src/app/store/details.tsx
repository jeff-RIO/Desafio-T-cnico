import { useEffect, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Button, ButtonText } from "@/components/ui/button";
import { useStoreStore } from "../store/store";

export default function StoreDetailsScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();

  const storeId = useMemo(() => {
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params.id]);

  const {
    selectedStore,
    storeProducts,
    isLoading,
    fetchStoreById,
    fetchProductsByStore,
  } = useStoreStore();

  useEffect(() => {
    if (!storeId) return;

    fetchStoreById(storeId);
    fetchProductsByStore(storeId);
  }, [storeId, fetchStoreById, fetchProductsByStore]);

  if (isLoading && !selectedStore) {
    return (
      <View style={styles.center}>
        <Spinner size="large" />
      </View>
    );
  }

  if (!selectedStore) {
    return (
      <View style={styles.center}>
        <Text>Loja não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.storeCard}>
        <Heading size="xl" style={styles.storeName}>
          {selectedStore.name}
        </Heading>

        <Text size="md" style={styles.storeAddress}>
          {selectedStore.address}
        </Text>

        <View style={styles.badge}>
          <Text size="xs" style={styles.badgeText}>
            {storeProducts.length} Produto
            {storeProducts.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      <Button
        style={styles.addButton}
        onPress={() => router.push(`/product/new?storeId=${storeId}`)}
      >
        <ButtonText>+ Novo Produto</ButtonText>
      </Button>

      <Heading size="lg" style={styles.sectionTitle}>
        Produtos da Loja
      </Heading>

      <FlatList
        data={storeProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          storeProducts.length === 0
            ? styles.emptyContainer
            : styles.listContent
        }
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.productHeader}>
              <Heading size="sm">{item.name}</Heading>
              <Text size="sm" style={styles.price}>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(item.price)}
              </Text>
            </View>

            <Text size="sm" style={styles.category}>
              Categoria: {item.category}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Nenhum produto cadastrado para esta loja.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  storeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  storeName: {
    marginBottom: 8,
  },
  storeAddress: {
    color: "#64748b",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#e0f2fe",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: "#0284c7",
    fontWeight: "bold",
  },
  addButton: {
    marginBottom: 16,
    backgroundColor: "#0284c7",
  },
  sectionTitle: {
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 24,
  },
  productCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 12,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    marginTop: 8,
    color: "#64748b",
  },
  price: {
    color: "#0284c7",
    fontWeight: "bold",
  },
});
