import { useUser } from "@/context/UserContext";
import { createDeposit } from "@/data/api";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

/* -------------------- CRYPTO DATA -------------------- */
const CRYPTOS = {
  btc: {
    name: "Bitcoin",
    symbol: "BTC",
    address: "bc1q6g4uk97f6yu9g0zlawrt9mjwvp0f6rj9ss9g75",
    image: require("../../../assets/images/bitcoin.png"),
  },
  eth: {
    name: "Ethereum",
    symbol: "ETH",
    address: "0x5875934caC54c7fe01cd5Fc4103736C8179d6D9D",
    image: require("../../../assets/images/ethereum.png"),
  },
  sol: {
    name: "Solana",
    symbol: "SOL",
    address: "8iTXF6XXofB8wxzXMRWSsn6MjMRTtQjBsBQG747SD1aD",
    image: require("../../../assets/images/solana.png"),
  },
  trx: {
    name: "TRON",
    symbol: "TRX",
    address: "TMCBnpeFyAJviB25myRJ9zy52AN9s77hwd",
    image: require("../../../assets/images/tron.png"),
  },
  bnb: {
    name: "BNB Smart Chain",
    symbol: "BNB",
    address: "0x5875934caC54c7fe01cd5Fc4103736C8179d6D9D",
    image: require("../../../assets/images/bnb.png"),
  },
  xrp: {
    name: "Ripple",
    symbol: "XRP",
    address: "rBFaf9z8DapfUbgnaXBAaUnwe5FfH4kUXz",
    image: require("../../../assets/images/xrp.png"),
  },
};

export default function Deposit() {
  const params = useLocalSearchParams();
  const initialMethod = (params.method as keyof typeof CRYPTOS) || "btc";

  const [method, setMethod] = useState(initialMethod);
  const [amount, setAmount] = useState("");
  const [proofs, setProofs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const crypto = CRYPTOS[method];

  /* -------------------- PICK IMAGE -------------------- */
  const pickProof = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // works across all SDKs
      quality: 0.7,
    });

    if (!result.canceled) {
      setProofs([result.assets[0].uri]);
    }
  };

  /* -------------------- SUBMIT -------------------- */
  // const submitDeposit = async () => {
  //   if (!amount || proofs.length === 0) {
  //     Alert.alert("Error", "Please enter amount and upload proof");
  //     return;
  //   }

  //   if (!user?.token) {
  //     Alert.alert("Error", "User not authenticated");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const formData = new FormData();
  //     formData.append("amount", amount);
  //     formData.append("mode", method);

  //     // ✅ append files correctly
  //     proofs.forEach((uri, index) => {
  //       formData.append("images", {
  //         uri: proofs[0],
  //         name: `${method}-proof-${index}.jpg`,
  //         type: "image/jpeg",
  //       } as any); // just 'as any' to satisfy TS
  //     });

  //     const response = await createDeposit(user.token, formData);

  //     console.log(response);

  //     if (!response.success) {
  //       Alert.alert("Error", response.message);
  //       return;
  //     }

  //     Alert.alert(
  //       "Success",
  //       response.message || "Deposit submitted successfully",
  //     );

  //     setAmount("");
  //     setProofs([]);
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert("Error", "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const submitDeposit = async () => {
    if (!amount || proofs.length === 0) {
      Alert.alert("Error", "Please enter amount and upload proof");
      return;
    }

    if (!user?.token) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setLoading(true);

      // Create FormData
      const formData = new FormData();
      formData.append("amount", amount.toString());
      formData.append("mode", method);

      // Append each image properly
      proofs.forEach((uri, index) => {
        const fileName = uri.split("/").pop() || `proof-${index}.jpg`;
        formData.append("images", {
          uri, // must include file://
          name: fileName, // filename
          type: "image/jpeg", // MIME type
        } as any);
      });

      // Debug: log FormData keys
      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      // Send to backend
      const response = await createDeposit(user.token, formData);

      console.log("API response:", response);

      // ✅ Fix: response itself is already the data
      if (!response.success) {
        Alert.alert("Error", response.message || "Deposit failed");
        return;
      }

      Alert.alert(
        "Success",
        response.message || "Deposit submitted successfully",
      );

      setAmount("");
      setProofs([]);
    } catch (err: any) {
      console.log("Deposit error:", err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Deposit {crypto.name}</Text>

        {/* Wallet Card */}
        <View style={styles.card}>
          <Image source={crypto.image} style={styles.icon} />
          <Text style={styles.address}>{crypto.address}</Text>

          <View style={styles.qrBox}>
            <QRCode value={crypto.address} size={180} />
          </View>
        </View>

        {/* Method */}
        <Text style={styles.label}>Select Method</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={method}
            onValueChange={setMethod}
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

        {/* Proof */}
        <Text style={styles.label}>Payment Proof</Text>
        <TouchableOpacity style={styles.proofBtn} onPress={pickProof}>
          <Text style={styles.proofText}>
            {proofs.length ? "Change Proof" : "Upload Proof"}
          </Text>
        </TouchableOpacity>

        {proofs.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.proofImage} />
        ))}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.6 }]}
          onPress={submitDeposit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Deposit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  icon: { width: 44, height: 44, marginBottom: 12 },
  address: {
    color: "#94a3b8",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 16,
  },
  qrBox: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
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
  proofBtn: {
    backgroundColor: "#0f172a",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  proofText: {
    color: "#38bdf8",
    fontWeight: "600",
  },
  proofImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: "#38bdf8",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 30,
  },
  submitText: {
    color: "#020617",
    fontWeight: "700",
    fontSize: 16,
  },
});
