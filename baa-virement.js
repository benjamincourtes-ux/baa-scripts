// BAA Virement Instantané
// Ajoute le champ lienVirement dans la config boutique (académie)
// et le bouton dans la vitrine

(function() {
  function initVirement() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(initVirement, 300); return; }

    var isVitrine = typeof boutique !== "undefined" || window.location.hostname.indexOf("vitrine") > -1 || window.location.hostname.indexOf("vercel") > -1;

    if (isVitrine) {
      // Sur la vitrine — observer le panier
      observerPanierVitrine();
    } else {
      // Sur l'académie — ajouter champ dans config boutique
      observerConfigAcademie();
    }
  }

  // ===== VITRINE =====
  function observerPanierVitrine() {
    var observer = new MutationObserver(function() {
      var panierBox = document.querySelector(".panier-box");
      if (!panierBox) return;
      if (document.getElementById("btn-virement-inst")) return;

      // Récupérer le lienVirement depuis boutique ou Firebase
      var uid = new URLSearchParams(window.location.search).get("uid");
      if (!uid) return;

      firebase.firestore().collection("boutiques").doc(uid).get().then(function(snap) {
        if (!snap.exists || !snap.data().lienVirement) return;
        var lien = snap.data().lienVirement;

        var cmdBtn = panierBox.querySelector(".commander-btn");
        if (!cmdBtn) return;

        var btnVirement = document.createElement("a");
        btnVirement.id = "btn-virement-inst";
        btnVirement.href = lien;
        btnVirement.target = "_blank";
        btnVirement.style.cssText = "display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:linear-gradient(135deg,#6B46C1,#9F7AEA);color:white;padding:14px;border-radius:12px;font-weight:bold;font-size:15px;cursor:pointer;text-decoration:none;margin-top:8px;box-sizing:border-box;touch-action:manipulation;";
        btnVirement.innerHTML = "⚡ Payer par virement instantané";
        cmdBtn.parentNode.insertBefore(btnVirement, cmdBtn.nextSibling);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ===== ACADÉMIE =====
  function observerConfigAcademie() {
    var observer = new MutationObserver(function() {
      var paypalInps = document.querySelectorAll("input[placeholder*='PayPal'], input[placeholder*='paypal'], input[placeholder*='Paypal']");
      paypalInps.forEach(function(inp) {
        if (inp.dataset.virementDone) return;
        inp.dataset.virementDone = "1";

        var user = firebase.auth().currentUser;
        if (!user) return;

        var wrapper = document.createElement("div"); wrapper.style.cssText = "margin-top:10px;";
        var lbl = document.createElement("p"); lbl.style.cssText = "color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 4px;"; lbl.textContent = "⚡ Lien virement instantané (Revolut, Lydia...)";
        var virInp = document.createElement("input"); virInp.type = "url"; virInp.id = "baa-lien-virement"; virInp.placeholder = "Ex: https://revolut.me/tonpseudo"; virInp.style.cssText = "width:100%;padding:11px;border:1.5px solid #9F7AEA;border-radius:10px;font-size:13px;box-sizing:border-box;";
        virInp.addEventListener("touchstart", function(e){e.stopPropagation();}, {passive:true});

        firebase.firestore().collection("boutiques").doc(user.uid).get().then(function(snap) {
          if (snap.exists && snap.data().lienVirement) virInp.value = snap.data().lienVirement;
        });

        virInp.onblur = function() {
          if (virInp.value.trim()) {
            firebase.firestore().collection("boutiques").doc(user.uid).set({ lienVirement: virInp.value.trim() }, { merge: true }).then(function() {
              virInp.style.borderColor = "#27AE60";
              setTimeout(function() { virInp.style.borderColor = "#9F7AEA"; }, 2000);
            });
          }
        };

        wrapper.appendChild(lbl); wrapper.appendChild(virInp);
        inp.parentNode.insertBefore(wrapper, inp.nextSibling);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "complete") { setTimeout(initVirement, 1000); }
  else { window.addEventListener("load", function() { setTimeout(initVirement, 1000); }); }
  console.log("BAA Virement initialise");
})();
