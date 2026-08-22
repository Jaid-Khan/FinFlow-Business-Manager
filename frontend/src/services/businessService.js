import { apiRequest } from "./api";

export const getBusinesses = async () => {
  return apiRequest("/businesses", {
    method: "GET",
  });
};

export const getBusiness = async (businessId) => {
  return apiRequest(`/businesses/${businessId}`, {
    method: "GET",
  });
};

export const createBusiness = async (businessData) => {
  return apiRequest("/businesses", {
    method: "POST",
    body: JSON.stringify(businessData),
  });
};

export const updateBusiness = async (businessId, businessData) => {
  return apiRequest(`/businesses/${businessId}`, {
    method: "PATCH",
    body: JSON.stringify(businessData),
  });
};

export const deleteBusiness = async (businessId) => {
  return apiRequest(`/businesses/${businessId}`, {
    method: "DELETE",
  });
};

export const setActiveBusiness = async (businessId) => {
  return apiRequest("/users/active-business", {
    method: "PATCH",
    body: JSON.stringify({
      businessId,
    }),
  });
};