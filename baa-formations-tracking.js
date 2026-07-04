(function() {
  var FORMATIONS = [
    { id: "bonDemarrage", nom: "Bon démarrage", titre: "Bon démarrage" },
    { id: "fondations", nom: "Les fondations de mon activité", titre: "Les fondations de mon activité" },
    { id: "reseauxAttraction", nom: "Réseaux sociaux & attraction", titre: "Réseaux sociaux et attraction" },
    { id: "guideMessages", nom: "Guide des messages & communication", titre: "Guide des messages & communication d'attraction" },
    { id: "developpementPersonnel", nom: "Développement personnel & mental", titre: "Développement personnel & mental de réussit" },
    { id: "alchimieBesoins", nom: "Alchimie des besoins", titre: "Alchimie des besoins : comprendre pour révéler" },
    { id: "parrainage", nom: "Parrainage", titre: "Parrainage" },
    { id: "laVente", nom: "La vente", titre: "La vente" },
    { id: "reseauxSociaux", nom: "Les Réseaux Sociaux pour la VDI", titre: "Formation — Les Réseaux Sociaux pour la VDI" },
    { id: "organisation", nom: "Organisation & Gestion du Temps", titre: "Formation — Organisation & Gestion du Temps" }
  ];

  function getFormationCourante() {
    var titre = document.title.trim().toLowerCase();
    for (var i = 0; i < FORMATIONS.length; i++) {
      if (titre === FORMATIONS[i].titre.toLowerCase()) return FORMATIONS[i];
    }
    return null;
  }

  function ajouterBouton(formation) {
    if (document.getElementById("baa-formation-btn-wrap")) return;

    var wrap = document.createElement("div");
    wrap.id = "baa-formation-btn-wrap";
    wrap.style.cssText = "position:fixed;bottom:90px;left:50%;transform:translateX(-50%);z-index:99998;text-align:center;";

    var btn = document.createElement("button");
    btn.id = "baa-formation-btn";
    btn.style.cssText = "background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:14px 28px;border-radius:25px;cursor:pointer;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;box-shadow:0 4px 16px rgba(201,168,106,0.4);";
    btn.innerText = "✅ J'ai lu cette formation";

    btn.onclick = function() {
      var auth = firebase.auth();
      var db = firebase.firestore();
      var uid = auth.currentUser ? auth.currentUser.uid : null;
      if (!uid) { alert("Tu dois être connectée pour valider ta lecture."); return; }

      var updateData = {};
      updateData["formation_" + formation.id + "_lu"] = true;
      updateData["formation_" + formation.id + "_date"] = new Date().toISOString();

      db.collection("users").doc(uid).update(updateData).then(function() {
        btn.innerText = "🎉 Formation validée !";
        btn.style.background = "linear-gradient(135deg,#27AE60,#2ecc71)";
        btn.style.color = "white";
        btn.disabled = true;
        if (typeof window.ajouterPointsBadge === "function") window.ajouterPointsBadge(10);
        setTimeout(function() { wrap.style.opacity = "0"; wrap.style.transition = "opacity 0.5s"; setTimeout(function() { wrap.remove(); }, 500); }, 2000);
      }).catch(function(e) { console.log("Erreur tracking formation:", e); });
    };

    wrap.appendChild(btn);
    document.body.appendChild(wrap);

    // Vérifier si déjà lu
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) return;
      firebase.firestore().collection("users").doc(user.uid).get().then(function(snap) {
        var d = snap.data() || {};
        if (d["formation_" + formation.id + "_lu"]) {
          btn.innerText = "✅ Déjà lue";
          btn.style.background = "#e8d4b0";
          btn.style.color = "#8a6a35";
          btn.disabled = true;
        }
      });
    });
  }

  // Attendre que la page soit chargée
  function init() {
    // Vérifier le titre courant
    var formation = getFormationCourante();
    if (formation) {
      var check = setInterval(function() {
        if (typeof firebase !== "undefined" && firebase.auth) {
          clearInterval(check);
          ajouterBouton(formation);
        }
      }, 500);
    }

    // Observer les changements de titre (SPA)
    var titleEl = document.querySelector("title");
    if (titleEl) {
      var observer = new MutationObserver(function() {
        var btn = document.getElementById("baa-formation-btn-wrap");
        if (btn) btn.remove();
        var f = getFormationCourante();
        if (f) {
          var check2 = setInterval(function() {
            if (typeof firebase !== "undefined" && firebase.auth) {
              clearInterval(check2);
              ajouterBouton(f);
            }
          }, 500);
        }
      });
      observer.observe(titleEl, { childList: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    setTimeout(init, 1000);
  }
})();
