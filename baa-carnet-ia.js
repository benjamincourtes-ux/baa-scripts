// BAA Carnet IA — Pont Carnet clients → Message IA personnalisé
// S'injecte automatiquement dans le carnet clients

(function() {
  function waitForCarnet() {
    if (!window.baaEventBus) { setTimeout(waitForCarnet, 500); return; }

    // Observer les mutations DOM pour détecter l'ouverture du carnet
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.id === "baa-carnet-panel") {
            // Le carnet vient de s'ouvrir — on attend que les fiches soient chargées
            setTimeout(function() { injecterBoutonsIA(node); }, 1500);
            // Observer aussi les changements dans le carnet (chargement des clientes)
            var carnetObserver = new MutationObserver(function() {
              setTimeout(function() { injecterBoutonsIA(node); }, 500);
            });
            var list = node.querySelector("#carnet-list");
            if (list) carnetObserver.observe(list, { childList: true });
          }
        });
      });
    });
    observer.observe(document.body, { childList: true });
  }

  function injecterBoutonsIA(panel) {
    // Trouver toutes les fiches clientes qui n'ont pas encore le bouton IA
    var cards = panel.querySelectorAll("[id^='vcard-'], .cliente-card, [style*='border-radius:12px']");
    
    // Trouver les boutons d'édition et ajouter le bouton IA à côté
    var editBtns = panel.querySelectorAll("[id^='edit-']");
    editBtns.forEach(function(btn) {
      var cid = btn.id.replace("edit-", "");
      if (document.getElementById("ia-btn-" + cid)) return; // déjà injecté

      var iaBtn = document.createElement("button");
      iaBtn.id = "ia-btn-" + cid;
      iaBtn.textContent = "💬 IA";
      iaBtn.style.cssText = "background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:5px 8px;border-radius:8px;cursor:pointer;font-size:11px;font-weight:bold;touch-action:manipulation;margin-left:4px;";
      
      var doIA = (function(clienteId) {
        return function(e) {
          e.stopPropagation();
          genererMessageIA(clienteId);
        };
      })(cid);
      
      iaBtn.onclick = doIA;
      iaBtn.addEventListener("touchend", function(e) { e.preventDefault(); doIA(e); }, { passive: false });
      btn.parentNode.insertBefore(iaBtn, btn.nextSibling);
    });
  }

  function genererMessageIA(cid) {
    var user = firebase.auth().currentUser; if (!user) return;
    var db = firebase.firestore();

    // Récupérer la fiche cliente depuis Firebase
    db.collection("users").doc(user.uid).collection("clientes").doc(cid).get().then(function(snap) {
      if (!snap.exists) return;
      var c = snap.data();

      // Ouvrir le panneau de génération
      if (document.getElementById("baa-ia-message-panel")) return;
      var panel = document.createElement("div");
      panel.id = "baa-ia-message-panel";
      panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999999;display:flex;justify-content:center;align-items:flex-start;overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:Arial,sans-serif;";
      panel.onclick = function(e) { if (e.target === panel) panel.remove(); };

      var box = document.createElement("div");
      box.style.cssText = "background:#f8f3ee;width:90%;max-width:500px;border-radius:20px;padding:24px;margin:20px auto;";
      box.onclick = function(e) { e.stopPropagation(); };

      box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;'><div><p style='color:#999;font-size:11px;font-weight:bold;margin:0 0 2px;letter-spacing:1px;'>💬 PONT CARNET → IA</p><h3 style='color:#8b735d;font-size:16px;margin:0;'>Message pour " + (c.prenom||"") + " " + (c.nom||"") + "</h3></div><button id='close-ia-msg' style='background:none;border:none;font-size:22px;color:#8b735d;cursor:pointer;'>✕</button></div>" +
        "<div style='background:white;border-radius:12px;padding:14px;margin-bottom:14px;border:1px solid #e8d4b0;font-size:12px;color:#666;'>" +
        "<p style='margin:0 0 4px;font-weight:bold;color:#8b735d;'>Profil de la cliente :</p>" +
        (c.peau ? "<p style='margin:2px 0;'>🧴 Type de peau : " + c.peau + "</p>" : "") +
        (c.produits ? "<p style='margin:2px 0;'>💄 Produits favoris : " + c.produits + "</p>" : "") +
        (c.allergies ? "<p style='margin:2px 0;'>⚠️ Allergies : " + c.allergies + "</p>" : "") +
        (c.notes ? "<p style='margin:2px 0;'>📝 Notes : " + c.notes + "</p>" : "") +
        (!c.peau && !c.produits && !c.allergies && !c.notes ? "<p style='margin:0;color:#999;font-style:italic;'>Fiche incomplète — complète le profil pour un message plus personnalisé</p>" : "") +
        "</div>" +
        "<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 6px;'>🎯 Objectif du message :</p>" +
        "<div id='ia-obj-btns' style='display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;'>" +
        ["Prendre des nouvelles","Proposer un produit","Relancer après achat","Offre spéciale","Anniversaire"].map(function(obj, i) {
          return "<button class='ia-obj-btn' data-obj='" + obj + "' style='padding:7px 12px;border-radius:20px;border:1px solid #e8d4b0;background:" + (i===0?"#c9a86a":"white") + ";color:" + (i===0?"#1a0a00":"#8b735d") + ";font-size:11px;font-weight:bold;cursor:pointer;touch-action:manipulation;'>" + obj + "</button>";
        }).join("") +
        "</div>" +
        "<button id='ia-generer-btn' style='width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:13px;border-radius:12px;font-weight:bold;font-size:14px;cursor:pointer;touch-action:manipulation;margin-bottom:14px;'>🐦‍🔥 Générer le message</button>" +
        "<div id='ia-result' style='display:none;'>" +
        "<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 8px;'>✨ Message généré :</p>" +
        "<div id='ia-msg-text' style='background:white;border:1px solid #e8d4b0;border-radius:10px;padding:14px;font-size:13px;color:#3a3a3a;line-height:1.6;white-space:pre-wrap;margin-bottom:10px;'></div>" +
        "<div style='display:flex;gap:8px;'>" +
        "<button id='ia-copy-btn' style='flex:1;background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:bold;touch-action:manipulation;'>📋 Copier</button>" +
        (c.tel ? "<a id='ia-sms-btn' href='sms:" + c.tel + "' style='flex:1;background:#34C759;color:white;border:none;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:bold;text-decoration:none;text-align:center;display:flex;align-items:center;justify-content:center;'>💬 SMS</a>" : "") +
        (c.tel ? "<a id='ia-wa-btn' href='https://wa.me/33" + c.tel.replace(/^0/, "").replace(/\s/g,"") + "' target='_blank' style='flex:1;background:#25D366;color:white;border:none;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:bold;text-decoration:none;text-align:center;display:flex;align-items:center;justify-content:center;'>WhatsApp</a>" : "") +
        "</div>" +
        "<button id='ia-regen-btn' style='width:100%;margin-top:8px;background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;touch-action:manipulation;'>🔄 Régénérer</button>" +
        "</div>";

      panel.appendChild(box);
      document.body.appendChild(panel);

      document.getElementById("close-ia-msg").onclick = function() { panel.remove(); };

      var objSel = "Prendre des nouvelles";
      box.querySelectorAll(".ia-obj-btn").forEach(function(btn) {
        btn.onclick = function() {
          objSel = btn.getAttribute("data-obj");
          box.querySelectorAll(".ia-obj-btn").forEach(function(b) { b.style.background="white"; b.style.color="#8b735d"; });
          btn.style.background="#c9a86a"; btn.style.color="#1a0a00";
        };
        btn.addEventListener("touchend", function(e) { e.preventDefault(); btn.onclick(); }, { passive: false });
      });

      var doGenerer = function() {
        document.getElementById("ia-generer-btn").disabled = true;
        document.getElementById("ia-generer-btn").textContent = "⏳ Génération...";
        document.getElementById("ia-result").style.display = "none";

        // Récupérer la clé API
        db.collection("config").doc("assistant").get().then(function(configSnap) {
          var apiKey = configSnap.exists ? configSnap.data().apiKey || "" : "";
          if (!apiKey) {
            document.getElementById("ia-generer-btn").disabled = false;
            document.getElementById("ia-generer-btn").textContent = "🐦‍🔥 Générer le message";
            alert("Clé API non configurée.");
            return;
          }

          var prompt = "Tu es une conseillère beauté Mihi qui envoie un message WhatsApp/SMS à une cliente.\n\n";
          prompt += "Objectif : " + objSel + "\n";
          prompt += "Prénom de la cliente : " + (c.prenom || "ma cliente") + "\n";
          if (c.peau) prompt += "Type de peau : " + c.peau + "\n";
          if (c.produits) prompt += "Produits favoris : " + c.produits + "\n";
          if (c.allergies) prompt += "Allergies : " + c.allergies + "\n";
          if (c.notes) prompt += "Notes personnelles : " + c.notes + "\n";
          prompt += "\nRègles :\n- Message court (3-5 lignes max)\n- Ton chaleureux et personnel\n- Utilise le prénom de la cliente\n- Naturel, pas commercial\n- Pas de guillemets autour du message\n- Commence directement par le message";

          fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
              "anthropic-dangerous-direct-browser-access": "true"
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-6",
              max_tokens: 300,
              messages: [{ role: "user", content: prompt }]
            })
          }).then(function(r) { return r.json(); }).then(function(data) {
            var texte = data.content && data.content[0] ? data.content[0].text : "";
            if (!texte) { document.getElementById("ia-generer-btn").disabled = false; document.getElementById("ia-generer-btn").textContent = "🐦‍🔥 Générer le message"; return; }

            document.getElementById("ia-msg-text").textContent = texte;
            document.getElementById("ia-result").style.display = "block";
            document.getElementById("ia-generer-btn").disabled = false;
            document.getElementById("ia-generer-btn").textContent = "🐦‍🔥 Générer le message";

            // Mettre à jour le lien WhatsApp avec le message pré-rempli
            var waBtn = document.getElementById("ia-wa-btn");
            if (waBtn && c.tel) {
              waBtn.href = "https://wa.me/33" + c.tel.replace(/^0/, "").replace(/\s/g,"") + "?text=" + encodeURIComponent(texte);
            }
            var smsBtn = document.getElementById("ia-sms-btn");
            if (smsBtn && c.tel) {
              smsBtn.href = "sms:" + c.tel + "?body=" + encodeURIComponent(texte);
            }

            // Copier
            var copyBtn = document.getElementById("ia-copy-btn");
            if (copyBtn) {
              copyBtn.onclick = function() {
                navigator.clipboard && navigator.clipboard.writeText(texte).then(function() {
                  copyBtn.textContent = "✅ Copié !";
                  setTimeout(function() { copyBtn.textContent = "📋 Copier"; }, 2000);
                });
              };
            }

            // Régénérer
            document.getElementById("ia-regen-btn").onclick = doGenerer;
            document.getElementById("ia-regen-btn").addEventListener("touchend", function(e) { e.preventDefault(); doGenerer(); }, { passive: false });

          }).catch(function() {
            document.getElementById("ia-generer-btn").disabled = false;
            document.getElementById("ia-generer-btn").textContent = "🐦‍🔥 Générer le message";
          });
        });
      };

      document.getElementById("ia-generer-btn").onclick = doGenerer;
      document.getElementById("ia-generer-btn").addEventListener("touchend", function(e) { e.preventDefault(); doGenerer(); }, { passive: false });

    }).catch(function(e) { console.log("Erreur fiche cliente:", e); });
  }

  waitForCarnet();
  console.log("✅ BAA Carnet IA initialisé");
})();
