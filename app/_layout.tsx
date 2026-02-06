import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { SignUpProvider } from "../context/SignUpContext";
import { TransactionProvider } from "../context/TransactionContext";
import { User, UserProvider, useUser } from "../context/UserContext";

// Auth guard to redirect based on user
function AuthChecker({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useUser();
  const router = useRouter();
  const segments: string[] = useSegments(); // ✅ type it as string[]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user: User = JSON.parse(userData);
          setUser(user);

          // If logged in and trying to access auth pages, redirect to home
          if (
            [
              "signup",
              "login",
              "verify",
              "success",
              "forgetpassword",
              "changepassword",
            ].some((seg) => segments.includes(seg))
          ) {
            router.replace("/home");
          }
        } else {
          // No user logged in, if trying to access /home, redirect to login
          if (segments.includes("home")) {
            router.replace("/login");
          }
        }
      } catch (err) {
        console.log("Error reading user from storage:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SignUpProvider>
      <UserProvider>
        <AuthChecker>
          <TransactionProvider>
            <Stack screenOptions={{ headerShown: false }} />
            {/* Add Toast component once in root */}
            <Toast />
          </TransactionProvider>
        </AuthChecker>
      </UserProvider>
    </SignUpProvider>
  );
}
