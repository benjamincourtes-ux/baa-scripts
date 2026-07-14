// BAA Virement Instantané
// Ajoute le champ lienVirement dans la config boutique
// et le bouton dans la vitrine

(function() {
  function initVirement() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(initVirement, 300); return; }

    // ===== ACADÉMIE : Ajouter champ dans la config boutique =====
    // On observe l'ouverture du panneau config
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.id === "baa-boutique-panel") {
            observerConfig(node);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true });

    // ===== VITRINE : Ajouter bouton virement dans le panier =====
    if (typeof boutique !== "undefined") {
      injecterBoutonVitrine();
    }
  }

  function observerConfig(panel) {
    var panelObserver = new MutationObserver(function() {
      // Chercher le champ PayPal pour y ajouter le champ virement
      var inputs = panel.querySelectorAll("input[placeholder*='PayPal'], input[placeholder*='paypal']");
      inputs.forEach(function(paypalInp) {
        if (paypalInp.dataset.virementAdded) return;
        paypalInp.dataset.virementAdded = "1";

        var user = firebase.auth().currentUser;
        if (!user) return;

        // Créer le champ lienVirement après PayPal
        var wrapper = document.createElement("div");
        wrapper.style.cssText = "margin-top:8px;";

        var lbl = document.createElement("p");
        lbl.style.cssText = "color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 4px;";
        lbl.textContent = "⚡ Lien virement instantané (Revolut, Lydia...)";

        var inp = document.createElement("input");
        inp.type = "url";
        inp.id = "baa-lien-virement";
        inp.placeholder = "Ex: https://revolut.me/tonpseudo";
        inp.style.cssText = "width:100%;padding:11px;border:1px solid #9F7AEA;border-radius:10px;font-size:13px;box-sizing:border-box;";
        inp.addEventListener("touchstart", function(e){e.stopPropagation();}, {passive:true});

        // Charger la valeur existante
        firebase.firestore().collection("boutiques").doc(user.uid).get().then(function(snap) {
          if (snap.exists && snap.data().lienVirement) {
            inp.value = snap.data().lienVirement;
          }
        });

        // Sauvegarder quand on quitte le champ
        inp.onblur = function() {
          if (inp.value.trim()) {
            firebase.firestore().collection("boutiques").doc(user.uid).update({
              lienVirement: inp.value.trim()
            }).then(function() {
              inp.style.borderColor = "#27AE60";
              setTimeout(function() { inp.style.borderColor = "#9F7AEA"; }, 2000);
            });
          }
        };

        wrapper.appendChild(lbl);
        wrapper.appendChild(inp);
        paypalInp.parentNode.insertBefore(wrapper, paypalInp.nextSibling);
      });

      // Aussi intercepter le bouton sauvegarder pour inclure lienVirement
      var saveBtn = panel.querySelector("button[id*='save-config'], button[id*='sauvegarder']");
      if (saveBtn && !saveBtn.dataset.virementHook) {
        saveBtn.dataset.virementHook = "1";
        var origOnclick = saveBtn.onclick;
        saveBtn.onclick = function() {
          var virInp = document.getElementById("baa-lien-virement");
          if (virInp) {
            var user = firebase.auth().currentUser;
            if (user) {
              firebase.firestore().collection("boutiques").doc(user.uid).update({
                lienVirement: virInp.value.trim()
              }).catch(function(){});
            }
          }
          if (origOnclick) origOnclick.apply(this, arguments);
        };
      }
    });
    panelObserver.observe(panel, { childList: true, subtree: true });
  }

  function injecterBoutonVitrine() {
    // Observer le panier pour y ajouter le bouton virement
    var panierObserver = new MutationObserver(function() {
      var panierBox = document.querySelector(".panier-box");
      if (!panierBox) return;
      if (document.getElementById("btn-virement-inst")) return;
      if (!boutique || !boutique.lienVirement) return;

      // Trouver le bouton commander
      var cmdBtn = panierBox.querySelector(".commander-btn");
      if (!cmdBtn) return;

      var btnVirement = document.createElement("a");
      btnVirement.id = "btn-virement-inst";
      btnVirement.href = boutique.lienVirement;
      btnVirement.target = "_blank";
      btnVirement.style.cssText = "display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:linear-gradient(135deg,#6B46C1,#9F7AEA);color:white;border:none;padding:14px;border-radius:12px;font-weight:bold;font-size:15px;cursor:pointer;text-decoration:none;margin-top:8px;box-sizing:border-box;touch-action:manipulation;";
      btnVirement.innerHTML = "⚡ Payer par virement instantané";

      cmdBtn.parentNode.insertBefore(btnVirement, cmdBtn.nextSibling);
    });
    panierObserver.observe(document.body, { childList: true, subtree: true });
  }

  initVirement();
  console.log("BAA Virement initialise");
})();
