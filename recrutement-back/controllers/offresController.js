import { getAllOffres, getOffreById, getOffresByRecruteur, createOffre, updateOffre, deleteOffre } from "../models/Offre.js";

export const getOffres = async (req, res) => {
  try {
    const rows = await getAllOffres(req.query);
    res.json(rows);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const getOffre = async (req, res) => {
  try {
    const rows = await getOffreById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: "Offre non trouvée" });
    res.json(rows[0]);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const getMesOffres = async (req, res) => {
  try {
    const rows = await getOffresByRecruteur(req.user.id);
    res.json(rows);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const postOffre = async (req, res) => {
  try {
    const { titre, description, ville, type_contrat, domaine, salaire, competences_requises } = req.body;
    if (!titre || !description || !type_contrat) return res.status(400).json({ message: "Champs obligatoires manquants" });
    await createOffre(req.user.id, titre, description, ville, type_contrat, domaine, salaire, competences_requises);
    res.status(201).json({ message: "Offre créée" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const putOffre = async (req, res) => {
  try {
    const { titre, description, ville, type_contrat, domaine, salaire, competences_requises, statut } = req.body;
    const result = await updateOffre(req.params.id, req.user.id, titre, description, ville, type_contrat, domaine, salaire, competences_requises, statut);
    if (result.affectedRows === 0) return res.status(403).json({ message: "Accès refusé ou offre introuvable" });
    res.json({ message: "Offre mise à jour" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const removeOffre = async (req, res) => {
  try {
    const result = await deleteOffre(req.params.id, req.user.id);
    if (result.affectedRows === 0) return res.status(403).json({ message: "Accès refusé ou offre introuvable" });
    res.json({ message: "Offre supprimée" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
