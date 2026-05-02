import { createMessage, getConversation, getConversations, markMessagesRead, getUnreadCount } from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { destinataire_id, contenu, candidature_id } = req.body;
    if (!destinataire_id || !contenu) return res.status(400).json({ message: "Champs manquants" });
    await createMessage(req.user.id, destinataire_id, contenu, candidature_id);
    res.status(201).json({ message: "Message envoyé" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const getConversationCtrl = async (req, res) => {
  try {
    await markMessagesRead(req.params.userId, req.user.id);
    const rows = await getConversation(req.user.id, req.params.userId);
    res.json(rows);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const getConversationsCtrl = async (req, res) => {
  try {
    const rows = await getConversations(req.user.id);
    res.json(rows);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const getUnread = async (req, res) => {
  try {
    const rows = await getUnreadCount(req.user.id);
    res.json({ count: rows[0].count });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
