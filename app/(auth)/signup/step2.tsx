import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
// ✅ Import the country data
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignUp } from "../../../context/SignUpContext";
import { COUNTRIES } from "../../../data/countries";

export default function Step2() {
  const router = useRouter();
  const { updateSignUpData } = useSignUp();
  const [country, setCountry] = useState("Select country");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(COUNTRIES);

  // Filter countries as user types
  useEffect(() => {
    const filtered = COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredCountries(filtered);
  }, [search]);

  // Get selected country object for display
  const selectedCountryObj = COUNTRIES.find((c) => c.name === country);
  const countryFlag = selectedCountryObj ? selectedCountryObj.flag : "";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.step}>2/3</Text>

          <Text style={styles.title}>Your Location</Text>
          <Text style={styles.subtitle}>Select your country to continue</Text>

          {/* Dropdown Trigger */}
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

          {/* Continue */}
          <TouchableOpacity
            style={[
              styles.button,
              country === "Select country" && { opacity: 0.6 },
            ]}
            disabled={country === "Select country"}
            onPress={() => {
              updateSignUpData({ country, countryFlag }); // ✅ SAVE STEP 2 DATA
              router.push("/signup/step3");
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.link}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Country Modal */}
      <Modal visible={open} animationType="slide">
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Country</Text>

            {/* Search Input */}
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

            {/* Country List */}
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

            {/* Close Button */}
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

type Styles = {
  safe: ViewStyle;
  scroll: ViewStyle;
  container: ViewStyle;
  step: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  select: ViewStyle;
  selectRow: ViewStyle;
  flag: TextStyle;
  selectText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  modalSafe: ViewStyle;
  modalContainer: ViewStyle;
  modalTitle: TextStyle;
  searchRow: ViewStyle;
  searchInput: TextStyle;
  clearIcon: ViewStyle;
  countryItem: ViewStyle;
  countryRow: ViewStyle;
  countryText: TextStyle;
  close: ViewStyle;
  closeText: TextStyle;
  footer: ViewStyle;
  footerText: TextStyle;
  link: TextStyle;
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  scroll: { flexGrow: 1, justifyContent: "center" },
  container: { padding: 24 },
  step: { color: "#38bdf8", fontWeight: "600", marginBottom: 16 },
  title: { color: "#f8fafc", fontSize: 28, fontWeight: "700", marginBottom: 6 },
  subtitle: { color: "#94a3b8", marginBottom: 28 },
  select: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
  },
  selectRow: { flexDirection: "row", alignItems: "center" },
  flag: { fontSize: 20, marginRight: 8 },
  selectText: { fontSize: 16, color: "#f8fafc" },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalSafe: { flex: 1, backgroundColor: "#020617" },
  modalContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
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
    borderRadius: 14,
    padding: 14,
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
