import { useEffect } from "react";
import { FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useStoreStore } from "../features/stores/store";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { Fab, FabLabel } from "@/components/ui/fab";

export default function StoresScreen() {
  const { stores, isLoading, fetchStores } = useStoreStore();

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.center}>
          <Spinner size="large" />
        </View>
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/store/${item.id}`)}
              style={styles.card}
            >
              <Heading size="md" style={styles.title}>
                {item.name}
              </Heading>
              <Text size="sm" style={styles.address}>
                {item.address}
              </Text>
              <View style={styles.badge}>
                <Text size="xs" style={styles.badgeText}>
                  {item.products ? item.products.length : 0} Produtos
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>Nenhuma loja cadastrada.</Text>
            </View>
          }
        />
      )}

      <Fab
        placement="bottom right"
        size="md"
        onPress={() => router.push("/store/new")}
      >
        <FabLabel>+ Nova Loja</FabLabel>
      </Fab>
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
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    marginBottom: 4,
  },
  address: {
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
});
