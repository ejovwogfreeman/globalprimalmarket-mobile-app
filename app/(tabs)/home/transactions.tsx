import { useUser } from "@/context/UserContext";
import { getMyTransactions, Transaction } from "@/data/api";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Transactions() {
  const { user } = useUser();
  const router = useRouter();

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

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <StatusBar style="light" />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#38bdf8" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {transactions.length === 0 && (
            <Text style={styles.info}>No transactions found.</Text>
          )}

          {transactions.map((tx) => (
            <View key={tx._id} style={styles.card}>
              {/* Type and Amount */}
              <View style={[styles.row, { marginBottom: 8 }]}>
                <View
                  style={[
                    styles.typeContainer,
                    tx.type === "deposit"
                      ? { backgroundColor: "#22c55e" }
                      : tx.type === "withdrawal"
                        ? { backgroundColor: "#f87171" }
                        : { backgroundColor: "#38bdf8" },
                  ]}
                >
                  <Text style={styles.type}>{tx.type.toUpperCase()}</Text>
                </View>
                <Text style={styles.amount}>${tx.amount}</Text>
              </View>

              {/* Status and Date */}
              <View style={styles.row}>
                <View
                  style={[
                    styles.statusBadge,
                    tx.status === "approved"
                      ? { backgroundColor: "#22c55e22" }
                      : tx.status === "pending"
                        ? { backgroundColor: "#facc1522" }
                        : { backgroundColor: "#ef444422" },
                  ]}
                >
                  <Text
                    style={[
                      styles.status,
                      tx.status === "approved"
                        ? { color: "#22c55e" }
                        : tx.status === "pending"
                          ? { color: "#facc15" }
                          : { color: "#ef4444" },
                    ]}
                  >
                    {tx.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.date}>
                  {new Date(tx.createdAt).toLocaleDateString()}
                </Text>
              </View>

              {/* View Details Link */}
              <TouchableOpacity
                style={styles.linkContainer}
                onPress={() =>
                  router.push({
                    pathname: "/home/transaction",
                    params: { id: tx._id },
                  })
                }
              >
                <Text style={styles.link}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

type Styles = {
  safe: ViewStyle;
  container: ViewStyle;
  center: ViewStyle;
  title: TextStyle;
  info: TextStyle;
  card: ViewStyle;
  row: ViewStyle;
  typeContainer: ViewStyle;
  type: TextStyle;
  amount: TextStyle;
  statusBadge: ViewStyle;
  status: TextStyle;
  date: TextStyle;
  linkContainer: ViewStyle;
  link: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10, // reduced top padding to move cards up
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 16,
  },
  info: { fontSize: 14, color: "#94a3b8" },

  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  typeContainer: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  type: { color: "#fff", fontWeight: "600" },
  amount: { color: "#f8fafc", fontWeight: "700", fontSize: 16 },

  statusBadge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12 },
  status: { fontWeight: "600", fontSize: 12 },
  date: { color: "#94a3b8", fontSize: 12 },

  linkContainer: { marginTop: 12 },
  link: { color: "#38bdf8", fontWeight: "600" },
});
