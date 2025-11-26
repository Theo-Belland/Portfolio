import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // ⚡ Charger le mode maintenance depuis le backend
  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const res = await fetch(`${API_URL}/config/maintenance`);
        if (!res.ok)
          throw new Error("Impossible de récupérer le mode maintenance");
        const data = await res.json();
        setMaintenanceMode(data.maintenanceMode);
      } catch (err) {
        console.error("Erreur récupération maintenance :", err);
      }
    };

    fetchMaintenance();
  }, [API_URL]);

  return (
    <AppContext.Provider
      value={{ maintenanceMode, setMaintenanceMode, user, setUser }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
