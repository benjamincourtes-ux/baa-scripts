(function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) return;
    var justLoggedIn = sessionStorage.getItem("baa-just-logged-in");
    if (!justLoggedIn) return;
    sessionStorage.removeItem("baa-just-logged-in");
    var db = firebase.firestore();
    var today = new Date().toDateString();
    db.collection("users").doc(user.uid).get().then(function(snap) {
      var data = snap.data();
      if (!data || data.accountStatus !== "active") return;
      var panel = document.createElement("div");
      panel.id = "baa-dashboard-panel";
      panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:999999;display:flex;justify-content:center;align-items:center;padding:20px;";
      var box = document.createElement("div");
      box.style.cssText = "background:#f8f3ee;width:90%;max-width:500px;border-radius:24px;padding:28px;font-family:Arial,sans-serif;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);";
      box.innerHTML = "<div style='text-align:center;margin-bottom:20px;'><div style='font-size:36px;margin-bottom:8px;'>&#10024;</div><div id='dash-bonjour' style='color:#8b735d;font-size:20px;font-weight:bold;margin-bottom:4px;'>Bonjour !</div><div style='color:#bbb;font-size:13px;'>" + new Date().toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long"}) + "</div></div><div style='background:white;border-radius:14px;padding:16px;margin-bottom:12px;border:1px solid #e8d4b0;'><div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;'><div style='color:#8b735d;font-size:13px;font-weight:bold;'>Checklist du jour</div><div id='dash-check-pct' style='color:#c9a86a;font-size:13px;font-weight:bold;'>...</div></div><div style='background:#f0e6d3;border-radius:20px;height:10px;overflow:hidden;'><div id='dash-check-barre' style='background:#c9a86a;height:100%;border-radius:20px;width:0%;transition:width 0.6s;'></div></div><div id='dash-check-msg' style='color:#999;font-size:12px;margin-top:8px;'></div></div><div style='background:white;border-radius:14px;padding:16px;margin-bottom:12px;border:1px solid #e8d4b0;'><div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;'><div style='color:#8b735d;font-size:13px;font-weight:bold;'>Objectif du mois</div><div id='dash-obj-pct' style='color:#c9a86a;font-size:13px;font-weight:bold;'>...</div></div><div style='background:#f0e6d3;border-radius:20px;height:10px;overflow:hidden;'><div id='dash-obj-barre' style='background:#c9a86a;height:100%;border-radius:20px;width:0%;transition:width 0.6s;'></div></div><div id='dash-obj-detail' style='color:#999;font-size:12px;margin-top:8px;'></div></div><div style='background:white;border-radius:14px;padding:16px;margin-bottom:20px;border:1px solid #e8d4b0;'><div style='color:#8b735d;font-size:13px;font-weight:bold;margin-bottom:8px;'>Ce mois-ci</div><div id='dash-cmd' style='color:#999;font-size:13px;'>Chargement...</div></div><div id='dash-motiv' style='text-align:center;color:#8b735d;font-size:13px;font-style:italic;margin-bottom:20px;'></div><button id='close-dashboard' style='width:100%;background:linear-gradient(135deg,#c9a86a,#e8d4b0);color:white;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;'>Commencer ma journee !</button>";
      panel.appendChild(box);
      document.body.appendChild(panel);
      document.getElementById("close-dashboard").onclick = function() { panel.remove(); };
      document.getElementById("dash-bonjour").innerText = "Bonjour " + (data.prenom || "") + " !";
      var taches = data.checklistTaches || [];
      var cochees = data.checklistCochees || [];
      if (data.checklistDate !== today) { taches = []; cochees = []; }
      var total = taches.length || 10;
      var pctCheck = total === 0 ? 0 : Math.round(cochees.length / total * 100);
      document.getElementById("dash-check-pct").innerText = pctCheck + "%";
      setTimeout(function() { document.getElementById("dash-check-barre").style.width = pctCheck + "%"; }, 100);
      document.getElementById("dash-check-barre").style.background = pctCheck === 100 ? "#2ecc71" : "#c9a86a";
      document.getElementById("dash-check-msg").innerText = pctCheck === 100 ? "Checklist completee, bravo !" : cochees.length + " / " + total + " taches";
      var objectif = data.suiviObjectif || 0;
      var realise = data.suiviRealise || 0;
      if (objectif > 0) {
        var pctObj = Math.min(100, Math.round(realise / objectif * 100));
        document.getElementById("dash-obj-pct").innerText = pctObj + "%";
        setTimeout(function() { document.getElementById("dash-obj-barre").style.width = pctObj + "%"; }, 200);
        document.getElementById("dash-obj-barre").style.background = pctObj >= 100 ? "#2ecc71" : pctObj >= 50 ? "#c9a86a" : "#f39c12";
        var taux = realise >= 100 ? 30 : 20;
        document.getElementById("dash-obj-detail").innerText = realise + " / " + objectif + " euros - Commission : " + (realise * taux / 100).toFixed(2) + " euros";
      } else {
        document.getElementById("dash-obj-pct").innerText = "-";
        document.getElementById("dash-obj-detail").innerText = "Aucun objectif defini";
      }
      var messages = ["Chaque action te rapproche de tes reves !", "Ta regularite fait toute la difference.", "Aujourd hui est une nouvelle chance de briller !", "Tu construis quelque chose de beau.", "Les grandes reussites commencent par de petites actions."];
      document.getElementById("dash-motiv").innerText = messages[Math.floor(Math.random() * messages.length)];
      var moisDebut = new Date(); moisDebut.setDate(1); moisDebut.setHours(0,0,0,0);
      db.collection("users").doc(user.uid).collection("commandes").get().then(function(snapshot) {
        var totalMois = 0; var nbCommandes = 0;
        snapshot.forEach(function(docSnap) {
          var c = docSnap.data();
          if (c.date) { var d = new Date(c.date); if (d >= moisDebut) { totalMois += parseFloat(c.montant) || 0; nbCommandes++; } }
        });
        document.getElementById("dash-cmd").innerHTML = "<strong style='color:#3a3a3a;'>" + nbCommandes + " commande" + (nbCommandes > 1 ? "s" : "") + "</strong> - <strong style='color:#c9a86a;'>" + totalMois.toFixed(2) + " euros</strong> ce mois-ci";
      });
    });
  });
})();
