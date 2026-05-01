import { useUser } from "@/context/UserContext";
import { getMyTransactions, Transaction } from "@/data/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Settings() {
  const router = useRouter();
  const { setUser, user } = useUser();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    setLoading(true);
    await AsyncStorage.removeItem("user");
    setUser(null);
    router.replace("/login");

    Toast.show({
      type: "error",
      text1: "Logged Out",
      text2: "You have successfully logged out.",
      position: "top",
    });
    setShowModal(false);
    setLoading(false);
  };

  const confirmLogout = () => {
    setShowModal(true);
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

        <TouchableOpacity
          style={styles.deleteAccount}
          onPress={() => router.push("/settings/deleteaccount")}
        >
          <Text style={styles.logoutText}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout} onPress={confirmLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* ---------------- MODAL ---------------- */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowModal(false)}
                disabled={loading}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleLogout}
                disabled={loading}
              >
                <Text style={styles.confirmBtnText}>
                  {loading ? "Logging Out..." : "Yes, Logout"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  deleteAccount: ViewStyle;
  logout: ViewStyle;
  logoutText: TextStyle;
  modalOverlay: ViewStyle;
  modalBox: ViewStyle;
  modalTitle: TextStyle;
  modalText: TextStyle;
  modalActions: ViewStyle;
  cancelBtn: ViewStyle;
  confirmBtn: ViewStyle;
  cancelBtnText: TextStyle;
  confirmBtnText: TextStyle;
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
  deleteAccount: {
    marginTop: 30,
    backgroundColor: "#7f1d1d",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  logout: {
    marginTop: 15,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#0f172a",
    padding: 20,
    borderRadius: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 10,
    textAlign: "center",
  },

  modalText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelBtn: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#334155",
    alignItems: "center",
  },

  confirmBtn: {
    flex: 1,
    marginLeft: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#dc2626",
    alignItems: "center",
  },

  cancelBtnText: {
    color: "#f8fafc",
    fontWeight: "600",
  },

  confirmBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
