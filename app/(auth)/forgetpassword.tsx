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
import { forgetPassword } from "../../data/api"; // your API call

export default function ForgetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      Alert.alert("Missing Email", "Please enter your email address");
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await forgetPassword({ email }); // call API

      if (res.success) {
        // Show alert first
        Alert.alert("Success", "Check your email for the code!");

        // Navigate to ChangePassword screen
        router.replace({
          pathname: "/changepassword",
          params: { email: email },
        });
      } else {
        Alert.alert("Error", res.message || "Something went wrong");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>Forgot Password 🔐</Text>
      <Text style={styles.subtitle}>
        Enter your email to receive a verification code
      </Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRequest}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Request Change"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Back</Text>
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
  button: ViewStyle;
  buttonText: TextStyle;
  footer: ViewStyle;
  footerText: TextStyle;
  link: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
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
    marginTop: 10,
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
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footer: {
    flexDirection: "row",
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
