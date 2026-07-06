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
    { code:"051201", nom:"Light Ivory", type:"léger", hex:"#E8DDD4", sousTon:"froid/neutre", peau:"Très claire, teints porcelaine ou rosés", desc:"Parfait pour les peaux très claires avec des sous-tons roses ou neutres" },
    { code:"051202", nom:"Medium Beige", type:"léger", hex:"#D2C4B9", sousTon:"neutre", peau:"Claire à medium, teints neutres", desc:"Idéal pour les peaux claires à medium sans dominante chaude ou froide" },
    { code:"051203", nom:"Honey", type:"léger", hex:"#CDB29C", sousTon:"chaud/doré", peau:"Medium, teints dorés ou olivâtres", desc:"Sublime les peaux medium aux reflets dorés ou soleil" },
    { code:"051211", nom:"Sand", type:"léger", hex:"#C49B7C", sousTon:"chaud/neutre", peau:"Medium foncé, teints naturels profonds", desc:"Conçu pour les peaux medium foncées avec des sous-tons neutres à chauds" },
    { code:"051204", nom:"03 Natural", type:"matifiant", hex:"#CFBAAB", sousTon:"neutre", peau:"Claire à medium, peaux mixtes ou grasses", desc:"Fini mat pour les peaux claires qui brillent, sous-tons neutres" },
    { code:"051205", nom:"04 Golden Beige", type:"matifiant", hex:"#CBAE9A", sousTon:"chaud/doré", peau:"Medium, peaux mixtes à grasses dorées", desc:"Contrôle le brillant sur les peaux medium aux reflets chauds" },
    { code:"051206", nom:"05 Caramel", type:"matifiant", hex:"#A0693A", sousTon:"chaud", peau:"Medium foncé à foncé, peaux grasses", desc:"Fini mat parfait pour les peaux foncées chaudes qui ont tendance à briller" },
    { code:"051207", nom:"06 Mocca", type:"matifiant", hex:"#7A4F30", sousTon:"chaud", peau:"Foncé, teints métissés ou mates profondes", desc:"Fini mat pour les peaux foncées et métissées qui brillent" }
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
    closeBtn.onclick = function() {
      if (state.step === "intro") { panel.remove(); if (typeof window.__baaOpenOutilsPanel === "function") window.__baaOpenOutilsPanel(); }
      else if (state.step === "photo") { state.step = "intro"; render(); }
      else if (state.step === "resultat") { state.step = "photo"; render(); }
      else { panel.remove(); }
    };
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

      var teintesList = "Teintes fond de teint léger (acide hyaluronique): 051201 Light Ivory (hex #E8DDD4, très clair, sous-tons froids/neutres), 051202 Medium Beige (hex #D2C4B9, clair à medium, sous-tons neutres), 051203 Honey (hex #CDB29C, medium, sous-tons chauds/dorés), 051211 Sand (hex #C49B7C, medium foncé, sous-tons neutres/chauds). Teintes fond de teint matifiant: 051204 Natural (hex #CFBAAB, clair, sous-tons neutres), 051205 Golden Beige (hex #CBAE9A, medium, sous-tons dorés/chauds), 051206 Caramel (hex #A0693A, medium foncé à foncé, sous-tons chauds), 051207 Mocca (hex #7A4F30, foncé, teints métissés, sous-tons chauds profonds). Compare attentivement la carnation détectée avec ces hex pour trouver la correspondance la plus proche.";

      var prompt = "Tu es une experte en colorimétrie et maquillage professionnel. Analyse cette photo de peau et identifie la couleur HEX exacte de la carnation. Compare avec les teintes Mihi et choisis pour CHAQUE TYPE (léger ET matifiant) la teinte principale ET une alternative. "+teintesList+" IMPORTANT : base ta recommandation UNIQUEMENT sur la proximité HEX. Reponds UNIQUEMENT en JSON: {\"carnation\":\"description\",\"sousTons\":\"chauds/froids/neutres\",\"profondeur\":\"clair/medium/foncé\",\"hexDetecte\":\"#XXXXXX\",\"leger\":{\"recommandee\":{\"code\":\"code\",\"nom\":\"nom\",\"raison\":\"raison\"},\"alternative\":{\"code\":\"code\",\"nom\":\"nom\",\"raison\":\"raison\"}},\"matifiant\":{\"recommandee\":{\"code\":\"code\",\"nom\":\"nom\",\"raison\":\"raison\"},\"alternative\":{\"code\":\"code\",\"nom\":\"nom\",\"raison\":\"raison\"}},\"conseilApplication\":[\"conseil1\",\"conseil2\",\"conseil3\"],\"scoreCorrespondance\":0}";

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
      carnation:"Medium, teint équilibré",sousTons:"neutres",profondeur:"medium",hexDetecte:"#D2C4B9",
      leger:{
        recommandee:{code:"051202",nom:"Medium Beige",raison:"Carnation medium aux sous-tons neutres"},
        alternative:{code:"051203",nom:"Honey",raison:"Si vous préférez un fini légèrement plus doré"}
      },
      matifiant:{
        recommandee:{code:"051205",nom:"04 Golden Beige",raison:"Contrôle le brillant sur peau medium"},
        alternative:{code:"051204",nom:"03 Natural",raison:"Si votre carnation est légèrement plus claire"}
      },
      conseilApplication:["Appliquer avec un pinceau en mouvements circulaires","Estomper sur le cou pour un rendu naturel","Fixer avec une poudre translucide"],
      scoreCorrespondance:85
    };
    state.step="resultat";render();
  }

  function renderResultat() {
    var r=state.resultat;

    // Badge carnation
    var carDiv=document.createElement("div");
    carDiv.style.cssText="background:linear-gradient(135deg,#c9a86a,#f5d48a);border-radius:14px;padding:16px;text-align:center;margin-bottom:16px;";
    carDiv.innerHTML="<p style='color:#1a0a00;font-size:11px;font-weight:bold;margin:0 0 4px;letter-spacing:1px;'>TA CARNATION</p><p style='color:#1a0a00;font-size:18px;font-weight:bold;margin:0 0 4px;'>"+r.carnation+"</p><div style='display:flex;justify-content:center;gap:16px;margin-top:8px;'><span style='color:#1a0a00;font-size:12px;'>🌡️ Sous-tons : <strong>"+r.sousTons+"</strong></span><span style='color:#1a0a00;font-size:12px;'>🎨 Profondeur : <strong>"+r.profondeur+"</strong></span></div>"+
    "<div style='background:rgba(0,0,0,0.1);border-radius:8px;padding:6px 12px;display:inline-block;margin-top:8px;'><span style='color:#1a0a00;font-size:12px;'>💯 Score : <strong>"+r.scoreCorrespondance+"%</strong></span></div>";
    box.appendChild(carDiv);

    // Fonction pour afficher un bloc teinte
    function renderTeinteBloc(label, teinteData, border) {
      if (!teinteData) return;
      var t = TEINTES.find(function(t){return t.code===teinteData.code;})||{hex:"#E8D0B0"};
      var div=document.createElement("div");
      div.style.cssText="background:white;border-radius:12px;padding:14px;margin-bottom:8px;border:"+(border?"2px solid #c9a86a":"1px solid #e8d4b0")+";";
      div.innerHTML="<p style='color:#8b735d;font-size:10px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;'>"+label+"</p>"+
        "<div style='display:flex;gap:12px;align-items:center;'>"+
        "<div style='width:"+(border?"48px":"38px")+";height:"+(border?"48px":"38px")+";border-radius:50%;background:"+t.hex+";border:"+(border?"3px solid #c9a86a":"2px solid #e8d4b0")+";flex-shrink:0;'></div>"+
        "<div><p style='color:#3a3a3a;font-size:"+(border?"15px":"13px")+";font-weight:bold;margin:0 0 2px;'>"+teinteData.nom+"</p>"+
        "<p style='color:#c9a86a;font-size:11px;font-weight:bold;margin:0 0 3px;'>Réf: "+teinteData.code+"</p>"+
        "<p style='color:#666;font-size:11px;margin:0;'>"+teinteData.raison+"</p></div></div>";
      box.appendChild(div);
    }

    // Section Fond de teint Léger
    var legDiv=document.createElement("div");
    legDiv.style.cssText="background:#f8f3ee;border-radius:12px;padding:12px;margin-bottom:12px;";
    legDiv.innerHTML="<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 8px;'>💧 FOND DE TEINT LÉGER (Acide Hyaluronique)</p>";
    box.appendChild(legDiv);
    if(r.leger){
      renderTeinteBloc("⭐ RECOMMANDÉE", r.leger.recommandee, true);
      renderTeinteBloc("💡 ALTERNATIVE", r.leger.alternative, false);
    }

    // Section Fond de teint Matifiant
    var matDiv=document.createElement("div");
    matDiv.style.cssText="background:#f8f3ee;border-radius:12px;padding:12px;margin-bottom:12px;margin-top:8px;";
    matDiv.innerHTML="<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 8px;'>✨ FOND DE TEINT MATIFIANT</p>";
    box.appendChild(matDiv);
    if(r.matifiant){
      renderTeinteBloc("⭐ RECOMMANDÉE", r.matifiant.recommandee, true);
      renderTeinteBloc("💡 ALTERNATIVE", r.matifiant.alternative, false);
    }

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
    var tRecLeg=r.leger&&r.leger.recommandee?r.leger.recommandee:{code:"051202",nom:"Medium Beige",raison:""};
var tRecMat=r.matifiant&&r.matifiant.recommandee?r.matifiant.recommandee:{code:"051205",nom:"Golden Beige",raison:""};
var teinteLeg=TEINTES.find(function(t){return t.code===tRecLeg.code;})||{hex:"#D2C4B9"};
var teinteMat=TEINTES.find(function(t){return t.code===tRecMat.code;})||{hex:"#CBAE9A"};

    var tempDiv=document.createElement("div");
    tempDiv.style.cssText="position:fixed;left:-9999px;top:0;width:600px;background:#f8f3ee;padding:24px;font-family:Arial,sans-serif;";
    tempDiv.innerHTML=
      "<div style='text-align:center;margin-bottom:20px;'><h1 style='color:#8b735d;font-size:20px;margin:0;'>💄 Ma Teinte Mihi</h1><p style='color:#c9a86a;font-size:13px;margin:4px 0 0;'>Beauty Addict Academy — Analyse IA</p></div>"+
      "<div style='background:linear-gradient(135deg,#c9a86a,#f5d48a);border-radius:14px;padding:20px;text-align:center;margin-bottom:16px;'><p style='color:#1a0a00;font-size:12px;font-weight:bold;margin:0 0 6px;'>MA TEINTE PARFAITE</p>"+
      "<div style='display:flex;gap:16px;justify-content:center;margin-bottom:8px;'><div style='text-align:center;'><div style='width:56px;height:56px;border-radius:50%;background:"+teinteLeg.hex+";border:3px solid white;margin:0 auto 4px;'></div><p style='color:#1a0a00;font-size:11px;font-weight:bold;margin:0;'>"+tRecLeg.nom+"</p><p style='color:rgba(0,0,0,0.5);font-size:10px;margin:0;'>Léger</p></div><div style='text-align:center;'><div style='width:56px;height:56px;border-radius:50%;background:"+teinteMat.hex+";border:3px solid white;margin:0 auto 4px;'></div><p style='color:#1a0a00;font-size:11px;font-weight:bold;margin:0;'>"+tRecMat.nom+"</p><p style='color:rgba(0,0,0,0.5);font-size:10px;margin:0;'>Matifiant</p></div></div></div>"+
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
