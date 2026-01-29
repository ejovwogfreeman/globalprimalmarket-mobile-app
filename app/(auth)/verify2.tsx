import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Verify() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // For demo: this is the "correct" verification code
  const MOCK_CODE = "123456";

  const handleVerify = () => {
    if (code.length !== 6) {
      Alert.alert(
        "Invalid Code",
        "Please enter the 6-digit verification code.",
      );
      return;
    }

    setIsVerifying(true);

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      if (code === MOCK_CODE) {
        // ✅ Verified! Navigate to success page
        router.replace("/success");
      } else {
        Alert.alert("Incorrect Code", "The code you entered is incorrect.");
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        Please enter the 6-digit code sent to you
      </Text>

      <View style={styles.card}>
        <TextInput
          placeholder="6-digit code"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerify}
          disabled={isVerifying}
        >
          <Text style={styles.buttonText}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    textAlign: "center",
    letterSpacing: 10,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
