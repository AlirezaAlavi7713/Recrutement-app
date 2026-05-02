import pool from "../config/db.js";

export const createMessage = async (expediteur_id, destinataire_id, contenu, candidature_id = null) => {
  const sql = `
    INSERT INTO messages (expediteur_id, destinataire_id, candidature_id, contenu)
    VALUES (?, ?, ?, ?)
  `;
  const [response] = await pool.query(sql, [expediteur_id, destinataire_id, candidature_id, contenu]);
  return response;
};

export const getConversation = async (userId1, userId2) => {
  const sql = `
    SELECT m.*, u.nom, u.prenom, u.avatar_url
    FROM messages m
    JOIN users u ON m.expediteur_id = u.id
    WHERE (m.expediteur_id = ? AND m.destinataire_id = ?)
       OR (m.expediteur_id = ? AND m.destinataire_id = ?)
    ORDER BY m.created_at ASC
  `;
  const [rows] = await pool.query(sql, [userId1, userId2, userId2, userId1]);
  return rows;
};

export const getConversations = async (userId) => {
  const sql = `
    SELECT DISTINCT
      u.id, u.nom, u.prenom, u.avatar_url, u.role,
      (SELECT contenu FROM messages
       WHERE (expediteur_id = u.id AND destinataire_id = ?) OR (expediteur_id = ? AND destinataire_id = u.id)
       ORDER BY created_at DESC LIMIT 1) as dernier_message,
      (SELECT created_at FROM messages
       WHERE (expediteur_id = u.id AND destinataire_id = ?) OR (expediteur_id = ? AND destinataire_id = u.id)
       ORDER BY created_at DESC LIMIT 1) as date_dernier,
      (SELECT COUNT(*) FROM messages
       WHERE expediteur_id = u.id AND destinataire_id = ? AND lu = FALSE) as non_lus
    FROM messages m
    JOIN users u ON (m.expediteur_id = u.id OR m.destinataire_id = u.id)
    WHERE (m.expediteur_id = ? OR m.destinataire_id = ?) AND u.id != ?
    ORDER BY date_dernier DESC
  `;
  const [rows] = await pool.query(sql, [userId, userId, userId, userId, userId, userId, userId, userId]);
  return rows;
};

export const markMessagesRead = async (expediteur_id, destinataire_id) => {
  const sql = `UPDATE messages SET lu = TRUE WHERE expediteur_id = ? AND destinataire_id = ?`;
  const [response] = await pool.query(sql, [expediteur_id, destinataire_id]);
  return response;
};

export const getUnreadCount = async (userId) => {
  const sql = `SELECT COUNT(*) as count FROM messages WHERE destinataire_id = ? AND lu = FALSE`;
  const [rows] = await pool.query(sql, [userId]);
  return rows;
};
