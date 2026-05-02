import pool from "../config/db.js";

export const getProfilByUser = async (user_id) => {
  const sql = `SELECT * FROM profils_candidat WHERE user_id = ?`;
  const [rows] = await pool.query(sql, [user_id]);
  return rows;
};

export const upsertProfil = async (user_id, titre, bio, ville, telephone, competences, disponibilite) => {
  const sql = `
    INSERT INTO profils_candidat (user_id, titre, bio, ville, telephone, competences, disponibilite)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      titre = VALUES(titre),
      bio = VALUES(bio),
      ville = VALUES(ville),
      telephone = VALUES(telephone),
      competences = VALUES(competences),
      disponibilite = VALUES(disponibilite)
  `;
  const [response] = await pool.query(sql, [user_id, titre, bio, ville, telephone, competences, disponibilite]);
  return response;
};

export const updateCV = async (user_id, cv_url) => {
  const sql = `UPDATE profils_candidat SET cv_url = ? WHERE user_id = ?`;
  const [response] = await pool.query(sql, [cv_url, user_id]);
  return response;
};

export const getEntrepriseByUser = async (user_id) => {
  const sql = `SELECT * FROM entreprises WHERE user_id = ?`;
  const [rows] = await pool.query(sql, [user_id]);
  return rows;
};

export const upsertEntreprise = async (user_id, nom_entreprise, secteur, description, site_web, ville) => {
  const sql = `
    INSERT INTO entreprises (user_id, nom_entreprise, secteur, description, site_web, ville)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      nom_entreprise = VALUES(nom_entreprise),
      secteur = VALUES(secteur),
      description = VALUES(description),
      site_web = VALUES(site_web),
      ville = VALUES(ville)
  `;
  const [response] = await pool.query(sql, [user_id, nom_entreprise, secteur, description, site_web, ville]);
  return response;
};
