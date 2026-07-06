// BAA Boutique — Gestion boutique VDI

function openGestionBoutique() {
  if (document.getElementById("baa-boutique-panel")) return;

  var panel = document.createElement("div");
  panel.id = "baa-boutique-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding:20px 16px;overflow-y:auto;font-family:Arial,sans-serif;";
  document.body.appendChild(panel);

  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:100%;max-width:560px;border-radius:20px;padding:24px;";
  panel.appendChild(box);

  var state = { step:"menu", boutique:null };

  // Charger la boutique depuis Firebase
  function chargerBoutique(cb) {
    var user = firebase.auth().currentUser;
    if (!user) { cb(null); return; }
    firebase.firestore().collection("boutiques").doc(user.uid).get().then(function(snap) {
      cb(snap.exists ? snap.data() : { prenom:"", paypal:"", produits:[], actif:false });
    }).catch(function() { cb({ prenom:"", paypal:"", produits:[], actif:false }); });
  }

  function sauvegarderBoutique(data, cb) {
    var user = firebase.auth().currentUser;
    if (!user) return;
    data.uid = user.uid;
    data.updatedAt = new Date().toISOString();
    firebase.firestore().collection("boutiques").doc(user.uid).set(data).then(cb).catch(cb);
  }

  function render() {
    box.innerHTML = "";
    var hdr = document.createElement("div");
    hdr.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;";
    hdr.innerHTML = "<div><h2 style='color:#8b735d;margin:0;font-size:17px;'>🏪 Ma Boutique</h2><p style='color:#999;font-size:12px;margin:4px 0 0;'>Gérez votre vitrine personnalisée</p></div>";
    var closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = "background:none;border:none;font-size:22px;color:#8b735d;cursor:pointer;";
    closeBtn.onclick = function() { panel.remove(); if (typeof window.__baaOpenOutilsPanel === "function") window.__baaOpenOutilsPanel(); };
    hdr.appendChild(closeBtn);
    box.appendChild(hdr);

    if (state.step === "menu") renderMenu();
    else if (state.step === "config") renderConfig();
    else if (state.step === "produits") renderProduits();
    else if (state.step === "lien") renderLien();
  }

  function renderMenu() {
    chargerBoutique(function(b) {
      state.boutique = b;

      // Statut boutique
      var statusDiv = document.createElement("div");
      statusDiv.style.cssText = "background:" + (b.actif ? "#e6f7ec" : "#fff8e6") + ";border-radius:12px;padding:14px;margin-bottom:16px;text-align:center;";
      statusDiv.innerHTML = "<p style='color:" + (b.actif ? "#1e8449" : "#8a6a35") + ";font-weight:bold;font-size:15px;margin:0 0 4px;'>" + (b.actif ? "✅ Boutique active" : "⚠️ Boutique non configurée") + "</p><p style='color:#666;font-size:12px;margin:0;'>" + (b.actif ? b.produits.length + " produit(s) en vitrine" : "Configurez votre boutique pour commencer") + "</p>";
      box.appendChild(statusDiv);

      var btns = [
        { icon:"⚙️", label:"Configurer ma boutique", sub:"Nom, PayPal, paramètres", step:"config" },
        { icon:"🛍️", label:"Gérer mes produits", sub:"Choisir quoi afficher", step:"produits" },
        { icon:"🔗", label:"Mon lien boutique", sub:"Partager avec mes clientes", step:"lien" },
      ];

      btns.forEach(function(btn) {
        var b2 = document.createElement("button");
        b2.style.cssText = "width:100%;background:white;border:1px solid #e8d4b0;border-radius:12px;padding:14px 16px;cursor:pointer;text-align:left;margin-bottom:10px;display:flex;align-items:center;gap:14px;touch-action:manipulation;";
        b2.innerHTML = "<span style='font-size:24px;'>" + btn.icon + "</span><div><p style='color:#3a3a3a;font-size:14px;font-weight:bold;margin:0 0 2px;'>" + btn.label + "</p><p style='color:#999;font-size:12px;margin:0;'>" + btn.sub + "</p></div>";
        b2.onclick = function() { state.step = btn.step; render(); };
        box.appendChild(b2);
      });
    });
  }

  function renderConfig() {
    chargerBoutique(function(b) {
      state.boutique = b;
      var titre = document.createElement("p"); titre.style.cssText = "color:#8b735d;font-size:15px;font-weight:bold;margin:0 0 16px;"; titre.textContent = "⚙️ Configuration de ta boutique"; box.appendChild(titre);

      var inp1 = document.createElement("input"); inp1.placeholder = "Ton prénom (affiché sur la boutique) *"; inp1.value = b.prenom || "";
      inp1.style.cssText = "width:100%;padding:12px;border:1px solid #e8d4b0;border-radius:10px;font-size:14px;box-sizing:border-box;margin-bottom:10px;";
      box.appendChild(inp1);

      var inp2 = document.createElement("input"); inp2.placeholder = "Ton lien PayPal.me (ex: paypal.me/tonnom) *"; inp2.value = b.paypal || "";
      inp2.style.cssText = "width:100%;padding:12px;border:1px solid #e8d4b0;border-radius:10px;font-size:14px;box-sizing:border-box;margin-bottom:10px;";
      box.appendChild(inp2);

      var inp3 = document.createElement("input"); inp3.placeholder = "Message d'accueil de ta boutique"; inp3.value = b.message || "Bienvenue dans ma boutique Mihi ! 🌿";
      inp3.style.cssText = "width:100%;padding:12px;border:1px solid #e8d4b0;border-radius:10px;font-size:14px;box-sizing:border-box;margin-bottom:16px;";
      box.appendChild(inp3);

      var info = document.createElement("div"); info.style.cssText = "background:#f0f4ff;border-radius:10px;padding:12px;margin-bottom:16px;";
      info.innerHTML = "<p style='color:#2980B9;font-size:12px;margin:0;'>💡 Pour créer un lien PayPal.me, va sur <strong>paypal.me</strong> et crée ton lien personnalisé gratuit.</p>";
      box.appendChild(info);

      var saveBtn = document.createElement("button");
      saveBtn.textContent = "💾 Sauvegarder";
      saveBtn.style.cssText = "width:100%;background:#c9a86a;color:#1a0a00;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;margin-bottom:10px;touch-action:manipulation;";
      saveBtn.onclick = function() {
        if (!inp1.value || !inp2.value) { alert("Merci de remplir ton prénom et ton lien PayPal."); return; }
        var paypalLink = inp2.value.trim();
        if (!paypalLink.startsWith("http")) paypalLink = "https://" + paypalLink;
        b.prenom = inp1.value.trim();
        b.paypal = paypalLink;
        b.message = inp3.value.trim();
        b.actif = true;
        sauvegarderBoutique(b, function() {
          alert("✅ Configuration sauvegardée !");
          state.step = "menu"; render();
        });
      };
      box.appendChild(saveBtn);

      var back = document.createElement("button"); back.textContent = "← Retour"; back.style.cssText = "background:none;border:none;color:#8b735d;font-size:13px;cursor:pointer;width:100%;";
      back.onclick = function() { state.step = "menu"; render(); }; box.appendChild(back);
    });
  }

  function renderProduits() {
    chargerBoutique(function(b) {
      state.boutique = b;
      var produitsSel = b.produits || [];

      var titre = document.createElement("p"); titre.style.cssText = "color:#8b735d;font-size:15px;font-weight:bold;margin:0 0 6px;"; titre.textContent = "🛍️ Choisir mes produits"; box.appendChild(titre);
      var sub = document.createElement("p"); sub.style.cssText = "color:#999;font-size:12px;margin:0 0 16px;"; sub.textContent = produitsSel.length + " produit(s) sélectionné(s)"; box.appendChild(sub);

      Object.keys(BAA_PRODUITS_MIHI).forEach(function(cat) {
        var catData = BAA_PRODUITS_MIHI[cat];
        var catDiv = document.createElement("div"); catDiv.style.cssText = "margin-bottom:12px;";

        var catHeader = document.createElement("button");
        catHeader.style.cssText = "width:100%;background:#f3e7d3;border:1px solid #e8d4b0;border-radius:10px;padding:10px 14px;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;touch-action:manipulation;";
        catHeader.innerHTML = "<span style='color:#8b735d;font-size:13px;font-weight:bold;'>" + catData.label + "</span><span style='color:#c9a86a;font-size:12px;'>" + catData.produits.filter(function(p){ return produitsSel.includes(p.ref); }).length + "/" + catData.produits.length + "</span>";

        var catContent = document.createElement("div");
        catContent.style.cssText = "display:none;background:white;border:1px solid #e8d4b0;border-top:none;border-radius:0 0 10px 10px;";

        catHeader.onclick = function() {
          catContent.style.display = catContent.style.display === "none" ? "block" : "none";
          catHeader.style.borderRadius = catContent.style.display === "none" ? "10px" : "10px 10px 0 0";
        };

        catData.produits.forEach(function(prod) {
          var pDiv = document.createElement("div"); pDiv.style.cssText = "display:flex;align-items:center;padding:10px 14px;border-bottom:1px solid #f0e6d3;cursor:pointer;touch-action:manipulation;";
          var checked = produitsSel.includes(prod.ref);
          pDiv.innerHTML = "<div style='width:20px;height:20px;border-radius:4px;border:2px solid " + (checked?"#c9a86a":"#ddd") + ";background:" + (checked?"#c9a86a":"white") + ";margin-right:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;'>" + (checked?"<span style='color:white;font-size:12px;'>✓</span>":"") + "</div><div style='flex:1;'><p style='color:#3a3a3a;font-size:13px;margin:0 0 1px;'>" + prod.nom + "</p><p style='color:#c9a86a;font-size:12px;font-weight:bold;margin:0;'>" + prod.prix.toFixed(2) + " €</p></div>";
          pDiv.onclick = function() {
            var idx = produitsSel.indexOf(prod.ref);
            if (idx >= 0) produitsSel.splice(idx, 1);
            else produitsSel.push(prod.ref);
            b.produits = produitsSel;
            sauvegarderBoutique(b, function() { renderProduits(); });
          };
          catContent.appendChild(pDiv);
        });

        catDiv.appendChild(catHeader);
        catDiv.appendChild(catContent);
        box.appendChild(catDiv);
      });

      var back = document.createElement("button"); back.textContent = "← Retour"; back.style.cssText = "background:none;border:none;color:#8b735d;font-size:13px;cursor:pointer;width:100%;margin-top:12px;";
      back.onclick = function() { state.step = "menu"; render(); }; box.appendChild(back);
    });
  }

  function renderLien() {
    var user = firebase.auth().currentUser;
    if (!user) return;
    var lien = "https://academie-beauty-addict.super.site/boutique?uid=" + user.uid;

    var titre = document.createElement("p"); titre.style.cssText = "color:#8b735d;font-size:15px;font-weight:bold;margin:0 0 16px;"; titre.textContent = "🔗 Mon lien boutique"; box.appendChild(titre);

    var lienBox = document.createElement("div"); lienBox.style.cssText = "background:white;border:2px solid #c9a86a;border-radius:12px;padding:16px;margin-bottom:16px;word-break:break-all;";
    lienBox.innerHTML = "<p style='color:#999;font-size:11px;margin:0 0 6px;'>TON LIEN PERSONNEL</p><p style='color:#3a3a3a;font-size:13px;margin:0;'>" + lien + "</p>";
    box.appendChild(lienBox);

    var copyBtn = document.createElement("button");
    copyBtn.textContent = "📋 Copier le lien";
    copyBtn.style.cssText = "width:100%;background:#c9a86a;color:#1a0a00;border:none;padding:13px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:14px;margin-bottom:10px;touch-action:manipulation;";
    copyBtn.onclick = function() {
      if (navigator.clipboard) navigator.clipboard.writeText(lien).then(function() { copyBtn.textContent = "✅ Copié !"; setTimeout(function(){ copyBtn.textContent = "📋 Copier le lien"; }, 2000); });
    };
    box.appendChild(copyBtn);

    var shareBtn = document.createElement("button");
    shareBtn.textContent = "📤 Partager";
    shareBtn.style.cssText = "width:100%;background:white;color:#8b735d;border:1px solid #e8d4b0;padding:13px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:14px;margin-bottom:16px;touch-action:manipulation;";
    shareBtn.onclick = function() {
      if (navigator.share) navigator.share({ title:"Ma boutique Mihi", text:"Découvrez mes produits Mihi naturels ✨", url:lien });
    };
    box.appendChild(shareBtn);

    var info = document.createElement("div"); info.style.cssText = "background:#f0f4ff;border-radius:10px;padding:12px;margin-bottom:16px;";
    info.innerHTML = "<p style='color:#2980B9;font-size:12px;margin:0;'>💡 Partage ce lien à tes clientes par Messenger, WhatsApp ou email. Elles pourront parcourir ta boutique et commander directement !</p>";
    box.appendChild(info);

    var back = document.createElement("button"); back.textContent = "← Retour"; back.style.cssText = "background:none;border:none;color:#8b735d;font-size:13px;cursor:pointer;width:100%;";
    back.onclick = function() { state.step = "menu"; render(); }; box.appendChild(back);
  }

  render();
}

window.openGestionBoutique = openGestionBoutique;
