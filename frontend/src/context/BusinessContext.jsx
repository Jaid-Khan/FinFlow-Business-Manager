import { useCallback, useEffect, useState } from "react";

import {
  getBusinesses,
  setActiveBusiness,
} from "../services/businessService";

import useAuth from "../hooks/useAuth";
import BusinessContext from "./BusinessContextDefinition";

function BusinessProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [businesses, setBusinesses] = useState([]);
  const [activeBusiness, setActiveBusinessState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBusinesses = useCallback(async () => {
    if (!isAuthenticated) {
      setBusinesses([]);
      setActiveBusinessState(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getBusinesses();

      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error("Fetch businesses error:", error);

      setError(error.message || "Failed to fetch businesses");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return undefined;
    }

    let cancelled = false;

    const initializeBusinesses = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getBusinesses();

        if (cancelled) {
          return;
        }

        setBusinesses(data.businesses || []);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Fetch businesses error:", error);

        setError(error.message || "Failed to fetch businesses");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initializeBusinesses();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated]);

  const selectBusiness = async (businessId) => {
    setError("");

    try {
      const data = await setActiveBusiness(businessId);

      const business = data.business;

      setActiveBusinessState(business);

      return business;
    } catch (error) {
      console.error("Set active business error:", error);

      setError(error.message || "Failed to select active business");

      throw error;
    }
  };

  const clearBusiness = () => {
    setActiveBusinessState(null);
  };

  const value = {
    businesses,
    activeBusiness,
    loading,
    error,
    loadBusinesses,
    selectBusiness,
    clearBusiness,
    setBusinesses,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

export default BusinessProvider;