import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { FaBriefcase, FaUser, FaSignOutAlt, FaEnvelope } from "react-icons/fa";
import "../css/NavBar.css";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate("/"); };
  const active = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        <FaBriefcase /> <span>RecrutPro</span>
      </Link>

      <div className="navbar__links">
        <Link to="/offres" className={active("/offres")}>Offres</Link>
        {user?.role === "recruteur" && <Link to="/dashboard/recruteur" className={active("/dashboard/recruteur")}>Dashboard</Link>}
        {user?.role === "candidat" && <Link to="/dashboard/candidat" className={active("/dashboard/candidat")}>Mes candidatures</Link>}
        {user?.role === "admin" && <Link to="/dashboard/admin" className={active("/dashboard/admin")}>Admin</Link>}
        {user && <Link to="/messages" className={active("/messages")}><FaEnvelope /></Link>}
      </div>

      <div className="navbar__actions">
        {user ? (
          <>
<Link to="/profil" className="navbar__avatar">
              {user.avatar_url
                ? <img src={`${import.meta.env.VITE_API_URL}${user.avatar_url}`} alt="avatar" />
                : <FaUser />}
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm"><FaSignOutAlt /></button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">Connexion</Link>
            <Link to="/register" className="btn btn-primary btn-sm">S'inscrire</Link>
          </>
        )}
      </div>
    </nav>
  );
}
