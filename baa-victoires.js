function openVictoiresPanel() {
  if (document.getElementById("baa-victoires-panel")) return;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;
  var isAdmin = false;

  var panel = document.createElement("div");
  panel.id = "baa-victoires-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:40px;padding-bottom:40px;overflow-y:auto;";
  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:90%;max-width:650px;border-radius:20px;padding:30px;font-family:Arial,sans-serif;max-height:90vh;overflow-y:auto;";
  box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'><h2 style='color:#8b735d;margin:0;'>🏆 Mur des Victoires</h2><span id='close-victoires' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div id='victoire-form' style='background:white;border-radius:14px;padding:20px;border:1px solid #e8d4b0;margin-bottom:20px;'><p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 12px 0;'>Partager une victoire</p><div style='display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;' id='categorie-btns'><button class='cat-btn' data-cat='🏆 Objectif' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;'>🏆 Objectif</button><button class='cat-btn' data-cat='💰 Vente' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;'>💰 Vente</button><button class='cat-btn' data-cat='👥 Recrue' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;'>👥 Recrue</button><button class='cat-btn' data-cat='⭐ Autre' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;'>⭐ Autre</button></div><textarea id='victoire-texte' placeholder='Raconte ta victoire...' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;height:70px;resize:vertical;margin-bottom:10px;font-family:Arial,sans-serif;'></textarea><div style='display:flex;gap:10px;align-items:center;'><label style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>📷 Photo<input type='file' id='victoire-photo' accept='image/*' style='display:none;' /></label><span id='victoire-photo-name' style='color:#999;font-size:12px;'></span><button id='publier-victoire' style='margin-left:auto;background:#c9a86a;color:white;border:none;padding:10px 20px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:13px;'>Publier 🎉</button></div><div id='victoire-form-msg' style='color:#8b735d;font-size:12px;margin-top:8px;'></div></div><div id='victoires-list'><p style='color:#999;text-align:center;'>Chargement...</p></div>";
  panel.appendChild(box);
  document.body.appendChild(panel);

  document.getElementById("close-victoires").onclick = function() { panel.remove(); var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click(); };

  var categorieSelectionnee = "";
  document.querySelectorAll(".cat-btn").forEach(function(btn) {
    btn.onclick = function() {
      document.querySelectorAll(".cat-btn").forEach(function(b) { b.style.background = "#f3e7d3"; b.style.color = "#8a6a35"; });
      btn.style.background = "#c9a86a"; btn.style.color = "white";
      categorieSelectionnee = btn.getAttribute("data-cat");
    };
  });

  document.getElementById("victoire-photo").onchange = function() {
    var name = this.files[0] ? this.files[0].name : "";
    document.getElementById("victoire-photo-name").innerText = name ? "📎 " + name : "";
  };

  db.collection("users").doc(uid).get().then(function(snap) {
    var d = snap.data() || {};
    isAdmin = d.role === "admin";
    chargerVictoires(d);
  });

  function chargerVictoires(userData) {
    var list = document.getElementById("victoires-list");
    list.innerHTML = "<p style='color:#999;text-align:center;'>Chargement...</p>";
    db.collection("victoires").orderBy("createdAt", "desc").limit(30).get().then(function(snapshot) {
      if (snapshot.empty) { list.innerHTML = "<p style='color:#999;text-align:center;'>Aucune victoire partagee pour l instant. Sois la premiere !</p>"; return; }
      list.innerHTML = "";
      snapshot.forEach(function(docSnap) {
        var v = docSnap.data();
        var vid = docSnap.id;
        var date = v.createdAt ? new Date(v.createdAt.seconds * 1000).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
        var card = document.createElement("div");
        card.id = "victoire-card-" + vid;
        card.style.cssText = "background:white;border-radius:14px;padding:18px;margin-bottom:14px;border:1px solid #e8d4b0;";
        var avatarHTML = v.photoURL ? "<img src='" + v.photoURL + "' style='width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid #e8d4b0;' />" : "<div style='width:38px;height:38px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;min-width:38px;'><span style='color:white;font-size:14px;font-weight:bold;'>" + (v.prenom ? v.prenom[0].toUpperCase() : "?") + "</span></div>";
        var photoHTML = v.imageURL ? "<img src='" + v.imageURL + "' style='width:100%;border-radius:10px;margin:10px 0;max-height:300px;object-fit:cover;' />" : "";
        var categorieHTML = v.categorie ? "<span style='background:#f3e7d3;color:#8a6a35;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:bold;margin-left:8px;'>" + v.categorie + "</span>" : "";
        var deleteBtn = isAdmin ? "<button id='del-v-" + vid + "' style='background:none;border:none;color:#e74c3c;cursor:pointer;font-size:12px;margin-left:auto;'>🗑️ Supprimer</button>" : "";
        var reactionsHTML = afficherReactions(v.reactions || {}, vid);
        card.innerHTML = "<div style='display:flex;align-items:center;gap:10px;margin-bottom:10px;'>" + avatarHTML + "<div style='flex:1;'><div style='font-weight:bold;color:#3a3a3a;font-size:14px;'>" + (v.prenom || "") + " " + (v.nom || "") + categorieHTML + "</div><div style='color:#bbb;font-size:11px;'>" + date + "</div></div>" + deleteBtn + "</div><div style='color:#3a3a3a;font-size:14px;line-height:1.5;margin-bottom:8px;'>" + v.texte + "</div>" + photoHTML + "<div id='reactions-" + vid + "' style='display:flex;gap:6px;flex-wrap:wrap;margin:10px 0;'>" + reactionsHTML + "</div><div style='border-top:1px solid #f0e6d3;padding-top:10px;margin-top:8px;'><div id='comments-" + vid + "' style='margin-bottom:8px;'></div><div style='display:flex;gap:8px;'><input id='comment-input-" + vid + "' placeholder='Ecrire un commentaire...' style='flex:1;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:12px;' /><button id='comment-btn-" + vid + "' style='background:#c9a86a;color:white;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Envoyer</button></div></div>";
        list.appendChild(card);
        chargerCommentaires(vid);
        if (isAdmin && document.getElementById("del-v-" + vid)) {
          document.getElementById("del-v-" + vid).onclick = function() {
            if (confirm("Supprimer cette victoire ?")) {
              db.collection("victoires").doc(vid).delete().then(function() { document.getElementById("victoire-card-" + vid).remove(); });
            }
          };
        }
        var emojis = ["🔥", "💪", "🎉", "👏", "⭐"];
        emojis.forEach(function(emoji) {
          var btn = document.getElementById("react-" + emoji.charCodeAt(0) + "-" + vid);
          if (btn) {
            btn.onclick = function() {
              var reactionsRef = db.collection("victoires").doc(vid);
              reactionsRef.get().then(function(s) {
                var reactions = s.data().reactions || {};
                if (!reactions[emoji]) reactions[emoji] = [];
                var idx = reactions[emoji].indexOf(uid);
                if (idx > -1) { reactions[emoji].splice(idx, 1); if (reactions[emoji].length === 0) delete reactions[emoji]; }
                else { reactions[emoji].push(uid); }
                reactionsRef.update({ reactions: reactions }).then(function() {
                  document.getElementById("reactions-" + vid).innerHTML = afficherReactions(reactions, vid);
                  emojis.forEach(function(e) {
                    var b = document.getElementById("react-" + e.charCodeAt(0) + "-" + vid);
                    if (b) b.onclick = arguments.callee;
                  });
                });
              });
            };
          }
        });
        document.getElementById("comment-btn-" + vid).onclick = function() {
          var input = document.getElementById("comment-input-" + vid);
          var texte = input.value.trim();
          if (!texte) return;
          db.collection("victoires").doc(vid).collection("commentaires").add({
            uid: uid, prenom: userData.prenom || "", nom: userData.nom || "", photoURL: userData.photoURL || null,
            texte: texte, createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }).then(function() { input.value = ""; chargerCommentaires(vid); });
        };
      });
    });
  }

  function afficherReactions(reactions, vid) {
    var emojis = ["🔥", "💪", "🎉", "👏", "⭐"];
    var html = "";
    emojis.forEach(function(emoji) {
      var count = reactions[emoji] ? reactions[emoji].length : 0;
      var active = reactions[emoji] && reactions[emoji].indexOf(uid) > -1;
      var style = active ? "background:#c9a86a;color:white;border:1px solid #c9a86a;" : "background:#f8f3ee;color:#3a3a3a;border:1px solid #e8d4b0;";
      html += "<button id='react-" + emoji.charCodeAt(0) + "-" + vid + "' style='" + style + "padding:5px 10px;border-radius:20px;cursor:pointer;font-size:13px;'>" + emoji + (count > 0 ? " " + count : "") + "</button>";
    });
    return html;
  }

  function chargerCommentaires(vid) {
    db.collection("victoires").doc(vid).collection("commentaires").orderBy("createdAt").get().then(function(snapshot) {
      var container = document.getElementById("comments-" + vid);
      if (!container) return;
      container.innerHTML = "";
      snapshot.forEach(function(docSnap) {
        var c = docSnap.data();
        var cid = docSnap.id;
        var avatarC = c.photoURL ? "<img src='" + c.photoURL + "' style='width:28px;height:28px;border-radius:50%;object-fit:cover;' />" : "<div style='width:28px;height:28px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;min-width:28px;'><span style='color:white;font-size:11px;font-weight:bold;'>" + (c.prenom ? c.prenom[0].toUpperCase() : "?") + "</span></div>";
        var deleteCommentBtn = (isAdmin || c.uid === uid) ? "<span id='del-c-" + cid + "-" + vid + "' style='color:#e74c3c;cursor:pointer;font-size:11px;margin-left:6px;'>🗑️</span>" : "";
        var div = document.createElement("div");
        div.style.cssText = "display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;";
        div.innerHTML = avatarC + "<div style='background:#f8f3ee;border-radius:10px;padding:8px 12px;flex:1;'><div style='font-weight:bold;color:#3a3a3a;font-size:12px;'>" + (c.prenom || "") + " " + (c.nom || "") + deleteCommentBtn + "</div><div style='color:#3a3a3a;font-size:13px;'>" + c.texte + "</div></div>";
        container.appendChild(div);
        var delCBtn = document.getElementById("del-c-" + cid + "-" + vid);
        if (delCBtn) {
          delCBtn.onclick = function() {
            db.collection("victoires").doc(vid).collection("commentaires").doc(cid).delete().then(function() { chargerCommentaires(vid); });
          };
        }
      });
    });
  }

  document.getElementById("publier-victoire").onclick = async function() {
    var texte = document.getElementById("victoire-texte").value.trim();
    var photoFile = document.getElementById("victoire-photo").files[0];
    var msg = document.getElementById("victoire-form-msg");
    if (!texte) { msg.innerText = "Merci d ecrire ta victoire avant de publier."; return; }
    msg.innerText = "Publication en cours...";
    document.getElementById("publier-victoire").disabled = true;
    var imageURL = null;
    if (photoFile) {
      try {
        var formData = new FormData(); formData.append("file", photoFile); formData.append("upload_preset", "baa_avatars"); formData.append("folder", "victoires");
        var res = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload", { method: "POST", body: formData });
        var data = await res.json(); imageURL = data.secure_url;
      } catch (e) { msg.innerText = "Erreur upload photo."; document.getElementById("publier-victoire").disabled = false; return; }
    }
    var snap = await db.collection("users").doc(uid).get();
    var d = snap.data() || {};
    await db.collection("victoires").add({
      uid: uid, prenom: d.prenom || "", nom: d.nom || "", photoURL: d.photoURL || null,
      texte: texte, imageURL: imageURL, categorie: categorieSelectionnee,
      reactions: {}, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById("victoire-texte").value = "";
    document.getElementById("victoire-photo").value = "";
    document.getElementById("victoire-photo-name").innerText = "";
    document.querySelectorAll(".cat-btn").forEach(function(b) { b.style.background = "#f3e7d3"; b.style.color = "#8a6a35"; });
    categorieSelectionnee = "";
    msg.innerText = "Victoire publiee ! 🎉";
    setTimeout(function() { msg.innerText = ""; }, 3000);
    document.getElementById("publier-victoire").disabled = false;
    chargerVictoires(d);
  };
}
