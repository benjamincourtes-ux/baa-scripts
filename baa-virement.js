// BAA Virement Instantané
(function() {
  function waitFirebase(cb) {
    if (typeof firebase !== "undefined" && firebase.apps && firebase.apps.length) { cb(); }
    else { setTimeout(function(){ waitFirebase(cb); }, 300); }
  }

  waitFirebase(function() {
    var isVitrine = document.querySelector(".panier-btn") !== null || window.location.href.indexOf("vitrine") > -1 || window.location.href.indexOf("vercel.app") > -1;

    if (isVitrine) {
      // ===== SUR LA VITRINE =====
      var uid = new URLSearchParams(window.location.search).get("uid");
      if (!uid) return;

      // Charger le lien virement
      firebase.firestore().collection("boutiques").doc(uid).get().then(function(snap) {
        if (!snap.exists || !snap.data().lienVirement) return;
        var lienVirement = snap.data().lienVirement;

        // Observer le panier
        var observer = new MutationObserver(function() {
          var cmdBtn = document.querySelector(".commander-btn");
          if (!cmdBtn) return;
          if (document.getElementById("btn-virement-inst")) return;

          var btn = document.createElement("a");
          btn.id = "btn-virement-inst";
          btn.href = lienVirement;
          btn.target = "_blank";
          btn.style.cssText = "display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:linear-gradient(135deg,#6B46C1,#9F7AEA);color:white;padding:14px;border-radius:12px;font-weight:bold;font-size:15px;cursor:pointer;text-decoration:none;margin-top:8px;box-sizing:border-box;touch-action:manipulation;";
          btn.innerHTML = "⚡ Payer par virement instantané";
          cmdBtn.parentNode.insertBefore(btn, cmdBtn.nextSibling);
        });
        observer.observe(document.body, { childList: true, subtree: true });
      });

    } else {
      // ===== SUR L'ACADÉMIE — champ config boutique =====
      var observer = new MutationObserver(function() {
        var paypalInps = document.querySelectorAll("input[placeholder*='PayPal'], input[placeholder*='paypal'], input[placeholder*='Paypal']");
        paypalInps.forEach(function(inp) {
          if (inp.dataset.virementDone) return;
          inp.dataset.virementDone = "1";
          var user = firebase.auth().currentUser;
          if (!user) return;

          var wrapper = document.createElement("div");
          wrapper.style.cssText = "margin-top:10px;";
          var lbl = document.createElement("p");
          lbl.style.cssText = "color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 4px;";
          lbl.textContent = "⚡ Lien virement instantané (Revolut, Lydia...)";
          var virInp = document.createElement("input");
          virInp.type = "url";
          virInp.id = "baa-lien-virement";
          virInp.placeholder = "Ex: https://revolut.me/tonpseudo";
          virInp.style.cssText = "width:100%;padding:11px;border:1.5px solid #9F7AEA;border-radius:10px;font-size:13px;box-sizing:border-box;";
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

          wrapper.appendChild(lbl);
          wrapper.appendChild(virInp);
          inp.parentNode.insertBefore(wrapper, inp.nextSibling);
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });

  console.log("BAA Virement initialise");
})();
