import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import api from "../api/api";

export default function Register() {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", password: "", role: "candidat" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.token, res.data.user);
      toast.success("Compte créé !");
      navigate(form.role === "recruteur" ? "/dashboard/recruteur" : "/offres");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="page-sm">
      <div className="card">
        <h1 style={{ marginBottom: "0.5rem" }}>Créer un compte</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group"><label>Prénom</label><input value={form.prenom} onChange={set("prenom")} required placeholder="Alireza" /></div>
            <div className="form-group"><label>Nom</label><input value={form.nom} onChange={set("nom")} required placeholder="Alavi" /></div>
          </div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={set("email")} required placeholder="votre@email.com" /></div>
          <div className="form-group"><label>Mot de passe</label><input type="password" value={form.password} onChange={set("password")} required placeholder="••••••••" /></div>
          <div className="form-group">
            <label>Je suis</label>
            <select value={form.role} onChange={set("role")}>
              <option value="candidat">Candidat — je cherche un emploi</option>
              <option value="recruteur">Recruteur — je recrute</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
