import app from "./app.js";

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`✅ Serveur recrutement sur http://localhost:${PORT}`));
