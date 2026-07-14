// BAA Boutique Edit Fix — Patch renderAjouterProduit pour mode édition
// Ce script surcharge renderAjouterProduit pour gérer le mode modification

(function() {
  function waitForBoutique() {
    if (typeof openGestionBoutique === "undefined") { setTimeout(waitForBoutique, 500); return; }
    
    // Observer l'ouverture du panneau boutique
    var observer = new MutationObserver(function() {
      var panel = document.getElementById("baa-boutique-panel");
      if (!panel || panel.__editPatchApplied) return;
      panel.__editPatchApplied = true;
      patcherBoutiquePanel(panel);
    });
    observer.observe(document.body, { childList: true });
  }

  function patcherBoutiquePanel(panel) {
    // Observer les clics sur les boutons ✏️
    panel.addEventListener("click", function(e) {
      var btn = e.target.closest && e.target.closest("[data-edit-custom]");
      if (!btn) return;
      e.stopImmediatePropagation();
      var idx = parseInt(btn.getAttribute("data-edit-custom"));
      ouvrirEditionCustom(idx);
    }, true);
  }

  function ouvrirEditionCustom(index) {
    if (document.getElementById("baa-edit-modal")) return;
    var user = firebase.auth().currentUser; if (!user) return;
    var db = firebase.firestore();

    db.collection("boutiques").doc(user.uid).get().then(function(snap) {
      if (!snap.exists) return;
      var b = snap.data();
      var prod = (b.produitsCustom || [])[index];
      if (!prod) return;

      var modal = document.createElement("div");
      modal.id = "baa-edit-modal";
      modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999999;display:flex;justify-content:center;align-items:flex-start;overflow-y:auto;font-family:Arial,sans-serif;";
      modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

      var box = document.createElement("div");
      box.style.cssText = "background:#f8f3ee;width:90%;max-width:500px;border-radius:20px;padding:24px;margin:20px auto;";
      box.onclick = function(e) { e.stopPropagation(); };

      box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;'><h3 style='color:#8b735d;margin:0;font-size:16px;'>✏️ Modifier le produit</h3><button id='close-edit' style='background:none;border:none;font-size:22px;color:#8b735d;cursor:pointer;'>✕</button></div>";

      var photoUrl = prod.photo || "";

      // Champs
      [
        { label: "Nom *", id: "em-nom", type: "text", val: prod.nom || "" },
        { label: "Prix (€) *", id: "em-prix", type: "number", val: prod.prix || "" },
      ].forEach(function(f) {
        var lbl = document.createElement("p"); lbl.style.cssText = "color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 4px;"; lbl.textContent = f.label; box.appendChild(lbl);
        var inp = document.createElement("input"); inp.type = f.type; inp.id = f.id; inp.value = f.val;
        if (f.type === "number") inp.step = "0.01";
        inp.style.cssText = "width:100%;padding:11px;border:1px solid #e8d4b0;border-radius:10px;font-size:13px;box-sizing:border-box;margin-bottom:10px;";
        inp.addEventListener("touchstart", function(e){e.stopPropagation();}, {passive:true});
        box.appendChild(inp);
      });

      // Description
      var descLbl = document.createElement("p"); descLbl.style.cssText = "color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 4px;"; descLbl.textContent = "Description"; box.appendChild(descLbl);
      var descInp = document.createElement("textarea"); descInp.id = "em-desc"; descInp.value = prod.description || ""; descInp.rows = 3;
      descInp.style.cssText = "width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:10px;font-size:13px;box-sizing:border-box;margin-bottom:10px;resize:none;";
      descInp.addEventListener("touchstart", function(e){e.stopPropagation();}, {passive:true});
      box.appendChild(descInp);

      // Ingrédients
      var ingLbl = document.createElement("p"); ingLbl.style.cssText = "color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 4px;"; ingLbl.textContent = "Ingrédients"; box.appendChild(ingLbl);
      var ingInp = document.createElement("textarea"); ingInp.id = "em-ingr"; ingInp.value = prod.ingredients || ""; ingInp.rows = 2;
      ingInp.style.cssText = "width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:10px;font-size:13px;box-sizing:border-box;margin-bottom:10px;resize:none;";
      ingInp.addEventListener("touchstart", function(e){e.stopPropagation();}, {passive:true});
      box.appendChild(ingInp);

      // Photo
      var photoLbl = document.createElement("p"); photoLbl.style.cssText = "color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 6px;"; photoLbl.textContent = "Photo"; box.appendChild(photoLbl);
      var photoRow = document.createElement("div"); photoRow.style.cssText = "display:flex;gap:8px;align-items:center;margin-bottom:16px;";
      if (photoUrl) {
        var imgEl = document.createElement("img"); imgEl.src = photoUrl; imgEl.style.cssText = "width:50px;height:50px;object-fit:cover;border-radius:8px;border:1px solid #e8d4b0;flex-shrink:0;";
        photoRow.appendChild(imgEl);
      }
      var fileInp = document.createElement("input"); fileInp.type = "file"; fileInp.accept = "image/*"; fileInp.style.display = "none"; box.appendChild(fileInp);
      var photoBtn = document.createElement("button"); photoBtn.textContent = photoUrl ? "🔄 Changer" : "📷 Ajouter"; photoBtn.style.cssText = "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:12px;touch-action:manipulation;";
      photoBtn.onclick = function() { fileInp.click(); };
      var photoStatus = document.createElement("span"); photoStatus.style.cssText = "font-size:11px;color:#999;";
      photoRow.appendChild(photoBtn); photoRow.appendChild(photoStatus); box.appendChild(photoRow);

      fileInp.onchange = async function() {
        var file = this.files[0]; if (!file) return;
        photoStatus.textContent = "Upload..."; photoBtn.disabled = true;
        try {
          var fd = new FormData(); fd.append("file", file); fd.append("upload_preset", "baa_avatars"); fd.append("folder", "boutique_custom");
          var r = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload", { method: "POST", body: fd });
          var data = await r.json();
          if (data.secure_url) { photoUrl = data.secure_url; photoStatus.textContent = "✅"; photoBtn.textContent = "🔄 Changer"; }
          else { photoStatus.textContent = "❌"; }
        } catch(e) { photoStatus.textContent = "❌"; }
        photoBtn.disabled = false;
      };

      // Bouton sauvegarder
      var saveBtn = document.createElement("button");
      saveBtn.textContent = "💾 Sauvegarder les modifications";
      saveBtn.style.cssText = "width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:14px;border-radius:12px;font-weight:bold;font-size:14px;cursor:pointer;touch-action:manipulation;margin-bottom:8px;";

      saveBtn.onclick = function() {
        var nom = document.getElementById("em-nom").value.trim();
        var prix = parseFloat(document.getElementById("em-prix").value);
        if (!nom || !prix) { alert("Nom et prix obligatoires."); return; }
        saveBtn.disabled = true; saveBtn.textContent = "⏳ Sauvegarde...";

        db.collection("boutiques").doc(user.uid).get().then(function(freshSnap) {
          var freshData = freshSnap.exists ? freshSnap.data() : {};
          var prods = (freshData.produitsCustom || []).slice();
          prods[index] = {
            nom: nom, prix: prix,
            description: document.getElementById("em-desc").value.trim(),
            ingredients: document.getElementById("em-ingr").value.trim(),
            photo: photoUrl,
            categorie: prod.categorie || "custom"
          };
          db.collection("boutiques").doc(user.uid).set({ produitsCustom: prods }, { merge: true }).then(function() {
            modal.remove();
            alert("✅ Produit modifié !");
            // Recharger la boutique
            var panel = document.getElementById("baa-boutique-panel");
            if (panel) panel.remove();
            setTimeout(function() {
              openGestionBoutique();
              setTimeout(function() {
                var btns = document.querySelectorAll("#baa-boutique-panel button");
                btns.forEach(function(b) { if (b.textContent.includes("Gérer mes produits")) b.click(); });
              }, 600);
            }, 200);
          }).catch(function(e) {
            saveBtn.disabled = false; saveBtn.textContent = "💾 Sauvegarder les modifications";
            alert("Erreur : " + e.message);
          });
        });
      };

      saveBtn.addEventListener("touchend", function(e) { e.preventDefault(); saveBtn.onclick(); }, { passive: false });
      box.appendChild(saveBtn);

      var cancelBtn = document.createElement("button");
      cancelBtn.textContent = "← Annuler";
      cancelBtn.style.cssText = "background:none;border:none;color:#8b735d;font-size:13px;cursor:pointer;width:100%;";
      cancelBtn.onclick = function() { modal.remove(); };
      box.appendChild(cancelBtn);

      modal.appendChild(box);
      document.body.appendChild(modal);
      document.getElementById("close-edit").onclick = function() { modal.remove(); };
    });
  }

  // Ajouter data-edit-custom sur les boutons ✏️ existants
  var domObserver = new MutationObserver(function() {
    var editBtns = document.querySelectorAll("#baa-boutique-panel button");
    editBtns.forEach(function(btn) {
      if (btn.textContent === "✏️" && !btn.hasAttribute("data-edit-custom")) {
        // Trouver l'index en comptant les boutons ✏️ précédents
        var allEditBtns = Array.from(document.querySelectorAll("#baa-boutique-panel button[data-edit-custom]"));
        var siblings = Array.from(document.querySelectorAll("#baa-boutique-panel button")).filter(function(b) { return b.textContent === "✏️" && !b.hasAttribute("data-edit-custom"); });
        // Compter combien de ✏️ avec data-edit-custom existent déjà
        var idx = document.querySelectorAll("#baa-boutique-panel button[data-edit-custom]").length;
        btn.setAttribute("data-edit-custom", idx);
      }
    });
  });
  domObserver.observe(document.body, { childList: true, subtree: true });

  waitForBoutique();
  console.log("BAA Edit Fix initialise");
})();
