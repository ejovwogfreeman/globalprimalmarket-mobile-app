import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.text}>
          Your privacy is important to us. We do not share your personal
          information with third parties without your consent. All your
          transactions and data are securely stored.
        </Text>
        <Text style={styles.text}>
          For full policy details, please visit our website.
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
