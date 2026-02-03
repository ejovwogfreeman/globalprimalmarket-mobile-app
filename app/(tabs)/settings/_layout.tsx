import { Stack } from "expo-router";

export default function SettingsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      {/* <Stack.Screen name="security" options={{ title: "Security" }} /> */}
    </Stack>
  );
}
