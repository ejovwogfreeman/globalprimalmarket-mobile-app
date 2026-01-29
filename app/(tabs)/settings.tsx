import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <SettingsItem title="Security" />
        <SettingsItem title="Notifications" />
        <SettingsItem title="Privacy Policy" />
        <SettingsItem title="Help & Support" />

        {/* Logout */}
        <TouchableOpacity
          style={styles.logout}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function SettingsItem({ title }) {
  return (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.itemText}>{title}</Text>
    </TouchableOpacity>
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
  },
  title: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  item: {
    backgroundColor: "#0f172a",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
  },
  itemText: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "500",
  },
  logout: {
    marginTop: 30,
    backgroundColor: "#7f1d1d",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#fecaca",
    fontWeight: "700",
    fontSize: 16,
  },
});
