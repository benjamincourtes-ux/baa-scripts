// BAA Boutique Edit Custom — Ajoute le bouton modifier sur les produits personnalisés
(function() {
  function initEditCustom() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(initEditCustom, 300); return; }

    // Observer l'ouverture du panneau boutique
    var observer = new MutationObserver(function() {
      var panel = document.getElementById("baa-boutique-panel");
      if (!panel) return;

      // Observer les changements dans le panneau
      var panelObserver = new MutationObserver(function() {
        injecterBoutonsModifier(panel);
      });
      panelObserver.observe(panel, { childList: true, subtree: true });
      injecterBoutonsModifier(panel);
    });
    observer.observe(document.body, { childList: true });
  }

  function injecterBoutonsModifier(panel) {
    // Trouver la section produits custom (le header bleu)
    var customHeader = panel.querySelector("[style*='#f0f4ff'][style*='border']");
    if (!customHeader) return;

    // Trouver tous les boutons poubelle dans la section custom
    var customSection = customHeader.parentElement;
    if (!customSection) return;

    var deleteButtons = customSection.querySelectorAll("button[style*='#e74c3c']");
    deleteButtons.forEach(function(delBtn) {
      // Vérifier si on n'a pas déjà ajouté le bouton modifier
      if (delBtn.previousSibling && delBtn.previousSibling.dataset && delBtn.previousSibling.dataset.editCustom) return;

      var editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.dataset.editCustom = "1";
      editBtn.style.cssText = "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:3px 8px;border-radius:6px;cursor:pointer;font-size:11px;touch-action:manipulation;margin-right:4px;";

      editBtn.onclick = function(e) {
        e.stopPropagation();
        // Trouver l'index du produit — on cherche la ligne parente
        var row = delBtn.parentElement;
        var allRows = customSection.querySelectorAll("[style*='display:flex'][style*='cursor:pointer']");
        var index = -1;
        allRows.forEach(function(r, i) { if (r === row) index = i; });

        if (index === -1) return;

        // Récupérer les données du produit depuis Firebase
        var user = firebase.auth().currentUser; if (!user) return;
        firebase.firestore().collection("boutiques").doc(user.uid).get().then(function(snap) {
          if (!snap.exists) return;
          var b = snap.data();
          var prods = b.produitsCustom || [];
          var prod = prods[index];
          if (!prod) return;

          ouvrirModalModifier(prod, index, user.uid, b);
        });
      };

      editBtn.addEventListener("touchend", function(e) {
        e.preventDefault();
        editBtn.onclick(e);
      }, { passive: false });

      delBtn.parentNode.insertBefore(editBtn, delBtn);
    });
  }

  function ouvrirModalModifier(prod, index, uid, b) {
    if (document.getElementById("baa-edit-custom-modal")) return;

    var modal = document.createElement("div");
    modal.id = "baa-edit-custom-modal";
    modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999999;display:flex;justify-content:center;align-items:flex-start;overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:Arial,sans-serif;";
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

    var box = document.createElement("div");
    box.style.cssText = "background:#f8f3ee;width:90%;max-width:500px;border-radius:20px;padding:24px;margin:20px auto;";
    box.onclick = function(e) { e.stopPropagation(); };

    box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;'><h3 style='color:#8b735d;margin:0;font-size:16px;'>✏️ Modifier le produit</h3><button id='close-edit-custom' style='background:none;border:none;font-size:22px;color:#8b735d;cursor:pointer;'>✕</button></div>";

    // Champs
    var fields = [
      { label: "Nom du produit *", id: "edit-nom", type: "text", value: prod.nom || "" },
      { label: "Prix (€) *", id: "edit-prix", type: "number", value: prod.prix || "" },
      { label: "Description", id: "edit-desc", type: "textarea", value: prod.description || "" },
      { label: "Ingrédients", id: "edit-ingr", type: "textarea", value: prod.ingredients || "" }
    ];

    fields.forEach(function(f) {
      var lbl = document.createElement("p");
      lbl.style.cssText = "color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 4px;";
      lbl.textContent = f.label;
      box.appendChild(lbl);

      var inp;
      if (f.type === "textarea") {
        inp = document.createElement("textarea");
        inp.rows = 3;
        inp.style.cssText = "width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:10px;font-size:13px;box-sizing:border-box;margin-bottom:10px;resize:none;";
      } else {
        inp = document.createElement("input");
        inp.type = f.type;
        if (f.type === "number") inp.step = "0.01";
        inp.style.cssText = "width:100%;padding:11px;border:1px solid #e8d4b0;border-radius:10px;font-size:13px;box-sizing:border-box;margin-bottom:10px;";
      }
      inp.id = f.id;
      inp.value = f.value;
      inp.addEventListener("touchstart", function(e) { e.stopPropagation(); }, { passive: true });
      box.appendChild(inp);
    });

    // Photo actuelle
    var photoUrl = prod.photo || "";
    var photoSection = document.createElement("div");
    photoSection.style.cssText = "margin-bottom:16px;";
    var photoLbl = document.createElement("p");
    photoLbl.style.cssText = "color:#8b735d;font-size:12px;font-weight:bold;margin:0 0 6px;";
    photoLbl.textContent = "Photo";
    photoSection.appendChild(photoLbl);

    var photoRow = document.createElement("div");
    photoRow.style.cssText = "display:flex;gap:8px;align-items:center;";

    if (photoUrl) {
      var imgPrev = document.createElement("img");
      imgPrev.src = photoUrl;
      imgPrev.style.cssText = "width:50px;height:50px;object-fit:cover;border-radius:8px;border:1px solid #e8d4b0;flex-shrink:0;";
      photoRow.appendChild(imgPrev);
    }

    var fileInp = document.createElement("input");
    fileInp.type = "file"; fileInp.accept = "image/*"; fileInp.style.display = "none";
    photoSection.appendChild(fileInp);

    var photoBtn = document.createElement("button");
    photoBtn.textContent = photoUrl ? "🔄 Changer la photo" : "📷 Ajouter une photo";
    photoBtn.style.cssText = "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:12px;touch-action:manipulation;";
    photoBtn.onclick = function() { fileInp.click(); };
    photoRow.appendChild(photoBtn);

    var photoStatus = document.createElement("span");
    photoStatus.style.cssText = "font-size:11px;color:#999;";
    photoRow.appendChild(photoStatus);
    photoSection.appendChild(photoRow);
    box.appendChild(photoSection);

    fileInp.onchange = async function() {
      var file = this.files[0]; if (!file) return;
      photoStatus.textContent = "Upload..."; photoBtn.disabled = true;
      try {
        var fd = new FormData();
        fd.append("file", file); fd.append("upload_preset", "baa_avatars"); fd.append("folder", "boutique_custom");
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
      var nom = document.getElementById("edit-nom").value.trim();
      var prix = parseFloat(document.getElementById("edit-prix").value);
      if (!nom || !prix) { alert("Nom et prix obligatoires."); return; }

      saveBtn.disabled = true; saveBtn.textContent = "⏳ Sauvegarde...";

      // Recharger depuis Firebase pour éviter les conflits
      firebase.firestore().collection("boutiques").doc(uid).get().then(function(snap) {
        var freshData = snap.exists ? snap.data() : {};
        var prods = (freshData.produitsCustom || []).slice();

        prods[index] = {
          nom: nom,
          prix: prix,
          description: document.getElementById("edit-desc").value.trim(),
          ingredients: document.getElementById("edit-ingr").value.trim(),
          photo: photoUrl,
          categorie: prod.categorie || "custom"
        };

        firebase.firestore().collection("boutiques").doc(uid).set(
          { produitsCustom: prods },
          { merge: true }
        ).then(function() {
          modal.remove();
          alert("✅ Produit modifié !");
          // Recharger la vue produits
          if (typeof openGestionBoutique === "function") {
            var panel2 = document.getElementById("baa-boutique-panel");
            if (panel2) panel2.remove();
            openGestionBoutique();
            setTimeout(function() {
              var prodBtn = document.querySelector("#baa-boutique-panel [style*='Gérer mes produits']");
              if (prodBtn) prodBtn.click();
            }, 500);
          }
        }).catch(function(e) {
          saveBtn.disabled = false;
          saveBtn.textContent = "💾 Sauvegarder les modifications";
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
  }

  initEditCustom();
  console.log("BAA Edit Custom initialise");
})();
