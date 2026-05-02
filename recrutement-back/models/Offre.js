import pool from "../config/db.js";

export const getAllOffres = async (filters = {}) => {
  // On prépare les valeurs : null = pas de filtre, sinon la valeur du filtre
  const type_contrat = filters.type_contrat || null;
  const domaine      = filters.domaine      || null;
  const ville        = filters.ville        ? `%${filters.ville}%`   : null;
  const search       = filters.search       ? `%${filters.search}%`  : null;

  // La requête SQL est fixe — chaque condition dit :
  // "si le filtre est NULL, ignore cette ligne ; sinon applique-le"
  const sql = `
    SELECT o.*, u.nom, u.prenom, e.nom_entreprise, e.logo_url, e.ville as ville_entreprise
    FROM offres o
    JOIN users u ON o.recruteur_id = u.id
    LEFT JOIN entreprises e ON u.id = e.user_id
    WHERE o.statut = 'active'
      AND (? IS NULL OR o.type_contrat = ?)
      AND (? IS NULL OR o.domaine = ?)
      AND (? IS NULL OR o.ville LIKE ?)
      AND (? IS NULL OR o.titre LIKE ? OR o.description LIKE ?)
    ORDER BY o.created_at DESC
  `;

  const [rows] = await pool.query(sql, [
    type_contrat, type_contrat,
    domaine,      domaine,
    ville,        ville,
    search,       search, search,
  ]);
  return rows;
};

export const getOffreById = async (id) => {
  const sql = `
    SELECT o.*, u.nom, u.prenom, e.nom_entreprise, e.logo_url, e.description as desc_entreprise, e.site_web
    FROM offres o
    JOIN users u ON o.recruteur_id = u.id
    LEFT JOIN entreprises e ON u.id = e.user_id
    WHERE o.id = ?
  `;
  const [rows] = await pool.query(sql, [id]);
  return rows;
};

export const getOffresByRecruteur = async (recruteur_id) => {
  const sql = `SELECT * FROM offres WHERE recruteur_id = ? ORDER BY created_at DESC`;
  const [rows] = await pool.query(sql, [recruteur_id]);
  return rows;
};

export const createOffre = async (recruteur_id, titre, description, ville, type_contrat, domaine, salaire, competences_requises) => {
  const sql = `
    INSERT INTO offres (recruteur_id, titre, description, ville, type_contrat, domaine, salaire, competences_requises)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [response] = await pool.query(sql, [recruteur_id, titre, description, ville, type_contrat, domaine, salaire, competences_requises]);
  return response;
};

export const updateOffre = async (id, recruteur_id, titre, description, ville, type_contrat, domaine, salaire, competences_requises, statut) => {
  const sql = `
    UPDATE offres
    SET titre = ?, description = ?, ville = ?, type_contrat = ?, domaine = ?, salaire = ?, competences_requises = ?, statut = ?
    WHERE id = ? AND recruteur_id = ?
  `;
  const [response] = await pool.query(sql, [titre, description, ville, type_contrat, domaine, salaire, competences_requises, statut, id, recruteur_id]);
  return response;
};

export const deleteOffre = async (id, recruteur_id) => {
  const sql = `DELETE FROM offres WHERE id = ? AND recruteur_id = ?`;
  const [response] = await pool.query(sql, [id, recruteur_id]);
  return response;
};
