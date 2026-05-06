import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBriefcase, FaUserTie, FaRocket, FaSearch,
  FaCheckCircle,
  FaArrowRight, FaStar
} from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import api from "../api/api";
import "../css/Home.css";

const STEPS = [
  { num: "01", title: "Créez votre profil", desc: "Inscrivez-vous en 2 minutes, ajoutez votre CV et vos compétences.", icon: <FaUserTie /> },
  { num: "02", title: "Explorez les offres", desc: "Filtrez par ville, contrat ou domaine et trouvez le poste idéal.", icon: <FaSearch /> },
  { num: "03", title: "Postulez facilement", desc: "Envoyez votre candidature avec une lettre de motivation en un clic.", icon: <FaRocket /> },
  { num: "04", title: "Décrochez le poste", desc: "Échangez directement avec le recruteur et suivez vos candidatures.", icon: <FaCheckCircle /> },
];

const TESTIMONIALS = [
  { name: "Sofia M.", role: "Développeuse React — alternance trouvée en 3 semaines", text: "J'ai trouvé mon alternance en un temps record grâce à RecrutPro. L'interface est simple et les offres sont de qualité.", stars: 5 },
  { name: "Thomas R.", role: "RH chez TechCorp", text: "Nous avons reçu 40 candidatures qualifiées en 48h après avoir publié notre offre. Un outil indispensable.", stars: 5 },
  { name: "Amina K.", role: "Étudiante en marketing digital", text: "Le système de messagerie intégré m'a permis d'échanger directement avec les recruteurs. Très pratique !", stars: 5 },
];

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ offres: "...", candidats: "...", recruteurs: "...", candidatures: "..." });

  useEffect(() => {
    api.get("/admin/public-stats").then(r => setStats(r.data)).catch(() => {});
  }, []);

  const STATS = [
    { value: stats.offres === "..." ? "..." : `${Number(stats.offres).toLocaleString("fr-FR")}+`, label: "Offres disponibles" },
    { value: stats.candidats === "..." ? "..." : `${Number(stats.candidats).toLocaleString("fr-FR")}+`, label: "Candidats inscrits" },
    { value: stats.recruteurs === "..." ? "..." : `${Number(stats.recruteurs).toLocaleString("fr-FR")}+`, label: "Entreprises partenaires" },
    { value: stats.candidatures === "..." ? "..." : `${Number(stats.candidatures).toLocaleString("fr-FR")}+`, label: "Candidatures déposées" },
  ];

  return (
    <main className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__content">
          <motion.div className="hero__text"
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="hero__tag">Plateforme n°1 de recrutement</span>
            <h1>Trouvez votre <span className="accent">alternance</span><br />ou votre prochain <span className="accent">talent</span></h1>
            <p className="hero__sub">Des milliers d'offres d'emploi, de stages et d'alternances. Connectez candidats et recruteurs simplement et efficacement.</p>
            <div className="hero__btns">
              <Link to="/offres" className="btn btn-primary btn-lg"><FaSearch /> Voir les offres</Link>
              {!user && <Link to="/register" className="btn btn-outline btn-lg">Créer un compte <FaArrowRight /></Link>}
              {user?.role === "candidat" && <Link to="/dashboard/candidat" className="btn btn-outline btn-lg">Mes candidatures</Link>}
              {user?.role === "recruteur" && <Link to="/dashboard/recruteur" className="btn btn-outline btn-lg">Mon dashboard</Link>}
            </div>
            <div className="hero__trust">
              <div className="hero__trust-item"><FaCheckCircle /> <span>Gratuit</span></div>
              <div className="hero__trust-item"><FaCheckCircle /> <span>Sans engagement</span></div>
              <div className="hero__trust-item"><FaCheckCircle /> <span>Réponse rapide</span></div>
            </div>
          </motion.div>

          <motion.div className="hero__image-wrap"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"
              alt="Équipe en réunion"
              className="hero__img"
            />
            <motion.div className="hero__badge hero__badge--top"
              animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <FaCheckCircle className="badge-icon green" />
              <div><strong>Candidature acceptée</strong><span>il y a 2 min</span></div>
            </motion.div>
            <motion.div className="hero__badge hero__badge--bottom"
              animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
              <FaBriefcase className="badge-icon purple" />
              <div><strong>12 nouvelles offres</strong><span>aujourd'hui</span></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="home__stats">
        {STATS.map((s, i) => (
          <motion.div key={s.label} className="stat-item"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </motion.div>
        ))}
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="home__steps">
        <div className="section-header">
          <h2>Comment ça marche ?</h2>
          <p>Trouvez votre alternance ou votre candidat idéal en 4 étapes simples.</p>
        </div>
        <div className="steps__grid">
          {STEPS.map((s, i) => (
            <motion.div key={s.num} className="step-card"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }} viewport={{ once: true }}>
              <div className="step-num">{s.num}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── POUR LES RECRUTEURS (image) ── */}
      <section className="home__employers">
        <motion.div className="employers__image-wrap"
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }} viewport={{ once: true }}>
          <img
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80"
            alt="Recruteur au bureau"
            className="employers__img"
          />
        </motion.div>
        <motion.div className="employers__text"
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }} viewport={{ once: true }}>
          <span className="hero__tag">Pour les recruteurs</span>
          <h2>Trouvez les meilleurs talents rapidement</h2>
          <p>Publiez vos offres gratuitement et accédez à une base de candidats qualifiés. Gérez toutes vos candidatures depuis un dashboard intuitif.</p>
          <ul className="employers__list">
            {[
              "Publication d'offres illimitée et gratuite",
              "Dashboard complet pour gérer les candidatures",
              "Messagerie intégrée avec les candidats",
              "Filtrage par compétences, ville et disponibilité",
            ].map(item => (
              <li key={item}><FaCheckCircle className="list-check" /> {item}</li>
            ))}
          </ul>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-lg" style={{ marginTop: "1.5rem" }}>
              Recruter maintenant <FaArrowRight />
            </Link>
          )}
        </motion.div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="home__testimonials">
        <div className="section-header">
          <h2>Ce qu'ils disent de nous</h2>
          <p>Des milliers de candidats et recruteurs nous font confiance chaque jour.</p>
        </div>
        <div className="testimonials__grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} className="testimonial-card"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }} viewport={{ once: true }}>
              <div className="testimonial-stars">
                {Array(t.stars).fill(0).map((_, j) => <FaStar key={j} />)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.name[0]}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="home__cta">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2>Prêt à commencer ?</h2>
          <p>Rejoignez des milliers de candidats et recruteurs qui font confiance à RecrutPro.</p>
          <div className="hero__btns">
            <Link to="/offres" className="btn btn-primary btn-lg"><FaSearch /> Parcourir les offres</Link>
            {!user && <Link to="/register" className="btn btn-outline btn-lg">S'inscrire gratuitement</Link>}
          </div>
        </motion.div>
      </section>

    </main>
  );
}
