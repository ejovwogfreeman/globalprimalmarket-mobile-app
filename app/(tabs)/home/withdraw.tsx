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

export default function Withdraw() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Withdraw Funds</Text>
        <Text style={styles.info}>
          Here you can withdraw funds from your account. Implementation will
          connect to your withdrawal system.
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
