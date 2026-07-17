// BAA Vitrine Email Fix — Réinjecte l'email VDI après sauvegarde commande
(function() {
  function init() {
    if (typeof firebase === "undefined" || !firebase.apps || !firebase.apps.length) {
      setTimeout(init, 500); return;
    }
    
    var db = firebase.firestore();
    var origAdd = db.collection("__test__").add; // on vérifie juste
    
    // Surveiller les nouvelles commandes dans Firestore
    // On intercepte via MutationObserver sur le DOM pour détecter le formulaire de commande
    
    var observer = new MutationObserver(function() {
      // Chercher le bouton "Valider et payer via PayPal"
      var valBtn = document.querySelector("button[style*='Valider']");
      var allBtns = document.querySelectorAll("button");
      allBtns.forEach(function(btn) {
        if ((btn.textContent.includes("Valider et payer") || btn.textContent.includes("Valider la commande")) && !btn.dataset.emailFixHook) {
          btn.dataset.emailFixHook = "1";
          var origOnclick = btn.onclick;
          btn.onclick = function() {
            // Intercepter après 3 secondes (laisser Firebase sauvegarder d'abord)
            setTimeout(function() {
              var nom = document.getElementById("coord-nom") ? document.getElementById("coord-nom").value.trim() : "";
              var prenom = document.getElementById("coord-prenom") ? document.getElementById("coord-prenom").value.trim() : "";
              var adresse = document.getElementById("coord-adresse") ? document.getElementById("coord-adresse").value.trim() : "";
              var cp = document.getElementById("coord-codepostal") ? document.getElementById("coord-codepostal").value.trim() : "";
              var ville = document.getElementById("coord-ville") ? document.getElementById("coord-ville").value.trim() : "";
              var tel = document.getElementById("coord-telephone") ? document.getElementById("coord-telephone").value.trim() : "";
              var email = document.getElementById("coord-email") ? document.getElementById("coord-email").value.trim() : "";
              
              if (!email || !nom) return; // Formulaire pas rempli
              
              var uid = new URLSearchParams(window.location.search).get("uid");
              if (!uid) return;
              
              firebase.firestore().collection("boutiques").doc(uid).get().then(function(snap) {
                if (!snap.exists) return;
                var b = snap.data();
                if (!b.emailVdi) return;
                
                // Récupérer la dernière commande en attente pour construire le détail
                firebase.firestore().collection("commandes_clients")
                  .where("boutiqueUid", "==", uid)
                  .where("clientEmail", "==", email)
                  .where("statut", "==", "en_attente")
                  .orderBy("date", "desc")
                  .limit(1)
                  .get().then(function(cmdSnap) {
                    var detail = "";
                    var total = "";
                    if (!cmdSnap.empty) {
                      var cmd = cmdSnap.docs[0].data();
                      detail = cmd.detail || "";
                      total = cmd.total || "";
                    }
                    
                    if (typeof emailjs !== "undefined") {
                      emailjs.send("service_wr9mlhk", "template_nkfnrnd", {
                        vdi_prenom: b.prenom || "Conseillère",
                        to_email: b.emailVdi,
                        client_nom: nom,
                        client_prenom: prenom,
                        client_adresse: adresse + ", " + cp + " " + ville,
                        client_tel: tel,
                        client_email: email,
                        commande_detail: detail,
                        total: total
                      }).then(function() {
                        console.log("BAA Email Fix: email VDI envoyé");
                      }).catch(function(e) {
                        console.log("BAA Email Fix: erreur email", e);
                      });
                    }
                  }).catch(function(){});
              }).catch(function(){});
            }, 3000);
            
            if (origOnclick) origOnclick.apply(this, arguments);
          };
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("BAA Vitrine Email Fix actif");
  }
  
  var tries = 0;
  function tryInit() {
    tries++;
    if (tries > 20) return;
    if (typeof firebase !== "undefined" && firebase.apps && firebase.apps.length) {
      init();
    } else {
      setTimeout(tryInit, 500);
    }
  }
  tryInit();
})();
