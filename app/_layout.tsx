import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // simulate auth check, replace with AsyncStorage or API
      await new Promise((res) => setTimeout(res, 500));

      setIsLoggedIn(false); // set to true to test logged-in flow
    };

    checkAuth();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // render stack layout that will route to either auth or tabs
  return <Stack screenOptions={{ headerShown: false }} />;
}
