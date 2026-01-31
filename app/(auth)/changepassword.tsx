import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { changePassword, forgetPassword } from "../../data/api";

export default function ChangePassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (!email) {
      Alert.alert("Error", "Email not provided.");
      router.replace("/login");
    }
  }, [email]);

  const handleChange = (value: string, index: number) => {
    const num = value.replace(/[^0-9]/g, "");

    if (num.length > 1) {
      const split = num.split("").slice(0, 6);
      setCode(split.concat(Array(6 - split.length).fill("")));
      inputsRef.current[5]?.focus();
      return;
    }

    const updated = [...code];
    updated[index] = num;
    setCode(updated);

    if (num && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: { nativeEvent: { key: string } },
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Email is missing");
      return;
    }

    const finalCode = code.join("");

    if (finalCode.length !== 6) {
      Alert.alert("Invalid Code", "Enter the 6-digit code");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await changePassword({
        email, // ✅ now guaranteed string
        code: finalCode,
        newPassword,
      });

      if (res.success) {
        Alert.alert("Success 🔐", "Password changed successfully.");
        router.replace({
          pathname: "/success",
          params: {
            message: "Password changed successfully.",
          },
        });
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const [isResending, setIsResending] = useState<boolean>(false);
  const handleResend = async () => {
    if (!email) {
      Alert.alert("Error", "Email not found.");
      return;
    }

    setIsResending(true);

    try {
      const res = await forgetPassword({ email });

      if (res.success) {
        Alert.alert(
          "Code Sent",
          "Password reset email sent. Check your inbox for the code.",
        );
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>Change Password 🔐</Text>
      <Text style={styles.subtitle}>
        Enter the code sent to your email and your new password
      </Text>

      <View style={styles.card}>
        {/* OTP */}
        <View style={styles.otpContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref: TextInput | null) => {
                inputsRef.current[index] = ref;
              }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(val) => handleChange(val, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        {/* New Password */}
        <TextInput
          placeholder="New Password"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Updating..." : "Change Password"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleResend}
        disabled={isResending}
        style={styles.resendContainer}
      >
        <Text style={styles.resendText}>
          {isResending ? "Resending..." : "Didn’t get a code? Resend"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

type Styles = {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  card: ViewStyle;
  otpContainer: ViewStyle;
  otpInput: TextStyle;
  input: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  resendContainer: ViewStyle;
  resendText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f8fafc",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    fontSize: 22,
    borderWidth: 1,
    borderColor: "#64748b",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 14,
    color: "#f8fafc",
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resendContainer: {
    marginTop: 16,
    alignItems: "center",
  },

  resendText: {
    color: "#4F8EF7",
    fontSize: 14,
    fontWeight: "500",
  },
});
