import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaUser, FaFilePdf, FaEnvelope, FaThList, FaColumns } from "react-icons/fa";
import api from "../api/api";
import ConfirmModal from "../components/ConfirmModal";
import { STATUS_CONFIG, STATUTS, CONTRATS, DOMAINES } from "../constants/status";
import { formatDateShort } from "../utils/formatDate";
import "../css/DashboardRecruteur.css";

const STATUT_BADGES = { en_attente: "badge-muted", vue: "badge-cyan", acceptee: "badge-success", refusee: "badge-danger" };
const EMPTY_FORM = { titre: "", description: "", ville: "", type_contrat: "Alternance", domaine: "Informatique", salaire: "", competences_requises: "" };

export default function DashboardRecruteur() {
  const navigate = useNavigate();
  const [offres, setOffres] = useState([]);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [loadingCands, setLoadingCands] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  const fetchOffres = () => api.get("/offres/mes-offres").then(r => setOffres(r.data)).catch(() => {});
  useEffect(() => { fetchOffres(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setModal(true); };
  const openEdit = (o) => {
    setForm({ titre: o.titre, description: o.description, ville: o.ville || "", type_contrat: o.type_contrat, domaine: o.domaine || "Informatique", salaire: o.salaire || "", competences_requises: o.competences_requises || "" });
    setEditing(o.id); setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(null); setForm(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await api.put(`/offres/${editing}`, { ...form, statut: "active" }); toast.success("Offre mise à jour !"); }
      else { await api.post("/offres", form); toast.success("Offre publiée !"); }
      closeModal(); fetchOffres();
    } catch (err) { toast.error(err.response?.data?.message || "Erreur"); }
    finally { setSaving(false); }
  };

  const deleteOffre = async () => {
    try {
      await api.delete(`/offres/${confirmDelete.id}`);
      toast.success("Offre supprimée"); fetchOffres();
      if (selectedOffre?.id === confirmDelete.id) { setSelectedOffre(null); setCandidatures([]); }
    } catch { toast.error("Erreur lors de la suppression"); }
    setConfirmDelete(null);
  };

  const viewCandidatures = async (offre) => {
    setSelectedOffre(offre); setLoadingCands(true);
    try { const r = await api.get(`/candidatures/offre/${offre.id}`); setCandidatures(r.data); }
    catch { setCandidatures([]); }
    finally { setLoadingCands(false); }
  };

  const changeStatut = async (candId, statut) => {
    try {
      await api.patch(`/candidatures/${candId}/statut`, { statut });
      setCandidatures(cs => cs.map(c => c.id === candId ? { ...c, statut } : c));
      toast.success("Statut mis à jour");
    } catch { toast.error("Erreur"); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const statsByOffre = selectedOffre ? {
    en_attente: candidatures.filter(c => c.statut === "en_attente").length,
    vue: candidatures.filter(c => c.statut === "vue").length,
    acceptee: candidatures.filter(c => c.statut === "acceptee").length,
    refusee: candidatures.filter(c => c.statut === "refusee").length,
  } : null;

  return (
    <div className="page">
      <div className="dashboard__header">
        <h1>Mes offres</h1>
        <button className="btn btn-primary" onClick={openCreate}><FaPlus /> Nouvelle offre</button>
      </div>

      <div className="recruteur__layout">
        <div className="offres__panel">
          {offres.length === 0 ? (
            <div className="empty">
              <p>Vous n'avez pas encore publié d'offre.</p>
              <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={openCreate}><FaPlus /> Créer une offre</button>
            </div>
          ) : offres.map((o, i) => (
            <motion.div key={o.id} className={`offre-item ${selectedOffre?.id === o.id ? "active" : ""}`}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
              <div className="offre-item__info" onClick={() => viewCandidatures(o)}>
                <h3>{o.titre}</h3>
                <div className="offre-item__meta">
                  <span className="badge badge-accent">{o.type_contrat}</span>
                  {o.ville && <span className="badge badge-muted">{o.ville}</span>}
                </div>
                <p className="offre-item__date">{formatDateShort(o.created_at)}</p>
              </div>
              <div className="offre-item__actions">
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(o)}><FaEdit /></button>
                <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(o)}><FaTrash /></button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="candidatures__panel">
          {!selectedOffre ? (
            <div className="empty">Sélectionnez une offre pour voir les candidatures.</div>
          ) : (
            <>
              <div className="cands__header">
                <h2 className="candidatures__title">{selectedOffre.titre} <span>({candidatures.length})</span></h2>
                <div className="view-toggle">
                  <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} title="Liste"><FaThList /></button>
                  <button className={viewMode === "kanban" ? "active" : ""} onClick={() => setViewMode("kanban")} title="Kanban"><FaColumns /></button>
                </div>
              </div>

              {statsByOffre && (
                <div className="cands__stats">
                  {STATUTS.map(s => (
                    <div key={s} className="cand-stat">
                      <span style={{ color: STATUS_CONFIG[s].color }}>{statsByOffre[s]}</span>
                      <small>{STATUS_CONFIG[s].label}</small>
                    </div>
                  ))}
                </div>
              )}

              {loadingCands ? <div className="loading">Chargement...</div> : candidatures.length === 0 ? (
                <div className="empty">Aucune candidature pour cette offre.</div>
              ) : viewMode === "kanban" ? (
                <div className="kanban">
                  {STATUTS.map(s => (
                    <div key={s} className="kanban__col">
                      <div className="kanban__col-head" style={{ borderTop: `3px solid ${STATUS_CONFIG[s].color}` }}>
                        {STATUS_CONFIG[s].label} <span>{candidatures.filter(c => c.statut === s).length}</span>
                      </div>
                      {candidatures.filter(c => c.statut === s).map(c => (
                        <div key={c.id} className="kanban__card">
                          <div className="cand-mini__avatar">
                            {c.avatar_url ? <img src={`${import.meta.env.VITE_API_URL}${c.avatar_url}`} alt="" /> : <FaUser />}
                          </div>
                          <div className="kanban__card-info">
                            <strong>{c.prenom} {c.nom}</strong>
                            <small>{c.titre_candidat || c.email}</small>
                          </div>
                          <div className="kanban__card-actions">
                            {c.cv_url && <a href={`${import.meta.env.VITE_API_URL}${c.cv_url}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm"><FaFilePdf /></a>}
                            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/messages", { state: { contact: { id: c.candidat_id, nom: c.nom, prenom: c.prenom, avatar_url: c.avatar_url } } })}><FaEnvelope /></button>
                            <select value={c.statut} onChange={e => changeStatut(c.id, e.target.value)} className="kanban__statut-select">
                              {STATUTS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : candidatures.map((c, i) => (
                <motion.div key={c.id} className="cand-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="cand-card__top">
                    <div className="cand-card__avatar">
                      {c.avatar_url ? <img src={`${import.meta.env.VITE_API_URL}${c.avatar_url}`} alt="" /> : <FaUser />}
                    </div>
                    <div className="cand-card__info">
                      <h4>{c.prenom} {c.nom}</h4>
                      <p>{c.email}</p>
                      {c.titre_candidat && <p className="cand-card__role">{c.titre_candidat}</p>}
                    </div>
                    <div className="cand-card__actions">
                      {c.cv_url && (
                        <a href={`${import.meta.env.VITE_API_URL}${c.cv_url}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                          <FaFilePdf /> CV
                        </a>
                      )}
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate("/messages", { state: { contact: { id: c.candidat_id, nom: c.nom, prenom: c.prenom, avatar_url: c.avatar_url } } })}><FaEnvelope /></button>
                    </div>
                  </div>
                  {c.competences && <p className="cand-card__skills">{c.competences}</p>}
                  {c.lettre_motivation && (
                    <details className="cand-card__lettre">
                      <summary>Lettre de motivation</summary>
                      <p>{c.lettre_motivation}</p>
                    </details>
                  )}
                  <div className="cand-card__statut">
                    <select value={c.statut} onChange={e => changeStatut(c.id, e.target.value)} className={`statut-select ${STATUT_BADGES[c.statut]}`}>
                      {STATUTS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                    </select>
                    <span className={`badge ${STATUT_BADGES[c.statut]}`}>{STATUS_CONFIG[c.statut].label}</span>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <div className="modal-overlay" onClick={closeModal}>
            <motion.div className="modal modal-lg" onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div className="modal__head">
                <h2>{editing ? "Modifier l'offre" : "Publier une offre"}</h2>
                <button className="modal__close" onClick={closeModal}><FaTimes /></button>
              </div>
              <form onSubmit={handleSubmit} className="offre-form">
                <div className="form-group"><label>Titre du poste *</label><input value={form.titre} onChange={set("titre")} required placeholder="ex: Développeur React en alternance" /></div>
                <div className="form-row">
                  <div className="form-group"><label>Type de contrat</label>
                    <select value={form.type_contrat} onChange={set("type_contrat")}>{CONTRATS.map(c => <option key={c}>{c}</option>)}</select>
                  </div>
                  <div className="form-group"><label>Domaine</label>
                    <select value={form.domaine} onChange={set("domaine")}>{DOMAINES.map(d => <option key={d}>{d}</option>)}</select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Ville</label><input value={form.ville} onChange={set("ville")} placeholder="Paris" /></div>
                  <div className="form-group"><label>Salaire / Rémunération</label><input value={form.salaire} onChange={set("salaire")} placeholder="1200€/mois" /></div>
                </div>
                <div className="form-group"><label>Compétences requises</label><input value={form.competences_requises} onChange={set("competences_requises")} placeholder="React, Node.js, SQL..." /></div>
                <div className="form-group"><label>Description du poste *</label><textarea rows={8} value={form.description} onChange={set("description")} required placeholder="Décrivez le poste, les missions, le profil recherché..." /></div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={saving}>
                  {saving ? "Sauvegarde..." : editing ? "Mettre à jour" : "Publier l'offre"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!confirmDelete}
        title="Supprimer cette offre ?"
        message={confirmDelete ? `"${confirmDelete.titre}" et toutes ses candidatures seront supprimées définitivement.` : ""}
        onConfirm={deleteOffre}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
