import { Router } from "express";
import { getProfil, updateProfil, uploadCV, uploadAvatar, getEntreprise, updateEntreprise } from "../controllers/profilController.js";
import { auth, isRole } from "../middleware/auth.js";
import { uploadCV as uploadCVMiddleware, uploadAvatar as uploadAvatarMiddleware, uploadLogo } from "../middleware/upload.js";

const router = Router();

router.get("/candidat", auth, isRole("candidat"), getProfil);
router.put("/candidat", auth, isRole("candidat"), updateProfil);
router.post("/candidat/cv", auth, isRole("candidat"), uploadCVMiddleware.single("cv"), uploadCV);
router.post("/avatar", auth, uploadAvatarMiddleware.single("avatar"), uploadAvatar);
router.get("/entreprise", auth, isRole("recruteur"), getEntreprise);
router.put("/entreprise", auth, isRole("recruteur"), updateEntreprise);

export default router;
