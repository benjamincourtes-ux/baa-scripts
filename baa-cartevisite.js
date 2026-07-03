function openCarteVisitePanel() {
  if (document.getElementById("baa-carte-panel")) return;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;

  var THEMES = [
    { id: "dore", nom: "Doré élégant" },
    { id: "noir", nom: "Noir minimaliste" },
    { id: "violet", nom: "Violet Phénix" },
    { id: "nature", nom: "Nature Luxe" },
    { id: "soleil", nom: "Coucher de soleil" },
    { id: "corail", nom: "Corail tropical" },
    { id: "marbre", nom: "Marbre blanc" }
  ];

  var panel = document.createElement("div"); panel.id = "baa-carte-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:30px;overflow-y:auto;";
  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:92%;max-width:720px;border-radius:20px;padding:28px;font-family:Arial,sans-serif;max-height:92vh;overflow-y:auto;margin-bottom:30px;";
  panel.appendChild(box); document.body.appendChild(panel);
  panel.onclick = function(e) { if (e.target === panel) panel.remove(); };

  var userData = {};
  var cartePhotoURL = "";
  var carteActuelle = 0;
  var mesCartes = [];

  db.collection("users").doc(uid).get().then(function(snap) {
    userData = snap.data() || {};
    mesCartes = userData.cartesVisite || [];
    if (mesCartes.length === 0) {
      mesCartes.push({ nom: "Ma carte", theme: "dore", prenom: userData.prenom||"", nom2: userData.nom||"", email: userData.email||"", tel: "", societe: "Beauty Addict", catalogue: "", fb: "", insta: "", photoURL: userData.photoURL||"" });
    }
    renderPanel();
  });

  function renderPanel() {
    var cv = mesCartes[carteActuelle] || {};
    var themeActuel = cv.theme || "dore";
    cartePhotoURL = cv.photoURL || userData.photoURL || "";

    box.innerHTML =
      "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'><h2 style='color:#8b735d;margin:0;'>💳 Ma Carte de Visite</h2><span id='close-carte' style='cursor:pointer;font-size:28px;color:#8b735d;'>✕</span></div>" +

      // Sélecteur de cartes
      "<div style='background:white;border-radius:14px;padding:14px;border:1px solid #e8d4b0;margin-bottom:16px;'><div style='display:flex;gap:8px;align-items:center;flex-wrap:wrap;'>" +
      mesCartes.map(function(c, i) {
        return "<button class='carte-selector' data-idx='" + i + "' style='padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;border:1px solid #c8a96b;background:" + (carteActuelle === i ? "#c9a86a" : "#f3e7d3") + ";color:" + (carteActuelle === i ? "white" : "#8a6a35") + ";'>" + (c.nom || "Carte " + (i+1)) + "</button>";
      }).join("") +
      "<button id='add-carte' style='padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;border:1px dashed #c8a96b;background:transparent;color:#c9a86a;'>+ Nouvelle carte</button>" +
      (mesCartes.length > 1 ? "<button id='del-carte' style='padding:7px 10px;border-radius:8px;cursor:pointer;font-size:12px;border:1px solid #fca5a5;background:#fff5f5;color:#e74c3c;margin-left:auto;'>🗑️</button>" : "") +
      "</div></div>" +

      // Nom de la carte
      "<div style='margin-bottom:12px;display:flex;gap:8px;align-items:center;'><input id='cv-nomcarte' value='" + (cv.nom||"Ma carte").replace(/'/g,"&#39;") + "' placeholder='Nom de cette carte' style='flex:1;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;' /><span style='color:#999;font-size:12px;'>Nom de la carte</span></div>" +

      // Aperçu
      "<div id='carte-preview-wrap' style='margin-bottom:20px;display:flex;justify-content:center;'></div>" +

      // Choix du thème
      "<div style='background:white;border-radius:14px;padding:18px;border:1px solid #e8d4b0;margin-bottom:16px;'><p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 12px;'>Choisir un visuel</p><div style='display:flex;gap:8px;flex-wrap:wrap;' id='theme-btns'>" +
      THEMES.map(function(t) {
        return "<button class='theme-btn' data-theme='" + t.id + "' style='padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;border:1px solid #c8a96b;background:" + (themeActuel === t.id ? "#c9a86a" : "#f3e7d3") + ";color:" + (themeActuel === t.id ? "white" : "#8a6a35") + ";'>" + t.nom + "</button>";
      }).join("") + "</div></div>" +

      // Formulaire
      "<div style='background:white;border-radius:14px;padding:18px;border:1px solid #e8d4b0;margin-bottom:16px;'><p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 14px;'>Mes informations</p>" +
      "<div style='display:grid;grid-template-columns:1fr 1fr;gap:10px;'>" +
      champ("cv-prenom", "Prénom", cv.prenom || userData.prenom || "") +
      champ("cv-nom", "Nom", cv.nom2 || userData.nom || "") +
      champ("cv-email", "Email", cv.email || userData.email || "") +
      champ("cv-tel", "Téléphone", cv.tel || "") +
      champ("cv-societe", "Société", cv.societe || "Beauty Addict") +
      champ("cv-catalogue", "Lien catalogue", cv.catalogue || "") +
      champ("cv-fb", "Lien Facebook", cv.fb || "") +
      champ("cv-insta", "Lien Instagram", cv.insta || "") +
      "</div>" +
      "<div style='margin-top:12px;'><label style='color:#8b735d;font-size:12px;font-weight:bold;display:block;margin-bottom:6px;'>Photo de profil</label>" +
      "<div style='display:flex;align-items:center;gap:12px;'>" +
      "<div id='carte-photo-preview' style='width:54px;height:54px;border-radius:50%;border:2px solid #e8d4b0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#c9a86a;flex-shrink:0;'>" +
      (cartePhotoURL ? "<img src='" + cartePhotoURL + "' style='width:100%;height:100%;object-fit:cover;' />" : "<span style='color:white;font-size:20px;font-weight:bold;'>" + ((userData.prenom||"?")[0]).toUpperCase() + "</span>") +
      "</div>" +
      "<label style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;display:inline-block;'>📷 Changer<input type='file' id='carte-photo-input' accept='image/*' style='display:none;' /></label>" +
      "<span id='carte-photo-msg' style='color:#999;font-size:11px;'>JPG ou PNG recommandé</span></div></div></div>" +

      "<div style='display:flex;gap:10px;'>" +
      "<button id='save-carte' style='flex:1;background:#c9a86a;color:white;border:none;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>Sauvegarder</button>" +
      "<button id='dl-carte' style='flex:1;background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>⬇️ PNG</button>" +
      "<button id='share-carte' style='flex:1;background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>🔗 Partager</button>" +
      "</div>" +
      "<div id='carte-msg' style='color:#8b735d;font-size:12px;text-align:center;margin-top:8px;'></div>";

    document.getElementById("close-carte").onclick = function() { panel.remove(); var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click(); };

    // Sélecteur de cartes
    document.querySelectorAll(".carte-selector").forEach(function(btn) {
      btn.onclick = function() { carteActuelle = parseInt(btn.getAttribute("data-idx")); renderPanel(); };
    });

    document.getElementById("add-carte").onclick = function() {
      mesCartes.push({ nom: "Carte " + (mesCartes.length + 1), theme: "dore", prenom: userData.prenom||"", nom2: userData.nom||"", email: userData.email||"", tel: "", societe: "Beauty Addict", catalogue: "", fb: "", insta: "", photoURL: userData.photoURL||"" });
      carteActuelle = mesCartes.length - 1;
      renderPanel();
    };

    if (document.getElementById("del-carte")) {
      document.getElementById("del-carte").onclick = function() {
        if (!confirm("Supprimer cette carte ?")) return;
        mesCartes.splice(carteActuelle, 1);
        carteActuelle = Math.max(0, carteActuelle - 1);
        renderPanel();
      };
    }

    // Thèmes
    document.querySelectorAll(".theme-btn").forEach(function(btn) {
      btn.onclick = function() {
        themeActuel = btn.getAttribute("data-theme");
        document.querySelectorAll(".theme-btn").forEach(function(b) { b.style.background = "#f3e7d3"; b.style.color = "#8a6a35"; });
        btn.style.background = "#c9a86a"; btn.style.color = "white";
        renderPreview(themeActuel, getFormData());
      };
    });

    // Inputs
    ["cv-prenom","cv-nom","cv-email","cv-tel","cv-societe","cv-catalogue","cv-fb","cv-insta","cv-nomcarte"].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", function() { renderPreview(themeActuel, getFormData()); });
    });

    // Upload photo
    document.getElementById("carte-photo-input").onchange = async function() {
      var file = this.files[0]; if (!file) return;
      document.getElementById("carte-photo-msg").innerText = "Upload en cours...";
      try {
        var fd = new FormData(); fd.append("file", file); fd.append("upload_preset", "baa_avatars"); fd.append("folder", "cartes");
        var r = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload", { method: "POST", body: fd });
        var data = await r.json();
        cartePhotoURL = data.secure_url;
        document.getElementById("carte-photo-preview").innerHTML = "<img src='" + cartePhotoURL + "' style='width:100%;height:100%;object-fit:cover;' />";
        document.getElementById("carte-photo-msg").innerText = "Photo mise à jour !";
        setTimeout(function() { document.getElementById("carte-photo-msg").innerText = "JPG ou PNG recommandé"; }, 3000);
        renderPreview(themeActuel, getFormData());
      } catch(e) { document.getElementById("carte-photo-msg").innerText = "Erreur upload."; }
    };

    // Sauvegarder
    document.getElementById("save-carte").onclick = function() {
      var data = getFormData(); data.theme = themeActuel; data.nom = document.getElementById("cv-nomcarte").value.trim() || "Ma carte";
      mesCartes[carteActuelle] = data;
      db.collection("users").doc(uid).update({ cartesVisite: mesCartes }).then(function() {
        document.getElementById("carte-msg").innerText = "Carte sauvegardée !";
        setTimeout(function() { document.getElementById("carte-msg").innerText = ""; }, 3000);
      });
    };

    // Télécharger
    document.getElementById("dl-carte").onclick = function() {
      var svg = document.getElementById("carte-svg"); if (!svg) return;
      var svgData = new XMLSerializer().serializeToString(svg);
      var canvas = document.createElement("canvas"); canvas.width = 800; canvas.height = 460;
      var ctx = canvas.getContext("2d");
      var img = new Image(); img.crossOrigin = "anonymous";
      img.onload = function() { ctx.drawImage(img, 0, 0, 800, 460); var link = document.createElement("a"); link.download = "carte-visite.png"; link.href = canvas.toDataURL("image/png"); link.click(); };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    // Partager
    document.getElementById("share-carte").onclick = function() {
      var data = getFormData(); 
      data.theme = themeActuel;
      data.nom = document.getElementById("cv-nomcarte") ? document.getElementById("cv-nomcarte").value.trim() : "Ma carte";
      var msg = document.getElementById("carte-msg");
      msg.innerText = "Sauvegarde en cours...";
      db.collection("cartesVisite").doc(uid + "_" + carteActuelle).set(data).then(function() {
        var lien = "https://inspiring-beijinho-4aa767.netlify.app/?carte=" + uid + "_" + carteActuelle;
        try {
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(lien).then(function() {
              msg.innerText = "🔗 Lien copié !";
              setTimeout(function() { msg.innerText = ""; }, 4000);
            }).catch(function() { copierFallback(lien, msg); });
          } else { copierFallback(lien, msg); }
        } catch(e) { copierFallback(lien, msg); }
      }).catch(function(e) {
        msg.innerText = "Erreur : " + e.message;
      });
    };

    renderPreview(themeActuel, getFormData());
  }

  function copierFallback(texte, msg) {
    var ta = document.createElement("textarea");
    ta.value = texte; ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand("copy"); msg.innerText = "🔗 Lien copié !"; setTimeout(function() { msg.innerText = ""; }, 4000); }
    catch(e) { msg.innerText = texte; }
    document.body.removeChild(ta);
  }

  function champ(id, label, val) {
    return "<div><label style='color:#8b735d;font-size:11px;font-weight:bold;display:block;margin-bottom:4px;'>" + label + "</label><input id='" + id + "' value='" + (val||"").replace(/'/g,"&#39;") + "' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:12px;box-sizing:border-box;' /></div>";
  }

  function getFormData() {
    function v(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
    return { prenom: v("cv-prenom"), nom2: v("cv-nom"), email: v("cv-email"), tel: v("cv-tel"), societe: v("cv-societe"), catalogue: v("cv-catalogue"), fb: v("cv-fb"), insta: v("cv-insta"), photoURL: cartePhotoURL };
  }

  function renderPreview(theme, d) {
    var wrap = document.getElementById("carte-preview-wrap"); if (!wrap) return;
    wrap.innerHTML = genSVG(theme, d);
  }

  function ini(d) { return ((d.prenom||"?")[0]||"").toUpperCase() + ((d.nom2||"")[0]||"").toUpperCase(); }

  function qrSVG(x, y, s, clr) {
    clr = clr || "#333";
    return "<rect x='" + x + "' y='" + y + "' width='" + s + "' height='" + s + "' rx='3' fill='rgba(255,255,255,0.12)'/>" +
      "<rect x='" + (x+3) + "' y='" + (y+3) + "' width='" + (s*0.35) + "' height='" + (s*0.35) + "' rx='1' fill='none' stroke='" + clr + "' stroke-width='1.5'/>" +
      "<rect x='" + (x+s-3-s*0.35) + "' y='" + (y+3) + "' width='" + (s*0.35) + "' height='" + (s*0.35) + "' rx='1' fill='none' stroke='" + clr + "' stroke-width='1.5'/>" +
      "<rect x='" + (x+3) + "' y='" + (y+s-3-s*0.35) + "' width='" + (s*0.35) + "' height='" + (s*0.35) + "' rx='1' fill='none' stroke='" + clr + "' stroke-width='1.5'/>" +
      "<rect x='" + (x+s*0.15) + "' y='" + (y+s*0.15) + "' width='" + (s*0.12) + "' height='" + (s*0.12) + "' fill='" + clr + "'/>" +
      "<rect x='" + (x+s-s*0.15-s*0.12) + "' y='" + (y+s*0.15) + "' width='" + (s*0.12) + "' height='" + (s*0.12) + "' fill='" + clr + "'/>" +
      "<rect x='" + (x+s*0.15) + "' y='" + (y+s-s*0.15-s*0.12) + "' width='" + (s*0.12) + "' height='" + (s*0.12) + "' fill='" + clr + "'/>" +
      "<line x1='" + (x+s*0.5) + "' y1='" + (y+s*0.1) + "' x2='" + (x+s*0.5) + "' y2='" + (y+s*0.9) + "' stroke='" + clr + "' stroke-width='1'/>" +
      "<line x1='" + (x+s*0.1) + "' y1='" + (y+s*0.5) + "' x2='" + (x+s*0.9) + "' y2='" + (y+s*0.5) + "' stroke='" + clr + "' stroke-width='1'/>";
  }

  function photoCircle(d, cx, cy, r, strokeClr) {
    if (d.photoURL) {
      return "<defs><clipPath id='phc'><circle cx='" + cx + "' cy='" + cy + "' r='" + r + "'/></clipPath></defs>" +
        "<image href='" + d.photoURL + "' x='" + (cx-r) + "' y='" + (cy-r) + "' width='" + (r*2) + "' height='" + (r*2) + "' clip-path='url(#phc)'/>" +
        "<circle cx='" + cx + "' cy='" + cy + "' r='" + r + "' fill='none' stroke='" + strokeClr + "' stroke-width='2'/>";
    }
    return "<circle cx='" + cx + "' cy='" + cy + "' r='" + r + "' fill='rgba(201,168,106,0.2)' stroke='" + strokeClr + "' stroke-width='1.5'/>" +
      "<text x='" + cx + "' y='" + (cy+9) + "' text-anchor='middle' font-family='Arial' font-size='24' font-weight='bold' fill='" + strokeClr + "'>" + ini(d) + "</text>";
  }

  function photoRect(d, x, y, w, h, r2, strokeClr) {
    if (d.photoURL) {
      return "<defs><clipPath id='phr'><rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' rx='" + r2 + "'/></clipPath></defs>" +
        "<image href='" + d.photoURL + "' x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' clip-path='url(#phr)'/>" +
        "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' rx='" + r2 + "' fill='none' stroke='" + strokeClr + "' stroke-width='1'/>";
    }
    return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' rx='" + r2 + "' fill='#e0ddd8' stroke='" + strokeClr + "' stroke-width='1'/>" +
      "<text x='" + (x+w/2) + "' y='" + (y+h/2+10) + "' text-anchor='middle' font-family='Georgia,serif' font-size='32' font-weight='bold' fill='" + strokeClr + "'>" + ini(d) + "</text>";
  }


  function fbIcon(x, y, s, clr) {
    return "<rect x='" + x + "' y='" + y + "' width='" + s + "' height='" + s + "' rx='" + (s*0.2) + "' fill='" + clr + "' opacity='0.3'/>" +
      "<text x='" + (x+s/2) + "' y='" + (y+s*0.72) + "' text-anchor='middle' font-family='Arial' font-size='" + (s*0.65) + "' font-weight='bold' fill='" + clr + "'>f</text>";
  }
  function igIcon(x, y, s, clr) {
    return "<rect x='" + x + "' y='" + y + "' width='" + s + "' height='" + s + "' rx='" + (s*0.25) + "' fill='none' stroke='" + clr + "' stroke-width='1.5' opacity='0.8'/>" +
      "<circle cx='" + (x+s/2) + "' cy='" + (y+s/2) + "' r='" + (s*0.22) + "' fill='none' stroke='" + clr + "' stroke-width='1.2' opacity='0.8'/>" +
      "<circle cx='" + (x+s*0.72) + "' cy='" + (y+s*0.28) + "' r='" + (s*0.07) + "' fill='" + clr + "' opacity='0.8'/>";
  }
  function genSVG(theme, d) {
    var W = 680, H = 390;
    var nm = (d.prenom||"Prénom") + " " + (d.nom2||"Nom");
    var soc = d.societe || "Beauty Addict";
    var em = d.email || "email@example.com";
    var tel = d.tel || "06 XX XX XX XX";
    var fb = d.fb ? d.fb.replace(/https?:\/\/(www\.)?facebook\.com\//,"") : "";
    var ig = d.insta ? d.insta.replace(/https?:\/\/(www\.)?instagram\.com\//,"") : "";
    if (ig && ig[0] !== "@") ig = "@" + ig;
    var cat = d.catalogue ? (d.catalogue.replace(/https?:\/\/(www\.)?/,"").split("/")[0]) : "";

    var svg = "<svg id='carte-svg' width='100%' viewBox='0 0 " + W + " " + H + "' xmlns='http://www.w3.org/2000/svg' style='border-radius:14px;max-width:540px;'>";

    if (theme === "dore") {
      svg += "<defs><linearGradient id='gd' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#c9a86a'/><stop offset='50%' stop-color='#f5d48a'/><stop offset='100%' stop-color='#c9a86a'/></linearGradient></defs>";
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='#1a0a00'/>";
      svg += "<polygon points='" + W*0.55 + ",0 " + W + ",0 " + W + "," + H + " " + W*0.45 + "," + H + "' fill='url(#gd)'/>";
      svg += photoCircle(d, 90, H/2, 55, "#c9a86a");
      svg += "<text x='180' y='" + (H*0.28) + "' font-family='Arial' font-size='22' font-weight='bold' fill='#f5d48a' letter-spacing='1'>" + nm + "</text>";
      svg += "<text x='180' y='" + (H*0.43) + "' font-family='Arial' font-size='12' fill='#c9a86a' letter-spacing='2'>" + soc.toUpperCase() + "</text>";
      svg += "<line x1='180' y1='" + (H*0.51) + "' x2='430' y2='" + (H*0.51) + "' stroke='#c9a86a' stroke-width='0.5' opacity='0.5'/>";
      svg += "<text x='180' y='" + (H*0.61) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.65)'>✉ " + em + "</text>";
      svg += "<text x='180' y='" + (H*0.72) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.65)'>📱 " + tel + "</text>";
      var y83 = H*0.83; var xCur = 180;
      if (fb) { svg += fbIcon(xCur, y83-11, 13, "#c9a86a"); svg += "<text x='" + (xCur+16) + "' y='" + y83 + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.5)'>" + fb + "</text>"; xCur += 160; }
      if (ig) { svg += igIcon(xCur, y83-11, 13, "#c9a86a"); svg += "<text x='" + (xCur+16) + "' y='" + y83 + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.5)'>" + ig + "</text>"; }
      if (cat) svg += "<text x='180' y='" + (H*0.93) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.4)'>🛍 " + cat + "</text>";
      svg += qrSVG(W*0.83, H*0.53, 68, "#c9a86a");

    } else if (theme === "noir") {
      svg += "<defs><linearGradient id='gv' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='#c9a86a'/><stop offset='50%' stop-color='#f5d48a'/><stop offset='100%' stop-color='#c9a86a'/></linearGradient></defs>";
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='#0f0f0f'/>";
      svg += "<rect x='0' y='0' width='6' height='" + H + "' rx='3' fill='url(#gv)'/>";
      svg += photoCircle(d, 110, 90, 55, "#c9a86a");
      svg += "<text x='190' y='70' font-family='Arial' font-size='24' font-weight='bold' fill='white'>" + nm + "</text>";
      svg += "<text x='190' y='100' font-family='Arial' font-size='11' fill='#c9a86a' letter-spacing='2'>" + soc.toUpperCase() + "</text>";
      svg += "<line x1='190' y1='118' x2='" + (W-40) + "' y2='118' stroke='#333' stroke-width='0.5'/>";
      svg += "<text x='190' y='148' font-family='Arial' font-size='13' fill='#888'>✉ " + em + "</text>";
      svg += "<text x='190' y='173' font-family='Arial' font-size='13' fill='#888'>📱 " + tel + "</text>";
      var xCur2 = 190;
      if (fb) { svg += fbIcon(xCur2, 187, 13, "#c9a86a"); svg += "<text x='" + (xCur2+16) + "' y='198' font-family='Arial' font-size='11' fill='#555'>" + fb + "</text>"; xCur2 += 160; }
      if (ig) { svg += igIcon(xCur2, 187, 13, "#c9a86a"); svg += "<text x='" + (xCur2+16) + "' y='198' font-family='Arial' font-size='11' fill='#555'>" + ig + "</text>"; }
      if (cat) svg += "<text x='190' y='225' font-family='Arial' font-size='11' fill='#444'>🛍 " + cat + "</text>";
      svg += qrSVG(W*0.83, H*0.5, 68, "#c9a86a");

    } else if (theme === "violet") {
      svg += "<defs><linearGradient id='gvio' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#26215C'/><stop offset='100%' stop-color='#534AB7'/></linearGradient></defs>";
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='url(#gvio)'/>";
      svg += photoCircle(d, 90, H*0.4, 58, "rgba(255,255,255,0.4)");
      svg += "<text x='175' y='" + (H*0.25) + "' font-family='Arial' font-size='22' font-weight='bold' fill='white'>" + nm + "</text>";
      svg += "<text x='175' y='" + (H*0.39) + "' font-family='Arial' font-size='13' fill='rgba(255,255,255,0.65)'>" + soc + "</text>";
      svg += "<line x1='175' y1='" + (H*0.49) + "' x2='" + (W-50) + "' y2='" + (H*0.49) + "' stroke='rgba(255,255,255,0.2)' stroke-width='0.5'/>";
      svg += "<text x='175' y='" + (H*0.59) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.6)'>✉ " + em + "</text>";
      svg += "<text x='175' y='" + (H*0.71) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.6)'>📱 " + tel + "</text>";
      var xCur3 = 175;
      if (fb) { svg += fbIcon(xCur3, H*0.83-11, 13, "rgba(255,255,255,0.7)"); svg += "<text x='" + (xCur3+16) + "' y='" + (H*0.83) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.45)'>" + fb + "</text>"; xCur3 += 160; }
      if (ig) { svg += igIcon(xCur3, H*0.83-11, 13, "rgba(255,255,255,0.7)"); svg += "<text x='" + (xCur3+16) + "' y='" + (H*0.83) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.45)'>" + ig + "</text>"; }
      if (cat) svg += "<text x='175' y='" + (H*0.93) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.35)'>🛍 " + cat + "</text>";
      svg += qrSVG(W*0.83, H*0.54, 65, "rgba(255,255,255,0.7)");

    } else if (theme === "nature") {
      svg += "<defs><linearGradient id='gh'><stop offset='0%' stop-color='#c9a86a'/><stop offset='50%' stop-color='#f5d48a'/><stop offset='100%' stop-color='#c9a86a'/></linearGradient><linearGradient id='gv2' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='#c9a86a'/><stop offset='50%' stop-color='#f5d48a'/><stop offset='100%' stop-color='#c9a86a'/></linearGradient></defs>";
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='#f8f4ee'/>";
      svg += "<rect x='0' y='0' width='" + W + "' height='7' rx='3' fill='url(#gh)'/>";
      svg += "<rect x='0' y='" + (H-5) + "' width='" + W + "' height='5' rx='2' fill='url(#gh)'/>";
      svg += "<rect x='0' y='7' width='5' height='" + (H-12) + "' fill='url(#gv2)'/>";
      svg += photoCircle(d, W-90, H*0.4, 65, "#c9a86a");
      svg += "<text x='30' y='" + (H*0.25) + "' font-family='Georgia,serif' font-size='26' font-weight='bold' fill='#3d1f05'>" + nm + "</text>";
      svg += "<text x='30' y='" + (H*0.39) + "' font-family='Georgia,serif' font-size='14' fill='#8a6a35' font-style='italic'>" + soc + "</text>";
      svg += "<line x1='30' y1='" + (H*0.49) + "' x2='" + (W*0.55) + "' y2='" + (H*0.49) + "' stroke='#c9a86a' stroke-width='0.5'/>";
      svg += "<text x='30' y='" + (H*0.59) + "' font-family='Arial' font-size='12' fill='#666'>✉ " + em + "</text>";
      svg += "<text x='30' y='" + (H*0.71) + "' font-family='Arial' font-size='12' fill='#666'>📱 " + tel + "</text>";
      var xCur4 = 30;
      if (fb) { svg += fbIcon(xCur4, H*0.83-11, 13, "#8a6a35"); svg += "<text x='" + (xCur4+16) + "' y='" + (H*0.83) + "' font-family='Arial' font-size='11' fill='#888'>" + fb + "</text>"; xCur4 += 160; }
      if (ig) { svg += igIcon(xCur4, H*0.83-11, 13, "#8a6a35"); svg += "<text x='" + (xCur4+16) + "' y='" + (H*0.83) + "' font-family='Arial' font-size='11' fill='#888'>" + ig + "</text>"; }
      if (cat) svg += "<text x='30' y='" + (H*0.93) + "' font-family='Arial' font-size='11' fill='#aaa'>🛍 " + cat + "</text>";

    } else if (theme === "soleil") {
      svg += "<defs><radialGradient id='gsol'><stop offset='0%' stop-color='#f5d48a'/><stop offset='40%' stop-color='#D85A30'/><stop offset='100%' stop-color='transparent'/></radialGradient></defs>";
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='#0d0d0d'/>";
      svg += "<circle cx='" + (W*0.85) + "' cy='" + (H*0.8) + "' r='200' fill='url(#gsol)' opacity='0.45'/>";
      for (var i=0; i<4; i++) { svg += "<line x1='0' y1='" + (H*(0.35+i*0.08)) + "' x2='" + W + "' y2='" + (H*(0.35+i*0.08)) + "' stroke='rgba(245,212,138," + (0.12-i*0.02) + ")' stroke-width='0.5'/>"; }
      svg += photoCircle(d, W*0.82, H*0.35, 55, "#D85A30");
      svg += "<text x='30' y='" + (H*0.22) + "' font-family='Arial' font-size='24' font-weight='bold' fill='#f5d48a' letter-spacing='1'>" + nm + "</text>";
      svg += "<text x='30' y='" + (H*0.37) + "' font-family='Arial' font-size='12' fill='#D85A30' letter-spacing='2'>" + soc.toUpperCase() + "</text>";
      svg += "<line x1='30' y1='" + (H*0.47) + "' x2='" + (W*0.5) + "' y2='" + (H*0.47) + "' stroke='#D85A30' stroke-width='1'/>";
      svg += "<text x='30' y='" + (H*0.59) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.6)'>✉ " + em + "</text>";
      svg += "<text x='30' y='" + (H*0.71) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.6)'>📱 " + tel + "</text>";
      var xCur5 = 30;
      if (fb) { svg += fbIcon(xCur5, H*0.83-11, 13, "#D85A30"); svg += "<text x='" + (xCur5+16) + "' y='" + (H*0.83) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.45)'>" + fb + "</text>"; xCur5 += 160; }
      if (ig) { svg += igIcon(xCur5, H*0.83-11, 13, "#D85A30"); svg += "<text x='" + (xCur5+16) + "' y='" + (H*0.83) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.45)'>" + ig + "</text>"; }
      if (cat) svg += "<text x='30' y='" + (H*0.93) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.3)'>🛍 " + cat + "</text>";

    } else if (theme === "corail") {
      svg += "<defs><linearGradient id='gcor' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#FAECE7'/><stop offset='100%' stop-color='white'/></linearGradient></defs>";
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='url(#gcor)'/>";
      svg += photoCircle(d, 90, H*0.4, 60, "#D85A30");
      svg += "<text x='180' y='" + (H*0.23) + "' font-family='Arial' font-size='22' font-weight='bold' fill='#1a1a1a'>" + nm + "</text>";
      svg += "<text x='180' y='" + (H*0.37) + "' font-family='Arial' font-size='13' fill='#D85A30' font-weight='500'>" + soc + "</text>";
      svg += "<line x1='180' y1='" + (H*0.47) + "' x2='" + (W-40) + "' y2='" + (H*0.47) + "' stroke='#F5C4B3' stroke-width='1'/>";
      svg += "<text x='180' y='" + (H*0.59) + "' font-family='Arial' font-size='12' fill='#666'>✉ " + em + "</text>";
      svg += "<text x='180' y='" + (H*0.71) + "' font-family='Arial' font-size='12' fill='#666'>📱 " + tel + "</text>";
      var xCur6 = 180;
      if (fb) { svg += fbIcon(xCur6, H*0.83-11, 13, "#D85A30"); svg += "<text x='" + (xCur6+16) + "' y='" + (H*0.83) + "' font-family='Arial' font-size='11' fill='#999'>" + fb + "</text>"; xCur6 += 160; }
      if (ig) { svg += igIcon(xCur6, H*0.83-11, 13, "#D85A30"); svg += "<text x='" + (xCur6+16) + "' y='" + (H*0.83) + "' font-family='Arial' font-size='11' fill='#999'>" + ig + "</text>"; }
      if (cat) svg += "<text x='180' y='" + (H*0.93) + "' font-family='Arial' font-size='11' fill='#bbb'>🛍 " + cat + "</text>";
      svg += qrSVG(W*0.84, H*0.6, 65, "#D85A30");

    } else if (theme === "marbre") {
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='#f9f7f4'/>";
      for (var j=0; j<8; j++) { svg += "<line x1='" + (j*90-20) + "' y1='0' x2='" + (j*90+60) + "' y2='" + H + "' stroke='rgba(150,140,130,0.05)' stroke-width='8'/>"; }
      svg += "<rect x='0' y='0' width='" + W + "' height='7' rx='3' fill='#1a1a1a'/>";
      svg += photoRect(d, W-160, 25, 120, 120, 8, "#ccc");
      svg += "<text x='30' y='" + (H*0.3) + "' font-family='Georgia,serif' font-size='26' font-weight='bold' fill='#1a1a1a'>" + nm + "</text>";
      svg += "<text x='30' y='" + (H*0.44) + "' font-family='Georgia,serif' font-size='14' fill='#666' font-style='italic'>" + soc + "</text>";
      svg += "<line x1='30' y1='" + (H*0.53) + "' x2='" + (W-170) + "' y2='" + (H*0.53) + "' stroke='#1a1a1a' stroke-width='0.5' opacity='0.2'/>";
      svg += "<text x='30' y='" + (H*0.63) + "' font-family='Arial' font-size='12' fill='#555'>✉ " + em + "</text>";
      svg += "<text x='30' y='" + (H*0.74) + "' font-family='Arial' font-size='12' fill='#555'>📱 " + tel + "</text>";
      var xCur7 = 30;
      if (fb) { svg += fbIcon(xCur7, H*0.85-11, 13, "#555"); svg += "<text x='" + (xCur7+16) + "' y='" + (H*0.85) + "' font-family='Arial' font-size='11' fill='#888'>" + fb + "</text>"; xCur7 += 160; }
      if (ig) { svg += igIcon(xCur7, H*0.85-11, 13, "#555"); svg += "<text x='" + (xCur7+16) + "' y='" + (H*0.85) + "' font-family='Arial' font-size='11' fill='#888'>" + ig + "</text>"; }
      if (cat) svg += "<text x='30' y='" + (H*0.95) + "' font-family='Arial' font-size='11' fill='#aaa'>🛍 " + cat + "</text>";
      svg += qrSVG(W*0.84, H*0.62, 60, "#1a1a1a");
    }

    svg += "</svg>";
    return svg;
  }
}

window.openCarteVisitePanel = openCarteVisitePanel;
