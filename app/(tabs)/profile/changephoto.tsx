import { useUser } from "@/context/UserContext";
import { changeProfilePicture } from "@/data/api";
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
import Toast from "react-native-toast-message";

export default function ChangePhoto() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [photoUri, setPhotoUri] = useState<string[]>(
    user?.profilePicture ? [user.profilePicture] : [],
  );
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // works across all SDKs
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUri([result.assets[0].uri]);
    }
  };

  const submitPhoto = async () => {
    if (!photoUri || photoUri.length === 0) {
      Alert.alert("Error", "Please select a photo");
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

      // Append each image in the array (even if usually 1)
      photoUri.forEach((uri, index) => {
        const fileName = uri.split("/").pop() || `profile-${index}.jpg`;
        formData.append("profilePicture", {
          uri,
          name: fileName,
          type: "image/jpeg", // adjust type if needed
        } as any);
      });

      // Send to backend
      const response = await changeProfilePicture(user.token, formData);

      console.log("Profile picture API response:", response);

      if (!response.success) {
        Alert.alert(
          "Error",
          response.message || "Failed to update profile picture",
        );
        return;
      }

      // Update user context with new profile picture array
      setUser({ ...user, profilePicture: photoUri });

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile picture has been updated successfully",
        position: "top",
      });

      router.push("/profile"); // Redirect back to profile
    } catch (err) {
      console.log("Update photo error:", err);
      Alert.alert("Error", "Could not update profile picture");
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
            <Image source={{ uri: photoUri[0] }} style={styles.avatar} />
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
