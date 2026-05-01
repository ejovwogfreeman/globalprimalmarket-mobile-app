import { useLocalSearchParams, useRouter } from "expo-router";
import {
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function Success() {
  const router = useRouter();
  const { message } = useLocalSearchParams<{ message?: string }>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.emoji}>✅</Text>
      <Text style={styles.title}>Action Successful!</Text>
      <Text style={styles.subtitle}>
        Account deleted successfully. Proceed to Login or create a new account
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>OR</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/signup/step1")}
      >
        <Text style={styles.buttonText}>Create New Account</Text>
      </TouchableOpacity>
    </View>
  );
}

type Styles = {
  container: ViewStyle;
  emoji: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  orText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#020617", // dark background
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emoji: { fontSize: 60, marginBottom: 20 },
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
  orText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
