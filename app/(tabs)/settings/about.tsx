import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>About This App</Text>
        <Text style={styles.text}>
          This app is designed to help users manage their investments, deposits,
          and withdrawals efficiently. You can track your transactions, update
          your profile, and stay notified about your activities.
        </Text>
        <Text style={styles.text}>Version: 1.0.0</Text>
        <Text style={styles.text}>
          © 2026 YourCompany. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

type Styles = {
  safe: ViewStyle;
  container: ViewStyle;
  title: TextStyle;
  text: TextStyle;
};

const styles = StyleSheet.create<Styles>({
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
