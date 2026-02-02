// import { Stack } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, View } from "react-native";

// export default function RootLayout() {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       // simulate auth check, replace with AsyncStorage or API
//       await new Promise((res) => setTimeout(res, 500));

//       setIsLoggedIn(false); // set to true to test logged-in flow
//     };

//     checkAuth();
//   }, []);

//   if (isLoggedIn === null) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   // render stack layout that will route to either auth or tabs
//   return <Stack screenOptions={{ headerShown: false }} />;
// }

// import { Stack } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, View } from "react-native";
// import { SignUpProvider } from "../context/SignUpContext";

// export default function RootLayout() {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       // simulate auth check, replace with AsyncStorage or API
//       await new Promise((res) => setTimeout(res, 500));
//       setIsLoggedIn(false); // set true when user is logged in
//     };

//     checkAuth();
//   }, []);

//   if (isLoggedIn === null) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <SignUpProvider>
//       <Stack screenOptions={{ headerShown: false }} />
//     </SignUpProvider>
//   );
// }

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Stack, useRouter, useSegments } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, View } from "react-native";
// import { SignUpProvider } from "../context/SignUpContext";
// import { User, UserProvider, useUser } from "../context/UserContext";

// // This component handles the auth check inside the provider
// function AuthChecker({ children }: { children: React.ReactNode }) {
//   const { setUser } = useUser(); // ✅ now we are inside the provider
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const segments = useSegments(); // tracks the current route

//   useEffect(() => {
//     const checkAuth = async () => {
//       const userData = await AsyncStorage.getItem("user");
//       if (userData) {
//         const user: User = JSON.parse(userData);
//         setUser(user); // ✅ no type error here

//         // ✅ Redirect automatically to /home if user exists
//         router.replace("/home");
//       }
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return <>{children}</>;
// }

// export default function RootLayout() {
//   return (
//     <SignUpProvider>
//       <UserProvider>
//         <AuthChecker>
//           <Stack screenOptions={{ headerShown: false }} />
//         </AuthChecker>
//       </UserProvider>
//     </SignUpProvider>
//   );
// }

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { SignUpProvider } from "../context/SignUpContext";
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
          <Stack screenOptions={{ headerShown: false }} />
          {/* Add Toast component once in root */}
          <Toast />
        </AuthChecker>
      </UserProvider>
    </SignUpProvider>
  );
}
