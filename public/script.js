// ===== AFFICHER/MASQUER CHAMPS SELON TYPE =====
const typeSelect = document.getElementById("type");
const etudiantFields = document.getElementById("etudiantFields");
const eleveFields = document.getElementById("eleveFields");
const ancienFields = document.getElementById("ancienFields");

typeSelect.addEventListener("change", () => {
  etudiantFields.classList.add("hidden");
  eleveFields.classList.add("hidden");
  ancienFields.classList.add("hidden");

  if (typeSelect.value === "etudiant") etudiantFields.classList.remove("hidden");
  if (typeSelect.value === "eleve") eleveFields.classList.remove("hidden");
  if (typeSelect.value === "ancien") ancienFields.classList.remove("hidden");
});

// ===== MESSAGE DE SUCCESS / ERREUR AVEC FERMETURE =====
const form = document.getElementById("registrationForm");
const messageBox = document.getElementById("successMessage");
const closeBtn = document.getElementById("closeMsg");
const msgText = document.getElementById("msgText");

closeBtn.addEventListener("click", () => {
  messageBox.style.display = "none";
});

function showMessage(msg, success = true) {
  msgText.textContent = msg;
  messageBox.style.display = "block";
  messageBox.style.background = success ? "#d4edda" : "#f8d7da"; // vert ou rouge
  messageBox.style.color = success ? "#155724" : "#721c24";
}

// ===== SOUMISSION FORMULAIRE =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nom: document.getElementById("nom").value.trim(),
    prenom: document.getElementById("prenom").value.trim(),
    telephone: document.getElementById("telephone").value.trim(),
    adresse: document.getElementById("adresse").value.trim(),
    email: document.getElementById("email").value.trim(),
    type: typeSelect.value,
    commission: document.getElementById("commission").value,
    etudiant: {
      univ: document.getElementById("etu_univ").value.trim(),
      ufr: document.getElementById("etu_ufr").value.trim(),
      niveau: document.getElementById("etu_niveau").value,
      filiere: document.getElementById("etu_filiere").value.trim(),
      logement: document.getElementById("etu_logement").value.trim()
    },
    eleve: {
      etab: document.getElementById("el_etab").value.trim(),
      niveau: document.getElementById("el_niveau").value.trim()
    },
    ancien: {
      univ: document.getElementById("an_univ").value.trim(),
      ufr: document.getElementById("an_ufr").value.trim(),
      prom: document.getElementById("an_prom").value.trim(),
      fill: document.getElementById("an_fill").value.trim(),
      prof: document.getElementById("an_prof").value.trim()
    }
  };

  try {
    const res = await fetch("/api/inscrits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    let result = { message: "Une erreur est survenue" };
    try {
      result = await res.json(); // parse JSON si possible
    } catch (err) {
      console.warn("Réponse JSON invalide", err);
    }

    if (res.ok) {
      showMessage(result.message || "✅ Inscription réussie !", true);
      form.reset();
      etudiantFields.classList.add("hidden");
      eleveFields.classList.add("hidden");
      ancienFields.classList.add("hidden");
    } else if (res.status === 400) {
      // doublon détecté
      showMessage(result.message || "⚠️ Cette personne est déjà inscrite !", false);
    } else {
      showMessage(result.message || "Une erreur est survenue, veuillez réessayer.", false);
    }
  } catch (err) {
    console.error(err);
    showMessage("Erreur réseau. Vérifiez votre connexion.", false);
  }
});

// ===== CONNEXION ADMIN =====
const adminForm = document.getElementById("adminLoginForm");
if (adminForm) {
  adminForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("adminUser").value.trim();
    const pass = document.getElementById("adminPass").value.trim();
    if (user === "secretariat" && pass === "di@llo08") {
      window.location.href = "/admin.html";
    } else {
      showMessage("Utilisateur ou mot de passe incorrect !", false);
    }
  });
}
