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

export const verifyEmail = async (email, code) => {
  try {
    const response = await axios.post(`${API_URL}/verify-email`, {
      email,
      code,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};
