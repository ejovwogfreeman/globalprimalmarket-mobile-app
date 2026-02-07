import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Security() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Security & Privacy</Text>

        <Text style={styles.text}>
          Your account and personal information are safe with us. We use
          industry-standard security measures to protect your data and ensure
          your transactions remain confidential.
        </Text>

        <Text style={styles.text}>
          We do not share your personal information with third parties without
          your consent. All sensitive data, including deposits, withdrawals, and
          investments, are encrypted and stored securely.
        </Text>

        <Text style={styles.text}>
          You can trust that your account is protected and your privacy is
          respected.
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
