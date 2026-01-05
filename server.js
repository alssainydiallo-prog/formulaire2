// server.js
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // Railway fournit le PORT automatiquement

// ===== Middleware =====
app.use(express.static(path.join(__dirname, "public"))); // sert index.html, admin.html et tous les fichiers public
app.use(bodyParser.json());

// ===== Gestion des données =====
const DATA_FILE = "data.json";

// Lire les inscrits
function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

// Écrire les inscrits
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ===== Routes API =====
// GET /api/inscrits → récupérer tous les inscrits
app.get("/api/inscrits", (req, res) => {
  res.json(readData());
});

// POST /api/inscrits → ajouter un inscrit avec vérification doublon
app.post("/api/inscrits", (req, res) => {
  const newInscrit = req.body;
  const data = readData();

  // Vérifier doublon (email ou téléphone)
  const doublon = data.find(
    i => i.email === newInscrit.email || i.telephone === newInscrit.telephone
  );

  if (doublon) {
    return res.status(400).json({ message: "Inscription déjà existante (email ou téléphone) !" });
  }

  data.push(newInscrit);
  writeData(data);
  res.status(200).json({ message: "Inscrit ajouté avec succès !" });
});

// DELETE /api/inscrits/:index → supprimer un inscrit
app.delete("/api/inscrits/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const data = readData();

  if (index >= 0 && index < data.length) {
    data.splice(index, 1);
    writeData(data);
    res.status(200).json({ message: "Inscrit supprimé !" });
  } else {
    res.status(404).json({ message: "Index non trouvé" });
  }
});

// ===== CORS (pour accès depuis n'importe quelle origine) =====
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // autorise toutes les origines
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ===== Lancement du serveur =====
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
