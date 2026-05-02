import { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import api from "../api/api";
import OffreCard from "../components/OffreCard";
import { SkeletonList } from "../components/Skeleton";
import "../css/Offres.css";

const CONTRATS = ["", "CDI", "CDD", "Stage", "Alternance", "Freelance"];
const DOMAINES = ["", "Informatique", "Marketing", "Finance", "RH", "Commerce", "Santé", "Design", "Autre"];

export default function Offres() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", type_contrat: "", domaine: "", ville: "" });

  const fetchOffres = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.type_contrat) params.type_contrat = currentFilters.type_contrat;
      if (currentFilters.domaine) params.domaine = currentFilters.domaine;
      if (currentFilters.ville) params.ville = currentFilters.ville;
      const res = await api.get("/offres", { params });
      setOffres(res.data);
    } catch { setOffres([]); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    api.get("/offres")
      .then((res) => setOffres(res.data))
      .catch(() => setOffres([]))
      .finally(() => setLoading(false));
  }, []);

  const set = (k) => (e) => setFilters(f => ({ ...f, [k]: e.target.value }));
  const handleSearch = (e) => { e.preventDefault(); fetchOffres(); };

  return (
    <div className="page">
      <div className="offres__header">
        <h1>Offres d'emploi</h1>
        <p className="offres__count">{offres.length} offre{offres.length !== 1 ? "s" : ""} disponible{offres.length !== 1 ? "s" : ""}</p>
      </div>

      <form className="offres__filters" onSubmit={handleSearch}>
        <div className="filter-search">
          <FaSearch className="filter-icon" />
          <input value={filters.search} onChange={set("search")} placeholder="Rechercher un poste, compétence..." />
        </div>
        <select value={filters.type_contrat} onChange={set("type_contrat")}>
          {CONTRATS.map(c => <option key={c} value={c}>{c || "Tous les contrats"}</option>)}
        </select>
        <select value={filters.domaine} onChange={set("domaine")}>
          {DOMAINES.map(d => <option key={d} value={d}>{d || "Tous les domaines"}</option>)}
        </select>
        <input value={filters.ville} onChange={set("ville")} placeholder="Ville..." />
        <button type="submit" className="btn btn-primary"><FaFilter /> Filtrer</button>
      </form>

      {loading ? (
        <SkeletonList count={6} />
      ) : offres.length === 0 ? (
        <div className="empty">Aucune offre ne correspond à votre recherche.</div>
      ) : (
        <div className="offres__grid">
          {offres.map((o, i) => <OffreCard key={o.id} offre={o} index={i} />)}
        </div>
      )}
    </div>
  );
}
