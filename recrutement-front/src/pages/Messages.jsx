import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaPaperPlane, FaUser } from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import api from "../api/api";
import "../css/Messages.css";

export default function Messages() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(location.state?.contact || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const selectedUserRef = useRef(selectedUser);

  useEffect(() => { selectedUserRef.current = selectedUser; }, [selectedUser]);

  const fetchConversations = useCallback(() => {
    api.get("/messages/conversations").then(r => setConversations(r.data)).catch(() => {});
  }, []);

  const fetchMessages = useCallback((userId) => {
    api.get(`/messages/${userId}`).then(r => setMessages(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(() => {
      fetchConversations();
      if (selectedUserRef.current) fetchMessages(selectedUserRef.current.id);
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchConversations, fetchMessages]);

  useEffect(() => {
    if (!selectedUser) return;
    fetchMessages(selectedUser.id);
  }, [selectedUser, fetchMessages]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;
    setSending(true);
    try {
      await api.post("/messages", { destinataire_id: selectedUser.id, contenu: text });
      setMessages(ms => [...ms, { expediteur_id: user.id, contenu: text, created_at: new Date().toISOString() }]);
      setText("");
      setConversations(cs => {
        const exists = cs.find(c => c.id === selectedUser.id);
        if (!exists) return [{ ...selectedUser, dernier_message: text, created_at: new Date().toISOString(), non_lus: 0 }, ...cs];
        return cs.map(c => c.id === selectedUser.id ? { ...c, dernier_message: text } : c);
      });
    } catch {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const totalUnread = conversations.reduce((sum, c) => sum + (Number(c.non_lus) || 0), 0);

  return (
    <div className="page messages-page">
      <h1 style={{ marginBottom: "1.5rem" }}>
        Messages
        {totalUnread > 0 && <span className="unread-total-badge">{totalUnread}</span>}
      </h1>
      <div className="messages__layout">
        <div className="conversations__list">
          {conversations.length === 0 ? (
            <div className="empty" style={{ padding: "2rem 1rem" }}>Aucune conversation</div>
          ) : conversations.map(c => (
            <div key={c.id} className={`conv-item ${selectedUser?.id === c.id ? "active" : ""}`} onClick={() => setSelectedUser(c)}>
              <div className="conv-item__avatar">
                {c.avatar_url ? <img src={`${import.meta.env.VITE_API_URL}${c.avatar_url}`} alt="" /> : <FaUser />}
              </div>
              <div className="conv-item__info">
                <h4>{c.prenom} {c.nom}</h4>
                <p>{c.dernier_message?.slice(0, 40)}{c.dernier_message?.length > 40 ? "..." : ""}</p>
              </div>
              {c.non_lus > 0 && <span className="conv-item__badge">{c.non_lus}</span>}
            </div>
          ))}
        </div>

        <div className="chat__panel">
          {!selectedUser ? (
            <div className="empty" style={{ flex: 1 }}>Sélectionnez une conversation</div>
          ) : (
            <>
              <div className="chat__header">
                <div className="conv-item__avatar" style={{ width: 36, height: 36, fontSize: "0.9rem" }}>
                  {selectedUser.avatar_url ? <img src={`${import.meta.env.VITE_API_URL}${selectedUser.avatar_url}`} alt="" /> : <FaUser />}
                </div>
                <h3>{selectedUser.prenom} {selectedUser.nom}</h3>
              </div>

              <div className="chat__messages">
                {messages.map((m, i) => {
                  const isMine = m.expediteur_id === user.id;
                  return (
                    <motion.div key={i} className={`msg ${isMine ? "msg--mine" : "msg--theirs"}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="msg__bubble">{m.contenu}</div>
                      <span className="msg__time">{new Date(m.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                    </motion.div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <form className="chat__input" onSubmit={sendMsg}>
                <input value={text} onChange={e => setText(e.target.value)} placeholder="Écrivez un message..." />
                <button type="submit" className="btn btn-primary btn-sm" disabled={sending || !text.trim()}>
                  <FaPaperPlane />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
