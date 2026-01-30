import axios, { AxiosResponse } from "axios";

// -----------------------------
// Base API Configuration
// -----------------------------
// const API_BASE_URL = "http://localhost:8000/api";
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

export type AuthResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    userName?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    country: string;
    password: string;
  };
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
    // Axios errors
    return {
      success: false,
      message: error,
      // message: error.response?.data?.message || "Registration failed",
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
      message: error.response?.data?.message || "Login failed",
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
      message: error.response?.data?.message || "Failed to fetch profile",
    };
  }
};
