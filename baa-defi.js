function initDefiEclair() {
  if (window.__baaDefiInitialized) return;
  window.__baaDefiInitialized = true;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;
  if (!uid) return;

  function verifierDefiActif() {
    var now = new Date().getTime();
    db.collection("defis").where("actif", "==", true).get().then(function(snap) {
      var menuBtn = document.getElementById("baa-menu-btn");
      var existingDefiBtn = document.getElementById("menu-defi-btn");
      if (snap.empty) {
        if (existingDefiBtn) existingDefiBtn.remove();
        return;
      }
      snap.forEach(function(docSnap) {
        var defi = docSnap.data(); var did = docSnap.id;
        var expiration = defi.expiration ? defi.expiration.toMillis() : 0;
        if (now > expiration) {
          db.collection("defis").doc(did).update({ actif: false });
          if (existingDefiBtn) existingDefiBtn.remove();
          return;
        }
        if (!existingDefiBtn && menuBtn) {
          var btn = document.createElement("div");
          btn.id = "menu-defi-btn";
          btn.style.cssText = "position:fixed;bottom:76px;right:20px;z-index:99999;background:linear-gradient(135deg,#ff6b35,#f7931e);color:white;border-radius:24px;padding:10px 18px;cursor:pointer;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;box-shadow:0 4px 15px rgba(255,107,53,0.4);display:flex;align-items:center;gap:8px;animation:defi-pulse 2s infinite;";
          btn.innerHTML = "&#9889; Defi Eclair en cours !";
          btn.onclick = function() { ouvrirDefi(docSnap.id, defi); };
          document.body.appendChild(btn);
          if (!document.getElementById("defi-pulse-style")) {
            var style = document.createElement("style");
            style.id = "defi-pulse-style";
            style.innerHTML = "@keyframes defi-pulse { 0%,100%{box-shadow:0 4px 15px rgba(255,107,53,0.4);} 50%{box-shadow:0 4px 25px rgba(255,107,53,0.8);transform:scale(1.03);} }";
            document.head.appendChild(style);
          }
          // Popup automatique si pas encore répondu
          db.collection("defis").doc(did).collection("reponses").doc(uid).get().then(function(repSnap) {
            if (!repSnap.exists) { ouvrirDefi(did, defi); }
          });
        }
      });
    }).catch(function(){});
  }

  function ouvrirDefi(did, defi) {
    if (document.getElementById("baa-defi-panel")) return;
    var now = new Date().getTime();
    var expiration = defi.expiration ? defi.expiration.toMillis() : 0;
    var restant = Math.max(0, expiration - now);
    var heures = Math.floor(restant / 3600000);
    var minutes = Math.floor((restant % 3600000) / 60000);
    var panel = document.createElement("div"); panel.id = "baa-defi-panel";
    panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999999;display:flex;justify-content:center;align-items:center;padding:20px;";
    var box = document.createElement("div");
    box.style.cssText = "background:white;width:90%;max-width:500px;border-radius:20px;overflow:hidden;font-family:Arial,sans-serif;max-height:90vh;overflow-y:auto;";
    box.innerHTML = "<div style='background:linear-gradient(135deg,#ff6b35,#f7931e);padding:24px;text-align:center;position:relative;'><span onclick='document.getElementById(\"baa-defi-panel\").remove()' style='position:absolute;top:12px;right:16px;cursor:pointer;color:white;font-size:22px;opacity:0.8;'>&#10005;</span><div style='font-size:48px;'>&#9889;</div><h2 style='color:white;margin:8px 0 4px;font-size:20px;'>Defi Eclair !</h2><p style='color:rgba(255,255,255,0.9);margin:0;font-size:13px;'>&#128336; " + (restant > 0 ? "Il reste " + heures + "h " + minutes + "min" : "Expire") + "</p></div><div style='padding:24px;'><h3 style='color:#3a3a3a;margin:0 0 10px;font-size:16px;'>" + defi.titre + "</h3><p style='color:#666;font-size:14px;line-height:1.5;margin-bottom:20px;'>" + defi.description + "</p><div id='defi-contenu'></div></div>";
    panel.appendChild(box); document.body.appendChild(panel);
    panel.onclick = function(e) { if (e.target === panel) { panel.remove(); } };

    db.collection("defis").doc(did).collection("reponses").doc(uid).get().then(function(repSnap) {
      var contenu = document.getElementById("defi-contenu"); if (!contenu) return;
      if (!repSnap.exists || repSnap.data().statut === "non") {
        // Pas encore répondu ou refusé
        contenu.innerHTML = "<div style='display:flex;gap:10px;'><button id='defi-oui' style='flex:1;background:linear-gradient(135deg,#ff6b35,#f7931e);color:white;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;'>&#9889; Je participe !</button><button id='defi-non' style='flex:1;background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:14px;border-radius:12px;cursor:pointer;font-size:14px;'>Pas cette fois</button></div>";
        document.getElementById("defi-oui").onclick = function() {
          db.collection("defis").doc(did).collection("reponses").doc(uid).set({ statut: "oui", createdAt: firebase.firestore.FieldValue.serverTimestamp() }).then(function() { afficherZonePreuve(did, defi, contenu, repSnap.data()); });
        };
        document.getElementById("defi-non").onclick = function() {
          db.collection("defis").doc(did).collection("reponses").doc(uid).set({ statut: "non", createdAt: firebase.firestore.FieldValue.serverTimestamp() }).then(function() { panel.remove(); });
        };
      } else if (repSnap.data().statut === "oui") {
        afficherZonePreuve(did, defi, contenu, repSnap.data());
      }
    });
  }

  function afficherZonePreuve(did, defi, contenu, repData) {
    var aDejaProuve = repData && repData.preuve;
    if (aDejaProuve) {
      contenu.innerHTML = "<div style='background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:16px;text-align:center;'><div style='font-size:32px;'>&#127881;</div><p style='color:#16a34a;font-weight:bold;margin:8px 0;'>Preuve deposee !</p><p style='color:#666;font-size:13px;margin:0;'>" + (repData.texte || "") + "</p>" + (repData.imageURL ? "<img src='" + repData.imageURL + "' style='width:100%;border-radius:8px;margin-top:10px;max-height:200px;object-fit:cover;' />" : "") + "</div><button onclick='document.getElementById(\"baa-defi-panel\").remove()' style='width:100%;margin-top:12px;background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:12px;border-radius:10px;cursor:pointer;font-size:14px;'>Fermer</button>";
      return;
    }
    contenu.innerHTML = "<div style='background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:14px;margin-bottom:16px;'><p style='color:#c2410c;font-weight:bold;margin:0 0 4px;font-size:13px;'>&#9989; Tu participes ! Depose ta preuve :</p></div><textarea id='defi-texte' placeholder='Decris ta preuve...' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;height:70px;resize:vertical;font-family:Arial,sans-serif;margin-bottom:10px;'></textarea><div style='display:flex;gap:10px;align-items:center;margin-bottom:14px;'><label style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>&#128247; Photo<input type='file' id='defi-photo' accept='image/*' style='display:none;' /></label><span id='defi-photo-name' style='color:#999;font-size:12px;'></span></div><button id='defi-soumettre' style='width:100%;background:linear-gradient(135deg,#ff6b35,#f7931e);color:white;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;'>Soumettre ma preuve &#128293;</button><div id='defi-msg' style='text-align:center;font-size:13px;color:#8b735d;margin-top:8px;'></div>";
    document.getElementById("defi-photo").onchange = function() {
      document.getElementById("defi-photo-name").innerText = this.files[0] ? this.files[0].name : "";
    };
    document.getElementById("defi-soumettre").onclick = async function() {
      var texte = document.getElementById("defi-texte").value.trim();
      var photoFile = document.getElementById("defi-photo").files[0];
      var msg = document.getElementById("defi-msg");
      if (!texte && !photoFile) { msg.innerText = "Ajoute un texte ou une photo !"; return; }
      msg.innerText = "Envoi en cours..."; this.disabled = true;
      var imageURL = null;
      if (photoFile) {
        try {
          var fd = new FormData(); fd.append("file", photoFile); fd.append("upload_preset", "baa_avatars"); fd.append("folder", "defis");
          var r = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload", { method: "POST", body: fd });
          imageURL = (await r.json()).secure_url;
        } catch(e) { msg.innerText = "Erreur photo."; this.disabled = false; return; }
      }
      db.collection("defis").doc(did).collection("reponses").doc(uid).update({
        texte: texte, imageURL: imageURL, preuve: true,
        preuveAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(function() {
        msg.innerText = ""; 
        contenu.innerHTML = "<div style='background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:16px;text-align:center;'><div style='font-size:32px;'>&#127881;</div><p style='color:#16a34a;font-weight:bold;margin:8px 0;'>Bravo ! Preuve deposee !</p></div><button onclick='document.getElementById(\"baa-defi-panel\").remove()' style='width:100%;margin-top:12px;background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:12px;border-radius:10px;cursor:pointer;font-size:14px;'>Fermer</button>";
      }).catch(function(e) { msg.innerText = "Erreur. Reessaie."; document.getElementById("defi-soumettre").disabled = false; });
    };
  }

  verifierDefiActif();
  setInterval(verifierDefiActif, 60000);
}

if (window.__baaLoginInitialized) { initDefiEclair(); }
else { var defiCheckInterval = setInterval(function() { if (window.__baaLoginInitialized && firebase.auth().currentUser) { clearInterval(defiCheckInterval); initDefiEclair(); } }, 1000); }
