import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaBriefcase, FaArrowLeft, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import api from "../api/api";
import "../css/OffreDetail.css";

export default function OffreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [lettre, setLettre] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get(`/offres/${id}`)
      .then(r => setOffre(r.data))
      .catch(() => navigate("/offres"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const postuler = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/candidatures", { offre_id: id, lettre_motivation: lettre });
      toast.success("Candidature envoyée !");
      setModal(false);
      setLettre("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally { setSending(false); }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (!offre) return null;

  const competences = offre.competences_requises?.split(",").map(c => c.trim()).filter(Boolean) || [];

  return (
    <div className="page offre-detail">
      <button className="btn btn-secondary btn-sm offre-back" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Retour
      </button>

      <div className="offre-detail__layout">
        <div className="offre-detail__main">
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="offre-detail__header">
              <div className="offre-detail__logo">
                {offre.logo_url
                  ? <img src={`${import.meta.env.VITE_API_URL}${offre.logo_url}`} alt={offre.nom_entreprise} />
                  : <FaBriefcase />}
              </div>
              <div>
                <h1>{offre.titre}</h1>
                <p className="offre-detail__company">{offre.nom_entreprise || `${offre.prenom} ${offre.nom}`}</p>
                <div className="offre-detail__meta">
                  <span className="badge badge-accent">{offre.type_contrat}</span>
                  {offre.domaine && <span className="badge badge-cyan">{offre.domaine}</span>}
                  {offre.ville && <span className="badge badge-muted"><FaMapMarkerAlt /> {offre.ville}</span>}
                </div>
              </div>
            </div>

            {offre.salaire && <p className="offre-detail__salary">Salaire : <strong>{offre.salaire}</strong></p>}

            <div className="offre-detail__section">
              <h2>Description du poste</h2>
              <p className="offre-detail__desc">{offre.description}</p>
            </div>

            {competences.length > 0 && (
              <div className="offre-detail__section">
                <h2>Compétences requises</h2>
                <div className="offre-detail__skills">
                  {competences.map(c => <span key={c} className="badge badge-accent">{c}</span>)}
                </div>
              </div>
            )}

            {offre.desc_entreprise && (
              <div className="offre-detail__section">
                <h2>À propos de l'entreprise</h2>
                <p className="offre-detail__desc">{offre.desc_entreprise}</p>
                {offre.site_web && <a href={offre.site_web} target="_blank" rel="noopener noreferrer" className="offre-detail__link">{offre.site_web}</a>}
              </div>
            )}
          </motion.div>
        </div>

        <div className="offre-detail__sidebar">
          <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            {user?.role === "candidat" ? (
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setModal(true)}>
                Postuler maintenant
              </button>
            ) : !user ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                  Connectez-vous pour postuler
                </p>
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => navigate("/login")}>
                  Se connecter
                </button>
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center" }}>
                Seuls les candidats peuvent postuler.
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(false)}>
            <motion.div className="modal" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              onClick={e => e.stopPropagation()}>
              <div className="modal__head">
                <h2>Postuler — {offre.titre}</h2>
                <button className="modal__close" onClick={() => setModal(false)}><FaTimes /></button>
              </div>
              <form onSubmit={postuler}>
                <div className="form-group">
                  <label>Lettre de motivation</label>
                  <textarea rows={10} value={lettre} onChange={e => setLettre(e.target.value)} required
                    placeholder="Expliquez pourquoi vous êtes le bon candidat pour ce poste..." />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={sending}>
                  {sending ? "Envoi..." : "Envoyer ma candidature"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
