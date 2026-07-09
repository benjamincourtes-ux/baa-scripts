function initChallenge() {
  if (window.__baaChallengeInitialized) return;
  window.__baaChallengeInitialized = true;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;
  if (!uid) return;
  var ADMIN_UID = "HW5yBMrCSfZvRJpJNBYJbY1hzen2";

  // Vérifier si un challenge actif existe et afficher le bouton
  function verifierChallengeActif() {
    db.collection("challenges").where("actif","==",true).get().then(function(snap) {
      var existingBtn = document.getElementById("menu-challenge-btn");
      if (snap.empty) { if(existingBtn) existingBtn.remove(); return; }
      snap.forEach(function(docSnap) {
        var ch = docSnap.data();
        if (!existingBtn) {
          var menuBtn = document.getElementById("baa-menu-btn");
          if (!menuBtn) return;
          var btn = document.createElement("div");
          btn.id = "menu-challenge-btn";
          btn.style.cssText = "position:fixed;bottom:120px;right:20px;z-index:99999;background:linear-gradient(135deg,#8b735d,#c9a86a);color:white;border-radius:24px;padding:10px 18px;cursor:pointer;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;box-shadow:0 4px 15px rgba(139,115,93,0.5);display:flex;align-items:center;gap:8px;touch-action:manipulation;";
          btn.innerHTML = "🏆 Challenge Équipe";
          btn.onclick = function() { ouvrirChallenge(docSnap.id, ch); };
          document.body.appendChild(btn);
        }
      });
    }).catch(function(){});
  }

  function ouvrirChallenge(cid, ch) {
    if (document.getElementById("baa-challenge-panel")) return;
    var panel = document.createElement("div");
    panel.id = "baa-challenge-panel";
    panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;justify-content:center;align-items:flex-start;overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:Arial,sans-serif;";

    var box = document.createElement("div");
    box.style.cssText = "background:#f8f3ee;width:100%;max-width:560px;border-radius:20px;padding:24px;margin:20px 16px;";

    // Header
    var hdr = document.createElement("div"); hdr.style.cssText="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;";
    hdr.innerHTML = "<div><p style='color:#999;font-size:11px;font-weight:bold;margin:0 0 2px;letter-spacing:1px;'>🏆 CHALLENGE ÉQUIPE</p><h3 style='color:#8b735d;font-size:17px;margin:0;'>"+ch.titre+"</h3></div>";
    var closeBtn=document.createElement("button");closeBtn.textContent="✕";closeBtn.style.cssText="background:none;border:none;font-size:22px;color:#8b735d;cursor:pointer;touch-action:manipulation;";closeBtn.onclick=function(){panel.remove();};
    hdr.appendChild(closeBtn); box.appendChild(hdr);

    // Description
    if (ch.description) {
      var desc=document.createElement("p");desc.style.cssText="color:#555;font-size:14px;line-height:1.7;margin:0 0 16px;background:white;padding:14px;border-radius:12px;border:1px solid #e8d4b0;";desc.textContent=ch.description;box.appendChild(desc);
    }

    // Média (photo ou vidéo)
    if (ch.mediaUrl) {
      if (ch.mediaType === "video") {
        var vid=document.createElement("video");vid.src=ch.mediaUrl;vid.controls=true;vid.style.cssText="width:100%;border-radius:12px;margin-bottom:16px;max-height:300px;";box.appendChild(vid);
      } else {
        var img=document.createElement("img");img.src=ch.mediaUrl;img.style.cssText="width:100%;border-radius:12px;margin-bottom:16px;object-fit:cover;max-height:300px;";box.appendChild(img);
      }
    }

    // Durée restante
    if (ch.dateFin) {
      var fin = ch.dateFin.toDate ? ch.dateFin.toDate() : new Date(ch.dateFin);
      var reste = Math.max(0, Math.round((fin - new Date()) / (1000*60*60*24)));
      var dureeDiv=document.createElement("div");dureeDiv.style.cssText="background:linear-gradient(135deg,#c9a86a,#f5d48a);border-radius:12px;padding:12px;text-align:center;margin-bottom:16px;";
      dureeDiv.innerHTML="<p style='color:#1a0a00;font-size:13px;font-weight:bold;margin:0;'>⏳ "+reste+" jour(s) restant(s)</p><p style='color:rgba(0,0,0,0.6);font-size:11px;margin:4px 0 0;'>Fin le "+fin.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})+"</p>";
      box.appendChild(dureeDiv);
    }

    // Gagnantes annoncées
    if (ch.gagnantes && ch.gagnantes.length > 0) {
      var gagDiv=document.createElement("div");gagDiv.style.cssText="background:#e6f7ec;border:2px solid #27AE60;border-radius:12px;padding:14px;margin-bottom:16px;";
      gagDiv.innerHTML="<p style='color:#27AE60;font-size:14px;font-weight:bold;margin:0 0 8px;'>🏆 Gagnante(s) !</p>";
      ch.gagnantes.forEach(function(g){var p=document.createElement("p");p.style.cssText="color:#3a3a3a;font-size:13px;margin:0 0 4px;";p.textContent="🥇 "+g;gagDiv.appendChild(p);});
      box.appendChild(gagDiv);
    }

    // Section dépôt de preuves
    var prTitle=document.createElement("p");prTitle.style.cssText="color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 10px;letter-spacing:1px;";prTitle.textContent="📸 DÉPOSER MES PREUVES";box.appendChild(prTitle);

    // Vérifier si déjà participé
    db.collection("challenges").doc(cid).collection("preuves").doc(uid).get().then(function(snap) {
      if (snap.exists && snap.data().medias && snap.data().medias.length > 0) {
        var dejaDiv=document.createElement("div");dejaDiv.style.cssText="background:#e6f7ec;border-radius:10px;padding:12px;margin-bottom:12px;";
        dejaDiv.innerHTML="<p style='color:#27AE60;font-size:13px;font-weight:bold;margin:0 0 6px;'>✅ Tu as déjà déposé "+snap.data().medias.length+" preuve(s) !</p>";
        snap.data().medias.forEach(function(m){
          if(m.type==="image"){var im=document.createElement("img");im.src=m.url;im.style.cssText="width:60px;height:60px;object-fit:cover;border-radius:8px;margin-right:6px;";dejaDiv.appendChild(im);}
        });
        box.appendChild(dejaDiv);
      }
    });

    // Upload preuves
    var fileInp=document.createElement("input");fileInp.type="file";fileInp.accept="image/*,video/*";fileInp.multiple=true;fileInp.style.display="none";box.appendChild(fileInp);
    var uploadBtn=document.createElement("button");uploadBtn.textContent="📎 Sélectionner photos/vidéos";uploadBtn.style.cssText="width:100%;background:white;border:2px dashed #c9a86a;border-radius:12px;padding:16px;cursor:pointer;font-size:13px;color:#8b735d;font-weight:bold;margin-bottom:10px;touch-action:manipulation;";
    uploadBtn.onclick=function(){fileInp.click();};box.appendChild(uploadBtn);

    var previewDiv=document.createElement("div");previewDiv.style.cssText="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;";box.appendChild(previewDiv);
    var statusDiv=document.createElement("p");statusDiv.style.cssText="color:#999;font-size:12px;text-align:center;margin:0 0 10px;";box.appendChild(statusDiv);

    var selectedFiles = [];
    fileInp.onchange = function() {
      selectedFiles = Array.from(this.files);
      previewDiv.innerHTML="";
      statusDiv.textContent=selectedFiles.length+" fichier(s) sélectionné(s)";
      selectedFiles.forEach(function(f){
        if(f.type.startsWith("image/")){
          var reader=new FileReader();reader.onload=function(e){var img=document.createElement("img");img.src=e.target.result;img.style.cssText="width:60px;height:60px;object-fit:cover;border-radius:8px;";previewDiv.appendChild(img);};reader.readAsDataURL(f);
        } else {
          var vDiv=document.createElement("div");vDiv.style.cssText="width:60px;height:60px;background:#333;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;";vDiv.textContent="🎬";previewDiv.appendChild(vDiv);
        }
      });
      if(selectedFiles.length>0) submitBtn.style.display="block";
    };

    var submitBtn=document.createElement("button");submitBtn.textContent="🚀 Envoyer mes preuves";submitBtn.style.cssText="width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:14px;border-radius:12px;font-weight:bold;font-size:15px;cursor:pointer;touch-action:manipulation;display:none;";
    submitBtn.onclick=async function(){
      if(selectedFiles.length===0){statusDiv.textContent="Sélectionne au moins un fichier !";return;}
      submitBtn.disabled=true;submitBtn.textContent="⏳ Envoi en cours...";
      var medias=[];
      for(var i=0;i<selectedFiles.length;i++){
        var f=selectedFiles[i];
        statusDiv.textContent="Upload "+(i+1)+"/"+selectedFiles.length+"...";
        try{
          var fd=new FormData();fd.append("file",f);fd.append("upload_preset","baa_avatars");fd.append("folder","challenges");
          var r=await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/"+( f.type.startsWith("video/")?"video":"image")+"/upload",{method:"POST",body:fd});
          var data=await r.json();
          if(data.secure_url) medias.push({url:data.secure_url,type:f.type.startsWith("video/")?"video":"image"});
        }catch(e){}
      }
      if(medias.length>0){
        var user_data=await db.collection("users").doc(uid).get();
        var prenom=user_data.exists?user_data.data().prenom:"Participante";
        await db.collection("challenges").doc(cid).collection("preuves").doc(uid).set({uid:uid,prenom:prenom,medias:medias,date:new Date().toISOString()},{merge:true});
        statusDiv.textContent="";submitBtn.textContent="✅ Preuves envoyées !";submitBtn.style.background="#27AE60";submitBtn.style.color="white";
      } else { statusDiv.textContent="Erreur lors de l\'upload.";submitBtn.disabled=false;submitBtn.textContent="🚀 Envoyer mes preuves"; }
    };
    box.appendChild(submitBtn);

    // Preuves de l'équipe
    var equipeTitle=document.createElement("p");equipeTitle.style.cssText="color:#8b735d;font-size:13px;font-weight:bold;margin:16px 0 10px;letter-spacing:1px;";equipeTitle.textContent="👥 PREUVES DE L'ÉQUIPE";box.appendChild(equipeTitle);
    var equipeDiv=document.createElement("div");equipeDiv.innerHTML="<p style='color:#999;font-size:13px;'>Chargement...</p>";box.appendChild(equipeDiv);

    db.collection("challenges").doc(cid).collection("preuves").orderBy("date","desc").get().then(function(snap){
      equipeDiv.innerHTML="";
      if(snap.empty){equipeDiv.innerHTML="<p style='color:#999;font-size:13px;text-align:center;padding:10px;'>Aucune preuve pour l\'instant — sois la première !</p>";return;}
      snap.forEach(function(doc){
        var pr=doc.data();
        var card=document.createElement("div");card.style.cssText="background:white;border-radius:12px;padding:12px;margin-bottom:10px;border:1px solid #e8d4b0;";
        card.innerHTML="<p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 8px;'>✨ "+pr.prenom+"</p>";
        var mediaGrid=document.createElement("div");mediaGrid.style.cssText="display:flex;flex-wrap:wrap;gap:6px;";
        (pr.medias||[]).forEach(function(m){
          if(m.type==="image"){var img=document.createElement("img");img.src=m.url;img.style.cssText="width:80px;height:80px;object-fit:cover;border-radius:8px;cursor:pointer;";img.onclick=function(){window.open(m.url,"_blank");};mediaGrid.appendChild(img);}
          else{var vEl=document.createElement("video");vEl.src=m.url;vEl.controls=true;vEl.style.cssText="width:160px;height:100px;border-radius:8px;object-fit:cover;";mediaGrid.appendChild(vEl);}
        });
        card.appendChild(mediaGrid);equipeDiv.appendChild(card);
      });
    }).catch(function(){equipeDiv.innerHTML="<p style='color:#999;font-size:12px;'>Créez l\'index Firebase si demandé.</p>";});

    panel.appendChild(box);document.body.appendChild(panel);
  }

  // Initialiser
  verifierChallengeActif();

  // Exposer pour admin
  window.ouvrirChallengeAdmin = function(cid, ch) { ouvrirChallenge(cid, ch); };
}

if (document.readyState === "complete") { setTimeout(initChallenge, 2000); }
else { window.addEventListener("load", function() { setTimeout(initChallenge, 2500); }); }
