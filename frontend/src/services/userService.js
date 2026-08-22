import { apiRequest } from "./api";

export const getCurrentUser = async () => {
  return apiRequest("/users/me", {
    method: "GET",
  });
};

export const updateCurrentUser = async (userData) => {
  return apiRequest("/users/me", {
    method: "PATCH",
    body: JSON.stringify(userData),
  });
};