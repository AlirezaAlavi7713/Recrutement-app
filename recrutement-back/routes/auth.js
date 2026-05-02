import { Router } from "express";
import { body } from "express-validator";
import { rateLimit } from "express-rate-limit";
import { register, login, me } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Trop de tentatives, réessayez dans 15 minutes" },
});

const registerRules = [
  body("nom").trim().notEmpty().withMessage("Le nom est requis"),
  body("prenom").trim().notEmpty().withMessage("Le prénom est requis"),
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("role").isIn(["candidat", "recruteur"]).withMessage("Rôle invalide"),
];

const loginRules = [
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password").notEmpty().withMessage("Le mot de passe est requis"),
];

router.post("/register", registerRules, validate, register);
router.post("/login", loginLimiter, loginRules, validate, login);
router.get("/me", auth, me);

export default router;
