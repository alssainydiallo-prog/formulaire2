// ========================
// admin.js
// ========================

// Charger tous les inscrits
async function loadInscrits() {
  const res = await fetch("/api/inscrits");
  const data = await res.json();
  const tbody = document.getElementById("inscritsTable");
  tbody.innerHTML = "";

  // Statistiques
  const statsDiv = document.getElementById("stats");
  const total = data.length;
  const etudiants = data.filter(i => i.type === "etudiant").length;
  const eleves = data.filter(i => i.type === "eleve").length;
  const anciens = data.filter(i => i.type === "ancien").length;
  statsDiv.innerHTML = `Total: ${total} | Étudiants: ${etudiants} | Élèves: ${eleves} | Anciens: ${anciens}`;

  data.forEach((i, idx) => {
    tbody.innerHTML += generateRow(i, idx);
  });
}

// Générer une ligne HTML pour un inscrit
function generateRow(i, idx) {
  let details = "";

  if (i.type === "etudiant") {
    details = `
      Université: ${i.etudiant.univ || '-'}<br>
      UFR: ${i.etudiant.ufr || '-'}<br>
      Niveau: ${i.etudiant.niveau || '-'}<br>
      Filière: ${i.etudiant.filiere || '-'}<br>
      Logement: ${i.etudiant.logement || '-'}<br>
      Adresse: ${i.adresse || '-'}<br>
      Type d'inscription: ${i.type}`;
  } else if (i.type === "eleve") {
    details = `
      Établissement: ${i.eleve.etab || '-'}<br>
      Niveau: ${i.eleve.niveau || '-'}<br>
      Adresse: ${i.adresse || '-'}<br>
      Type d'inscription: ${i.type}`;
  } else if (i.type === "ancien") {
    details = `
      Université: ${i.ancien.univ || '-'}<br>
      UFR: ${i.ancien.ufr || '-'}<br>
      Promotion: ${i.ancien.prom || '-'}<br>
      Filière: ${i.ancien.fill || '-'}<br>
      Profession: ${i.ancien.prof || '-'}<br>
      Adresse: ${i.adresse || '-'}<br>
      Type d'inscription: ${i.type}`;
  }

  return `
    <tr>
      <td>${i.nom}</td>
      <td>${i.prenom}</td>
      <td>${i.telephone}</td>
      <td>${i.email}</td>
      <td>${i.commission}</td>
      <td>${details}</td>
      <td>
        <button onclick="deleteInscrit(${idx})">Supprimer</button>
      </td>
    </tr>`;
}

// Supprimer un inscrit
async function deleteInscrit(index) {
  await fetch(`/api/inscrits/${index}`, { method: "DELETE" });
  loadInscrits();
}

// Recherche en temps réel
document.getElementById("searchInput").addEventListener("input", async (e) => {
  const query = e.target.value.toLowerCase();
  const res = await fetch("/api/inscrits");
  const data = await res.json();

  const filtered = data.filter(i =>
    i.nom.toLowerCase().includes(query) ||
    i.prenom.toLowerCase().includes(query) ||
    i.telephone.toLowerCase().includes(query) ||
    i.email.toLowerCase().includes(query) ||
    i.adresse.toLowerCase().includes(query) ||
    i.commission.toLowerCase().includes(query) ||
    i.type.toLowerCase().includes(query) ||
    (i.etudiant && (
      (i.etudiant.univ && i.etudiant.univ.toLowerCase().includes(query)) ||
      (i.etudiant.ufr && i.etudiant.ufr.toLowerCase().includes(query)) ||
      (i.etudiant.niveau && i.etudiant.niveau.toLowerCase().includes(query)) ||
      (i.etudiant.filiere && i.etudiant.filiere.toLowerCase().includes(query)) ||
      (i.etudiant.logement && i.etudiant.logement.toLowerCase().includes(query))
    )) ||
    (i.eleve && (
      (i.eleve.etab && i.eleve.etab.toLowerCase().includes(query)) ||
      (i.eleve.niveau && i.eleve.niveau.toLowerCase().includes(query))
    )) ||
    (i.ancien && (
      (i.ancien.univ && i.ancien.univ.toLowerCase().includes(query)) ||
      (i.ancien.ufr && i.ancien.ufr.toLowerCase().includes(query)) ||
      (i.ancien.prom && i.ancien.prom.toLowerCase().includes(query)) ||
      (i.ancien.fill && i.ancien.fill.toLowerCase().includes(query)) ||
      (i.ancien.prof && i.ancien.prof.toLowerCase().includes(query))
    ))
  );

  const tbody = document.getElementById("inscritsTable");
  tbody.innerHTML = "";
  filtered.forEach((i, idx) => {
    tbody.innerHTML += generateRow(i, idx);
  });
});

// Déconnexion
document.getElementById("logout").addEventListener("click", () => {
  window.location.href = "/index.html";
});

// Export PDF avec jsPDF
document.getElementById("exportPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  const rows = document.querySelectorAll("#inscritsTable tr");
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const text = Array.from(cells).map(td => td.innerText).join(" | ");
    doc.text(text, 10, y);
    y += 10;
    if (y > 280) { doc.addPage(); y = 10; }
  });

  doc.save("inscrits.pdf");
});

// Initialisation
loadInscrits();

