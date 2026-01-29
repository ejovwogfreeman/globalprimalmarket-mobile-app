import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Profile</Text>

        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>G</Text>
        </View>

        {/* User Info */}
        <Text style={styles.name}>Godbless</Text>
        <Text style={styles.username}>@godbless_trade</Text>

        {/* Info Card */}
        <View style={styles.card}>
          <ProfileRow label="Email" value="godbless@email.com" />
          <ProfileRow label="Phone" value="+234 812 345 6789" />
          <ProfileRow label="Account Type" value="Standard" />
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ProfileRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#38bdf8",
    fontSize: 36,
    fontWeight: "700",
  },
  name: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "600",
  },
  username: {
    color: "#94a3b8",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#0f172a",
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  row: {
    marginBottom: 14,
  },
  rowLabel: {
    color: "#94a3b8",
    fontSize: 12,
  },
  rowValue: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
