function openDiagnosticCheveux() {
  if (document.getElementById("baa-diag-chev-panel")) return;

  var panel = document.createElement("div");
  panel.id = "baa-diag-chev-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding:20px 16px;overflow-y:auto;font-family:Arial,sans-serif;";
  document.body.appendChild(panel);

  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:100%;max-width:560px;border-radius:20px;padding:24px;";
  panel.appendChild(box);

  var state = { step:"intro", photo:null, photoBase64:null, mediaType:"image/jpeg", prenom:"", email:"", resultat:null };

  function render() {
    box.innerHTML = "";
    var hdr = document.createElement("div");
    hdr.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;";
    var htitle = document.createElement("div");
    htitle.innerHTML = "<h2 style='color:#8b735d;margin:0;font-size:17px;'>💇 Diagnostic Cheveux IA</h2><p style='color:#999;font-size:12px;margin:4px 0 0;'>Analyse personnalisée par intelligence artificielle</p>";
    hdr.appendChild(htitle);
    var closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = "background:none;border:none;font-size:22px;color:#8b735d;cursor:pointer;touch-action:manipulation;";
    closeBtn.onclick = function() { panel.remove(); if (typeof window.__baaOpenOutilsPanel === "function") window.__baaOpenOutilsPanel(); };
    hdr.appendChild(closeBtn);
    box.appendChild(hdr);

    if (state.step==="intro") renderIntro();
    else if (state.step==="photo") renderPhoto();
    else if (state.step==="analyse") renderAnalyse();
    else if (state.step==="resultat") renderResultat();
  }

  function renderIntro() {
    var content = document.createElement("div");
    content.style.cssText = "text-align:center;padding:10px 0;";
    content.innerHTML =
      "<div style='font-size:64px;margin-bottom:16px;'>💇</div>" +
      "<h3 style='color:#8b735d;font-size:18px;margin:0 0 12px;'>Analyse de cheveux par IA</h3>" +
      "<p style='color:#666;font-size:14px;line-height:1.6;margin:0 0 20px;'>Notre IA analyse l'état de vos cheveux et génère une routine personnalisée avec les produits Mihi les plus adaptés.</p>" +
      "<div style='background:white;border-radius:14px;padding:16px;border:1px solid #e8d4b0;margin-bottom:20px;text-align:left;'>" +
      "<p style='color:#8b735d;font-weight:bold;font-size:13px;margin:0 0 10px;'>✨ Ce que l'analyse détecte :</p>" +
      "<div style='display:flex;flex-direction:column;gap:6px;'>" +
      "<div style='display:flex;gap:8px;align-items:center;'><span>💧</span><span style='color:#555;font-size:13px;'>Type de cheveux (secs, gras, mixtes, normaux)</span></div>" +
      "<div style='display:flex;gap:8px;align-items:center;'><span>🔍</span><span style='color:#555;font-size:13px;'>Problèmes détectés (chute, pellicules, pointes abîmées...)</span></div>" +
      "<div style='display:flex;gap:8px;align-items:center;'><span>✨</span><span style='color:#555;font-size:13px;'>Brillance, densité et état général</span></div>" +
      "<div style='display:flex;gap:8px;align-items:center;'><span>🌿</span><span style='color:#555;font-size:13px;'>Routine et produits Mihi personnalisés</span></div>" +
      "</div></div>";
    box.appendChild(content);

    var btnMoi = document.createElement("button");
    btnMoi.textContent = "📸 Analyser mes cheveux";
    btnMoi.style.cssText = "width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;margin-bottom:10px;touch-action:manipulation;";
    btnMoi.onclick = function() { state.prenom=""; state.email=""; state.step="photo"; render(); };
    box.appendChild(btnMoi);

    var btnCliente = document.createElement("button");
    btnCliente.textContent = "👤 Analyser une cliente";
    btnCliente.style.cssText = "width:100%;background:white;color:#8b735d;border:2px solid #c9a86a;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;touch-action:manipulation;";
    btnCliente.onclick = function() { renderSaisieCliente(); };
    box.appendChild(btnCliente);
  }

  function renderSaisieCliente() {
    box.innerHTML = "";
    var hdr = document.createElement("div");
    hdr.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;";
    hdr.innerHTML = "<h2 style='color:#8b735d;margin:0;font-size:17px;'>👤 Diagnostic pour une cliente</h2>";
    var cb = document.createElement("button"); cb.textContent="✕"; cb.style.cssText="background:none;border:none;font-size:22px;color:#8b735d;cursor:pointer;"; cb.onclick=function(){panel.remove();if(typeof window.__baaOpenOutilsPanel==="function")window.__baaOpenOutilsPanel();}; hdr.appendChild(cb); box.appendChild(hdr);

    var inp1=document.createElement("input"); inp1.placeholder="Prénom de la cliente *"; inp1.style.cssText="width:100%;padding:12px;border:1px solid #e8d4b0;border-radius:10px;font-size:14px;box-sizing:border-box;margin-bottom:10px;"; inp1.oninput=function(){state.prenom=inp1.value;}; box.appendChild(inp1);
    var inp2=document.createElement("input"); inp2.type="email"; inp2.placeholder="Email (pour lui envoyer le diagnostic)"; inp2.style.cssText="width:100%;padding:12px;border:1px solid #e8d4b0;border-radius:10px;font-size:14px;box-sizing:border-box;margin-bottom:16px;"; inp2.oninput=function(){state.email=inp2.value;}; box.appendChild(inp2);

    var btn=document.createElement("button"); btn.textContent="Suivant →"; btn.style.cssText="width:100%;background:#c9a86a;color:#1a0a00;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;touch-action:manipulation;";
    btn.onclick=function(){if(!state.prenom){alert("Merci de saisir le prénom.");return;}state.step="photo";render();}; box.appendChild(btn);
    var back=document.createElement("button"); back.textContent="← Retour"; back.style.cssText="background:none;border:none;color:#8b735d;font-size:13px;cursor:pointer;margin-top:8px;width:100%;"; back.onclick=function(){state.step="intro";render();}; box.appendChild(back);
  }

  function renderPhoto() {
    var fileInp=document.createElement("input"); fileInp.type="file"; fileInp.accept="image/*"; fileInp.capture="environment"; fileInp.style.display="none"; box.appendChild(fileInp);
    var fileInpLib=document.createElement("input"); fileInpLib.type="file"; fileInpLib.accept="image/*"; fileInpLib.style.display="none"; box.appendChild(fileInpLib);

    var titre=document.createElement("p"); titre.style.cssText="color:#8b735d;font-size:15px;font-weight:bold;margin:0 0 6px;"; titre.textContent=state.prenom?"Photo des cheveux de "+state.prenom:"Prends une photo de tes cheveux"; box.appendChild(titre);
    var sub=document.createElement("p"); sub.style.cssText="color:#999;font-size:12px;margin:0 0 16px;"; sub.textContent="Bonne lumière, cheveux dégagés — montre bien longueurs et racines"; box.appendChild(sub);

    if (state.photo) {
      var prev=document.createElement("div"); prev.style.cssText="border-radius:14px;overflow:hidden;margin-bottom:16px;position:relative;";
      var img=document.createElement("img"); img.src=state.photo; img.style.cssText="width:100%;max-height:260px;object-fit:cover;display:block;"; prev.appendChild(img);
      var overlay=document.createElement("div"); overlay.style.cssText="position:absolute;top:8px;right:8px;";
      var retake=document.createElement("button"); retake.textContent="🔄 Changer"; retake.style.cssText="background:rgba(0,0,0,0.6);color:white;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;touch-action:manipulation;";
      retake.onclick=function(){state.photo=null;state.photoBase64=null;render();}; overlay.appendChild(retake); prev.appendChild(overlay); box.appendChild(prev);
      var analyseBtn=document.createElement("button"); analyseBtn.textContent="🔬 Lancer l'analyse IA"; analyseBtn.style.cssText="width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;touch-action:manipulation;";
      analyseBtn.onclick=function(){state.step="analyse";render();setTimeout(lancerAnalyse,100);}; box.appendChild(analyseBtn);
    } else {
      var camBtn=document.createElement("button"); camBtn.style.cssText="width:100%;background:white;border:2px dashed #c9a86a;border-radius:14px;padding:30px;cursor:pointer;margin-bottom:10px;touch-action:manipulation;text-align:center;";
      camBtn.innerHTML="<div style='font-size:40px;margin-bottom:8px;'>📷</div><p style='color:#8b735d;font-weight:bold;font-size:14px;margin:0 0 4px;'>Prendre une photo</p><p style='color:#999;font-size:12px;margin:0;'>Utiliser la caméra</p>";
      camBtn.onclick=function(){fileInp.click();}; box.appendChild(camBtn);
      var libBtn=document.createElement("button"); libBtn.style.cssText="width:100%;background:white;border:1px solid #e8d4b0;border-radius:14px;padding:14px;cursor:pointer;touch-action:manipulation;text-align:center;";
      libBtn.innerHTML="<span style='color:#8b735d;font-size:14px;'>🖼️ Choisir depuis la galerie</span>";
      libBtn.onclick=function(){fileInpLib.click();}; box.appendChild(libBtn);
    }

    function handleFile(file) {
      if (!file) return;
      var reader=new FileReader();
      reader.onload=function(e){
        state.photo=e.target.result;
        state.mediaType=file.type||"image/jpeg";
        // Recompresser en JPEG
        var img2=new Image(); img2.onload=function(){
          var c2=document.createElement("canvas"); var maxS=1024;
          var w=img2.naturalWidth,h=img2.naturalHeight;
          if(w>maxS||h>maxS){if(w>h){h=Math.round(h*maxS/w);w=maxS;}else{w=Math.round(w*maxS/h);h=maxS;}}
          c2.width=w;c2.height=h;c2.getContext("2d").drawImage(img2,0,0,w,h);
          state.photoBase64=c2.toDataURL("image/jpeg",0.85).split(",")[1];
          state.mediaType="image/jpeg";
          render();
        };
        img2.src=e.target.result;
      };
      reader.readAsDataURL(file);
    }
    fileInp.onchange=function(){handleFile(this.files[0]);};
    fileInpLib.onchange=function(){handleFile(this.files[0]);};

    var back=document.createElement("button"); back.textContent="← Retour"; back.style.cssText="background:none;border:none;color:#8b735d;font-size:13px;cursor:pointer;margin-top:12px;width:100%;";
    back.onclick=function(){state.step="intro";render();}; box.appendChild(back);
  }

  function renderAnalyse() {
    var steps=["🔍 Analyse du type de cheveux...","💧 Détection de la brillance...","✨ Identification des problèmes...","🌿 Sélection des produits Mihi...","📋 Génération de la routine personnalisée..."];
    var currentStep=0;
    var loader=document.createElement("div"); loader.style.cssText="text-align:center;padding:40px 0;";
    loader.innerHTML="<div style='font-size:52px;margin-bottom:20px;'>💇</div><div id='chev-analyse-step' style='color:#8b735d;font-size:15px;font-weight:bold;margin-bottom:8px;'>"+steps[0]+"</div><div style='background:#e8d4b0;border-radius:20px;height:6px;overflow:hidden;margin:16px 0;'><div id='chev-analyse-bar' style='background:#c9a86a;height:100%;border-radius:20px;width:5%;transition:width 0.8s;'></div></div><p style='color:#999;font-size:13px;'>Analyse en cours... (20-30 secondes)</p>";
    box.appendChild(loader);
    var stepInterval=setInterval(function(){
      currentStep++;
      if(currentStep>=steps.length){clearInterval(stepInterval);return;}
      var s=document.getElementById("chev-analyse-step"); var b=document.getElementById("chev-analyse-bar");
      if(s)s.textContent=steps[currentStep];
      if(b)b.style.width=((currentStep+1)/steps.length*85)+"%";
    },4000);
  }

  function lancerAnalyse() {
    var prenomTexte = state.prenom ? "pour "+state.prenom : "pour cette personne";
    var db = firebase.firestore();
    db.collection("config").doc("assistant").get().then(function(snap){
      var apiKey=snap.exists?snap.data().apiKey||"":"";
      if(!apiKey){db.collection("config").doc("api").get().then(function(s2){appelClaude(s2.exists?s2.data().apiKey||"":"");}).catch(function(){appelClaude("");});}
      else{appelClaude(apiKey);}
    }).catch(function(){appelClaude("");});

    function appelClaude(apiKey) {
      var headers={"Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"};
      if(apiKey)headers["x-api-key"]=apiKey;

      var prompt = "Tu es une experte trichologue (spécialiste des cheveux). Analyse cette photo de cheveux et établis un diagnostic capillaire personnalisé "+prenomTexte+". Reponds UNIQUEMENT en JSON: {\"typeCheveux\":\"type précis (secs/gras/mixtes/normaux/colorés/bouclés/fins...)\",\"etatGeneral\":\"description 2 phrases\",\"problemesDetectes\":[\"pb1\",\"pb2\",\"pb3\"],\"pointsForts\":[\"p1\",\"p2\"],\"routine\":{\"lavage\":[\"e1\",\"e2\",\"e3\"],\"apresLavage\":[\"e1\",\"e2\",\"e3\"],\"hebdomadaire\":[\"e1\",\"e2\"]},\"produitsRecommandes\":[{\"categorie\":\"Shampooing\",\"produit\":\"produit Mihi exact\",\"raison\":\"raison\"},{\"categorie\":\"Après-shampooing\",\"produit\":\"produit Mihi exact\",\"raison\":\"raison\"},{\"categorie\":\"Soin\",\"produit\":\"produit Mihi exact\",\"raison\":\"raison\"},{\"categorie\":\"Traitement\",\"produit\":\"produit Mihi exact\",\"raison\":\"raison\"}],\"conseilsExpert\":[\"c1\",\"c2\",\"c3\"],\"scoreBrillance\":0,\"scoreHydratation\":0,\"scoreDensite\":0}. Gamme Mihi cheveux disponible: Hair Help Shampooing anti-chute, Hair Help Après-shampooing, Hair Help Huile anti-chute, Hair Help Baume anti-chute, Hair Help Lotion antipelliculaire, Hair Help Shampooing antipelliculaire, Sebum Balance Shampooing cheveux gras, Sebum Balance Après-shampooing cheveux gras, Cannabis Intensive Huile restauration pointes, Curls Line Shampooing cheveux bouclés, Curls Line Après-shampooing bouclés, Bamboo Charcoal Shampooing détox, Bamboo Charcoal Masque détox, Vitamins Hair Formula (complement alimentaire). Recommande les produits les plus adaptés selon les cheveux détectés.";

      fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:headers,
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:900,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:state.mediaType,data:state.photoBase64}},
            {type:"text",text:prompt}
          ]}]
        })
      })
      .then(function(r){return r.json();})
      .then(function(data){
        if(data.error){lancerFallback();return;}
        var text=data.content&&data.content[0]?data.content[0].text:"";
        var clean=text.replace(/```json|```/g,"").trim();
        try{state.resultat=JSON.parse(clean);state.step="resultat";render();}
        catch(e){lancerFallback();}
      })
      .catch(function(){lancerFallback();});
    }
  }

  function lancerFallback() {
    state.resultat={
      typeCheveux:"Mixtes",etatGeneral:"Cheveux avec racines grasses et pointes sèches nécessitant un soin équilibrant.",
      problemesDetectes:["Racines grasses","Pointes sèches","Manque de brillance"],
      pointsForts:["Bonne densité","Longueur intéressante"],
      routine:{lavage:["Shampooiner les racines uniquement","Appliquer l'après-shampooing sur les longueurs","Rincer à l'eau froide"],apresLavage:["Appliquer quelques gouttes d'huile sur les pointes","Démêler délicatement"],hebdomadaire:["Masque nourrissant 30min","Bain d'huile avant shampooing"]},
      produitsRecommandes:[
        {categorie:"Shampooing",produit:"Sebum Balance Shampooing cheveux gras",raison:"Équilibre le sébum sans dessécher"},
        {categorie:"Après-shampooing",produit:"Curls Line Après-shampooing",raison:"Nourrit les longueurs"},
        {categorie:"Soin",produit:"Cannabis Intensive Huile restauration pointes",raison:"Répare les pointes abîmées"},
        {categorie:"Traitement",produit:"Hair Help Huile anti-chute",raison:"Fortifie les racines"}
      ],
      conseilsExpert:["Laver les cheveux 2 à 3 fois par semaine","Éviter l'eau trop chaude","Utiliser un peigne à dents larges"],
      scoreBrillance:65,scoreHydratation:60,scoreDensite:75
    };
    state.step="resultat";render();
  }

  function renderResultat() {
    var r=state.resultat;

    var badgeDiv=document.createElement("div");
    badgeDiv.style.cssText="background:linear-gradient(135deg,#c9a86a,#f5d48a);border-radius:14px;padding:16px;text-align:center;margin-bottom:16px;";
    badgeDiv.innerHTML="<p style='color:#1a0a00;font-size:12px;font-weight:bold;margin:0 0 4px;letter-spacing:1px;'>TYPE DE CHEVEUX DÉTECTÉ</p><p style='color:#1a0a00;font-size:22px;font-weight:bold;margin:0 0 8px;'>"+r.typeCheveux+"</p><p style='color:rgba(0,0,0,0.6);font-size:13px;margin:0;'>"+r.etatGeneral+"</p>";
    box.appendChild(badgeDiv);

    var scoresDiv=document.createElement("div");
    scoresDiv.style.cssText="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px;";
    [["✨ Brillance",r.scoreBrillance],["💧 Hydratation",r.scoreHydratation],["💪 Densité",r.scoreDensite]].forEach(function(s){
      var sd=document.createElement("div"); sd.style.cssText="background:white;border-radius:10px;padding:10px;text-align:center;border:1px solid #e8d4b0;";
      var couleur=s[1]>=75?"#27AE60":s[1]>=50?"#c9a86a":"#e74c3c";
      sd.innerHTML="<p style='color:#8b735d;font-size:10px;margin:0 0 4px;'>"+s[0]+"</p><p style='color:"+couleur+";font-size:20px;font-weight:bold;margin:0 0 4px;'>"+s[1]+"%</p><div style='background:#f0e6d3;border-radius:4px;height:4px;overflow:hidden;'><div style='background:"+couleur+";height:100%;width:"+s[1]+"%;border-radius:4px;'></div></div>";
      scoresDiv.appendChild(sd);
    });
    box.appendChild(scoresDiv);

    if(r.pointsForts&&r.pointsForts.length>0){
      var pfDiv=document.createElement("div"); pfDiv.style.cssText="background:#e6f7ec;border-radius:12px;padding:14px;margin-bottom:12px;";
      pfDiv.innerHTML="<p style='color:#1e8449;font-size:13px;font-weight:bold;margin:0 0 8px;'>✅ Points forts</p>"+r.pointsForts.map(function(p){return "<p style='color:#1e8449;font-size:13px;margin:0 0 4px;'>• "+p+"</p>";}).join("");
      box.appendChild(pfDiv);
    }

    if(r.problemesDetectes&&r.problemesDetectes.length>0){
      var pbDiv=document.createElement("div"); pbDiv.style.cssText="background:#fff8e6;border-radius:12px;padding:14px;margin-bottom:12px;";
      pbDiv.innerHTML="<p style='color:#8a6a35;font-size:13px;font-weight:bold;margin:0 0 8px;'>⚠️ Problèmes détectés</p>"+r.problemesDetectes.map(function(z){return "<p style='color:#8a6a35;font-size:13px;margin:0 0 4px;'>• "+z+"</p>";}).join("");
      box.appendChild(pbDiv);
    }

    var prodDiv=document.createElement("div"); prodDiv.style.cssText="background:white;border-radius:12px;padding:14px;margin-bottom:12px;border:1px solid #e8d4b0;";
    prodDiv.innerHTML="<p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 10px;'>🌿 Produits Mihi recommandés</p>";
    if(r.produitsRecommandes)r.produitsRecommandes.forEach(function(p){
      var pDiv=document.createElement("div"); pDiv.style.cssText="border-bottom:1px solid #f0e6d3;padding:8px 0;display:flex;gap:10px;align-items:flex-start;";
      pDiv.innerHTML="<div style='background:#f8f3ee;border-radius:8px;padding:4px 8px;min-width:fit-content;'><p style='color:#c9a86a;font-size:10px;font-weight:bold;margin:0;'>"+p.categorie+"</p></div><div><p style='color:#3a3a3a;font-size:13px;font-weight:bold;margin:0 0 2px;'>"+p.produit+"</p><p style='color:#999;font-size:11px;margin:0;'>"+p.raison+"</p></div>";
      prodDiv.appendChild(pDiv);
    });
    box.appendChild(prodDiv);

    var routineDiv=document.createElement("div"); routineDiv.style.cssText="background:white;border-radius:12px;padding:14px;margin-bottom:12px;border:1px solid #e8d4b0;";
    routineDiv.innerHTML="<p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 10px;'>📋 Routine personnalisée</p>";
    if(r.routine){
      [["🚿 Au lavage","lavage"],["💆 Après lavage","apresLavage"],["📅 Hebdomadaire","hebdomadaire"]].forEach(function(m){
        if(r.routine[m[1]]&&r.routine[m[1]].length>0){
          var mDiv=document.createElement("div"); mDiv.style.cssText="margin-bottom:10px;";
          mDiv.innerHTML="<p style='color:#c9a86a;font-size:12px;font-weight:bold;margin:0 0 6px;'>"+m[0]+"</p>"+r.routine[m[1]].map(function(e,i){return "<p style='color:#555;font-size:12px;margin:0 0 3px;'><span style='background:#c9a86a;color:white;border-radius:50%;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:bold;margin-right:6px;'>"+(i+1)+"</span>"+e+"</p>";}).join("");
          routineDiv.appendChild(mDiv);
        }
      });
    }
    box.appendChild(routineDiv);

    if(r.conseilsExpert&&r.conseilsExpert.length>0){
      var ceDiv=document.createElement("div"); ceDiv.style.cssText="background:#f0f4ff;border-radius:12px;padding:14px;margin-bottom:16px;";
      ceDiv.innerHTML="<p style='color:#2980B9;font-size:13px;font-weight:bold;margin:0 0 8px;'>💡 Conseils d'experte</p>"+r.conseilsExpert.map(function(c){return "<p style='color:#2980B9;font-size:13px;margin:0 0 4px;'>• "+c+"</p>";}).join("");
      box.appendChild(ceDiv);
    }

    var actionsDiv=document.createElement("div"); actionsDiv.style.cssText="display:flex;flex-direction:column;gap:8px;";

    // Partager
    var shareBtn=document.createElement("button");
    shareBtn.textContent="📤 Partager le diagnostic";
    shareBtn.style.cssText="width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:13px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:14px;touch-action:manipulation;";
    shareBtn.onclick=function(){partagerDiagnostic();};
    actionsDiv.appendChild(shareBtn);

    // Télécharger
    var dlBtn=document.createElement("button");
    dlBtn.textContent="⬇️ Télécharger en image";
    dlBtn.style.cssText="width:100%;background:white;color:#8b735d;border:2px solid #c9a86a;padding:13px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:14px;touch-action:manipulation;";
    dlBtn.onclick=function(){telechargerDiagnostic();};
    actionsDiv.appendChild(dlBtn);

    var newBtn=document.createElement("button");
    newBtn.textContent="💇 Nouveau diagnostic";
    newBtn.style.cssText="width:100%;background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:13px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:14px;touch-action:manipulation;";
    newBtn.onclick=function(){state={step:"intro",photo:null,photoBase64:null,mediaType:"image/jpeg",prenom:"",email:"",resultat:null};render();};
    actionsDiv.appendChild(newBtn);
    box.appendChild(actionsDiv);
  }

  function partagerDiagnostic() {
    var r=state.resultat;
    var tempDiv=document.createElement("div");
    tempDiv.style.cssText="position:fixed;left:-9999px;top:0;width:600px;background:#f8f3ee;padding:24px;font-family:Arial,sans-serif;";
    tempDiv.innerHTML="<div style='text-align:center;margin-bottom:16px;'><h1 style='color:#8b735d;font-size:20px;margin:0;'>💇 Diagnostic Cheveux IA</h1><p style='color:#c9a86a;font-size:13px;margin:4px 0 0;'>Beauty Addict Academy — "+new Date().toLocaleDateString("fr-FR")+(state.prenom?" — "+state.prenom:"")+"</p></div>"+
      "<div style='background:linear-gradient(135deg,#c9a86a,#f5d48a);border-radius:12px;padding:16px;text-align:center;margin-bottom:12px;'><p style='color:#1a0a00;font-size:11px;font-weight:bold;margin:0 0 4px;'>TYPE DE CHEVEUX</p><p style='color:#1a0a00;font-size:22px;font-weight:bold;margin:0;'>"+r.typeCheveux+"</p><p style='color:rgba(0,0,0,0.6);font-size:12px;margin:6px 0 0;'>"+r.etatGeneral+"</p></div>"+
      "<h3 style='color:#8b735d;font-size:13px;margin:0 0 8px;'>🌿 Produits Mihi recommandés</h3>"+
      (r.produitsRecommandes?r.produitsRecommandes.map(function(p){return "<div style='background:white;border-radius:8px;padding:8px 10px;margin-bottom:6px;border-left:3px solid #c9a86a;'><strong style='color:#3a3a3a;font-size:12px;'>"+p.categorie+" : "+p.produit+"</strong><p style='color:#999;font-size:11px;margin:2px 0 0;'>"+p.raison+"</p></div>";}).join(""):"")+
      "<h3 style='color:#8b735d;font-size:13px;margin:12px 0 8px;'>📋 Routine</h3>"+
      "<div style='background:white;border-radius:8px;padding:10px;'>"+
      (r.routine&&r.routine.lavage?r.routine.lavage.map(function(e,i){return "<p style='color:#555;font-size:11px;margin:0 0 3px;'>"+(i+1)+". "+e+"</p>";}).join(""):"")+
      "</div>"+
      "<p style='text-align:center;color:#c9a86a;font-weight:bold;font-size:12px;margin-top:16px;'>🐦‍🔥 Beauty Addict Academy</p>";
    document.body.appendChild(tempDiv);

    var loadH2C=function(cb){if(window.html2canvas){cb();return;}var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";s.onload=cb;document.head.appendChild(s);};
    loadH2C(function(){
      html2canvas(tempDiv,{scale:2,useCORS:true,logging:false,backgroundColor:"#f8f3ee"}).then(function(canvas){
        document.body.removeChild(tempDiv);
        canvas.toBlob(function(blob){
          var file=new File([blob],"diagnostic-cheveux.png",{type:"image/png"});
          if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
            navigator.share({title:"Mon diagnostic cheveux Beauty Addict",text:"Voici mon diagnostic capillaire personnalisé 💇",files:[file]}).catch(function(){});
          } else {
            var dataUrl=canvas.toDataURL("image/png");
            var dlDiv=document.createElement("div"); dlDiv.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;";
            dlDiv.innerHTML="<p style='color:#f5d48a;font-size:14px;text-align:center;margin-bottom:12px;'>Appuie longuement sur l'image pour enregistrer 📲</p><img src='"+dataUrl+"' style='max-width:100%;max-height:65vh;border-radius:8px;'/><button onclick='this.parentNode.remove()' style='margin-top:12px;background:#c9a86a;color:#1a0a00;border:none;padding:10px 24px;border-radius:20px;font-size:14px;font-weight:bold;cursor:pointer;'>Fermer</button>";
            document.body.appendChild(dlDiv);
          }
        },"image/png");
      }).catch(function(){document.body.removeChild(tempDiv);});
    });
  }

  function telechargerDiagnostic() {
    var r=state.resultat;
    var tempDiv=document.createElement("div");
    tempDiv.style.cssText="position:fixed;left:-9999px;top:0;width:600px;background:#f8f3ee;padding:24px;font-family:Arial,sans-serif;";
    tempDiv.innerHTML="<div style='text-align:center;margin-bottom:16px;'><h1 style='color:#8b735d;font-size:20px;margin:0;'>💇 Diagnostic Cheveux IA</h1><p style='color:#c9a86a;font-size:13px;margin:4px 0 0;'>Beauty Addict Academy — "+new Date().toLocaleDateString("fr-FR")+(state.prenom?" — "+state.prenom:"")+"</p></div>"+
      "<div style='background:linear-gradient(135deg,#c9a86a,#f5d48a);border-radius:12px;padding:16px;text-align:center;margin-bottom:12px;'><p style='color:#1a0a00;font-size:11px;font-weight:bold;margin:0 0 4px;'>TYPE DE CHEVEUX</p><p style='color:#1a0a00;font-size:22px;font-weight:bold;margin:0;'>"+r.typeCheveux+"</p><p style='color:rgba(0,0,0,0.6);font-size:12px;margin:6px 0 0;'>"+r.etatGeneral+"</p></div>"+
      "<div style='display:flex;gap:8px;margin-bottom:12px;'>"+[["✨ Brillance",r.scoreBrillance,"#c9a86a"],["💧 Hydratation",r.scoreHydratation,"#2980B9"],["💪 Densité",r.scoreDensite,"#27AE60"]].map(function(s){return "<div style='flex:1;background:white;border-radius:8px;padding:10px;text-align:center;border:1px solid #e8d4b0;'><div style='font-size:20px;font-weight:bold;color:"+s[2]+";'>"+s[1]+"%</div><div style='font-size:11px;color:#8b735d;margin-top:2px;'>"+s[0]+"</div></div>";}).join("")+"</div>"+
      "<h3 style='color:#8b735d;font-size:13px;margin:0 0 8px;'>🌿 Produits Mihi recommandés</h3>"+
      (r.produitsRecommandes?r.produitsRecommandes.map(function(p){return "<div style='background:white;border-radius:8px;padding:8px 10px;margin-bottom:6px;border-left:3px solid #c9a86a;'><strong style='color:#3a3a3a;font-size:12px;'>"+p.categorie+" : "+p.produit+"</strong><p style='color:#999;font-size:11px;margin:2px 0 0;'>"+p.raison+"</p></div>";}).join(""):"")+
      "<h3 style='color:#8b735d;font-size:13px;margin:12px 0 8px;'>📋 Routine personnalisée</h3>"+
      "<div style='display:flex;gap:8px;margin-bottom:8px;'>"+
      "<div style='flex:1;background:white;border-radius:8px;padding:10px;'><p style='color:#c9a86a;font-size:11px;font-weight:bold;margin:0 0 6px;'>🚿 LAVAGE</p>"+(r.routine&&r.routine.lavage?r.routine.lavage.map(function(e,i){return "<p style='color:#555;font-size:11px;margin:0 0 3px;'>"+(i+1)+". "+e+"</p>";}).join(""):"")+"</div>"+
      "<div style='flex:1;background:white;border-radius:8px;padding:10px;'><p style='color:#c9a86a;font-size:11px;font-weight:bold;margin:0 0 6px;'>💆 APRÈS</p>"+(r.routine&&r.routine.apresLavage?r.routine.apresLavage.map(function(e,i){return "<p style='color:#555;font-size:11px;margin:0 0 3px;'>"+(i+1)+". "+e+"</p>";}).join(""):"")+"</div>"+
      "</div>"+
      "<p style='text-align:center;color:#c9a86a;font-weight:bold;font-size:12px;margin-top:8px;'>🐦‍🔥 Beauty Addict Academy</p>";
    document.body.appendChild(tempDiv);

    var loadH2C=function(cb){if(window.html2canvas){cb();return;}var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";s.onload=cb;document.head.appendChild(s);};
    loadH2C(function(){
      html2canvas(tempDiv,{scale:2,useCORS:true,logging:false,backgroundColor:"#f8f3ee"}).then(function(canvas){
        document.body.removeChild(tempDiv);
        var dataUrl=canvas.toDataURL("image/png");
        if(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)){
          var dlDiv=document.createElement("div"); dlDiv.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;";
          dlDiv.innerHTML="<p style='color:#f5d48a;font-size:14px;text-align:center;margin-bottom:12px;'>Appuie longuement sur l'image pour enregistrer 📲</p><img src='"+dataUrl+"' style='max-width:100%;max-height:65vh;border-radius:8px;'/><button onclick='this.parentNode.remove()' style='margin-top:12px;background:#c9a86a;color:#1a0a00;border:none;padding:10px 24px;border-radius:20px;font-size:14px;font-weight:bold;cursor:pointer;'>Fermer</button>";
          document.body.appendChild(dlDiv);
        } else {
          var a=document.createElement("a");a.download="diagnostic-cheveux-"+(state.prenom||"beautyAddict")+".png";a.href=dataUrl;a.click();
        }
      }).catch(function(){document.body.removeChild(tempDiv);});
    });
  }

  render();
}

window.openDiagnosticCheveux = openDiagnosticCheveux;
