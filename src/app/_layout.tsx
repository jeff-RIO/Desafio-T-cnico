import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { makeServer } from "../services/mirage";

if (!(global as any).mirageServer) {
  (global as any).mirageServer = makeServer();
}

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "Lojas", headerShown: true }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}
