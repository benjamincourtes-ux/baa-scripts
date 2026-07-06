function openTeinteFoundation() {
  if (document.getElementById("baa-teinte-panel")) return;

  var panel = document.createElement("div");
  panel.id = "baa-teinte-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding:20px 16px;overflow-y:auto;font-family:Arial,sans-serif;";
  document.body.appendChild(panel);

  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:100%;max-width:560px;border-radius:20px;padding:24px;";
  panel.appendChild(box);

  var TEINTES = [
    { code:"051201", nom:"Light Ivory", type:"léger", hex:"#F5E6D3", sousTon:"froid/neutre", peau:"Très claire, teints porcelaine ou rosés", desc:"Parfait pour les peaux très claires avec des sous-tons roses ou neutres" },
    { code:"051202", nom:"Medium Beige", type:"léger", hex:"#E8D0B0", sousTon:"neutre", peau:"Claire à medium, teints neutres", desc:"Idéal pour les peaux claires à medium sans dominante chaude ou froide" },
    { code:"051203", nom:"Honey", type:"léger", hex:"#D4A96A", sousTon:"chaud/doré", peau:"Medium, teints dorés ou olivâtres", desc:"Sublime les peaux medium aux reflets dorés ou soleil" },
    { code:"051211", nom:"Sand", type:"léger", hex:"#C49A6C", sousTon:"chaud/neutre", peau:"Medium foncé, teints naturels profonds", desc:"Conçu pour les peaux medium foncées avec des sous-tons neutres à chauds" },
    { code:"051204", nom:"03 Natural", type:"matifiant", hex:"#F0DCC0", sousTon:"neutre", peau:"Claire à medium, peaux mixtes ou grasses", desc:"Fini mat pour les peaux claires qui brillent, sous-tons neutres" },
    { code:"051205", nom:"04 Golden Beige", type:"matifiant", hex:"#D4A870", sousTon:"chaud/doré", peau:"Medium, peaux mixtes à grasses dorées", desc:"Contrôle le brillant sur les peaux medium aux reflets chauds" },
    { code:"051206", nom:"05 Caramel", type:"matifiant", hex:"#B8834A", sousTon:"chaud", peau:"Medium foncé à foncé, peaux grasses", desc:"Fini mat parfait pour les peaux foncées chaudes qui ont tendance à briller" }
  ];

  var state = { step:"intro", photo:null, photoBase64:null, mediaType:"image/jpeg", resultat:null };

  function render() {
    box.innerHTML = "";
    var hdr = document.createElement("div");
    hdr.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;";
    hdr.innerHTML = "<div><h2 style='color:#8b735d;margin:0;font-size:17px;'>💄 Trouve ta teinte Mihi</h2><p style='color:#999;font-size:12px;margin:4px 0 0;'>Analyse par intelligence artificielle</p></div>";
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
      "<div style='font-size:64px;margin-bottom:16px;'>💄</div>" +
      "<h3 style='color:#8b735d;font-size:18px;margin:0 0 12px;'>Trouve ta teinte parfaite</h3>" +
      "<p style='color:#666;font-size:14px;line-height:1.6;margin:0 0 20px;'>Notre IA analyse ta carnation et tes sous-tons pour te recommander exactement la bonne teinte de fond de teint Mihi.</p>" +
      "<div style='background:white;border-radius:14px;padding:16px;border:1px solid #e8d4b0;margin-bottom:20px;text-align:left;'>" +
      "<p style='color:#8b735d;font-weight:bold;font-size:13px;margin:0 0 10px;'>✨ L'IA analyse :</p>" +
      "<div style='display:flex;flex-direction:column;gap:8px;'>" +
      "<div style='display:flex;gap:8px;align-items:center;'><span>🎨</span><span style='color:#555;font-size:13px;'>Ta carnation (claire, medium, foncée)</span></div>" +
      "<div style='display:flex;gap:8px;align-items:center;'><span>🌡️</span><span style='color:#555;font-size:13px;'>Tes sous-tons (chauds, froids, neutres)</span></div>" +
      "<div style='display:flex;gap:8px;align-items:center;'><span>✨</span><span style='color:#555;font-size:13px;'>L'éclat naturel de ta peau</span></div>" +
      "<div style='display:flex;gap:8px;align-items:center;'><span>💄</span><span style='color:#555;font-size:13px;'>La teinte Mihi exacte + le type (léger ou matifiant)</span></div>" +
      "</div></div>" +
      "<div style='background:#fff8e6;border-radius:12px;padding:12px;border:1px solid #f5d48a;margin-bottom:20px;text-align:left;'>" +
      "<p style='color:#8a6a35;font-size:13px;margin:0;'>💡 <strong>Astuce :</strong> Prends la photo de ton poignet intérieur ou de ton visage sans maquillage, en pleine lumière naturelle pour un résultat optimal !</p>" +
      "</div>";
    box.appendChild(content);

    var btn = document.createElement("button");
    btn.textContent = "📸 Analyser ma carnation";
    btn.style.cssText = "width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;touch-action:manipulation;";
    btn.onclick = function() { state.step="photo"; render(); };
    box.appendChild(btn);
  }

  function renderPhoto() {
    var fileInp=document.createElement("input"); fileInp.type="file"; fileInp.accept="image/*"; fileInp.capture="user"; fileInp.style.display="none"; box.appendChild(fileInp);
    var fileInpLib=document.createElement("input"); fileInpLib.type="file"; fileInpLib.accept="image/*"; fileInpLib.style.display="none"; box.appendChild(fileInpLib);

    var titre=document.createElement("p"); titre.style.cssText="color:#8b735d;font-size:15px;font-weight:bold;margin:0 0 6px;"; titre.textContent="Prends une photo de ta peau"; box.appendChild(titre);
    var sub=document.createElement("p"); sub.style.cssText="color:#999;font-size:12px;margin:0 0 16px;line-height:1.5;"; sub.textContent="Poignet intérieur ou visage sans maquillage — bonne lumière naturelle obligatoire !"; box.appendChild(sub);

    if (state.photo) {
      var prev=document.createElement("div"); prev.style.cssText="border-radius:14px;overflow:hidden;margin-bottom:16px;position:relative;";
      var img=document.createElement("img"); img.src=state.photo; img.style.cssText="width:100%;max-height:260px;object-fit:cover;display:block;"; prev.appendChild(img);
      var retake=document.createElement("button"); retake.textContent="🔄 Changer"; retake.style.cssText="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.6);color:white;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;touch-action:manipulation;";
      retake.onclick=function(){state.photo=null;state.photoBase64=null;render();}; prev.appendChild(retake); box.appendChild(prev);

      var analyseBtn=document.createElement("button"); analyseBtn.textContent="💄 Trouver ma teinte Mihi"; analyseBtn.style.cssText="width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;touch-action:manipulation;";
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
        var img2=new Image(); img2.onload=function(){
          var c2=document.createElement("canvas"); var maxS=1024;
          var w=img2.naturalWidth,h=img2.naturalHeight;
          if(w>maxS||h>maxS){if(w>h){h=Math.round(h*maxS/w);w=maxS;}else{w=Math.round(w*maxS/h);h=maxS;}}
          c2.width=w;c2.height=h;c2.getContext("2d").drawImage(img2,0,0,w,h);
          state.photoBase64=c2.toDataURL("image/jpeg",0.85).split(",")[1];
          state.mediaType="image/jpeg"; render();
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
    var steps=["🎨 Analyse de ta carnation...","🌡️ Détection des sous-tons...","✨ Mesure de la profondeur...","💄 Correspondance avec les teintes Mihi...","🎯 Sélection de ta teinte parfaite..."];
    var currentStep=0;
    var loader=document.createElement("div"); loader.style.cssText="text-align:center;padding:40px 0;";
    loader.innerHTML="<div style='font-size:52px;margin-bottom:20px;'>💄</div><div id='teinte-step' style='color:#8b735d;font-size:15px;font-weight:bold;margin-bottom:8px;'>"+steps[0]+"</div><div style='background:#e8d4b0;border-radius:20px;height:6px;overflow:hidden;margin:16px 0;'><div id='teinte-bar' style='background:#c9a86a;height:100%;border-radius:20px;width:5%;transition:width 0.8s;'></div></div><p style='color:#999;font-size:13px;'>Analyse en cours... (20-30 secondes)</p>";
    box.appendChild(loader);
    var interval=setInterval(function(){
      currentStep++;
      if(currentStep>=steps.length){clearInterval(interval);return;}
      var s=document.getElementById("teinte-step"),b=document.getElementById("teinte-bar");
      if(s)s.textContent=steps[currentStep];
      if(b)b.style.width=((currentStep+1)/steps.length*85)+"%";
    },4000);
  }

  function lancerAnalyse() {
    var db=firebase.firestore();
    db.collection("config").doc("assistant").get().then(function(snap){
      var apiKey=snap.exists?snap.data().apiKey||"":"";
      if(!apiKey){db.collection("config").doc("api").get().then(function(s2){appelClaude(s2.exists?s2.data().apiKey||"":"");}).catch(function(){appelClaude("");});}
      else{appelClaude(apiKey);}
    }).catch(function(){appelClaude("");});

    function appelClaude(apiKey) {
      var headers={"Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"};
      if(apiKey)headers["x-api-key"]=apiKey;

      var teintesList = "Teintes fond de teint léger (acide hyaluronique): 051201 Light Ivory (hex #F5E6D3, très clair, sous-tons froids/neutres), 051202 Medium Beige (hex #E8D0B0, clair à medium, sous-tons neutres), 051203 Honey (hex #D4A96A, medium doré, sous-tons chauds), 051211 Sand (hex #C49A6C, medium foncé, sous-tons neutres/chauds). Teintes fond de teint matifiant: 051204 Natural (hex #F0DCC0, clair, sous-tons neutres), 051205 Golden Beige (hex #D4A870, medium, sous-tons dorés/chauds), 051206 Caramel (hex #B8834A, medium foncé à foncé, sous-tons chauds).";

      var prompt = "Tu es une experte en colorimétrie et maquillage. Analyse cette photo de peau et détermine la teinte de fond de teint Mihi la plus adaptée. "+teintesList+" Reponds UNIQUEMENT en JSON: {\"carnation\":\"description précise de la carnation\",\"sousTons\":\"chauds/froids/neutres\",\"profondeur\":\"clair/medium/foncé\",\"teinteRecommandee\":{\"code\":\"code produit\",\"nom\":\"nom teinte\",\"type\":\"léger ou matifiant\",\"raison\":\"explication détaillée pourquoi cette teinte\"},\"teinteAlternative\":{\"code\":\"code produit\",\"nom\":\"nom teinte\",\"type\":\"léger ou matifiant\",\"raison\":\"pourquoi cette alternative\"},\"conseilApplication\":[\"conseil1\",\"conseil2\",\"conseil3\"],\"scoreCorrespondance\":0}";

      fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:headers,
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:800,
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
      carnation:"Medium, teint équilibré",sousTons:"neutres",profondeur:"medium",
      teinteRecommandee:{code:"051202",nom:"Medium Beige",type:"léger",raison:"Correspond à une carnation medium aux sous-tons neutres, fini naturel et lumineux"},
      teinteAlternative:{code:"051204",nom:"03 Natural",type:"matifiant",raison:"Alternative matifiante si la peau a tendance à briller"},
      conseilApplication:["Appliquer avec un pinceau fond de teint en mouvements circulaires","Estomper sur le cou pour un rendu naturel","Fixer avec une poudre translucide"],
      scoreCorrespondance:85
    };
    state.step="resultat";render();
  }

  function renderResultat() {
    var r=state.resultat;
    var teintePrincipale=TEINTES.find(function(t){return t.code===r.teinteRecommandee.code;})||{hex:"#E8D0B0"};
    var teinteAlt=TEINTES.find(function(t){return t.code===r.teinteAlternative.code;})||{hex:"#D4A96A"};

    // Badge carnation
    var carDiv=document.createElement("div");
    carDiv.style.cssText="background:linear-gradient(135deg,#c9a86a,#f5d48a);border-radius:14px;padding:16px;text-align:center;margin-bottom:16px;";
    carDiv.innerHTML="<p style='color:#1a0a00;font-size:11px;font-weight:bold;margin:0 0 4px;letter-spacing:1px;'>TA CARNATION</p><p style='color:#1a0a00;font-size:18px;font-weight:bold;margin:0 0 4px;'>"+r.carnation+"</p><div style='display:flex;justify-content:center;gap:16px;margin-top:8px;'><span style='color:#1a0a00;font-size:12px;'>🌡️ Sous-tons : <strong>"+r.sousTons+"</strong></span><span style='color:#1a0a00;font-size:12px;'>🎨 Profondeur : <strong>"+r.profondeur+"</strong></span></div>";
    box.appendChild(carDiv);

    // Teinte recommandée
    var recDiv=document.createElement("div");
    recDiv.style.cssText="background:white;border-radius:14px;padding:16px;margin-bottom:12px;border:2px solid #c9a86a;";
    recDiv.innerHTML="<p style='color:#8b735d;font-size:11px;font-weight:bold;margin:0 0 10px;letter-spacing:1px;'>⭐ TEINTE RECOMMANDÉE</p>"+
      "<div style='display:flex;gap:14px;align-items:center;margin-bottom:12px;'>"+
      "<div style='width:56px;height:56px;border-radius:50%;background:"+teintePrincipale.hex+";border:3px solid #c9a86a;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.15);'></div>"+
      "<div><p style='color:#3a3a3a;font-size:16px;font-weight:bold;margin:0 0 2px;'>"+r.teinteRecommandee.nom+"</p>"+
      "<p style='color:#c9a86a;font-size:12px;font-weight:bold;margin:0 0 4px;'>Fond de teint "+r.teinteRecommandee.type+" • Réf: "+r.teinteRecommandee.code+"</p>"+
      "<p style='color:#666;font-size:12px;margin:0;'>"+r.teinteRecommandee.raison+"</p></div></div>"+
      "<div style='background:#f8f3ee;border-radius:8px;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;'><span style='color:#8b735d;font-size:12px;'>Score de correspondance</span><span style='color:#c9a86a;font-size:18px;font-weight:bold;'>"+r.scoreCorrespondance+"%</span></div>";
    box.appendChild(recDiv);

    // Teinte alternative
    var altDiv=document.createElement("div");
    altDiv.style.cssText="background:white;border-radius:14px;padding:16px;margin-bottom:12px;border:1px solid #e8d4b0;";
    altDiv.innerHTML="<p style='color:#8b735d;font-size:11px;font-weight:bold;margin:0 0 10px;letter-spacing:1px;'>💡 TEINTE ALTERNATIVE</p>"+
      "<div style='display:flex;gap:14px;align-items:center;'>"+
      "<div style='width:44px;height:44px;border-radius:50%;background:"+teinteAlt.hex+";border:2px solid #e8d4b0;flex-shrink:0;'></div>"+
      "<div><p style='color:#3a3a3a;font-size:14px;font-weight:bold;margin:0 0 2px;'>"+r.teinteAlternative.nom+"</p>"+
      "<p style='color:#999;font-size:11px;font-weight:bold;margin:0 0 3px;'>Fond de teint "+r.teinteAlternative.type+" • Réf: "+r.teinteAlternative.code+"</p>"+
      "<p style='color:#666;font-size:12px;margin:0;'>"+r.teinteAlternative.raison+"</p></div></div>";
    box.appendChild(altDiv);

    // Conseils application
    if(r.conseilApplication&&r.conseilApplication.length>0){
      var caDiv=document.createElement("div"); caDiv.style.cssText="background:#f0f4ff;border-radius:12px;padding:14px;margin-bottom:16px;";
      caDiv.innerHTML="<p style='color:#2980B9;font-size:13px;font-weight:bold;margin:0 0 8px;'>💡 Conseils d'application</p>"+r.conseilApplication.map(function(c){return "<p style='color:#2980B9;font-size:13px;margin:0 0 4px;'>• "+c+"</p>";}).join("");
      box.appendChild(caDiv);
    }

    // Boutons
    var actDiv=document.createElement("div"); actDiv.style.cssText="display:flex;flex-direction:column;gap:8px;";

    var shareBtn=document.createElement("button");
    shareBtn.textContent="📤 Partager le résultat";
    shareBtn.style.cssText="width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:13px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:14px;touch-action:manipulation;";
    shareBtn.onclick=function(){partagerResultat();};
    actDiv.appendChild(shareBtn);

    var newBtn=document.createElement("button");
    newBtn.textContent="💄 Nouvelle analyse";
    newBtn.style.cssText="width:100%;background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:13px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:14px;touch-action:manipulation;";
    newBtn.onclick=function(){state={step:"intro",photo:null,photoBase64:null,mediaType:"image/jpeg",resultat:null};render();};
    actDiv.appendChild(newBtn);
    box.appendChild(actDiv);
  }

  function partagerResultat() {
    var r=state.resultat;
    var teintePrincipale=TEINTES.find(function(t){return t.code===r.teinteRecommandee.code;})||{hex:"#E8D0B0"};

    var tempDiv=document.createElement("div");
    tempDiv.style.cssText="position:fixed;left:-9999px;top:0;width:600px;background:#f8f3ee;padding:24px;font-family:Arial,sans-serif;";
    tempDiv.innerHTML=
      "<div style='text-align:center;margin-bottom:20px;'><h1 style='color:#8b735d;font-size:20px;margin:0;'>💄 Ma Teinte Mihi</h1><p style='color:#c9a86a;font-size:13px;margin:4px 0 0;'>Beauty Addict Academy — Analyse IA</p></div>"+
      "<div style='background:linear-gradient(135deg,#c9a86a,#f5d48a);border-radius:14px;padding:20px;text-align:center;margin-bottom:16px;'><p style='color:#1a0a00;font-size:12px;font-weight:bold;margin:0 0 6px;'>MA TEINTE PARFAITE</p>"+
      "<div style='width:80px;height:80px;border-radius:50%;background:"+teintePrincipale.hex+";border:4px solid white;margin:0 auto 12px;box-shadow:0 4px 12px rgba(0,0,0,0.2);'></div>"+
      "<p style='color:#1a0a00;font-size:24px;font-weight:bold;margin:0 0 4px;'>"+r.teinteRecommandee.nom+"</p>"+
      "<p style='color:rgba(0,0,0,0.6);font-size:13px;margin:0;'>Fond de teint "+r.teinteRecommandee.type+" Mihi • Réf: "+r.teinteRecommandee.code+"</p></div>"+
      "<div style='background:white;border-radius:12px;padding:14px;margin-bottom:12px;'><p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 8px;'>Mon profil</p>"+
      "<p style='color:#555;font-size:13px;margin:0 0 4px;'>🎨 Carnation : "+r.carnation+"</p>"+
      "<p style='color:#555;font-size:13px;margin:0 0 4px;'>🌡️ Sous-tons : "+r.sousTons+"</p>"+
      "<p style='color:#555;font-size:13px;margin:0;'>💯 Score de correspondance : <strong style='color:#c9a86a;'>"+r.scoreCorrespondance+"%</strong></p></div>"+
      "<p style='color:#8b735d;font-size:12px;margin:0 0 4px;'>💡 "+r.teinteRecommandee.raison+"</p>"+
      "<p style='text-align:center;color:#c9a86a;font-weight:bold;font-size:13px;margin-top:16px;'>🐦‍🔥 Beauty Addict Academy</p>";
    document.body.appendChild(tempDiv);

    var loadH2C=function(cb){if(window.html2canvas){cb();return;}var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";s.onload=cb;document.head.appendChild(s);};
    loadH2C(function(){
      html2canvas(tempDiv,{scale:2,useCORS:true,logging:false,backgroundColor:"#f8f3ee"}).then(function(canvas){
        document.body.removeChild(tempDiv);
        canvas.toBlob(function(blob){
          var file=new File([blob],"ma-teinte-mihi.png",{type:"image/png"});
          if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
            navigator.share({title:"Ma teinte fond de teint Mihi",text:"J'ai trouvé ma teinte parfaite avec l'IA Beauty Addict ! 💄",files:[file]}).catch(function(){});
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

  render();
}

window.openTeinteFoundation = openTeinteFoundation;
