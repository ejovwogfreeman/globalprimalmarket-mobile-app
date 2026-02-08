import { useUser } from "@/context/UserContext";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function ChangePhoto() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [photoUri, setPhotoUri] = useState<string | null>(
    user?.profilePicture || null,
  );
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const submitPhoto = async () => {
    if (!photoUri) {
      Alert.alert("Error", "Please select a photo");
      return;
    }

    try {
      setLoading(true);

      // Replace with actual upload API call if needed
      // Example: await uploadAvatar(user.token, photoUri);

      // Update user context locally
      setUser({ ...user, profilePicture: photoUri });

      Alert.alert("Success", "Profile photo updated!");
      router.push("/profile"); // Redirect back to profile
    } catch (err) {
      console.log("Update photo error:", err);
      Alert.alert("Error", "Could not update photo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Change Profile Photo</Text>

        {/* Avatar Preview */}
        <View style={styles.avatarWrapper}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.userName?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.editBtn} onPress={pickPhoto}>
            <Text style={styles.editText}>Pick Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={submitPhoto}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Photo</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<{
  safe: ViewStyle;
  container: ViewStyle;
  title: TextStyle;
  avatarWrapper: ViewStyle;
  avatar: ImageStyle; // ✅ Correct type for Image
  avatarText: TextStyle;
  editBtn: ViewStyle;
  editText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
}>({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: { padding: 24, alignItems: "center" },
  title: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },
  avatarWrapper: { alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { color: "#38bdf8", fontSize: 48, fontWeight: "700" },
  editBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  editText: { color: "#fff", fontWeight: "600" },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
