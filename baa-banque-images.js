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

    var panel = document.createElement("div");
    panel.id = "baa-banque-panel";
    panel.setAttribute("style", [
      "position:fixed",
      "top:0","left:0","right:0","bottom:0",
      "z-index:9999999",
      "background:#111",
      "font-family:Arial,sans-serif",
      "display:block",
      "overflow:hidden"
    ].join(";") + ";");

    // Header
    var header = document.createElement("div");
    header.setAttribute("style","position:absolute;top:0;left:0;right:0;height:110px;background:linear-gradient(135deg,#1a0a00,#2d1200);z-index:10;");

    var topBar = document.createElement("div");
    topBar.setAttribute("style","padding:12px 16px;display:flex;justify-content:space-between;align-items:center;");
    var title = document.createElement("h3");
    title.textContent = "🖼️ Banque d'images";
    title.setAttribute("style","color:#f5d48a;font-size:15px;margin:0;");
    var retourBtn = document.createElement("button");
    retourBtn.textContent = "← Retour";
    retourBtn.setAttribute("style","background:none;border:none;color:#f5d48a;font-size:13px;cursor:pointer;font-weight:bold;");
    retourBtn.onclick = function() {
      panel.remove();
      var mb = document.getElementById("baa-menu-btn"); if(mb) mb.click();
    };
    topBar.appendChild(title);
    topBar.appendChild(retourBtn);
    header.appendChild(topBar);

    // Bouton ajout + catégories
    var bar2 = document.createElement("div");
    bar2.setAttribute("style","padding:0 16px 8px;display:flex;gap:8px;align-items:center;overflow:hidden;");
    var addBtn = document.createElement("button");
    addBtn.textContent = "➕";
    addBtn.setAttribute("style","background:#c9a86a;color:#1a0a00;border:none;padding:8px 12px;border-radius:20px;font-weight:bold;font-size:13px;cursor:pointer;flex-shrink:0;");
    addBtn.onclick = function() { ouvrirUpload(user, db, catActive, function(){ chargerImages(catActive); }); };
    bar2.appendChild(addBtn);

    var catsScroll = document.createElement("div");
    catsScroll.setAttribute("style","display:flex;gap:6px;overflow-x:auto;flex:1;scrollbar-width:none;");
    CATEGORIES.forEach(function(cat) {
      var btn = document.createElement("button");
      btn.textContent = cat;
      btn.setAttribute("data-cat", cat);
      btn.setAttribute("style","padding:6px 12px;border-radius:20px;border:1px solid #444;background:"+(cat===catActive?"#c9a86a":"transparent")+";color:"+(cat===catActive?"#1a0a00":"#ccc")+";font-size:11px;cursor:pointer;white-space:nowrap;flex-shrink:0;");
      btn.onclick = function() {
        catActive = cat;
        catsScroll.querySelectorAll("button").forEach(function(b) {
          var active = b.getAttribute("data-cat") === cat;
          b.setAttribute("style","padding:6px 12px;border-radius:20px;border:1px solid #444;background:"+(active?"#c9a86a":"transparent")+";color:"+(active?"#1a0a00":"#ccc")+";font-size:11px;cursor:pointer;white-space:nowrap;flex-shrink:0;");
        });
        chargerImages(cat);
      };
      catsScroll.appendChild(btn);
    });
    bar2.appendChild(catsScroll);
    header.appendChild(bar2);
    panel.appendChild(header);

    // Zone scrollable — clé : position absolute avec top/bottom fixes
    var scrollZone = document.createElement("div");
    scrollZone.setAttribute("style",[
      "position:absolute",
      "top:110px",
      "left:0",
      "right:0",
      "bottom:0",
      "overflow-y:scroll",
      "-webkit-overflow-scrolling:touch",
      "padding:10px"
    ].join(";") + ";");
    panel.appendChild(scrollZone);
    document.body.appendChild(panel);

    function chargerImages(cat) {
      scrollZone.innerHTML = "<p style='color:#999;text-align:center;padding:40px;font-size:13px;'>Chargement...</p>";
      db.collection("banque_images").where("categorie","==",cat).orderBy("createdAt","desc").limit(50).get().then(function(snap) {
        scrollZone.innerHTML = "";
        if (snap.empty) {
          scrollZone.innerHTML = "<p style='color:#666;text-align:center;padding:40px;font-size:13px;'>Aucune image dans cette catégorie 🌿</p>";
          return;
        }
        var grid = document.createElement("div");
        grid.setAttribute("style","display:grid;grid-template-columns:repeat(3,1fr);gap:8px;");
        snap.forEach(function(doc) {
          var data = doc.data();
          var card = document.createElement("div");
          card.setAttribute("style","position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1/1;background:#222;cursor:pointer;");
          var photo = document.createElement("img");
          photo.src = data.url;
          photo.setAttribute("style","width:100%;height:100%;object-fit:cover;display:block;");
          photo.loading = "lazy";
          var btns = document.createElement("div");
          btns.setAttribute("style","position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.6);padding:4px;display:none;flex-direction:column;gap:3px;");
          var dlBtn = document.createElement("a");
          dlBtn.textContent = "⬇️ Télécharger";
          dlBtn.href = data.urlOriginal || data.url;
          dlBtn.target = "_blank";
          dlBtn.setAttribute("style","background:rgba(255,255,255,0.9);border-radius:5px;padding:4px;font-size:11px;text-align:center;text-decoration:none;color:#000;display:block;");
          btns.appendChild(dlBtn);
          if (data.uid === user.uid) {
            var suppBtn = document.createElement("button");
            suppBtn.textContent = "🗑️ Supprimer";
            suppBtn.setAttribute("style","background:rgba(231,76,60,0.9);border:none;border-radius:5px;padding:4px;font-size:11px;color:white;cursor:pointer;width:100%;");
            suppBtn.onclick = function(e) {
              e.stopPropagation();
              if (!confirm("Supprimer ?")) return;
              db.collection("banque_images").doc(doc.id).delete().then(function(){ card.remove(); });
            };
            btns.appendChild(suppBtn);
          }
          card.onclick = function() {
            btns.style.display = btns.style.display === "flex" ? "none" : "flex";
          };
          card.appendChild(photo);
          card.appendChild(btns);
          grid.appendChild(card);
        });
        scrollZone.appendChild(grid);
        // Padding bas pour respirer
        var pad = document.createElement("div");
        pad.style.height = "40px";
        scrollZone.appendChild(pad);
      }).catch(function() {
        scrollZone.innerHTML = "<p style='color:#e74c3c;text-align:center;padding:40px;font-size:13px;'>Erreur de chargement</p>";
      });
    }

    chargerImages(catActive);
  }

  function ouvrirUpload(user, db, cat, onSuccess) {
    var input = document.createElement("input");
    input.type = "file"; input.accept = "image/*"; input.multiple = true; input.style.display = "none";
    document.body.appendChild(input);
    input.onchange = function() {
      var files = Array.from(input.files);
      if (!files.length) return;
      input.remove();
      var popup = document.createElement("div");
      popup.setAttribute("style","position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999999;display:flex;align-items:center;justify-content:center;");
      popup.innerHTML = "<div style='background:#1a0a00;border-radius:16px;padding:24px;text-align:center;width:80%;max-width:280px;'><p style='font-size:32px;margin-bottom:10px;'>⏳</p><p style='color:#f5d48a;font-size:14px;font-weight:bold;margin-bottom:6px;'>Upload en cours...</p><p id='up-count' style='color:#c9a86a;font-size:12px;'>0 / "+files.length+"</p></div>";
      document.body.appendChild(popup);
      var done = 0; var errs = 0;
      files.forEach(function(file) {
        var fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        fd.append("folder", "baa_banque");
        fetch("https://api.cloudinary.com/v1_1/"+CLOUDINARY_CLOUD+"/image/upload",{method:"POST",body:fd})
        .then(function(r){return r.json();}).then(function(d){
          if(d.secure_url){
            return db.collection("banque_images").add({
              uid:user.uid,
              prenom:user.displayName?user.displayName.split(" ")[0]:"Membre",
              url:d.secure_url.replace("/upload/","/upload/w_400,c_fill/"),
              urlOriginal:d.secure_url,
              nom:file.name,
              categorie:cat,
              createdAt:firebase.firestore.FieldValue.serverTimestamp()
            });
          }
        }).then(function(){
          done++;
          var el=document.getElementById("up-count");
          if(el) el.textContent=done+" / "+files.length;
          if(done+errs===files.length) fin();
        }).catch(function(){
          errs++;
          if(done+errs===files.length) fin();
        });
      });
      function fin(){
        popup.remove();
        if(done>0) onSuccess&&onSuccess();
        if(errs>0) alert("⚠️ "+errs+" image(s) non uploadée(s).");
      }
    };
    input.click();
  }

  init();
  console.log("BAA Banque Images initialisé");
})();
