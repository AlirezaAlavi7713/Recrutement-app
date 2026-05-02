import { getStats, getPublicStats, getAllUsers, updateUserRole, deleteUser, getAllOffresAdmin, deleteOffreAdmin } from "../models/Admin.js";

export const stats = async (req, res) => {
  try {
    const data = await getStats();
    res.json(data);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const publicStats = async (req, res) => {
  try {
    const data = await getPublicStats();
    res.json(data);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const listUsers = async (req, res) => {
  try {
    const rows = await getAllUsers();
    res.json(rows);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const changeRole = async (req, res) => {
  try {
    const { role } = req.body;
    const valid = ["candidat", "recruteur", "admin"];
    if (!valid.includes(role)) return res.status(400).json({ message: "Rôle invalide" });
    if (Number(req.params.id) === req.user.id) return res.status(400).json({ message: "Impossible de modifier son propre rôle" });
    await updateUserRole(req.params.id, role);
    res.json({ message: "Rôle mis à jour" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const removeUser = async (req, res) => {
  try {
    if (Number(req.params.id) === req.user.id) return res.status(400).json({ message: "Impossible de supprimer son propre compte" });
    const result = await deleteUser(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ message: "Utilisateur supprimé" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const listOffres = async (req, res) => {
  try {
    const rows = await getAllOffresAdmin();
    res.json(rows);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const removeOffre = async (req, res) => {
  try {
    const result = await deleteOffreAdmin(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Offre introuvable" });
    res.json({ message: "Offre supprimée" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
