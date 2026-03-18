import { useEffect, useMemo, useState } from "react";
import { Alert, Platform, StyleSheet, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useStoreStore } from "../store/store";

export default function EditStoreScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();

  const storeId = useMemo(() => {
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params.id]);

  const { selectedStore, isLoading, fetchStoreById, updateStore } =
    useStoreStore();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!storeId) return;
    fetchStoreById(storeId);
  }, [storeId, fetchStoreById]);

  useEffect(() => {
    if (!selectedStore) return;
    setName(selectedStore.name);
    setAddress(selectedStore.address);
  }, [selectedStore]);

  const showError = (message: string) => {
    if (Platform.OS === "web") {
      window.alert(message);
      return;
    }

    Alert.alert("Erro", message);
  };

  const handleSave = async () => {
    if (!storeId) {
      showError("Loja inválida.");
      return;
    }

    if (!name.trim() || !address.trim()) {
      showError("Nome e endereço são obrigatórios.");
      return;
    }

    await updateStore(storeId, {
      name: name.trim(),
      address: address.trim(),
    });

    router.back();
  };

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
      <Heading size="xl" style={styles.heading}>
        Editar Loja
      </Heading>

      <View style={styles.formGroup}>
        <Text size="sm" style={styles.label}>
          Nome da Loja *
        </Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Filial Centro"
        />
      </View>

      <View style={styles.formGroup}>
        <Text size="sm" style={styles.label}>
          Endereço *
        </Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Ex: Rua das Flores, 123"
        />
      </View>

      <Button
        size="md"
        variant="solid"
        action="primary"
        isDisabled={isLoading}
        onPress={handleSave}
        style={styles.button}
      >
        <ButtonText>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "bold",
    color: "#334155",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#0f172a",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#0284c7",
  },
});
