import { User } from "@/context/UserContext";
import axios, { AxiosResponse } from "axios";

// -----------------------------
// Base API Configuration
// -----------------------------

const API_BASE_URL = "https://globalprimalmarket-api.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -----------------------------
// Types
// -----------------------------
export type RegisterData = {
  userName?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  countryFlag: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type VerifyData = {
  email: string;
  code: string; // OTP or verification code
};

export type ResendVerificationData = {
  email: string;
};

export type ForgetPasswordData = {
  email: String;
};

export type ChangePasswordData = {
  email: String;
  code: String;
  newPassword: String;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
};

export type DepositResponse = {
  success: boolean;
  message: string;
  transaction?: any;
};

export type WithdrawalResponse = {
  success: boolean;
  message: string;
  transaction?: any;
};

export type InvestResponse = {
  success: boolean;
  message: string;
  transaction?: any;
};

export interface Transaction {
  _id: string;
  type: "deposit" | "withdrawal" | "investment" | "funding" | "bot purchase";
  amount: number;
  status: "pending" | "in progress" | "approved" | "declined";
  mode?: string;
  plan?: string;
  durationDays?: number;
  dailyReturnPercent?: number;
  maxReturnPercent?: number;
  wallet?: string;
  createdAt: string;
  token: string;
}

interface TransactionsResponse {
  success: boolean;
  message?: string;
  count?: number;
  transactions?: Transaction[];
}

type TransactionResponse = {
  success: boolean;
  transaction?: Transaction;
  message?: string;
};

export type UpdateProfileResponse = {
  success: boolean;
  message?: string;
  user?: {
    userName: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    countryFlag: string;
  };
};

interface ChangeProfilePictureResponse {
  success: boolean;
  message: string;
  profilePicture?: string; // URL of uploaded image
}

export interface Bot {
  _id: string; // MongoDB ID
  name: string; // Bot name
  description: string; // Short description
  category?: string; // Optional: e.g., "AI", "Trading", etc.
  price: number; // Price to buy
  status?: string;
  image?: string; // Optional URL or base64
  features?: string[]; // Optional array of features
  dailyReturnPercent: string;
  durationDays: string;
  maxReturnPercent: string;
  createdAt: string;
  updatedAt: string;
}

export interface BotResponse {
  success: boolean;
  message?: string; // Optional error message
  bot?: Bot; // Single bot (for /bots/:id)
  bots?: Bot[]; // Multiple bots (for /bots)
  count?: number; // Optional: number of bots returned
}

export interface BotPurchaseResponse {
  success: boolean;
  message: string;
  transaction?: any;
}

// -----------------------------
// API Functions
// -----------------------------

// Registration
export const registerUser = async (
  data: RegisterData,
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/register",
      data,
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Registration failed",
    };
  }
};

// Login
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/login",
      data,
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Login failed",
    };
  }
};

// Verify (email or OTP)
export const verifyUser = async (data: VerifyData): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/verify",
      data,
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Verification failed",
    };
  }
};

// Verify (email or OTP)
export const resendVerification = async (
  data: ResendVerificationData,
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/resend-verification",
      data,
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Error Sending Verification code",
    };
  }
};

// Forget password (email or OTP)
export const forgetPassword = async (
  data: ForgetPasswordData,
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/forget-password",
      data,
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Error Sending Verification code",
    };
  }
};

// Change password (email or OTP)
export const changePassword = async (
  data: ChangePasswordData,
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/change-password",
      data,
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Error Sending Verification code",
    };
  }
};

// Get User Profile (authenticated)
export const getProfile = async (token: string): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.get(
      "/auth/profile",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch profile",
    };
  }
};

export const createDeposit = async (
  token: string,
  formData: any, // RN FormData ≠ DOM FormData
): Promise<DepositResponse> => {
  try {
    const response: AxiosResponse<DepositResponse> = await api.post(
      "/transactions/deposit",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Deposit failed",
    };
  }
};

export const createWithdrawal = async (
  token: string,
  payload: { amount: number; mode: string; wallet: string },
): Promise<WithdrawalResponse> => {
  try {
    const response: AxiosResponse<WithdrawalResponse> = await api.post(
      "/transactions/withdrawal",
      payload, // send JSON
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Withdrawal failed",
    };
  }
};

export const createInvestment = async (
  token: string,
  payload: { mode: string; amount: number; plan: string },
): Promise<InvestResponse> => {
  try {
    const response: AxiosResponse<InvestResponse> = await api.post(
      "/transactions/investment",
      payload, // send JSON
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Investment Failed",
    };
  }
};

export const getMyTransactions = async (
  token: string,
): Promise<TransactionsResponse> => {
  try {
    const response: AxiosResponse<TransactionsResponse> = await api.get(
      "/transactions/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch transactions",
    };
  }
};

export const getTransactionById = async (
  token: string,
  transactionId: string,
): Promise<TransactionResponse> => {
  try {
    const response: AxiosResponse<TransactionResponse> = await api.get(
      `/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch transaction",
    };
  }
};

export const updateUserProfile = async (
  token: string,
  payload: {
    userName: string;
    fullName: string;
    phoneNumber: string;
    country: string;
    countryFlag: string;
  },
): Promise<UpdateProfileResponse> => {
  try {
    const response = await api.put<UpdateProfileResponse>(
      "/user/update-profile", // adjust this to your backend route
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Profile update failed",
    };
  }
};

export const changeProfilePicture = async (
  token: string,
  formData: FormData, // RN FormData
): Promise<ChangeProfilePictureResponse> => {
  try {
    const response: AxiosResponse<ChangeProfilePictureResponse> =
      await api.post("/user/change-profile-picture", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile picture",
    };
  }
};

export const getAllBots = async (token: string): Promise<BotResponse> => {
  try {
    const response: AxiosResponse<BotResponse> = await api.get("/bots", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch bots",
    };
  }
};

export const getBotById = async (
  token: string,
  id: string,
): Promise<BotResponse> => {
  try {
    const response: AxiosResponse<BotResponse> = await api.get(`/bots/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Failed to fetch bot",
    };
  }
};

export const purchaseBot = async (
  token: string,
  formData: any, // RN FormData ≠ DOM FormData
): Promise<BotPurchaseResponse> => {
  try {
    const response: AxiosResponse<BotPurchaseResponse> = await api.post(
      "/bots/purchase",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Bot Purchase failed",
    };
  }
};

// -----------------------------
// Claim Bonus
// -----------------------------
export const claimBonus = async (
  token: string,
  transactionId: string,
): Promise<TransactionResponse> => {
  try {
    const response: AxiosResponse<TransactionResponse> = await api.put(
      `/transactions/${transactionId}/claim-bonus`,
      {}, // No body needed unless backend requires additional info
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to claim bonus",
    };
  }
};
