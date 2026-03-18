import { useState } from "react";
import { View, TextInput, StyleSheet, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { useStoreStore } from "../../features/store/store";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";

export default function NewStoreScreen() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const { addStore, isLoading } = useStoreStore();

  const handleSave = async () => {
    if (!name.trim() || !address.trim()) {
      if (Platform.OS === "web") {
        window.alert("Nome e endereço são obrigatórios.");
      } else {
        Alert.alert("Erro", "Nome e endereço são obrigatórios.");
      }
      return;
    }

    await addStore({ name, address });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Heading size="xl" style={styles.heading}>
        Nova Loja
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
        <ButtonText>{isLoading ? "Salvando..." : "Salvar Loja"}</ButtonText>
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
