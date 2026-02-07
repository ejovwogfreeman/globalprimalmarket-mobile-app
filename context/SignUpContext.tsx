// context/SignUpContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

// 1️⃣ Define the shape of the signUp data
interface SignUpData {
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  countryFlag: string;
  password: string;
}

// 2️⃣ Define the context value type
interface SignUpContextType {
  signUpData: SignUpData;
  updateSignUpData: (data: Partial<SignUpData>) => void;
}

// 3️⃣ Create the context
const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

// 4️⃣ Create provider props type
interface SignUpProviderProps {
  children: ReactNode;
}

// 5️⃣ Provider component
export const SignUpProvider: React.FC<SignUpProviderProps> = ({ children }) => {
  const [signUpData, setSignUpData] = useState<SignUpData>({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    country: "",
    countryFlag: "",
    password: "",
  });

  const updateSignUpData = (data: Partial<SignUpData>) => {
    setSignUpData((prev) => ({ ...prev, ...data }));
  };

  return (
    <SignUpContext.Provider value={{ signUpData, updateSignUpData }}>
      {children}
    </SignUpContext.Provider>
  );
};

// 6️⃣ Hook for consuming context
export const useSignUp = (): SignUpContextType => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUp must be used within a SignUpProvider");
  }
  return context;
};
