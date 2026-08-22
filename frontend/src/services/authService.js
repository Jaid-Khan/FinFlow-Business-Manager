import { apiRequest } from "./api";

export const registerUser = async (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (credentials) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const logoutUser = async () => {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
};

export const refreshToken = async () => {
  return apiRequest("/auth/refresh-token", {
    method: "POST",
  });
};

export const forgotPassword = async (email) => {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (token, password) => {
  return apiRequest(`/auth/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify({
      password,
    }),
  });
};