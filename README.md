# 💼 RecrutPro

Application full-stack de recrutement avec trois espaces distincts : candidat, recruteur et administrateur.

## Fonctionnalités

**Espace candidat**
- Inscription et gestion du profil (CV, photo)
- Consultation et candidature aux offres d'emploi
- Suivi de l'état des candidatures
- Messagerie avec les recruteurs

**Espace recruteur**
- Création et gestion des offres d'emploi
- Consultation des candidatures reçues
- Dashboard kanban de suivi des candidats
- Messagerie avec les candidats

**Espace administrateur**
- Gestion complète des utilisateurs
- Statistiques dynamiques
- Modération des offres et candidatures

## Stack technique

| Côté | Technologies |
|------|-------------|
| Frontend | React, Vite, React Router DOM, Axios |
| Backend | Node.js, Express, MySQL, JWT, bcrypt |
| Sécurité | Helmet, express-rate-limit, express-validator |
| Email | Nodemailer |
| Upload | Multer |
| Tests | node:test, supertest |

## Structure du projet

```
recrutement/
├── recrutement-front/   # Application React
└── recrutement-back/    # API Express
```

## Installation

**Backend**
```bash
cd recrutement-back
npm install
cp .env.example .env    # Remplir les variables
npm run dev             # http://localhost:3002
```

**Frontend**
```bash
cd recrutement-front
npm install
npm run dev             # http://localhost:5173
```

## Variables d'environnement (Back)

```
PORT=3002
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_NAME=recrutement_db
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=http://localhost:5173
```
