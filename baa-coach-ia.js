// BAA Coach IA — Phase 2 Intelligence Contextuelle
// Phénix analyse la situation et suggère des actions précises

(function() {
  function initCoachIA() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(initCoachIA, 300); return; }
    var auth = firebase.auth();
    var db = firebase.firestore();

    auth.onAuthStateChanged(function(user) {
      if (!user) return;
      // Analyser après 8 secondes (après le plan du jour)
      setTimeout(function() { analyserEtCoacher(user.uid, db); }, 8000);
    });
  }

  function analyserEtCoacher(uid, db) {
    // Ne pas analyser plus d'une fois toutes les 4 heures
    var lastCheck = localStorage.getItem("baa-coach-check");
    var now = new Date().getTime();
    if (lastCheck && (now - parseInt(lastCheck)) < 4 * 60 * 60 * 1000) return;

    db.collection("users").doc(uid).get().then(function(snap) {
      if (!snap.exists) return;
      var d = snap.data();

      var analyses = [];
      var now2 = new Date();
      var moisKey = now2.getFullYear() + "-" + (now2.getMonth() + 1);
      var manuel = (d.tableauBordManuel || {})[moisKey] || {};
      var caActuel = (manuel.ca || 0) + (d.caMoisEnCours || 0);
      var objectif = d.suiviObjectif || d.objectifMensuel || 0;
      var joursEcoules = now2.getDate();
      var dernierJour = new Date(now2.getFullYear(), now2.getMonth() + 1, 0).getDate();
      var pctMois = joursEcoules / dernierJour;
      var pctCA = objectif > 0 ? caActuel / objectif : 0;

      // Analyse 1 — CA en retard par rapport au rythme du mois
      if (objectif > 0 && pctCA < pctMois * 0.7 && joursEcoules > 7) {
        var caAttendu = objectif * pctMois;
        var retard = Math.round(caAttendu - caActuel);
        analyses.push({
          priorite: 1,
          type: "ca_retard",
          msg: "📊 Ton CA est en retard de "+retard+"€ par rapport au rythme prévu. Pour rattraper, concentre-toi sur tes clientes les plus actives cette semaine.",
          action: "Ouvre le Carnet clients et contacte tes 3 meilleures clientes"
        });
      }

      // Analyse 2 — Pas de commandes récentes
      db.collection("commandes_clients")
        .where("boutiqueUid", "==", uid)
        .orderBy("date", "desc")
        .limit(1)
        .get().then(function(cmdSnap) {
          if (!cmdSnap.empty) {
            var lastCmd = cmdSnap.docs[0].data();
            var lastCmdDate = new Date(lastCmd.date);
            var daysSinceCmd = Math.floor((now2 - lastCmdDate) / (1000 * 60 * 60 * 24));
            if (daysSinceCmd >= 7) {
              analyses.push({
                priorite: 2,
                type: "pas_commande",
                msg: "🛍️ Aucune commande depuis "+daysSinceCmd+" jours ! C'est le moment de relancer tes clientes avec une offre ou un nouveau produit.",
                action: "Utilise le Générateur de posts pour créer un post de relance"
              });
            }
          }

          // Analyse 3 — Clientes inactives dans le carnet
          db.collection("users").doc(uid).collection("clientes").get().then(function(clientesSnap) {
            var clientesInactives = 0;
            var tresMoisPassés = new Date();
            tresMoisPassés.setMonth(tresMoisPassés.getMonth() - 1);

            clientesSnap.forEach(function(c) {
              var data = c.data();
              if (data.derniereCommande) {
                var lastDate = new Date(data.derniereCommande.split("/").reverse().join("-"));
                if (lastDate < tresMoisPassés) clientesInactives++;
              }
            });

            if (clientesInactives >= 3) {
              analyses.push({
                priorite: 2,
                type: "clientes_inactives",
                msg: "👥 "+clientesInactives+" clientes n'ont pas commandé depuis plus d'un mois. Une relance personnalisée peut générer des ventes rapidement !",
                action: "Utilise le bouton 💬 IA dans le Carnet clients pour chaque cliente inactive"
              });
            }

            // Analyse 4 — Quiz non complétés
            var quizFields = ["quizBonDemarrageComplete","quizModule2Complete","quizModule3Complete","quizModule4Complete","quizModule5Complete"];
            var quizNonFait = quizFields.filter(function(f) { return !d[f]; });
            if (quizNonFait.length > 0) {
              analyses.push({
                priorite: 3,
                type: "formation",
                msg: "🎓 Tu as "+quizNonFait.length+" quiz de formation en attente. Les membres qui complètent les formations font en moyenne 40% de CA en plus !",
                action: "Va dans Mes Quiz pour continuer ta formation"
              });
            }

            // Afficher l'analyse la plus prioritaire
            if (analyses.length > 0) {
              analyses.sort(function(a, b) { return a.priorite - b.priorite; });
              var principale = analyses[0];
              localStorage.setItem("baa-coach-check", new Date().getTime().toString());
              
              setTimeout(function() {
                afficherConseilCoach(principale, analyses.length);
              }, 2000);
            }
          });
        });
    });
  }

  function afficherConseilCoach(analyse, nbAnalyses) {
    if (document.getElementById("baa-coach-panel")) return;

    var panel = document.createElement("div");
    panel.id = "baa-coach-panel";
    panel.style.cssText = "position:fixed;bottom:140px;left:16px;z-index:9999999;max-width:320px;font-family:Arial,sans-serif;animation:phenixFadeIn 0.4s ease;";
    panel.onclick = function(e) { e.stopPropagation(); };

    panel.innerHTML = "<div style='background:white;border:2px solid #c9a86a;border-radius:16px;padding:16px;box-shadow:0 8px 30px rgba(0,0,0,0.2);position:relative;'>" +
      "<button id='close-coach' style='position:absolute;top:-8px;right:-8px;background:#8b735d;color:white;border:none;border-radius:50%;width:22px;height:22px;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;'>✕</button>" +
      "<div style='display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;'>" +
      "<span style='font-size:28px;'>🐦‍🔥</span>" +
      "<div>" +
      "<p style='color:#c9a86a;font-size:10px;font-weight:bold;margin:0 0 3px;letter-spacing:1px;'>PHÉNIX COACH</p>" +
      "<p style='color:#3a3a3a;font-size:12px;margin:0;line-height:1.5;'>"+analyse.msg+"</p>" +
      "</div>" +
      "</div>" +
      "<div style='background:#fdf6ec;border-radius:8px;padding:8px 10px;margin-bottom:10px;'>" +
      "<p style='color:#8b735d;font-size:11px;margin:0;'>👉 "+analyse.action+"</p>" +
      "</div>" +
      (nbAnalyses > 1 ? "<p style='color:#999;font-size:10px;margin:0 0 8px;text-align:center;'>+"+(nbAnalyses-1)+" autre"+(nbAnalyses>2?"s":"")+" analyse"+(nbAnalyses>2?"s":"")+" disponible"+(nbAnalyses>2?"s":"")+"</p>" : "") +
      "<div style='display:flex;gap:6px;'>" +
      "<button id='coach-ok-btn' style='flex:1;background:#c9a86a;color:#1a0a00;border:none;padding:8px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;touch-action:manipulation;'>Compris 💪</button>" +
      "<button id='coach-phenix-btn' style='background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:8px 10px;border-radius:8px;font-size:12px;cursor:pointer;touch-action:manipulation;'>Demander à Phénix</button>" +
      "</div>" +
      "</div>";

    document.body.appendChild(panel);

    document.getElementById("close-coach").onclick = function() { panel.remove(); };
    document.getElementById("coach-ok-btn").onclick = function() { panel.remove(); };
    document.getElementById("coach-ok-btn").addEventListener("touchend", function(e){e.preventDefault();panel.remove();},{passive:false});
    document.getElementById("coach-phenix-btn").onclick = function() {
      panel.remove();
      if (typeof openAssistantPanel === "function") {
        openAssistantPanel();
      }
    };
    document.getElementById("coach-phenix-btn").addEventListener("touchend",function(e){e.preventDefault();panel.remove();if(typeof openAssistantPanel==="function")openAssistantPanel();},{passive:false});

    // Auto-fermeture après 15 secondes
    setTimeout(function() {
      if (panel.parentNode) {
        panel.style.opacity = "0";
        panel.style.transition = "opacity 0.5s";
        setTimeout(function() { panel.remove(); }, 500);
      }
    }, 15000);
  }

  initCoachIA();
  console.log("BAA Coach IA initialise");
})();
