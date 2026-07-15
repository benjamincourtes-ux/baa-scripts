// BAA Boutique Promo Custom — Ajoute le champ prix promo dans les produits personnalisés
(function() {
  function init() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(init, 300); return; }

    var observer = new MutationObserver(function() {
      var panel = document.getElementById("baa-boutique-panel");
      if (!panel) return;
      var panelObs = new MutationObserver(function() {
        injecterChampPromo(panel);
      });
      panelObs.observe(panel, { childList: true, subtree: true });
      injecterChampPromo(panel);
    });
    observer.observe(document.body, { childList: true });
  }

  function injecterChampPromo(panel) {
    // Trouver le bouton "Ajouter ce produit" ou "Modifier le produit"
    var formBtn = null;
    panel.querySelectorAll("button").forEach(function(btn) {
      if (btn.textContent.trim() === "✅ Ajouter ce produit" || btn.textContent.trim().includes("Modifier le produit")) {
        formBtn = btn;
      }
    });
    if (!formBtn) return;

    // Remonter pour trouver le conteneur du formulaire
    var container = panel;

    // Chercher le champ VIP le plus proche du bouton sauvegarder
    // On cherche tous les champs number dans le panel et on prend celui juste avant le bouton
    var allNumbers = Array.from(panel.querySelectorAll("input[type='number']"));
    var vipInp = null;
    
    // Le champ VIP dans le formulaire custom a placeholder "Ex: 19.90" ou "Prix VIP (ex: 19.90)"
    allNumbers.forEach(function(inp) {
      if ((inp.placeholder === "Ex: 19.90" || inp.placeholder === "Prix VIP (ex: 19.90)") && !inp.dataset.promoAdded) {
        // Vérifier que ce champ est proche du bouton sauvegarder
        // On vérifie si le bouton est dans le même parent ou parent proche
        var p = inp;
        for (var i = 0; i < 10; i++) {
          p = p.parentElement;
          if (!p) break;
          if (p.querySelector && p.querySelector("button") === formBtn) {
            vipInp = inp;
            break;
          }
        }
      }
    });

    // Si pas trouvé avec la méthode précise, prendre le dernier champ VIP non taggué
    if (!vipInp) {
      var vipInputs = panel.querySelectorAll("input[placeholder='Ex: 19.90']:not([data-promo-added]), input[placeholder='Prix VIP (ex: 19.90)']:not([data-promo-added])");
      if (vipInputs.length > 0) {
        vipInp = vipInputs[vipInputs.length - 1];
      }
    }

    if (!vipInp) return;
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
    if (vipLabel && vipLabel.tagName === "P") {
      vipLabel.parentNode.insertBefore(promoWrapper, vipLabel);
    } else {
      vipInp.parentNode.insertBefore(promoWrapper, vipInp);
    }

    // Intercepter le bouton sauvegarder
    if (!formBtn.dataset.promoHook) {
      formBtn.dataset.promoHook = "1";
      var origOnclick = formBtn.onclick;
      formBtn.onclick = function() {
        var promoVal = parseFloat(promoInp.value);
        if (promoVal > 0) {
          var user = firebase.auth().currentUser;
          if (user) {
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
            }, 2000);
          }
        }
        if (origOnclick) origOnclick.apply(this, arguments);
      };
      formBtn.addEventListener("touchend", function(e) { e.preventDefault(); formBtn.onclick(); }, { passive: false });
    }
  }

  init();
  console.log("BAA Promo Custom initialise");
})();
