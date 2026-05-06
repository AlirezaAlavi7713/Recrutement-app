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

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const links = (
    <>
      <Link to="/offres" className={active("/offres")} onClick={close}>Offres</Link>
      {user?.role === "recruteur" && <Link to="/dashboard/recruteur" className={active("/dashboard/recruteur")} onClick={close}>Dashboard</Link>}
      {user?.role === "candidat" && <Link to="/dashboard/candidat" className={active("/dashboard/candidat")} onClick={close}>Mes candidatures</Link>}
      {user?.role === "admin" && <Link to="/dashboard/admin" className={active("/dashboard/admin")} onClick={close}>Admin</Link>}
      {user && <Link to="/messages" className={active("/messages")} onClick={close}><FaEnvelope /></Link>}
    </>
  );

  const actions = (
    <>
      {user ? (
        <>
          <Link to="/profil" className="navbar__avatar" onClick={close}>
            {user.avatar_url
              ? <img src={`${import.meta.env.VITE_API_URL}${user.avatar_url}`} alt="avatar" />
              : <FaUser />}
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm"><FaSignOutAlt /></button>
        </>
      ) : (
        <>
          <Link to="/login" className="btn btn-secondary btn-sm" onClick={close}>Connexion</Link>
          <Link to="/register" className="btn btn-primary btn-sm" onClick={close}>S'inscrire</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="navbar" ref={navRef}>
      <Link to="/" className="navbar__brand">
        <FaBriefcase /> <span>RecrutPro</span>
      </Link>

      {/* Desktop */}
      <div className="navbar__links">{links}</div>
      <div className="navbar__actions">{actions}</div>

      {/* Burger */}
      <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span></span><span></span><span></span>
      </button>

      {/* Mobile menu */}
      <div className={`navbar__menu ${menuOpen ? "open" : ""}`}>
        <div className="navbar__links">{links}</div>
        <div className="navbar__actions">{actions}</div>
      </div>
    </nav>
  );
}
