// import { deleteAccount } from "@/data/api";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   Alert,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TextStyle,
//   TouchableOpacity,
//   View,
//   ViewStyle,
// } from "react-native";
// import Toast from "react-native-toast-message";

// export default function DeleteAccount() {
//   const router = useRouter();

//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleDelete = async () => {
//     if (!password) {
//       Alert.alert("Missing Password", "Please enter your password");
//       return;
//     }

//     setLoading(true);

//     try {
//       const userString = await AsyncStorage.getItem("user");
//       const user = userString ? JSON.parse(userString) : null;

//       if (!user?.token) {
//         Alert.alert("Error", "You are not logged in");
//         return;
//       }

//       // ✅ USE YOUR API FUNCTION
//       const res = await deleteAccount(user.token, password);

//       if (!res.success) {
//         Alert.alert("Failed", res.message || "Unable to delete account");
//         return;
//       }

//       // Clear storage
//       await AsyncStorage.removeItem("user");

//       Toast.show({
//         type: "success",
//         text1: "Account Deleted",
//         text2: "Your account has been removed successfully",
//         position: "top",
//       });

//       router.replace("/settings/deleteaccountsuccess");
//     } catch (error: any) {
//       Alert.alert("Error", error.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       <Text style={styles.title}>Delete Account ⚠️</Text>
//       <Text style={styles.subtitle}>
//         This action is permanent. Enter your password to confirm.
//       </Text>

//       <View style={styles.card}>
//         <TextInput
//           placeholder="Enter Password"
//           placeholderTextColor="#9ca3af"
//           secureTextEntry
//           style={styles.input}
//           value={password}
//           onChangeText={setPassword}
//         />

//         <TouchableOpacity
//           style={styles.deleteButton}
//           onPress={handleDelete}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>
//             {loading ? "Deleting..." : "Delete Account"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => router.back()}>
//           <Text style={styles.cancelText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// /* ---------------- STYLES ---------------- */

// type Styles = {
//   container: ViewStyle;
//   title: TextStyle;
//   subtitle: TextStyle;
//   card: ViewStyle;
//   input: TextStyle;
//   deleteButton: ViewStyle;
//   buttonText: TextStyle;
//   cancelText: TextStyle;
// };

// const styles = StyleSheet.create<Styles>({
//   container: {
//     flex: 1,
//     backgroundColor: "#020617", // dark background
//     justifyContent: "center",
//     padding: 24,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "700",
//     color: "#f8fafc",
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#94a3b8",
//     textAlign: "center",
//     marginBottom: 30,
//     marginTop: 10,
//   },
//   card: {
//     backgroundColor: "#0f172a",
//     borderRadius: 16,
//     padding: 20,
//   },
//   input: {
//     backgroundColor: "#020617", // dark background
//     borderRadius: 12,
//     padding: 14,
//     color: "#f8fafc",
//     marginBottom: 20,
//     fontSize: 16,
//   },
//   deleteButton: {
//     backgroundColor: "#dc2626",
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   cancelText: {
//     color: "#38bdf8",
//     textAlign: "center",
//     marginTop: 18,
//     fontWeight: "600",
//   },
// });

import { deleteAccount } from "@/data/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Toast from "react-native-toast-message";

export default function DeleteAccount() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!user?.token) {
        Toast.show({
          type: "error",
          text1: "Error Deleting Account",
          text2: "You are not logged in",
          position: "top",
        });
        return;
      }

      const res = await deleteAccount(user.token, password);

      if (!res.success) {
        Toast.show({
          type: "error",
          text1: "Error Deleting Account",
          text2: res.message || "Unable to delete account",
          position: "top",
        });
        return;
      }

      await AsyncStorage.removeItem("user");

      setShowModal(false);
      setLoading(false);

      Toast.show({
        type: "success",
        text1: "Account Deleted",
        text2: "Your account has been removed successfully",
        position: "top",
      });

      router.replace("/settings/deleteaccountsuccess");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error Deleting Account",
        text2: error.message || "Something went wrong",
        position: "top",
      });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const confirmDelete = () => {
    if (!password) {
      Toast.show({
        type: "error",
        text1: "Missing Password",
        text2: "Please enter your password",
        position: "top",
      });
      return;
    }
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>Delete Account ⚠️</Text>
      <Text style={styles.subtitle}>
        This action is permanent. Enter your password to confirm.
      </Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Enter Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={confirmDelete}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Processing..." : "Delete Account"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* ---------------- MODAL ---------------- */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={styles.modalText}>
              This action cannot be undone. Your account will be permanently
              deleted.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowModal(false)}
                disabled={loading}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleDelete}
                disabled={loading}
              >
                <Text style={styles.confirmBtnText}>
                  {loading ? "Deleting..." : "Yes, Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

type Styles = {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  card: ViewStyle;
  input: TextStyle;
  deleteButton: ViewStyle;
  buttonText: TextStyle;
  cancelText: TextStyle;
  modalOverlay: ViewStyle;
  modalBox: ViewStyle;
  modalTitle: TextStyle;
  modalText: TextStyle;
  modalActions: ViewStyle;
  cancelBtn: ViewStyle;
  confirmBtn: ViewStyle;
  cancelBtnText: TextStyle;
  confirmBtnText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#020617", // dark background
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#f8fafc",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 20,
  },
  input: {
    backgroundColor: "#020617", // dark background
    borderRadius: 12,
    padding: 14,
    color: "#f8fafc",
    marginBottom: 20,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelText: {
    color: "#38bdf8",
    textAlign: "center",
    marginTop: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#0f172a",
    padding: 20,
    borderRadius: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 10,
    textAlign: "center",
  },

  modalText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelBtn: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#334155",
    alignItems: "center",
  },

  confirmBtn: {
    flex: 1,
    marginLeft: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#dc2626",
    alignItems: "center",
  },

  cancelBtnText: {
    color: "#f8fafc",
    fontWeight: "600",
  },

  confirmBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
