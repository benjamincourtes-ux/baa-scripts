// BAA Commandes Confirmer — Ajoute bouton confirmation paiement dans Mes clientes
(function() {
  function init() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(init, 300); return; }

    var observer = new MutationObserver(function() {
      var panel = document.getElementById("baa-boutique-panel");
      if (!panel) return;
      var panelObs = new MutationObserver(function() {
        injecterBoutonsConfirmation(panel);
      });
      panelObs.observe(panel, { childList: true, subtree: true });
      injecterBoutonsConfirmation(panel);
    });
    observer.observe(document.body, { childList: true });
  }

  function injecterBoutonsConfirmation(panel) {
    var db = firebase.firestore();
    var user = firebase.auth().currentUser; if (!user) return;

    // Chercher les cartes de commandes dans le panneau
    // On ajoute un bandeau "commandes en attente" en haut si il y en a
    if (panel.querySelector("#baa-attente-section")) return;

    var titre = panel.querySelector("p");
    if (!titre || !titre.textContent.includes("Mes clientes")) return;

    var section = document.createElement("div");
    section.id = "baa-attente-section";
    section.style.cssText = "margin-bottom:16px;";

    db.collection("commandes_clients")
      .where("boutiqueUid", "==", user.uid)
      .where("statut", "==", "en_attente")
      .orderBy("date", "desc")
      .get().then(function(snap) {
        if (snap.empty) return;

        var header = document.createElement("div");
        header.style.cssText = "background:#fff3cd;border:1px solid #ffc107;border-radius:12px;padding:14px;margin-bottom:10px;";
        header.innerHTML = "<p style='color:#856404;font-size:13px;font-weight:bold;margin:0 0 10px;'>⏳ Commandes en attente de confirmation ("+snap.size+")</p>";

        snap.forEach(function(doc) {
          var cmd = doc.data(); cmd.id = doc.id;
          var card = document.createElement("div");
          card.style.cssText = "background:white;border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid #ffc107;";
          var date = cmd.date ? new Date(cmd.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}) : "";
          card.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'><div><p style='color:#3a3a3a;font-size:13px;font-weight:bold;margin:0 0 2px;'>👤 "+cmd.clientNom+"</p><p style='color:#999;font-size:11px;margin:0;'>"+date+"</p></div><p style='color:#c9a86a;font-size:15px;font-weight:bold;margin:0;'>"+cmd.total+"</p></div><p style='color:#555;font-size:12px;margin:0 0 10px;line-height:1.5;'>"+cmd.detail+"</p>";

          var btnRow = document.createElement("div");
          btnRow.style.cssText = "display:flex;gap:8px;";

          var confirmBtn = document.createElement("button");
          confirmBtn.textContent = "✅ Confirmer le paiement reçu";
          confirmBtn.style.cssText = "flex:2;background:#e6f7ec;color:#27AE60;border:1px solid #27AE60;padding:9px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;touch-action:manipulation;";

          var cancelBtn = document.createElement("button");
          cancelBtn.textContent = "❌ Annuler";
          cancelBtn.style.cssText = "flex:1;background:#fee;color:#e74c3c;border:1px solid #e74c3c;padding:9px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;touch-action:manipulation;";

          var doConfirm = (function(cmdData, docId, btnEl) { return function() {
            btnEl.disabled = true; btnEl.textContent = "⏳...";

            // Mettre à jour le statut
            db.collection("commandes_clients").doc(docId).update({ statut: "confirmee" }).then(function() {

              // Mettre à jour les stats
              db.collection("boutiques").doc(user.uid).collection("stats").doc("global").set({
                commandes: firebase.firestore.FieldValue.increment(1),
                chiffreAffaires: firebase.firestore.FieldValue.increment(parseFloat(cmdData.total)||0)
              }, { merge: true }).catch(function(){});

              // Tampon fidélité
              if (cmdData.clientUid) {
                var carteRef = db.collection("fidelite_cartes").doc(cmdData.clientUid + "_" + user.uid);
                carteRef.get().then(function(snap2) {
                  if (snap2.exists) {
                    carteRef.update({ tampons: firebase.firestore.FieldValue.increment(1), updatedAt: new Date().toISOString() });
                  } else {
                    carteRef.set({ clientUid: cmdData.clientUid, clientNom: cmdData.clientNom, clientEmail: cmdData.clientEmail, boutiqueUid: user.uid, tampons: 1, actif: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
                  }
                }).catch(function(){});
              }

              // Email VDI
              db.collection("boutiques").doc(user.uid).get().then(function(bSnap) {
                var b = bSnap.exists ? bSnap.data() : {};
                if (b.emailVdi) {
                  emailjs.send("service_wr9mlhk", "template_nkfnrnd", {
                    vdi_prenom: b.prenom || "Conseillère",
                    to_email: b.emailVdi,
                    client_nom: cmdData.clientNom || "",
                    client_prenom: cmdData.clientNom ? cmdData.clientNom.split(" ")[0] : "",
                    client_adresse: cmdData.adresse || "",
                    client_tel: cmdData.tel || "",
                    client_email: cmdData.clientEmail || "",
                    commande_detail: cmdData.detail || "",
                    total: cmdData.total || ""
                  }).catch(function(){});
                }
              });

              card.style.opacity = "0.5";
              card.innerHTML = "<p style='color:#27AE60;font-size:13px;font-weight:bold;text-align:center;padding:8px;'>✅ Paiement confirmé !</p>";
              setTimeout(function() { card.remove(); if (!header.querySelector("[style*='border:1px solid #ffc107']")) section.remove(); }, 1500);
            });
          }; })(cmd, cmd.id, confirmBtn);

          var doCancel = (function(docId, btnEl) { return function() {
            if (!confirm("Annuler cette commande ?")) return;
            btnEl.disabled = true;
            db.collection("commandes_clients").doc(docId).update({ statut: "annulee" }).then(function() {
              card.style.opacity = "0.5";
              card.innerHTML = "<p style='color:#e74c3c;font-size:13px;text-align:center;padding:8px;'>❌ Commande annulée</p>";
              setTimeout(function() { card.remove(); }, 1500);
            });
          }; })(cmd.id, cancelBtn);

          confirmBtn.onclick = doConfirm;
          confirmBtn.addEventListener("touchend", function(e){e.preventDefault();doConfirm();},{passive:false});
          cancelBtn.onclick = doCancel;
          cancelBtn.addEventListener("touchend", function(e){e.preventDefault();doCancel();},{passive:false});

          btnRow.appendChild(confirmBtn);
          btnRow.appendChild(cancelBtn);
          card.appendChild(btnRow);
          header.appendChild(card);
        });

        section.appendChild(header);

        // Insérer après le titre
        var titreEl = panel.querySelector("p");
        if (titreEl && titreEl.parentNode) {
          titreEl.parentNode.insertBefore(section, titreEl.nextSibling);
        }
      }).catch(function(){});
  }

  init();
  console.log("BAA Commandes Confirmer initialise");
})();
