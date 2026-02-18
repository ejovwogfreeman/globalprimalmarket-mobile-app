import { useUser } from "@/context/UserContext";
import { Bot, getAllBots } from "@/data/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = user?.token;
    if (!token) {
      setLoading(false);
      setError("No user token found.");
      return;
    }

    const fetchBots = async () => {
      setLoading(true);
      try {
        const res = await getAllBots(token);

        if (res.success && res.bots) {
          setBots(res.bots);
        } else {
          setError(res.message || "Failed to fetch bots.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch bots.");
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, [user?.token]);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <StatusBar style="light" />

      {loading ? (
        <View style={styles.centerFull}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={[styles.info, { marginTop: 10 }]}>Fetching bots...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerFull}>
          <Text style={styles.info}>{error}</Text>
        </View>
      ) : bots.length === 0 ? (
        <View style={styles.centerFull}>
          <Text style={styles.info}>No bots available.</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {bots.map((bot) => (
            <View key={bot._id} style={styles.cardRow}>
              {/* Bot Icon */}
              <View style={styles.iconContainer}>
                <View style={styles.botIconPlaceholder}>
                  <MaterialCommunityIcons
                    name="robot-outline"
                    size={24}
                    color="#38bdf8"
                  />
                </View>
              </View>

              {/* Bot Details */}
              <View style={styles.botDetails}>
                {/* Bot Name */}
                <Text style={styles.botName}>{bot.name}</Text>

                {/* Description (first 20 chars) */}
                {bot.description && (
                  <Text style={styles.description}>
                    {bot.description.slice(0, 20)}
                    {bot.description.length > 20 ? "..." : ""}
                  </Text>
                )}

                {/* Price */}
                <Text style={styles.botPrice}>${bot.price}</Text>

                {/* View Bot Button */}
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() =>
                    router.push({
                      pathname: "/bot/botdetail",
                      params: { id: bot._id },
                    })
                  }
                >
                  <Text style={styles.buttonText}>View Bot</Text>
                </TouchableOpacity>

                {/* Status Badge */}
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
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

type Styles = {
  safe: ViewStyle;
  scrollContainer: ViewStyle;
  centerFull: ViewStyle;
  info: TextStyle;
  cardRow: ViewStyle;
  botName: TextStyle;
  botPrice: TextStyle;
  iconContainer: ViewStyle;
  botIconPlaceholder: ViewStyle;
  botDetails: ViewStyle;
  description: TextStyle;
  viewButton: ViewStyle;
  buttonText: TextStyle;
  statusBadge: ViewStyle;
  statusActive: ViewStyle;
  statusInactive: ViewStyle;
  statusText: TextStyle;
  statusTextActive: TextStyle;
  statusTextInactive: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 50, // space for sticky buttons if needed
  },
  centerFull: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  info: { fontSize: 14, color: "#94a3b8", textAlign: "center" },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  iconContainer: {
    marginRight: 12,
  },

  botIconPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#38bdf8",
  },

  botDetails: {
    flex: 1,
  },

  botName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f8fafc",
  },

  description: {
    fontSize: 12,
    color: "#cbd5e1",
    marginTop: 4,
  },

  botPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#22c55e",
    marginTop: 6,
  },

  viewButton: {
    marginTop: 8,
    backgroundColor: "#38bdf8",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#020617",
    fontWeight: "600",
  },

  statusBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusActive: {
    backgroundColor: "rgba(34, 197, 94, 0.3)",
  },

  statusInactive: {
    backgroundColor: "rgba(239, 68, 68, 0.3)",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },

  statusTextActive: {
    color: "#22c55e",
  },

  statusTextInactive: {
    color: "#ef4444",
  },
});
