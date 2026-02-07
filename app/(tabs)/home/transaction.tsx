import { useUser } from "@/context/UserContext";
import { getTransactionById, Transaction } from "@/data/api";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TransactionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useUser();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = user?.token;
    if (!token || !id) return;

    const fetchTransaction = async () => {
      setLoading(true);
      const res = await getTransactionById(token, id);

      if (res.success) {
        setTransaction(res.transaction ?? null);
      } else {
        setTransaction(null);
      }

      setLoading(false);
    };

    fetchTransaction();
  }, [id, user?.token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundText}>Transaction not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <Row
        label="Type"
        value={transaction.type.toUpperCase()}
        badge={
          transaction.type === "deposit"
            ? "#22c55e"
            : transaction.type === "withdrawal"
              ? "#f87171"
              : "#38bdf8"
        }
      />
      <Row label="Amount" value={`$${transaction.amount}`} />
      <Row
        label="Status"
        value={transaction.status.toUpperCase()}
        badge={
          transaction.status === "approved"
            ? "#22c55e"
            : transaction.status === "pending"
              ? "#facc15"
              : "#ef4444"
        }
      />
      <Row
        label="Date"
        value={new Date(transaction.createdAt).toLocaleString()}
      />
    </ScrollView>
  );
}

type RowProps = {
  label: string;
  value: string;
  badge?: string;
};

function Row({ label, value, badge }: RowProps) {
  return (
    <View
      style={[
        styles.row,
        badge && { borderLeftColor: badge, borderLeftWidth: 4 },
      ]}
    >
      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      {badge && <View style={[styles.badge, { backgroundColor: badge }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
  },
  row: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  rowText: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    fontSize: 12,
    color: "#94a3b8",
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f8fafc",
    marginTop: 4,
  },
  badge: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  notFoundText: {
    fontSize: 16,
    color: "#f87171",
  },
});
