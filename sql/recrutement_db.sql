CREATE DATABASE IF NOT EXISTS recrutement_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE recrutement_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('candidat', 'recruteur', 'admin') DEFAULT 'candidat',
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profils_candidat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  titre VARCHAR(200),
  bio TEXT,
  ville VARCHAR(100),
  telephone VARCHAR(20),
  cv_url VARCHAR(500),
  competences VARCHAR(1000),
  disponibilite ENUM('immediat', '1 mois', '3 mois') DEFAULT 'immediat',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS entreprises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  nom_entreprise VARCHAR(200) NOT NULL,
  secteur VARCHAR(100),
  description TEXT,
  site_web VARCHAR(255),
  logo_url VARCHAR(500),
  ville VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS offres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recruteur_id INT NOT NULL,
  titre VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  ville VARCHAR(100),
  type_contrat ENUM('CDI', 'CDD', 'Alternance', 'Stage', 'Freelance') NOT NULL,
  domaine VARCHAR(100),
  salaire VARCHAR(100),
  competences_requises VARCHAR(1000),
  statut ENUM('active', 'fermee') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recruteur_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS candidatures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offre_id INT NOT NULL,
  candidat_id INT NOT NULL,
  lettre_motivation TEXT,
  statut ENUM('en_attente', 'vue', 'acceptee', 'refusee') DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_candidature (offre_id, candidat_id),
  FOREIGN KEY (offre_id) REFERENCES offres(id) ON DELETE CASCADE,
  FOREIGN KEY (candidat_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expediteur_id INT NOT NULL,
  destinataire_id INT NOT NULL,
  candidature_id INT,
  contenu TEXT NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (expediteur_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (destinataire_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (candidature_id) REFERENCES candidatures(id) ON DELETE SET NULL
);

-- Admin par défaut
INSERT INTO users (nom, prenom, email, password, role) VALUES
('Alavi', 'Alireza', 'alirezaalavi7713@gmail.com', '$2b$10$placeholder', 'admin');
