function openVictoiresPanel() {
  if (document.getElementById("baa-victoires-panel")) return;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;
  var isAdmin = false;
  var tousLesMembres = [];

  var panel = document.createElement("div");
  panel.id = "baa-victoires-panel";
  panel.style.cssText = "position:fixed;inset:0;background:#f8f3ee;z-index:999999;display:flex;flex-direction:column;font-family:Arial,sans-serif;overflow:hidden;";

  var header = document.createElement("div");
  header.style.cssText = "background:linear-gradient(135deg,#f3e7d3,#e8d4b0);padding:16px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e8d4b0;flex-shrink:0;";
  header.innerHTML = "<h2 style='color:#8b735d;margin:0;font-size:18px;'>🏆 Mur des Victoires</h2><div style='display:flex;gap:8px;align-items:center;'><button id='victoires-refresh' style='background:rgba(255,255,255,0.5);border:none;cursor:pointer;color:#8b735d;font-size:13px;font-weight:bold;padding:6px 12px;border-radius:6px;'>🔄 Rafraichir</button><span id='victoires-resize' title='Reduire' style='cursor:pointer;font-size:18px;color:#8b735d;background:rgba(255,255,255,0.5);width:30px;height:30px;border-radius:6px;display:flex;align-items:center;justify-content:center;'>⊡</span><span id='close-victoires' style='cursor:pointer;font-size:18px;color:#8b735d;background:rgba(255,255,255,0.5);width:30px;height:30px;border-radius:6px;display:flex;align-items:center;justify-content:center;'>✕</span></div>";

  var content = document.createElement("div");
  content.style.cssText = "flex:1;overflow-y:auto;padding:24px;max-width:800px;width:100%;margin:0 auto;box-sizing:border-box;";
  content.innerHTML = "<div id='victoire-form' style='background:white;border-radius:14px;padding:20px;border:1px solid #e8d4b0;margin-bottom:20px;'><p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 12px 0;'>Partager une victoire</p><div style='display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;' id='categorie-btns'><button class='cat-btn' data-cat='Objectif' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;'>&#127942; Objectif</button><button class='cat-btn' data-cat='Vente' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;'>&#128176; Vente</button><button class='cat-btn' data-cat='Recrue' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;'>&#128101; Recrue</button><button class='cat-btn' data-cat='Autre' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;'>&#11088; Autre</button></div><div style='position:relative;'><textarea id='victoire-texte' placeholder='Raconte ta victoire... (@ pour mentionner)' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;height:70px;resize:vertical;margin-bottom:10px;font-family:Arial,sans-serif;'></textarea><div id='mention-list-form' style='display:none;position:absolute;top:80px;left:0;background:white;border:1px solid #e8d4b0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);z-index:99;max-height:150px;overflow-y:auto;min-width:200px;'></div></div><div style='display:flex;gap:10px;align-items:center;'><label style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>&#128247; Photo<input type='file' id='victoire-photo' accept='image/*' style='display:none;' /></label><span id='victoire-photo-name' style='color:#999;font-size:12px;'></span><button id='publier-victoire' style='margin-left:auto;background:#c9a86a;color:white;border:none;padding:10px 20px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:13px;'>Publier !</button></div><div id='victoire-form-msg' style='color:#8b735d;font-size:12px;margin-top:8px;'></div></div><div id='victoires-list'><p style='color:#999;text-align:center;'>Chargement...</p></div>";

  panel.appendChild(header);
  panel.appendChild(content);
  document.body.appendChild(panel);

  var isReduced = false;
  document.getElementById("victoires-resize").onclick = function() {
    if (!isReduced) {
      panel.style.cssText = "position:fixed;bottom:20px;right:80px;width:420px;height:600px;background:#f8f3ee;z-index:999999;display:flex;flex-direction:column;font-family:Arial,sans-serif;border-radius:20px;box-shadow:0 8px 30px rgba(0,0,0,0.2);overflow:hidden;";
      content.style.cssText = "flex:1;overflow-y:auto;padding:16px;box-sizing:border-box;";
      document.getElementById("victoires-resize").innerHTML = "&#9645;";
      isReduced = true;
    } else {
      panel.style.cssText = "position:fixed;inset:0;background:#f8f3ee;z-index:999999;display:flex;flex-direction:column;font-family:Arial,sans-serif;overflow:hidden;";
      content.style.cssText = "flex:1;overflow-y:auto;padding:24px;max-width:800px;width:100%;margin:0 auto;box-sizing:border-box;";
      document.getElementById("victoires-resize").innerHTML = "&#8993;";
      isReduced = false;
    }
  };

  document.getElementById("close-victoires").onclick = function() {
    panel.remove();
    var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click();
  };

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
    document.getElementById("victoire-photo-name").innerText = name ? name : "";
  };

  var victoireTexte = document.getElementById("victoire-texte");
  victoireTexte.addEventListener("input", function() {
    var val = this.value;
    var atIdx = val.lastIndexOf("@");
    var mentionList = document.getElementById("mention-list-form");
    if (atIdx > -1) {
      var search = val.slice(atIdx + 1).toLowerCase();
      var filtered = tousLesMembres.filter(function(m) { return (m.prenom + " " + m.nom).toLowerCase().indexOf(search) > -1; });
      if (filtered.length > 0) {
        mentionList.innerHTML = "";
        filtered.forEach(function(m) {
          var item = document.createElement("div");
          item.style.cssText = "padding:8px 12px;cursor:pointer;font-size:13px;color:#3a3a3a;";
          item.innerText = m.prenom + " " + m.nom;
          item.onmouseenter = function() { item.style.background = "#f8f3ee"; };
          item.onmouseleave = function() { item.style.background = "white"; };
          item.onclick = function() {
            victoireTexte.value = val.slice(0, atIdx) + "@" + m.prenom + " " + m.nom + " ";
            mentionList.style.display = "none";
          };
          mentionList.appendChild(item);
        });
        mentionList.style.display = "block";
      } else {
        mentionList.style.display = "none";
      }
    } else {
      mentionList.style.display = "none";
    }
  });

  var EMOJIS = [
    { key: "feu", html: "&#128293;" },
    { key: "muscle", html: "&#128170;" },
    { key: "fete", html: "&#127881;" },
    { key: "clap", html: "&#128079;" },
    { key: "coeur", html: "&#10084;" }
  ];

  function afficherReactions(reactions, vid) {
    var html = "";
    EMOJIS.forEach(function(e) {
      var arr = reactions[e.key] || [];
      var active = arr.indexOf(uid) > -1;
      var style = active ? "background:#c9a86a;color:white;border:1px solid #c9a86a;" : "background:#f8f3ee;color:#3a3a3a;border:1px solid #e8d4b0;";
      html += "<button class='react-btn' data-key='" + e.key + "' data-vid='" + vid + "' style='" + style + "padding:5px 10px;border-radius:20px;cursor:pointer;font-size:13px;'>" + e.html + (arr.length > 0 ? " " + arr.length : "") + "</button>";
    });
    return html;
  }

  function attacherReactions(vid) {
    var container = document.getElementById("reactions-" + vid);
    if (!container) return;
    container.querySelectorAll(".react-btn").forEach(function(btn) {
      btn.onclick = function() {
        var key = btn.getAttribute("data-key");
        var ref = db.collection("victoires").doc(vid);
        ref.get().then(function(s) {
          var reactions = s.data().reactions || {};
          if (!reactions[key]) reactions[key] = [];
          var idx = reactions[key].indexOf(uid);
          if (idx > -1) { reactions[key].splice(idx, 1); if (reactions[key].length === 0) delete reactions[key]; }
          else { reactions[key].push(uid); }
          ref.update({ reactions: reactions }).then(function() {
            container.innerHTML = afficherReactions(reactions, vid);
            attacherReactions(vid);
          });
        });
      };
    });
  }

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
        var catEmojis = { "Objectif": "&#127942;", "Vente": "&#128176;", "Recrue": "&#128101;", "Autre": "&#11088;" };
        var categorieHTML = v.categorie ? "<span style='background:#f3e7d3;color:#8a6a35;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:bold;margin-left:8px;'>" + (catEmojis[v.categorie] || "") + " " + v.categorie + "</span>" : "";
        var deleteBtn = isAdmin ? "<button id='del-v-" + vid + "' style='background:none;border:none;color:#e74c3c;cursor:pointer;font-size:12px;margin-left:auto;'>&#128465; Supprimer</button>" : "";
        var reactionsHTML = afficherReactions(v.reactions || {}, vid);
        card.innerHTML = "<div style='display:flex;align-items:center;gap:10px;margin-bottom:10px;'>" + avatarHTML + "<div style='flex:1;'><div style='font-weight:bold;color:#3a3a3a;font-size:14px;'>" + (v.prenom || "") + " " + (v.nom || "") + categorieHTML + "</div><div style='color:#bbb;font-size:11px;'>" + date + "</div></div>" + deleteBtn + "</div><div style='color:#3a3a3a;font-size:14px;line-height:1.5;margin-bottom:8px;'>" + v.texte + "</div>" + photoHTML + "<div id='reactions-" + vid + "' style='display:flex;gap:6px;flex-wrap:wrap;margin:10px 0;'>" + reactionsHTML + "</div><div style='border-top:1px solid #f0e6d3;padding-top:10px;margin-top:8px;'><div id='comments-" + vid + "' style='margin-bottom:8px;'></div><div style='position:relative;'><div style='display:flex;gap:8px;'><input id='comment-input-" + vid + "' placeholder='Ecrire un commentaire... (@ pour mentionner)' style='flex:1;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:12px;' /><button id='comment-btn-" + vid + "' style='background:#c9a86a;color:white;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Envoyer</button></div><div id='mention-list-" + vid + "' style='display:none;position:absolute;bottom:40px;left:0;background:white;border:1px solid #e8d4b0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);z-index:99;max-height:150px;overflow-y:auto;min-width:200px;'></div></div></div>";
        list.appendChild(card);
        attacherReactions(vid);
        chargerCommentaires(vid, userData);

        if (isAdmin && document.getElementById("del-v-" + vid)) {
          document.getElementById("del-v-" + vid).onclick = function() {
            if (confirm("Supprimer cette victoire ?")) {
              db.collection("victoires").doc(vid).delete().then(function() { document.getElementById("victoire-card-" + vid).remove(); });
            }
          };
        }

        var commentInput = document.getElementById("comment-input-" + vid);
        commentInput.addEventListener("input", function() {
          var val = this.value;
          var atIdx = val.lastIndexOf("@");
          var mentionList = document.getElementById("mention-list-" + vid);
          if (atIdx > -1) {
            var search = val.slice(atIdx + 1).toLowerCase();
            var filtered = tousLesMembres.filter(function(m) { return (m.prenom + " " + m.nom).toLowerCase().indexOf(search) > -1; });
            if (filtered.length > 0) {
              mentionList.innerHTML = "";
              filtered.forEach(function(m) {
                var item = document.createElement("div");
                item.style.cssText = "padding:8px 12px;cursor:pointer;font-size:13px;color:#3a3a3a;";
                item.innerText = m.prenom + " " + m.nom;
                item.onmouseenter = function() { item.style.background = "#f8f3ee"; };
                item.onmouseleave = function() { item.style.background = "white"; };
                item.onclick = function() {
                  commentInput.value = val.slice(0, atIdx) + "@" + m.prenom + " " + m.nom + " ";
                  mentionList.style.display = "none";
                };
                mentionList.appendChild(item);
              });
              mentionList.style.display = "block";
            } else {
              mentionList.style.display = "none";
            }
          } else {
            mentionList.style.display = "none";
          }
        });

        document.getElementById("comment-btn-" + vid).onclick = function() {
          var input = document.getElementById("comment-input-" + vid);
          var texte = input.value.trim();
          if (!texte) return;
          document.getElementById("mention-list-" + vid).style.display = "none";
          db.collection("victoires").doc(vid).collection("commentaires").add({
            uid: uid, prenom: userData.prenom || "", nom: userData.nom || "", photoURL: userData.photoURL || null,
            texte: texte, createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }).then(function() { input.value = ""; chargerCommentaires(vid, userData); });
        };
      });
    });
  }

  function chargerCommentaires(vid, userData) {
    db.collection("victoires").doc(vid).collection("commentaires").orderBy("createdAt").get().then(function(snapshot) {
      var container = document.getElementById("comments-" + vid);
      if (!container) return;
      container.innerHTML = "";
      snapshot.forEach(function(docSnap) {
        var c = docSnap.data();
        var cid = docSnap.id;
        var avatarC = c.photoURL ? "<img src='" + c.photoURL + "' style='width:28px;height:28px;border-radius:50%;object-fit:cover;' />" : "<div style='width:28px;height:28px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;min-width:28px;'><span style='color:white;font-size:11px;font-weight:bold;'>" + (c.prenom ? c.prenom[0].toUpperCase() : "?") + "</span></div>";
        var deleteCommentBtn = (isAdmin || c.uid === uid) ? "<span id='del-c-" + cid + "-" + vid + "' style='color:#e74c3c;cursor:pointer;font-size:11px;margin-left:6px;'>&#128465;</span>" : "";
        var likes = c.likes || [];
        var likeCount = likes.length;
        var likedByMe = likes.indexOf(uid) > -1;
        var likeStyle = likedByMe ? "color:#c9a86a;font-weight:bold;" : "color:#999;";
        var texteFormate = c.texte.replace(/@(\w[\w\s]*)/g, "<span style='color:#c9a86a;font-weight:bold;'>@$1</span>");
        var div = document.createElement("div");
        div.id = "comment-div-" + cid + "-" + vid;
        div.style.cssText = "margin-bottom:10px;";
        div.innerHTML = "<div style='display:flex;gap:8px;align-items:flex-start;'>" + avatarC + "<div style='background:#f8f3ee;border-radius:10px;padding:8px 12px;flex:1;'><div style='font-weight:bold;color:#3a3a3a;font-size:12px;'>" + (c.prenom || "") + " " + (c.nom || "") + deleteCommentBtn + "</div><div style='color:#3a3a3a;font-size:13px;margin-top:2px;'>" + texteFormate + "</div><div style='display:flex;gap:12px;margin-top:6px;'><span id='like-c-" + cid + "-" + vid + "' style='cursor:pointer;font-size:12px;" + likeStyle + "'>&#10084; " + (likeCount > 0 ? likeCount : "") + " J aime</span><span id='reply-c-" + cid + "-" + vid + "' style='cursor:pointer;font-size:12px;color:#999;'>&#128172; Repondre</span></div></div></div><div id='replies-" + cid + "-" + vid + "' style='margin-left:36px;margin-top:4px;'></div><div id='reply-form-" + cid + "-" + vid + "' style='display:none;margin-left:36px;margin-top:6px;'><div style='display:flex;gap:6px;'><input id='reply-input-" + cid + "-" + vid + "' placeholder='Repondre...' style='flex:1;padding:7px;border:1px solid #e8d4b0;border-radius:8px;font-size:12px;' /><button id='reply-btn-" + cid + "-" + vid + "' style='background:#c9a86a;color:white;border:none;padding:7px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>OK</button></div></div>";
        container.appendChild(div);
        chargerReponses(vid, cid, userData);

        var delCBtn = document.getElementById("del-c-" + cid + "-" + vid);
        if (delCBtn) {
          delCBtn.onclick = function() {
            db.collection("victoires").doc(vid).collection("commentaires").doc(cid).delete().then(function() { chargerCommentaires(vid, userData); });
          };
        }
        document.getElementById("like-c-" + cid + "-" + vid).onclick = function() {
          var ref = db.collection("victoires").doc(vid).collection("commentaires").doc(cid);
          ref.get().then(function(s) {
            var ls = s.data().likes || [];
            var idx = ls.indexOf(uid);
            if (idx > -1) { ls.splice(idx, 1); } else { ls.push(uid); }
            ref.update({ likes: ls }).then(function() { chargerCommentaires(vid, userData); });
          });
        };
        document.getElementById("reply-c-" + cid + "-" + vid).onclick = function() {
          var form = document.getElementById("reply-form-" + cid + "-" + vid);
          form.style.display = form.style.display === "none" ? "block" : "none";
        };
        document.getElementById("reply-btn-" + cid + "-" + vid).onclick = function() {
          var input = document.getElementById("reply-input-" + cid + "-" + vid);
          var texte = input.value.trim();
          if (!texte) return;
          db.collection("victoires").doc(vid).collection("commentaires").doc(cid).collection("reponses").add({
            uid: uid, prenom: userData.prenom || "", nom: userData.nom || "", photoURL: userData.photoURL || null,
            texte: texte, createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }).then(function() { input.value = ""; document.getElementById("reply-form-" + cid + "-" + vid).style.display = "none"; chargerReponses(vid, cid, userData); });
        };
      });
    });
  }

  function chargerReponses(vid, cid, userData) {
    db.collection("victoires").doc(vid).collection("commentaires").doc(cid).collection("reponses").orderBy("createdAt").get().then(function(snapshot) {
      var container = document.getElementById("replies-" + cid + "-" + vid);
      if (!container) return;
      container.innerHTML = "";
      snapshot.forEach(function(docSnap) {
        var r = docSnap.data();
        var rid = docSnap.id;
        var avatarR = r.photoURL ? "<img src='" + r.photoURL + "' style='width:22px;height:22px;border-radius:50%;object-fit:cover;' />" : "<div style='width:22px;height:22px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;min-width:22px;'><span style='color:white;font-size:9px;font-weight:bold;'>" + (r.prenom ? r.prenom[0].toUpperCase() : "?") + "</span></div>";
        var delRBtn = (isAdmin || r.uid === uid) ? "<span id='del-r-" + rid + "-" + cid + "-" + vid + "' style='color:#e74c3c;cursor:pointer;font-size:11px;margin-left:6px;'>&#128465;</span>" : "";
        var texteFormate = r.texte.replace(/@(\w[\w\s]*)/g, "<span style='color:#c9a86a;font-weight:bold;'>@$1</span>");
        var div = document.createElement("div");
        div.style.cssText = "display:flex;gap:6px;align-items:flex-start;margin-bottom:6px;";
        div.innerHTML = avatarR + "<div style='background:#fff;border-radius:8px;padding:6px 10px;flex:1;border:1px solid #f0e6d3;'><div style='font-weight:bold;color:#3a3a3a;font-size:11px;'>" + (r.prenom || "") + " " + (r.nom || "") + delRBtn + "</div><div style='color:#3a3a3a;font-size:12px;'>" + texteFormate + "</div></div>";
        container.appendChild(div);
        var delR = document.getElementById("del-r-" + rid + "-" + cid + "-" + vid);
        if (delR) {
          delR.onclick = function() {
            db.collection("victoires").doc(vid).collection("commentaires").doc(cid).collection("reponses").doc(rid).delete().then(function() { chargerReponses(vid, cid, userData); });
          };
        }
      });
    });
  }

  db.collection("users").where("accountStatus", "==", "active").get().then(function(snapshot) {
    snapshot.forEach(function(docSnap) { tousLesMembres.push(docSnap.data()); });
  });

  db.collection("users").doc(uid).get().then(function(snap) {
    var d = snap.data() || {};
    isAdmin = d.role === "admin";
    document.getElementById("victoires-refresh").onclick = function() { chargerVictoires(d); };
    chargerVictoires(d);
  });

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
    emailjs.init("D_JtKhPDgOQWi_ECO");
    db.collection("users").where("accountStatus", "==", "active").get().then(function(snapshot) {
      snapshot.forEach(function(docSnap) {
        var membre = docSnap.data();
        if (membre.email && docSnap.id !== uid) {
          emailjs.send("service_wr9mlhk", "template_wk2j4mg", {
            prenom: membre.prenom || "", nom: membre.nom || "", email: membre.email,
            titre_message: "Nouvelle victoire sur le Mur !",
            corps_message: (d.prenom || "") + " vient de partager une victoire" + (categorieSelectionnee ? " (" + categorieSelectionnee + ")" : "") + " : " + texte,
            lien_action: "Connecte-toi sur l Academie pour reagir et la feliciter !",
            date: new Date().toLocaleDateString("fr-FR")
          }).catch(function(err) { console.log("Erreur email victoire:", err); });
        }
      });
    });
    document.getElementById("victoire-texte").value = "";
    document.getElementById("victoire-photo").value = "";
    document.getElementById("victoire-photo-name").innerText = "";
    document.querySelectorAll(".cat-btn").forEach(function(b) { b.style.background = "#f3e7d3"; b.style.color = "#8a6a35"; });
    categorieSelectionnee = "";
    msg.innerText = "Victoire publiee !";
    setTimeout(function() { msg.innerText = ""; }, 3000);
    document.getElementById("publier-victoire").disabled = false;
    db.collection("users").doc(uid).get().then(function(s) { chargerVictoires(s.data() || {}); });
  };
}
