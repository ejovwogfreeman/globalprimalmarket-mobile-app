import { useUser } from "@/context/UserContext";
import { createInvestment } from "@/data/api";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const PLANS = [
  { id: "starter", name: "Starter", min: 50 },
  { id: "silver", name: "Silver", min: 200 },
  { id: "gold", name: "Gold", min: 500 },
  { id: "diamond", name: "Diamond", min: 1000 },
  { id: "platinum", name: "Platinum", min: 3000 },
  { id: "elite", name: "Elite", min: 5000 },
];

const CRYPTO_MODES = [
  { symbol: "btc", rate: 40000 },
  { symbol: "eth", rate: 2500 },
  { symbol: "sol", rate: 120 },
  { symbol: "trx", rate: 0.07 },
  { symbol: "bnb", rate: 350 },
  { symbol: "xrp", rate: 0.5 },
];

export default function Invest() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useUser();

  const initialPlan = (params.plan as string) || "starter";
  const dailyReturnPercent = (params.dailyReturnPercent as string) || "";
  const durationDays = (params.durationDays as string) || "";
  const maxReturnPercent = (params.maxReturnPercent as string) || "";
  const [plan, setPlan] = useState(initialPlan);
  const [amountUSD, setAmountUSD] = useState(""); // USD input
  const [mode, setMode] = useState(CRYPTO_MODES[0].symbol); // default BTC
  const [loading, setLoading] = useState(false);

  const selectedPlan = PLANS.find((p) => p.id === plan)!;
  const selectedMode = CRYPTO_MODES.find((c) => c.symbol === mode)!;

  // Convert USD to crypto amount
  const amountInCrypto =
    amountUSD && selectedMode ? Number(amountUSD) / selectedMode.rate : 0;

  const submitInvestment = async () => {
    if (!amountUSD) {
      Alert.alert("Error", "Please enter an investment amount in USD");
      return;
    }

    if (Number(amountUSD) < selectedPlan.min) {
      Alert.alert(
        "Invalid Amount",
        `Minimum for ${selectedPlan.name} plan is $${selectedPlan.min}`,
      );
      return;
    }

    if (!user?.token) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        plan,
        mode,
        amount: amountInCrypto,
        dailyReturnPercent,
        durationDays,
        maxReturnPercent,
      };

      console.log(payload);

      const response = await createInvestment(user.token, payload);

      console.log("Investment response:", response);

      if (!response.success) {
        Alert.alert("Error", response.message || "Investment failed");
        return;
      }

      Toast.show({
        type: "success",
        text1: "Investment Successful",
        text2:
          response.message ||
          `You invested $${amountUSD} (~${amountInCrypto.toFixed(6)} ${mode}) successfully`,
        position: "top",
      });

      router.replace("/home");
      setAmountUSD("");
    } catch (err: any) {
      console.log("Investment error:", err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Invest Funds</Text>
        <Text style={styles.info}>
          Select an investment plan, choose a mode, and enter the amount in USD.
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

        {/* Mode Picker */}
        <Text style={styles.label}>Select Mode</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={mode}
            onValueChange={(value) => setMode(value as string)}
            style={{ color: "#f8fafc" }}
          >
            {CRYPTO_MODES.map((c) => (
              <Picker.Item
                key={c.symbol}
                label={`${c.symbol} (~$${c.rate})`}
                value={c.symbol}
              />
            ))}
          </Picker>
        </View>

        {/* Amount USD */}
        <Text style={styles.label}>Amount (USD)</Text>
        <TextInput
          value={amountUSD}
          onChangeText={setAmountUSD}
          keyboardType="numeric"
          placeholder={`Minimum $${selectedPlan.min}`}
          placeholderTextColor="#64748b"
          style={styles.input}
        />

        {/* Display converted crypto */}
        {amountUSD ? (
          <Text style={styles.cryptoPreview}>
            ≈ {amountInCrypto.toFixed(6)} {mode.toLocaleUpperCase()}
          </Text>
        ) : null}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={submitInvestment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.submitText}>Submit Investment</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#f8fafc", marginBottom: 6 },
  info: { color: "#94a3b8", marginBottom: 20, lineHeight: 20 },
  label: { color: "#94a3b8", marginBottom: 6, marginTop: 12 },
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
  cryptoPreview: {
    color: "#38bdf8",
    marginTop: 6,
    fontSize: 16,
    fontWeight: "600",
  },
  submitBtn: {
    marginTop: 24,
    backgroundColor: "#38bdf8",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: { color: "#020617", fontWeight: "700", fontSize: 16 },
});
