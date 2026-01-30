// import { useRouter } from "expo-router";
// import {
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TextStyle,
//   TouchableOpacity,
//   View,
//   ViewStyle,
// } from "react-native";

// export default function Login() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Title */}
//       <Text style={styles.title}>Welcome Back 👋</Text>
//       <Text style={styles.subtitle}>Login to continue</Text>

//       {/* Card */}
//       <View style={styles.card}>
//         {/* Email */}
//         <TextInput
//           placeholder="Email"
//           placeholderTextColor="#9ca3af"
//           style={styles.input}
//         />

//         {/* Password */}
//         <TextInput
//           placeholder="Password"
//           placeholderTextColor="#9ca3af"
//           secureTextEntry
//           style={styles.input}
//         />

//         {/* Forgot Password */}
//         <TouchableOpacity style={styles.forgotContainer}>
//           <Text style={styles.forgotText}>Forgot Password?</Text>
//         </TouchableOpacity>

//         {/* Login Button */}
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => router.replace("/home")}
//         >
//           <Text style={styles.buttonText}>Login</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}> Don’t have an account?</Text>
//         <TouchableOpacity onPress={() => router.push("/signup/step1")}>
//           <Text style={styles.link}>Sign Up</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { loginUser } from "../../data/api";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     Alert.alert("Missing Fields", "Please enter email and password");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const res = await loginUser({ email, password });

  //     if (res.success && res.user) {
  //       if (!res.user.isVerified) {
  //         // ❌ Not verified → go to verify
  //         Alert.alert(
  //           "Account Not Verified",
  //           "Please verify your email to continue.",
  //         );

  //         router.replace({
  //           pathname: "/verify",
  //           params: { email: res.user.email },
  //         });
  //       } else {
  //         // ✅ Verified → go home
  //         router.replace("/home");
  //       }
  //     } else {
  //       Alert.alert("Login Failed", res.message);
  //     }
  //   } catch (error: any) {
  //     Alert.alert("Error", error.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter email and password");
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      if (res.success && res.user) {
        if (!res.user.isVerified) {
          Alert.alert(
            "Account Not Verified",
            "Please verify your account to continue.",
          );

          router.replace({
            pathname: "/verify",
            params: { email: res.user.email },
          });
        } else {
          router.replace("/home");
        }
      } else {
        Alert.alert("Login Failed", res.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Title */}
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      {/* Card */}
      <View style={styles.card}>
        {/* Email */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/signup/step1")}>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type Styles = {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  card: ViewStyle;
  input: TextStyle;
  forgotContainer: ViewStyle;
  forgotText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  footer: ViewStyle;
  footerText: TextStyle;
  link: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // dark navy
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f8fafc",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 14,
    color: "#f8fafc",
    marginBottom: 14,
    fontSize: 16,
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    color: "#38bdf8",
    fontSize: 13,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 26,
  },

  footerText: {
    color: "#94a3b8",
    marginRight: 10,
  },

  link: {
    color: "#38bdf8",
    fontWeight: "600",
  },
});
