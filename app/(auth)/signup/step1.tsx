import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignUp } from "../../../context/SignUpContext";

interface FormData {
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export default function Step1() {
  const router = useRouter();
  const { updateSignUpData } = useSignUp();

  const [form, setForm] = useState<FormData>({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [isValid, setIsValid] = useState(false);

  // Check if all fields are filled
  const checkFieldsFilled = () => {
    return (
      form.userName.trim() !== "" &&
      form.fullName.trim() !== "" &&
      form.email.trim() !== "" &&
      form.phoneNumber.trim() !== ""
    );
  };

  // Update isValid whenever form changes
  useEffect(() => {
    setIsValid(checkFieldsFilled());
  }, [form]);

  const handleContinue = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address, e.g., example@email.com",
      );
      return;
    }

    // All good, save data and navigate
    updateSignUpData(form);
    router.push("/signup/step2");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.container}>
          {/* Progress */}
          <View style={styles.progress}>
            <Text style={styles.step}>1/3</Text>
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Open your crypto trading account</Text>

          <Text style={styles.label}>Trading Username *</Text>
          <TextInput
            placeholder="Choose username"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={form.userName}
            onChangeText={(t) => setForm({ ...form, userName: t })}
          />

          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            placeholder="Enter full name"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={form.fullName}
            onChangeText={(t) => setForm({ ...form, fullName: t })}
          />

          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            placeholder="your.email@example.com"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
          />

          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            placeholder="+234 812 345 6789"
            placeholderTextColor="#64748b"
            keyboardType="phone-pad"
            style={styles.input}
            value={form.phoneNumber}
            onChangeText={(t) => setForm({ ...form, phoneNumber: t })}
          />

          <TouchableOpacity
            style={[styles.button, { opacity: isValid ? 1 : 0.5 }]}
            onPress={handleContinue}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}> Already have an account?</Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
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
  input: TextStyle; // TextInput uses TextStyle for color, fontSize, etc.
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
