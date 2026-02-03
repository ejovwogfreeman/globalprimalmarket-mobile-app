import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Transactions() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Transactions</Text>
        <Text style={styles.info}>
          This screen will show your recent transactions including deposits,
          withdrawals, and investments.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

type Styles = {
  safe: ViewStyle;
  container: ViewStyle;
  title: TextStyle;
  info: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 12,
  },
  info: { fontSize: 14, color: "#94a3b8" },
});
