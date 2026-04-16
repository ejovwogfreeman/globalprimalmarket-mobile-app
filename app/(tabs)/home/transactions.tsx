import { useUser } from "@/context/UserContext";
import { getMyTransactions, Transaction } from "@/data/api";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterOption = {
  label: string;
  value: string;
};

export default function Transactions() {
  const { user } = useUser();
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [showDropdown, setShowDropdown] = useState(false);

  /* ================= FETCH ================= */
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

  /* ================= DYNAMIC FILTER OPTIONS ================= */
  const filterOptions: FilterOption[] = useMemo(() => {
    const uniqueTypes = Array.from(
      new Set(transactions.map((tx) => tx.type?.toLowerCase())),
    ).filter(Boolean);

    const dynamicOptions = uniqueTypes.map((type) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: type,
    }));

    return [{ label: "All Transactions", value: "all" }, ...dynamicOptions];
  }, [transactions]);

  /* ================= FILTERED DATA ================= */
  const filteredTransactions = useMemo(() => {
    if (selectedFilter === "all") return transactions;

    return transactions.filter(
      (tx) => tx.type?.toLowerCase() === selectedFilter,
    );
  }, [transactions, selectedFilter]);

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <StatusBar style="light" />

      {/* FILTER DROPDOWN */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.filterText}>
            {filterOptions.find((f) => f.value === selectedFilter)?.label}
          </Text>
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdown}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedFilter(option.value);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#38bdf8" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {filteredTransactions.length === 0 && (
            <Text style={styles.info}>No transactions found.</Text>
          )}

          {filteredTransactions.map((tx) => (
            <View key={tx._id} style={styles.card}>
              {/* TYPE & AMOUNT */}
              <View style={[styles.row, { marginBottom: 8 }]}>
                <View
                  style={[
                    styles.typeContainer,
                    tx.type === "deposit"
                      ? { backgroundColor: "#22c55e" }
                      : tx.type === "withdrawal"
                        ? { backgroundColor: "#f87171" }
                        : tx.type === "investment"
                          ? { backgroundColor: "#38bdf8" }
                          : { backgroundColor: "#9ca3af" },
                  ]}
                >
                  <Text style={styles.type}>{tx.type.toUpperCase()}</Text>
                </View>

                <Text style={styles.amount}>
                  {tx.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 5,
                    maximumFractionDigits: 5,
                  })}{" "}
                  {tx.mode?.toUpperCase()}
                </Text>
              </View>

              {/* STATUS & DATE */}
              <View style={styles.row}>
                <View
                  style={[
                    styles.statusBadge,
                    tx.status === "approved"
                      ? { backgroundColor: "#22c55e22" }
                      : tx.status === "pending"
                        ? { backgroundColor: "#facc1522" }
                        : tx.status === "declined"
                          ? { backgroundColor: "#ef444422" }
                          : { backgroundColor: "#5544ef22" },
                  ]}
                >
                  <Text
                    style={[
                      styles.status,
                      tx.status === "approved"
                        ? { color: "#22c55e" }
                        : tx.status === "pending"
                          ? { color: "#facc15" }
                          : tx.status === "declined"
                            ? { color: "#ef4444" }
                            : { color: "#38bdf8" },
                    ]}
                  >
                    {tx.status.toUpperCase()}
                  </Text>
                </View>

                <Text style={styles.date}>
                  {new Date(tx.createdAt).toLocaleDateString()}
                </Text>
              </View>

              {/* DETAILS */}
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  info: { fontSize: 14, color: "#94a3b8" },

  /* FILTER */
  filterContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    zIndex: 10,
  },
  filterButton: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 15,

    borderRadius: 8,
  },
  filterText: { color: "#38bdf8", fontWeight: "600" },
  dropdown: {
    backgroundColor: "#111827",
    marginTop: 5,
    borderRadius: 8,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  dropdownText: { color: "#f8fafc" },

  /* CARD */
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginTop: 10,
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
