import { useCallback, useEffect, useState } from "react";

import { getSheets as fetchSheets } from "../services/sheetService";

import useAuth from "../hooks/useAuth";
import SheetsContext from "./SheetsContextDefinition";

function SheetsProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSheets = useCallback(async () => {
    if (!isAuthenticated) {
      setSheets([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchSheets();

      setSheets(data.sheets || []);
    } catch (error) {
      console.error("Fetch sheets error:", error);

      setError(error.message || "Failed to fetch sheets");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      if (!isAuthenticated) {
        setSheets([]);
      }
      return undefined;
    }

    let cancelled = false;

    const initializeSheets = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchSheets();

        if (cancelled) {
          return;
        }

        setSheets(data.sheets || []);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Fetch sheets error:", error);

        setError(error.message || "Failed to fetch sheets");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initializeSheets();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated]);

  const addSheet = (sheet) => {
    setSheets((currentSheets) => [...currentSheets, sheet]);
  };

  const removeSheet = (sheetId) => {
    setSheets((currentSheets) =>
      currentSheets.filter((sheet) => sheet._id !== sheetId)
    );
  };

  const updateSheetInList = (sheetId, updatedFields) => {
    setSheets((currentSheets) =>
      currentSheets.map((sheet) =>
        sheet._id === sheetId ? { ...sheet, ...updatedFields } : sheet
      )
    );
  };

  const value = {
    sheets,
    loading,
    error,
    loadSheets,
    addSheet,
    removeSheet,
    updateSheetInList,
  };

  return (
    <SheetsContext.Provider value={value}>
      {children}
    </SheetsContext.Provider>
  );
}

export default SheetsProvider;
