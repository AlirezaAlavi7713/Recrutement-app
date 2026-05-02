import pool from "../config/db.js";

export const getStats = async () => {
  const [[users]] = await pool.query(`SELECT COUNT(*) as total FROM users`);
  const [[candidats]] = await pool.query(`SELECT COUNT(*) as total FROM users WHERE role = 'candidat'`);
  const [[recruteurs]] = await pool.query(`SELECT COUNT(*) as total FROM users WHERE role = 'recruteur'`);
  const [[offres]] = await pool.query(`SELECT COUNT(*) as total FROM offres`);
  const [[candidatures]] = await pool.query(`SELECT COUNT(*) as total FROM candidatures`);
  return {
    totalUsers: users.total,
    totalCandidats: candidats.total,
    totalRecruteurs: recruteurs.total,
    totalOffres: offres.total,
    totalCandidatures: candidatures.total,
  };
};

export const getPublicStats = async () => {
  const [[offres]] = await pool.query(`SELECT COUNT(*) as total FROM offres WHERE statut = 'active'`);
  const [[candidats]] = await pool.query(`SELECT COUNT(*) as total FROM users WHERE role = 'candidat'`);
  const [[recruteurs]] = await pool.query(`SELECT COUNT(*) as total FROM users WHERE role = 'recruteur'`);
  const [[candidatures]] = await pool.query(`SELECT COUNT(*) as total FROM candidatures`);
  return {
    offres: offres.total,
    candidats: candidats.total,
    recruteurs: recruteurs.total,
    candidatures: candidatures.total,
  };
};

export const getAllUsers = async () => {
  const sql = `SELECT id, nom, prenom, email, role, created_at FROM users ORDER BY created_at DESC`;
  const [rows] = await pool.query(sql);
  return rows;
};

export const updateUserRole = async (id, role) => {
  const sql = `UPDATE users SET role = ? WHERE id = ?`;
  const [response] = await pool.query(sql, [role, id]);
  return response;
};

export const deleteUser = async (id) => {
  const sql = `DELETE FROM users WHERE id = ?`;
  const [response] = await pool.query(sql, [id]);
  return response;
};

export const getAllOffresAdmin = async () => {
  const sql = `
    SELECT o.*, u.nom, u.prenom, e.nom_entreprise,
      (SELECT COUNT(*) FROM candidatures c WHERE c.offre_id = o.id) as nb_candidatures
    FROM offres o
    JOIN users u ON o.recruteur_id = u.id
    LEFT JOIN entreprises e ON o.recruteur_id = e.user_id
    ORDER BY o.created_at DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

export const deleteOffreAdmin = async (id) => {
  const sql = `DELETE FROM offres WHERE id = ?`;
  const [response] = await pool.query(sql, [id]);
  return response;
};
