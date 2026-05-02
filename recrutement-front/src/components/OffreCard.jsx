import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

export default function OffreCard({ offre: o, index = 0 }) {
  return (
    <motion.div
      className="offre-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="offre-card__top">
        <div className="offre-card__logo">
          {o.logo_url
            ? <img src={`${import.meta.env.VITE_API_URL}${o.logo_url}`} alt={o.nom_entreprise} />
            : <FaBriefcase />}
        </div>
        <div>
          <h3 className="offre-card__title">{o.titre}</h3>
          <p className="offre-card__company">{o.nom_entreprise || `${o.prenom} ${o.nom}`}</p>
        </div>
      </div>
      <div className="offre-card__tags">
        <span className="badge badge-accent">{o.type_contrat}</span>
        {o.domaine && <span className="badge badge-cyan">{o.domaine}</span>}
        {o.ville && <span className="badge badge-muted"><FaMapMarkerAlt /> {o.ville}</span>}
      </div>
      {o.salaire && <p className="offre-card__salary">{o.salaire}</p>}
      <p className="offre-card__desc">{o.description?.slice(0, 120)}...</p>
      <Link to={`/offres/${o.id}`} className="btn btn-primary offre-card__btn">Voir l'offre</Link>
    </motion.div>
  );
}
