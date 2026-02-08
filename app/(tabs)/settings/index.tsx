import { useUser } from "@/context/UserContext";
import { getMyTransactions, Transaction } from "@/data/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Settings() {
  const router = useRouter();
  const { setUser, user } = useUser();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = user?.token;
    if (!token) return;

    const fetchTransactions = async () => {
      setLoading(true);
      const res = await getMyTransactions(token);

      if (res.success && res.transactions) {
        setTransactions(res.transactions);
      }

      setLoading(false);
    };

    fetchTransactions();
  }, [user?.token]);

  // ✅ TOTAL TRANSACTION COUNT
  const transactionCount = transactions.length;

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
    router.replace("/login");

    Toast.show({
      type: "error",
      text1: "Logged Out",
      text2: "You have successfully logged out.",
      position: "top",
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <SettingsItem
          title="About"
          onPress={() => router.push("/settings/about")}
        />

        <SettingsItem
          title="Security"
          onPress={() => router.push("/settings/security")}
        />

        {/* ✅ TRANSACTION COUNT ONLY */}
        <SettingsItem
          title={
            loading
              ? "Notifications (...)"
              : `Notifications (${transactionCount})`
          }
          onPress={() => router.push("/settings/notifications")}
        />

        <SettingsItem
          title="Privacy Policy"
          onPress={() => router.push("/settings/privacypolicy")}
        />

        <SettingsItem
          title="Help & Support"
          onPress={() => router.push("/settings/helpsupport")}
        />

        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

type SettingsItemProps = {
  title: string;
  onPress?: () => void;
};

function SettingsItem({ title, onPress }: SettingsItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemText}>{title}</Text>
    </TouchableOpacity>
  );
}

type Styles = {
  safe: ViewStyle;
  container: ViewStyle;
  title: TextStyle;
  item: ViewStyle;
  itemText: TextStyle;
  logout: ViewStyle;
  logoutText: TextStyle;
};

/* 🎨 Styles */
const styles = StyleSheet.create<Styles>({
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
