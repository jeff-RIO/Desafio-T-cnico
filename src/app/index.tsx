import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useStoreStore } from "../app/store/store";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { Fab, FabLabel } from "@/components/ui/fab";

export default function StoresScreen() {
  const { stores, isLoading, fetchStores } = useStoreStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const filteredStores = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return stores;
    }

    return stores.filter((store) => {
      const nameMatch = store.name.toLowerCase().includes(normalizedSearch);
      const addressMatch = store.address
        .toLowerCase()
        .includes(normalizedSearch);

      return nameMatch || addressMatch;
    });
  }, [stores, search]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text size="sm" style={styles.searchLabel}>
          Buscar loja
        </Text>

        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nome ou endereço"
          placeholderTextColor="#94a3b8"
        />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <Spinner size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredStores}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/store/details/${item.id}`)}
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
                  {item.productsCount ?? 0} Produtos
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>
                {search.trim()
                  ? "Nenhuma loja encontrada para a busca."
                  : "Nenhuma loja cadastrada."}
              </Text>
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
  searchContainer: {
    marginBottom: 16,
  },
  searchLabel: {
    marginBottom: 8,
    fontWeight: "bold",
    color: "#334155",
  },
  searchInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#0f172a",
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
