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

const CRYPTOS = {
  btc: { name: "Bitcoin", symbol: "BTC" },
  eth: { name: "Ethereum", symbol: "ETH" },
  sol: { name: "Solana", symbol: "SOL" },
  trx: { name: "TRON", symbol: "TRX" },
  bnb: { name: "BNB Smart Chain", symbol: "BNB" },
  xrp: { name: "Ripple", symbol: "XRP" },
};

export default function Withdraw() {
  const params = useLocalSearchParams();
  const initialMethod = (params.method as keyof typeof CRYPTOS) || "btc";

  const [method, setMethod] = useState(initialMethod);
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");

  const crypto = CRYPTOS[method];

  const submitWithdraw = () => {
    if (!amount || !wallet) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    // SEND TO BACKEND HERE
    console.log({
      type: "withdraw",
      method,
      amount,
      wallet,
    });

    Alert.alert("Success", "Withdrawal request submitted successfully");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Withdraw {crypto.name}</Text>

        {/* Method */}
        <Text style={styles.label}>Select Method</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={method}
            onValueChange={(value) => setMethod(value)}
            style={{ color: "#f8fafc" }}
          >
            {Object.entries(CRYPTOS).map(([key, c]) => (
              <Picker.Item
                key={key}
                label={`${c.name} (${c.symbol})`}
                value={key}
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
          placeholder="Enter amount"
          placeholderTextColor="#64748b"
          style={styles.input}
        />

        {/* Wallet Address */}
        <Text style={styles.label}>Wallet Address</Text>
        <TextInput
          value={wallet}
          onChangeText={setWallet}
          placeholder={`Enter ${crypto.symbol} wallet address`}
          placeholderTextColor="#64748b"
          style={styles.input}
          multiline
        />

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={submitWithdraw}>
          <Text style={styles.submitText}>Submit Withdrawal</Text>
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
    marginBottom: 20,
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
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: "#38bdf8",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  submitText: {
    color: "#020617",
    fontWeight: "700",
    fontSize: 16,
  },
});
