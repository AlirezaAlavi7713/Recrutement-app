import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaBriefcase, FaMapMarkerAlt, FaEnvelope, FaTrash } from "react-icons/fa";
import api from "../api/api";
import ConfirmModal from "../components/ConfirmModal";
import { STATUS_CONFIG } from "../constants/status";
import { formatDateShort } from "../utils/formatDate";
import "../css/DashboardCandidat.css";

const FILTER_STATUTS = ["tous", "en_attente", "vue", "acceptee", "refusee"];

export default function DashboardCandidat() {
  const navigate = useNavigate();
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState("tous");
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    api.get("/candidatures/mes-candidatures")
      .then(r => setCandidatures(r.data))
      .catch(() => setCandidatures([]))
      .finally(() => setLoading(false));
  }, []);

  const retirer = async (id) => {
    try {
      await api.delete(`/candidatures/${id}`);
      setCandidatures(cs => cs.filter(c => c.id !== id));
      toast.success("Candidature retirée");
    } catch { toast.error("Erreur"); }
    setConfirm(null);
  };

  const filtered = filterStatut === "tous" ? candidatures : candidatures.filter(c => c.statut === filterStatut);

  const stats = {
    total: candidatures.length,
    acceptee: candidatures.filter(c => c.statut === "acceptee").length,
    refusee: candidatures.filter(c => c.statut === "refusee").length,
    en_attente: candidatures.filter(c => c.statut === "en_attente" || c.statut === "vue").length,
  };

  return (
    <div className="page">
      <div className="dashboard__header">
        <h1>Mes candidatures</h1>
        <Link to="/offres" className="btn btn-primary">Voir les offres</Link>
      </div>

      <div className="dashboard__stats">
        {[
          { label: "Total envoyées", value: stats.total, color: "var(--accent)" },
          { label: "En attente / Vue", value: stats.en_attente, color: "var(--text-muted)" },
          { label: "Acceptées", value: stats.acceptee, color: "var(--success)" },
          { label: "Refusées", value: stats.refusee, color: "var(--danger)" },
        ].map((s, i) => (
          <motion.div key={s.label} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="candidat__filters">
        {FILTER_STATUTS.map(s => (
          <button key={s} className={`filter-btn ${filterStatut === s ? "active" : ""}`} onClick={() => setFilterStatut(s)}>
            {s === "tous" ? "Toutes" : STATUS_CONFIG[s]?.label}
            {s !== "tous" && <span className="filter-count">{candidatures.filter(c => c.statut === s).length}</span>}
          </button>
        ))}
      </div>

      {loading ? <div className="loading">Chargement...</div> : filtered.length === 0 ? (
        <div className="empty">
          <FaBriefcase style={{ fontSize: "3rem", opacity: 0.3, marginBottom: "1rem" }} />
          <p>{filterStatut === "tous" ? "Vous n'avez pas encore postulé à des offres." : "Aucune candidature dans cette catégorie."}</p>
          {filterStatut === "tous" && <Link to="/offres" className="btn btn-primary" style={{ marginTop: "1rem" }}>Trouver une offre</Link>}
        </div>
      ) : (
        <div className="candidatures__list">
          {filtered.map((c, i) => {
            const cfg = STATUS_CONFIG[c.statut] || STATUS_CONFIG.en_attente;
            return (
              <motion.div key={c.id} className="candidature-card" style={{ borderLeft: `3px solid ${cfg.color}` }}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <div className="candidature-card__info">
                  <div className="candidature-card__logo">
                    {c.logo_url ? <img src={`${import.meta.env.VITE_API_URL}${c.logo_url}`} alt="" /> : <FaBriefcase />}
                  </div>
                  <div>
                    <h3>{c.titre_offre || c.titre}</h3>
                    <p className="candidature-card__company">{c.nom_entreprise || `${c.prenom_recruteur} ${c.nom_recruteur}`}</p>
                    {c.ville && <p className="candidature-card__meta"><FaMapMarkerAlt /> {c.ville}</p>}
                    <p className="candidature-card__date">{formatDateShort(c.created_at)}</p>
                  </div>
                </div>
                <div className="candidature-card__status">
                  <span className={`badge ${cfg.badge}`}>{cfg.icon} {cfg.label}</span>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate("/messages", { state: { contact: { id: c.recruteur_id, nom: c.nom_recruteur, prenom: c.prenom_recruteur, avatar_url: c.avatar_recruteur } } })}>
                    <FaEnvelope /> Contacter
                  </button>
                  <Link to={`/offres/${c.offre_id}`} className="btn btn-secondary btn-sm">Voir l'offre</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => setConfirm(c)}>
                    <FaTrash /> Retirer
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Retirer la candidature ?"
        message={confirm ? `Votre candidature pour "${confirm.titre_offre || confirm.titre}" sera supprimée définitivement.` : ""}
        onConfirm={() => retirer(confirm.id)}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
