// BAA Commandes → Carnet clients
// Pont automatique : nouvelle commande boutique → mise à jour fiche cliente

(function() {
  function initPontCommandes() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(initPontCommandes, 300); return; }
    var auth = firebase.auth();
    var db = firebase.firestore();

    auth.onAuthStateChanged(function(user) {
      if (!user) return;

      var lastCheck = new Date().toISOString();

      // Écouter les nouvelles commandes en temps réel
      db.collection("commandes_clients")
        .where("boutiqueUid", "==", user.uid)
        .orderBy("date", "desc")
        .limit(10)
        .onSnapshot(function(snap) {
          snap.docChanges().forEach(function(change) {
            if (change.type === "added") {
              var cmd = change.doc.data();
              // Ignorer les commandes anciennes (avant la connexion)
              if (cmd.date && cmd.date > lastCheck) {
                traiterNouvelleCommande(user.uid, cmd, db);
              }
            }
          });
        }, function(e) { console.log("BAA Commandes:", e); });
    });
  }

  function traiterNouvelleCommande(uid, cmd, db) {
    var email = cmd.clientEmail || "";
    var prenom = cmd.clientPrenom || "";
    var nom = cmd.clientNom || "";
    var articles = cmd.articles || "";
    var total = cmd.total || "0€";
    var date = new Date().toLocaleDateString("fr-FR");

    if (!email && !prenom) return;

    // Chercher si la cliente existe déjà dans le carnet
    db.collection("users").doc(uid).collection("clientes")
      .where("email", "==", email)
      .get().then(function(snap) {
        if (!snap.empty) {
          // Mettre à jour la fiche existante
          var docRef = snap.docs[0].ref;
          var existingData = snap.docs[0].data();
          var historique = existingData.historiqueCommandes || [];
          historique.push({ date: date, articles: articles, total: total });
          docRef.update({
            derniereCommande: date,
            dernierMontant: total,
            historiqueCommandes: historique,
            nombreCommandes: (existingData.nombreCommandes || 0) + 1
          }).then(function() {
            console.log("✅ Fiche cliente mise à jour :", prenom, nom);
            // Émettre l'événement pour le bus
            if (window.baaEventBus) {
              window.baaEventBus.emit("vente_realisee", {
                montant: parseFloat(total.replace("€","").replace(",",".")) || 0,
                clientNom: prenom + " " + nom,
                articles: articles
              });
            }
            // Notification dans l'académie
            afficherNotifCommande(prenom, nom, total, articles);
          });
        } else {
          // Créer une nouvelle fiche cliente automatiquement
          db.collection("users").doc(uid).collection("clientes").add({
            prenom: prenom,
            nom: nom,
            email: email,
            tel: cmd.clientTel || "",
            derniereCommande: date,
            dernierMontant: total,
            nombreCommandes: 1,
            historiqueCommandes: [{ date: date, articles: articles, total: total }],
            notes: "Cliente ajoutée automatiquement suite à une commande boutique",
            createdAt: new Date().toISOString()
          }).then(function() {
            console.log("✅ Nouvelle fiche cliente créée :", prenom, nom);
            if (window.baaEventBus) {
              window.baaEventBus.emit("vente_realisee", {
                montant: parseFloat(total.replace("€","").replace(",",".")) || 0,
                clientNom: prenom + " " + nom,
                articles: articles
              });
            }
            afficherNotifCommande(prenom, nom, total, articles);
          });
        }
      }).catch(function(e) { console.log("Erreur carnet:", e); });
  }

  function afficherNotifCommande(prenom, nom, total, articles) {
    // Notification visuelle discrète en bas de l'écran
    var notif = document.createElement("div");
    notif.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:9999999;background:linear-gradient(135deg,#27AE60,#2ecc71);color:white;border-radius:14px;padding:12px 20px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;box-shadow:0 4px 20px rgba(0,0,0,0.3);text-align:center;animation:phenixFadeIn 0.4s ease;max-width:90%;";
    notif.innerHTML = "🛍️ Nouvelle commande de " + prenom + " " + nom + " — " + total + "<br><span style='font-size:11px;font-weight:normal;opacity:0.9;'>Fiche cliente mise à jour automatiquement ✅</span>";
    document.body.appendChild(notif);
    setTimeout(function() {
      notif.style.opacity = "0";
      notif.style.transition = "opacity 0.5s";
      setTimeout(function() { notif.remove(); }, 500);
    }, 5000);
  }

  initPontCommandes();
  console.log("✅ BAA Commandes → Carnet initialisé");
})();
