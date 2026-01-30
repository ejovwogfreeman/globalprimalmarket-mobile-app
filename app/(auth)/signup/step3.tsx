import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
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
import { RegisterData, registerUser } from "../../../data/api"; // your API

export default function Step3() {
  const router = useRouter();
  const { signUpData, updateSignUpData } = useSignUp();

  const [password, setPassword] = useState(signUpData.password || "");
  const [confirm, setConfirm] = useState(signUpData.password || "");
  const [loading, setLoading] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  // ✅ Check if both password fields are filled
  useEffect(() => {
    setIsFilled(password.trim() !== "" && confirm.trim() !== "");
  }, [password, confirm]);

  const handleSignup = async () => {
    // ✅ Check password length
    if (password.length < 8) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long.",
      );
      return;
    }

    // ✅ Check password match
    if (password !== confirm) {
      Alert.alert(
        "Passwords do not match",
        "Please make sure both passwords are the same.",
      );
      return;
    }

    setLoading(true);

    const finalData: RegisterData = {
      userName: signUpData.userName,
      fullName: signUpData.fullName,
      email: signUpData.email,
      phoneNumber: signUpData.phoneNumber,
      country: signUpData.country,
      password: password, // use typed password
    };

    try {
      console.warn("SignUpData:", signUpData);

      const res = await registerUser(finalData);

      if (res.success) {
        updateSignUpData({ password });
        Alert.alert("Registration Successful", res.message);
        router.replace("/verify");
      } else {
        Alert.alert("Registration Failed", res.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
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
            onChangeText={(text) => setPassword(text)}
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
            style={[styles.button, { opacity: isFilled ? 1 : 0.5 }]}
            onPress={handleSignup}
            disabled={!isFilled || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating Account..." : "Create Account"}
            </Text>
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
