import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PLANS = [
  { id: "starter", name: "Starter", min: 50 },
  { id: "silver", name: "Silver", min: 200 },
  { id: "gold", name: "Gold", min: 500 },
  { id: "diamond", name: "Diamond", min: 1000 },
  { id: "platinum", name: "Platinum", min: 3000 },
  { id: "elite", name: "Elite", min: 5000 },
];

export default function Invest() {
  const params = useLocalSearchParams();

  // Get plan from params if exists, otherwise default
  const initialPlan = (params.plan as string) || "starter";

  const [plan, setPlan] = useState(initialPlan);
  const [amount, setAmount] = useState("");

  const selectedPlan = PLANS.find((p) => p.id === plan)!;

  const submitInvestment = () => {
    if (!amount) {
      Alert.alert("Error", "Please enter an investment amount");
      return;
    }

    if (Number(amount) < selectedPlan.min) {
      Alert.alert(
        "Invalid Amount",
        `Minimum for ${selectedPlan.name} plan is $${selectedPlan.min}`,
      );
      return;
    }

    // SEND TO BACKEND HERE
    console.log({
      plan,
      amount,
    });

    Alert.alert(
      "Investment Submitted",
      "Your investment request has been submitted successfully.",
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Invest Funds</Text>
        <Text style={styles.info}>
          Select an investment plan and enter the amount you want to invest.
        </Text>

        {/* Plan Picker */}
        <Text style={styles.label}>Select Plan</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={plan}
            onValueChange={(value) => setPlan(value as string)}
            style={{ color: "#f8fafc" }}
          >
            {PLANS.map((p) => (
              <Picker.Item
                key={p.id}
                label={`${p.name} (Min $${p.min})`}
                value={p.id}
              />
            ))}
          </Picker>
        </View>

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder={`Minimum $${selectedPlan.min}`}
          placeholderTextColor="#64748b"
          style={styles.input}
        />

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={submitInvestment}>
          <Text style={styles.submitText}>Submit Investment</Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 6,
  },
  info: {
    color: "#94a3b8",
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    color: "#94a3b8",
    marginBottom: 6,
    marginTop: 12,
  },
  pickerWrap: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 14,
    color: "#f8fafc",
  },
  submitBtn: {
    marginTop: 24,
    backgroundColor: "#38bdf8",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#020617",
    fontWeight: "700",
    fontSize: 16,
  },
});
