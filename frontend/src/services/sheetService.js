import { apiRequest } from "./api";

export const getSheets = async () => {
  return apiRequest("/sheets", {
    method: "GET",
  });
};

export const getSheet = async (sheetId) => {
  return apiRequest(`/sheets/${sheetId}`, {
    method: "GET",
  });
};

export const createSheet = async (sheetData) => {
  return apiRequest("/sheets", {
    method: "POST",
    body: JSON.stringify(sheetData),
  });
};

export const updateSheet = async (sheetId, sheetData) => {
  return apiRequest(`/sheets/${sheetId}`, {
    method: "PATCH",
    body: JSON.stringify(sheetData),
  });
};

export const deleteSheet = async (sheetId) => {
  return apiRequest(`/sheets/${sheetId}`, {
    method: "DELETE",
  });
};