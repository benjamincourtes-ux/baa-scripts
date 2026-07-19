// BAA Affiliation Admin — Patch panneau Admin pour gestion affiliation
(function() {

  function init() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(init, 300); return; }
    patcherAdminPanel();
  }

  function patcherAdminPanel() {
    var observer = new MutationObserver(function() {
      var tabAll = document.getElementById("tab-all");
      if (!tabAll || document.getElementById("tab-affiliation")) return;

      // Ajouter l'onglet Affiliation
      var tabAff = document.createElement("button");
      tabAff.id = "tab-affiliation";
      tabAff.textContent = "🔗 Affiliation";
      tabAff.style.cssText = "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;";
      tabAll.parentNode.insertBefore(tabAff, tabAll.nextSibling);

      tabAff.onclick = function() {
        // Reset tous les onglets
        tabAll.parentNode.querySelectorAll("button[id^='tab-']").forEach(function(b) {
          b.style.background = "#f3e7d3"; b.style.color = "#8a6a35"; b.style.border = "1px solid #c8a96b";
        });
        tabAff.style.background = "#c9a86a"; tabAff.style.color = "white"; tabAff.style.border = "none";
        loadAffiliation();
      };
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function loadAffiliation() {
    var list = document.getElementById("admin-members-list");
    if (!list) return;
    list.innerHTML = "<p style='color:#999;text-align:center;padding:20px;'>Chargement...</p>";

    var db = firebase.firestore();

    db.collection("users").where("accountStatus", "==", "active").get().then(function(snap) {
      list.innerHTML = "";

      // En-tête info
      var info = document.createElement("div");
      info.style.cssText = "background:#f0f4ff;border-radius:12px;padding:14px;margin-bottom:16px;border:1px solid #2980B9;";
      info.innerHTML = "<p style='color:#2980B9;font-size:13px;font-weight:bold;margin:0 0 4px;'>🔗 Programme d'affiliation</p><p style='color:#555;font-size:12px;margin:0;'>Activez l'affiliation pour chaque membre. Une fois activée, elle reçoit par email son lien unique et sa commission (50%). Le lien n'est pas activé par défaut.</p>";
      list.appendChild(info);

      if (snap.empty) {
        list.innerHTML += "<p style='color:#999;text-align:center;padding:20px;'>Aucun membre actif.</p>";
        return;
      }

      snap.forEach(function(docSnap) {
        var d = docSnap.data();
        var uid = docSnap.id;
        var affiliationActive = d.affiliationActive === true;
        var lienAff = "https://baa-landing.vercel.app/formations?ref=" + (d.prenom || "membre").toLowerCase().replace(/[^a-z0-9]/g, "");

        var card = document.createElement("div");
        card.id = "aff-row-" + uid;
        card.style.cssText = "background:white;border-radius:12px;padding:16px 20px;margin-bottom:12px;border:1px solid #e8d4b0;";

        var avatarHTML = d.photoURL
          ? "<img src='" + d.photoURL + "' style='width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid #e8d4b0;flex-shrink:0;'/>"
          : "<div style='width:42px;height:42px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;border:2px solid #e8d4b0;flex-shrink:0;'><span style='color:white;font-size:14px;font-weight:bold;'>" + (d.prenom ? d.prenom[0].toUpperCase() : "?") + "</span></div>";

        card.innerHTML = "<div style='display:flex;align-items:center;gap:12px;margin-bottom:12px;'>" + avatarHTML + "<div style='flex:1;'><p style='font-weight:bold;color:#3a3a3a;font-size:14px;margin:0 0 2px;'>" + (d.prenom || "") + " " + (d.nom || "") + "</p><p style='color:#999;font-size:12px;margin:0;'>" + (d.email || "") + "</p></div><span id='badge-" + uid + "' style='background:" + (affiliationActive ? "#e6f7ec" : "#f8f3ee") + ";color:" + (affiliationActive ? "#27AE60" : "#999") + ";border:1px solid " + (affiliationActive ? "#27AE60" : "#ddd") + ";padding:4px 10px;border-radius:8px;font-size:12px;font-weight:bold;'>" + (affiliationActive ? "✅ Active" : "⭕ Inactive") + "</span></div>";

        // Lien si actif
        if (affiliationActive) {
          var lienDiv = document.createElement("div");
          lienDiv.style.cssText = "background:#f8f3ee;border-radius:8px;padding:8px 12px;margin-bottom:10px;font-family:monospace;font-size:11px;color:#8b735d;word-break:break-all;";
          lienDiv.textContent = lienAff;
          card.appendChild(lienDiv);
        }

        // Boutons
        var btnRow = document.createElement("div");
        btnRow.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;";

        var toggleBtn = document.createElement("button");
        toggleBtn.id = "toggle-aff-" + uid;
        toggleBtn.textContent = affiliationActive ? "🔴 Désactiver" : "✅ Activer l'affiliation";
        toggleBtn.style.cssText = "flex:1;background:" + (affiliationActive ? "#fee" : "#e6f7ec") + ";color:" + (affiliationActive ? "#e74c3c" : "#27AE60") + ";border:1px solid " + (affiliationActive ? "#e74c3c" : "#27AE60") + ";padding:10px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;touch-action:manipulation;";

        toggleBtn.onclick = (function(userId, userData, isActive) {
          return function() {
            if (isActive) {
              // Désactiver
              if (!confirm("Désactiver l'affiliation de " + userData.prenom + " ?")) return;
              db.collection("users").doc(userId).update({ affiliationActive: false }).then(function() {
                loadAffiliation();
              });
            } else {
              // Activer et envoyer l'email
              if (!confirm("Activer l'affiliation pour " + userData.prenom + " et lui envoyer son lien par email ?")) return;
              toggleBtn.disabled = true;
              toggleBtn.textContent = "⏳ Activation...";

              db.collection("users").doc(userId).update({ affiliationActive: true }).then(function() {
                var lien = "https://baa-landing.vercel.app/formations?ref=" + (userData.prenom || "membre").toLowerCase().replace(/[^a-z0-9]/g, "");

                emailjs.send("service_wr9mlhk", "template_y4keuad", {
                  to_email: userData.email,
                  prenom: userData.prenom || "",
                  nom: userData.nom || "",
                  lien_affiliation: lien
                }).then(function() {
                  alert("✅ Affiliation activée et email envoyé à " + userData.prenom + " !");
                  loadAffiliation();
                }).catch(function(err) {
                  console.log("Erreur email:", err);
                  alert("✅ Affiliation activée mais erreur email. Lien : " + lien);
                  loadAffiliation();
                });
              });
            }
          };
        })(uid, d, affiliationActive);

        btnRow.appendChild(toggleBtn);

        // Bouton renvoyer le lien si déjà actif
        if (affiliationActive) {
          var renvoyerBtn = document.createElement("button");
          renvoyerBtn.textContent = "📧 Renvoyer le lien";
          renvoyerBtn.style.cssText = "flex:1;background:#f0f4ff;color:#2980B9;border:1px solid #2980B9;padding:10px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;touch-action:manipulation;";
          renvoyerBtn.onclick = (function(userData) {
            return function() {
              var lien = "https://baa-landing.vercel.app/formations?ref=" + (userData.prenom || "membre").toLowerCase().replace(/[^a-z0-9]/g, "");
              renvoyerBtn.disabled = true;
              renvoyerBtn.textContent = "⏳ Envoi...";
              emailjs.send("service_wr9mlhk", "template_y4keuad", {
                to_email: userData.email,
                prenom: userData.prenom || "",
                nom: userData.nom || "",
                lien_affiliation: lien
              }).then(function() {
                renvoyerBtn.textContent = "✅ Envoyé !";
                setTimeout(function() {
                  renvoyerBtn.textContent = "📧 Renvoyer le lien";
                  renvoyerBtn.disabled = false;
                }, 3000);
              }).catch(function() {
                renvoyerBtn.textContent = "❌ Erreur";
                renvoyerBtn.disabled = false;
              });
            };
          })(d);
          btnRow.appendChild(renvoyerBtn);
        }

        card.appendChild(btnRow);
        list.appendChild(card);
      });
    }).catch(function(e) {
      list.innerHTML = "<p style='color:#e74c3c;text-align:center;padding:20px;'>Erreur : " + e.message + "</p>";
    });
  }

  init();
  console.log("BAA Affiliation Admin initialisé");
})();
