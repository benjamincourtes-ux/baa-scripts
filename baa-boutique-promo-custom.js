// BAA Boutique Promo Custom — Ajoute le champ prix promo dans les produits personnalisés
(function() {
  function init() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(init, 300); return; }

    var observer = new MutationObserver(function() {
      var panel = document.getElementById("baa-boutique-panel");
      if (!panel) return;

      // Observer les changements dans le panneau
      var panelObs = new MutationObserver(function() {
        injecterChampPromo(panel);
      });
      panelObs.observe(panel, { childList: true, subtree: true });
      injecterChampPromo(panel);
    });
    observer.observe(document.body, { childList: true });
  }

  function injecterChampPromo(panel) {
    // Chercher le champ prix VIP dans renderAjouterProduit
    var vipInputs = panel.querySelectorAll("input[placeholder='Ex: 19.90'], input[placeholder='Prix VIP (ex: 19.90)']");
    vipInputs.forEach(function(vipInp) {
      if (vipInp.dataset.promoAdded) return;
      vipInp.dataset.promoAdded = "1";

      // Créer le champ promo juste avant le champ VIP
      var promoWrapper = document.createElement("div");

      var promoLbl = document.createElement("p");
      promoLbl.style.cssText = "color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 4px;";
      promoLbl.textContent = "🏷️ Prix promo (optionnel)";

      var promoInp = document.createElement("input");
      promoInp.type = "number";
      promoInp.step = "0.01";
      promoInp.placeholder = "Ex: 12.50";
      promoInp.id = "baa-promo-custom-inp";
      promoInp.style.cssText = "width:100%;padding:11px;border:1px solid #e74c3c;border-radius:10px;font-size:13px;box-sizing:border-box;margin-bottom:10px;";
      promoInp.addEventListener("touchstart", function(e) { e.stopPropagation(); }, { passive: true });

      promoWrapper.appendChild(promoLbl);
      promoWrapper.appendChild(promoInp);

      // Insérer avant le label prix VIP
      var vipLabel = vipInp.previousElementSibling;
      if (vipLabel) {
        vipLabel.parentNode.insertBefore(promoWrapper, vipLabel);
      }

      // Intercepter le bouton sauvegarder pour inclure le prix promo
      var saveBtn = panel.querySelector("button[style*='Ajouter ce produit'], button");
      // Chercher le bouton qui contient "Ajouter" ou "Modifier"
      var allBtns = panel.querySelectorAll("button");
      allBtns.forEach(function(btn) {
        if ((btn.textContent.includes("Ajouter ce produit") || btn.textContent.includes("Modifier le produit")) && !btn.dataset.promoHook) {
          btn.dataset.promoHook = "1";
          var origOnclick = btn.onclick;
          btn.onclick = function() {
            // Sauvegarder le prix promo dans Firebase après la sauvegarde normale
            var promoVal = parseFloat(document.getElementById("baa-promo-custom-inp") && document.getElementById("baa-promo-custom-inp").value);
            if (promoVal > 0) {
              var user = firebase.auth().currentUser;
              if (user) {
                // On sauvegarde après un délai pour laisser la fonction principale sauvegarder d'abord
                setTimeout(function() {
                  firebase.firestore().collection("boutiques").doc(user.uid).get().then(function(snap) {
                    if (!snap.exists) return;
                    var b = snap.data();
                    var prods = b.produitsCustom || [];
                    var lastIdx = prods.length - 1;
                    if (lastIdx < 0) return;
                    var lastProd = prods[lastIdx];
                    var newKey = "custom_" + lastIdx + "_" + (lastProd.nom || "").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20);
                    var upd = {};
                    upd["prixPromo." + newKey] = promoVal;
                    firebase.firestore().collection("boutiques").doc(user.uid).update(upd);
                  });
                }, 1500);
              }
            }
            if (origOnclick) origOnclick.apply(this, arguments);
          };
        }
      });
    });
  }

  init();
  console.log("BAA Promo Custom initialise");
})();
