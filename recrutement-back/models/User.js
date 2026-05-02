import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  const [rows] = await pool.query(sql, [email]);
  return rows;
};

export const findUserById = async (id) => {
  const sql = `SELECT id, nom, prenom, email, role, avatar_url, created_at FROM users WHERE id = ?`;
  const [rows] = await pool.query(sql, [id]);
  return rows;
};

export const createUser = async (nom, prenom, email, password, role = "candidat") => {
  const sql = `INSERT INTO users (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)`;
  const [response] = await pool.query(sql, [nom, prenom, email, password, role]);
  return response;
};

export const updateUserAvatar = async (id, avatar_url) => {
  const sql = `UPDATE users SET avatar_url = ? WHERE id = ?`;
  const [response] = await pool.query(sql, [avatar_url, id]);
  return response;
};
