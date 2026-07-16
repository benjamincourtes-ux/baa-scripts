// BAA Boutique Tel — Ajoute le champ téléphone dans la config boutique
(function() {
  function init() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(init, 300); return; }

    var observer = new MutationObserver(function() {
      var panel = document.getElementById("baa-boutique-panel");
      if (!panel) return;

      var panelObs = new MutationObserver(function() {
        injecterChampTel(panel);
      });
      panelObs.observe(panel, { childList: true, subtree: true });
      injecterChampTel(panel);
    });
    observer.observe(document.body, { childList: true });
  }

  function injecterChampTel(panel) {
    // Chercher le champ email VDI
    var emailInps = panel.querySelectorAll("input[placeholder*='email'][placeholder*='commandes'], input[placeholder*='recevoir les commandes']");
    if (emailInps.length === 0) {
      // Chercher par type email
      emailInps = panel.querySelectorAll("input[type='email']");
    }
    emailInps.forEach(function(emailInp) {
      if (emailInp.dataset.telAdded) return;
      emailInp.dataset.telAdded = "1";

      var user = firebase.auth().currentUser; if (!user) return;

      // Créer le champ téléphone
      var wrapper = document.createElement("div");
      var lbl = document.createElement("p");
      lbl.style.cssText = "color:#8b735d;font-size:13px;font-weight:bold;margin:0 0 4px;";
      lbl.textContent = "📱 Ton numéro WhatsApp (pour le tunnel de recrutement)";

      var telInp = document.createElement("input");
      telInp.type = "tel";
      telInp.id = "baa-tel-whatsapp";
      telInp.placeholder = "Ex: 06 12 34 56 78";
      telInp.style.cssText = "width:100%;padding:12px;border:1px solid #e8d4b0;border-radius:10px;font-size:14px;box-sizing:border-box;margin-bottom:10px;";
      telInp.addEventListener("touchstart", function(e){e.stopPropagation();}, {passive:true});

      // Charger la valeur existante
      firebase.firestore().collection("boutiques").doc(user.uid).get().then(function(snap) {
        if (snap.exists && snap.data().tel) telInp.value = snap.data().tel;
      });

      wrapper.appendChild(lbl);
      wrapper.appendChild(telInp);
      emailInp.parentNode.insertBefore(wrapper, emailInp.nextSibling);

      // Intercepter le bouton sauvegarder pour inclure le téléphone
      var saveBtn = panel.querySelector("button[style*='Sauvegarder']");
      var allBtns = panel.querySelectorAll("button");
      allBtns.forEach(function(btn) {
        if (btn.textContent.includes("Sauvegarder") && btn.textContent.includes("💾") && !btn.dataset.telHook) {
          btn.dataset.telHook = "1";
          var origOnclick = btn.onclick;
          btn.onclick = function() {
            var telVal = document.getElementById("baa-tel-whatsapp");
            if (telVal && telVal.value.trim()) {
              firebase.firestore().collection("boutiques").doc(user.uid).set(
                { tel: telVal.value.trim() },
                { merge: true }
              );
            }
            if (origOnclick) origOnclick.apply(this, arguments);
          };
        }
      });
    });
  }

  init();
  console.log("BAA Boutique Tel initialise");
})();
