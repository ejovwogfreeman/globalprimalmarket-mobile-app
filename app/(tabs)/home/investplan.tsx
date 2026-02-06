import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$50",
    roi: "10% ROI",
    duration: "7 Days",
  },
  {
    id: "silver",
    name: "Silver",
    price: "$200",
    roi: "20% ROI",
    duration: "14 Days",
  },
  {
    id: "gold",
    name: "Gold",
    price: "$500",
    roi: "35% ROI",
    duration: "21 Days",
  },
  {
    id: "diamond",
    name: "Diamond",
    price: "$1,000",
    roi: "50% ROI",
    duration: "30 Days",
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "$3,000",
    roi: "75% ROI",
    duration: "45 Days",
  },
  {
    id: "elite",
    name: "Elite",
    price: "$5,000",
    roi: "100% ROI",
    duration: "60 Days",
  },
];

export default function InvestPlan() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Investment Plans</Text>
        <Text style={styles.subtitle}>
          Choose a plan that fits your financial goals and investment capacity.
        </Text>

        {PLANS.map((plan) => (
          <View key={plan.id} style={styles.card}>
            <Text style={styles.planName}>{plan.name}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Minimum</Text>
              <Text style={styles.value}>{plan.price}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Return</Text>
              <Text style={styles.value}>{plan.roi}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>{plan.duration}</Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/home/invest",
                  params: { plan: plan.id },
                })
              }
            >
              <Text style={styles.buttonText}>Invest Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 6,
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 20,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#38bdf8",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    color: "#94a3b8",
  },
  value: {
    color: "#f8fafc",
    fontWeight: "600",
  },
  button: {
    marginTop: 14,
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#020617",
    fontWeight: "700",
    fontSize: 16,
  },
});
