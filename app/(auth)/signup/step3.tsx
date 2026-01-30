import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSignUp } from "../../../context/SignUpContext";

export default function Step3() {
  const router = useRouter();
  const { signUpData, updateSignUpData } = useSignUp();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSignup = () => {
    if (password !== confirm) return;

    updateSignUpData({ password });

    console.log("FINAL SIGNUP DATA:", {
      ...signUpData,
      password,
    });

    // 🔥 Send everything to your API here
    // fetch("/signup", { body: JSON.stringify(...) })

    router.replace("/verify");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          {/* Progress */}
          <View style={styles.progress}>
            <Text style={styles.step}>3/3</Text>
          </View>

          <Text style={styles.title}>Secure Your Account</Text>
          <Text style={styles.subtitle}>Set a strong password</Text>

          <Text style={styles.label}>Password *</Text>
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#64748b"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              updateSignUpData({ password: text });
            }}
          />

          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#64748b"
            secureTextEntry
            style={styles.input}
            value={confirm}
            onChangeText={(text) => setConfirm(text)}
          />

          <TouchableOpacity
            style={styles.button}
            // onPress={() => router.replace("/verify")}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.link}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type Styles = {
  safe: ViewStyle;
  scroll: ViewStyle;
  container: ViewStyle;
  progress: ViewStyle;
  step: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  label: TextStyle;
  input: TextStyle; // changed
  select: ViewStyle;
  selectText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  footer: ViewStyle;
  footerText: TextStyle;
  link: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    padding: 24,
  },
  progress: {
    marginBottom: 16,
  },
  step: {
    color: "#38bdf8",
    fontWeight: "600",
  },
  title: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 28,
  },
  label: {
    color: "#38bdf8",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 14,
    color: "#f8fafc",
    fontSize: 16,
    marginBottom: 18,
  },
  select: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
  },
  selectText: {
    color: "#f8fafc",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
