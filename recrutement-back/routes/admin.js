import { Router } from "express";
import { stats, publicStats, listUsers, changeRole, removeUser, listOffres, removeOffre } from "../controllers/adminController.js";
import { auth, isRole } from "../middleware/auth.js";

const router = Router();

router.get("/public-stats", publicStats);

router.use(auth, isRole("admin"));

router.get("/stats", stats);
router.get("/users", listUsers);
router.patch("/users/:id/role", changeRole);
router.delete("/users/:id", removeUser);
router.get("/offres", listOffres);
router.delete("/offres/:id", removeOffre);

export default router;
