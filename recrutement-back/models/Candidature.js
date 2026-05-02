import pool from "../config/db.js";

export const createCandidature = async (offre_id, candidat_id, lettre_motivation) => {
  const sql = `INSERT INTO candidatures (offre_id, candidat_id, lettre_motivation) VALUES (?, ?, ?)`;
  const [response] = await pool.query(sql, [offre_id, candidat_id, lettre_motivation]);
  return response;
};

export const getCandidaturesByCandidat = async (candidat_id) => {
  const sql = `
    SELECT c.*, o.titre, o.type_contrat, o.ville, o.recruteur_id,
      u.nom as nom_recruteur, u.prenom as prenom_recruteur, u.avatar_url as avatar_recruteur,
      e.nom_entreprise, e.logo_url
    FROM candidatures c
    JOIN offres o ON c.offre_id = o.id
    JOIN users u ON o.recruteur_id = u.id
    LEFT JOIN entreprises e ON o.recruteur_id = e.user_id
    WHERE c.candidat_id = ?
    ORDER BY c.created_at DESC
  `;
  const [rows] = await pool.query(sql, [candidat_id]);
  return rows;
};

export const getCandidaturesByOffre = async (offre_id, recruteur_id) => {
  const sql = `
    SELECT c.*, u.nom, u.prenom, u.email, u.avatar_url,
      p.titre as titre_candidat, p.cv_url, p.competences
    FROM candidatures c
    JOIN users u ON c.candidat_id = u.id
    JOIN offres o ON c.offre_id = o.id
    LEFT JOIN profils_candidat p ON u.id = p.user_id
    WHERE c.offre_id = ? AND o.recruteur_id = ?
    ORDER BY c.created_at DESC
  `;
  const [rows] = await pool.query(sql, [offre_id, recruteur_id]);
  return rows;
};

export const deleteCandidature = async (id, candidat_id) => {
  const sql = `DELETE FROM candidatures WHERE id = ? AND candidat_id = ?`;
  const [response] = await pool.query(sql, [id, candidat_id]);
  return response;
};

export const updateStatutCandidature = async (id, statut, recruteur_id) => {
  const sql = `
    UPDATE candidatures c
    JOIN offres o ON c.offre_id = o.id
    SET c.statut = ?
    WHERE c.id = ? AND o.recruteur_id = ?
  `;
  const [response] = await pool.query(sql, [statut, id, recruteur_id]);
  return response;
};

export const candidatureExists = async (offre_id, candidat_id) => {
  const sql = `SELECT id FROM candidatures WHERE offre_id = ? AND candidat_id = ?`;
  const [rows] = await pool.query(sql, [offre_id, candidat_id]);
  return rows;
};
