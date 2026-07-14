// BAA Plan Quotidien — Pont Objectif → Plan d'action quotidien
// S'active automatiquement à chaque connexion

(function() {
  function initPlanQuotidien() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(initPlanQuotidien, 300); return; }
    var auth = firebase.auth();
    var db = firebase.firestore();

    auth.onAuthStateChanged(function(user) {
      if (!user) return;

      // Attendre que l'académie soit chargée
      setTimeout(function() { chargerEtAfficherPlan(user.uid, db); }, 5000);
    });
  }

  function chargerEtAfficherPlan(uid, db) {
    db.collection("users").doc(uid).get().then(function(snap) {
      if (!snap.exists) return;
      var d = snap.data();

      // Récupérer l'objectif mensuel
      var objectif = d.suiviObjectif || d.objectifMensuel || 0;
      if (!objectif || objectif <= 0) return; // Pas d'objectif défini

      // Récupérer le CA actuel du mois
      var now = new Date();
      var moisKey = now.getFullYear() + "-" + (now.getMonth() + 1);
      var manuel = (d.tableauBordManuel || {})[moisKey] || {};
      var caActuel = (manuel.ca || 0) + (d.caMoisEnCours || 0);

      // Calculer les jours restants
      var dernierJour = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      var joursRestants = Math.max(1, dernierJour.getDate() - now.getDate() + 1);
      var joursEcoules = now.getDate() - 1;

      // Calculer ce qu'il reste à faire
      var resteCA = Math.max(0, objectif - caActuel);
      var panierMoyen = 35; // panier moyen estimé
      var ventesDuJour = Math.ceil(resteCA / panierMoyen / joursRestants);
      var convsDuJour = ventesDuJour * 5; // ratio 1 vente / 5 conversations
      var postsDuJour = Math.max(1, Math.ceil(convsDuJour / 3));
      var pct = Math.min(100, Math.round(caActuel / objectif * 100));

      // Ne pas afficher si objectif déjà atteint
      if (resteCA <= 0) {
        afficherPlanAtteint(d.prenom || "");
        return;
      }

      afficherPlanDuJour(d.prenom || "", objectif, caActuel, resteCA, joursRestants, ventesDuJour, convsDuJour, postsDuJour, pct);
    }).catch(function(e) { console.log("BAA Plan:", e); });
  }

  function afficherPlanDuJour(prenom, objectif, caActuel, resteCA, joursRestants, ventes, convs, posts, pct) {
    // Ne pas afficher si déjà montré aujourd'hui
    var today = new Date().toDateString();
    if (localStorage.getItem("baa-plan-date") === today) return;

    if (document.getElementById("baa-plan-panel")) return;

    var panel = document.createElement("div");
    panel.id = "baa-plan-panel";
    panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;justify-content:center;align-items:center;padding:20px;font-family:Arial,sans-serif;";
    panel.onclick = function(e) { if (e.target === panel) fermerPlan(); };

    var couleurPct = pct >= 80 ? "#27AE60" : pct >= 50 ? "#c9a86a" : "#e74c3c";

    panel.innerHTML = "<div style='background:#f8f3ee;width:90%;max-width:480px;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);'>" +
      // Header
      "<div style='background:linear-gradient(135deg,#8b735d,#c9a86a);padding:20px;text-align:center;'>" +
      "<p style='color:rgba(255,255,255,0.8);font-size:11px;font-weight:bold;margin:0 0 4px;letter-spacing:2px;'>🎯 TON PLAN DU JOUR</p>" +
      "<h2 style='color:white;font-size:18px;margin:0 0 4px;'>Bonjour "+prenom+" ! 🐦‍🔥</h2>" +
      "<p style='color:rgba(255,255,255,0.8);font-size:13px;margin:0;'>"+joursRestants+" jours restants ce mois</p>" +
      "</div>" +
      "<div style='padding:20px;'>" +
      // Barre de progression
      "<div style='background:white;border-radius:12px;padding:14px;margin-bottom:14px;border:1px solid #e8d4b0;'>" +
      "<div style='display:flex;justify-content:space-between;margin-bottom:8px;'>" +
      "<span style='color:#3a3a3a;font-size:13px;font-weight:bold;'>Objectif : "+objectif+"€</span>" +
      "<span style='color:"+couleurPct+";font-size:13px;font-weight:bold;'>"+pct+"%</span>" +
      "</div>" +
      "<div style='background:#f0e6d3;border-radius:6px;height:10px;margin-bottom:8px;'>" +
      "<div style='background:linear-gradient(135deg,"+couleurPct+",#f5d48a);width:"+pct+"%;height:10px;border-radius:6px;transition:width 1s;'></div>" +
      "</div>" +
      "<div style='display:flex;justify-content:space-between;'>" +
      "<span style='color:#27AE60;font-size:12px;font-weight:bold;'>✅ "+caActuel.toFixed(0)+"€ réalisés</span>" +
      "<span style='color:#e74c3c;font-size:12px;font-weight:bold;'>Reste : "+resteCA.toFixed(0)+"€</span>" +
      "</div>" +
      "</div>" +
      // Actions du jour
      "<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 10px;letter-spacing:1px;'>⚡ POUR ATTEINDRE TON OBJECTIF AUJOURD'HUI :</p>" +
      "<div style='display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px;'>" +
      actionCard("💰", ventes, "vente"+(ventes>1?"s":""), "#27AE60") +
      actionCard("💬", convs, "conversation"+(convs>1?"s":""), "#3498db") +
      actionCard("📱", posts, "post"+(posts>1?"s":""), "#c9a86a") +
      "</div>" +
      // Conseil Phénix
      "<div style='background:linear-gradient(135deg,#fdf6ec,#f8f3ee);border:1px solid #e8d4b0;border-radius:12px;padding:12px;margin-bottom:14px;display:flex;gap:10px;align-items:flex-start;'>" +
      "<span style='font-size:24px;'>🐦‍🔥</span>" +
      "<p style='color:#3a3a3a;font-size:12px;margin:0;line-height:1.5;'>" + getConseilJour(pct, joursRestants, ventes) + "</p>" +
      "</div>" +
      // Boutons
      "<div style='display:flex;gap:8px;'>" +
      "<button id='plan-ok-btn' style='flex:1;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:13px;border-radius:12px;font-weight:bold;font-size:14px;cursor:pointer;touch-action:manipulation;'>💪 C'est parti !</button>" +
      "<button id='plan-close-btn' style='background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:13px 16px;border-radius:12px;cursor:pointer;touch-action:manipulation;font-size:13px;'>Plus tard</button>" +
      "</div>" +
      "</div>" +
      "</div>";

    document.body.appendChild(panel);

    document.getElementById("plan-ok-btn").onclick = function() { fermerPlan(); if (window.baaPlaySuccess) window.baaPlaySuccess(); };
    document.getElementById("plan-close-btn").onclick = fermerPlan;
    document.getElementById("plan-ok-btn").addEventListener("touchend", function(e){e.preventDefault();fermerPlan();if(window.baaPlaySuccess)window.baaPlaySuccess();},{passive:false});
    document.getElementById("plan-close-btn").addEventListener("touchend", function(e){e.preventDefault();fermerPlan();},{passive:false});
  }

  function fermerPlan() {
    localStorage.setItem("baa-plan-date", new Date().toDateString());
    var panel = document.getElementById("baa-plan-panel");
    if (panel) panel.remove();
  }

  function actionCard(emoji, nb, label, couleur) {
    return "<div style='background:white;border-radius:10px;padding:12px;text-align:center;border:2px solid " + couleur + "33;'>" +
      "<p style='font-size:20px;margin:0 0 4px;'>" + emoji + "</p>" +
      "<p style='color:" + couleur + ";font-size:20px;font-weight:bold;margin:0 0 2px;'>" + nb + "</p>" +
      "<p style='color:#999;font-size:10px;margin:0;'>" + label + "</p>" +
      "</div>";
  }

  function getConseilJour(pct, joursRestants, ventes) {
    if (pct >= 80) return "Tu es en excellente forme ! Plus que quelques efforts pour boucler ce mois en beauté. Continue comme ça ! 🔥";
    if (pct >= 50) return "Bonne progression ! Tu es dans la bonne direction. " + ventes + " vente"+(ventes>1?"s":"")+" aujourd'hui et tu accélères vers ton objectif.";
    if (joursRestants <= 5) return "La dernière ligne droite ! C'est maintenant que tu fais la différence. Contacte tes clientes inactives en priorité.";
    if (ventes <= 1) return "Aujourd'hui c'est faisable ! Une seule vente peut tout changer. Commence par relancer tes clientes récentes.";
    return "Chaque conversation compte ! " + ventes + " vente"+(ventes>1?"s":"")+" aujourd'hui te rapprochent de ton objectif. Lance-toi !";
  }

  function afficherPlanAtteint(prenom) {
    var today = new Date().toDateString();
    if (localStorage.getItem("baa-plan-atteint-date") === today) return;
    localStorage.setItem("baa-plan-atteint-date", today);
    if (window.__afficherMessagePhenixEvent) {
      window.__afficherMessagePhenixEvent("🎉 "+prenom+", tu as atteint ton objectif du mois ! Tu es une vraie championne 🏆 Pense à définir un nouvel objectif pour continuer sur ta lancée !");
    }
  }

  initPlanQuotidien();
  console.log("BAA Plan Quotidien initialise");
})();
