import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import api from "../api/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);
      toast.success("Connexion réussie !");
      const role = res.data.user.role;
      navigate(role === "recruteur" ? "/dashboard/recruteur" : role === "admin" ? "/dashboard/admin" : "/offres");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de connexion");
    } finally { setLoading(false); }
  };

  return (
    <div className="page-sm">
      <div className="card">
        <h1 style={{ marginBottom: "2rem" }}>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="votre@email.com" />
          </div>
          <div className="form-group"><label>Mot de passe</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="••••••••" />
          </div>
          <Link to="/register" className="btn btn-secondary" style={{ width: "100%", marginBottom: "0.6rem", justifyContent: "center" }}>
            Créer un compte
          </Link>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
