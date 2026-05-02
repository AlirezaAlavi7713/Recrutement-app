import { Router } from "express";
import { postuler, mesCandidatures, candidaturesOffre, updateStatut, retirerCandidature } from "../controllers/candidaturesController.js";
import { auth, isRole } from "../middleware/auth.js";

const router = Router();

router.post("/", auth, isRole("candidat"), postuler);
router.get("/mes-candidatures", auth, isRole("candidat"), mesCandidatures);
router.get("/offre/:id", auth, isRole("recruteur"), candidaturesOffre);
router.patch("/:id/statut", auth, isRole("recruteur"), updateStatut);
router.delete("/:id", auth, isRole("candidat"), retirerCandidature);

export default router;

