function openStudioPanel() {
  if (document.getElementById("baa-studio-panel")) return;
  var db = firebase.firestore();
  var auth = firebase.auth();
  var uid = auth.currentUser ? auth.currentUser.uid : null;

  var PALETTES = [
    { id: "noir-or", nom: "Noir & Or", bg: "#0f0f0f", accent: "#c9a86a", accent2: "#f5d48a", text: "#ffffff", text2: "rgba(255,255,255,0.6)", card: "#1a1208" },
    { id: "blanc", nom: "Blanc épuré", bg: "#ffffff", accent: "#c9a86a", accent2: "#f5d48a", text: "#1a1a1a", text2: "#888888", card: "#f8f4ee" },
    { id: "violet", nom: "Violet Phénix", bg: "#26215C", accent: "#CECBF6", accent2: "#f5d48a", text: "#ffffff", text2: "rgba(255,255,255,0.6)", card: "rgba(255,255,255,0.08)" },
    { id: "rose", nom: "Rose moderne", bg: "#FFF5F8", accent: "#D4537E", accent2: "#993556", text: "#1a1a1a", text2: "#888888", card: "#fce4ed" },
    { id: "nature", nom: "Nature Luxe", bg: "#f8f4ee", accent: "#c9a86a", accent2: "#8a6a35", text: "#3d1f05", text2: "#666666", card: "#e8d4b0" },
    { id: "soleil", nom: "Coucher de soleil", bg: "#0d0d0d", accent: "#D85A30", accent2: "#f5d48a", text: "#ffffff", text2: "rgba(255,255,255,0.5)", card: "rgba(216,90,48,0.15)" },
    { id: "corail", nom: "Corail tropical", bg: "#ffffff", accent: "#D85A30", accent2: "#F5C4B3", text: "#1a1a1a", text2: "#666666", card: "#FAECE7" },
    { id: "marbre", nom: "Marbre blanc", bg: "#f9f7f4", accent: "#1a1a1a", accent2: "#888888", text: "#1a1a1a", text2: "#666666", card: "#e0ddd8" }
  ];

  var CATEGORIES = [
    { id: "produit", nom: "🧴 Produits" },
    { id: "temoignage", nom: "💬 Témoignages" },
    { id: "conseil", nom: "💡 Conseils" },
    { id: "recrutement", nom: "🐦‍🔥 Recrutement" },
    { id: "promo", nom: "🎁 Promotions" },
    { id: "vie", nom: "✨ Ma vie" }
  ];

  var TEMPLATES = [
    // PRODUITS
    { id: "mise-avant", cat: "produit", nom: "Mise en avant produit", champs: ["produit", "tag", "description", "cta"], defaultText: { produit: "Sérum Éclat", tag: "NOUVEAU", description: "Mihi Beauty Collection", cta: "Disponible maintenant" } },
    { id: "nouveau-produit", cat: "produit", nom: "Nouveau produit", champs: ["produit", "description", "cta"], defaultText: { produit: "Sérum Éclat Intense", description: "La nouvelle pépite Mihi pour une peau lumineuse en 7 jours", cta: "Voir le catalogue →" } },
    { id: "ingredient", cat: "produit", nom: "Ingrédient star", champs: ["ingredient", "description", "produit"], defaultText: { ingredient: "Acide Hyaluronique", description: "Hydrate en profondeur et repulpe la peau durablement.", produit: "Retrouve-le dans nos soins →" } },
    { id: "selection", cat: "produit", nom: "Sélection du mois", champs: ["titre", "prod1", "prod2", "prod3", "prod4"], defaultText: { titre: "MA SÉLECTION DU MOIS", prod1: "Sérum Éclat", prod2: "Complément", prod3: "Crème Nuit", prod4: "Huile Dorée" } },
    { id: "resultat7j", cat: "produit", nom: "Résultat 7 jours", champs: ["produit", "resultat"], defaultText: { produit: "Sérum Éclat Intense Mihi", resultat: "+95% d'hydratation" } },
    { id: "comparatif", cat: "produit", nom: "Comparatif avant/après Mihi", champs: ["avantTitre", "apresTitre"], defaultText: { avantTitre: "Routine classique", apresTitre: "Gamme Mihi" } },
    // TÉMOIGNAGES
    { id: "avant-apres", cat: "temoignage", nom: "Avant / Après", champs: ["titre", "avantLabel", "apresLabel", "produit"], defaultText: { titre: "Ma transformation", avantLabel: "AVANT", apresLabel: "APRÈS", produit: "avec la gamme Mihi ✦" } },
    { id: "temoignage", cat: "temoignage", nom: "Témoignage cliente", champs: ["nom", "age", "texte", "produit"], defaultText: { nom: "Sophie", age: "34 ans", texte: "Incroyable ! Ma peau n'a jamais été aussi lumineuse et hydratée. Je recommande à 100% !", produit: "" } },
    { id: "temoignage-vdi", cat: "temoignage", nom: "Témoignage VDI", champs: ["nom", "duree", "texte"], defaultText: { nom: "Laura D.", duree: "Phénix depuis 8 mois", texte: "Je ne pensais pas que c'était possible mais aujourd'hui je gagne 600€ de plus par mois en travaillant 2h par jour." } },
    { id: "chiffres", cat: "temoignage", nom: "Chiffres clés", champs: ["nb1", "lbl1", "nb2", "lbl2", "nb3", "lbl3", "nb4", "lbl4"], defaultText: { nb1: "47", lbl1: "clientes satisfaites", nb2: "98%", lbl2: "taux de satisfaction", nb3: "3 ans", lbl3: "d'expérience beauté", nb4: "+120", lbl4: "produits testés" } },
    // CONSEILS
    { id: "conseil-jour", cat: "conseil", nom: "Conseil du jour", champs: ["titre", "texte"], defaultText: { titre: "Conseil beauté du jour", texte: "Hydratez votre peau le matin avant d'appliquer votre fond de teint pour un résultat naturel et longue durée." } },
    { id: "routine", cat: "conseil", nom: "Routine beauté", champs: ["titre", "step1", "step2", "step3", "step4"], defaultText: { titre: "MA ROUTINE BEAUTÉ", step1: "Nettoyant doux Mihi", step2: "Sérum éclat booster", step3: "Crème hydratante SPF", step4: "Huile précieuse soir" } },
    { id: "erreurs", cat: "conseil", nom: "Les 3 erreurs", champs: ["titre", "err1", "err2", "err3"], defaultText: { titre: "3 erreurs à éviter avec ta crème hydratante", err1: "L'appliquer sur peau sèche — toujours sur peau légèrement humide", err2: "Trop peu de produit — une noisette pour le visage minimum", err3: "Oublier le cou — la peau vieillit aussi là !" } },
    { id: "astuce", cat: "conseil", nom: "Astuce beauté", champs: ["titre", "texte"], defaultText: { titre: "Astuce maquillage", texte: "Pour un teint parfait toute la journée, applique une fine couche de poudre translucide sur ton fond de teint. Résultat mat garanti 8h !" } },
    { id: "faq", cat: "conseil", nom: "FAQ beauté", champs: ["question", "reponse"], defaultText: { question: "Peut-on utiliser le sérum le matin ET le soir ?", reponse: "Oui absolument ! Le sérum Mihi est conçu pour une utilisation matin et soir. Il s'adapte à tous les types de peau." } },
    { id: "sondage", cat: "conseil", nom: "Sondage", champs: ["question", "opt1", "pct1", "opt2", "pct2"], defaultText: { question: "Quelle est ta priorité beauté ?", opt1: "Hydratation 💧", pct1: "68%", opt2: "Anti-âge ✨", pct2: "32%" } },
    // RECRUTEMENT
    { id: "recru-changer", cat: "recrutement", nom: "Et si tu changeais ta vie ?", champs: ["avantage1", "avantage2", "avantage3", "cta"], defaultText: { avantage1: "Travaille depuis chez toi", avantage2: "Fixe tes propres horaires", avantage3: "Gagne ce que tu mérites", cta: "Je veux en savoir plus →" } },
    { id: "recru-revenus", cat: "recrutement", nom: "Mes revenus ce mois", champs: ["total", "detail1", "val1", "detail2", "val2", "detail3", "val3"], defaultText: { total: "847€", detail1: "Ventes directes", val1: "520€", detail2: "Bonus équipe", val2: "210€", detail3: "Primes Mihi", val3: "117€" } },
    { id: "recru-avant", cat: "recrutement", nom: "Avant je pensais que...", champs: ["avant", "apres"], defaultText: { avant: "Ce genre de truc c'est pour les autres, pas pour moi...", apres: "Aujourd'hui je gère mon temps, mes revenus et ma vie. La meilleure décision que j'ai prise !" } },
    { id: "recru-journee", cat: "recrutement", nom: "Ma journée type", champs: ["t1", "a1", "t2", "a2", "t3", "a3", "t4", "a4", "t5", "a5"], defaultText: { t1: "9h00", a1: "Café + messages clientes", t2: "10h30", a2: "Post Instagram + stories", t3: "14h00", a3: "Appels prospects", t4: "16h00", a4: "Formation académie", t5: "18h00", a5: "Famille — je suis libre !" } },
    { id: "recru-idees", cat: "recrutement", nom: "Les idées reçues", champs: ["idee1", "idee2", "idee3", "idee4", "cta"], defaultText: { idee1: "Il faut harceler ses amis pour vendre", idee2: "C'est réservé aux extraverties", idee3: "Ça prend tout ton temps libre", idee4: "Les revenus sont insignifiants", cta: "La vérité ? Écris-moi ! →" } },
    { id: "recru-pourquoi", cat: "recrutement", nom: "Pourquoi j'ai dit oui", champs: ["raison1", "raison2", "raison3", "raison4", "cta"], defaultText: { raison1: "Je voulais plus de liberté dans mon quotidien", raison2: "J'avais besoin d'un revenu complémentaire", raison3: "La beauté est ma passion depuis toujours", raison4: "Une équipe qui croit en moi", cta: "Et toi, c'est quoi ton pourquoi ? →" } },
    { id: "recru-gains", cat: "recrutement", nom: "Combien peut-on gagner ?", champs: [], defaultText: {} },
    { id: "recru-avantages", cat: "recrutement", nom: "Les avantages Phénix", champs: [], defaultText: {} },
    { id: "recru-reconnais", cat: "recrutement", nom: "Tu te reconnais ?", champs: ["check1", "check2", "check3", "check4", "cta"], defaultText: { check1: "Tu aimes la beauté et les soins", check2: "Tu cherches un revenu complémentaire", check3: "Tu veux plus de liberté au quotidien", check4: "Tu es prête à te lancer !", cta: "Écris-moi maintenant →" } },
    // PROMOS
    { id: "promo-flash", cat: "promo", nom: "Promo flash", champs: ["pct", "produit", "cta"], defaultText: { pct: "-30%", produit: "Sur toute la gamme Éclat", cta: "Voir le catalogue →" } },
    { id: "story-promo", cat: "promo", nom: "Story promo", champs: ["pct", "label", "cta"], defaultText: { pct: "-25%", label: "OFFRE SPÉCIALE", cta: "Voir le catalogue →" } },
    // VIE
    { id: "presentation", cat: "vie", nom: "Présentation VDI", champs: ["nom", "titre", "email", "tel", "catalogue"], defaultText: { nom: "Marie Dupont", titre: "CONSEILLÈRE BEAUTÉ MIHI", email: "marie@email.com", tel: "06 12 34 56 78", catalogue: "Mon catalogue Mihi" } },
    { id: "motivation", cat: "vie", nom: "Citation motivation", champs: ["citation", "auteur"], defaultText: { citation: "Le succès c'est tomber 7 fois et se relever 8.", auteur: "🐦‍🔥 Phénix Academy" } },
    { id: "vie-phenix", cat: "vie", nom: "Ma vie de Phénix", champs: ["item1", "item2", "item3", "item4", "cta"], defaultText: { item1: "Liberté d'organisation", item2: "Revenus complémentaires", item3: "Passion beauté au quotidien", item4: "Une équipe bienveillante", cta: "Tu veux en savoir plus ? Écris-moi ! →" } },
    { id: "objectif", cat: "vie", nom: "Objectif du mois", champs: ["pct", "lbl1", "val1", "lbl2", "val2", "lbl3", "val3"], defaultText: { pct: "65%", lbl1: "Commandes", val1: "13 / 20", lbl2: "Nouvelles clientes", val2: "4 / 6", lbl3: "CA du mois", val3: "650€ / 1000€" } },
    { id: "bienvenue", cat: "vie", nom: "Bienvenue cliente", champs: ["prenom", "message"], defaultText: { prenom: "Sophie !", message: "Merci pour ta confiance ! Je suis tellement heureuse de t'accompagner dans ta routine beauté avec Mihi ✨" } },
    { id: "live", cat: "vie", nom: "Annonce Live", champs: ["date", "heure", "sujet", "cta"], defaultText: { date: "Samedi 15h", heure: "sur Facebook", sujet: "Routine peau parfaite ✨", cta: "Rejoins-nous →" } }
  ];

  var panel = document.createElement("div"); panel.id = "baa-studio-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:20px;overflow-y:auto;";
  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:96%;max-width:800px;border-radius:20px;font-family:Arial,sans-serif;max-height:94vh;overflow-y:auto;margin-bottom:20px;";
  panel.appendChild(box); document.body.appendChild(panel);
  panel.onclick = function(e) { if (e.target === panel) panel.remove(); };

  var selectedCat = "produit";
  var selectedTemplate = TEMPLATES[0];
  var selectedPalette = PALETTES[0];
  var userData = {};
  var photoURL = "";

  db.collection("users").doc(uid).get().then(function(snap) {
    userData = snap.data() || {};
    photoURL = userData.photoURL || "";
    renderStudio();
  });

  function renderStudio() {
    box.innerHTML =
      "<div style='background:linear-gradient(135deg,#1a0a00,#3d1f05);padding:20px 24px;display:flex;align-items:center;justify-content:space-between;border-radius:20px 20px 0 0;'>" +
      "<div><h2 style='color:#f5d48a;margin:0;font-size:18px;'>🎨 Studio de contenu</h2><p style='color:rgba(255,255,255,0.4);margin:4px 0 0;font-size:12px;'>Crée tes visuels Beauty Addict</p></div>" +
      "<span id='close-studio' style='cursor:pointer;color:rgba(255,255,255,0.6);font-size:24px;'>✕</span></div>" +

      "<div style='display:flex;flex-direction:column;gap:0;'>" +

      // ÉTAPE 1 — Catégorie
      "<div style='padding:20px 24px;border-bottom:1px solid #e8d4b0;'>" +
      "<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 10px;'>1 — Choisis une catégorie</p>" +
      "<div style='display:flex;gap:8px;flex-wrap:wrap;'>" +
      CATEGORIES.map(function(c) {
        return "<button class='cat-btn' data-cat='" + c.id + "' style='padding:7px 14px;border-radius:20px;cursor:pointer;font-size:12px;border:1px solid #c8a96b;background:" + (selectedCat === c.id ? "#c9a86a" : "#f3e7d3") + ";color:" + (selectedCat === c.id ? "white" : "#8a6a35") + ";font-weight:bold;'>" + c.nom + "</button>";
      }).join("") + "</div></div>" +

      // ÉTAPE 2 — Template
      "<div style='padding:20px 24px;border-bottom:1px solid #e8d4b0;'>" +
      "<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 10px;'>2 — Choisis un template</p>" +
      "<div style='display:flex;gap:8px;flex-wrap:wrap;' id='tpl-btns'>" +
      TEMPLATES.filter(function(t) { return t.cat === selectedCat; }).map(function(t) {
        return "<button class='tpl-btn' data-tpl='" + t.id + "' style='padding:7px 14px;border-radius:20px;cursor:pointer;font-size:12px;border:1px solid #c8a96b;background:" + (selectedTemplate.id === t.id ? "#c9a86a" : "#f3e7d3") + ";color:" + (selectedTemplate.id === t.id ? "white" : "#8a6a35") + ";font-weight:bold;'>" + t.nom + "</button>";
      }).join("") + "</div></div>" +

      // ÉTAPE 3 — Palette
      "<div style='padding:20px 24px;border-bottom:1px solid #e8d4b0;'>" +
      "<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 10px;'>3 — Choisis une palette</p>" +
      "<div style='display:flex;gap:8px;flex-wrap:wrap;'>" +
      PALETTES.map(function(p) {
        return "<button class='pal-btn' data-pal='" + p.id + "' style='padding:6px 12px;border-radius:20px;cursor:pointer;font-size:11px;border:" + (selectedPalette.id === p.id ? "2px solid #c9a86a" : "1px solid #e8d4b0") + ";background:" + p.bg + ";color:" + p.accent + ";font-weight:bold;'>" + p.nom + "</button>";
      }).join("") + "</div></div>" +

      // ÉTAPE 4 — Personnalisation + Aperçu
      "<div style='display:grid;grid-template-columns:1fr 1fr;gap:0;'>" +

      // Formulaire
      "<div style='padding:20px 24px;border-right:1px solid #e8d4b0;border-bottom:1px solid #e8d4b0;'>" +
      "<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 12px;'>4 — Personnalise</p>" +
      "<div id='champs-form'></div>" +
      "</div>" +

      // Aperçu
      "<div style='padding:20px 24px;border-bottom:1px solid #e8d4b0;'>" +
      "<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 12px;'>Aperçu</p>" +
      "<div id='studio-preview' style='border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.15);'></div>" +
      "</div></div>" +

      // Boutons d'action
      "<div style='padding:20px 24px;display:flex;gap:10px;'>" +
      "<button id='dl-studio' style='flex:1;background:#c9a86a;color:white;border:none;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>⬇️ Télécharger PNG</button>" +
      "</div>" +
      "<div id='studio-msg' style='color:#8b735d;font-size:12px;text-align:center;padding:0 24px 16px;'></div>" +
      "</div>";

    document.getElementById("close-studio").onclick = function() {
      panel.remove(); var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click();
    };

    // Handlers catégorie
    document.querySelectorAll(".cat-btn").forEach(function(btn) {
      btn.onclick = function() {
        selectedCat = btn.getAttribute("data-cat");
        var tplsOfCat = TEMPLATES.filter(function(t) { return t.cat === selectedCat; });
        selectedTemplate = tplsOfCat[0];
        renderStudio();
      };
    });

    // Handlers template
    document.querySelectorAll(".tpl-btn").forEach(function(btn) {
      btn.onclick = function() {
        var tplId = btn.getAttribute("data-tpl");
        selectedTemplate = TEMPLATES.find(function(t) { return t.id === tplId; });
        renderStudio();
      };
    });

    // Handlers palette
    document.querySelectorAll(".pal-btn").forEach(function(btn) {
      btn.onclick = function() {
        var palId = btn.getAttribute("data-pal");
        selectedPalette = PALETTES.find(function(p) { return p.id === palId; });
        renderChamps();
        renderApercu();
        // Update palette buttons style
        document.querySelectorAll(".pal-btn").forEach(function(b) {
          var pId = b.getAttribute("data-pal");
          var p = PALETTES.find(function(x) { return x.id === pId; });
          b.style.border = pId === selectedPalette.id ? "2px solid #c9a86a" : "1px solid #e8d4b0";
        });
      };
    });

    renderChamps();
    renderApercu();

    // Télécharger
    document.getElementById("dl-studio").onclick = function() {
      var svg = document.querySelector("#studio-preview svg");
      if (!svg) return;
      var svgData = new XMLSerializer().serializeToString(svg);
      var canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1080;
      var ctx = canvas.getContext("2d");
      var img = new Image(); img.crossOrigin = "anonymous";
      img.onload = function() {
        ctx.drawImage(img, 0, 0, 1080, 1080);
        var dataUrl = canvas.toDataURL("image/png");
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          var w = window.open(""); w.document.write("<img src='" + dataUrl + "' style='max-width:100%;' /><p style='font-family:Arial;color:#666;font-size:14px;text-align:center;'>Appuie longuement sur l image pour l enregistrer 📲</p>");
        } else {
          var link = document.createElement("a"); link.download = selectedTemplate.nom.replace(/\s/g,"-") + ".png"; link.href = dataUrl; link.click();
        }
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };
  }

  function renderChamps() {
    var form = document.getElementById("champs-form"); if (!form) return;
    var txt = selectedTemplate.defaultText || {};
    var html = "";

    // Bouton upload photo si le template utilise une photo
    var templatesAvecPhoto = ["presentation", "temoignage", "temoignage-vdi", "recru-revenus", "avant-apres", "recru-avant", "vie-phenix", "recru-reconnais"];
    if (templatesAvecPhoto.indexOf(selectedTemplate.id) > -1) {
      html += "<div style='margin-bottom:12px;'><label style='color:#8b735d;font-size:10px;font-weight:bold;display:block;margin-bottom:4px;'>Photo</label>" +
        "<div style='display:flex;align-items:center;gap:8px;'>" +
        "<div id='studio-photo-preview' style='width:44px;height:44px;border-radius:50%;background:#c9a86a;border:2px solid #e8d4b0;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;'>" +
        (photoURL ? "<img src='" + photoURL + "' style='width:100%;height:100%;object-fit:cover;' />" : "<span style='color:white;font-size:16px;'>📷</span>") +
        "</div>" +
        "<label style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:5px 10px;border-radius:8px;cursor:pointer;font-size:11px;font-weight:bold;'>Changer<input type='file' id='studio-photo-input' accept='image/*' style='display:none;' /></label>" +
        "<span id='studio-photo-msg' style='color:#999;font-size:10px;'>JPG ou PNG</span></div></div>";
    }

    (selectedTemplate.champs || []).forEach(function(ch) {
      var label = ch.replace(/([A-Z])/g, " $1").replace(/^./, function(s) { return s.toUpperCase(); });
      html += "<div style='margin-bottom:8px;'><label style='color:#8b735d;font-size:10px;font-weight:bold;display:block;margin-bottom:3px;'>" + label + "</label>" +
        "<input id='champ-" + ch + "' value='" + (txt[ch]||"").replace(/'/g,"&#39;") + "' style='width:100%;padding:6px 8px;border:1px solid #e8d4b0;border-radius:6px;font-size:11px;box-sizing:border-box;' /></div>";
    });
    if (!html) html = "<p style='color:#999;font-size:12px;'>Aucun texte à personnaliser pour ce template.</p>";
    form.innerHTML = html;

    // Handler upload photo
    var photoInput = document.getElementById("studio-photo-input");
    if (photoInput) {
      photoInput.onchange = async function() {
        var file = this.files[0]; if (!file) return;
        document.getElementById("studio-photo-msg").innerText = "Upload...";
        try {
          var fd = new FormData(); fd.append("file", file); fd.append("upload_preset", "baa_avatars"); fd.append("folder", "studio");
          var r = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload", { method: "POST", body: fd });
          var data = await r.json();
          photoURL = data.secure_url;
          // Convertir en base64 pour l'afficher dans le SVG
          var imgEl = new Image(); imgEl.crossOrigin = "anonymous";
          imgEl.onload = function() {
            var c2 = document.createElement("canvas"); c2.width = 200; c2.height = 200;
            c2.getContext("2d").drawImage(imgEl, 0, 0, 200, 200);
            photoURL = c2.toDataURL("image/jpeg", 0.8);
            console.log("photoURL base64 set:", photoURL.length, "chars");
            document.getElementById("studio-photo-preview").innerHTML = "<img src='" + photoURL + "' style='width:100%;height:100%;object-fit:cover;' />";
            document.getElementById("studio-photo-msg").innerText = "Photo ajoutée !";
            setTimeout(function() { document.getElementById("studio-photo-msg").innerText = "JPG ou PNG"; }, 2000);
            console.log("Calling renderApercu...");
            renderApercu();
            console.log("renderApercu called, preview:", document.getElementById("studio-preview") ? "exists" : "MISSING");
          };
          imgEl.src = data.secure_url;
        } catch(e) { document.getElementById("studio-photo-msg").innerText = "Erreur upload"; }
      };
    }

    (selectedTemplate.champs || []).forEach(function(ch) {
      var el = document.getElementById("champ-" + ch);
      if (el) el.addEventListener("input", renderApercu);
    });
  }

  function getChamps() {
    var vals = {};
    (selectedTemplate.champs || []).forEach(function(ch) {
      var el = document.getElementById("champ-" + ch);
      vals[ch] = el ? el.value : (selectedTemplate.defaultText[ch] || "");
    });
    return vals;
  }

  function renderApercu() {
    var preview = document.getElementById("studio-preview"); if (!preview) return;
    var c = getChamps();
    var p = selectedPalette;
    var svg = genTemplateSVG(selectedTemplate.id, c, p);
    preview.innerHTML = svg;
  }

  function txt(s, x, y, size, color, anchor, weight) {
    return "<text x='" + x + "' y='" + y + "' font-family='Arial,sans-serif' font-size='" + size + "' fill='" + color + "' text-anchor='" + (anchor||"middle") + "'" + (weight ? " font-weight='" + weight + "'" : "") + ">" + (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;") + "</text>";
  }

  function rect(x, y, w, h, fill, rx) {
    return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' fill='" + fill + "'" + (rx ? " rx='" + rx + "'" : "") + "/>";
  }

  function gradBar(id, c1, c2) {
    return "<defs><linearGradient id='" + id + "'><stop offset='0%' stop-color='" + c1 + "'/><stop offset='50%' stop-color='" + c2 + "'/><stop offset='100%' stop-color='" + c1 + "'/></linearGradient></defs>";
  }

  function svgWrap(content, bg) {
    return "<svg width='100%' viewBox='0 0 1080 1080' xmlns='http://www.w3.org/2000/svg'>" +
      rect(0, 0, 1080, 1080, bg, 0) + content + "</svg>";
  }

  function photoCircleSVG(cx, cy, r, strokeClr) {
    if (photoURL) {
      return "<defs><clipPath id='pc'><circle cx='" + cx + "' cy='" + cy + "' r='" + r + "'/></clipPath></defs>" +
        "<image href='" + photoURL + "' x='" + (cx-r) + "' y='" + (cy-r) + "' width='" + (r*2) + "' height='" + (r*2) + "' clip-path='url(#pc)'/>" +
        "<circle cx='" + cx + "' cy='" + cy + "' r='" + r + "' fill='none' stroke='" + strokeClr + "' stroke-width='4'/>";
    }
    return "<circle cx='" + cx + "' cy='" + cy + "' r='" + r + "' fill='" + strokeClr + "' opacity='0.2' stroke='" + strokeClr + "' stroke-width='4'/>" +
      "<text x='" + cx + "' y='" + (cy+20) + "' font-family='Arial' font-size='80' fill='" + strokeClr + "' text-anchor='middle'>📷</text>";
  }

  function genTemplateSVG(id, c, p) {
    var W = 1080;
    switch(id) {
      case "mise-avant":
        return svgWrap(
          gradBar("g1", p.accent, p.accent2) +
          rect(0, 0, W, 12, "url(#g1)") +
          rect(0, W-8, W, 8, "url(#g1)") +
          rect(W*0.52, 0, W*0.48, W, p.card) +
          "<circle cx='280' cy='540' r='220' fill='" + p.card + "' stroke='" + p.accent + "' stroke-width='3'/>" +
          txt("✨", 280, 560, 120, p.accent, "middle") +
          "<rect x='" + (W*0.58) + "' y='80' width='160' height='50' rx='25' fill='" + p.accent + "'/>" +
          txt(c.tag||"NOUVEAU", W*0.66, 114, 28, p.bg, "middle", "bold") +
          txt(c.produit||"Produit", W*0.75, 280, 52, p.accent2, "middle", "bold") +
          txt(c.description||"", W*0.75, 360, 30, p.text2, "middle") +
          "<line x1='" + (W*0.58) + "' y1='420' x2='" + (W*0.92) + "' y2='420' stroke='" + p.accent + "' stroke-width='1' opacity='0.4'/>" +
          txt(c.cta||"Disponible maintenant", W*0.75, 480, 26, p.text, "middle"),
        p.bg);

      case "avant-apres":
        return svgWrap(
          rect(0, 0, W*0.5, W, "#f5f5f5") +
          rect(W*0.5, 0, W*0.5, W, p.card) +
          rect(W/2-2, 0, 4, W, p.accent) +
          "<circle cx='540' cy='540' r='50' fill='" + p.bg + "'/>" +
          txt("→", 540, 558, 48, p.accent, "middle", "bold") +
          txt("😕", W*0.25, 420, 180, p.text, "middle") +
          txt("✨", W*0.75, 420, 180, p.accent, "middle") +
          txt(c.avantLabel||"AVANT", W*0.25, 820, 36, "#999999", "middle", "bold") +
          txt(c.apresLabel||"APRÈS", W*0.75, 820, 36, p.accent, "middle", "bold") +
          rect(0, W-6, W, 6, p.accent) +
          txt(c.titre||"Ma transformation", W/2, 950, 38, p.text, "middle", "bold") +
          txt(c.produit||"avec la gamme Mihi", W/2, 1010, 28, p.text2, "middle"),
        p.bg);

      case "motivation":
        return svgWrap(
          gradBar("gm", p.accent, p.accent2) +
          rect(0, 0, W, 12, "url(#gm)") +
          txt("MOTIVATION", W/2, 120, 36, p.text2, "middle", "bold") +
          "<text x='540' y='500' font-family='Georgia,serif' font-size='72' fill='" + p.accent + "' text-anchor='middle' font-weight='bold'>\u201c</text>" +
          "<text x='540' y='620' font-family='Georgia,serif' font-size='56' fill='" + p.text + "' text-anchor='middle' font-weight='bold'>" + (c.citation||"").substring(0,25) + "</text>" +
          "<text x='540' y='700' font-family='Georgia,serif' font-size='56' fill='" + p.text + "' text-anchor='middle' font-weight='bold'>" + (c.citation||"").substring(25,50) + "</text>" +
          "<line x1='380' y1='820' x2='700' y2='820' stroke='" + p.accent + "' stroke-width='2' opacity='0.4'/>" +
          txt(c.auteur||"Phénix Academy", W/2, 900, 32, p.accent, "middle"),
        p.bg);

      case "conseil-jour":
        return svgWrap(
          gradBar("gc", p.accent, p.accent2) +
          rect(0, 0, W, 12, "url(#gc)") +
          rect(0, 12, 8, W-12, "url(#gc)") +
          txt("01", 80, 280, 180, p.card, "start", "bold") +
          txt(c.titre||"Conseil beauté", W/2, 320, 50, p.text, "middle", "bold") +
          "<line x1='200' y1='380' x2='880' y2='380' stroke='" + p.accent + "' stroke-width='1' opacity='0.3'/>" +
          txt(c.texte ? (c.texte).substring(0,45) : "", W/2, 480, 36, p.text2, "middle") +
          txt(c.texte ? (c.texte).substring(45,90) : "", W/2, 535, 36, p.text2, "middle") +
          txt(c.texte ? (c.texte).substring(90,135) : "", W/2, 590, 36, p.text2, "middle") +
          txt("Beauty Addict ✦", W-60, W-60, 28, p.text2, "end"),
        p.bg);

      case "promo-flash":
        return svgWrap(
          gradBar("gp", p.accent, p.accent2) +
          "<circle cx='540' cy='480' r='320' fill='" + p.card + "' opacity='0.5'/>" +
          txt(c.pct||"-30%", W/2, 460, 220, p.accent2, "middle", "bold") +
          txt("PROMO FLASH", W/2, 560, 52, p.accent, "middle", "bold") +
          txt(c.produit||"Sur toute la gamme", W/2, 640, 36, p.text2, "middle") +
          rect(W/2-160, 780, 320, 80, p.accent, 40) +
          txt(c.cta||"Voir le catalogue →", W/2, 830, 34, p.bg, "middle", "bold"),
        p.bg);

      case "recru-reconnais":
        return svgWrap(
          gradBar("gr", p.accent, p.accent2) +
          rect(0, 0, W, 12, "url(#gr)") +
          txt("TU TE RECONNAIS ?", W/2, 100, 40, p.text2, "middle", "bold") +
          txt("Ce post est fait pour toi si...", W/2, 180, 50, p.text, "middle", "bold") +
          "<line x1='200' y1='230' x2='880' y2='230' stroke='" + p.accent + "' stroke-width='1' opacity='0.3'/>" +
          [c.check1, c.check2, c.check3, c.check4].map(function(ch, i) {
            return rect(100, 280+i*140, 880, 110, p.card, 14) +
              rect(120, 310+i*140, 50, 50, p.accent + "33", 8) +
              txt("✓", 145, 345+i*140, 36, p.accent, "middle", "bold") +
              txt(ch||"", 220, 348+i*140, 36, p.text, "start");
          }).join("") +
          rect(W/2-220, 880, 440, 80, p.accent, 40) +
          txt(c.cta||"Écris-moi maintenant →", W/2, 930, 34, p.bg, "middle", "bold"),
        p.bg);

      case "temoignage":
        return svgWrap(
          rect(0, 0, W, W*0.35, p.accent) +
          photoCircleSVG(540, W*0.35, 100, p.bg) +
          txt("★★★★★", W/2, W*0.35+160, 60, "#EF9F27", "middle") +
          txt(c.nom||"Sophie", W/2, W*0.35+250, 52, p.text, "middle", "bold") +
          txt(c.age||"34 ans", W/2, W*0.35+310, 34, p.text2, "middle") +
          "<text x='540' y='" + (W*0.35+420) + "' font-family='Arial' font-size='36' fill='" + p.text2 + "' text-anchor='middle' font-style='italic'>" + (c.texte||"").substring(0,40) + "</text>" +
          "<text x='540' y='" + (W*0.35+470) + "' font-family='Arial' font-size='36' fill='" + p.text2 + "' text-anchor='middle' font-style='italic'>" + (c.texte||"").substring(40,80) + "</text>" +
          "<text x='540' y='" + (W*0.35+520) + "' font-family='Arial' font-size='36' fill='" + p.text2 + "' text-anchor='middle' font-style='italic'>" + (c.texte||"").substring(80,120) + "</text>" +
          txt("Beauty Addict ✦", W/2, 1020, 30, p.accent, "middle"),
        p.bg);

      case "presentation":
        return svgWrap(
          gradBar("gpres", p.accent, p.accent2) +
          rect(0, 0, W, W, "url(#gpres)") +
          photoCircleSVG(540, 320, 180, "rgba(255,255,255,0.4)") +
          txt(c.nom||"Marie Dupont", W/2, 560, 60, "white", "middle", "bold") +
          txt(c.titre||"CONSEILLÈRE BEAUTÉ", W/2, 640, 36, "rgba(255,255,255,0.7)", "middle") +
          "<line x1='240' y1='700' x2='840' y2='700' stroke='rgba(255,255,255,0.2)' stroke-width='1'/>" +
          txt("✉ " + (c.email||"email@example.com"), W/2, 780, 32, "rgba(255,255,255,0.7)", "middle") +
          txt("📱 " + (c.tel||"06 XX XX XX XX"), W/2, 840, 32, "rgba(255,255,255,0.7)", "middle") +
          txt("🛍 " + (c.catalogue||"Mon catalogue Mihi"), W/2, 900, 32, "rgba(255,255,255,0.7)", "middle"),
        p.accent);

      default:
        return svgWrap(
          gradBar("gd", p.accent, p.accent2) +
          rect(0, 0, W, 12, "url(#gd)") +
          txt(selectedTemplate.nom, W/2, W/2, 60, p.text, "middle", "bold") +
          txt("Beauty Addict", W/2, W/2+80, 36, p.text2, "middle"),
        p.bg);
    }
  }
}

window.openStudioPanel = openStudioPanel;
