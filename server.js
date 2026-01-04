const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(express.static(".")); // Sert index.html et admin.html
app.use(bodyParser.json());   // Permet de lire req.body en JSON

const DATA_FILE = "data.json";

// Lire inscrits
function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Écrire inscrits
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ------------------- ROUTES -------------------

// GET /api/inscrits → récupérer tous les inscrits
app.get("/api/inscrits", (req, res) => {
  res.json(readData());
});

// POST /api/inscrits → ajouter un inscrit en empêchant doublons
app.post("/api/inscrits", (req, res) => {
  const newInscrit = req.body;
  const data = readData();

  // Vérifier doublon (email ou téléphone)
  const doublon = data.find(
    i => i.email === newInscrit.email || i.telephone === newInscrit.telephone
  );

  if (doublon) {
    // Si doublon, renvoyer une erreur JSON
    return res.status(400).json({ message: "Inscription déjà existante (email ou téléphone) !" });
  }

  // Sinon, ajouter
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
  } else res.status(404).json({ message: "Index non trouvé" });
});

// ------------------- CORS (si besoin) -------------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ------------------- LANCEMENT -------------------
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
