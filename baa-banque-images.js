// BAA Banque d'Images — Partagée entre tous les membres
(function() {
  var CATEGORIES = ["Make-up","Soins visage","Soins corps","Compléments alimentaires","Parfums","Produits ménagers","Recrutement"];
  var CLOUDINARY_CLOUD = "dxcfq3nyl";
  var CLOUDINARY_UPLOAD_PRESET = "baa_banque";
  var catActive = "Make-up";

  function init() {
    if (!firebase.apps || !firebase.apps.length) { setTimeout(init, 300); return; }
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) return;
      window.ouvrirBanqueImages = function() { ouvrirBanque(user); };
    });
  }

  function ouvrirBanque(user) {
    if (document.getElementById("baa-banque-panel")) return;
    var db = firebase.firestore();

    // Style injecté
    var style = document.createElement("style");
    style.textContent = "#baa-banque-panel { position:fixed;inset:0;z-index:9999999;background:#111;font-family:Arial,sans-serif; } #baa-banque-scroll { position:absolute;top:110px;bottom:0;left:0;right:0;overflow-y:scroll;-webkit-overflow-scrolling:touch;padding:10px; } #baa-banque-cats { overflow-x:auto;-webkit-overflow-scrolling:touch;white-space:nowrap;scrollbar-width:none; } #baa-banque-cats::-webkit-scrollbar{display:none;}";
    document.head.appendChild(style);

    var panel = document.createElement("div");
    panel.id = "baa-banque-panel";

    // Header fixe
    var header = document.createElement("div");
    header.style.cssText = "position:absolute;top:0;left:0;right:0;background:linear-gradient(135deg,#1a0a00,#2d1200);z-index:2;";

    var topBar = document.createElement("div");
    topBar.style.cssText = "padding:12px 16px;display:flex;justify-content:space-between;align-items:center;";
    topBar.innerHTML = "<h3 style='color:#f5d48a;font-size:15px;margin:0;'>🖼️ Banque d\\'images</h3>";

    var retourBtn = document.createElement("button");
    retourBtn.textContent = "← Retour";
    retourBtn.style.cssText = "background:none;border:none;color:#f5d48a;font-size:13px;cursor:pointer;font-weight:bold;touch-action:manipulation;";
    retourBtn.onclick = function() {
      panel.remove(); style.remove();
      document.body.style.overflow = "";
      var mb = document.getElementById("baa-menu-btn"); if(mb) mb.click();
    };
    topBar.appendChild(retourBtn);
    header.appendChild(topBar);

    // Barre ajout + catégories
    var actionsBar = document.createElement("div");
    actionsBar.style.cssText = "padding:0 16px 8px;display:flex;gap:8px;align-items:center;";
    var addBtn = document.createElement("button");
    addBtn.textContent = "➕ Ajouter";
    addBtn.style.cssText = "background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;padding:8px 14px;border-radius:20px;font-weight:bold;font-size:13px;cursor:pointer;touch-action:manipulation;flex-shrink:0;";
    addBtn.onclick = function() { ouvrirUpload(user, db, catActive, function(){ chargerImages(catActive); }); };
    actionsBar.appendChild(addBtn);

    var catsBar = document.createElement("div");
    catsBar.id = "baa-banque-cats";
    catsBar.style.cssText = "flex:1;overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch;";
    CATEGORIES.forEach(function(cat) {
      var btn = document.createElement("button");
      btn.textContent = cat;
      btn.setAttribute("data-cat", cat);
      btn.style.cssText = "display:inline-block;padding:6px 12px;border-radius:20px;border:1px solid #444;background:"+(cat===catActive?"#c9a86a":"transparent")+";color:"+(cat===catActive?"#1a0a00":"#ccc")+";font-size:12px;font-weight:bold;cursor:pointer;touch-action:manipulation;margin-right:6px;white-space:nowrap;";
      btn.onclick = function() {
        catActive = cat;
        catsBar.querySelectorAll("button").forEach(function(b) {
          b.style.background = b.getAttribute("data-cat") === cat ? "#c9a86a" : "transparent";
          b.style.color = b.getAttribute("data-cat") === cat ? "#1a0a00" : "#ccc";
        });
        chargerImages(cat);
      };
      catsBar.appendChild(btn);
    });
    actionsBar.appendChild(catsBar);
    header.appendChild(actionsBar);
    panel.appendChild(header);

    // Zone scrollable
    var scroll = document.createElement("div");
    scroll.id = "baa-banque-scroll";
    scroll.innerHTML = "<p style='color:#999;font-size:13px;text-align:center;padding:30px;'>Chargement...</p>";
    panel.appendChild(scroll);

    document.body.style.overflow = "hidden";
    document.body.appendChild(panel);

    function chargerImages(cat) {
      scroll.innerHTML = "<p style='color:#999;font-size:13px;text-align:center;padding:30px;'>Chargement...</p>";
      db.collection("banque_images").where("categorie","==",cat).orderBy("createdAt","desc").limit(50).get().then(function(snap) {
        scroll.innerHTML = "";
        if (snap.empty) {
          scroll.innerHTML = "<p style='color:#666;font-size:13px;text-align:center;padding:30px;'>Aucune image.<br>Sois la première à en ajouter ! 🌿</p>";
          return;
        }
        var grid = document.createElement("div");
        grid.style.cssText = "display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;";
        snap.forEach(function(doc) {
          var img = doc.data();
          var card = document.createElement("div");
          card.style.cssText = "position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1;background:#222;";
          var photo = document.createElement("img");
          photo.src = img.url;
          photo.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
          photo.loading = "lazy";
          var overlay = document.createElement("div");
          overlay.style.cssText = "position:absolute;inset:0;background:rgba(0,0,0,0);transition:background 0.2s;display:flex;flex-direction:column;justify-content:flex-end;padding:6px;gap:4px;";
          var dlBtn = document.createElement("button");
          dlBtn.textContent = "⬇️";
          dlBtn.style.cssText = "display:none;background:rgba(255,255,255,0.9);border:none;border-radius:6px;padding:5px;font-size:14px;cursor:pointer;touch-action:manipulation;width:100%;";
          dlBtn.onclick = function(e) {
            e.stopPropagation();
            var a = document.createElement("a");
            a.href = img.urlOriginal || img.url;
            a.download = img.nom || "image.jpg";
            a.target = "_blank";
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
          };
          overlay.appendChild(dlBtn);
          if (img.uid === user.uid) {
            var suppBtn = document.createElement("button");
            suppBtn.textContent = "🗑️";
            suppBtn.style.cssText = "display:none;background:rgba(231,76,60,0.9);border:none;border-radius:6px;padding:5px;font-size:14px;cursor:pointer;touch-action:manipulation;width:100%;";
            suppBtn.onclick = function(e) {
              e.stopPropagation();
              if (!confirm("Supprimer ?")) return;
              db.collection("banque_images").doc(doc.id).delete().then(function(){ card.remove(); });
            };
            overlay.appendChild(suppBtn);
          }
          var showOv = function() { overlay.style.background="rgba(0,0,0,0.5)"; dlBtn.style.display="block"; if(img.uid===user.uid) overlay.querySelectorAll("button")[1] && (overlay.querySelectorAll("button")[1].style.display="block"); };
          var hideOv = function() { overlay.style.background="rgba(0,0,0,0)"; overlay.querySelectorAll("button").forEach(function(b){b.style.display="none";}); };
          card.addEventListener("touchstart", showOv, {passive:true});
          card.addEventListener("touchend", function(){ setTimeout(hideOv, 2000); }, {passive:true});
          card.onmouseenter = showOv; card.onmouseleave = hideOv;
          card.appendChild(photo); card.appendChild(overlay);
          grid.appendChild(card);
        });
        scroll.appendChild(grid);
      }).catch(function(e) {
        scroll.innerHTML = "<p style='color:#e74c3c;font-size:13px;text-align:center;padding:30px;'>Erreur de chargement</p>";
      });
    }

    chargerImages(catActive);
  }

  function ouvrirUpload(user, db, catActive, onSuccess) {
    var input = document.createElement("input");
    input.type = "file"; input.accept = "image/*"; input.multiple = true; input.style.display = "none";
    document.body.appendChild(input);
    input.onchange = function() {
      var files = Array.from(input.files);
      if (!files.length) return;
      input.remove();
      var popup = document.createElement("div");
      popup.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:99999999;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;";
      popup.innerHTML = "<div style='background:#1a0a00;border-radius:16px;padding:24px;text-align:center;max-width:280px;width:90%;'><p style='font-size:32px;margin-bottom:12px;'>⏳</p><p style='color:#f5d48a;font-size:14px;font-weight:bold;margin-bottom:8px;' id='upload-status'>Upload en cours...</p><p style='color:#c9a86a;font-size:12px;' id='upload-count'>0 / "+files.length+"</p></div>";
      document.body.appendChild(popup);
      var uploaded = 0; var errors = 0;
      files.forEach(function(file) {
        var formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", "baa_banque");
        fetch("https://api.cloudinary.com/v1_1/"+CLOUDINARY_CLOUD+"/image/upload", { method:"POST", body:formData })
        .then(function(r){ return r.json(); }).then(function(data) {
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
          var el = document.getElementById("upload-count");
          if (el) el.textContent = uploaded + " / " + files.length;
          if (uploaded + errors === files.length) finUpload();
        }).catch(function() {
          errors++;
          if (uploaded + errors === files.length) finUpload();
        });
      });
      function finUpload() {
        popup.remove();
        if (uploaded > 0) { onSuccess && onSuccess(); }
        if (errors > 0) alert("⚠️ " + errors + " image(s) non uploadée(s).");
      }
    };
    input.click();
  }

  init();
  console.log("BAA Banque Images initialisé");
})();
