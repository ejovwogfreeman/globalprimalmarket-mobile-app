import { useUser } from "@/context/UserContext";
import { updateUserProfile } from "@/data/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { COUNTRIES } from "../../../data/countries";

export default function EditProfile() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [userName, setUserName] = useState(user?.userName || "");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [country, setCountry] = useState(user?.country || "Select country");
  const [loading, setLoading] = useState(false);

  // Country modal & search
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(COUNTRIES);

  useEffect(() => {
    const filtered = COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredCountries(filtered);
  }, [search]);

  const selectedCountryObj = COUNTRIES.find((c) => c.name === country);
  const countryFlag = selectedCountryObj ? selectedCountryObj.flag : "";

  const handleUpdate = async () => {
    if (
      !userName ||
      !fullName ||
      !phoneNumber ||
      !country ||
      country === "Select country"
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!user?.token) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setLoading(true);
      const payload = { userName, fullName, phoneNumber, country, countryFlag };

      const response = await updateUserProfile(user.token, payload);

      if (!response.success) {
        Alert.alert("Error", response.message || "Profile update failed");
        return;
      }

      // Update user context
      const updatedUser = { ...user, ...payload };
      setUser(updatedUser);

      // ✅ Save updated user to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      // Navigate back to profile
      router.replace("/profile");

      // Toast message
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: response.message || "Profile updated successfully",
        position: "top",
      });
    } catch (err: any) {
      console.log("Profile update error:", err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.center}>
        <Text style={styles.title}>Edit Profile</Text>

        {/* Username */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
          placeholder="Enter username"
          placeholderTextColor="#64748b"
        />

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter full name"
          placeholderTextColor="#64748b"
        />

        {/* Phone */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          placeholderTextColor="#64748b"
        />

        {/* Country Picker */}
        <Text style={styles.label}>Country</Text>
        <TouchableOpacity style={styles.select} onPress={() => setOpen(true)}>
          <View style={styles.selectRow}>
            {selectedCountryObj && country !== "Select country" && (
              <Text style={styles.flag}>{countryFlag}</Text>
            )}
            <Text
              style={[
                styles.selectText,
                country === "Select country" && { color: "#64748b" },
              ]}
            >
              {country}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <Text style={styles.submitText}>Update Profile</Text>
          )}
        </TouchableOpacity>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Country Modal */}
      <Modal visible={open} animationType="slide">
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Country</Text>

            {/* Search */}
            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search country..."
                placeholderTextColor="#64748b"
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity
                  style={styles.clearIcon}
                  onPress={() => setSearch("")}
                >
                  <Ionicons name="close-circle" size={24} color="#38bdf8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Country list */}
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.name}
              ListEmptyComponent={() => (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <Text style={{ color: "#94a3b8", fontSize: 16 }}>
                    No country matched
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    setCountry(item.name);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <View style={styles.countryRow}>
                    <Text style={styles.flag}>{item.flag}</Text>
                    <Text style={styles.countryText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.close}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  center: {
    flex: 1,
    justifyContent: "center",
    width: "90%",
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 12, color: "#94a3b8", marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: "#111827",
    color: "#f8fafc",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  select: {
    backgroundColor: "#0f172a",
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  selectRow: { flexDirection: "row", alignItems: "center" },
  flag: { fontSize: 18, marginRight: 8 },
  selectText: { fontSize: 16, color: "#f8fafc" },
  submitBtn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  // Modal
  modalSafe: { flex: 1, backgroundColor: "#020617" },
  modalContainer: { flex: 1, padding: 20, paddingTop: 20 },
  modalTitle: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchInput: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 12,
    color: "#f8fafc",
    fontSize: 16,
  },
  clearIcon: {
    position: "absolute",
    right: 14,
  },
  countryItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#0f172a",
  },
  countryRow: { flexDirection: "row", alignItems: "center" },
  countryText: { color: "#f8fafc", fontSize: 16 },
  close: { alignItems: "center", paddingVertical: 10 },
  closeText: { color: "#38bdf8", fontSize: 16, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
  },

  footerText: {
    color: "#94a3b8",
    marginRight: 10,
  },

  link: {
    color: "#38bdf8",
    fontWeight: "600",
  },
});
