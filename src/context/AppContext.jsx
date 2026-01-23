import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Charger le mode maintenance au démarrage
  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const res = await fetch(`${API_URL}/config/maintenance`);
        const data = await res.json();
        setMaintenanceMode(data.maintenanceMode);
      } catch (err) {
        console.error("Erreur récupération maintenance :", err);
      }
    };
    fetchMaintenance();
  }, []);

  return (
    <AppContext.Provider
      value={{ maintenanceMode, setMaintenanceMode, user, setUser }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
