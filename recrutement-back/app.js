import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { fileURLToPath } from "url";
import path from "path";

import authRoutes from "./routes/auth.js";
import offresRoutes from "./routes/offres.js";
import candidaturesRoutes from "./routes/candidatures.js";
import messagesRoutes from "./routes/messages.js";
import profilRoutes from "./routes/profil.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/offres", offresRoutes);
app.use("/api/candidatures", candidaturesRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/profil", profilRoutes);
app.use("/api/admin", adminRoutes);

export default app;
