import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/login.scss";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // renommé username → email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Si déjà connecté, redirige vers /admin
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "https://theobelland.fr/api";

      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        alert("❌ Identifiants incorrects");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/admin");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("⚠️ Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Connexion Admin</h2>
      <form className="login-card" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
