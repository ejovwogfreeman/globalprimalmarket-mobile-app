import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Verify() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputsRef = useRef([]);
  const MOCK_CODE = "123456";

  const handleChange = (value, index) => {
    // Allow only numbers
    const num = value.replace(/[^0-9]/g, "");

    if (num.length > 1) {
      // Pasted code (handle 6 digits)
      const newCode = num.split("").slice(0, 6);
      setCode((prev) => {
        const updated = [...prev];
        newCode.forEach((digit, i) => {
          updated[i] = digit;
        });
        return updated;
      });
      // Focus last filled input or blur if complete
      const lastIndex = Math.min(newCode.length - 1, 5);
      inputsRef.current[lastIndex].focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = num;
    setCode(newCode);

    // Move focus to next box if filled
    if (num && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const finalCode = code.join("");
    if (finalCode.length !== 6) {
      Alert.alert(
        "Invalid Code",
        "Please enter the 6-digit verification code.",
      );
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      if (finalCode === MOCK_CODE) {
        router.replace("/success");
      } else {
        Alert.alert("Incorrect Code", "The code you entered is incorrect.");
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        Please enter the 6-digit code sent to you
      </Text>

      <View style={styles.card}>
        <View style={styles.otpContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={digit}
              onChangeText={(val) => handleChange(val, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={6} // allow paste of full code
              ref={(ref) => (inputsRef.current[index] = ref)}
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
    </View>
  );
}

const styles = StyleSheet.create({
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
});
