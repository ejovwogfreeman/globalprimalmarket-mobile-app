// import { useUser } from "@/context/UserContext";
// import { getMyTransactions, Transaction } from "@/data/api";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Notifications() {
//   const router = useRouter();
//   const { user } = useUser();

//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const token = user?.token;
//     if (!token) return;

//     const fetchTransactions = async () => {
//       setLoading(true);
//       const res = await getMyTransactions(token);

//       if (res.success && res.transactions) {
//         setTransactions(res.transactions);
//       }

//       setLoading(false);
//     };

//     fetchTransactions();
//   }, [user?.token]);

//   // ✅ COUNTS FROM DB
//   const depositCount = transactions.filter((t) => t.type === "deposit").length;

//   const withdrawalCount = transactions.filter(
//     (t) => t.type === "withdrawal",
//   ).length;

//   const investmentCount = transactions.filter(
//     (t) => t.type === "investment",
//   ).length;

//   const totalCount = transactions.length;

//   return (
//     <SafeAreaView style={styles.safe}>
//       {loading ? (
//         // ✅ CENTERED LOADER
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#38bdf8" />
//         </View>
//       ) : (
//         <ScrollView
//           style={styles.container}
//           showsVerticalScrollIndicator={false}
//         >
//           <Text style={styles.title}>Notifications</Text>

//           <Text style={styles.text}>Deposits: {depositCount}</Text>
//           <Text style={styles.text}>Withdrawals: {withdrawalCount}</Text>
//           <Text style={styles.text}>Investments: {investmentCount}</Text>
//           <Text style={styles.text}>Total Transactions: {totalCount}</Text>
//         </ScrollView>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#020617", // dark background
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     padding: 24,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#f8fafc", // light text
//     marginBottom: 16,
//   },
//   text: {
//     fontSize: 16,
//     color: "#94a3b8",
//     marginBottom: 12,
//     lineHeight: 22,
//   },
// });

import { useUser } from "@/context/UserContext";
import { getMyTransactions, Transaction } from "@/data/api";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const router = useRouter();
  const { user } = useUser();

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

  // ✅ COUNTS FROM DB
  const depositCount = transactions.filter((t) => t.type === "deposit").length;
  const withdrawalCount = transactions.filter(
    (t) => t.type === "withdrawal",
  ).length;
  const investmentCount = transactions.filter(
    (t) => t.type === "investment",
  ).length;
  const totalCount = transactions.length;

  // 🔹 Card colors
  const getColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "#22c55e"; // green
      case "withdrawal":
        return "#f87171"; // red
      case "investment":
        return "#38bdf8"; // blue
      default:
        return "#f8fafc"; // white
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#38bdf8" />
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Notifications</Text>

          {[
            { label: "Deposits", count: depositCount, type: "deposit" },
            {
              label: "Withdrawals",
              count: withdrawalCount,
              type: "withdrawal",
            },
            {
              label: "Investments",
              count: investmentCount,
              type: "investment",
            },
            { label: "Total Transactions", count: totalCount, type: "total" },
          ].map((item) => (
            <View
              key={item.label}
              style={[styles.card, { borderLeftColor: getColor(item.type) }]}
            >
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardCount}>{item.count}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

type Styles = {
  safe: ViewStyle;
  loaderContainer: ViewStyle;
  container: ViewStyle;
  title: TextStyle;
  card: ViewStyle;
  cardLabel: TextStyle;
  cardCount: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  safe: { flex: 1, backgroundColor: "#020617" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 24 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#111827",
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: { color: "#94a3b8", fontSize: 16, fontWeight: "600" },
  cardCount: { color: "#f8fafc", fontSize: 18, fontWeight: "700" },
});
