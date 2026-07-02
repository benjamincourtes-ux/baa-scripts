function openVictoiresPanel() {
  if (document.getElementById("baa-victoires-panel")) return;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;
  var isAdmin = false;
  var tousLesMembres = [];
  var categorieSelectionnee = "";
  var messageListener = null;
  var userData = {};
  var ongletActif = 'victoires';

  var panel = document.createElement("div");
  panel.id = "baa-victoires-panel";
  panel.style.cssText = "position:fixed;inset:0;background:#f8f3ee;z-index:999999;display:flex;flex-direction:column;font-family:Arial,sans-serif;overflow:hidden;";

  var header = document.createElement("div");
  header.style.cssText = "background:linear-gradient(135deg,#f3e7d3,#e8d4b0);padding:14px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e8d4b0;flex-shrink:0;flex-wrap:wrap;gap:8px;";
  header.innerHTML = "<h2 style='color:#8b735d;margin:0;font-size:16px;'>&#127942; Mur des Victoires</h2><div style='display:flex;gap:6px;'><button id='tab-v-btn' style='background:#c9a86a;color:white;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Victoires</button><button id='tab-m-btn' style='background:rgba(255,255,255,0.5);color:#8b735d;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>&#128172; Messages</button><button id='tab-a-btn' style='display:none;background:rgba(255,255,255,0.5);color:#8b735d;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>&#9881; Admin</button></div><div style='display:flex;gap:6px;align-items:center;'><div style='position:relative;cursor:pointer;' id='notif-btn'><span style='font-size:20px;'>&#128276;</span><span id='notif-badge' style='position:absolute;top:-4px;right:-4px;background:#e74c3c;color:white;border-radius:50%;width:16px;height:16px;font-size:10px;font-weight:bold;display:none;align-items:center;justify-content:center;line-height:16px;text-align:center;'>0</span></div><button id='v-refresh' style='background:rgba(255,255,255,0.5);border:none;cursor:pointer;color:#8b735d;font-size:12px;font-weight:bold;padding:6px 10px;border-radius:6px;'>&#128260; Rafraichir</button><span id='v-resize' style='cursor:pointer;color:#8b735d;background:rgba(255,255,255,0.5);width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px;'>&#8993;</span><span id='v-close' style='cursor:pointer;color:#8b735d;background:rgba(255,255,255,0.5);width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px;'>&#10005;</span></div>";

  var content = document.createElement("div");
  content.id = "v-content";
  content.style.cssText = "flex:1;overflow-y:auto;padding:20px;max-width:800px;width:100%;margin:0 auto;box-sizing:border-box;";

  panel.appendChild(header);
  panel.appendChild(content);
  document.body.appendChild(panel);

  // Boutons header
  var isReduced = false;
  // Cloche notifications
  document.getElementById("notif-btn").onclick = function() { afficherNotifications(); };

  function envoyerNotif(destUid, type, texte, lien) {
    if (destUid === uid) return;
    db.collection("notifications").add({
      destUid: destUid, type: type, texte: texte, lien: lien || "",
      lu: false, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  function mettreAJourBadge() {
    db.collection("notifications").where("destUid", "==", uid).where("lu", "==", false).get().then(function(snap) {
      var badge = document.getElementById("notif-badge");
      if (!badge) return;
      if (snap.size > 0) {
        badge.innerText = snap.size > 9 ? "9+" : snap.size;
        badge.style.display = "inline-block";
      } else {
        badge.style.display = "none";
      }
    });
  }

  function afficherNotifications() {
    ongletActif = "notifs";
    document.getElementById("tab-v-btn").style.background = "rgba(255,255,255,0.5)";
    document.getElementById("tab-v-btn").style.color = "#8b735d";
    document.getElementById("tab-m-btn").style.background = "rgba(255,255,255,0.5)";
    document.getElementById("tab-m-btn").style.color = "#8b735d";
    document.getElementById("tab-a-btn").style.background = "rgba(255,255,255,0.5)";
    document.getElementById("tab-a-btn").style.color = "#8b735d";
    if (messageListener) { messageListener(); messageListener = null; }
    content.style.cssText = "flex:1;overflow-y:auto;padding:20px;max-width:800px;width:100%;margin:0 auto;box-sizing:border-box;";
    content.innerHTML = "<div style='background:white;border-radius:14px;padding:18px;border:1px solid #e8d4b0;'><div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;'><p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0;'>&#128276; Notifications</p><button id='notif-tout-lu' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:5px 10px;border-radius:8px;cursor:pointer;font-size:11px;'>Tout marquer comme lu</button></div><div id='notif-list'><p style='color:#999;text-align:center;'>Chargement...</p></div></div>";
    document.getElementById("notif-tout-lu").onclick = function() {
      db.collection("notifications").where("destUid", "==", uid).where("lu", "==", false).get().then(function(snap) {
        var batch = db.batch();
        snap.forEach(function(d) { batch.update(d.ref, { lu: true }); });
        batch.commit().then(function() { afficherNotifications(); mettreAJourBadge(); });
      });
    };
    db.collection("notifications").where("destUid", "==", uid).orderBy("createdAt", "desc").limit(30).get().then(function(snap) {
      var list = document.getElementById("notif-list"); if (!list) return;
      if (snap.empty) { list.innerHTML = "<p style='color:#999;text-align:center;'>Aucune notification.</p>"; return; }
      list.innerHTML = "";
      snap.forEach(function(docSnap) {
        var n = docSnap.data(); var nid = docSnap.id;
        var date = n.createdAt ? new Date(n.createdAt.seconds*1000).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}) : "";
        var icons = { victoire: "&#127942;", reaction: "&#10084;", commentaire: "&#128172;", message: "&#128172;" };
        var icon = icons[n.type] || "&#128276;";
        var row = document.createElement("div");
        row.style.cssText = "display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;margin-bottom:6px;cursor:pointer;background:" + (n.lu ? "white" : "#fdf6ec") + ";border:1px solid " + (n.lu ? "#f0e6d3" : "#e8d4b0") + ";";
        row.innerHTML = "<span style='font-size:20px;'>" + icon + "</span><div style='flex:1;'><div style='color:#3a3a3a;font-size:12px;'>" + n.texte + "</div><div style='color:#bbb;font-size:11px;margin-top:2px;'>" + date + "</div></div>" + (!n.lu ? "<span style='width:8px;height:8px;background:#e74c3c;border-radius:50%;min-width:8px;display:block;'></span>" : "");
        row.onclick = function() {
          db.collection("notifications").doc(nid).update({ lu: true });
          row.style.background = "white"; row.style.border = "1px solid #f0e6d3";
          mettreAJourBadge();
          if (n.type === "message") { document.getElementById("tab-m-btn").click(); }
          else { document.getElementById("tab-v-btn").click(); }
        };
        list.appendChild(row);
      });
      mettreAJourBadge();
    });
  }
    if (!isReduced) {
      panel.style.cssText = "position:fixed;bottom:20px;right:80px;width:400px;height:580px;background:#f8f3ee;z-index:999999;display:flex;flex-direction:column;font-family:Arial,sans-serif;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,0.2);overflow:hidden;";
      content.style.padding = "12px";
      document.getElementById("v-resize").innerHTML = "&#9645;";
      isReduced = true;
    } else {
      panel.style.cssText = "position:fixed;inset:0;background:#f8f3ee;z-index:999999;display:flex;flex-direction:column;font-family:Arial,sans-serif;overflow:hidden;";
      content.style.padding = "20px";
      document.getElementById("v-resize").innerHTML = "&#8993;";
      isReduced = false;
    }
  };
  document.getElementById("v-close").onclick = function() {
    if (messageListener) { messageListener(); }
    panel.remove();
    var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click();
  };
  document.getElementById("v-refresh").onclick = function() {
    if (ongletActif === "victoires") afficherVictoires();
    else if (ongletActif === "messages") afficherMessages();
    else if (ongletActif === "admin") ongletActif = 'admin';
    afficherAdminConversations();
  };

  // Onglets
  document.getElementById("tab-v-btn").onclick = function() {
    document.getElementById("tab-v-btn").style.background = "#c9a86a";
    document.getElementById("tab-v-btn").style.color = "white";
    document.getElementById("tab-m-btn").style.background = "rgba(255,255,255,0.5)";
    document.getElementById("tab-m-btn").style.color = "#8b735d";
    ongletActif = 'victoires';
    if (messageListener) { messageListener(); messageListener = null; }
    content.style.cssText = "flex:1;overflow-y:auto;padding:20px;max-width:800px;width:100%;margin:0 auto;box-sizing:border-box;";
    afficherVictoires();
  };
  document.getElementById("tab-m-btn").onclick = function() {
    document.getElementById("tab-m-btn").style.background = "#c9a86a";
    document.getElementById("tab-m-btn").style.color = "white";
    document.getElementById("tab-v-btn").style.background = "rgba(255,255,255,0.5)";
    document.getElementById("tab-v-btn").style.color = "#8b735d";
    ongletActif = 'messages';
    afficherMessages();
  };

  document.getElementById("tab-a-btn").onclick = function() {
    document.getElementById("tab-a-btn").style.background = "#c9a86a";
    document.getElementById("tab-a-btn").style.color = "white";
    document.getElementById("tab-m-btn").style.background = "rgba(255,255,255,0.5)";
    document.getElementById("tab-m-btn").style.color = "#8b735d";
    document.getElementById("tab-v-btn").style.background = "rgba(255,255,255,0.5)";
    document.getElementById("tab-v-btn").style.color = "#8b735d";
    afficherAdminConversations();
  };

  // Charger les données
  db.collection("users").where("accountStatus", "==", "active").get().then(function(snap) {
    snap.forEach(function(d) { var m = d.data(); m._uid = d.id; tousLesMembres.push(m); if (d.id === uid) { userData = m; isAdmin = m.role === "admin"; } });
    if (isAdmin) { document.getElementById("tab-a-btn").style.display = "block"; }
    mettreAJourBadge();
    afficherVictoires();
  });

  // ===================== VICTOIRES =====================
  function afficherVictoires() {
    content.innerHTML = "<div id='vform' style='background:white;border-radius:14px;padding:18px;border:1px solid #e8d4b0;margin-bottom:16px;'><p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 10px;'>Partager une victoire</p><div style='display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;'><button class='cat-btn' data-cat='Objectif' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:5px 10px;border-radius:8px;cursor:pointer;font-size:12px;'>&#127942; Objectif</button><button class='cat-btn' data-cat='Vente' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:5px 10px;border-radius:8px;cursor:pointer;font-size:12px;'>&#128176; Vente</button><button class='cat-btn' data-cat='Recrue' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:5px 10px;border-radius:8px;cursor:pointer;font-size:12px;'>&#128101; Recrue</button><button class='cat-btn' data-cat='Autre' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:5px 10px;border-radius:8px;cursor:pointer;font-size:12px;'>&#11088; Autre</button></div><div style='position:relative;'><textarea id='vtexte' placeholder='Raconte ta victoire... (@ pour mentionner)' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;height:65px;resize:vertical;font-family:Arial,sans-serif;'></textarea><div id='mention-v' style='display:none;position:absolute;top:70px;left:0;background:white;border:1px solid #e8d4b0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);z-index:99;max-height:140px;overflow-y:auto;min-width:180px;'></div></div><div style='display:flex;gap:8px;align-items:center;margin-top:8px;'><label style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:7px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>&#128247; Photo<input type='file' id='vphoto' accept='image/*' style='display:none;' /></label><span id='vphoto-name' style='color:#999;font-size:12px;'></span><button id='vpublier' style='margin-left:auto;background:#c9a86a;color:white;border:none;padding:9px 18px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:13px;'>Publier !</button></div><div id='vmsg' style='color:#8b735d;font-size:12px;margin-top:6px;'></div></div><div id='vlist'><p style='color:#999;text-align:center;'>Chargement...</p></div>";

    // Catégories
    document.querySelectorAll(".cat-btn").forEach(function(btn) {
      btn.onclick = function() {
        document.querySelectorAll(".cat-btn").forEach(function(b) { b.style.background = "#f3e7d3"; b.style.color = "#8a6a35"; b.style.border = "1px solid #c8a96b"; });
        btn.style.background = "#c9a86a"; btn.style.color = "white"; btn.style.border = "1px solid #c9a86a";
        categorieSelectionnee = btn.getAttribute("data-cat");
      };
    });

    // Mentions dans textarea
    document.getElementById("vtexte").addEventListener("input", function() {
      var val = this.value; var at = val.lastIndexOf("@");
      var ml = document.getElementById("mention-v");
      if (at > -1) {
        var search = val.slice(at + 1).toLowerCase();
        var filtered = tousLesMembres.filter(function(m) { return (m.prenom + " " + m.nom).toLowerCase().indexOf(search) > -1 && m._uid !== uid; });
        if (filtered.length > 0) {
          ml.innerHTML = ""; var ta = this;
          filtered.forEach(function(m) {
            var item = document.createElement("div");
            item.style.cssText = "padding:8px 12px;cursor:pointer;font-size:13px;";
            item.innerText = m.prenom + " " + m.nom;
            item.onmouseenter = function() { item.style.background = "#f8f3ee"; };
            item.onmouseleave = function() { item.style.background = "white"; };
            item.onclick = function() { ta.value = val.slice(0, at) + "@" + m.prenom + " " + m.nom + " "; ml.style.display = "none"; };
            ml.appendChild(item);
          });
          ml.style.display = "block";
        } else { ml.style.display = "none"; }
      } else { ml.style.display = "none"; }
    });

    // Photo
    document.getElementById("vphoto").onchange = function() {
      document.getElementById("vphoto-name").innerText = this.files[0] ? this.files[0].name : "";
    };

    // Publier
    document.getElementById("vpublier").onclick = async function() {
      var texte = document.getElementById("vtexte").value.trim();
      var msg = document.getElementById("vmsg");
      if (!texte) { msg.innerText = "Ecris ta victoire avant de publier."; return; }
      msg.innerText = "Publication en cours..."; this.disabled = true;
      var imageURL = null;
      var photoFile = document.getElementById("vphoto").files[0];
      if (photoFile) {
        try {
          var fd = new FormData(); fd.append("file", photoFile); fd.append("upload_preset", "baa_avatars"); fd.append("folder", "victoires");
          var r = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload", { method: "POST", body: fd });
          imageURL = (await r.json()).secure_url;
        } catch(e) { msg.innerText = "Erreur photo."; this.disabled = false; return; }
      }
      await db.collection("victoires").add({
        uid: uid, prenom: userData.prenom || "", nom: userData.nom || "", photoURL: userData.photoURL || null,
        texte: texte, imageURL: imageURL, categorie: categorieSelectionnee,
        reactions: {}, createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      emailjs.init("D_JtKhPDgOQWi_ECO");
      tousLesMembres.forEach(function(m) {
        if (m._uid !== uid) {
          envoyerNotif(m._uid, "victoire", (userData.prenom||"") + " a partage une nouvelle victoire !" + (categorieSelectionnee ? " (" + categorieSelectionnee + ")" : ""), "victoires");
        }
        if (m.email && m._uid !== uid) {
          emailjs.send("service_wr9mlhk", "template_wk2j4mg", {
            prenom: m.prenom || "", nom: m.nom || "", email: m.email,
            titre_message: "Nouvelle victoire sur le Mur !",
            corps_message: (userData.prenom || "") + " vient de partager une victoire" + (categorieSelectionnee ? " (" + categorieSelectionnee + ")" : "") + " : " + texte,
            lien_action: "Connecte-toi sur l Academie pour reagir !",
            date: new Date().toLocaleDateString("fr-FR")
          }).catch(function(){});
        }
      });
      document.getElementById("vtexte").value = "";
      document.getElementById("vphoto").value = "";
      document.getElementById("vphoto-name").innerText = "";
      document.querySelectorAll(".cat-btn").forEach(function(b) { b.style.background = "#f3e7d3"; b.style.color = "#8a6a35"; });
      categorieSelectionnee = ""; msg.innerText = "Victoire publiee !";
      setTimeout(function() { msg.innerText = ""; }, 3000);
      this.disabled = false;
      chargerVictoires();
    };

    chargerVictoires();
  }

  var EMOJIS = [{k:"feu",h:"&#128293;"},{k:"muscle",h:"&#128170;"},{k:"fete",h:"&#127881;"},{k:"clap",h:"&#128079;"},{k:"coeur",h:"&#10084;"}];

  function afficherReactions(reactions, vid) {
    return EMOJIS.map(function(e) {
      var arr = reactions[e.k] || []; var active = arr.indexOf(uid) > -1;
      var s = active ? "background:#c9a86a;color:white;border:1px solid #c9a86a;" : "background:#f8f3ee;color:#3a3a3a;border:1px solid #e8d4b0;";
      return "<button class='react-btn' data-k='" + e.k + "' data-vid='" + vid + "' style='" + s + "padding:4px 9px;border-radius:16px;cursor:pointer;font-size:12px;'>" + e.h + (arr.length > 0 ? " " + arr.length : "") + "</button>";
    }).join("");
  }

  function attachReactions(vid) {
    var c = document.getElementById("react-" + vid); if (!c) return;
    c.querySelectorAll(".react-btn").forEach(function(btn) {
      btn.onclick = function() {
        var k = btn.getAttribute("data-k");
        db.collection("victoires").doc(vid).get().then(function(s) {
          var r = s.data().reactions || {};
          // Retirer uid de toutes les autres réactions d'abord
          EMOJIS.forEach(function(e) { if (e.k !== k && r[e.k]) { var i = r[e.k].indexOf(uid); if (i > -1) { r[e.k].splice(i, 1); if (!r[e.k].length) delete r[e.k]; } } });
          // Toggler la réaction cliquée
          if (!r[k]) r[k] = [];
          var i = r[k].indexOf(uid);
          if (i > -1) { r[k].splice(i, 1); if (!r[k].length) delete r[k]; } else { r[k].push(uid); }
          db.collection("victoires").doc(vid).update({ reactions: r }).then(function() {
            c.innerHTML = afficherReactions(r, vid); attachReactions(vid);
            db.collection("victoires").doc(vid).get().then(function(vs) {
              var vData = vs.data();
              if (vData && vData.uid && vData.uid !== uid) {
                var emojiActif = EMOJIS.find(function(e) { return r[e.k] && r[e.k].indexOf(uid) > -1; });
                if (emojiActif) envoyerNotif(vData.uid, "reaction", (userData.prenom||"") + " a reagi a ta victoire avec " + emojiActif.h, "victoires");
              }
            });
          });
        });
      };
    });
  }

  function chargerVictoires() {
    var list = document.getElementById("vlist"); if (!list) return;
    list.innerHTML = "<p style='color:#999;text-align:center;'>Chargement...</p>";
    db.collection("victoires").orderBy("createdAt", "desc").limit(30).get().then(function(snap) {
      if (snap.empty) { list.innerHTML = "<p style='color:#999;text-align:center;'>Aucune victoire pour l instant !</p>"; return; }
      list.innerHTML = "";
      snap.forEach(function(docSnap) {
        var v = docSnap.data(); var vid = docSnap.id;
        var date = v.createdAt ? new Date(v.createdAt.seconds * 1000).toLocaleDateString("fr-FR", {day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}) : "";
        var av = v.photoURL ? "<img src='" + v.photoURL + "' style='width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid #e8d4b0;' />" : "<div style='width:36px;height:36px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;min-width:36px;'><span style='color:white;font-size:13px;font-weight:bold;'>" + (v.prenom ? v.prenom[0].toUpperCase() : "?") + "</span></div>";
        var catE = {Objectif:"&#127942;",Vente:"&#128176;",Recrue:"&#128101;",Autre:"&#11088;"};
        var catH = v.categorie ? "<span style='background:#f3e7d3;color:#8a6a35;padding:2px 7px;border-radius:6px;font-size:11px;font-weight:bold;margin-left:6px;'>" + (catE[v.categorie]||"") + " " + v.categorie + "</span>" : "";
        var delBtn = isAdmin ? "<button id='delv-" + vid + "' style='background:none;border:none;color:#e74c3c;cursor:pointer;font-size:11px;margin-left:auto;'>&#128465;</button>" : "";
        var photoH = v.imageURL ? "<img src='" + v.imageURL + "' style='width:100%;border-radius:10px;margin:8px 0;max-height:280px;object-fit:cover;' />" : "";
        var card = document.createElement("div");
        card.id = "vcard-" + vid;
        card.style.cssText = "background:white;border-radius:14px;padding:16px;margin-bottom:12px;border:1px solid #e8d4b0;";
        card.innerHTML = "<div style='display:flex;align-items:center;gap:10px;margin-bottom:8px;'>" + av + "<div style='flex:1;'><div style='font-weight:bold;color:#3a3a3a;font-size:13px;'>" + (v.prenom||"") + " " + (v.nom||"") + catH + "</div><div style='color:#bbb;font-size:11px;'>" + date + "</div></div>" + delBtn + "</div><div style='color:#3a3a3a;font-size:13px;line-height:1.5;'>" + v.texte + "</div>" + photoH + "<div id='react-" + vid + "' style='display:flex;gap:5px;flex-wrap:wrap;margin:8px 0;'>" + afficherReactions(v.reactions||{}, vid) + "</div><div style='border-top:1px solid #f0e6d3;padding-top:8px;'><div id='coms-" + vid + "' style='margin-bottom:8px;'></div><div style='position:relative;display:flex;gap:6px;'><input id='cinput-" + vid + "' placeholder='Commenter... (@ pour mentionner)' style='flex:1;padding:7px 10px;border:1px solid #e8d4b0;border-radius:20px;font-size:12px;outline:none;' /><button id='csend-" + vid + "' style='background:#c9a86a;color:white;border:none;padding:7px 12px;border-radius:20px;cursor:pointer;font-size:12px;font-weight:bold;'>Envoyer</button><div id='menc-" + vid + "' style='display:none;position:absolute;bottom:38px;left:0;background:white;border:1px solid #e8d4b0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);z-index:99;max-height:130px;overflow-y:auto;min-width:180px;'></div></div></div>";
        list.appendChild(card);
        attachReactions(vid);
        chargerCommentaires(vid);
        if (isAdmin) {
          var db2 = document.getElementById("delv-" + vid);
          if (db2) db2.onclick = function() { if (confirm("Supprimer ?")) db.collection("victoires").doc(vid).delete().then(function() { document.getElementById("vcard-"+vid).remove(); }); };
        }
        // Mentions dans commentaire
        var ci = document.getElementById("cinput-" + vid);
        ci.addEventListener("input", function() {
          var val = this.value; var at = val.lastIndexOf("@"); var ml = document.getElementById("menc-" + vid);
          if (at > -1) {
            var search = val.slice(at + 1).toLowerCase();
            var filtered = tousLesMembres.filter(function(m) { return (m.prenom + " " + m.nom).toLowerCase().indexOf(search) > -1; });
            if (filtered.length > 0) {
              ml.innerHTML = ""; var inp = this;
              filtered.forEach(function(m) {
                var it = document.createElement("div"); it.style.cssText = "padding:7px 10px;cursor:pointer;font-size:12px;";
                it.innerText = m.prenom + " " + m.nom;
                it.onmouseenter = function() { it.style.background = "#f8f3ee"; }; it.onmouseleave = function() { it.style.background = "white"; };
                it.onclick = function() { inp.value = val.slice(0, at) + "@" + m.prenom + " " + m.nom + " "; ml.style.display = "none"; };
                ml.appendChild(it);
              }); ml.style.display = "block";
            } else { ml.style.display = "none"; }
          } else { ml.style.display = "none"; }
        });
        document.getElementById("csend-" + vid).onclick = function() {
          var ci2 = document.getElementById("cinput-" + vid); var texte = ci2.value.trim();
          if (!texte) return;
          document.getElementById("menc-" + vid).style.display = "none";
          db.collection("victoires").doc(vid).collection("commentaires").add({
            uid: uid, prenom: userData.prenom||"", nom: userData.nom||"", photoURL: userData.photoURL||null,
            texte: texte, createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }).then(function() {
            ci2.value = ""; chargerCommentaires(vid);
            db.collection("victoires").doc(vid).get().then(function(vs) {
              var vData = vs.data();
              if (vData && vData.uid && vData.uid !== uid) {
                envoyerNotif(vData.uid, "commentaire", (userData.prenom||"") + " a commente ta victoire : " + texte.slice(0, 50) + (texte.length > 50 ? "..." : ""), "victoires");
              }
            });
          });
        };
      });
    });
  }

  function chargerCommentaires(vid) {
    db.collection("victoires").doc(vid).collection("commentaires").orderBy("createdAt").get().then(function(snap) {
      var c = document.getElementById("coms-" + vid); if (!c) return; c.innerHTML = "";
      snap.forEach(function(ds) {
        var com = ds.data(); var cid = ds.id;
        var av = com.photoURL ? "<img src='" + com.photoURL + "' style='width:26px;height:26px;border-radius:50%;object-fit:cover;' />" : "<div style='width:26px;height:26px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;min-width:26px;'><span style='color:white;font-size:10px;font-weight:bold;'>" + (com.prenom?com.prenom[0].toUpperCase():"?") + "</span></div>";
        var delC = (isAdmin || com.uid === uid) ? "<span id='delc-" + cid + "-" + vid + "' style='color:#e74c3c;cursor:pointer;font-size:10px;margin-left:4px;'>&#128465;</span>" : "";
        var likes = com.likes || []; var liked = likes.indexOf(uid) > -1;
        var likeS = liked ? "color:#c9a86a;font-weight:bold;" : "color:#bbb;";
        var texteH = com.texte.replace(/@([\w\u00C0-\u024F][\w\u00C0-\u024F\s]*)/g, "<span style='color:#c9a86a;font-weight:bold;'>@$1</span>");
        var div = document.createElement("div"); div.style.cssText = "margin-bottom:8px;";
        div.innerHTML = "<div style='display:flex;gap:6px;align-items:flex-start;'>" + av + "<div style='background:#f8f3ee;border-radius:10px;padding:7px 10px;flex:1;'><div style='font-weight:bold;color:#3a3a3a;font-size:11px;'>" + (com.prenom||"") + " " + (com.nom||"") + delC + "</div><div style='color:#3a3a3a;font-size:12px;margin-top:2px;'>" + texteH + "</div><div style='display:flex;gap:10px;margin-top:5px;'><span id='lc-" + cid + "-" + vid + "' style='cursor:pointer;font-size:11px;" + likeS + "'>&#10084; " + (likes.length > 0 ? likes.length : "") + " J aime</span><span id='rc-" + cid + "-" + vid + "' style='cursor:pointer;font-size:11px;color:#bbb;'>&#128172; Repondre</span></div></div></div><div id='reps-" + cid + "-" + vid + "' style='margin-left:32px;margin-top:3px;'></div><div id='rform-" + cid + "-" + vid + "' style='display:none;margin-left:32px;margin-top:4px;'><div style='display:flex;gap:5px;'><input id='ri-" + cid + "-" + vid + "' placeholder='Repondre...' style='flex:1;padding:6px 10px;border:1px solid #e8d4b0;border-radius:16px;font-size:11px;' /><button id='rs-" + cid + "-" + vid + "' style='background:#c9a86a;color:white;border:none;padding:6px 10px;border-radius:16px;cursor:pointer;font-size:11px;'>OK</button></div></div>";
        c.appendChild(div);
        chargerReponses(vid, cid);
        var dc = document.getElementById("delc-" + cid + "-" + vid);
        if (dc) dc.onclick = function() { db.collection("victoires").doc(vid).collection("commentaires").doc(cid).delete().then(function() { chargerCommentaires(vid); }); };
        document.getElementById("lc-" + cid + "-" + vid).onclick = function() {
          db.collection("victoires").doc(vid).collection("commentaires").doc(cid).get().then(function(s) {
            var ls = s.data().likes || []; var i = ls.indexOf(uid);
            if (i > -1) ls.splice(i, 1); else ls.push(uid);
            db.collection("victoires").doc(vid).collection("commentaires").doc(cid).update({ likes: ls }).then(function() { chargerCommentaires(vid); });
          });
        };
        document.getElementById("rc-" + cid + "-" + vid).onclick = function() {
          var rf = document.getElementById("rform-" + cid + "-" + vid);
          rf.style.display = rf.style.display === "none" ? "block" : "none";
        };
        document.getElementById("rs-" + cid + "-" + vid).onclick = function() {
          var ri = document.getElementById("ri-" + cid + "-" + vid); var t = ri.value.trim(); if (!t) return;
          db.collection("victoires").doc(vid).collection("commentaires").doc(cid).collection("reponses").add({
            uid: uid, prenom: userData.prenom||"", nom: userData.nom||"", photoURL: userData.photoURL||null,
            texte: t, createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }).then(function() { ri.value = ""; document.getElementById("rform-" + cid + "-" + vid).style.display = "none"; chargerReponses(vid, cid); });
        };
      });
    });
  }

  function chargerReponses(vid, cid) {
    db.collection("victoires").doc(vid).collection("commentaires").doc(cid).collection("reponses").orderBy("createdAt").get().then(function(snap) {
      var c = document.getElementById("reps-" + cid + "-" + vid); if (!c) return; c.innerHTML = "";
      snap.forEach(function(ds) {
        var r = ds.data(); var rid = ds.id;
        var av = r.photoURL ? "<img src='" + r.photoURL + "' style='width:20px;height:20px;border-radius:50%;object-fit:cover;' />" : "<div style='width:20px;height:20px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;min-width:20px;'><span style='color:white;font-size:9px;font-weight:bold;'>" + (r.prenom?r.prenom[0].toUpperCase():"?") + "</span></div>";
        var dr = (isAdmin || r.uid === uid) ? "<span id='dr-" + rid + "-" + cid + "-" + vid + "' style='color:#e74c3c;cursor:pointer;font-size:10px;margin-left:4px;'>&#128465;</span>" : "";
        var texteH = r.texte.replace(/@([\w\u00C0-\u024F][\w\u00C0-\u024F\s]*)/g, "<span style='color:#c9a86a;font-weight:bold;'>@$1</span>");
        var div = document.createElement("div"); div.style.cssText = "display:flex;gap:5px;align-items:flex-start;margin-bottom:5px;";
        div.innerHTML = av + "<div style='background:white;border-radius:8px;padding:5px 8px;flex:1;border:1px solid #f0e6d3;'><div style='font-weight:bold;color:#3a3a3a;font-size:10px;'>" + (r.prenom||"") + " " + (r.nom||"") + dr + "</div><div style='color:#3a3a3a;font-size:11px;'>" + texteH + "</div></div>";
        c.appendChild(div);
        var d = document.getElementById("dr-" + rid + "-" + cid + "-" + vid);
        if (d) d.onclick = function() { db.collection("victoires").doc(vid).collection("commentaires").doc(cid).collection("reponses").doc(rid).delete().then(function() { chargerReponses(vid, cid); }); };
      });
    });
  }

  // ===================== MESSAGES =====================
  function afficherMessages() {
    if (messageListener) { messageListener(); messageListener = null; }
    content.style.cssText = "flex:1;overflow:hidden;max-width:800px;width:100%;margin:0 auto;box-sizing:border-box;display:flex;flex-direction:column;padding:0;";
    content.innerHTML = "<div style='display:flex;flex:1;overflow:hidden;'><div id='mlist' style='width:200px;min-width:200px;border-right:1px solid #e8d4b0;overflow-y:auto;background:white;'><div style='padding:12px;color:#8b735d;font-size:12px;font-weight:bold;border-bottom:1px solid #f0e6d3;'>Conversations</div></div><div id='mconv' style='flex:1;display:flex;flex-direction:column;overflow:hidden;'><div style='flex:1;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:13px;'>Selectionne une membre</div></div></div>";
    var ml = document.getElementById("mlist");
    tousLesMembres.forEach(function(m) {
      if (!m._uid || m._uid === uid) return;
      var item = document.createElement("div");
      item.style.cssText = "display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:pointer;border-bottom:1px solid #f8f3ee;";
      var av = m.photoURL ? "<img src='" + m.photoURL + "' style='width:32px;height:32px;border-radius:50%;object-fit:cover;' />" : "<div style='width:32px;height:32px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;min-width:32px;'><span style='color:white;font-size:12px;font-weight:bold;'>" + (m.prenom?m.prenom[0].toUpperCase():"?") + "</span></div>";
      item.innerHTML = av + "<div style='font-size:12px;font-weight:bold;color:#3a3a3a;'>" + (m.prenom||"") + " " + (m.nom||"") + "</div>";
      item.onmouseenter = function() { item.style.background = "#f8f3ee"; };
      item.onmouseleave = function() { item.style.background = "white"; };
      item.onclick = function() {
        document.querySelectorAll("#mlist > div").forEach(function(el) { el.style.background = "white"; });
        item.style.background = "#f0e6d3";
        ouvrirConv(m);
      };
      ml.appendChild(item);
    });
  }

  function ouvrirConv(membre) {
    if (messageListener) { messageListener(); messageListener = null; }
    var convId = [uid, membre._uid].sort().join("_");
    var mc = document.getElementById("mconv");
    mc.innerHTML = "<div style='padding:12px 16px;border-bottom:1px solid #e8d4b0;background:white;font-weight:bold;color:#3a3a3a;font-size:13px;flex-shrink:0;'>" + (membre.prenom||"") + " " + (membre.nom||"") + "</div><div id='msgs' style='flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:6px;'></div><div style='padding:10px;border-top:1px solid #e8d4b0;background:white;flex-shrink:0;'><div id='emoji-picker' style='display:none;flex-wrap:wrap;gap:4px;padding:8px;background:#f8f3ee;border-radius:10px;margin-bottom:6px;'>&#128293;&#128170;&#127881;&#128079;&#10084;&#128514;&#128513;&#128557;&#129299;&#128526;&#129303;&#127775;&#128591;&#127942;&#128176;&#128640;&#129395;&#128522;&#128578;'.split('').filter(function(c,i,a){return a.indexOf(c)===i;}).map(function(e){return e;}).join('')</div><div id='emoji-bar' style='display:none;flex-wrap:wrap;gap:4px;padding:8px;background:#f8f3ee;border-radius:10px;margin-bottom:6px;'></div><div style='display:flex;gap:6px;align-items:center;'><button id='emoji-btn' style='background:none;border:none;cursor:pointer;font-size:20px;padding:4px;'>&#128515;</button><label style='cursor:pointer;font-size:18px;padding:4px;'>&#128247;<input type='file' id='mphoto' accept='image/*' style='display:none;' /></label><input id='minput' placeholder='Ecrire...' style='flex:1;padding:8px 12px;border:1px solid #e8d4b0;border-radius:20px;font-size:12px;outline:none;' /><button id='msend' style='background:#c9a86a;color:white;border:none;padding:8px 14px;border-radius:20px;cursor:pointer;font-size:12px;font-weight:bold;'>Envoyer</button></div><div id='mphoto-preview' style='display:none;margin-top:6px;position:relative;'><img id='mphoto-img' style='max-height:80px;border-radius:8px;border:1px solid #e8d4b0;' /><span id='mphoto-del' style='position:absolute;top:-6px;right:-6px;background:#e74c3c;color:white;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;'>&#10005;</span></div></div>";
    mc.style.cssText = "flex:1;display:flex;flex-direction:column;overflow:hidden;";

    // Emoji picker
    var emojisDispos = ["😃","😊","😂","😍","😢","🥰","🤗","😎","🤩","😅","👍","👏","🙌","🎉","🔥","💪","❤️","⭐","🏆","💰","🚀","✨","🌸","🎯","💯"];
    var emojiBar = document.getElementById("emoji-bar");
    emojisDispos.forEach(function(e) {
      var btn = document.createElement("span");
      btn.innerText = e;
      btn.style.cssText = "cursor:pointer;font-size:20px;padding:2px;border-radius:4px;";
      btn.onmouseenter = function() { btn.style.background = "#e8d4b0"; };
      btn.onmouseleave = function() { btn.style.background = "none"; };
      btn.onclick = function() {
        var inp = document.getElementById("minput");
        inp.value += e; inp.focus();
      };
      emojiBar.appendChild(btn);
    });
    document.getElementById("emoji-btn").onclick = function() {
      emojiBar.style.display = emojiBar.style.display === "none" ? "flex" : "none";
    };

    // Photo preview
    var photoFileMsg = null;
    document.getElementById("mphoto").onchange = function() {
      if (!this.files[0]) return;
      photoFileMsg = this.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById("mphoto-img").src = e.target.result;
        document.getElementById("mphoto-preview").style.display = "block";
      };
      reader.readAsDataURL(photoFileMsg);
    };
    document.getElementById("mphoto-del").onclick = function() {
      photoFileMsg = null;
      document.getElementById("mphoto").value = "";
      document.getElementById("mphoto-preview").style.display = "none";
    };
    messageListener = db.collection("conversations").doc(convId).collection("messages").orderBy("createdAt").onSnapshot(function(snap) {
      var list = document.getElementById("msgs"); if (!list) return;
      list.innerHTML = "";
      snap.forEach(function(ds) {
        var msg = ds.data(); var mine = msg.uid === uid;
        var div = document.createElement("div"); div.style.cssText = "display:flex;justify-content:" + (mine?"flex-end":"flex-start") + ";";
        var bub = document.createElement("div");
        bub.style.cssText = "max-width:72%;padding:8px 12px;border-radius:" + (mine?"16px 16px 4px 16px":"16px 16px 16px 4px") + ";background:" + (mine?"#c9a86a":"white") + ";color:" + (mine?"white":"#3a3a3a") + ";font-size:12px;border:1px solid " + (mine?"#c9a86a":"#e8d4b0") + ";";
        var h = msg.createdAt ? new Date(msg.createdAt.seconds*1000).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}) : "";
        var imgH = msg.imageURL ? "<img src='" + msg.imageURL + "' style='max-width:200px;border-radius:8px;display:block;margin-bottom:4px;' />" : "";
        bub.innerHTML = imgH + (msg.texte ? "<div>" + msg.texte + "</div>" : "") + "<div style='font-size:10px;opacity:0.6;text-align:right;margin-top:2px;'>" + h + "</div>";
        div.appendChild(bub); list.appendChild(div);
      });
      list.scrollTop = list.scrollHeight;
    });
    document.getElementById("minput").addEventListener("keydown", function(e) { if (e.key === "Enter" && !e.shiftKey) document.getElementById("msend").click(); });
    document.getElementById("msend").onclick = async function() {
      var inp = document.getElementById("minput"); var t = inp.value.trim();
      if (!t && !photoFileMsg) return;
      var imageURL = null;
      if (photoFileMsg) {
        try {
          var fd = new FormData(); fd.append("file", photoFileMsg); fd.append("upload_preset", "baa_avatars"); fd.append("folder", "messages");
          var r = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload", { method: "POST", body: fd });
          imageURL = (await r.json()).secure_url;
          photoFileMsg = null; document.getElementById("mphoto").value = "";
          document.getElementById("mphoto-preview").style.display = "none";
        } catch(e) { console.log("Erreur photo message", e); }
      }
      document.getElementById("emoji-bar").style.display = "none";
      db.collection("conversations").doc(convId).collection("messages").add({
        uid: uid, prenom: userData.prenom||"", texte: t || "", imageURL: imageURL || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(function() {
        inp.value = "";
        envoyerNotif(membre._uid, "message", (userData.prenom||"") + " vous a envoye un message prive", "messages");
        db.collection("conversations-index").doc(convId).set({
          membres: [uid, membre._uid],
          prenoms: [(userData.prenom||"") + " " + (userData.nom||""), (membre.prenom||"") + " " + (membre.nom||"")],
          dernierMessage: t || "Photo",
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        if (membre.email && (t || imageURL)) {
          emailjs.init("D_JtKhPDgOQWi_ECO");
          emailjs.send("service_wr9mlhk", "template_wk2j4mg", {
            prenom: membre.prenom||"", nom: membre.nom||"", email: membre.email,
            titre_message: "Nouveau message de " + (userData.prenom||"") + " !",
            corps_message: (userData.prenom||"") + " t a envoye un message" + (t ? " : " + t : " avec une photo") + ".",
            lien_action: "Connecte-toi sur l Academie pour repondre.",
            date: new Date().toLocaleDateString("fr-FR")
          }).catch(function(){});
        }
      });
    };
  }

  // ===================== ADMIN CONVERSATIONS =====================
  function afficherAdminConversations() {
    if (messageListener) { messageListener(); messageListener = null; }
    content.style.cssText = "flex:1;overflow-y:auto;padding:20px;max-width:800px;width:100%;margin:0 auto;box-sizing:border-box;";
    content.innerHTML = "<div style='background:white;border-radius:14px;padding:18px;border:1px solid #e8d4b0;'><p style='color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 14px;'>&#9881; Toutes les conversations privees</p><div id='admin-convs'><p style='color:#999;text-align:center;'>Chargement...</p></div></div>";
    db.collection("conversations-index").orderBy("updatedAt", "desc").get().then(function(snap) {
      var c = document.getElementById("admin-convs"); if (!c) return;
      if (snap.empty) { c.innerHTML = "<p style='color:#999;text-align:center;'>Aucune conversation pour l instant.</p>"; return; }
      c.innerHTML = "";
      snap.forEach(function(docSnap) {
        var conv = docSnap.data(); var convId = docSnap.id;
        var date = conv.updatedAt ? new Date(conv.updatedAt.seconds*1000).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}) : "";
        var row = document.createElement("div");
        row.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:12px;border-radius:10px;margin-bottom:8px;border:1px solid #f0e6d3;cursor:pointer;";
        row.innerHTML = "<div><div style='font-weight:bold;color:#3a3a3a;font-size:13px;'>&#128172; " + (conv.prenoms||[]).join(" &amp; ") + "</div><div style='color:#999;font-size:12px;margin-top:2px;'>" + (conv.dernierMessage||"") + "</div></div><div style='color:#bbb;font-size:11px;'>" + date + "</div>";
        row.onmouseenter = function() { row.style.background = "#f8f3ee"; };
        row.onmouseleave = function() { row.style.background = "white"; };
        row.onclick = function() { afficherConvAdmin(convId, conv); };
        c.appendChild(row);
      });
    });
  }

  function afficherConvAdmin(convId, conv) {
    content.innerHTML = "<div style='display:flex;align-items:center;gap:10px;margin-bottom:14px;'><button id='back-admin' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;'>&#8592; Retour</button><div style='font-weight:bold;color:#3a3a3a;font-size:13px;'>&#128172; " + (conv.prenoms||[]).join(" &amp; ") + "</div></div><div id='admin-msgs' style='background:white;border-radius:14px;padding:14px;border:1px solid #e8d4b0;max-height:500px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;'><p style='color:#999;text-align:center;'>Chargement...</p></div>";
    document.getElementById("back-admin").onclick = function() { afficherAdminConversations(); };
    db.collection("conversations").doc(convId).collection("messages").orderBy("createdAt").get().then(function(snap) {
      var list = document.getElementById("admin-msgs"); if (!list) return;
      list.innerHTML = "";
      snap.forEach(function(ds) {
        var msg = ds.data();
        var div = document.createElement("div"); div.style.cssText = "padding:8px 12px;border-radius:10px;background:#f8f3ee;border:1px solid #f0e6d3;";
        var h = msg.createdAt ? new Date(msg.createdAt.seconds*1000).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}) : "";
        var imgH = msg.imageURL ? "<img src='" + msg.imageURL + "' style='max-width:180px;border-radius:8px;display:block;margin-top:4px;' />" : "";
        div.innerHTML = "<span style='font-weight:bold;color:#c9a86a;font-size:12px;'>" + (msg.prenom||"") + "</span> <span style='color:#bbb;font-size:11px;'>" + h + "</span><div style='color:#3a3a3a;font-size:13px;margin-top:2px;'>" + (msg.texte||"") + "</div>" + imgH;
        list.appendChild(div);
      });
      list.scrollTop = list.scrollHeight;
    });
  }
