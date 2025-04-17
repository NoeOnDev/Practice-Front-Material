import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const verifyEmail = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/verify-email`, userData);
    return response.data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const resendVerificationCode = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/resend-verification-code`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Error resending verification code:", error);
    throw error;
  }
};
