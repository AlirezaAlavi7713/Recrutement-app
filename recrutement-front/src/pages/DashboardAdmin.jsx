import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaUsers, FaBriefcase, FaFileAlt, FaTrash, FaUserShield, FaBuilding } from "react-icons/fa";
import api from "../api/api";
import "../css/DashboardAdmin.css";

const ROLES = ["candidat", "recruteur", "admin"];

async function fetchAdminStats() {
  const res = await api.get("/admin/stats");
  return res.data;
}

async function fetchAdminUsers() {
  const res = await api.get("/admin/users");
  return res.data;
}

async function fetchAdminOffres() {
  const res = await api.get("/admin/offres");
  return res.data;
}

export default function DashboardAdmin() {
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTab = async () => {
      setLoading(true);

      try {
        if (tab === "stats") setStats(await fetchAdminStats());
        if (tab === "users") setUsers(await fetchAdminUsers());
        if (tab === "offres") setOffres(await fetchAdminOffres());
      } catch {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    loadTab();
  }, [tab]);

  const changeRole = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      setUsers(us => us.map(u => u.id === id ? { ...u, role } : u));
      toast.success("Rôle mis à jour");
    } catch (err) { toast.error(err.response?.data?.message || "Erreur"); }
  };

  const deleteUser = async (id, nom) => {
    if (!confirm(`Supprimer ${nom} ?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(us => us.filter(u => u.id !== id));
      toast.success("Utilisateur supprimé");
    } catch (err) { toast.error(err.response?.data?.message || "Erreur"); }
  };

  const deleteOffre = async (id, titre) => {
    if (!confirm(`Supprimer "${titre}" ?`)) return;
    try {
      await api.delete(`/admin/offres/${id}`);
      setOffres(os => os.filter(o => o.id !== id));
      toast.success("Offre supprimée");
    } catch (err) { toast.error(err.response?.data?.message || "Erreur"); }
  };

  return (
    <div className="page">
      <div className="admin__header">
        <h1><FaUserShield /> Administration</h1>
      </div>

      <div className="admin__tabs">
        {[["stats", "Statistiques"], ["users", "Utilisateurs"], ["offres", "Offres"]].map(([key, label]) => (
          <button key={key} className={`admin__tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {loading && <div className="loading">Chargement...</div>}

      {tab === "stats" && stats && !loading && (
        <div className="admin__stats">
          {[
            { label: "Utilisateurs", value: stats.totalUsers, icon: <FaUsers />, color: "#6366f1" },
            { label: "Candidats", value: stats.totalCandidats, icon: <FaUsers />, color: "#06b6d4" },
            { label: "Recruteurs", value: stats.totalRecruteurs, icon: <FaBuilding />, color: "#f59e0b" },
            { label: "Offres publiées", value: stats.totalOffres, icon: <FaBriefcase />, color: "#10b981" },
            { label: "Candidatures", value: stats.totalCandidatures, icon: <FaFileAlt />, color: "#ec4899" },
          ].map((s, i) => (
            <motion.div key={s.label} className="admin-stat-card"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className="admin-stat-card__icon" style={{ color: s.color }}>{s.icon}</div>
              <div className="admin-stat-card__value" style={{ color: s.color }}>{s.value}</div>
              <div className="admin-stat-card__label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "users" && !loading && (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Inscrit le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td>{u.prenom} {u.nom}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={e => changeRole(u.id, e.target.value)}
                      className={`role-select role-${u.role}`}
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id, `${u.prenom} ${u.nom}`)}>
                      <FaTrash />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "offres" && !loading && (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Recruteur</th>
                <th>Entreprise</th>
                <th>Type</th>
                <th>Candidatures</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offres.map(o => (
                <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td>{o.titre}</td>
                  <td>{o.prenom} {o.nom}</td>
                  <td>{o.nom_entreprise || "—"}</td>
                  <td><span className="badge badge-accent">{o.type_contrat}</span></td>
                  <td>{o.nb_candidatures}</td>
                  <td>{new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteOffre(o.id, o.titre)}>
                      <FaTrash />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
