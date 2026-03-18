import { useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useStoreStore } from "../features/stores/store";

export default function StoresScreen() {
  const { stores, isLoading, fetchStores } = useStoreStore();

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f5f5f5" }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "white",
                padding: 16,
                marginBottom: 12,
                borderRadius: 8,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text style={{ color: "gray", marginTop: 4 }}>
                {item.address}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text>Nenhuma loja cadastrada.</Text>}
        />
      )}
    </View>
  );
}
