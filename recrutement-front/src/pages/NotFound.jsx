import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaSearch } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={{ fontSize: "6rem", fontWeight: 900, color: "var(--accent)", lineHeight: 1 }}>404</div>
        <h1 style={{ fontSize: "1.8rem", margin: "1rem 0 0.5rem" }}>Page introuvable</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/" className="btn btn-primary"><FaHome /> Accueil</Link>
          <Link to="/offres" className="btn btn-secondary"><FaSearch /> Voir les offres</Link>
        </div>
      </motion.div>
    </div>
  );
}
