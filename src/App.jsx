import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import MaintenancePage from "./pages/MaintenancePage";
import DashboardAdmin from "./pages/Admin";
import ManagementProjects from "./pages/managementProject";
import Footer from "./components/Footer";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <div className="glow"></div>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/maintenance" element={<MaintenancePage />} />

              {/* Dashboard principal */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <DashboardAdmin />
                  </ProtectedRoute>
                }
              />

              {/* Gestion des projets séparée */}
              <Route
                path="/admin/managementProject"
                element={
                  <ProtectedRoute>
                    <ManagementProjects />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}
