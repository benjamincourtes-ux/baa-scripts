// BAA CRM Auto — Phase 3 : Automatisation CRM
// Anniversaires, clientes inactives, rappels réachat

(function() {
  function initCRMAuto() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(initCRMAuto, 300); return; }
    var auth = firebase.auth();
    var db = firebase.firestore();

    auth.onAuthStateChanged(function(user) {
      if (!user) return;
      // Lancer l'analyse CRM après 12 secondes (après coach IA)
      setTimeout(function() { analyserCRM(user.uid, db); }, 12000);
    });
  }

  function analyserCRM(uid, db) {
    // Une fois par jour max
    var today = new Date().toDateString();
    if (localStorage.getItem("baa-crm-date") === today) return;

    var now = new Date();
    var alertes = [];

    db.collection("users").doc(uid).collection("clientes").get().then(function(snap) {
      if (snap.empty) return;

      snap.forEach(function(docSnap) {
        var c = docSnap.data();
        var cid = docSnap.id;

        // 🎂 Anniversaire dans les 3 prochains jours
        if (c.anniversaire) {
          var anniv = new Date(c.anniversaire);
          var annivCetteAnnee = new Date(now.getFullYear(), anniv.getMonth(), anniv.getDate());
          if (annivCetteAnnee < now) annivCetteAnnee.setFullYear(now.getFullYear() + 1);
          var joursAvantAnniv = Math.floor((annivCetteAnnee - now) / (1000 * 60 * 60 * 24));
          if (joursAvantAnniv <= 3 && joursAvantAnniv >= 0) {
            alertes.push({
              type: "anniversaire",
              priorite: 1,
              prenom: c.prenom || "ta cliente",
              nom: c.nom || "",
              tel: c.tel || "",
              email: c.email || "",
              message: "🎂 Anniversaire de "+c.prenom+" "+c.nom+" dans "+joursAvantAnniv+" jour"+(joursAvantAnniv>1?"s":"")+" !",
              cid: cid,
              data: c,
              action: "Envoie-lui un message de félicitations avec une petite offre spéciale 🎁"
            });
          }
        }

        // 👥 Cliente inactive depuis 30 jours
        if (c.derniereCommande) {
          var parts = c.derniereCommande.split("/");
          var dateCmd = parts.length === 3 ? new Date(parts[2], parts[1]-1, parts[0]) : new Date(c.derniereCommande);
          var joursInactive = Math.floor((now - dateCmd) / (1000 * 60 * 60 * 24));
          if (joursInactive >= 30 && joursInactive <= 90) {
            alertes.push({
              type: "inactive",
              priorite: 2,
              prenom: c.prenom || "ta cliente",
              nom: c.nom || "",
              tel: c.tel || "",
              cid: cid,
              data: c,
              message: "😴 "+c.prenom+" "+c.nom+" n'a pas commandé depuis "+joursInactive+" jours",
              action: "Un message personnalisé peut la relancer facilement !"
            });
          }
        }
      });

      // Trier par priorité et afficher les alertes importantes
      alertes.sort(function(a, b) { return a.priorite - b.priorite; });

      if (alertes.length > 0) {
        localStorage.setItem("baa-crm-date", today);
        // Afficher la première alerte après 2 secondes
        setTimeout(function() { afficherAlerteCRM(alertes, 0, uid, db); }, 2000);
      }
    });
  }

  function afficherAlerteCRM(alertes, index, uid, db) {
    if (index >= alertes.length) return;
    if (document.getElementById("baa-crm-panel")) return;

    var a = alertes[index];
    var panel = document.createElement("div");
    panel.id = "baa-crm-panel";
    panel.style.cssText = "position:fixed;bottom:140px;right:16px;z-index:9999999;max-width:300px;font-family:Arial,sans-serif;animation:phenixFadeIn 0.4s ease;";

    var couleur = a.type === "anniversaire" ? "#e74c3c" : "#c9a86a";
    var emoji = a.type === "anniversaire" ? "🎂" : "💤";

    panel.innerHTML = "<div style='background:white;border:2px solid "+couleur+";border-radius:16px;padding:14px;box-shadow:0 8px 30px rgba(0,0,0,0.2);position:relative;'>" +
      "<button id='close-crm' style='position:absolute;top:-8px;right:-8px;background:"+couleur+";color:white;border:none;border-radius:50%;width:22px;height:22px;font-size:11px;cursor:pointer;'>✕</button>" +
      "<p style='color:"+couleur+";font-size:10px;font-weight:bold;margin:0 0 6px;letter-spacing:1px;'>"+emoji+" ALERTE CRM</p>" +
      "<p style='color:#3a3a3a;font-size:13px;font-weight:bold;margin:0 0 4px;'>"+a.message+"</p>" +
      "<p style='color:#666;font-size:11px;margin:0 0 10px;'>"+a.action+"</p>" +
      "<div style='display:flex;gap:6px;flex-wrap:wrap;'>" +
      "<button id='crm-msg-ia' style='flex:1;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:8px;border-radius:8px;font-size:11px;font-weight:bold;cursor:pointer;touch-action:manipulation;'>💬 Message IA</button>" +
      (a.tel ? "<a href='sms:"+a.tel+"' style='flex:1;background:#34C759;color:white;padding:8px;border-radius:8px;font-size:11px;font-weight:bold;text-decoration:none;text-align:center;display:flex;align-items:center;justify-content:center;'>SMS</a>" : "") +
      (alertes.length > index + 1 ? "<button id='crm-suivant' style='background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:8px;border-radius:8px;font-size:11px;cursor:pointer;touch-action:manipulation;'>Suivant ›</button>" : "") +
      "</div>" +
      (alertes.length > 1 ? "<p style='color:#999;font-size:10px;margin:6px 0 0;text-align:center;'>" + (index+1) + "/" + alertes.length + " alertes</p>" : "") +
      "</div>";

    document.body.appendChild(panel);

    document.getElementById("close-crm").onclick = function() { panel.remove(); };

    document.getElementById("crm-msg-ia").onclick = function() {
      panel.remove();
      genererMessageCRM(a, uid, db);
    };
    document.getElementById("crm-msg-ia").addEventListener("touchend", function(e){e.preventDefault();panel.remove();genererMessageCRM(a,uid,db);},{passive:false});

    if (alertes.length > index + 1) {
      document.getElementById("crm-suivant").onclick = function() {
        panel.remove();
        setTimeout(function() { afficherAlerteCRM(alertes, index + 1, uid, db); }, 300);
      };
    }

    // Auto-fermeture après 20 secondes
    setTimeout(function() {
      if (panel.parentNode) { panel.style.opacity="0"; panel.style.transition="opacity 0.5s"; setTimeout(function(){panel.remove();},500); }
    }, 20000);
  }

  function genererMessageCRM(alerte, uid, db) {
    var c = alerte.data;
    db.collection("config").doc("assistant").get().then(function(configSnap) {
      var apiKey = configSnap.exists ? configSnap.data().apiKey || "" : "";
      if (!apiKey) { alert("Clé API non configurée."); return; }

      var prompt = "Tu es une conseillère beauté Mihi qui envoie un message WhatsApp/SMS à une cliente.\n\n";
      if (alerte.type === "anniversaire") {
        prompt += "Objectif : Souhaiter l'anniversaire avec chaleur et proposer une petite attention\n";
      } else {
        prompt += "Objectif : Reprendre contact avec une cliente inactive de manière naturelle\n";
      }
      prompt += "Prénom de la cliente : " + (c.prenom || "ma cliente") + "\n";
      if (c.peau) prompt += "Type de peau : " + c.peau + "\n";
      if (c.produits) prompt += "Produits favoris : " + c.produits + "\n";
      if (c.notes) prompt += "Notes : " + c.notes + "\n";
      prompt += "\nRègles :\n- Message court (3-4 lignes)\n- Très personnel et chaleureux\n- Utilise le prénom\n- Pas commercial\n- Commence directement par le message";

      // Afficher un panneau de chargement
      var loadPanel = document.createElement("div");
      loadPanel.id = "baa-crm-load";
      loadPanel.style.cssText = "position:fixed;bottom:140px;right:16px;z-index:9999999;background:white;border:2px solid #c9a86a;border-radius:16px;padding:16px;font-family:Arial,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,0.2);max-width:300px;text-align:center;";
      loadPanel.innerHTML = "<p style='color:#8b735d;font-size:13px;margin:0;'>🐦‍🔥 Phénix rédige le message...</p>";
      document.body.appendChild(loadPanel);

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
          max_tokens: 200,
          messages: [{ role: "user", content: prompt }]
        })
      }).then(function(r) { return r.json(); }).then(function(data) {
        loadPanel.remove();
        var texte = data.content && data.content[0] ? data.content[0].text : "";
        if (!texte) return;
        afficherMessageGenere(texte, c);
      }).catch(function() { loadPanel.remove(); });
    });
  }

  function afficherMessageGenere(texte, c) {
    var panel = document.createElement("div");
    panel.id = "baa-crm-result";
    panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999999;display:flex;justify-content:center;align-items:center;padding:20px;font-family:Arial,sans-serif;";
    panel.onclick = function(e) { if (e.target===panel) panel.remove(); };

    panel.innerHTML = "<div style='background:#f8f3ee;width:90%;max-width:480px;border-radius:20px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,0.3);'>" +
      "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;'>" +
      "<p style='color:#8b735d;font-size:14px;font-weight:bold;margin:0;'>💬 Message pour "+c.prenom+"</p>" +
      "<button id='close-crm-result' style='background:none;border:none;font-size:20px;color:#8b735d;cursor:pointer;'>✕</button>" +
      "</div>" +
      "<div style='background:white;border:1px solid #e8d4b0;border-radius:10px;padding:14px;font-size:13px;color:#3a3a3a;line-height:1.6;white-space:pre-wrap;margin-bottom:12px;'>"+texte+"</div>" +
      "<div style='display:flex;gap:8px;flex-wrap:wrap;'>" +
      "<button id='crm-copy' style='flex:1;background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:10px;border-radius:10px;font-size:13px;font-weight:bold;cursor:pointer;touch-action:manipulation;'>📋 Copier</button>" +
      (c.tel ? "<a href='sms:"+c.tel+"?body="+encodeURIComponent(texte)+"' style='flex:1;background:#34C759;color:white;padding:10px;border-radius:10px;font-size:13px;font-weight:bold;text-decoration:none;text-align:center;display:flex;align-items:center;justify-content:center;'>💬 SMS</a>" : "") +
      (c.tel ? "<a href='https://wa.me/33"+c.tel.replace(/^0/,"").replace(/\s/g,"")+"?text="+encodeURIComponent(texte)+"' target='_blank' style='flex:1;background:#25D366;color:white;padding:10px;border-radius:10px;font-size:13px;font-weight:bold;text-decoration:none;text-align:center;display:flex;align-items:center;justify-content:center;'>WhatsApp</a>" : "") +
      "</div>" +
      "</div>";

    document.body.appendChild(panel);
    document.getElementById("close-crm-result").onclick = function() { panel.remove(); };
    document.getElementById("crm-copy").onclick = function() {
      navigator.clipboard && navigator.clipboard.writeText(texte).then(function() {
        document.getElementById("crm-copy").textContent = "✅ Copié !";
        setTimeout(function() { document.getElementById("crm-copy").textContent = "📋 Copier"; }, 2000);
      });
    };
  }

  initCRMAuto();
  console.log("BAA CRM Auto initialise");
})();
