import { useEffect, useMemo, useState } from "react";
import { Alert, Platform, StyleSheet, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useStoreStore } from "../../store/store";

export default function EditProductScreen() {
  const params = useLocalSearchParams<{
    id: string | string[];
    storeId: string | string[];
  }>();

  const productId = useMemo(() => {
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params.id]);

  const storeId = useMemo(() => {
    return Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;
  }, [params.storeId]);

  const { storeProducts, isLoading, fetchProductsByStore, updateProduct } =
    useStoreStore();

  const product = useMemo(() => {
    return storeProducts.find((item) => item.id === productId) ?? null;
  }, [storeProducts, productId]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!storeId) return;
    fetchProductsByStore(storeId);
  }, [storeId, fetchProductsByStore]);

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price));
  }, [product]);

  const showError = (message: string) => {
    if (Platform.OS === "web") {
      window.alert(message);
      return;
    }

    Alert.alert("Erro", message);
  };

  const handleSave = async () => {
    if (!productId || !storeId) {
      showError("Produto inválido.");
      return;
    }

    if (!name.trim() || !category.trim() || !price.trim()) {
      showError("Nome, categoria e preço são obrigatórios.");
      return;
    }

    const normalizedPrice = Number(price.replace(",", "."));

    if (Number.isNaN(normalizedPrice) || normalizedPrice <= 0) {
      showError("Informe um preço válido.");
      return;
    }

    await updateProduct(productId, {
      name: name.trim(),
      category: category.trim(),
      price: normalizedPrice,
      storeId,
    });

    router.back();
  };

  if (isLoading && !product) {
    return (
      <View style={styles.center}>
        <Spinner size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Heading size="xl" style={styles.heading}>
        Editar Produto
      </Heading>

      <View style={styles.formGroup}>
        <Text size="sm" style={styles.label}>
          Nome do Produto *
        </Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Teclado Mecânico"
        />
      </View>

      <View style={styles.formGroup}>
        <Text size="sm" style={styles.label}>
          Categoria *
        </Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Ex: Eletrônicos"
        />
      </View>

      <View style={styles.formGroup}>
        <Text size="sm" style={styles.label}>
          Preço *
        </Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Ex: 199.90"
          keyboardType="decimal-pad"
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
