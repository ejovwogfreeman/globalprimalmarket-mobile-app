import { useUser } from "@/context/UserContext";
import { CRYPTO_MODES } from "@/data/crypto";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { ReactNode, useState } from "react";
import {
  Image,
  ImageStyle,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();
  const { user } = useUser();

  if (!user) {
    return null; // or loader
  }

  const [photoUri, setPhotoUri] = useState<string[]>(
    user?.profilePicture ? user.profilePicture : [],
  );

  React.useEffect(() => {
    if (user?.profilePicture) {
      setPhotoUri(
        Array.isArray(user.profilePicture)
          ? user.profilePicture
          : [user.profilePicture],
      );
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Header */}

        <View style={styles.profileHeader}>
          <Text style={styles.title}>Profile</Text>

          {/* Avatar with Edit Icon */}
          <View style={styles.avatarWrapper}>
            {photoUri && photoUri.length > 0 ? (
              <Image source={{ uri: photoUri[0] }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.userName?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => router.push("/profile/changephoto")}
            >
              <MaterialIcons name="edit" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.username}>@{user.userName}</Text>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <ProfileRow label="Email" value={user.email} />
          <ProfileRow label="Phone" value={user.phoneNumber} />
          <ProfileRow
            label="Country"
            countryFlag={user.countryFlag}
            value={user.country}
          />
          <ProfileRow label="Account Type" value={user.role} />
          <ProfileRow
            label="Verified"
            value={<VerifiedBadge verified={user.isVerified} />}
          />
          {/* <ProfileRow
            label="Balance"
            value={`$${user.balance.toLocaleString()}.00`}
            isLast={true}
          /> */}
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontSize: 12,

                color: "#94a3b8",
                marginBottom: 10,
              }}
            >
              Balances:
            </Text>

            {user?.balance &&
              (() => {
                const balances = user.balance;

                // ✅ TOTAL USDT
                const totalUSDT = Object.entries(balances).reduce(
                  (sum, [symbol, amount]) => {
                    const crypto = CRYPTO_MODES.find(
                      (c) => c.symbol === symbol,
                    );

                    const value = Number(amount) || 0;

                    if (symbol === "usdt") return sum + value;
                    if (!crypto) return sum;

                    return sum + value * crypto.rate;
                  },
                  0,
                );

                return (
                  <>
                    {/* ✅ TOTAL (TOP) */}
                    <View
                      style={{
                        backgroundColor: "#222c44",
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: "#94a3b8",
                          marginBottom: 4,
                          fontSize: 12,
                        }}
                      >
                        TOTAL BALANCE
                      </Text>

                      <View
                        style={{ flexDirection: "row", alignItems: "baseline" }}
                      >
                        <Text
                          style={{
                            color: "#f8fafc",
                            fontSize: 20,
                            fontWeight: "700",
                          }}
                        >
                          {totalUSDT.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>

                        <Text style={{ color: "#94a3b8", marginLeft: 4 }}>
                          USDT
                        </Text>
                      </View>
                    </View>

                    {/* ✅ GRID */}
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                      }}
                    >
                      {Object.entries(balances).map(([symbol, amount]) => {
                        const crypto = CRYPTO_MODES.find(
                          (c) => c.symbol === symbol,
                        );

                        const value = Number(amount) || 0;

                        const usdtValue =
                          symbol === "usdt"
                            ? value
                            : crypto
                              ? value * crypto.rate
                              : 0;

                        return (
                          <View
                            key={symbol}
                            style={{
                              width: "48%",
                              backgroundColor: "#222c44",
                              padding: 12,
                              borderRadius: 10,
                              marginBottom: 10,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "baseline",
                              }}
                            >
                              <Text
                                style={{
                                  color: "#f8fafc",
                                  fontWeight: "700",
                                }}
                              >
                                {value.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>

                              <Text style={{ color: "#94a3b8", marginLeft: 4 }}>
                                {symbol.toUpperCase()}
                              </Text>
                            </View>

                            <Text
                              style={{
                                color: "#757C86",
                                marginTop: 4,
                                fontSize: 12,
                              }}
                            >
                              ≈{" "}
                              {usdtValue.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                              USDT
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </>
                );
              })()}
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/profile/editprofile")}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

type ProfileRowProps = {
  label: string;
  countryFlag?: string;
  value: string | ReactNode;
  isLast?: boolean;
};

function ProfileRow({ label, value, countryFlag, isLast }: ProfileRowProps) {
  return (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 1, borderBottomColor: "#1e293b" },
      ]}
    >
      <Text style={styles.rowLabel}>{label}</Text>

      <View style={styles.valueContainer}>
        {countryFlag && <Text style={styles.countryFlag}>{countryFlag}</Text>}

        {/* Render string inside Text, else render ReactNode directly */}
        {typeof value === "string" ? (
          <Text style={styles.rowValue}>{value}</Text>
        ) : (
          value
        )}
      </View>
    </View>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: verified ? "#22c55e" : "#ef4444" },
      ]}
    >
      <Text style={styles.badgeText}>{verified ? "Yes" : "No"}</Text>
    </View>
  );
}

type Styles = {
  safe: ViewStyle;
  container: ViewStyle;
  profileHeader: ViewStyle;
  avatarWrapper: ViewStyle;
  editIcon: ViewStyle;
  title: TextStyle;
  avatar: ImageStyle; // ✅ Correct type for Image
  avatarText: TextStyle;
  name: TextStyle;
  username: TextStyle;
  card: ViewStyle;
  row: ViewStyle;
  rowLabel: TextStyle;
  valueContainer: ViewStyle;
  countryFlag: TextStyle;
  rowValue: TextStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
};

/* 🎨 Styles */
const styles = StyleSheet.create<Styles>({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    padding: 24,
    // alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563eb",
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: "#020617", // optional: border to separate icon from avatar
  },
  title: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#38bdf8",
    fontSize: 36,
    fontWeight: "700",
  },
  name: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "600",
  },
  username: {
    color: "#94a3b8",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#0f172a",
    width: "100%",
    borderRadius: 16,
    padding: 16,
    paddingTop: 20,
    paddingBottom: 0,
    marginBottom: 20,
  },
  row: {
    marginBottom: 14,
  },
  rowLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 5,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 6,
    marginBottom: 6,
  },
  countryFlag: {
    marginRight: 5,
  },
  rowValue: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
