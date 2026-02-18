import { Stack } from "expo-router";

export default function BotStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#020617" },
        headerTintColor: "#f8fafc",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      {/* Bots list screen */}
      <Stack.Screen name="index" options={{ title: "All Bots" }} />

      {/* Bot Details screen */}
      <Stack.Screen name="botdetail" options={{ title: "Bot Details" }} />

      {/* Buy Bot screen */}
      <Stack.Screen name="buy" options={{ title: "Buy Bot" }} />
    </Stack>
  );
}
