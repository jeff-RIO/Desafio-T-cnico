import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css"; // Importante para o NativeWind/Gluestack funcionar

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "Lojas", headerShown: true }}
        />
        {/* Futuramente vamos adicionar a tela de detalhes da loja aqui */}
      </Stack>
    </GluestackUIProvider>
  );
}
