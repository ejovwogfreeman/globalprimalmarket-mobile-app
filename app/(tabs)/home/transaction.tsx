import { useUser } from "@/context/UserContext";
import { claimBonus, getTransactionById, Transaction } from "@/data/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TransactionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useUser();
  const router = useRouter();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<string>("");

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

  // ======= COUNTDOWN =======
  useEffect(() => {
    if (!transaction) return;

    if (
      transaction.type === "investment" ||
      transaction.type === "bot purchase"
    ) {
      const durationDays = transaction.durationDays ?? 60;
      const endDate = new Date(transaction.createdAt);
      endDate.setDate(endDate.getDate() + durationDays);

      const interval = setInterval(() => {
        const now = new Date();
        const diff = endDate.getTime() - now.getTime();

        if (diff <= 0) {
          setCountdown("Matured");
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);

          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [transaction]);

  const handleClaimBonus = async () => {
    if (!user?.token || !transaction?._id) return;

    try {
      // Optional: show loading
      setCountdown("Claiming...");

      const res = await claimBonus(user.token, transaction._id);

      if (res.success) {
        Alert.alert(
          "Bonus Claimed",
          "Your bonus has been successfully claimed!",
        );
        router.replace("/home");
        // Optionally, refresh transaction info
        const updatedTransaction = await getTransactionById(
          user.token,
          transaction._id,
        );
        if (updatedTransaction.success) {
          setTransaction(updatedTransaction.transaction ?? null);
        }
      } else {
        Alert.alert("Error", res.message || "Failed to claim bonus");
        setCountdown("Matured"); // revert countdown
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while claiming bonus");
      setCountdown("Matured");
    }
  };

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

  const isInvestment =
    transaction?.type === "investment" || transaction?.type === "bot purchase";

  const durationDays = transaction?.durationDays ?? 60;

  const dailyReturnPercent =
    transaction?.dailyReturnPercent ?? Number((100 / durationDays).toFixed(3));

  const maxReturnPercent = transaction?.maxReturnPercent ?? 100;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Type */}
      <Row
        label="Type"
        value={transaction.type.toUpperCase()}
        badge={
          transaction.type === "deposit"
            ? "#22c55e"
            : transaction.type === "withdrawal"
              ? "#f87171"
              : transaction.type === "investment"
                ? "#38bdf8"
                : transaction.type === "bot purchase"
                  ? "#38bdf8"
                  : "#9ca3af"
        }
      />

      {/* Amount */}
      <Row
        label="Amount"
        value={`${transaction.amount} ${transaction.mode?.toUpperCase()}`}
      />

      {/* Status */}
      <Row
        label="Status"
        value={transaction.status.toUpperCase()}
        badge={
          transaction.status === "approved"
            ? "#22c55e"
            : transaction.status === "pending"
              ? "#facc15"
              : transaction.status === "declined"
                ? "#ef4444"
                : "#38bdf8"
        }
      />

      {/* Date */}
      <Row
        label="Date"
        value={new Date(transaction.createdAt).toLocaleString()}
      />

      {/* ===== EXTRA INFO FOR INVESTMENT / BOT PURCHASE ===== */}
      {isInvestment && (
        <>
          <Row
            label={transaction.type === "bot purchase" ? "Bot Name" : "Plan"}
            value={transaction.plan ?? "N/A"}
          />
          <Row label="Daily Return (%)" value={`${dailyReturnPercent}%`} />
          <Row label="Duration (Days)" value={`${durationDays} Days`} />
          <Row label="Max Return (%)" value={`${maxReturnPercent}%`} />
          <Row label="Countdown" value={countdown} />

          {/* CLAIM BONUS BUTTON */}
          {countdown === "Matured" && (
            <TouchableOpacity
              style={styles.claimButton}
              onPress={handleClaimBonus} // <-- call the function here
            >
              <Text style={styles.claimButtonText}>Claim Bonus</Text>
            </TouchableOpacity>
          )}
        </>
      )}
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
  container: { flex: 1, backgroundColor: "#020617" },
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
  rowText: { flex: 1, paddingRight: 10 },
  label: { fontSize: 12, color: "#94a3b8" },
  value: { fontSize: 18, fontWeight: "600", color: "#f8fafc", marginTop: 4 },
  badge: { width: 16, height: 16, borderRadius: 8 },
  notFoundText: { fontSize: 16, color: "#f87171" },
  claimButton: {
    backgroundColor: "#38bdf8",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  claimButtonText: {
    color: "#020617",
    fontWeight: "600",
    fontSize: 16,
  },
});
