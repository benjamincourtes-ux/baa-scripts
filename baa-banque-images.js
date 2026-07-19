// BAA Banque d'Images — Partagée entre tous les membres
(function() {
  var CATEGORIES = [
    "Make-up",
    "Soins visage",
    "Soins corps",
    "Compléments alimentaires",
    "Parfums",
    "Produits ménagers",
    "Recrutement"
  ];

  var CLOUDINARY_CLOUD = "dxcfq3nyl";
  var CLOUDINARY_UPLOAD_PRESET = "baa_banque";

  function init() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(init, 300); return; }
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) return;
      setTimeout(function() { injecterBouton(user); }, 3000);
    });
  }

  function injecterBouton(user) {
    if (document.getElementById("baa-banque-btn")) return;
    var btn = document.createElement("div");
    btn.id = "baa-banque-btn";
    btn.style.cssText = "position:fixed;bottom:230px;right:20px;z-index:99998;background:linear-gradient(135deg,#3498db,#6dd5fa);border-radius:50%;width:46px;height:46px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 15px rgba(52,152,219,0.4);font-size:20px;touch-action:manipulation;";
    btn.innerHTML = "🖼️";
    btn.title = "Banque d'images";
    btn.onclick = function() { ouvrirBanque(user); };
    btn.addEventListener("touchend", function(e){e.preventDefault();ouvrirBanque(user);},{passive:false});
    document.body.appendChild(btn);
  }

  function ouvrirBanque(user) {
    if (document.getElementById("baa-banque-panel")) return;
    var db = firebase.firestore();
    var catActive = "Make-up";

    var panel = document.createElement("div");
    panel.id = "baa-banque-panel";
    panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999999;display:flex;flex-direction:column;font-family:Arial,sans-serif;";

    // Header
    var header = document.createElement("div");
    header.style.cssText = "background:linear-gradient(135deg,#1a0a00,#2d1200);padding:16px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;";
    header.innerHTML = "<h3 style='color:#f5d48a;font-size:16px;margin:0;'>🖼️ Banque d'images</h3>";
    var closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = "background:none;border:none;color:#f5d48a;font-size:22px;cursor:pointer;";
    closeBtn.onclick = function() { panel.remove(); };
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // Bouton ajouter
    var addBar = document.createElement("div");
    addBar.style.cssText = "background:#1a1a1a;padding:12px 16px;flex-shrink:0;";
    var addBtn = document.createElement("button");
    addBtn.style.cssText = "width:100%;background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:12px;border-radius:12px;font-weight:bold;font-size:14px;cursor:pointer;touch-action:manipulation;";
    addBtn.textContent = "➕ Ajouter une image";
    addBtn.onclick = function() { ouvrirUpload(user, db, catActive, function(){ chargerImages(catActive); }); };
    addBar.appendChild(addBtn);
    panel.appendChild(addBar);

    // Filtres catégories
    var filtres = document.createElement("div");
    filtres.style.cssText = "background:#111;padding:10px 16px;display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;flex-shrink:0;-webkit-overflow-scrolling:touch;white-space:nowrap;";
    CATEGORIES.forEach(function(cat) {
      var btn = document.createElement("button");
      btn.textContent = cat;
      btn.style.cssText = "padding:6px 12px;border-radius:20px;border:1px solid #444;background:"+(cat===catActive?"#c9a86a":"transparent")+";color:"+(cat===catActive?"#1a0a00":"#ccc")+";font-size:12px;font-weight:bold;cursor:pointer;touch-action:manipulation;flex-shrink:0;";
      btn.setAttribute("data-cat", cat);
      btn.onclick = function() {
        catActive = cat;
        filtres.querySelectorAll("button").forEach(function(b) {
          b.style.background = b.getAttribute("data-cat") === cat ? "#c9a86a" : "transparent";
          b.style.color = b.getAttribute("data-cat") === cat ? "#1a0a00" : "#ccc";
        });
        chargerImages(cat);
      };
      filtres.appendChild(btn);
    });
    panel.appendChild(filtres);

    // Grille images
    var grille = document.createElement("div");
    grille.id = "baa-banque-grille";
    grille.style.cssText = "flex:1;overflow-y:auto;padding:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;align-content:start;-webkit-overflow-scrolling:touch;";
    panel.appendChild(grille);

    document.body.appendChild(panel);

    function chargerImages(cat) {
      grille.innerHTML = "<p style='color:#999;font-size:13px;text-align:center;padding:30px;grid-column:1/-1;'>Chargement...</p>";
      db.collection("banque_images").where("categorie","==",cat).orderBy("createdAt","desc").limit(50).get().then(function(snap) {
        grille.innerHTML = "";
        if (snap.empty) {
          grille.innerHTML = "<p style='color:#666;font-size:13px;text-align:center;padding:30px;grid-column:1/-1;'>Aucune image dans cette catégorie.<br>Sois la première à en ajouter ! 🌿</p>";
          return;
        }
        snap.forEach(function(doc) {
          var img = doc.data();
          var card = document.createElement("div");
          card.style.cssText = "position:relative;border-radius:10px;overflow:hidden;aspect-ratio:1;background:#222;cursor:pointer;";

          var photo = document.createElement("img");
          photo.src = img.url;
          photo.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
          photo.loading = "lazy";

          var overlay = document.createElement("div");
          overlay.style.cssText = "position:absolute;inset:0;background:rgba(0,0,0,0);transition:background 0.2s;display:flex;flex-direction:column;justify-content:flex-end;padding:6px;";

          var actions = document.createElement("div");
          actions.style.cssText = "display:none;gap:4px;";

          var dlBtn = document.createElement("button");
          dlBtn.textContent = "⬇️";
          dlBtn.title = "Télécharger";
          dlBtn.style.cssText = "flex:1;background:rgba(255,255,255,0.9);border:none;border-radius:6px;padding:5px;font-size:14px;cursor:pointer;touch-action:manipulation;";
          dlBtn.onclick = function(e) {
            e.stopPropagation();
            var a = document.createElement("a");
            a.href = img.urlOriginal || img.url;
            a.download = img.nom || "image.jpg";
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };

          var suppBtn = null;
          if (img.uid === user.uid) {
            suppBtn = document.createElement("button");
            suppBtn.textContent = "🗑️";
            suppBtn.title = "Supprimer";
            suppBtn.style.cssText = "background:rgba(231,76,60,0.9);border:none;border-radius:6px;padding:5px;font-size:14px;cursor:pointer;touch-action:manipulation;";
            suppBtn.onclick = function(e) {
              e.stopPropagation();
              if (!confirm("Supprimer cette image ?")) return;
              db.collection("banque_images").doc(doc.id).delete().then(function() {
                card.remove();
              });
            };
          }

          actions.appendChild(dlBtn);
          if (suppBtn) actions.appendChild(suppBtn);
          overlay.appendChild(actions);
          card.appendChild(photo);
          card.appendChild(overlay);

          // Touch/click pour afficher les actions
          var showActions = function() {
            overlay.style.background = "rgba(0,0,0,0.5)";
            actions.style.display = "flex";
          };
          var hideActions = function() {
            overlay.style.background = "rgba(0,0,0,0)";
            actions.style.display = "none";
          };

          card.addEventListener("touchstart", showActions, {passive:true});
          card.addEventListener("touchend", function() { setTimeout(hideActions, 2000); }, {passive:true});
          card.onmouseenter = showActions;
          card.onmouseleave = hideActions;

          grille.appendChild(card);
        });
      }).catch(function(e) {
        grille.innerHTML = "<p style='color:#e74c3c;font-size:13px;text-align:center;padding:30px;grid-column:1/-1;'>Erreur de chargement</p>";
        console.log("Banque erreur:", e);
      });
    }

    chargerImages(catActive);
  }

  function ouvrirUpload(user, db, catActive, onSuccess) {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.style.display = "none";
    document.body.appendChild(input);

    input.onchange = function() {
      var files = Array.from(input.files);
      if (!files.length) return;
      input.remove();

      // Popup progression
      var popup = document.createElement("div");
      popup.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:99999999;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;";
      popup.innerHTML = "<div style='background:#1a0a00;border-radius:16px;padding:24px;text-align:center;max-width:280px;width:90%;'><p style='font-size:32px;margin-bottom:12px;'>⏳</p><p style='color:#f5d48a;font-size:14px;font-weight:bold;margin-bottom:8px;' id='upload-status'>Upload en cours...</p><p style='color:#c9a86a;font-size:12px;' id='upload-count'>0 / "+files.length+"</p></div>";
      document.body.appendChild(popup);

      var uploaded = 0;
      var errors = 0;

      function uploadFile(file, idx) {
        var formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", "baa_banque");

        fetch("https://api.cloudinary.com/v1_1/"+CLOUDINARY_CLOUD+"/image/upload", {
          method: "POST",
          body: formData
        }).then(function(r) { return r.json(); }).then(function(data) {
          if (data.secure_url) {
            return db.collection("banque_images").add({
              uid: user.uid,
              prenom: user.displayName ? user.displayName.split(" ")[0] : "Membre",
              url: data.secure_url.replace("/upload/", "/upload/w_400,c_fill/"),
              urlOriginal: data.secure_url,
              nom: file.name,
              categorie: catActive,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
          }
        }).then(function() {
          uploaded++;
          document.getElementById("upload-count") && (document.getElementById("upload-count").textContent = uploaded + " / " + files.length);
          if (uploaded + errors === files.length) finUpload();
        }).catch(function() {
          errors++;
          if (uploaded + errors === files.length) finUpload();
        });
      }

      function finUpload() {
        popup.remove();
        if (uploaded > 0) {
          onSuccess && onSuccess();
          alert("✅ " + uploaded + " image(s) ajoutée(s) !");
        }
        if (errors > 0) alert("⚠️ " + errors + " image(s) non uploadée(s).");
      }

      files.forEach(function(file, idx) { uploadFile(file, idx); });
    };

    input.click();
  }

  init();
  console.log("BAA Banque Images initialisé");
})();
