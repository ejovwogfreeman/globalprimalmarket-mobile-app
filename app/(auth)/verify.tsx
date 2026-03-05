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
import { resendVerification, verifyUser } from "../../data/api";

export default function Verify() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>(); // ✅ correct hook for RN

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const inputsRef = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (!email) {
      Alert.alert("Error", "Email not provided. Go back and try again.");
      router.replace("/signup/step3"); // redirect if email is missing
    }
  }, [email]);

  const handleChange = (value: string, index: number) => {
    const num = value.replace(/[^0-9]/g, ""); // allow only numbers

    if (num.length > 1) {
      // Handle pasted OTP
      const newCode = num.split("").slice(0, 6);
      setCode((prev) => {
        const updated = [...prev];
        newCode.forEach((digit, i) => (updated[i] = digit));
        return updated;
      });
      const lastIndex = Math.min(newCode.length - 1, 5);
      inputsRef.current[lastIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = num;
    setCode(newCode);

    if (num && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: { nativeEvent: { key: string } },
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const finalCode = code.join("");

    if (finalCode.length !== 6) {
      Alert.alert(
        "Invalid Code",
        "Please enter the 6-digit verification code.",
      );
      return;
    }

    if (!email) return;

    setIsVerifying(true);

    try {
      const res = await verifyUser({ email, code: finalCode });

      if (res.success) {
        Alert.alert("Success", "Your account has been verified!");
        router.replace({
          pathname: "/success",
          params: {
            message: "Your account has been successfully verified.",
          },
        });
      } else {
        Alert.alert("Verification Failed", res.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsVerifying(false);
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
      const res = await resendVerification({ email });

      if (res.success) {
        Alert.alert(
          "Code Sent",
          "A new verification code has been sent to your email.",
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

      <Text style={styles.title}>✅ Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        Please enter the 6-digit code sent to {email}
      </Text>

      <View style={styles.card}>
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
              maxLength={6}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerify}
          disabled={isVerifying}
        >
          <Text style={styles.buttonText}>
            {isVerifying ? "Verifying..." : "Verify"}
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
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
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
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
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
