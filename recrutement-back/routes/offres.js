import { Router } from "express";
import { body } from "express-validator";
import { getOffres, getOffre, getMesOffres, postOffre, putOffre, removeOffre } from "../controllers/offresController.js";
import { auth, isRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const CONTRATS = ["CDI", "CDD", "Stage", "Alternance", "Freelance"];
const DOMAINES = ["Informatique", "Marketing", "Finance", "RH", "Commerce", "Santé", "Design", "Autre"];

const offreRules = [
  body("titre").trim().notEmpty().withMessage("Le titre est requis"),
  body("description").trim().isLength({ min: 30 }).withMessage("La description doit contenir au moins 30 caractères"),
  body("type_contrat").isIn(CONTRATS).withMessage("Type de contrat invalide"),
  body("domaine").isIn(DOMAINES).withMessage("Domaine invalide"),
];

const router = Router();

router.get("/", getOffres);
router.get("/mes-offres", auth, isRole("recruteur"), getMesOffres);
router.get("/:id", getOffre);
router.post("/", auth, isRole("recruteur"), offreRules, validate, postOffre);
router.put("/:id", auth, isRole("recruteur"), offreRules, validate, putOffre);
router.delete("/:id", auth, isRole("recruteur", "admin"), removeOffre);

export default router;
