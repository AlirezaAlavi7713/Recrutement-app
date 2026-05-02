import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, danger = true }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onCancel}>
          <motion.div
            className="modal"
            style={{ maxWidth: 420 }}
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "0.5rem 0 1rem" }}>
              <div style={{ fontSize: "2.5rem", color: danger ? "#ef4444" : "var(--accent)" }}>
                <FaExclamationTriangle />
              </div>
              <h2 style={{ fontSize: "1.2rem", textAlign: "center" }}>{title}</h2>
              {message && <p style={{ color: "var(--text-muted)", textAlign: "center", fontSize: "0.9rem" }}>{message}</p>}
            </div>
            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center" }}>
              <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
              <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>Confirmer</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
