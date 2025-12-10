import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../Styles/admin.scss";

export default function DashboardAdmin() {
  const { maintenanceMode, setMaintenanceMode } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMaintenance = () => setMaintenanceMode(!maintenanceMode);

  return (
    <div className="dashboard-admin">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li>
              <button onClick={() => navigate("/admin/managementProject")}>
                📁 Projets
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/admin/users")}>
                👥 Utilisateurs
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="main-content">
        {/* Navbar horizontale */}
        <nav className="admin-navbar">
          <div>
            <button onClick={toggleMaintenance}>
              {maintenanceMode ? "🚧 Maintenance ON" : "✅ Maintenance OFF"}
            </button>
          </div>
          <div>
            <button onClick={handleLogout}>🔒 Déconnexion</button>
          </div>
        </nav>

        {/* Stats */}
        <div className="stats-container">
          <div className="stat-card">Visites du jour</div>
          <div className="stat-card">Visites du mois</div>
          <div className="stat-card">Projets récents</div>
        </div>
      </section>
    </div>
  );
}
