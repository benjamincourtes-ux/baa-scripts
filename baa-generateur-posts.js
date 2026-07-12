function initGenerateurPosts() {
  if (window.__baaGenerateurInitialized) return;
  window.__baaGenerateurInitialized = true;

  var db = firebase.firestore();
  var auth = firebase.auth();

  function getApiKey(cb) {
    db.collection("config").doc("assistant").get().then(function(snap) {
      cb(snap.exists ? snap.data().apiKey || "" : "");
    }).catch(function() { cb(""); });
  }

  function ouvrirGenerateur() {
    if (document.getElementById("baa-generateur-panel")) return;

    var panel = document.createElement("div");
    panel.id = "baa-generateur-panel";
    panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;justify-content:center;align-items:flex-start;overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:Arial,sans-serif;";

    var box = document.createElement("div");
    box.style.cssText = "background:#f8f3ee;width:100%;max-width:560px;border-radius:20px;padding:24px;margin:20px 16px;overflow-y:auto;max-height:90vh;";

    // Header
    var hdr = document.createElement("div"); hdr.style.cssText="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;";
    hdr.innerHTML = "<div><p style='color:#999;font-size:11px;font-weight:bold;margin:0 0 2px;letter-spacing:1px;'>✨ OUTIL IA</p><h3 style='color:#8b735d;font-size:17px;margin:0;'>Générateur de posts</h3></div>";
    var closeBtn = document.createElement("button"); closeBtn.textContent="✕"; closeBtn.style.cssText="background:none;border:none;font-size:22px;color:#8b735d;cursor:pointer;touch-action:manipulation;";
    closeBtn.onclick = function() { panel.remove(); };
    hdr.appendChild(closeBtn); box.appendChild(hdr);

    // Sélection réseau
    var reseauLabel = document.createElement("p"); reseauLabel.style.cssText="color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 6px;"; reseauLabel.textContent="📱 Réseau social"; box.appendChild(reseauLabel);
    var reseauBtns = document.createElement("div"); reseauBtns.style.cssText="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;";
    var reseaux = ["Facebook","Instagram","WhatsApp","Story"];
    var reseauSel = "Facebook";
    reseaux.forEach(function(r) {
      var btn = document.createElement("button"); btn.textContent=r; btn.dataset.r=r;
      btn.style.cssText="padding:8px 14px;border-radius:20px;border:1px solid #e8d4b0;background:"+(r==="Facebook"?"#c9a86a":"white")+";color:"+(r==="Facebook"?"#1a0a00":"#8b735d")+";font-size:12px;font-weight:bold;cursor:pointer;touch-action:manipulation;";
      btn.onclick = function() {
        reseauSel = r;
        reseauBtns.querySelectorAll("button").forEach(function(b){b.style.background="white";b.style.color="#8b735d";});
        btn.style.background="#c9a86a"; btn.style.color="#1a0a00";
      };
      reseauBtns.appendChild(btn);
    });
    box.appendChild(reseauBtns);

    // Sélection objectif
    var objLabel = document.createElement("p"); objLabel.style.cssText="color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 6px;"; objLabel.textContent="🎯 Objectif du post"; box.appendChild(objLabel);
    var objBtns = document.createElement("div"); objBtns.style.cssText="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;";
    var objectifs = ["Vendre un produit","Attirer des clientes","Recruter","Partager un conseil","Avant/Après"];
    var objSel = "Vendre un produit";
    objectifs.forEach(function(o) {
      var btn = document.createElement("button"); btn.textContent=o;
      btn.style.cssText="padding:7px 12px;border-radius:20px;border:1px solid #e8d4b0;background:"+(o===objSel?"#c9a86a":"white")+";color:"+(o===objSel?"#1a0a00":"#8b735d")+";font-size:11px;font-weight:bold;cursor:pointer;touch-action:manipulation;";
      btn.onclick = function() {
        objSel = o;
        objBtns.querySelectorAll("button").forEach(function(b){b.style.background="white";b.style.color="#8b735d";});
        btn.style.background="#c9a86a"; btn.style.color="#1a0a00";
        if (o === "Vendre un produit") { produitSection.style.display="block"; } else { produitSection.style.display="none"; }
      };
      objBtns.appendChild(btn);
    });
    box.appendChild(objBtns);

    // Produit (optionnel)
    var produitSection = document.createElement("div");
    var produitLabel = document.createElement("p"); produitLabel.style.cssText="color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 6px;"; produitLabel.textContent="💄 Produit à mettre en avant"; produitSection.appendChild(produitLabel);
    var produitInp = document.createElement("input"); produitInp.placeholder="Ex: Sérum anti-âge, Rouge à lèvres Nude..."; produitInp.style.cssText="width:100%;padding:11px;border:1px solid #e8d4b0;border-radius:10px;font-size:13px;box-sizing:border-box;margin-bottom:14px;";
    produitInp.addEventListener("touchstart",function(e){e.stopPropagation();},{passive:true});
    produitSection.appendChild(produitInp);
    box.appendChild(produitSection);

    // Infos perso
    var infoLabel = document.createElement("p"); infoLabel.style.cssText="color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 6px;"; infoLabel.textContent="✍️ Ajouter une touche personnelle (optionnel)"; box.appendChild(infoLabel);
    var infoInp = document.createElement("textarea"); infoInp.placeholder="Ex: J'utilise ce produit depuis 3 mois et mes rides ont diminué..."; infoInp.rows=3; infoInp.style.cssText="width:100%;padding:11px;border:1px solid #e8d4b0;border-radius:10px;font-size:13px;box-sizing:border-box;margin-bottom:14px;resize:none;";
    infoInp.addEventListener("touchstart",function(e){e.stopPropagation();},{passive:true});
    box.appendChild(infoInp);

    // Bouton générer
    var genBtn = document.createElement("button"); genBtn.textContent="✨ Générer 3 posts"; genBtn.style.cssText="width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:14px;border-radius:12px;font-weight:bold;font-size:15px;cursor:pointer;touch-action:manipulation;margin-bottom:16px;";

    var resultsDiv = document.createElement("div"); box.appendChild(genBtn); box.appendChild(resultsDiv);

    var doGen = function() {
      genBtn.disabled=true; genBtn.textContent="⏳ Génération en cours...";
      resultsDiv.innerHTML="<p style='color:#999;font-size:13px;text-align:center;padding:20px;'>L'IA rédige vos posts...</p>";

      getApiKey(function(apiKey) {
        if (!apiKey) { resultsDiv.innerHTML="<p style='color:#e74c3c;font-size:13px;text-align:center;'>Clé API non configurée. Contacte l'administratrice.</p>"; genBtn.disabled=false; genBtn.textContent="✨ Générer 3 posts"; return; }

        var prompt = "Tu es une experte en marketing beauté et réseaux sociaux pour une VDI Mihi (cosmétiques haut de gamme).\n\n";
        prompt += "Génère 3 posts différents pour "+reseauSel+" avec comme objectif : "+objSel+".\n";
        if (objSel === "Vendre un produit" && produitInp.value.trim()) prompt += "Produit : "+produitInp.value.trim()+".\n";
        if (infoInp.value.trim()) prompt += "Anecdote personnelle à intégrer : "+infoInp.value.trim()+".\n";
        prompt += "\nRègles :\n- Ton authentique et chaleureux, pas commercial\n- Emoji pertinents\n";
        if (reseauSel === "Story") prompt += "- Très court, percutant, max 3 lignes\n";
        else if (reseauSel === "Instagram") prompt += "- Hashtags à la fin\n";
        else if (reseauSel === "WhatsApp") prompt += "- Style message personnel, pas publicitaire\n";
        prompt += "\nFormate chaque post avec:\n---POST 1---\n[contenu]\n---POST 2---\n[contenu]\n---POST 3---\n[contenu]";

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
            max_tokens: 1500,
            messages: [{ role: "user", content: prompt }]
          })
        }).then(function(r){return r.json();}).then(function(data) {
          var texte = data.content && data.content[0] ? data.content[0].text : "";
          if (!texte) { resultsDiv.innerHTML="<p style='color:#e74c3c;font-size:13px;text-align:center;'>Erreur de génération. Réessaie.</p>"; genBtn.disabled=false; genBtn.textContent="✨ Générer 3 posts"; return; }

          // Parser les 3 posts
          var posts = texte.split(/---POST \d+---/).filter(function(p){return p.trim();});
          resultsDiv.innerHTML="";

          posts.forEach(function(post, i) {
            var card = document.createElement("div"); card.style.cssText="background:white;border-radius:12px;padding:16px;margin-bottom:12px;border:1px solid #e8d4b0;";
            var num = document.createElement("p"); num.style.cssText="color:#c9a86a;font-size:11px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;"; num.textContent="✨ VERSION "+(i+1);
            var content = document.createElement("p"); content.style.cssText="color:#3a3a3a;font-size:13px;line-height:1.7;margin:0 0 10px;white-space:pre-wrap;"; content.textContent=post.trim();
            var copyBtn = document.createElement("button"); copyBtn.textContent="📋 Copier"; copyBtn.style.cssText="background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;touch-action:manipulation;";
            var doCopy = (function(txt){ return function(){
              navigator.clipboard && navigator.clipboard.writeText(txt).then(function(){ copyBtn.textContent="✅ Copié !"; setTimeout(function(){copyBtn.textContent="📋 Copier";},2000); });
            }; })(post.trim());
            copyBtn.onclick = doCopy;
            copyBtn.addEventListener("touchend",function(e){e.preventDefault();doCopy();},{passive:false});
            card.appendChild(num); card.appendChild(content); card.appendChild(copyBtn);
            resultsDiv.appendChild(card);
          });

          genBtn.disabled=false; genBtn.textContent="🔄 Régénérer";
        }).catch(function() {
          resultsDiv.innerHTML="<p style='color:#e74c3c;font-size:13px;text-align:center;'>Erreur de connexion. Réessaie.</p>";
          genBtn.disabled=false; genBtn.textContent="✨ Générer 3 posts";
        });
      });
    };

    genBtn.onclick = doGen;
    genBtn.addEventListener("touchend",function(e){e.preventDefault();doGen();},{passive:false});

    var iosSpace = document.createElement("div"); iosSpace.style.height="60px"; box.appendChild(iosSpace);
    panel.appendChild(box); document.body.appendChild(panel);
  }

  // Exposer la fonction pour le menu hamburger
  window.ouvrirGenerateurPosts = ouvrirGenerateur;
}

if (document.readyState === "complete") { setTimeout(initGenerateurPosts, 2500); }
else { window.addEventListener("load", function() { setTimeout(initGenerateurPosts, 3000); }); }
