import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import MaintenancePage from "./pages/MaintenancePage";
import DashboardAdmin from "./pages/Admin";
import ManagementProjects from "./pages/managementProject";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";
import ManageTechnologies from "./pages/ManageTechnologies";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import CookieConsent from "./components/CookieConsent";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Afficher le loader pendant 2.5 secondes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <AppProvider>
      <Router>
        <div className="app">
          <div className="glow"></div>

          <Routes>
            {/* ===== SITE PUBLIC ===== */}
            <Route
              path="/*"
              element={
                <div className="content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/maintenance" element={<MaintenancePage />} />
                  </Routes>
                </div>
              }
            />

            {/* ===== ADMIN (PLEIN ÉCRAN) ===== */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/managementProject"
              element={
                <ProtectedRoute>
                  <ManagementProjects />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/addProject"
              element={
                <ProtectedRoute>
                  <AddProject />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/edit/:id"
              element={
                <ProtectedRoute>
                  <EditProject />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/technologies"
              element={
                <ProtectedRoute>
                  <ManageTechnologies />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Footer />
          <CookieConsent />
        </div>
      </Router>
    </AppProvider>
  );
}
