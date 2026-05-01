import { Stack } from "expo-router";

export default function SettingsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#020617" },
        headerTintColor: "#f8fafc",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen
        name="about"
        options={{ headerShown: true, title: "About Us" }}
      />
      <Stack.Screen name="helpsupport" options={{ title: "Help & Support" }} />
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen
        name="privacypolicy"
        options={{ title: "Privacy & Policy" }}
      />
      <Stack.Screen name="security" options={{ title: "Security" }} />
      <Stack.Screen
        name="deleteaccount"
        options={{ headerShown: false, title: "" }}
      />
      <Stack.Screen
        name="deleteaccountsuccess"
        options={{ headerShown: false, title: "" }}
      />
    </Stack>
  );
}
