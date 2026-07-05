function openGenerateurVisuels() {
  if (document.getElementById("baa-gen-panel")) return;

  var panel = document.createElement("div");
  panel.id = "baa-gen-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding:40px 16px;overflow-y:auto;";
  document.body.appendChild(panel);

  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:100%;max-width:520px;border-radius:20px;padding:28px;font-family:Arial,sans-serif;";
  panel.appendChild(box);

  // Input photo caché
  var fileInput = document.createElement("input");
  fileInput.type="file"; fileInput.accept="image/*"; fileInput.style.display="none";
  panel.appendChild(fileInput);

  var THEMES = [
    { id:"conseil", label:"💄 Conseil beauté", emoji:"💄", photoSuggested:false },
    { id:"temoignage", label:"⭐ Témoignage client", emoji:"⭐", photoSuggested:true },
    { id:"recrutement", label:"🐦‍🔥 Recrutement VDI", emoji:"🐦‍🔥", photoSuggested:true },
    { id:"promotion", label:"🎁 Promotion produit", emoji:"🎁", photoSuggested:true },
    { id:"motivation", label:"💪 Motivation", emoji:"💪", photoSuggested:false }
  ];

  var AMBIANCES = [
    { id:"noir_or", label:"✨ Noir & Or", bg:"#0f0f0f", bgType:"solid", titleColor:"#f5d48a", subColor:"rgba(255,255,255,0.6)", tagColor:"#c9a86a", font:"Georgia" },
    { id:"rose", label:"🌸 Rose Élégant", bg:"#FFF5F8", bgType:"solid", titleColor:"#D4537E", subColor:"#555555", tagColor:"#D4537E", font:"Georgia" },
    { id:"violet", label:"🔮 Violet Phénix", bg:"#26215C", bgType:"solid", titleColor:"#CECBF6", subColor:"rgba(255,255,255,0.5)", tagColor:"#f5d48a", font:"Georgia" },
    { id:"nature", label:"🌿 Nature Luxe", bg:"#f8f3ee", bgType:"solid", titleColor:"#3d1f05", subColor:"#8a6a35", tagColor:"#c9a86a", font:"Georgia" },
    { id:"degrade_or", label:"🌟 Dégradé Doré", bg:"#c9a86a", bgType:"gradient", bgGradient:["#c9a86a","#f5d48a"], titleColor:"#1a0a00", subColor:"rgba(0,0,0,0.6)", tagColor:"#3d1f05", font:"Georgia" },
    { id:"degrade_violet", label:"💜 Dégradé Violet", bg:"#26215C", bgType:"gradient", bgGradient:["#26215C","#534AB7"], titleColor:"#ffffff", subColor:"rgba(255,255,255,0.6)", tagColor:"#f5d48a", font:"Georgia" }
  ];

  var FORMATS = [
    { id:"square", label:"⬛ Carré" },
    { id:"story", label:"📱 Story" },
    { id:"landscape", label:"🖥️ Large" }
  ];

  var state = { theme:null, photoUrl:null, photoPreview:null, titre:"", sousTitre:"", tag:"@beautyaddictfrance", format:"square", ambiance:null, step:1 };

  function render() {
    box.innerHTML = "";

    // Header
    var header = document.createElement("div");
    header.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;";
    var title = document.createElement("h2");
    title.style.cssText = "color:#8b735d;margin:0;font-size:18px;";
    title.textContent = "🤖 Générateur de visuels IA";
    header.appendChild(title);
    var closeBtn = document.createElement("span");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = "cursor:pointer;font-size:22px;color:#8b735d;";
    closeBtn.onclick = function() { panel.remove(); if (typeof window.__baaOpenOutilsPanel === "function") window.__baaOpenOutilsPanel(); };
    header.appendChild(closeBtn);
    box.appendChild(header);

    // Barre de progression
    var prog = document.createElement("div");
    prog.style.cssText = "display:flex;gap:6px;margin-bottom:24px;";
    var totalSteps = 4;
    for (var i=1; i<=totalSteps; i++) {
      var dot = document.createElement("div");
      dot.style.cssText = "flex:1;height:4px;border-radius:2px;background:" + (i<=state.step?"#c9a86a":"#e8d4b0") + ";transition:background 0.3s;";
      prog.appendChild(dot);
    }
    box.appendChild(prog);

    if (state.step===1) renderStep1();
    else if (state.step===2) renderStep2();
    else if (state.step===3) renderStep3();
    else if (state.step===4) renderGenerating();
  }

  function sectionLabel(txt) {
    var p = document.createElement("p");
    p.style.cssText = "color:#8b735d;font-size:15px;font-weight:bold;margin:0 0 14px;";
    p.textContent = txt;
    box.appendChild(p);
  }

  function nextBtn(txt, fn) {
    var b = document.createElement("button");
    b.textContent = txt;
    b.style.cssText = "width:100%;background:#c9a86a;color:#1a0a00;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;margin-top:16px;touch-action:manipulation;";
    b.onclick = fn;
    box.appendChild(b);
  }

  function backBtn() {
    var b = document.createElement("button");
    b.textContent = "← Retour";
    b.style.cssText = "background:none;border:none;color:#8b735d;font-size:13px;cursor:pointer;margin-top:8px;width:100%;touch-action:manipulation;";
    b.onclick = function() { state.step--; render(); };
    box.appendChild(b);
  }

  // ÉTAPE 1 — Thème
  function renderStep1() {
    sectionLabel("Étape 1 — Quel est le thème ?");
    var grid = document.createElement("div");
    grid.style.cssText = "display:flex;flex-direction:column;gap:8px;";
    THEMES.forEach(function(t) {
      var b = document.createElement("button");
      var selected = state.theme===t.id;
      b.style.cssText = "background:" + (selected?"#c9a86a":"white") + ";color:" + (selected?"#1a0a00":"#3a3a3a") + ";border:2px solid " + (selected?"#c9a86a":"#e8d4b0") + ";padding:13px 16px;border-radius:10px;cursor:pointer;font-size:14px;text-align:left;touch-action:manipulation;display:flex;justify-content:space-between;align-items:center;";
      b.innerHTML = "<span>" + t.label + "</span>" + (t.photoSuggested ? "<span style='font-size:11px;opacity:0.6;'>+ photo recommandée</span>" : "");
      b.onclick = function() { state.theme=t.id; render(); };
      grid.appendChild(b);
    });
    box.appendChild(grid);
    if (state.theme) nextBtn("Suivant →", function() { state.step=2; render(); });
  }

  // ÉTAPE 2 — Photo + Texte
  function renderStep2() {
    var theme = THEMES.find(function(t){return t.id===state.theme;});

    // Section photo
    sectionLabel("Étape 2 — Photo" + (theme && theme.photoSuggested ? " (recommandée pour ce thème)" : " (optionnelle)"));

    var photoZone = document.createElement("div");
    if (state.photoPreview) {
      photoZone.style.cssText = "border:2px solid #c9a86a;border-radius:12px;overflow:hidden;margin-bottom:14px;position:relative;";
      var prevImg = document.createElement("img");
      prevImg.src = state.photoPreview;
      prevImg.style.cssText = "width:100%;max-height:180px;object-fit:cover;display:block;";
      photoZone.appendChild(prevImg);
      var removeBtn = document.createElement("button");
      removeBtn.textContent = "✕ Retirer la photo";
      removeBtn.style.cssText = "position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.6);color:white;border:none;padding:5px 10px;border-radius:8px;cursor:pointer;font-size:12px;touch-action:manipulation;";
      removeBtn.onclick = function() { state.photoUrl=null; state.photoPreview=null; render(); };
      photoZone.appendChild(removeBtn);
    } else {
      photoZone.style.cssText = "border:2px dashed #e8d4b0;border-radius:12px;padding:24px;text-align:center;margin-bottom:14px;cursor:pointer;background:white;";
      photoZone.innerHTML = "<div style='font-size:36px;margin-bottom:8px;'>📷</div><p style='color:#8b735d;font-size:14px;margin:0 0 4px;font-weight:bold;'>Ajouter une photo</p><p style='color:#999;font-size:12px;margin:0;'>Témoignage, produit, avant/après...</p>";
      photoZone.onclick = function() { fileInput.click(); };
    }
    box.appendChild(photoZone);

    // Upload handler
    fileInput.onchange = async function() {
      var file = this.files[0]; if (!file) return;
      // Preview immédiat
      var reader = new FileReader();
      reader.onload = function(e) { state.photoPreview = e.target.result; render(); };
      reader.readAsDataURL(file);
      // Upload Cloudinary pour haute qualité
      try {
        var fd = new FormData(); fd.append("file",file); fd.append("upload_preset","baa_avatars"); fd.append("folder","generateur");
        var r = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload",{method:"POST",body:fd});
        var data = await r.json();
        var imgEl = new Image(); imgEl.crossOrigin="anonymous";
        imgEl.onload = function() {
          // Conserver les proportions originales
          var ratio = imgEl.naturalWidth / imgEl.naturalHeight;
          var c2 = document.createElement("canvas");
          c2.width = 1080; c2.height = Math.round(1080/ratio);
          c2.getContext("2d").drawImage(imgEl,0,0,c2.width,c2.height);
          state.photoUrl = c2.toDataURL("image/jpeg",0.95);
        };
        imgEl.src = data.secure_url;
      } catch(e) { state.photoUrl = state.photoPreview; }
    };

    // Section texte
    var texteLabel = document.createElement("p");
    texteLabel.style.cssText = "color:#8b735d;font-size:15px;font-weight:bold;margin:0 0 12px;";
    texteLabel.textContent = "Ton message :";
    box.appendChild(texteLabel);

    var inp1 = document.createElement("input");
    inp1.placeholder = "Titre principal *";
    inp1.value = state.titre;
    inp1.style.cssText = "width:100%;padding:12px;border:1px solid #e8d4b0;border-radius:10px;font-size:14px;box-sizing:border-box;margin-bottom:10px;";
    inp1.oninput = function() { state.titre = inp1.value; };
    box.appendChild(inp1);

    var inp2 = document.createElement("input");
    inp2.placeholder = "Sous-titre (optionnel)";
    inp2.value = state.sousTitre;
    inp2.style.cssText = "width:100%;padding:12px;border:1px solid #e8d4b0;border-radius:10px;font-size:14px;box-sizing:border-box;margin-bottom:10px;";
    inp2.oninput = function() { state.sousTitre = inp2.value; };
    box.appendChild(inp2);

    var inp3 = document.createElement("input");
    inp3.placeholder = "Signature (ex: @beautyaddictfrance)";
    inp3.value = state.tag;
    inp3.style.cssText = "width:100%;padding:12px;border:1px solid #e8d4b0;border-radius:10px;font-size:14px;box-sizing:border-box;";
    inp3.oninput = function() { state.tag = inp3.value; };
    box.appendChild(inp3);

    nextBtn("Suivant →", function() {
      if (!state.titre) { alert("Merci d'écrire au moins un titre !"); return; }
      state.step=3; render();
    });
    backBtn();
  }

  // ÉTAPE 3 — Format + Ambiance
  function renderStep3() {
    sectionLabel("Étape 3 — Format et ambiance");

    // Format
    var fLabel = document.createElement("p");
    fLabel.style.cssText = "color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 8px;";
    fLabel.textContent = "Format :";
    box.appendChild(fLabel);

    var fRow = document.createElement("div");
    fRow.style.cssText = "display:flex;gap:8px;margin-bottom:16px;";
    FORMATS.forEach(function(f) {
      var b = document.createElement("button");
      b.textContent = f.label;
      var sel = state.format===f.id;
      b.style.cssText = "flex:1;background:"+(sel?"#c9a86a":"white")+";color:"+(sel?"#1a0a00":"#3a3a3a")+";border:2px solid "+(sel?"#c9a86a":"#e8d4b0")+";padding:10px;border-radius:10px;cursor:pointer;font-size:12px;touch-action:manipulation;";
      b.onclick = function() { state.format=f.id; render(); };
      fRow.appendChild(b);
    });
    box.appendChild(fRow);

    // Ambiance
    var aLabel = document.createElement("p");
    aLabel.style.cssText = "color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 8px;";
    aLabel.textContent = "Ambiance :";
    box.appendChild(aLabel);

    var aGrid = document.createElement("div");
    aGrid.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;";
    AMBIANCES.forEach(function(a) {
      var b = document.createElement("button");
      b.textContent = a.label;
      var sel = state.ambiance===a.id;
      b.style.cssText = "background:"+(sel?"#c9a86a":"white")+";color:"+(sel?"#1a0a00":"#3a3a3a")+";border:2px solid "+(sel?"#c9a86a":"#e8d4b0")+";padding:10px;border-radius:10px;cursor:pointer;font-size:12px;touch-action:manipulation;";
      b.onclick = function() { state.ambiance=a.id; render(); };
      aGrid.appendChild(b);
    });
    box.appendChild(aGrid);

    if (state.ambiance) nextBtn("🤖 Générer mon visuel !", function() { state.step=4; render(); setTimeout(genererVisuel, 100); });
    backBtn();
  }

  // ÉTAPE 4 — Génération
  function renderGenerating() {
    var loader = document.createElement("div");
    loader.style.cssText = "text-align:center;padding:40px 0;";
    loader.innerHTML = "<div style='font-size:52px;margin-bottom:16px;'>🐦‍🔥</div><p style='color:#8b735d;font-size:16px;font-weight:bold;margin:0 0 8px;'>L\\'IA compose ton visuel...</p><p style='color:#999;font-size:13px;margin:0;'>Optimisation du texte et mise en page</p>";
    box.appendChild(loader);
  }

  function genererVisuel() {
    var ambiance = AMBIANCES.find(function(a){return a.id===state.ambiance;});
    var theme = THEMES.find(function(t){return t.id===state.theme;});

    var prompt = "Tu es un expert en communication pour réseaux sociaux et en design visuel.\n\nOptimise ce contenu pour un visuel " + theme.label + " :\n- Titre : " + state.titre + "\n- Sous-titre : " + (state.sousTitre||"(vide)") + "\n- Signature : " + (state.tag||"@beautyaddictfrance") + "\n- Photo incluse : " + (state.photoUrl ? "oui" : "non") + "\n\nRéponds UNIQUEMENT en JSON valide :\n{\n  \"titre\": \"titre percutant max 35 caractères\",\n  \"sousTitre\": \"sous-titre accrocheur max 55 caractères\",\n  \"tag\": \"signature inchangée\",\n  \"emoji\": \"1 emoji pertinent\"\n}\n\nRéponds UNIQUEMENT avec le JSON.";

    fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model:"claude-sonnet-4-6",
        max_tokens:200,
        messages:[{role:"user",content:prompt}]
      })
    })
    .then(function(r){return r.json();})
    .then(function(data){
      var text = data.content&&data.content[0]?data.content[0].text:"";
      var clean = text.replace(/```json|```/g,"").trim();
      var config;
      try { config=JSON.parse(clean); }
      catch(e){ config={titre:state.titre,sousTitre:state.sousTitre||"",tag:state.tag||"@beautyaddictfrance",emoji:theme.emoji}; }
      config.photoUrl = state.photoUrl;
      panel.remove();
      injecterDansCreateur(ambiance, config, state.format);
    })
    .catch(function(){
      var config={titre:state.titre,sousTitre:state.sousTitre||"",tag:state.tag||"@beautyaddictfrance",emoji:theme.emoji,photoUrl:state.photoUrl};
      panel.remove();
      injecterDansCreateur(ambiance, config, state.format);
    });
  }

  function injecterDansCreateur(ambiance, config, format) {
    if (typeof openCreateurVisuels !== "function") { alert("Le créateur de visuels n'est pas disponible."); return; }
    openCreateurVisuels();
    var attempts = 0;
    var inject = setInterval(function() {
      attempts++;
      if (attempts > 30) { clearInterval(inject); return; }
      if (typeof window.__baaInjectVisuel === "function") {
        clearInterval(inject);
        setTimeout(function() { window.__baaInjectVisuel(ambiance, config, format); }, 100);
      }
    }, 200);
  }

  render();
}

window.openGenerateurVisuels = openGenerateurVisuels;
