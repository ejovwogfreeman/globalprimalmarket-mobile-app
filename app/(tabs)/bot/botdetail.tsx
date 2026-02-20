import { useUser } from "@/context/UserContext";
import { Bot, getBotById, purchaseBot } from "@/data/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const CRYPTO_MODES = [
  { symbol: "btc", rate: 40000 },
  { symbol: "eth", rate: 2500 },
  { symbol: "sol", rate: 120 },
  { symbol: "trx", rate: 0.07 },
  { symbol: "bnb", rate: 350 },
  { symbol: "xrp", rate: 0.5 },
];

export default function BotDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const navigation = useNavigation();
  const { user } = useUser();
  const router = useRouter();

  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState(CRYPTO_MODES[0].symbol);
  const [proofs, setProofs] = useState<string[]>([]);

  useEffect(() => {
    const token = user?.token;
    if (!token || !id) return;

    const fetchBot = async () => {
      setLoading(true);
      try {
        const res = await getBotById(token, id);
        if (res.success) setBot(res.bot ?? null);
        else setBot(null);
      } catch (err) {
        setBot(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBot();
  }, [id, user?.token]);

  useLayoutEffect(() => {
    if (bot?.name) {
      navigation.setOptions({ title: bot.name });
    }
  }, [bot?.name]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  if (!bot) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundText}>Bot not found</Text>
      </View>
    );
  }

  const selectedCrypto = CRYPTO_MODES.find((c) => c.symbol === selectedMode);

  const selectedConversion = selectedCrypto
    ? (bot.price / selectedCrypto.rate).toFixed(6)
    : "0";

  const handleSelectProofs = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // works across all SDKs
      quality: 0.7,
    });

    if (!result.canceled) {
      setProofs([result.assets[0].uri]);
    }
  };

  const handlePurchase = async () => {
    if (proofs.length === 0) {
      Alert.alert("Error", "Please upload Bot purchase proof of payment.");
      return;
    }

    if (!user?.token) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("amount", selectedConversion.toString());
      formData.append("mode", selectedMode);
      formData.append("botName", bot.name);
      formData.append("dailyReturnPercent", bot.dailyReturnPercent);
      formData.append("durationDays", bot.durationDays);
      formData.append("maxReturnPercent", bot.maxReturnPercent);

      proofs.forEach((uri, index) => {
        const fileName = uri.split("/").pop() || `proof-${index}.jpg`;

        formData.append("images", {
          uri,
          name: fileName,
          type: "image/jpeg",
        } as any);
      });

      const response = await purchaseBot(user.token, formData);

      // console.log("API response:", response);

      if (!response.success) {
        Alert.alert("Error", response.message || "Bot Purchase failed");
        return;
      }

      // ✅ CLOSE MODAL FIRST
      setModalVisible(false);

      // ✅ RESET STATE
      setProofs([]);

      // ✅ SHOW SUCCESS TOAST
      Toast.show({
        type: "success",
        text1: "Bot Purchased Successfully",
        text2:
          response.message ||
          "Your deposit request has been submitted successfully",
        position: "top",
      });

      // ✅ WAIT A LITTLE BEFORE REDIRECT (prevents UI glitch)
      setTimeout(() => {
        router.replace("/home");
      }, 500);
    } catch (err: any) {
      // console.log("Deposit error:", err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.botImagePlaceholder}>
          <MaterialCommunityIcons
            name="robot-outline"
            size={50}
            color="#38bdf8"
          />
        </View>

        {bot.description && (
          <Text style={styles.description}>{bot.description}</Text>
        )}

        <View style={styles.priceBadge}>
          <Text style={styles.price}>${bot.price}</Text>
          {bot.status && (
            <View
              style={[
                styles.statusBadge,
                bot.status.toLowerCase() === "active"
                  ? styles.statusActive
                  : styles.statusInactive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  bot.status.toLowerCase() === "active"
                    ? styles.statusTextActive
                    : styles.statusTextInactive,
                ]}
              >
                {bot.status.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {bot.dailyReturnPercent && (
          <View style={styles.priceBadge}>
            <Text style={styles.extra}>Daily Return (Percentage)</Text>
            <Text style={styles.extra}>{bot.dailyReturnPercent}%</Text>
          </View>
        )}
        {bot.durationDays && (
          <View style={styles.priceBadge}>
            <Text style={styles.extra}>Duration (Days):</Text>
            <Text style={styles.extra}>{bot.durationDays}</Text>
          </View>
        )}
        {bot.maxReturnPercent && (
          <View style={styles.priceBadge}>
            <Text style={styles.extra}>Max Return (Percentage)</Text>
            <Text style={styles.extra}>{bot.maxReturnPercent}%</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buyButtonText}>Purchase Bot</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Purchase {bot.name}</Text>

              <Text style={styles.modalLabel}>Bot Price</Text>
              <TextInput
                value={bot.price.toString()}
                editable={false}
                style={styles.input}
              />

              <Text style={styles.modalLabel}>Select Payment Mode</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 12 }}
              >
                {CRYPTO_MODES.map((mode) => (
                  <TouchableOpacity
                    key={mode.symbol}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      marginRight: 8,
                      borderRadius: 8,
                      backgroundColor:
                        selectedMode === mode.symbol ? "#38bdf8" : "#1f2937",
                    }}
                    onPress={() => setSelectedMode(mode.symbol)}
                  >
                    <Text
                      style={{
                        color:
                          selectedMode === mode.symbol ? "#020617" : "#f8fafc",
                        fontWeight: "700",
                      }}
                    >
                      {mode.symbol.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text
                style={{
                  color: "#38bdf8",
                  marginBottom: 12,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                ≈{selectedConversion} {selectedMode.toUpperCase()}
              </Text>

              <Text style={styles.modalLabel}>Upload Proof</Text>
              <TouchableOpacity
                style={styles.proofsButton}
                onPress={handleSelectProofs}
              >
                <Text style={{ color: "#f8fafc" }}>
                  {proofs.length > 0 ? "Change Proof" : "Upload Proof"}
                </Text>
              </TouchableOpacity>

              {/* ✅ Multiple preview WITHOUT altering your styling */}
              {proofs.length > 0 &&
                proofs.map((uri, index) => (
                  <View
                    key={index}
                    style={{
                      marginBottom: 12,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri }}
                      style={{
                        width: "100%",
                        height: 150,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#38bdf8",
                      }}
                      resizeMode="contain"
                    />
                  </View>
                ))}

              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handlePurchase}
                >
                  <Text style={{ color: "#020617", fontWeight: "600" }}>
                    Confirm
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "#020617", fontWeight: "600" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: { padding: 20, paddingBottom: 40 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
  },
  notFoundText: { fontSize: 16, color: "#f87171" },
  botImagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#38bdf8",
  },
  description: { fontSize: 14, color: "#f8fafc", marginTop: 8, lineHeight: 20 },
  priceBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  price: { fontSize: 20, fontWeight: "700", color: "#22c55e" },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 10,
  },
  statusActive: { backgroundColor: "rgba(34, 197, 94, 0.3)" },
  statusInactive: { backgroundColor: "rgba(239, 68, 68, 0.3)" },
  statusText: { fontSize: 10, fontWeight: "700" },
  statusTextActive: { color: "#22c55e" },
  statusTextInactive: { color: "#ef4444" },
  extra: { fontSize: 14, color: "#94a3b8", marginTop: 4 },
  buyButton: {
    marginTop: 20,
    backgroundColor: "#38bdf8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buyButtonText: { color: "#020617", fontWeight: "600", fontSize: 16 },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    color: "#38bdf8",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#38bdf8",
    borderRadius: 8,
    padding: 10,
    color: "#f8fafc",
    marginBottom: 12,
  },
  modalLabel: { color: "#94a3b8", marginBottom: 6 },
  proofsButton: {
    borderWidth: 1,
    borderColor: "#38bdf8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#38bdf8",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButton: { backgroundColor: "#f87171", padding: 10, borderRadius: 8 },
});
