import { createCandidature, getCandidaturesByCandidat, getCandidaturesByOffre, updateStatutCandidature, candidatureExists, deleteCandidature } from "../models/Candidature.js";

export const postuler = async (req, res) => {
  try {
    const { offre_id, lettre_motivation } = req.body;
    const existing = await candidatureExists(offre_id, req.user.id);
    if (existing.length) return res.status(409).json({ message: "Vous avez déjà postulé à cette offre" });
    await createCandidature(offre_id, req.user.id, lettre_motivation);
    res.status(201).json({ message: "Candidature envoyée" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const mesCandidatures = async (req, res) => {
  try {
    const rows = await getCandidaturesByCandidat(req.user.id);
    res.json(rows);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const candidaturesOffre = async (req, res) => {
  try {
    const rows = await getCandidaturesByOffre(req.params.id, req.user.id);
    res.json(rows);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const retirerCandidature = async (req, res) => {
  try {
    const result = await deleteCandidature(req.params.id, req.user.id);
    if (result.affectedRows === 0) return res.status(403).json({ message: "Accès refusé" });
    res.json({ message: "Candidature retirée" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const updateStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const valid = ["en_attente", "vue", "acceptee", "refusee"];
    if (!valid.includes(statut)) return res.status(400).json({ message: "Statut invalide" });
    const result = await updateStatutCandidature(req.params.id, statut, req.user.id);
    if (result.affectedRows === 0) return res.status(403).json({ message: "Accès refusé" });
    res.json({ message: "Statut mis à jour" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
