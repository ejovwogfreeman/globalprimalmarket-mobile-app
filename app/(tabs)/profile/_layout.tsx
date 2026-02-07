import { Stack } from "expo-router";

export default function ProfileStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#020617" },
        headerTintColor: "#f8fafc",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      {/* <Stack.Screen name="index" options={{ title: "Profile" }} /> */}
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen
        name="editprofile"
        options={{ headerShown: false, title: "" }}
      />
    </Stack>
  );
}
