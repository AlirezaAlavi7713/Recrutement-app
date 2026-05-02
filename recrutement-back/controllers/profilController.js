import { getProfilByUser, upsertProfil, updateCV, getEntrepriseByUser, upsertEntreprise } from "../models/Profil.js";
import { updateUserAvatar } from "../models/User.js";

export const getProfil = async (req, res) => {
  try {
    const rows = await getProfilByUser(req.user.id);
    res.json(rows[0] || {});
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const updateProfil = async (req, res) => {
  try {
    const { titre, bio, ville, telephone, competences, disponibilite } = req.body;
    await upsertProfil(req.user.id, titre, bio, ville, telephone, competences, disponibilite);
    res.json({ message: "Profil mis à jour" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const uploadCV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Fichier manquant" });
    const cv_url = `/uploads/${req.file.filename}`;
    await updateCV(req.user.id, cv_url);
    res.json({ cv_url });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Fichier manquant" });
    const avatar_url = `/uploads/${req.file.filename}`;
    await updateUserAvatar(req.user.id, avatar_url);
    res.json({ avatar_url });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const getEntreprise = async (req, res) => {
  try {
    const rows = await getEntrepriseByUser(req.user.id);
    res.json(rows[0] || {});
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const updateEntreprise = async (req, res) => {
  try {
    const { nom_entreprise, secteur, description, site_web, ville } = req.body;
    await upsertEntreprise(req.user.id, nom_entreprise, secteur, description, site_web, ville);
    res.json({ message: "Entreprise mise à jour" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
