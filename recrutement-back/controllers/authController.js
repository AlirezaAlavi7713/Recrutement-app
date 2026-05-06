import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, findUserById, createUser } from "../models/User.js";
import { upsertProfil, upsertEntreprise } from "../models/Profil.js";

export const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body;

    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    if (!["candidat", "recruteur"].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide" });
    }

    const existing = await findUserByEmail(email);
    if (existing.length) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await createUser(nom, prenom, email, hash, role);
    const userId = result.insertId;

    if (role === "candidat") {
      await upsertProfil(userId, "", "", "", "", "", "immediat");
    }

    if (role === "recruteur") {
      await upsertEntreprise(userId, "", "", "", "", "");
    }

    const token = jwt.sign(
      { id: userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({ token, user: { id: userId, nom, prenom, email, role } });
  } catch (err) {
    console.error("[register]", err.message, err.stack);
    res.status(500).json({ message: "Erreur serveur", detail: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const rows = await findUserByEmail(email);

    if (!rows.length) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, avatar_url: user.avatar_url },
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const me = async (req, res) => {
  try {
    const rows = await findUserById(req.user.id);
    if (!rows.length) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
