import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/useAuth";
import { FaBriefcase, FaUser, FaSignOutAlt, FaEnvelope } from "react-icons/fa";
import "../css/NavBar.css";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const handleLogout = () => { logout(); navigate("/"); setMenuOpen(false); };
  const active = (path) => location.pathname === path ? "active" : "";
  const close = () => setMenuOpen(false);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="navbar" ref={navRef}>
      <Link to="/" className="navbar__brand">
        <FaBriefcase /> <span>RecrutPro</span>
      </Link>

      {/* Desktop links */}
      <div className="navbar__desktop">
        <Link to="/offres" className={active("/offres")}>Offres</Link>
        {user?.role === "recruteur" && <Link to="/dashboard/recruteur" className={active("/dashboard/recruteur")}>Dashboard</Link>}
        {user?.role === "candidat" && <Link to="/dashboard/candidat" className={active("/dashboard/candidat")}>Mes candidatures</Link>}
        {user?.role === "admin" && <Link to="/dashboard/admin" className={active("/dashboard/admin")}>Admin</Link>}
        {user && <Link to="/messages" className={active("/messages")}><FaEnvelope /></Link>}
      </div>

      {/* Desktop actions */}
      <div className="navbar__desktop-actions">
        {user ? (
          <>
            <Link to="/profil" className="navbar__avatar">
              {user.avatar_url ? <img src={`${import.meta.env.VITE_API_URL}${user.avatar_url}`} alt="avatar" /> : <FaUser />}
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

      {/* Burger */}
      <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span></span><span></span><span></span>
      </button>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${menuOpen ? "open" : ""}`}>
        <Link to="/offres" className={active("/offres")} onClick={close}>Offres</Link>
        {user?.role === "recruteur" && <Link to="/dashboard/recruteur" className={active("/dashboard/recruteur")} onClick={close}>Dashboard</Link>}
        {user?.role === "candidat" && <Link to="/dashboard/candidat" className={active("/dashboard/candidat")} onClick={close}>Mes candidatures</Link>}
        {user?.role === "admin" && <Link to="/dashboard/admin" className={active("/dashboard/admin")} onClick={close}>Admin</Link>}
        {user && <Link to="/messages" className={active("/messages")} onClick={close}><FaEnvelope /></Link>}
        <div className="navbar__mobile-actions">
          {user ? (
            <>
              <Link to="/profil" className="navbar__avatar" onClick={close}>
                {user.avatar_url ? <img src={`${import.meta.env.VITE_API_URL}${user.avatar_url}`} alt="avatar" /> : <FaUser />}
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm"><FaSignOutAlt /></button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={close}>Connexion</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={close}>S'inscrire</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
