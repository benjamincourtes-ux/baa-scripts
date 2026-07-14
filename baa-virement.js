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

          var btn = document.createElement("button");
          btn.id = "btn-virement-inst";
          btn.style.cssText = "display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:linear-gradient(135deg,#6B46C1,#9F7AEA);color:white;padding:14px;border-radius:12px;font-weight:bold;font-size:15px;cursor:pointer;text-decoration:none;margin-top:8px;box-sizing:border-box;touch-action:manipulation;border:none;";
          btn.innerHTML = "⚡ Payer par virement instantané";
          btn.onclick = function() {
            // Calculer le total du panier
            var total = 0;
            var lignes = document.querySelectorAll(".panier-item");
            var recap = [];
            lignes.forEach(function(item) {
              var nom = item.querySelector(".produit-nom, [style*='font-weight:bold']");
              var prix = item.querySelector(".produit-prix, [style*='c9a86a']");
              if (nom && prix) recap.push(nom.textContent + " — " + prix.textContent);
            });
            // Chercher le total affiché
            var totalEl = document.querySelector("[id*='total'], .panier-total, [style*='font-size:18px']");
            var totalTexte = totalEl ? totalEl.textContent : "";

            // Popup récapitulatif
            var popup = document.createElement("div");
            popup.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:99999;display:flex;justify-content:center;align-items:center;padding:20px;font-family:Arial,sans-serif;";
            popup.innerHTML = "<div style='background:white;border-radius:20px;padding:24px;width:100%;max-width:400px;'>" +
              "<div style='text-align:center;margin-bottom:16px;'>" +
              "<p style='font-size:32px;margin-bottom:8px;'>⚡</p>" +
              "<h3 style='color:#6B46C1;font-size:17px;margin:0 0 4px;'>Paiement par virement</h3>" +
              "<p style='color:#999;font-size:12px;margin:0;'>Revolut / Lydia / Autre</p>" +
              "</div>" +
              "<div style='background:#f8f3ee;border-radius:12px;padding:14px;margin-bottom:16px;'>" +
              "<p style='color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 8px;'>📋 RAPPEL DE TON MONTANT EXACT :</p>" +
              "<p style='color:#3a3a3a;font-size:22px;font-weight:bold;margin:0;text-align:center;'>" + (totalTexte || "Voir le récapitulatif") + "</p>" +
              "</div>" +
              "<div style='background:#fff3cd;border:1px solid #ffc107;border-radius:10px;padding:12px;margin-bottom:16px;'>" +
              "<p style='color:#856404;font-size:12px;margin:0;line-height:1.5;'>⚠️ <strong>Important :</strong> Indique bien ce montant exact lors de ton virement. Ajoute en message : <strong>\"Commande Mihi\"</strong></p>" +
              "</div>" +
              "<div style='display:flex;gap:8px;'>" +
              "<button id='popup-annuler' style='flex:1;background:#f8f3ee;color:#8b735d;border:1px solid #e8d4b0;padding:12px;border-radius:10px;font-size:14px;cursor:pointer;touch-action:manipulation;'>Annuler</button>" +
              "<a id='popup-virer' href='" + lienVirement + "' target='_blank' style='flex:2;background:linear-gradient(135deg,#6B46C1,#9F7AEA);color:white;padding:12px;border-radius:10px;font-size:14px;font-weight:bold;text-decoration:none;text-align:center;display:flex;align-items:center;justify-content:center;touch-action:manipulation;'>Aller sur Revolut ›</a>" +
              "</div>" +
              "</div>";
            document.body.appendChild(popup);
            document.getElementById("popup-annuler").onclick = function() { popup.remove(); };
            popup.onclick = function(e) { if (e.target === popup) popup.remove(); };
          };
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
