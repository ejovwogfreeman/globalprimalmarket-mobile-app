import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpSupport() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I make a deposit?",
      answer:
        "To make a deposit, go to the deposit section, choose your payment method, and upload the proof of payment. Your deposit will be reviewed and approved shortly.",
    },
    {
      question: "How long does a withdrawal take?",
      answer:
        "Withdrawals are processed within 1-3 business days depending on the payment method. Ensure your account has sufficient balance.",
    },
    {
      question: "Can I cancel an investment?",
      answer:
        "Investments cannot be canceled once approved. Please review investment terms before confirming.",
    },
    {
      question: "Is my money safe?",
      answer:
        "Yes, all transactions are encrypted and stored securely. We follow industry-standard security practices.",
    },
    {
      question: "Who can I contact for support?",
      answer:
        "You can reach our support team via email at support@globalprimalmarket.com or call us at +1 904 310 2851.",
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Help & Support</Text>

        {/* Contact Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.contactText}>
            📧 Email: support@globalprimalmarket.com
          </Text>
          <Text style={styles.contactText}>📞 Phone: +1 904 310 2851</Text>
          <Text style={styles.contactText}>
            📍 Address: 2441 Old Cypress Creek Rd
          </Text>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQ</Text>
          {faqs.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                onPress={() => setOpenIndex(openIndex === index ? null : index)}
                style={styles.questionRow}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                <Text style={styles.toggle}>
                  {openIndex === index ? "−" : "+"}
                </Text>
              </TouchableOpacity>
              {openIndex === index && (
                <Text style={styles.answerText}>{item.answer}</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617", // dark background
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc", // light text
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#94a3b8",
    marginBottom: 12,
    lineHeight: 22,
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#f8fafc",
  },
  contactText: { fontSize: 16, marginBottom: 6, color: "#94a3b8" },
  faqItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    color: "#94a3b8",
    borderBottomColor: "#0f172a",
    paddingBottom: 8,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: { fontSize: 16, fontWeight: "bold", color: "#94a3b8" },
  toggle: { fontSize: 22, fontWeight: "bold", color: "#38bdf8" },
  answerText: { fontSize: 15, color: "#94a3b8", marginTop: 6, lineHeight: 20 },
  reportButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#38bdf8",
    borderRadius: 8,
    alignItems: "center",
  },
});
