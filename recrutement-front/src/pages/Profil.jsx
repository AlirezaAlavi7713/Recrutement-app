import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUser, FaUpload, FaFilePdf, FaExternalLinkAlt } from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import api from "../api/api";
import "../css/Profil.css";

export default function Profil() {
  const { user, login } = useAuth();
  const [tab, setTab] = useState("profil");
  const [loading, setLoading] = useState(() =>
    ["candidat", "recruteur"].includes(user?.role),
  );
  const [saving, setSaving] = useState(false);

  const [candidat, setCandidat] = useState({ titre: "", bio: "", ville: "", telephone: "", competences: "", disponibilite: "", cv_url: "" });
  const [entreprise, setEntreprise] = useState({ nom_entreprise: "", secteur: "", description: "", site_web: "", ville: "" });

  useEffect(() => {
    if (!user) return;

    if (user.role === "candidat") {
      api.get("/profil/candidat")
        .then(r => { if (r.data) setCandidat({ titre: r.data.titre || "", bio: r.data.bio || "", ville: r.data.ville || "", telephone: r.data.telephone || "", competences: r.data.competences || "", disponibilite: r.data.disponibilite || "", cv_url: r.data.cv_url || "" }); })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (user.role === "recruteur") {
      api.get("/profil/entreprise")
        .then(r => { if (r.data) setEntreprise({ nom_entreprise: r.data.nom_entreprise || "", secteur: r.data.secteur || "", description: r.data.description || "", site_web: r.data.site_web || "", ville: r.data.ville || "" }); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  const saveCandidat = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await api.put("/profil/candidat", candidat); toast.success("Profil mis à jour !"); }
    catch { toast.error("Erreur lors de la sauvegarde"); }
    finally { setSaving(false); }
  };

  const saveEntreprise = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await api.put("/profil/entreprise", entreprise); toast.success("Entreprise mise à jour !"); }
    catch { toast.error("Erreur lors de la sauvegarde"); }
    finally { setSaving(false); }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      const res = await api.post("/profil/avatar", fd);
      const updated = { ...user, avatar_url: res.data.avatar_url };
      login(localStorage.getItem("token"), updated);
      toast.success("Avatar mis à jour !");
    } catch { toast.error("Erreur upload avatar"); }
  };

  const uploadCV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("cv", file);
    try {
      const res = await api.post("/profil/candidat/cv", fd);
      setCandidat(c => ({ ...c, cv_url: res.data.cv_url }));
      toast.success("CV importé !");
    } catch { toast.error("Erreur upload CV"); }
  };

  const setC = (k) => (e) => setCandidat(f => ({ ...f, [k]: e.target.value }));
  const setE = (k) => (e) => setEntreprise(f => ({ ...f, [k]: e.target.value }));

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="page page-sm profil-page">
      <h1 style={{ marginBottom: "0.5rem" }}>Mon profil</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>{user?.prenom} {user?.nom} · {user?.email}</p>

      <div className="profil__avatar-section">
        <div className="profil__avatar-wrap">
          <div className="profil__avatar">
            {user?.avatar_url
              ? <img src={`${import.meta.env.VITE_API_URL}${user.avatar_url}`} alt="avatar" />
              : <FaUser />}
          </div>
          <label className="profil__avatar-btn">
            <FaUpload /> Changer la photo
            <input type="file" accept="image/*" onChange={uploadAvatar} hidden />
          </label>
        </div>
      </div>

      {user?.role === "candidat" && (
        <div className="profil__tabs">
          <button className={`tab ${tab === "profil" ? "active" : ""}`} onClick={() => setTab("profil")}>Mon profil</button>
          <button className={`tab ${tab === "cv" ? "active" : ""}`} onClick={() => setTab("cv")}>Mon CV</button>
        </div>
      )}

      {(user?.role === "candidat" && tab === "profil") && (
        <form onSubmit={saveCandidat} className="card">
          <div className="form-group"><label>Titre / Poste recherché</label><input value={candidat.titre} onChange={setC("titre")} placeholder="ex: Développeur Full-Stack" /></div>
          <div className="form-group"><label>Bio</label><textarea value={candidat.bio} onChange={setC("bio")} placeholder="Présentez-vous..." /></div>
          <div className="form-row">
            <div className="form-group"><label>Ville</label><input value={candidat.ville} onChange={setC("ville")} placeholder="Lille" /></div>
            <div className="form-group"><label>Téléphone</label><input value={candidat.telephone} onChange={setC("telephone")} placeholder="06 12 34 56 78" /></div>
          </div>
          <div className="form-group"><label>Compétences (séparées par virgule)</label><input value={candidat.competences} onChange={setC("competences")} placeholder="React, Node.js, MySQL..." /></div>
          <div className="form-group"><label>Disponibilité</label><input value={candidat.disponibilite} onChange={setC("disponibilite")} placeholder="Septembre 2026" /></div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={saving}>
            {saving ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </form>
      )}

      {(user?.role === "candidat" && tab === "cv") && (
        <div className="card cv-section">
          <h3 style={{ marginBottom: "1.2rem" }}>Mon CV</h3>

          {candidat.cv_url && (
            <div className="cv-file">
              <FaFilePdf className="cv-file__icon" />
              <div className="cv-file__info">
                <span className="cv-file__name">{candidat.cv_url.split("/").pop()}</span>
                <span className="cv-file__label">CV actuel</span>
              </div>
              <a
                href={`${import.meta.env.VITE_API_URL}${candidat.cv_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <FaExternalLinkAlt /> Ouvrir
              </a>
            </div>
          )}

          {!candidat.cv_url && (
            <p className="cv-empty">Aucun CV importé. Ajoutez votre CV pour que les recruteurs puissent le consulter.</p>
          )}

          <label className="btn btn-primary cv-upload-btn">
            <FaUpload /> {candidat.cv_url ? "Remplacer le CV" : "Importer un CV (PDF)"}
            <input type="file" accept=".pdf" onChange={uploadCV} hidden />
          </label>
        </div>
      )}

      {user?.role === "recruteur" && (
        <form onSubmit={saveEntreprise} className="card">
          <div className="form-group"><label>Nom de l'entreprise</label><input value={entreprise.nom_entreprise} onChange={setE("nom_entreprise")} placeholder="Mon Entreprise SAS" /></div>
          <div className="form-row">
            <div className="form-group"><label>Secteur</label><input value={entreprise.secteur} onChange={setE("secteur")} placeholder="Informatique, Finance..." /></div>
            <div className="form-group"><label>Ville</label><input value={entreprise.ville} onChange={setE("ville")} placeholder="Paris" /></div>
          </div>
          <div className="form-group"><label>Site web</label><input value={entreprise.site_web} onChange={setE("site_web")} placeholder="https://monentreprise.fr" /></div>
          <div className="form-group"><label>Description</label><textarea value={entreprise.description} onChange={setE("description")} placeholder="Décrivez votre entreprise..." /></div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={saving}>
            {saving ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </form>
      )}

      {user?.role === "admin" && (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <FaUser style={{ fontSize: "3rem", color: "var(--accent)", marginBottom: "1rem" }} />
          <h2>Compte administrateur</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Accès complet à la plateforme.</p>
        </div>
      )}
    </div>
  );
}
