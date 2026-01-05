const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Pour que toutes les origines puissent accéder à l'API
app.use(express.static("public")); // index.html, admin.html, JS, CSS
app.use(bodyParser.json());

const DATA_FILE = "data.json";

// Lire les inscrits
function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Écrire les inscrits
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- Routes API ---

// Récupérer tous les inscrits
app.get("/api/inscrits", (req, res) => {
  res.json(readData());
});

// Ajouter un inscrit
app.post("/api/inscrits", (req, res) => {
  const newInscrit = req.body;
  const data = readData();

  // Vérifier doublon par email ou téléphone
  const doublon = data.find(
    i => i.email === newInscrit.email || i.telephone === newInscrit.telephone
  );
  if (doublon) return res.status(400).json({ message: "Inscription déjà existante !" });

  data.push(newInscrit);
  writeData(data);
  res.json({ message: "Inscrit ajouté avec succès !" });
});

// Supprimer un inscrit
app.delete("/api/inscrits/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const data = readData();
  if (index >= 0 && index < data.length) {
    data.splice(index, 1);
    writeData(data);
    res.json({ message: "Inscrit supprimé !" });
  } else res.status(404).json({ message: "Index non trouvé" });
});

// Lancer le serveur
app.listen(PORT, "0.0.0.0", () => console.log(`Serveur lancé sur le port ${PORT}`));
