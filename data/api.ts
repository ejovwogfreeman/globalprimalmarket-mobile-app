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
