// BAA Events — Système d'événements central
// Ce fichier coordonne tous les modules de l'académie

(function() {
  // Initialiser le bus IMMÉDIATEMENT — avant même Firebase
  window.baaEventBus = {
    listeners: {},
    emit: function(event, data) {
      var cbs = this.listeners[event] || [];
      cbs.forEach(function(cb) { try { cb(data); } catch(e) { console.log("BAA Event error:", event, e); } });
    },
    on: function(event, cb) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(cb);
    }
  };

  // Attendre que Firebase soit initialisé pour le reste
  function initBAAEvents() {
    if (typeof firebase === "undefined" || !firebase.apps || !firebase.apps.length) {
      setTimeout(initBAAEvents, 200);
      return;
    }

  var db = firebase.firestore();
  var auth = firebase.auth();

  // ============================
  // ÉVÉNEMENT : CONNEXION
  // ============================
  window.baaEventBus.on("connexion", function(data) {
    var heure = new Date().getHours();
    var prenom = data.prenom || "toi";
    var msg = "";
    if (heure >= 5 && heure < 12) {
      msg = "Bonjour "+prenom+" ! ☀️ Belle journée pour conquérir de nouvelles clientes !";
    } else if (heure >= 12 && heure < 18) {
      msg = "Bon après-midi "+prenom+" ! 💪 C'est le bon moment pour relancer tes prospects !";
    } else {
      msg = "Bonsoir "+prenom+" ! 🌙 Tu as pensé à relancer tes clientes aujourd'hui ?";
    }
    setTimeout(function() {
      if (typeof afficherPhenixContextuel === "function") {
        // Message spécial connexion via bulle Phénix
        var existing = document.getElementById("phenix-contextuel");
        if (existing) existing.remove();
        var bubble = document.createElement("div");
        bubble.id = "phenix-contextuel";
        bubble.style.cssText = "position:fixed;bottom:80px;left:16px;z-index:9999999;display:flex;align-items:flex-end;gap:8px;font-family:Arial,sans-serif;animation:phenixFadeIn 0.4s ease;";
        var avatar = document.createElement("div");
        avatar.style.cssText = "width:44px;height:44px;background:linear-gradient(135deg,#c9a86a,#f5d48a);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:0 4px 15px rgba(201,168,106,0.4);";
        avatar.textContent = "🐦‍🔥";
        var msgDiv = document.createElement("div");
        msgDiv.style.cssText = "background:white;border:1px solid #e8d4b0;border-radius:16px 16px 16px 4px;padding:10px 14px;max-width:220px;box-shadow:0 4px 12px rgba(0,0,0,0.1);position:relative;";
        var closeX = document.createElement("button");
        closeX.textContent = "✕";
        closeX.style.cssText = "position:absolute;top:-8px;right:-8px;background:#8b735d;color:white;border:none;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer;";
        closeX.onclick = function(e) { e.stopPropagation(); bubble.remove(); };
        msgDiv.innerHTML = "<p style='color:#3a3a3a;font-size:12px;margin:0 0 4px;line-height:1.5;'>"+msg+"</p><p style='color:#c9a86a;font-size:11px;font-weight:bold;margin:0;'>Appuie pour me parler →</p>";
        msgDiv.appendChild(closeX);
        msgDiv.onclick = function(e) { if(e.target!==closeX){bubble.remove();if(typeof openAssistantPanel==="function")openAssistantPanel();} };
        bubble.appendChild(avatar); bubble.appendChild(msgDiv);
        document.body.appendChild(bubble);
        setTimeout(function(){if(bubble.parentNode){bubble.style.opacity="0";bubble.style.transition="opacity 0.5s";setTimeout(function(){bubble.remove();},500);}},6000);
      }
    }, 4000);
  });

  // ============================
  // ÉVÉNEMENT : VENTE REALISEE
  // ============================
  window.baaEventBus.on("vente_realisee", function(data) {
    var user = auth.currentUser; if (!user) return;
    var montant = data.montant || 0;
    var clientNom = data.clientNom || "une cliente";

    // 1. Célébration visuelle
    lancerConfettis();

    // 2. Message Phénix
    setTimeout(function() {
      afficherMessagePhenixEvent("🎉 Félicitations ! Tu viens de réaliser une vente de "+montant+"€ avec "+clientNom+" ! Continue comme ça, tu es sur la bonne voie ! 🔥");
    }, 500);

    // 3. Ajouter points XP
    ajouterPointsXP(user.uid, 50, "Vente réalisée");

    // 4. Proposition de partager sur le mur des victoires
    setTimeout(function() {
      afficherPropositionVictoire("💰 Tu viens de faire une vente de "+montant+"€ ! Tu veux le partager sur le Mur des Victoires ?");
    }, 3000);

    // 5. Mettre à jour progression rang
    mettreAJourProgressionRang(user.uid, montant);
  });

  // ============================
  // ÉVÉNEMENT : MODULE TERMINE
  // ============================
  window.baaEventBus.on("module_termine", function(data) {
    var user = auth.currentUser; if (!user) return;
    var moduleNom = data.moduleNom || "ce module";
    var score = data.score || 0;
    var quizSuivant = data.quizSuivant || null;

    // 1. Points XP
    ajouterPointsXP(user.uid, 100, "Module terminé : "+moduleNom);

    // 2. Points badges
    setTimeout(function() {
      if (typeof window.ajouterPointsBadge === "function") {
        window.ajouterPointsBadge(20);
      }
    }, 2000);

    // 3. Célébration
    lancerConfettis();

    // 4. Message Phénix personnalisé
    setTimeout(function() {
      var msg = "🎓 Bravo ! Tu as validé le "+moduleNom+" avec "+score+"% ! +20 points badges gagnés 🔥";
      if (quizSuivant) {
        msg += "\n\n👉 Prochain quiz : "+quizSuivant+" — continue sur ta lancée !";
      } else {
        msg += "\n\n🏆 Tu as validé tous les quiz ! Tu es au top !";
      }
      afficherMessagePhenixEvent(msg);
    }, 500);

    // 5. Proposition victoire
    setTimeout(function() {
      afficherPropositionVictoire("🎓 Tu viens de valider le "+moduleNom+" avec "+score+"% ! Tu veux partager cette victoire avec l'équipe ?");
    }, 4000);
  });

  // ============================
  // ÉVÉNEMENT : OBJECTIF DEFINI
  // ============================
  window.baaEventBus.on("objectif_defini", function(data) {
    var objectif = data.objectif || 500;
    var PALIERS = [
      {nom:"Consultant",min:100,comm:20},{nom:"Conseiller",min:250,comm:30},
      {nom:"Conseiller Principal",min:500,comm:30},{nom:"Responsable",min:1000,comm:30},
    ];
    var palier = PALIERS[0];
    for(var i=0;i<PALIERS.length;i++){if(objectif>=PALIERS[i].min)palier=PALIERS[i];}
    var commission = Math.round(objectif * palier.comm / 100);
    var nbVentes = Math.ceil(objectif / 35); // panier moyen estimé 35€
    var nbConversations = nbVentes * 5; // ratio 1 vente / 5 conversations
    var nbPosts = Math.ceil(nbConversations / 3); // 3 prospects par post

    setTimeout(function() {
      afficherMessagePhenixEvent(
        "🎯 Pour atteindre "+objectif+"€ ce mois-ci :\n\n" +
        "• ~"+nbVentes+" ventes à réaliser\n" +
        "• ~"+nbConversations+" conversations à lancer\n" +
        "• ~"+nbPosts+" posts à publier\n" +
        "• Commission estimée : "+commission+"€\n\n" +
        "Soit "+Math.ceil(nbConversations/30)+" conversations par jour — c'est tout à fait réalisable ! 💪"
      );
    }, 500);
  });

  // ============================
  // FONCTIONS UTILITAIRES
  // ============================

  function lancerConfettis() {
    if (document.getElementById("baa-confettis")) return;
    var canvas = document.createElement("canvas");
    canvas.id = "baa-confettis";
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999998;pointer-events:none;";
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var particles = [];
    var colors = ["#c9a86a","#f5d48a","#e74c3c","#27AE60","#3498db","#9b59b6"];
    for (var i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        w: Math.random() * 10 + 5,
        h: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 4 + 2,
        angle: Math.random() * 360,
        rotation: Math.random() * 10 - 5
      });
    }
    var frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function(p) {
        p.y += p.speed;
        p.angle += p.rotation;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 120) requestAnimationFrame(animate);
      else { canvas.remove(); }
    }
    animate();
  }

  function afficherMessagePhenixEvent(msg) {
    var existing = document.getElementById("phenix-event-msg");
    if (existing) existing.remove();
    var bubble = document.createElement("div");
    bubble.id = "phenix-event-msg";
    bubble.style.cssText = "position:fixed;bottom:80px;left:16px;z-index:9999999;display:flex;align-items:flex-end;gap:8px;font-family:Arial,sans-serif;animation:phenixFadeIn 0.4s ease;max-width:80%;";
    var avatar = document.createElement("div");
    avatar.style.cssText = "width:44px;height:44px;background:linear-gradient(135deg,#c9a86a,#f5d48a);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;";
    avatar.textContent = "🐦‍🔥";
    var msgDiv = document.createElement("div");
    msgDiv.style.cssText = "background:white;border:2px solid #c9a86a;border-radius:16px 16px 16px 4px;padding:12px 16px;box-shadow:0 4px 16px rgba(0,0,0,0.15);position:relative;cursor:pointer;";
    msgDiv.innerHTML = "<p style='color:#3a3a3a;font-size:13px;margin:0;line-height:1.6;white-space:pre-line;'>"+msg+"</p>";
    var closeX = document.createElement("button");
    closeX.textContent = "✕";
    closeX.style.cssText = "position:absolute;top:-8px;right:-8px;background:#8b735d;color:white;border:none;border-radius:50%;width:20px;height:20px;font-size:11px;cursor:pointer;";
    closeX.onclick = function(e) { e.stopPropagation(); bubble.remove(); };
    msgDiv.appendChild(closeX);
    msgDiv.onclick = function(e) { if(e.target!==closeX){bubble.remove();if(typeof openAssistantPanel==="function")openAssistantPanel();} };
    bubble.appendChild(avatar); bubble.appendChild(msgDiv);
    document.body.appendChild(bubble);
    setTimeout(function(){if(bubble.parentNode){bubble.style.opacity="0";bubble.style.transition="opacity 0.5s";setTimeout(function(){bubble.remove();},500);}},8000);
  }

  function afficherPropositionVictoire(msg) {
    var existing = document.getElementById("phenix-victoire-prop");
    if (existing) existing.remove();
    var div = document.createElement("div");
    div.id = "phenix-victoire-prop";
    div.style.cssText = "position:fixed;bottom:140px;left:50%;transform:translateX(-50%);z-index:9999999;background:white;border:2px solid #c9a86a;border-radius:16px;padding:16px;max-width:320px;box-shadow:0 8px 24px rgba(0,0,0,0.2);font-family:Arial,sans-serif;text-align:center;";
    div.innerHTML = "<p style='color:#3a3a3a;font-size:13px;margin:0 0 12px;line-height:1.5;'>"+msg+"</p>";
    var ouiBtn = document.createElement("button");
    ouiBtn.textContent = "✅ Oui, partager !";
    ouiBtn.style.cssText = "background:#c9a86a;color:#1a0a00;border:none;padding:10px 16px;border-radius:10px;font-weight:bold;font-size:13px;cursor:pointer;margin-right:8px;touch-action:manipulation;";
    ouiBtn.onclick = function() { div.remove(); if(typeof openVictoiresPanel==="function")openVictoiresPanel(); };
    var nonBtn = document.createElement("button");
    nonBtn.textContent = "Plus tard";
    nonBtn.style.cssText = "background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:10px 16px;border-radius:10px;font-size:13px;cursor:pointer;touch-action:manipulation;";
    nonBtn.onclick = function() { div.remove(); };
    div.appendChild(ouiBtn); div.appendChild(nonBtn);
    document.body.appendChild(div);
    setTimeout(function(){if(div.parentNode)div.remove();},10000);
  }

  function ajouterPointsXP(uid, points, raison) {
    var update = {};
    update["xp"] = firebase.firestore.FieldValue.increment(points);
    update["xpLog"] = firebase.firestore.FieldValue.arrayUnion({points:points,raison:raison,date:new Date().toISOString()});
    db.collection("users").doc(uid).update(update).catch(function(){
      db.collection("users").doc(uid).set({xp:points,xpLog:[{points:points,raison:raison,date:new Date().toISOString()}]},{merge:true});
    });
  }

  function mettreAJourProgressionRang(uid, montantVente) {
    // Juste un log — le vrai calcul se fait dans le tableau de bord
    db.collection("users").doc(uid).get().then(function(snap){
      var d = snap.exists ? snap.data() : {};
      var caMois = (d.caMoisEnCours || 0) + montantVente;
      db.collection("users").doc(uid).update({caMoisEnCours: caMois}).catch(function(){});
    });
  }

  // ============================
  // DÉTECTION AUTOMATIQUE TOUS LES QUIZ
  // ============================
  var QUIZ_MAP = {
    "quizBonDemarrageComplete":   { nom: "Bon Démarrage",       suivant: "Module 2" },
    "quizModule2Complete":        { nom: "Module 2",             suivant: "Module 3" },
    "quizModule3Complete":        { nom: "Module 3",             suivant: "Module 4" },
    "quizModule4Complete":        { nom: "Module 4",             suivant: "Module 5" },
    "quizModule5Complete":        { nom: "Module 5",             suivant: "Module 6" },
    "quizModule6Complete":        { nom: "Module 6",             suivant: "Module 7" },
    "quizModule7Complete":        { nom: "Module 7",             suivant: "Module 8" },
    "quizModule8Complete":        { nom: "Module 8",             suivant: "Module 9" },
    "quizModule9Complete":        { nom: "Module 9",             suivant: "Module 10" },
    "quizModule10Complete":       { nom: "Module 10",            suivant: null }
  };

  auth.onAuthStateChanged(function(user) {
    if (!user) return;
    var previousData = null;
    db.collection("users").doc(user.uid).onSnapshot(function(snap) {
      var data = snap.data() || {};
      if (previousData === null) {
        previousData = JSON.parse(JSON.stringify(data));
        return;
      }
      Object.keys(QUIZ_MAP).forEach(function(field) {
        if (data[field] === true && previousData[field] !== true) {
          var quizInfo = QUIZ_MAP[field];
          var score = data[field.replace("Complete","Score")] || 0;
          var total = data[field.replace("Complete","Total")] || 1;
          var pct = Math.round(score / total * 100);
          window.baaEventBus.emit("module_termine", {
            moduleNom: "Quiz " + quizInfo.nom,
            score: pct,
            quizSuivant: quizInfo.suivant
          });
        }
      });
      previousData = JSON.parse(JSON.stringify(data));
    });

    // Message de connexion
    db.collection("users").doc(user.uid).get().then(function(snap) {
      var prenom = snap.exists ? (snap.data().prenom || "") : "";
      setTimeout(function() {
        window.baaEventBus.emit("connexion", { uid: user.uid, prenom: prenom });
      }, 3500);
    });
  });

  console.log("✅ BAA Events initialisé");

  } // fin initBAAEvents
  initBAAEvents();

})();

  // ============================
  // ÉVÉNEMENT : VICTOIRE PARTAGÉE
  // ============================
  window.baaEventBus.on("victoire_partagee", function(data) {
    var user = auth.currentUser; if (!user) return;
    var prenom = data.prenom || "toi";
    var categorie = data.categorie || "";

    // 1. Points XP
    ajouterPointsXP(user.uid, 30, "Victoire partagée");

    // 2. Message Phénix
    setTimeout(function() {
      var msg = "🏆 Bravo "+prenom+" ! Ta victoire inspire toute l'équipe ! Continue comme ça 🔥";
      if (categorie) msg += "\n\nCatégorie : "+categorie;
      afficherMessagePhenixEvent(msg);
    }, 500);
  });

  // ============================
  // CONNEXION BADGES AU BUS
  // ============================
  window.baaEventBus.on("vente_realisee", function(data) {
    setTimeout(function() {
      if (typeof window.ajouterPointsBadge === "function") {
        window.ajouterPointsBadge(5); // +5 pts par commande
      }
    }, 2000);
  });

  window.baaEventBus.on("module_termine", function(data) {
    setTimeout(function() {
      if (typeof window.ajouterPointsBadge === "function") {
        window.ajouterPointsBadge(20); // +20 pts par module terminé
      }
    }, 2000);
  });
  function patchEmailJSPourVentes() {
    if (typeof emailjs === "undefined") {
      setTimeout(patchEmailJSPourVentes, 500);
      return;
    }
    var _origSend = emailjs.send;
    emailjs.send = function(serviceId, templateId, params) {
      var result = _origSend.apply(this, arguments);
      if (templateId === "template_nkfnrnd" && window.baaEventBus) {
        var montant = parseFloat(((params && params.total) || "0").replace("€","").replace(",",".")) || 0;
        var clientNom = (params && (params.client_prenom || params.client_nom)) || "une cliente";
        setTimeout(function() {
          window.baaEventBus.emit("vente_realisee", {
            montant: montant,
            clientNom: clientNom,
            articles: (params && params.articles) || ""
          });
        }, 1000);
      }
      return result;
    };
    console.log("✅ BAA Vente Event patch actif");
  }
  patchEmailJSPourVentes();
