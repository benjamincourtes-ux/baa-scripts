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
  db.collection("users").doc(uid).get().then(function(snap) {
    userData = snap.data() || {};
    renderPanel();
  });

  var cartePhotoURL = "";

  function renderPanel() {
    var cv = userData.carteVisite || {};
    var themeActuel = cv.theme || "dore";

    box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'><h2 style='color:#8b735d;margin:0;'>💳 Ma Carte de Visite</h2><span id='close-carte' style='cursor:pointer;font-size:28px;color:#8b735d;'>✕</span></div>" +

    // Aperçu carte
    "<div id='carte-preview-wrap' style='margin-bottom:20px;display:flex;justify-content:center;'></div>" +

    // Choix du thème
    "<div style='background:white;border-radius:14px;padding:18px;border:1px solid #e8d4b0;margin-bottom:16px;'><p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 12px;'>Choisir un visuel</p><div style='display:flex;gap:8px;flex-wrap:wrap;' id='theme-btns'>" +
    THEMES.map(function(t) {
      return "<button class='theme-btn' data-theme='" + t.id + "' style='padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;border:1px solid #c8a96b;background:" + (themeActuel === t.id ? "#c9a86a" : "#f3e7d3") + ";color:" + (themeActuel === t.id ? "white" : "#8a6a35") + ";'>" + t.nom + "</button>";
    }).join("") +
    "</div></div>" +

    // Formulaire
    "<div style='background:white;border-radius:14px;padding:18px;border:1px solid #e8d4b0;margin-bottom:16px;'><p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 14px;'>Mes informations</p>" +
    "<div style='display:grid;grid-template-columns:1fr 1fr;gap:10px;'>" +
    champ("cv-prenom", "Prénom", cv.prenom || userData.prenom || "") +
    champ("cv-nom", "Nom", cv.nom || userData.nom || "") +
    champ("cv-email", "Email", cv.email || userData.email || "") +
    champ("cv-tel", "Téléphone", cv.tel || "") +
    champ("cv-societe", "Société", cv.societe || "Beauty Addict") +
    champ("cv-catalogue", "Lien catalogue", cv.catalogue || "") +
    champ("cv-fb", "Lien Facebook", cv.fb || "") +
    champ("cv-insta", "Lien Instagram", cv.insta || "") +
    "</div><div style='margin-top:12px;'><label style='color:#8b735d;font-size:12px;font-weight:bold;display:block;margin-bottom:6px;'>Photo de profil</label><div style='display:flex;align-items:center;gap:12px;'>" +
    "<div id='carte-photo-preview' style='width:50px;height:50px;border-radius:50%;border:2px solid #e8d4b0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#c9a86a;flex-shrink:0;'>" +
    (cv.photoURL || userData.photoURL ? "<img id='carte-photo-img' src='" + (cv.photoURL || userData.photoURL) + "' style='width:100%;height:100%;object-fit:cover;' />" : "<span style='color:white;font-size:18px;font-weight:bold;'>" + ((userData.prenom||"?")[0]).toUpperCase() + "</span>") +
    "</div><div><label style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:7px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;display:inline-block;'>📷 Changer la photo<input type='file' id='carte-photo-input' accept='image/*' style='display:none;' /></label><div id='carte-photo-msg' style='color:#999;font-size:11px;margin-top:4px;'>JPG ou PNG recommandé</div></div></div></div></div>" +

    "<div style='display:flex;gap:10px;'>" +
    "<button id='save-carte' style='flex:1;background:#c9a86a;color:white;border:none;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>Sauvegarder</button>" +
    "<button id='dl-carte' style='flex:1;background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>⬇️ Télécharger PNG</button>" +
    "<button id='share-carte' style='flex:1;background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>🔗 Lien partage</button>" +
    "</div>" +
    "<div id='carte-msg' style='color:#8b735d;font-size:12px;text-align:center;margin-top:8px;'></div>";

    document.getElementById("close-carte").onclick = function() { panel.remove(); var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click(); };

    cartePhotoURL = cv.photoURL || userData.photoURL || "";

    document.getElementById("carte-photo-input").onchange = async function() {
      var file = this.files[0]; if (!file) return;
      document.getElementById("carte-photo-msg").innerText = "Upload en cours...";
      try {
        var fd = new FormData(); fd.append("file", file); fd.append("upload_preset", "baa_avatars"); fd.append("folder", "cartes");
        var r = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload", { method: "POST", body: fd });
        var data = await r.json();
        cartePhotoURL = data.secure_url;
        var preview = document.getElementById("carte-photo-preview");
        preview.innerHTML = "<img src='" + cartePhotoURL + "' style='width:100%;height:100%;object-fit:cover;' />";
        document.getElementById("carte-photo-msg").innerText = "Photo mise à jour !";
        setTimeout(function() { document.getElementById("carte-photo-msg").innerText = "JPG ou PNG recommandé"; }, 3000);
        renderPreview(themeActuel, getFormData());
      } catch(e) { document.getElementById("carte-photo-msg").innerText = "Erreur upload."; }
    };

    renderPreview(themeActuel, getFormData());

    document.querySelectorAll(".theme-btn").forEach(function(btn) {
      btn.onclick = function() {
        themeActuel = btn.getAttribute("data-theme");
        document.querySelectorAll(".theme-btn").forEach(function(b) { b.style.background = "#f3e7d3"; b.style.color = "#8a6a35"; });
        btn.style.background = "#c9a86a"; btn.style.color = "white";
        renderPreview(themeActuel, getFormData());
      };
    });

    ["cv-prenom","cv-nom","cv-email","cv-tel","cv-societe","cv-catalogue","cv-fb","cv-insta"].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", function() { renderPreview(themeActuel, getFormData()); });
    });

    document.getElementById("save-carte").onclick = function() {
      var data = getFormData(); data.theme = themeActuel;
      db.collection("users").doc(uid).update({ carteVisite: data }).then(function() {
        document.getElementById("carte-msg").innerText = "Carte sauvegardée !";
        setTimeout(function() { document.getElementById("carte-msg").innerText = ""; }, 3000);
      });
    };

    document.getElementById("dl-carte").onclick = function() {
      var svg = document.getElementById("carte-svg");
      if (!svg) return;
      var svgData = new XMLSerializer().serializeToString(svg);
      var canvas = document.createElement("canvas"); canvas.width = 800; canvas.height = 460;
      var ctx = canvas.getContext("2d");
      var img = new Image();
      img.onload = function() { ctx.drawImage(img, 0, 0, 800, 460); var link = document.createElement("a"); link.download = "carte-visite.png"; link.href = canvas.toDataURL("image/png"); link.click(); };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    document.getElementById("share-carte").onclick = function() {
      var data = getFormData(); data.theme = themeActuel;
      db.collection("cartesVisite").doc(uid).set(data).then(function() {
        var lien = window.location.origin + "?carte=" + uid;
        navigator.clipboard.writeText(lien).then(function() {
          document.getElementById("carte-msg").innerText = "🔗 Lien copié dans le presse-papier !";
          setTimeout(function() { document.getElementById("carte-msg").innerText = ""; }, 4000);
        }).catch(function() {
          document.getElementById("carte-msg").innerText = "Lien : " + lien;
        });
      });
    };
  }

  function champ(id, label, val) {
    return "<div><label style='color:#8b735d;font-size:11px;font-weight:bold;display:block;margin-bottom:4px;'>" + label + "</label><input id='" + id + "' value='" + (val||"").replace(/'/g,"&#39;") + "' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:12px;box-sizing:border-box;' /></div>";
  }

  function getFormData() {
    function v(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
    return { prenom: v("cv-prenom"), nom: v("cv-nom"), email: v("cv-email"), tel: v("cv-tel"), societe: v("cv-societe"), catalogue: v("cv-catalogue"), fb: v("cv-fb"), insta: v("cv-insta"), photoURL: cartePhotoURL };
  }

  function renderPreview(theme, d) {
    var wrap = document.getElementById("carte-preview-wrap"); if (!wrap) return;
    var svg = genSVG(theme, d);
    wrap.innerHTML = svg;
  }

  function photoTag(url, cx, cy, r, initiales) {
    if (url) {
      return "<clipPath id='ph'><circle cx='" + cx + "' cy='" + cy + "' r='" + r + "'/></clipPath><image href='" + url + "' x='" + (cx-r) + "' y='" + (cy-r) + "' width='" + (r*2) + "' height='" + (r*2) + "' clip-path='url(#ph)'/><circle cx='" + cx + "' cy='" + cy + "' r='" + r + "' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='1.5'/>";
    }
    return "<circle cx='" + cx + "' cy='" + cy + "' r='" + r + "' fill='rgba(201,168,106,0.3)' stroke='rgba(201,168,106,0.6)' stroke-width='1.5'/><text x='" + cx + "' y='" + (cy+6) + "' text-anchor='middle' font-family='Arial' font-size='22' font-weight='bold' fill='rgba(255,255,255,0.8)'>" + (initiales||"?") + "</text>";
  }

  function ini(d) { return ((d.prenom||"?")[0]||"").toUpperCase() + ((d.nom||"")[0]||"").toUpperCase(); }

  function qrSVG(x, y, s) {
    var c = "#333"; var bg = "rgba(255,255,255,0.15)";
    return "<rect x='" + x + "' y='" + y + "' width='" + s + "' height='" + s + "' rx='3' fill='" + bg + "'/>" +
      "<rect x='" + (x+3) + "' y='" + (y+3) + "' width='" + (s*0.35) + "' height='" + (s*0.35) + "' rx='1' fill='none' stroke='" + c + "' stroke-width='1.5'/>" +
      "<rect x='" + (x+s-3-s*0.35) + "' y='" + (y+3) + "' width='" + (s*0.35) + "' height='" + (s*0.35) + "' rx='1' fill='none' stroke='" + c + "' stroke-width='1.5'/>" +
      "<rect x='" + (x+3) + "' y='" + (y+s-3-s*0.35) + "' width='" + (s*0.35) + "' height='" + (s*0.35) + "' rx='1' fill='none' stroke='" + c + "' stroke-width='1.5'/>" +
      "<rect x='" + (x+s*0.15) + "' y='" + (y+s*0.15) + "' width='" + (s*0.12) + "' height='" + (s*0.12) + "' fill='" + c + "'/>" +
      "<rect x='" + (x+s-s*0.15-s*0.12) + "' y='" + (y+s*0.15) + "' width='" + (s*0.12) + "' height='" + (s*0.12) + "' fill='" + c + "'/>" +
      "<rect x='" + (x+s*0.15) + "' y='" + (y+s-s*0.15-s*0.12) + "' width='" + (s*0.12) + "' height='" + (s*0.12) + "' fill='" + c + "'/>" +
      "<line x1='" + (x+s*0.5) + "' y1='" + (y+s*0.1) + "' x2='" + (x+s*0.5) + "' y2='" + (y+s*0.9) + "' stroke='" + c + "' stroke-width='1'/>" +
      "<line x1='" + (x+s*0.1) + "' y1='" + (y+s*0.5) + "' x2='" + (x+s*0.9) + "' y2='" + (y+s*0.5) + "' stroke='" + c + "' stroke-width='1'/>";
  }

  function genSVG(theme, d) {
    var W = 680, H = 390;
    var nm = (d.prenom||"Prénom") + " " + (d.nom||"Nom");
    var soc = d.societe || "Beauty Addict";
    var em = d.email || "email@example.com";
    var tel = d.tel || "06 XX XX XX XX";
    var fb = d.fb ? d.fb.replace("https://facebook.com/","").replace("https://www.facebook.com/","") : "";
    var ig = d.insta ? d.insta.replace("https://instagram.com/","").replace("https://www.instagram.com/","@").replace(/^([^@])/,"@$1") : "";
    var cat = d.catalogue ? "catalogue" : "";

    var svg = "<svg id='carte-svg' width='100%' viewBox='0 0 " + W + " " + H + "' xmlns='http://www.w3.org/2000/svg' style='border-radius:14px;max-width:540px;'>";

    if (theme === "dore") {
      svg += "<defs><clipPath id='ph'><circle cx='85' cy='80' r='50'/></clipPath></defs>";
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='#1a0a00'/>";
      svg += "<polygon points='" + W*0.55 + ",0 " + W + ",0 " + W + "," + H + " " + W*0.45 + "," + H + "' fill='url(#gd)'/>";
      svg += "<defs><linearGradient id='gd' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#c9a86a'/><stop offset='50%' stop-color='#f5d48a'/><stop offset='100%' stop-color='#c9a86a'/></linearGradient></defs>";
      if (d.photoURL) { svg += "<clipPath id='ph'><circle cx='85' cy='" + (H/2) + "' r='50'/></clipPath><image href='" + d.photoURL + "' x='35' y='" + (H/2-50) + "' width='100' height='100' clip-path='url(#ph)'/><circle cx='85' cy='" + (H/2) + "' r='50' fill='none' stroke='#c9a86a' stroke-width='2'/>";
      } else { svg += "<circle cx='85' cy='" + (H/2) + "' r='50' fill='rgba(201,168,106,0.15)' stroke='#c9a86a' stroke-width='1.5'/><text x='85' y='" + (H/2+10) + "' text-anchor='middle' font-family='Arial' font-size='28' font-weight='bold' fill='#c9a86a'>" + ini(d) + "</text>"; }
      svg += "<text x='175' y='" + (H*0.28) + "' font-family='Arial' font-size='22' font-weight='bold' fill='#f5d48a' letter-spacing='1'>" + nm + "</text>";
      svg += "<text x='175' y='" + (H*0.42) + "' font-family='Arial' font-size='13' fill='#c9a86a' letter-spacing='2'>" + soc.toUpperCase() + "</text>";
      svg += "<line x1='175' y1='" + (H*0.5) + "' x2='420' y2='" + (H*0.5) + "' stroke='#c9a86a' stroke-width='0.5' opacity='0.5'/>";
      svg += "<text x='175' y='" + (H*0.6) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.65)'>✉ " + em + "</text>";
      svg += "<text x='175' y='" + (H*0.71) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.65)'>📱 " + tel + "</text>";
      if (fb) svg += "<text x='175' y='" + (H*0.82) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.5)'>fb/ " + fb + "</text>";
      if (ig) svg += "<text x='" + (fb ? 350 : 175) + "' y='" + (H*0.82) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.5)'>" + ig + "</text>";
      svg += qrSVG(W*0.82, H*0.55, 70).replace(/stroke='#333'/g, "stroke='#c9a86a'").replace(/fill='#333'/g, "fill='#c9a86a'").replace("rgba(255,255,255,0.15)", "rgba(201,168,106,0.1)");

    } else if (theme === "noir") {
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='#0f0f0f'/>";
      svg += "<rect x='0' y='0' width='6' height='" + H + "' rx='3' fill='url(#gv)'/>";
      svg += "<defs><linearGradient id='gv' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='#c9a86a'/><stop offset='50%' stop-color='#f5d48a'/><stop offset='100%' stop-color='#c9a86a'/></linearGradient></defs>";
      if (d.photoURL) { svg += "<clipPath id='ph'><circle cx='110' cy='90' r='55'/></clipPath><image href='" + d.photoURL + "' x='55' y='35' width='110' height='110' clip-path='url(#ph)'/><circle cx='110' cy='90' r='55' fill='none' stroke='#c9a86a' stroke-width='1.5'/>";
      } else { svg += "<circle cx='110' cy='90' r='55' fill='#1a1a1a' stroke='#c9a86a' stroke-width='1.5'/><text x='110' y='100' text-anchor='middle' font-family='Arial' font-size='30' font-weight='bold' fill='#c9a86a'>" + ini(d) + "</text>"; }
      svg += "<text x='185' y='70' font-family='Arial' font-size='24' font-weight='bold' fill='white' letter-spacing='0.5'>" + nm + "</text>";
      svg += "<text x='185' y='100' font-family='Arial' font-size='11' fill='#c9a86a' letter-spacing='2'>" + soc.toUpperCase() + "</text>";
      svg += "<line x1='185' y1='118' x2='" + (W-40) + "' y2='118' stroke='#333' stroke-width='0.5'/>";
      svg += "<text x='185' y='148' font-family='Arial' font-size='13' fill='#888'>✉ " + em + "</text>";
      svg += "<text x='185' y='172' font-family='Arial' font-size='13' fill='#888'>📱 " + tel + "</text>";
      if (fb) svg += "<text x='185' y='196' font-family='Arial' font-size='12' fill='#555'>fb/ " + fb + "</text>";
      if (ig) svg += "<text x='" + (fb ? 360 : 185) + "' y='196' font-family='Arial' font-size='12' fill='#555'>" + ig + "</text>";
      svg += qrSVG(W*0.82, H*0.52, 70).replace(/stroke='#333'/g, "stroke='#c9a86a'").replace(/fill='#333'/g, "fill='#c9a86a'").replace("rgba(255,255,255,0.15)", "rgba(201,168,106,0.08)");

    } else if (theme === "violet") {
      svg += "<defs><linearGradient id='gvio' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#26215C'/><stop offset='100%' stop-color='#534AB7'/></linearGradient></defs>";
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='url(#gvio)'/>";
      svg += "<text x='" + W + "' y='" + (H*0.7) + "' text-anchor='end' font-family='Arial' font-size='160' fill='rgba(255,255,255,0.05)'>🐦</text>";
      if (d.photoURL) { svg += "<clipPath id='ph'><circle cx='90' cy='" + (H*0.38) + "' r='55'/></clipPath><image href='" + d.photoURL + "' x='35' y='" + (H*0.38-55) + "' width='110' height='110' clip-path='url(#ph)'/><circle cx='90' cy='" + (H*0.38) + "' r='55' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='1.5'/>";
      } else { svg += "<circle cx='90' cy='" + (H*0.38) + "' r='55' fill='rgba(255,255,255,0.1)' stroke='rgba(255,255,255,0.3)' stroke-width='1.5'/><text x='90' y='" + (H*0.38+10) + "' text-anchor='middle' font-family='Arial' font-size='28' font-weight='bold' fill='rgba(255,255,255,0.8)'>" + ini(d) + "</text>"; }
      svg += "<text x='170' y='" + (H*0.25) + "' font-family='Arial' font-size='22' font-weight='bold' fill='white'>" + nm + "</text>";
      svg += "<text x='170' y='" + (H*0.38) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.65)'>" + soc + "</text>";
      svg += "<line x1='170' y1='" + (H*0.48) + "' x2='" + (W-50) + "' y2='" + (H*0.48) + "' stroke='rgba(255,255,255,0.2)' stroke-width='0.5'/>";
      svg += "<text x='170' y='" + (H*0.58) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.6)'>✉ " + em + "</text>";
      svg += "<text x='170' y='" + (H*0.7) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.6)'>📱 " + tel + "</text>";
      if (fb) svg += "<text x='170' y='" + (H*0.82) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.45)'>fb/ " + fb + "</text>";
      if (ig) svg += "<text x='" + (fb ? 360 : 170) + "' y='" + (H*0.82) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.45)'>" + ig + "</text>";
      svg += qrSVG(W*0.82, H*0.55, 65).replace(/stroke='#333'/g, "stroke='rgba(255,255,255,0.6)'").replace(/fill='#333'/g, "fill='rgba(255,255,255,0.6)'").replace("rgba(255,255,255,0.15)", "rgba(255,255,255,0.1)");

    } else if (theme === "nature") {
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='#f8f4ee'/>";
      svg += "<rect x='0' y='0' width='" + W + "' height='7' rx='3' fill='url(#gh)'/>";
      svg += "<rect x='0' y='" + (H-5) + "' width='" + W + "' height='5' rx='2' fill='url(#gh)'/>";
      svg += "<rect x='0' y='7' width='5' height='" + (H-12) + "' fill='url(#gv2)'/>";
      svg += "<defs><linearGradient id='gh'><stop offset='0%' stop-color='#c9a86a'/><stop offset='50%' stop-color='#f5d48a'/><stop offset='100%' stop-color='#c9a86a'/></linearGradient><linearGradient id='gv2' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='#c9a86a'/><stop offset='50%' stop-color='#f5d48a'/><stop offset='100%' stop-color='#c9a86a'/></linearGradient></defs>";
      if (d.photoURL) { svg += "<clipPath id='ph'><circle cx='" + (W-90) + "' cy='" + (H*0.4) + "' r='65'/></clipPath><image href='" + d.photoURL + "' x='" + (W-155) + "' y='" + (H*0.4-65) + "' width='130' height='130' clip-path='url(#ph)'/><circle cx='" + (W-90) + "' cy='" + (H*0.4) + "' r='65' fill='none' stroke='#c9a86a' stroke-width='2'/>";
      } else { svg += "<circle cx='" + (W-90) + "' cy='" + (H*0.4) + "' r='65' fill='#e8d4b0' stroke='#c9a86a' stroke-width='2'/><text x='" + (W-90) + "' y='" + (H*0.4+12) + "' text-anchor='middle' font-family='Georgia,serif' font-size='32' font-weight='bold' fill='#8a6a35'>" + ini(d) + "</text>"; }
      svg += "<text x='30' y='" + (H*0.25) + "' font-family='Georgia,serif' font-size='26' font-weight='bold' fill='#3d1f05'>" + nm + "</text>";
      svg += "<text x='30' y='" + (H*0.38) + "' font-family='Georgia,serif' font-size='14' fill='#8a6a35' font-style='italic'>" + soc + "</text>";
      svg += "<line x1='30' y1='" + (H*0.48) + "' x2='" + (W*0.55) + "' y2='" + (H*0.48) + "' stroke='#c9a86a' stroke-width='0.5' opacity='0.5'/>";
      svg += "<text x='30' y='" + (H*0.58) + "' font-family='Arial' font-size='12' fill='#666'>✉ " + em + "</text>";
      svg += "<text x='30' y='" + (H*0.7) + "' font-family='Arial' font-size='12' fill='#666'>📱 " + tel + "</text>";
      if (fb) svg += "<text x='30' y='" + (H*0.82) + "' font-family='Arial' font-size='11' fill='#888'>fb/ " + fb + "</text>";
      if (ig) svg += "<text x='" + (fb ? 230 : 30) + "' y='" + (H*0.82) + "' font-family='Arial' font-size='11' fill='#888'>" + ig + "</text>";

    } else if (theme === "soleil") {
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='#0d0d0d'/>";
      svg += "<circle cx='" + (W*0.85) + "' cy='" + (H*0.8) + "' r='200' fill='url(#gsol)' opacity='0.45'/>";
      svg += "<defs><radialGradient id='gsol'><stop offset='0%' stop-color='#f5d48a'/><stop offset='40%' stop-color='#D85A30'/><stop offset='100%' stop-color='transparent'/></radialGradient></defs>";
      for (var i=0; i<4; i++) { svg += "<line x1='0' y1='" + (H*(0.35+i*0.08)) + "' x2='" + W + "' y2='" + (H*(0.35+i*0.08)) + "' stroke='rgba(245,212,138," + (0.15-i*0.03) + ")' stroke-width='0.5'/>"; }
      if (d.photoURL) { svg += "<clipPath id='ph'><circle cx='" + (W*0.82) + "' cy='" + (H*0.35) + "' r='55'/></clipPath><image href='" + d.photoURL + "' x='" + (W*0.82-55) + "' y='" + (H*0.35-55) + "' width='110' height='110' clip-path='url(#ph)'/><circle cx='" + (W*0.82) + "' cy='" + (H*0.35) + "' r='55' fill='none' stroke='#D85A30' stroke-width='1.5'/>";
      } else { svg += "<circle cx='" + (W*0.82) + "' cy='" + (H*0.35) + "' r='55' fill='rgba(216,90,48,0.15)' stroke='#D85A30' stroke-width='1.5'/><text x='" + (W*0.82) + "' y='" + (H*0.35+10) + "' text-anchor='middle' font-family='Arial' font-size='28' font-weight='bold' fill='#f5d48a'>" + ini(d) + "</text>"; }
      svg += "<text x='30' y='" + (H*0.22) + "' font-family='Arial' font-size='24' font-weight='bold' fill='#f5d48a' letter-spacing='1'>" + nm + "</text>";
      svg += "<text x='30' y='" + (H*0.36) + "' font-family='Arial' font-size='12' fill='#D85A30' letter-spacing='2'>" + soc.toUpperCase() + "</text>";
      svg += "<line x1='30' y1='" + (H*0.46) + "' x2='" + (W*0.5) + "' y2='" + (H*0.46) + "' stroke='#D85A30' stroke-width='1'/>";
      svg += "<text x='30' y='" + (H*0.58) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.6)'>✉ " + em + "</text>";
      svg += "<text x='30' y='" + (H*0.7) + "' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.6)'>📱 " + tel + "</text>";
      if (fb) svg += "<text x='30' y='" + (H*0.82) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.45)'>fb/ " + fb + "</text>";
      if (ig) svg += "<text x='" + (fb ? 240 : 30) + "' y='" + (H*0.82) + "' font-family='Arial' font-size='11' fill='rgba(255,255,255,0.45)'>" + ig + "</text>";

    } else if (theme === "corail") {
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='white'/>";
      svg += "<defs><linearGradient id='gcor' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#FAECE7'/><stop offset='100%' stop-color='white'/></linearGradient></defs>";
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='url(#gcor)'/>";
      svg += "<circle cx='-60' cy='-60' r='180' fill='rgba(216,90,48,0.07)'/>";
      svg += "<circle cx='0' cy='0' r='120' fill='rgba(216,90,48,0.06)'/>";
      if (d.photoURL) { svg += "<clipPath id='ph'><circle cx='90' cy='" + (H*0.4) + "' r='60'/></clipPath><image href='" + d.photoURL + "' x='30' y='" + (H*0.4-60) + "' width='120' height='120' clip-path='url(#ph)'/><circle cx='90' cy='" + (H*0.4) + "' r='60' fill='none' stroke='#D85A30' stroke-width='2'/>";
      } else { svg += "<circle cx='90' cy='" + (H*0.4) + "' r='60' fill='#FAECE7' stroke='#D85A30' stroke-width='2'/><text x='90' y='" + (H*0.4+12) + "' text-anchor='middle' font-family='Arial' font-size='30' font-weight='bold' fill='#D85A30'>" + ini(d) + "</text>"; }
      svg += "<text x='175' y='" + (H*0.22) + "' font-family='Arial' font-size='22' font-weight='bold' fill='#1a1a1a'>" + nm + "</text>";
      svg += "<text x='175' y='" + (H*0.35) + "' font-family='Arial' font-size='13' fill='#D85A30' font-weight='500'>" + soc + "</text>";
      svg += "<line x1='175' y1='" + (H*0.46) + "' x2='" + (W-40) + "' y2='" + (H*0.46) + "' stroke='#F5C4B3' stroke-width='1'/>";
      svg += "<text x='175' y='" + (H*0.58) + "' font-family='Arial' font-size='12' fill='#666'>✉ " + em + "</text>";
      svg += "<text x='175' y='" + (H*0.7) + "' font-family='Arial' font-size='12' fill='#666'>📱 " + tel + "</text>";
      if (fb) svg += "<text x='175' y='" + (H*0.82) + "' font-family='Arial' font-size='11' fill='#999'>fb/ " + fb + "</text>";
      if (ig) svg += "<text x='" + (fb ? 360 : 175) + "' y='" + (H*0.82) + "' font-family='Arial' font-size='11' fill='#999'>" + ig + "</text>";
      svg += qrSVG(W*0.84, H*0.6, 65).replace(/stroke='#333'/g, "stroke='#D85A30'").replace(/fill='#333'/g, "fill='#D85A30'").replace("rgba(255,255,255,0.15)", "#FAECE7");

    } else if (theme === "marbre") {
      svg += "<rect width='" + W + "' height='" + H + "' rx='14' fill='#f9f7f4'/>";
      for (var j=0; j<8; j++) { svg += "<line x1='" + (j*90-20) + "' y1='0' x2='" + (j*90+60) + "' y2='" + H + "' stroke='rgba(150,140,130,0.06)' stroke-width='8'/>"; }
      svg += "<rect x='0' y='0' width='" + W + "' height='7' rx='3' fill='#1a1a1a'/>";
      if (d.photoURL) { svg += "<clipPath id='ph'><rect x='" + (W-160) + "' y='25' width='120' height='120' rx='8'/></clipPath><image href='" + d.photoURL + "' x='" + (W-160) + "' y='25' width='120' height='120' clip-path='url(#ph)' rx='8'/><rect x='" + (W-160) + "' y='25' width='120' height='120' rx='8' fill='none' stroke='#ccc' stroke-width='1'/>";
      } else { svg += "<rect x='" + (W-160) + "' y='25' width='120' height='120' rx='8' fill='#e0ddd8' stroke='#ccc' stroke-width='1'/><text x='" + (W-100) + "' y='95' text-anchor='middle' font-family='Georgia,serif' font-size='36' font-weight='bold' fill='#999'>" + ini(d) + "</text>"; }
      svg += "<text x='30' y='" + (H*0.3) + "' font-family='Georgia,serif' font-size='26' font-weight='bold' fill='#1a1a1a'>" + nm + "</text>";
      svg += "<text x='30' y='" + (H*0.44) + "' font-family='Georgia,serif' font-size='14' fill='#666' font-style='italic'>" + soc + "</text>";
      svg += "<line x1='30' y1='" + (H*0.53) + "' x2='" + (W-170) + "' y2='" + (H*0.53) + "' stroke='#1a1a1a' stroke-width='0.5' opacity='0.2'/>";
      svg += "<text x='30' y='" + (H*0.63) + "' font-family='Arial' font-size='12' fill='#555'>✉ " + em + "</text>";
      svg += "<text x='30' y='" + (H*0.74) + "' font-family='Arial' font-size='12' fill='#555'>📱 " + tel + "</text>";
      if (fb) svg += "<text x='30' y='" + (H*0.85) + "' font-family='Arial' font-size='11' fill='#888'>fb/ " + fb + "</text>";
      if (ig) svg += "<text x='" + (fb ? 230 : 30) + "' y='" + (H*0.85) + "' font-family='Arial' font-size='11' fill='#888'>" + ig + "</text>";
      svg += qrSVG(W*0.84, H*0.62, 60).replace(/stroke='#333'/g, "stroke='#1a1a1a'").replace(/fill='#333'/g, "fill='#1a1a1a'").replace("rgba(255,255,255,0.15)", "#e0ddd8");
    }

    svg += "</svg>";
    return svg;
  }
}

window.openCarteVisitePanel = openCarteVisitePanel;
