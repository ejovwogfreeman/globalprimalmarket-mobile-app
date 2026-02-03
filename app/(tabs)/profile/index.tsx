import { useUser } from "@/context/UserContext";
import { StatusBar } from "expo-status-bar";
import React, { ReactNode } from "react";
import {
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
  const { user } = useUser();

  if (!user) {
    return null; // or loader
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Header */}
        <View style={styles.profileHeader}>
          <Text style={styles.title}>Profile</Text>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.userName?.charAt(0).toUpperCase()}
            </Text>
          </View>
          {/* User Info */}
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.username}>@{user.userName}</Text>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <ProfileRow label="Email" value={user.email} />
          <ProfileRow label="Phone" value={user.phoneNumber} />
          <ProfileRow label="Country" value={user.country} />
          <ProfileRow label="Account Type" value={user.role} />
          <ProfileRow
            label="Verified"
            value={<VerifiedBadge verified={user.isVerified} />}
          />
          <ProfileRow
            label="Balance"
            value={`$${user.balance.toLocaleString()}.00`}
            isLast={true}
          />
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

type ProfileRowProps = {
  label: string;
  value: string | ReactNode;
  isLast?: boolean;
};

function ProfileRow({ label, value, isLast }: ProfileRowProps) {
  return (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 1, borderBottomColor: "#1e293b" },
      ]}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
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
  title: TextStyle;
  avatar: ViewStyle;
  avatarText: TextStyle;
  name: TextStyle;
  username: TextStyle;
  card: ViewStyle;
  row: ViewStyle;
  rowLabel: TextStyle;
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
  rowValue: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "500",
    paddingBottom: 6,
    marginBottom: 6,
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
