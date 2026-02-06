import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const METHODS = [
  {
    key: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    image: require("../../../assets/images/bitcoin.png"),
  },
  {
    key: "eth",
    name: "Ethereum",
    symbol: "ETH",
    image: require("../../../assets/images/ethereum.png"),
  },
  {
    key: "sol",
    name: "Solana",
    symbol: "SOL",
    image: require("../../../assets/images/solana.png"),
  },
  {
    key: "trx",
    name: "TRON",
    symbol: "TRX",
    image: require("../../../assets/images/tron.png"),
  },
  {
    key: "bnb",
    name: "BNB Smart Chain",
    symbol: "BNB",
    image: require("../../../assets/images/bnb.png"),
  },
  {
    key: "xrp",
    name: "Ripple",
    symbol: "XRP",
    image: require("../../../assets/images/xrp.png"),
  },
];

export default function DepositMethod() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Choose Deposit Method</Text>
        <Text style={styles.info}>
          Choose a deposit method below to continue and securely fund your
          account.
        </Text>
        <View style={styles.grid}>
          {METHODS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/home/deposit",
                  params: { method: item.key },
                })
              }
            >
              <Image source={item.image} style={styles.icon} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.symbol}>{item.symbol}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  info: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#0f172a",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    width: 42,
    height: 42,
    marginBottom: 10,
  },
  name: {
    color: "#f8fafc",
    fontWeight: "600",
    fontSize: 14,
  },
  symbol: {
    color: "#38bdf8",
    fontWeight: "700",
    marginTop: 4,
  },
});
