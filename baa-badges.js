function initBadges() {
  if (window.__baaBadgesInitialized) return;
  window.__baaBadgesInitialized = true;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;
  if (!uid) return;

  var NIVEAUX = [
    { nom: "Oeuf Phenix", emoji: "🥚", min: 0, max: 99, couleur: "#888780" },
    { nom: "Phenix Naissant", emoji: "🐣", min: 100, max: 299, couleur: "#378ADD" },
    { nom: "Phenix en Vol", emoji: "🐦", min: 300, max: 599, couleur: "#EF9F27" },
    { nom: "Phenix Confirme", emoji: "🔥", min: 600, max: 999, couleur: "#D85A30" },
    { nom: "Phenix Elite", emoji: "🐦‍🔥", min: 1000, max: 99999, couleur: "#7F77DD" }
  ];

  var POINTS_REGLES = [
    { action: "Quiz valide a 80%", points: 20, emoji: "✅" },
    { action: "Victoire partagee sur le Mur", points: 10, emoji: "🏆" },
    { action: "Defi Eclair releve avec preuve", points: 30, emoji: "⚡" },
    { action: "Commande enregistree", points: 5, emoji: "📦" },
    { action: "Checklist complete dans la journee", points: 5, emoji: "✔️" },
    { action: "Objectif mensuel atteint", points: 50, emoji: "🎯" }
  ];

  function getNiveau(points) {
    for (var i = NIVEAUX.length - 1; i >= 0; i--) {
      if (points >= NIVEAUX[i].min) return NIVEAUX[i];
    }
    return NIVEAUX[0];
  }

  function getProgression(points) {
    var niveau = getNiveau(points);
    if (niveau.max === 99999) return 100;
    var range = niveau.max - niveau.min + 1;
    var progress = points - niveau.min;
    return Math.min(100, Math.round(progress / range * 100));
  }

  function calculerPoints(userData) {
    var pts = 0;
    // Quiz validés
    var quizFields = ["quizBonDemarrageComplete","quizModule2Complete","quizModule3Complete","quizModule4Complete","quizModule5Complete","quizModule6Complete","quizModule7Complete"];
    quizFields.forEach(function(f) { if (userData[f] === true) pts += 20; });
    return pts;
  }

  function flameSVG(pct, couleur, size) {
    size = size || 120;
    var fillY = 460 - (pct / 100) * 330;
    return '<svg width="' + size + '" height="' + Math.round(size * 1.3) + '" viewBox="0 0 340 460" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><clipPath id="fc' + size + '"><path d="M170 30 C185 55 210 65 220 90 C235 125 228 155 222 178 C238 158 248 135 242 108 C252 140 250 170 238 195 C252 180 260 158 256 135 C263 165 258 200 242 222 C252 212 256 192 252 172 C258 202 252 235 236 255 C246 242 248 222 244 205 C248 230 242 260 224 278 C232 265 234 245 230 228 C232 252 225 275 212 290 C216 272 218 252 214 235 C208 258 202 280 192 293 C195 273 196 253 192 237 C186 260 181 282 172 293 C174 273 175 253 173 237 C167 258 162 280 153 293 C155 273 156 253 154 237 C148 258 140 278 131 290 C134 270 135 250 131 233 C122 253 116 275 116 295 C110 272 114 245 122 222 C108 240 102 265 104 288 C96 262 100 230 112 205 C100 218 94 242 96 265 C88 238 92 202 108 178 C96 192 90 215 92 238 C84 208 88 172 106 148 C94 162 88 188 90 210 C82 178 86 140 104 115 C110 98 124 85 137 75 C148 66 160 61 167 50 C174 35 175 20 176 10 C181 30 175 45 170 30Z"/></clipPath></defs>' +
      '<path d="M170 30 C185 55 210 65 220 90 C235 125 228 155 222 178 C238 158 248 135 242 108 C252 140 250 170 238 195 C252 180 260 158 256 135 C263 165 258 200 242 222 C252 212 256 192 252 172 C258 202 252 235 236 255 C246 242 248 222 244 205 C248 230 242 260 224 278 C232 265 234 245 230 228 C232 252 225 275 212 290 C216 272 218 252 214 235 C208 258 202 280 192 293 C195 273 196 253 192 237 C186 260 181 282 172 293 C174 273 175 253 173 237 C167 258 162 280 153 293 C155 273 156 253 154 237 C148 258 140 278 131 290 C134 270 135 250 131 233 C122 253 116 275 116 295 C110 272 114 245 122 222 C108 240 102 265 104 288 C96 262 100 230 112 205 C100 218 94 242 96 265 C88 238 92 202 108 178 C96 192 90 215 92 238 C84 208 88 172 106 148 C94 162 88 188 90 210 C82 178 86 140 104 115 C110 98 124 85 137 75 C148 66 160 61 167 50 C174 35 175 20 176 10 C181 30 175 45 170 30Z" fill="#1a0c02" stroke="#3d1f05" stroke-width="1.5"/>' +
      '<g clip-path="url(#fc' + size + ')">' +
      '<rect x="0" y="' + fillY + '" width="340" height="' + (460 - fillY) + '" fill="' + couleur + '"/>' +
      '<rect x="0" y="' + (fillY - 30) + '" width="340" height="35" fill="#FAC775" opacity="0.4"/>' +
      '</g>' +
      '<path d="M170 30 C185 55 210 65 220 90 C235 125 228 155 222 178 C238 158 248 135 242 108 C252 140 250 170 238 195 C252 180 260 158 256 135 C263 165 258 200 242 222 C252 212 256 192 252 172 C258 202 252 235 236 255 C246 242 248 222 244 205 C248 230 242 260 224 278 C232 265 234 245 230 228 C232 252 225 275 212 290 C216 272 218 252 214 235 C208 258 202 280 192 293 C195 273 196 253 192 237 C186 260 181 282 172 293 C174 273 175 253 173 237 C167 258 162 280 153 293 C155 273 156 253 154 237 C148 258 140 278 131 290 C134 270 135 250 131 233 C122 253 116 275 116 295 C110 272 114 245 122 222 C108 240 102 265 104 288 C96 262 100 230 112 205 C100 218 94 242 96 265 C88 238 92 202 108 178 C96 192 90 215 92 238 C84 208 88 172 106 148 C94 162 88 188 90 210 C82 178 86 140 104 115 C110 98 124 85 137 75 C148 66 160 61 167 50 C174 35 175 20 176 10 C181 30 175 45 170 30Z" fill="none" stroke="' + couleur + '" stroke-width="2"/>' +
      '</svg>';
  }

  function ouvrirBadgesPanel() {
    if (document.getElementById("baa-badges-panel")) return;
    var panel = document.createElement("div"); panel.id = "baa-badges-panel";
    panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:40px;overflow-y:auto;";
    var box = document.createElement("div");
    box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;font-family:Arial,sans-serif;max-height:88vh;overflow-y:auto;margin-bottom:40px;";
    panel.appendChild(box); document.body.appendChild(panel);
    panel.onclick = function(e) { if (e.target === panel) panel.remove(); };

    db.collection("users").doc(uid).get().then(function(snap) {
      var d = snap.data() || {};
      var pts = d.badgePoints || calculerPoints(d);
      var niveau = getNiveau(pts);
      var pct = getProgression(pts);
      var nextNiveau = NIVEAUX[NIVEAUX.indexOf(niveau) + 1];

      var moisNom = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
      box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;'><h2 style='color:#8b735d;margin:0;'>🏅 Mes Badges</h2><span id='close-badges' style='cursor:pointer;font-size:28px;color:#8b735d;'>✕</span></div>" +
      "<div style='background:#f3e7d3;border-radius:10px;padding:8px 14px;margin-bottom:16px;text-align:center;font-size:12px;color:#8a6a35;font-weight:bold;'>📅 Classement de " + moisNom + " — repart à zéro chaque mois</div>" +

      // Flamme + niveau actuel
      "<div style='text-align:center;margin-bottom:24px;'>" +
      "<div style='display:inline-block;'>" + flameSVG(pct, niveau.couleur, 130) + "</div>" +
      "<div style='margin-top:12px;'><span style='font-size:28px;'>" + niveau.emoji + "</span>" +
      "<div style='font-weight:bold;color:#3a3a3a;font-size:18px;margin-top:4px;'>" + niveau.nom + "</div>" +
      "<div style='color:#c9a86a;font-size:15px;font-weight:bold;margin-top:4px;'>" + pts + " points</div>" +
      (nextNiveau ? "<div style='color:#999;font-size:12px;margin-top:4px;'>encore " + (nextNiveau.min - pts) + " pts pour " + nextNiveau.emoji + " " + nextNiveau.nom + "</div>" : "<div style='color:#7F77DD;font-size:12px;margin-top:4px;'>Niveau maximum atteint ! 🎉</div>") +
      "</div></div>" +

      // Les 5 niveaux
      "<div style='background:white;border-radius:14px;padding:18px;border:1px solid #e8d4b0;margin-bottom:16px;'><p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 14px;'>Les niveaux</p>" +
      "<div style='display:flex;justify-content:space-between;gap:6px;'>" +
      NIVEAUX.map(function(n) {
        var actif = n.nom === niveau.nom;
        return "<div style='flex:1;text-align:center;padding:10px 4px;border-radius:10px;background:" + (actif ? "#f3e7d3" : "#fafafa") + ";border:1px solid " + (actif ? "#c8a96b" : "#f0e6d3") + ";'>" +
          "<div style='font-size:20px;'>" + n.emoji + "</div>" +
          "<div style='font-size:10px;font-weight:bold;color:#3a3a3a;margin-top:4px;line-height:1.3;'>" + n.nom + "</div>" +
          "<div style='font-size:9px;color:#999;margin-top:3px;'>" + n.min + (n.max === 99999 ? "+" : " – " + n.max) + " pts</div>" +
          "</div>";
      }).join("") +
      "</div></div>" +

      // Tableau des points
      "<div style='background:white;border-radius:14px;padding:18px;border:1px solid #e8d4b0;'><p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 12px;'>Comment gagner des points</p>" +
      POINTS_REGLES.map(function(r) {
        return "<div style='display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f8f3ee;'>" +
          "<div style='font-size:13px;color:#3a3a3a;'>" + r.emoji + " " + r.action + "</div>" +
          "<span style='background:#f3e7d3;color:#8a6a35;padding:3px 10px;border-radius:8px;font-size:12px;font-weight:bold;'>+" + r.points + " pts</span>" +
          "</div>";
      }).join("") +
      "</div>";

      document.getElementById("close-badges").onclick = function() {
        panel.remove(); var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click();
      };
    });
  }

  // Exposer la fonction globalement
  window.openBadgesPanel = ouvrirBadgesPanel;

  // Mettre à jour les points automatiquement
  // Écoute temps réel des changements Firebase
  var moisActuel = new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
  db.collection("users").doc(uid).onSnapshot(function(snap) {
    var d = snap.data() || {};
    // Remise à zéro si nouveau mois
    if (d.badgeMois && d.badgeMois !== moisActuel) {
      db.collection("users").doc(uid).update({ badgePoints: 0, badgeMois: moisActuel }).catch(function(){});
      return;
    }
    // Recalculer les points
    var pts = calculerPoints(d);
    if (pts !== d.badgePoints || !d.badgeMois) {
      db.collection("users").doc(uid).update({ badgePoints: pts, badgeMois: moisActuel }).catch(function(){});
    }
  }, function(){});
}

if (window.__baaLoginInitialized) { initBadges(); }
else { var badgesCheck = setInterval(function() { if (window.__baaLoginInitialized && firebase.auth().currentUser) { clearInterval(badgesCheck); initBadges(); } }, 1000); }
