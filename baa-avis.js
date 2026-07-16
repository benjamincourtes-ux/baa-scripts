// BAA Avis — Système d'avis membres avec étoiles
// Ajoute un bouton "Donner mon avis" dans l'académie

(function() {
  function initAvis() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(initAvis, 300); return; }
    var auth = firebase.auth();
    var db = firebase.firestore();

    auth.onAuthStateChanged(function(user) {
      if (!user) return;
      setTimeout(function() { injecterBoutonAvis(user, db); }, 4000);
    });
  }

  function injecterBoutonAvis(user, db) {
    if (document.getElementById("baa-avis-btn")) return;

    // Ajouter le bouton dans le menu hamburger
    var menuBtn = document.getElementById("baa-menu-btn");
    if (!menuBtn) return;

    var btn = document.createElement("div");
    btn.id = "baa-avis-btn";
    btn.style.cssText = "position:fixed;bottom:180px;right:20px;z-index:99998;background:linear-gradient(135deg,#f5d48a,#c9a86a);border-radius:50%;width:46px;height:46px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 15px rgba(201,168,106,0.4);font-size:20px;touch-action:manipulation;";
    btn.innerHTML = "⭐";
    btn.title = "Donner mon avis";
    btn.onclick = function() { ouvrirPanneauAvis(user, db); };
    btn.addEventListener("touchend", function(e){e.preventDefault();ouvrirPanneauAvis(user,db);},{passive:false});
    document.body.appendChild(btn);
  }

  function ouvrirPanneauAvis(user, db) {
    if (document.getElementById("baa-avis-panel")) return;

    var panel = document.createElement("div");
    panel.id = "baa-avis-panel";
    panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999999;display:flex;justify-content:center;align-items:center;padding:20px;font-family:Arial,sans-serif;";
    panel.onclick = function(e) { if (e.target===panel) panel.remove(); };

    var box = document.createElement("div");
    box.style.cssText = "background:#f8f3ee;width:90%;max-width:480px;border-radius:20px;padding:24px;";
    box.onclick = function(e){e.stopPropagation();};

    // Vérifier si l'utilisateur a déjà laissé un avis
    db.collection("avis").where("uid","==",user.uid).get().then(function(snap) {
      if (!snap.empty) {
        box.innerHTML = "<div style='text-align:center;padding:20px;'><p style='font-size:40px;margin-bottom:12px;'>⭐</p><h3 style='color:#8b735d;margin-bottom:8px;'>Merci pour ton avis !</h3><p style='color:#666;font-size:13px;'>Tu as déjà partagé ton expérience. On t'en remercie 🙏</p><button id='close-avis' style='margin-top:16px;background:#c9a86a;color:#1a0a00;border:none;padding:12px 24px;border-radius:10px;cursor:pointer;font-weight:bold;'>Fermer</button></div>";
        panel.appendChild(box);
        document.body.appendChild(panel);
        document.getElementById("close-avis").onclick = function() { panel.remove(); };
        return;
      }

      var noteSelectionnee = 5;

      box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;'><h3 style='color:#8b735d;font-size:16px;margin:0;'>⭐ Donne ton avis</h3><button id='close-avis' style='background:none;border:none;font-size:22px;color:#8b735d;cursor:pointer;'>✕</button></div>" +
        "<p style='color:#666;font-size:13px;margin-bottom:16px;line-height:1.5;'>Ton avis sera affiché sur notre page de recrutement pour aider d'autres personnes à nous rejoindre 🌿</p>" +
        "<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 10px;'>Ta note *</p>" +
        "<div id='etoiles-select' style='display:flex;gap:8px;margin-bottom:16px;font-size:32px;cursor:pointer;'>" +
        [1,2,3,4,5].map(function(n){ return "<span data-note='"+n+"' style='opacity:"+(n<=5?"1":"0.3")+";touch-action:manipulation;'>⭐</span>"; }).join("") +
        "</div>" +
        "<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 6px;'>Ton prénom (affiché publiquement)</p>" +
        "<input id='avis-prenom' placeholder='Ex: Marie' style='width:100%;padding:11px;border:1px solid #e8d4b0;border-radius:10px;font-size:13px;box-sizing:border-box;margin-bottom:10px;' />" +
        "<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 6px;'>Ton témoignage *</p>" +
        "<textarea id='avis-texte' placeholder='Partage ton expérience avec l\\'académie et l\\'équipe...' rows='4' style='width:100%;padding:11px;border:1px solid #e8d4b0;border-radius:10px;font-size:13px;box-sizing:border-box;margin-bottom:14px;resize:none;'></textarea>" +
        "<button id='avis-submit' style='width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:13px;border-radius:12px;font-weight:bold;font-size:14px;cursor:pointer;touch-action:manipulation;'>✨ Publier mon avis</button>" +
        "<div id='avis-msg' style='text-align:center;font-size:13px;color:#8b735d;margin-top:8px;'></div>";

      panel.appendChild(box);
      document.body.appendChild(panel);

      document.getElementById("close-avis").onclick = function() { panel.remove(); };

      // Gestion des étoiles
      var etoiles = document.querySelectorAll("#etoiles-select span");
      etoiles.forEach(function(star) {
        var doSelect = function() {
          noteSelectionnee = parseInt(star.getAttribute("data-note"));
          etoiles.forEach(function(s) {
            s.style.opacity = parseInt(s.getAttribute("data-note")) <= noteSelectionnee ? "1" : "0.3";
          });
        };
        star.onclick = doSelect;
        star.addEventListener("touchend", function(e){e.preventDefault();doSelect();},{passive:false});
      });

      // Pré-remplir le prénom
      db.collection("users").doc(user.uid).get().then(function(snap) {
        if (snap.exists && snap.data().prenom) {
          document.getElementById("avis-prenom").value = snap.data().prenom;
        }
      });

      // Soumettre
      document.getElementById("avis-submit").onclick = function() {
        var texte = document.getElementById("avis-texte").value.trim();
        var prenom = document.getElementById("avis-prenom").value.trim();
        var msg = document.getElementById("avis-msg");
        if (!texte) { msg.textContent = "Merci d'écrire ton témoignage !"; return; }
        if (!prenom) { msg.textContent = "Merci d'indiquer ton prénom !"; return; }

        document.getElementById("avis-submit").disabled = true;
        document.getElementById("avis-submit").textContent = "⏳ Publication...";

        db.collection("avis").add({
          uid: user.uid,
          prenom: prenom,
          note: noteSelectionnee,
          texte: texte,
          valide: true, // auto-validé, tu peux mettre false pour modérer
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function() {
          box.innerHTML = "<div style='text-align:center;padding:20px;'><p style='font-size:48px;margin-bottom:12px;'>🎉</p><h3 style='color:#27AE60;margin-bottom:8px;'>Merci "+prenom+" !</h3><p style='color:#666;font-size:13px;line-height:1.5;'>Ton avis a été publié et sera visible sur notre page de recrutement 🌿</p><button id='close-avis-ok' style='margin-top:16px;background:#c9a86a;color:#1a0a00;border:none;padding:12px 24px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>Super ! 🐦‍🔥</button></div>";
          document.getElementById("close-avis-ok").onclick = function() { panel.remove(); };
        }).catch(function(e) {
          document.getElementById("avis-submit").disabled = false;
          document.getElementById("avis-submit").textContent = "✨ Publier mon avis";
          msg.textContent = "Erreur. Réessaie.";
        });
      };
      document.getElementById("avis-submit").addEventListener("touchend", function(e){e.preventDefault();document.getElementById("avis-submit").onclick();},{passive:false});
    });
  }

  initAvis();
  console.log("BAA Avis initialise");
})();
