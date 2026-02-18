import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

type TransactionType =
  | "deposit"
  | "withdrawal"
  | "investment"
  | "funding"
  | "bot purchase";

interface TransactionPayload {
  user: string;
  type: TransactionType;
  amount: number;
  mode: string;
  plan?: string;
}

interface TransactionContextType {
  loading: boolean;
  createTransaction: (data: TransactionPayload) => void;
}

const TransactionContext = createContext<TransactionContextType | null>(null);

export const TransactionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);

  const createTransaction = async (data: TransactionPayload) => {
    try {
      setLoading(true);

      // 🔗 BACKEND CALL GOES HERE
      console.log("Transaction:", data);

      // fake delay
      await new Promise((res) => setTimeout(res, 1000));

      Alert.alert(
        "Success",
        `${data.type.toUpperCase()} transaction submitted`,
      );
    } catch (error) {
      Alert.alert("Error", "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        loading,
        createTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransaction must be used inside TransactionProvider");
  }
  return context;
};
