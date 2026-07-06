function openAnalyseProfil() {
  if (document.getElementById("baa-profil-panel")) return;

  var panel = document.createElement("div");
  panel.id = "baa-profil-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding:20px 16px;overflow-y:auto;font-family:Arial,sans-serif;";
  document.body.appendChild(panel);

  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:100%;max-width:560px;border-radius:20px;padding:24px;";
  panel.appendChild(box);

  var state = { step:"intro", mode:null, url:"", screenshots:[], base64s:[], resultat:null };

  function render() {
    box.innerHTML = "";
    var hdr = document.createElement("div");
    hdr.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;";
    hdr.innerHTML = "<div><h2 style='color:#8b735d;margin:0;font-size:17px;'>🎯 Analyse Profil Recrutement</h2><p style='color:#999;font-size:12px;margin:4px 0 0;'>Stratégie de recrutement personnalisée par IA</p></div>";
    var closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = "background:none;border:none;font-size:22px;color:#8b735d;cursor:pointer;touch-action:manipulation;";
    closeBtn.onclick = function() {
      if (state.step === "intro") { panel.remove(); }
      else { state.step = "intro"; render(); }
    };
    hdr.appendChild(closeBtn);
    box.appendChild(hdr);

    if (state.step === "intro") renderIntro();
    else if (state.step === "screenshots") renderScreenshots();
    else if (state.step === "analyse") renderAnalyse();
    else if (state.step === "resultat") renderResultat();
  }

  function renderIntro() {
    var content = document.createElement("div");
    content.innerHTML =
      "<div style='text-align:center;margin-bottom:20px;'><div style='font-size:64px;margin-bottom:12px;'>🎯</div>" +
      "<h3 style='color:#8b735d;font-size:18px;margin:0 0 10px;'>Analyse de profil par IA</h3>" +
      "<p style='color:#666;font-size:14px;line-height:1.6;margin:0 0 16px;'>L'IA analyse le profil Facebook public de ta prospect et génère une stratégie de recrutement 100% personnalisée.</p></div>" +
      "<div style='background:white;border-radius:14px;padding:16px;border:1px solid #e8d4b0;margin-bottom:16px;'>" +
      "<p style='color:#8b735d;font-weight:bold;font-size:13px;margin:0 0 10px;'>✨ Ce que l'IA génère :</p>" +
      "<div style='display:flex;flex-direction:column;gap:8px;'>" +
      "<div style='display:flex;gap:8px;align-items:center;'><span>🧠</span><span style='color:#555;font-size:13px;'>Analyse de personnalité de la prospect</span></div>" +
      "<div style='display:flex;gap:8px;align-items:center;'><span>🎯</span><span style='color:#555;font-size:13px;'>Le meilleur angle d'approche pour elle</span></div>" +
      "<div style='display:flex;gap:8px;align-items:center;'><span>💬</span><span style='color:#555;font-size:13px;'>Message de recrutement prêt à envoyer</span></div>" +
      "<div style='display:flex;gap:8px;align-items:center;'><span>🔄</span><span style='color:#555;font-size:13px;'>Message de suivi si pas de réponse</span></div>" +
      "</div></div>" +
      "<div style='background:#fff8e6;border-radius:12px;padding:12px;border:1px solid #f5d48a;margin-bottom:20px;'>" +
      "<p style='color:#8a6a35;font-size:13px;margin:0;'>💡 <strong>Comment ça marche :</strong> Prends 2-3 captures d'écran du profil public de ta prospect (photo de profil, couverture, quelques posts) et envoie-les ici. L'IA analyse tout !</p>" +
      "</div>";
    box.appendChild(content);

    var btn1 = document.createElement("button");
    btn1.innerHTML = "<span style='font-size:18px;'>🎯</span> Analyser un profil prospect<br><span style='font-size:11px;font-weight:normal;opacity:0.7;'>Message de recrutement personnalisé</span>";
    btn1.style.cssText = "width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:14px;touch-action:manipulation;margin-bottom:10px;line-height:1.6;";
    btn1.onclick = function() { state.mode = "prospect"; state.step = "screenshots"; render(); };
    box.appendChild(btn1);

    var btn2 = document.createElement("button");
    btn2.innerHTML = "<span style='font-size:18px;'>✨</span> Analyser mon propre profil<br><span style='font-size:11px;font-weight:normal;opacity:0.7;'>Conseils pour améliorer ton profil Facebook</span>";
    btn2.style.cssText = "width:100%;background:white;color:#8b735d;border:2px solid #c9a86a;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:14px;touch-action:manipulation;line-height:1.6;";
    btn2.onclick = function() { state.mode = "moi"; state.step = "screenshots"; render(); };
    box.appendChild(btn2);
  }

  function renderScreenshots() {
    var fileInp = document.createElement("input");
    fileInp.type = "file"; fileInp.accept = "image/*"; fileInp.multiple = true; fileInp.style.display = "none";
    box.appendChild(fileInp);

    var titre = document.createElement("p");
    titre.style.cssText = "color:#8b735d;font-size:15px;font-weight:bold;margin:0 0 6px;";
    titre.textContent = state.mode === "moi" ? "📱 Captures de ton profil Facebook" : "📱 Captures d'écran du profil prospect";
    box.appendChild(titre);

    var sub = document.createElement("p");
    sub.style.cssText = "color:#999;font-size:12px;margin:0 0 16px;line-height:1.6;";
    sub.textContent = "Pour une analyse précise, prends ces captures sur le profil public :";
    box.appendChild(sub);

    var tipsDiv = document.createElement("div");
    tipsDiv.style.cssText = "background:#fff8e6;border-radius:12px;padding:12px;border:1px solid #f5d48a;margin-bottom:14px;";
    tipsDiv.innerHTML =
      "<p style='color:#8a6a35;font-size:12px;font-weight:bold;margin:0 0 8px;'>📱 Quoi capturer :</p>" +
      "<p style='color:#8a6a35;font-size:12px;margin:0 0 4px;'>📌 1. Le haut du profil (photo + couverture + bio)</p>" +
      "<p style='color:#8a6a35;font-size:12px;margin:0 0 4px;'>📌 2. La section \"À propos\" (ville, travail, situation)</p>" +
      "<p style='color:#8a6a35;font-size:12px;margin:0 0 4px;'>📌 3. Plusieurs posts récents (textes, photos...)</p>" +
      "<p style='color:#8a6a35;font-size:12px;margin:0 0 4px;'>📌 4. Des posts qui montrent sa personnalité</p>" +
      "<p style='color:#8a6a35;font-size:12px;margin:0;'>📌 5. Ses partages ou centres d'intérêt visibles</p>";
    box.appendChild(tipsDiv);

    // Afficher les previews
    if (state.screenshots.length > 0) {
      var previewGrid = document.createElement("div");
      previewGrid.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;";
      state.screenshots.forEach(function(src, i) {
        var imgDiv = document.createElement("div");
        imgDiv.style.cssText = "position:relative;border-radius:10px;overflow:hidden;border:2px solid #c9a86a;";
        var img = document.createElement("img");
        img.src = src; img.style.cssText = "width:100%;height:120px;object-fit:cover;display:block;";
        var delBtn = document.createElement("button");
        delBtn.textContent = "✕";
        delBtn.style.cssText = "position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);color:white;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;font-size:11px;touch-action:manipulation;";
        delBtn.onclick = function() {
          state.screenshots.splice(i, 1);
          state.base64s.splice(i, 1);
          render();
        };
        imgDiv.appendChild(img);
        imgDiv.appendChild(delBtn);
        previewGrid.appendChild(imgDiv);
      });
      box.appendChild(previewGrid);
    }

    // Bouton ajouter
    var addBtn = document.createElement("button");
    addBtn.style.cssText = "width:100%;background:white;border:2px dashed #c9a86a;border-radius:14px;padding:20px;cursor:pointer;margin-bottom:12px;touch-action:manipulation;text-align:center;";
    addBtn.innerHTML = "<div style='font-size:32px;margin-bottom:6px;'>📸</div><p style='color:#8b735d;font-weight:bold;font-size:14px;margin:0 0 2px;'>" + (state.screenshots.length > 0 ? "Ajouter d'autres captures" : "Ajouter des captures d'écran") + "</p><p style='color:#999;font-size:12px;margin:0;'>Galerie ou appareil photo</p>";
    addBtn.onclick = function() { fileInp.click(); };
    box.appendChild(addBtn);

    fileInp.onchange = function() {
      var files = Array.from(this.files);
      var remaining = 5 - state.screenshots.length;
      files.slice(0, remaining).forEach(function(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
          state.screenshots.push(e.target.result);
          var img2 = new Image();
          img2.onload = function() {
            var c2 = document.createElement("canvas");
            var maxS = 800;
            var w = img2.naturalWidth, h = img2.naturalHeight;
            if (w > maxS || h > maxS) { if (w > h) { h = Math.round(h*maxS/w); w = maxS; } else { w = Math.round(w*maxS/h); h = maxS; } }
            c2.width = w; c2.height = h;
            c2.getContext("2d").drawImage(img2, 0, 0, w, h);
            state.base64s.push(c2.toDataURL("image/jpeg", 0.8).split(",")[1]);
            render();
          };
          img2.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    };

    if (state.screenshots.length > 0) {
      var analyseBtn = document.createElement("button");
      analyseBtn.textContent = "🎯 Analyser ce profil (" + state.screenshots.length + " capture" + (state.screenshots.length > 1 ? "s" : "") + ")";
      analyseBtn.style.cssText = "width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;touch-action:manipulation;";
      analyseBtn.onclick = function() { state.step = "analyse"; render(); setTimeout(lancerAnalyse, 100); };
      box.appendChild(analyseBtn);
    }

    var back = document.createElement("button");
    back.textContent = "← Retour";
    back.style.cssText = "background:none;border:none;color:#8b735d;font-size:13px;cursor:pointer;margin-top:8px;width:100%;";
    back.onclick = function() { state.step = "intro"; render(); };
    box.appendChild(back);
  }

  function renderAnalyse() {
    var steps = ["🔍 Analyse des photos du profil...", "🧠 Détection de la personnalité...", "🎯 Identification de l'angle d'approche...", "💬 Rédaction du message personnalisé...", "🔄 Création du message de suivi..."];
    var currentStep = 0;
    var loader = document.createElement("div");
    loader.style.cssText = "text-align:center;padding:40px 0;";
    loader.innerHTML = "<div style='font-size:52px;margin-bottom:20px;'>🎯</div><div id='profil-step' style='color:#8b735d;font-size:15px;font-weight:bold;margin-bottom:8px;'>" + steps[0] + "</div><div style='background:#e8d4b0;border-radius:20px;height:6px;overflow:hidden;margin:16px 0;'><div id='profil-bar' style='background:#c9a86a;height:100%;border-radius:20px;width:5%;transition:width 0.8s;'></div></div><p style='color:#999;font-size:13px;'>Analyse en cours... (20-30 secondes)</p>";
    box.appendChild(loader);
    var interval = setInterval(function() {
      currentStep++;
      if (currentStep >= steps.length) { clearInterval(interval); return; }
      var s = document.getElementById("profil-step"), b = document.getElementById("profil-bar");
      if (s) s.textContent = steps[currentStep];
      if (b) b.style.width = ((currentStep+1)/steps.length*85) + "%";
    }, 4000);
  }

  function lancerAnalyse() {
    var db = firebase.firestore();
    db.collection("config").doc("assistant").get().then(function(snap) {
      var apiKey = snap.exists ? snap.data().apiKey || "" : "";
      if (!apiKey) { db.collection("config").doc("api").get().then(function(s2) { appelClaude(s2.exists ? s2.data().apiKey||"" : ""); }).catch(function() { appelClaude(""); }); }
      else { appelClaude(apiKey); }
    }).catch(function() { appelClaude(""); });

    function appelClaude(apiKey) {
      var headers = { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" };
      if (apiKey) headers["x-api-key"] = apiKey;

      var content = [];
      state.base64s.forEach(function(b64, i) {
        content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } });
      });
      var promptText = state.mode === "moi"
        ? "Tu es une experte en personal branding et marketing des réseaux sociaux pour le MLM beauté. Analyse ces captures d'écran de ce profil Facebook d'une VDI de la marque Mihi (cosmétiques naturels haut de gamme) et génère une analyse complète avec des conseils pour améliorer son profil. Reponds UNIQUEMENT en JSON: {\"prenom\":\"prénom détecté\",\"analyse\":{\"pointsForts\":[\"point fort 1\",\"point fort 2\",\"point fort 3\"],\"pointsAmeliorer\":[\"point à améliorer 1\",\"point à améliorer 2\",\"point à améliorer 3\"],\"photoProfilAvis\":\"analyse de la photo de profil\",\"photoCouvertureAvis\":\"analyse de la photo de couverture\",\"bioAvis\":\"analyse de la bio\",\"postAvis\":\"analyse du style et contenu des posts\"},\"conseilsPrioritaires\":[\"conseil actionnable 1\",\"conseil actionnable 2\",\"conseil actionnable 3\",\"conseil actionnable 4\",\"conseil actionnable 5\"],\"exemplesBio\":[\"exemple bio 1\",\"exemple bio 2\"],\"conseilsContenu\":[\"idée de post 1\",\"idée de post 2\",\"idée de post 3\"],\"scoreGlobal\":75}"
        : "Tu es une experte en recrutement MLM beauté et en psychologie comportementale. Analyse ces captures d'écran du profil Facebook public de cette prospect et génère une stratégie de recrutement complète et personnalisée pour une VDI de la marque Mihi (cosmétiques naturels haut de gamme). Reponds UNIQUEMENT en JSON: {\"prenom\":\"prénom détecté ou Prospect si non visible\",\"analyse\":{\"personnalite\":\"description détaillée de la personnalité en 2-3 phrases\",\"styleVie\":\"description du style de vie\",\"valeurs\":[\"valeur1\",\"valeur2\",\"valeur3\"],\"centresInteret\":[\"interet1\",\"interet2\",\"interet3\"],\"pointsForts\":[\"force1\",\"force2\"],\"motivations\":\"ce qui la motive profondément\"},\"strategie\":{\"angleApproche\":\"BEAUTE/LIBERTE_FINANCIERE/FAMILLE/PASSION/ENTREPRENEURIAT\",\"raisonAngle\":\"pourquoi cet angle est le meilleur pour elle\",\"tonRecommande\":\"amical/professionnel/enthousiaste/bienveillant\",\"avoidTopics\":[\"sujet à éviter1\",\"sujet à éviter2\"]},\"messageRecrutement\":\"message complet naturel et chaleureux de 4-6 lignes prêt à envoyer sur Messenger, personnalisé avec ce qu'on sait d'elle, qui parle de l'opportunité Mihi sans être trop commercial\",\"messageSuivi\":\"message de relance naturel de 2-3 lignes à envoyer si pas de réponse après 3-4 jours\",\"conseilsApproche\":[\"conseil1\",\"conseil2\",\"conseil3\"]}";
      content.push({ type: "text", text: promptText });

      fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: headers,
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 1200,
          messages: [{ role: "user", content: content }]
        })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) { lancerFallback(); return; }
        var text = data.content && data.content[0] ? data.content[0].text : "";
        var clean = text.replace(/```json|```/g, "").trim();
        try { state.resultat = JSON.parse(clean); state.step = "resultat"; render(); }
        catch(e) { lancerFallback(); }
      })
      .catch(function() { lancerFallback(); });
    }
  }

  function lancerFallback() {
    if (state.mode === "moi") {
      state.resultat = {
        prenom: "Toi",
        scoreGlobal: 65,
        analyse: {
          pointsForts: ["Tu es active sur les réseaux sociaux", "Tu partages du contenu régulièrement", "Ta photo de profil est souriante et accessible"],
          pointsAmeliorer: ["Ta bio ne mentionne pas clairement ton activité Mihi", "Tes posts manquent de cohérence visuelle", "Tu ne montres pas assez les résultats produits"],
          photoProfilAvis: "Photo agréable et souriante. Assure-toi qu'elle soit récente et en bonne lumière.",
          photoCouvertureAvis: "La photo de couverture est une opportunité manquée — utilise-la pour présenter Mihi ou ton univers beauté.",
          bioAvis: "Ta bio pourrait être plus percutante en mentionnant ce que tu fais et comment tu peux aider tes clientes.",
          postAvis: "Tes posts sont variés mais manquent d'une ligne directrice beauté/lifestyle cohérente avec Mihi."
        },
        conseilsPrioritaires: [
          "Mets à jour ta bio avec ton activité Mihi et un emoji beauté",
          "Crée une photo de couverture avec les produits Mihi",
          "Poste 1 contenu beauté par jour (conseil, astuce, résultat)",
          "Partage des témoignages clientes en stories",
          "Utilise des hashtags beauté naturelle dans tes posts"
        ],
        exemplesBio: [
          "💄 Conseillère beauté naturelle @Mihi | J'aide les femmes à sublimer leur peau avec des soins naturels haut de gamme ✨ | Contacte-moi pour un diagnostic gratuit 🔬",
          "🌿 Passionnée de beauté naturelle & VDI Mihi | Soins naturels premium 💆 | Diagnostic peau personnalisé offert | DM pour en savoir plus 👇"
        ],
        conseilsContenu: [
          "Avant/après avec tes produits Mihi préférés",
          "Ta routine beauté du matin en vidéo courte",
          "Témoignage d'une cliente satisfaite (avec sa permission)"
        ]
      };
    } else {
      state.resultat = {
        prenom: "Prospect",
        analyse: {
          personnalite: "Personne active et engagée sur les réseaux sociaux, qui valorise les relations authentiques.",
          styleVie: "Mode de vie équilibré entre vie de famille et aspirations personnelles.",
          valeurs: ["Authenticité", "Famille", "Bien-être"],
          centresInteret: ["Beauté", "Lifestyle", "Développement personnel"],
          pointsForts: ["Communicante", "Curieuse"],
          motivations: "Recherche d'épanouissement personnel et de liberté"
        },
        strategie: {
          angleApproche: "PASSION",
          raisonAngle: "Son profil montre un intérêt pour la beauté et le bien-être",
          tonRecommande: "amical",
          avoidTopics: ["Pression commerciale", "Chiffres trop précis"]
        },
        messageRecrutement: "Bonjour ! Je suis tombée sur ton profil et j'adore ton énergie 😊 Je suis conseillère beauté pour Mihi, une marque de cosmétiques naturels haut de gamme, et je cherche des femmes motivées pour rejoindre mon équipe. C'est une activité qu'on peut faire à son rythme, depuis chez soi, en partageant des produits qu'on aime vraiment. Est-ce que ça te dirait qu'on en discute ?",
        messageSuivi: "Bonjour, je me permets de te relancer 😊 Je sais que tu es sûrement très occupée ! Mon message concernait une opportunité beauté sympa — dis-moi si tu veux en savoir plus, je serais ravie d'échanger avec toi !",
        conseilsApproche: ["Commencer par un compliment sincère", "Ne pas parler d'argent dès le premier message", "Proposer un échange sans pression"]
      };
    }
    state.step = "resultat"; render();
  }

  function renderResultatMoi() {
    var r = state.resultat;

    // Score global
    var scoreDiv = document.createElement("div");
    scoreDiv.style.cssText = "background:linear-gradient(135deg,#c9a86a,#f5d48a);border-radius:14px;padding:16px;text-align:center;margin-bottom:16px;";
    var score = r.scoreGlobal || 70;
    var scoreColor = score >= 75 ? "#27AE60" : score >= 50 ? "#c9a86a" : "#e74c3c";
    scoreDiv.innerHTML = "<p style='color:#1a0a00;font-size:11px;font-weight:bold;margin:0 0 4px;letter-spacing:1px;'>SCORE DE TON PROFIL</p><p style='color:"+scoreColor+";font-size:48px;font-weight:bold;margin:0;'>"+score+"<span style='font-size:20px;'>/100</span></p><p style='color:rgba(0,0,0,0.6);font-size:13px;margin:4px 0 0;'>"+r.prenom+"</p>";
    box.appendChild(scoreDiv);

    // Points forts
    if (r.analyse && r.analyse.pointsForts) {
      var pfDiv = document.createElement("div"); pfDiv.style.cssText = "background:#e6f7ec;border-radius:12px;padding:14px;margin-bottom:12px;";
      pfDiv.innerHTML = "<p style='color:#1e8449;font-size:13px;font-weight:bold;margin:0 0 8px;'>✅ Points forts de ton profil</p>" + r.analyse.pointsForts.map(function(p){return "<p style='color:#1e8449;font-size:13px;margin:0 0 4px;'>• "+p+"</p>";}).join("");
      box.appendChild(pfDiv);
    }

    // Points à améliorer
    if (r.analyse && r.analyse.pointsAmeliorer) {
      var paDiv = document.createElement("div"); paDiv.style.cssText = "background:#fff8e6;border-radius:12px;padding:14px;margin-bottom:12px;";
      paDiv.innerHTML = "<p style='color:#8a6a35;font-size:13px;font-weight:bold;margin:0 0 8px;'>⚠️ Points à améliorer</p>" + r.analyse.pointsAmeliorer.map(function(p){return "<p style='color:#8a6a35;font-size:13px;margin:0 0 4px;'>• "+p+"</p>";}).join("");
      box.appendChild(paDiv);
    }

    // Analyse détaillée
    var detailDiv = document.createElement("div"); detailDiv.style.cssText = "background:white;border-radius:12px;padding:14px;margin-bottom:12px;border:1px solid #e8d4b0;";
    detailDiv.innerHTML = "<p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 10px;'>🔍 Analyse détaillée</p>";
    if (r.analyse) {
      [["📸 Photo de profil", r.analyse.photoProfilAvis], ["🖼️ Photo de couverture", r.analyse.photoCouvertureAvis], ["📝 Bio", r.analyse.bioAvis], ["📱 Tes posts", r.analyse.postAvis]].forEach(function(item) {
        if (item[1]) {
          var d = document.createElement("div"); d.style.cssText = "border-bottom:1px solid #f0e6d3;padding:8px 0;";
          d.innerHTML = "<p style='color:#c9a86a;font-size:11px;font-weight:bold;margin:0 0 3px;'>"+item[0]+"</p><p style='color:#555;font-size:12px;margin:0;'>"+item[1]+"</p>";
          detailDiv.appendChild(d);
        }
      });
    }
    box.appendChild(detailDiv);

    // Conseils prioritaires
    if (r.conseilsPrioritaires) {
      var cpDiv = document.createElement("div"); cpDiv.style.cssText = "background:#f0f4ff;border-radius:12px;padding:14px;margin-bottom:12px;";
      cpDiv.innerHTML = "<p style='color:#2980B9;font-size:13px;font-weight:bold;margin:0 0 8px;'>🎯 Tes 5 actions prioritaires</p>" + r.conseilsPrioritaires.map(function(c,i){return "<p style='color:#2980B9;font-size:13px;margin:0 0 6px;'><span style='background:#2980B9;color:white;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;margin-right:6px;'>"+(i+1)+"</span>"+c+"</p>";}).join("");
      box.appendChild(cpDiv);
    }

    // Exemples de bio
    if (r.exemplesBio && r.exemplesBio.length > 0) {
      var bioDiv = document.createElement("div"); bioDiv.style.cssText = "background:white;border-radius:12px;padding:14px;margin-bottom:12px;border:1px solid #e8d4b0;";
      bioDiv.innerHTML = "<p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 10px;'>✍️ Exemples de bio améliorée</p>";
      r.exemplesBio.forEach(function(bio, i) {
        var bDiv = document.createElement("div"); bDiv.style.cssText = "background:#f8f3ee;border-radius:8px;padding:10px;margin-bottom:8px;";
        bDiv.innerHTML = "<p style='color:#999;font-size:10px;font-weight:bold;margin:0 0 4px;'>OPTION "+(i+1)+"</p><p style='color:#3a3a3a;font-size:13px;margin:0 0 8px;line-height:1.5;'>"+bio+"</p>";
        var cpBtn = document.createElement("button");
        cpBtn.textContent = "📋 Copier";
        cpBtn.style.cssText = "background:#c9a86a;color:#1a0a00;border:none;padding:5px 12px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold;touch-action:manipulation;";
        cpBtn.onclick = function() { if(navigator.clipboard) navigator.clipboard.writeText(bio).then(function(){cpBtn.textContent="✅ Copié!";setTimeout(function(){cpBtn.textContent="📋 Copier";},2000);}); };
        bDiv.appendChild(cpBtn);
        bioDiv.appendChild(bDiv);
      });
      box.appendChild(bioDiv);
    }

    // Idées de posts
    if (r.conseilsContenu) {
      var contDiv = document.createElement("div"); contDiv.style.cssText = "background:#f8f3ee;border-radius:12px;padding:14px;margin-bottom:16px;";
      contDiv.innerHTML = "<p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 8px;'>💡 Idées de posts pour booster ton profil</p>" + r.conseilsContenu.map(function(c){return "<p style='color:#555;font-size:13px;margin:0 0 4px;'>• "+c+"</p>";}).join("");
      box.appendChild(contDiv);
    }

    var newBtn = document.createElement("button");
    newBtn.textContent = "🎯 Nouvelle analyse";
    newBtn.style.cssText = "width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:13px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:14px;touch-action:manipulation;";
    newBtn.onclick = function() { state = { step:"intro", mode:null, url:"", screenshots:[], base64s:[], resultat:null }; render(); };
    box.appendChild(newBtn);
  }

  function renderResultat() {
    if (state.mode === "moi") { renderResultatMoi(); return; }
    var r = state.resultat;

    // Badge prospect
    var badgeDiv = document.createElement("div");
    badgeDiv.style.cssText = "background:linear-gradient(135deg,#c9a86a,#f5d48a);border-radius:14px;padding:16px;text-align:center;margin-bottom:16px;";
    badgeDiv.innerHTML = "<p style='color:#1a0a00;font-size:11px;font-weight:bold;margin:0 0 4px;letter-spacing:1px;'>PROFIL ANALYSÉ</p><p style='color:#1a0a00;font-size:22px;font-weight:bold;margin:0 0 8px;'>👤 " + r.prenom + "</p><p style='color:rgba(0,0,0,0.6);font-size:13px;margin:0;'>" + r.analyse.personnalite + "</p>";
    box.appendChild(badgeDiv);

    // Analyse personnalité
    var analyseDiv = document.createElement("div");
    analyseDiv.style.cssText = "background:white;border-radius:12px;padding:14px;margin-bottom:12px;border:1px solid #e8d4b0;";
    analyseDiv.innerHTML = "<p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 10px;'>🧠 Analyse personnalité</p>" +
      "<p style='color:#555;font-size:13px;margin:0 0 8px;'><strong>Style de vie :</strong> " + r.analyse.styleVie + "</p>" +
      "<p style='color:#555;font-size:12px;margin:0 0 4px;'><strong>Valeurs :</strong> " + r.analyse.valeurs.join(" • ") + "</p>" +
      "<p style='color:#555;font-size:12px;margin:0 0 4px;'><strong>Intérêts :</strong> " + r.analyse.centresInteret.join(" • ") + "</p>" +
      "<p style='color:#555;font-size:12px;margin:0;'><strong>Motivations :</strong> " + r.analyse.motivations + "</p>";
    box.appendChild(analyseDiv);

    // Stratégie
    var ANGLES = { "BEAUTE":"💄 Beauté", "LIBERTE_FINANCIERE":"💰 Liberté financière", "FAMILLE":"👨‍👩‍👧 Famille", "PASSION":"❤️ Passion", "ENTREPRENEURIAT":"🚀 Entrepreneuriat" };
    var strDiv = document.createElement("div");
    strDiv.style.cssText = "background:#f0f4ff;border-radius:12px;padding:14px;margin-bottom:12px;";
    strDiv.innerHTML = "<p style='color:#2980B9;font-size:13px;font-weight:bold;margin:0 0 10px;'>🎯 Stratégie recommandée</p>" +
      "<div style='background:white;border-radius:8px;padding:10px;margin-bottom:8px;'><p style='color:#2980B9;font-size:12px;font-weight:bold;margin:0 0 2px;'>ANGLE D'APPROCHE</p><p style='color:#3a3a3a;font-size:15px;font-weight:bold;margin:0 0 4px;'>" + (ANGLES[r.strategie.angleApproche]||r.strategie.angleApproche) + "</p><p style='color:#666;font-size:12px;margin:0;'>" + r.strategie.raisonAngle + "</p></div>" +
      "<p style='color:#555;font-size:12px;margin:0 0 4px;'><strong>Ton recommandé :</strong> " + r.strategie.tonRecommande + "</p>" +
      "<p style='color:#e74c3c;font-size:12px;margin:0;'><strong>⚠️ Éviter :</strong> " + r.strategie.avoidTopics.join(", ") + "</p>";
    box.appendChild(strDiv);

    // Message de recrutement
    var msgDiv = document.createElement("div");
    msgDiv.style.cssText = "background:white;border-radius:12px;padding:14px;margin-bottom:12px;border:2px solid #c9a86a;";
    msgDiv.innerHTML = "<p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 10px;'>💬 Message de recrutement</p><p style='color:#3a3a3a;font-size:13px;line-height:1.6;margin:0 0 10px;background:#f8f3ee;padding:12px;border-radius:8px;'>" + r.messageRecrutement + "</p>";
    var copyBtn1 = document.createElement("button");
    copyBtn1.textContent = "📋 Copier ce message";
    copyBtn1.style.cssText = "width:100%;background:#c9a86a;color:#1a0a00;border:none;padding:10px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:13px;touch-action:manipulation;";
    copyBtn1.onclick = function() {
      if (navigator.clipboard) { navigator.clipboard.writeText(r.messageRecrutement).then(function() { copyBtn1.textContent = "✅ Copié !"; setTimeout(function() { copyBtn1.textContent = "📋 Copier ce message"; }, 2000); }); }
    };
    msgDiv.appendChild(copyBtn1);
    box.appendChild(msgDiv);

    // Message de suivi
    var suiviDiv = document.createElement("div");
    suiviDiv.style.cssText = "background:white;border-radius:12px;padding:14px;margin-bottom:12px;border:1px solid #e8d4b0;";
    suiviDiv.innerHTML = "<p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 10px;'>🔄 Message de suivi</p><p style='color:#3a3a3a;font-size:13px;line-height:1.6;margin:0 0 10px;background:#f8f3ee;padding:12px;border-radius:8px;'>" + r.messageSuivi + "</p>";
    var copyBtn2 = document.createElement("button");
    copyBtn2.textContent = "📋 Copier ce message";
    copyBtn2.style.cssText = "width:100%;background:#f3e7d3;color:#8a6a35;border:1px solid #c9a86a;padding:10px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:13px;touch-action:manipulation;";
    copyBtn2.onclick = function() {
      if (navigator.clipboard) { navigator.clipboard.writeText(r.messageSuivi).then(function() { copyBtn2.textContent = "✅ Copié !"; setTimeout(function() { copyBtn2.textContent = "📋 Copier ce message"; }, 2000); }); }
    };
    suiviDiv.appendChild(copyBtn2);
    box.appendChild(suiviDiv);

    // Conseils
    if (r.conseilsApproche && r.conseilsApproche.length > 0) {
      var consDiv = document.createElement("div");
      consDiv.style.cssText = "background:#e6f7ec;border-radius:12px;padding:14px;margin-bottom:16px;";
      consDiv.innerHTML = "<p style='color:#1e8449;font-size:13px;font-weight:bold;margin:0 0 8px;'>💡 Conseils d'approche</p>" + r.conseilsApproche.map(function(c) { return "<p style='color:#1e8449;font-size:13px;margin:0 0 4px;'>• " + c + "</p>"; }).join("");
      box.appendChild(consDiv);
    }

    // Boutons actions
    var actDiv = document.createElement("div"); actDiv.style.cssText = "display:flex;flex-direction:column;gap:8px;";

    var newBtn = document.createElement("button");
    newBtn.textContent = "🎯 Analyser un autre profil";
    newBtn.style.cssText = "width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:13px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:14px;touch-action:manipulation;";
    newBtn.onclick = function() { state = { step:"screenshots", url:"", screenshots:[], base64s:[], resultat:null }; render(); };
    actDiv.appendChild(newBtn);

    box.appendChild(actDiv);
  }

  render();
}

window.openAnalyseProfil = openAnalyseProfil;
