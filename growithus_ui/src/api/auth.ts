
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

export const resetPassword = async (password: string) => {
  try {
    // In a real app, you'd also send a reset token
    const response = await axios.post(`${API_URL}/reset-password`, { password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};
