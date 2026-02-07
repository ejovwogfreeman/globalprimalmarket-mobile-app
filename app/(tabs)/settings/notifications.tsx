import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const [counts, setCounts] = useState({
    deposit: 0,
    withdrawal: 0,
    investment: 0,
  });

  useEffect(() => {
    // TODO: Fetch counts from your API
    setCounts({
      deposit: 5,
      withdrawal: 2,
      investment: 3,
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.text}>Deposits: {counts.deposit}</Text>
        <Text style={styles.text}>Withdrawals: {counts.withdrawal}</Text>
        <Text style={styles.text}>Investments: {counts.investment}</Text>
        <Text style={styles.text}>
          Total Transactions:{" "}
          {counts.deposit + counts.withdrawal + counts.investment}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617", // dark background
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc", // light text
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: "#94a3b8",
    marginBottom: 12,
    lineHeight: 22,
  },
});
