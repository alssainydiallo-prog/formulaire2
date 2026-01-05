const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS CORRECT
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(bodyParser.json());
app.use(express.static("public"));

const DATA_FILE = "data.json";

function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ===== API =====
app.get("/api/inscrits", (req, res) => {
  res.json(readData());
});

app.post("/api/inscrits", (req, res) => {
  const newInscrit = req.body;
  const data = readData();

  const doublon = data.find(
    i => i.email === newInscrit.email || i.telephone === newInscrit.telephone
  );

  if (doublon) {
    return res.status(400).json({ message: "Inscription déjà existante !" });
  }

  data.push(newInscrit);
  writeData(data);
  res.json({ message: "Inscription réussie !" });
});

app.delete("/api/inscrits/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const data = readData();

  if (index >= 0 && index < data.length) {
    data.splice(index, 1);
    writeData(data);
    res.json({ message: "Supprimé" });
  } else {
    res.status(404).json({ message: "Introuvable" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
