function openCreateurVisuels() {
  if (document.getElementById("baa-createur-panel")) return;

  var panel = document.createElement("div");
  panel.id = "baa-createur-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;flex-direction:column;font-family:Arial,sans-serif;";
  document.body.appendChild(panel);

  // STATE
  var state = {
    bg: "#ffffff",
    bgType: "solid", // solid | gradient
    bgGradient: ["#c9a86a","#f5d48a"],
    format: "square", // square | story | landscape
    elements: [], // {id, type, x, y, w, h, text, fontSize, fontFamily, color, bold, italic, photoUrl, zIndex}
    selected: null,
    nextId: 1,
    photo: null
  };

  var FONTS = ["Arial","Georgia","Verdana","Trebuchet MS","Courier New","Impact","Comic Sans MS","Palatino","Garamond","Bookman","Tahoma","Arial Narrow","Century Gothic","Lucida Sans","Times New Roman"];
  var COLORS_BG = ["#ffffff","#0f0f0f","#f8f3ee","#26215C","#D4537E","#27AE60","#D85A30","#2980B9","#f5d48a","#E8D5FF","#FFE0E0","#D5F5E3","#FDEBD0","#1a1208","#993556","#4B1528"];
  var COLORS_TEXT = ["#ffffff","#000000","#c9a86a","#f5d48a","#D4537E","#26215C","#D85A30","#27AE60","#2980B9","#ff6b6b","#333333","#888888","#3d1f05","#1a8a4a"];
  var GRADIENTS = [
    ["#c9a86a","#f5d48a"],["#26215C","#534AB7"],["#D4537E","#993556"],
    ["#D85A30","#f5d48a"],["#0f0f0f","#3d1f05"],["#27AE60","#f5d48a"],
    ["#2980B9","#26215C"],["#f8f3ee","#e8d4b0"]
  ];

  var MODELES = [
    { nom: "Page vierge", bg: "#ffffff", elements: [] },
    { nom: "Noir & Or", bg: "#0f0f0f", elements: [
      { type:"text", x:50, y:35, text:"Titre principal", fontSize:42, fontFamily:"Georgia", color:"#f5d48a", bold:true },
      { type:"text", x:50, y:55, text:"Sous-titre ici", fontSize:24, fontFamily:"Arial", color:"rgba(255,255,255,0.6)", bold:false },
      { type:"text", x:50, y:88, text:"Beauty Addict ✦", fontSize:16, fontFamily:"Arial", color:"#c9a86a", bold:false }
    ]},
    { nom: "Rose élégant", bg: "#FFF5F8", elements: [
      { type:"text", x:50, y:30, text:"Mon conseil beauté", fontSize:38, fontFamily:"Georgia", color:"#D4537E", bold:true },
      { type:"text", x:50, y:55, text:"Ton texte ici", fontSize:20, fontFamily:"Arial", color:"#555555", bold:false },
      { type:"text", x:50, y:88, text:"@beautyaddictfrance", fontSize:14, fontFamily:"Arial", color:"#D4537E", bold:false }
    ]},
    { nom: "Violet Phénix", bg: "#26215C", elements: [
      { type:"text", x:50, y:35, text:"Titre ici", fontSize:44, fontFamily:"Georgia", color:"#CECBF6", bold:true },
      { type:"text", x:50, y:58, text:"Sous-titre", fontSize:22, fontFamily:"Arial", color:"rgba(255,255,255,0.5)", bold:false },
      { type:"text", x:50, y:88, text:"🐦‍🔥 Phénix Academy", fontSize:16, fontFamily:"Arial", color:"#f5d48a", bold:false }
    ]},
    { nom: "Nature Luxe", bg: "#f8f3ee", elements: [
      { type:"text", x:50, y:35, text:"Titre élégant", fontSize:40, fontFamily:"Georgia", color:"#3d1f05", bold:true },
      { type:"text", x:50, y:58, text:"Votre message ici", fontSize:20, fontFamily:"Arial", color:"#8a6a35", bold:false },
      { type:"text", x:50, y:88, text:"Beauty Addict ✦", fontSize:14, fontFamily:"Arial", color:"#c9a86a", bold:false }
    ]}
  ];

  function getCanvasSize() {
    if (state.format === "square") return { w: 1080, h: 1080 };
    if (state.format === "story") return { w: 1080, h: 1920 };
    return { w: 1200, h: 628 };
  }

  function getAspectRatio() {
    var s = getCanvasSize();
    return s.w / s.h;
  }

  function getBgStyle() {
    if (state.bgType === "gradient") {
      return "background:linear-gradient(135deg," + state.bgGradient[0] + "," + state.bgGradient[1] + ");";
    }
    return "background:" + state.bg + ";";
  }

  function render() {
    panel.innerHTML = "";

    // TOPBAR
    var topbar = document.createElement("div");
    topbar.style.cssText = "background:#1a1208;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;";
    topbar.innerHTML =
      "<div style='display:flex;align-items:center;gap:12px;'>" +
      "<span style='color:#f5d48a;font-size:16px;font-weight:bold;'>🎨 Créez vos visuels</span>" +
      "<div style='display:flex;gap:6px;'>" +
      ["square","story","landscape"].map(function(f, i) {
        var labels = ["Carré","Story","Large"];
        return "<button class='fmt-btn' data-fmt='" + f + "' style='background:" + (state.format===f?"#c9a86a":"rgba(255,255,255,0.1)") + ";color:" + (state.format===f?"#1a1208":"rgba(255,255,255,0.6)") + ";border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold;'>" + labels[i] + "</button>";
      }).join("") +
      "</div></div>" +
      "<div style='display:flex;gap:8px;'>" +
      "<button id='btn-dl-createur' style='background:#c9a86a;color:#1a1208;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;'>⬇️ Télécharger PNG</button>" +
      "<span id='close-createur' style='cursor:pointer;color:rgba(255,255,255,0.6);font-size:22px;padding:0 4px;'>✕</span></div>";
    panel.appendChild(topbar);

    // MAIN
    var main = document.createElement("div");
    main.style.cssText = "display:flex;flex:1;overflow:hidden;";
    panel.appendChild(main);

    // SIDEBAR GAUCHE
    var sidebar = document.createElement("div");
    sidebar.style.cssText = "width:220px;background:#1a1208;overflow-y:auto;padding:12px;flex-shrink:0;";
    sidebar.innerHTML =
      // Ajouter éléments
      "<div style='margin-bottom:14px;'>" +
      "<p style='color:#c9a86a;font-size:10px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;'>AJOUTER</p>" +
      "<div style='display:grid;grid-template-columns:1fr 1fr;gap:6px;'>" +
      "<button id='add-text' style='background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:8px;border-radius:6px;cursor:pointer;font-size:11px;'>T Texte</button>" +
      "<button id='add-photo' style='background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:8px;border-radius:6px;cursor:pointer;font-size:11px;'>📷 Photo</button>" +
      "<button id='add-line' style='background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:8px;border-radius:6px;cursor:pointer;font-size:11px;'>— Ligne</button>" +
      "<button id='add-rect' style='background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:8px;border-radius:6px;cursor:pointer;font-size:11px;'>⬜ Forme</button>" +
      "</div></div>" +

      // Fond
      "<div style='margin-bottom:14px;'>" +
      "<p style='color:#c9a86a;font-size:10px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;'>FOND</p>" +
      "<div style='display:flex;gap:6px;margin-bottom:8px;'>" +
      "<button id='bg-solid-btn' style='flex:1;background:" + (state.bgType==="solid"?"#c9a86a":"rgba(255,255,255,0.08)") + ";color:" + (state.bgType==="solid"?"#1a1208":"rgba(255,255,255,0.6)") + ";border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:10px;'>Uni</button>" +
      "<button id='bg-grad-btn' style='flex:1;background:" + (state.bgType==="gradient"?"#c9a86a":"rgba(255,255,255,0.08)") + ";color:" + (state.bgType==="gradient"?"#1a1208":"rgba(255,255,255,0.6)") + ";border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:10px;'>Dégradé</button>" +
      "</div>" +
      (state.bgType === "solid" ?
        "<div style='display:flex;flex-wrap:wrap;gap:5px;'>" +
        COLORS_BG.map(function(c) {
          return "<div class='bg-color-btn' data-color='" + c + "' style='width:22px;height:22px;border-radius:4px;background:" + c + ";cursor:pointer;border:" + (state.bg===c?"2px solid #f5d48a":"1px solid rgba(255,255,255,0.2)") + ";'></div>";
        }).join("") + "</div>" :
        "<div style='display:flex;flex-direction:column;gap:5px;'>" +
        GRADIENTS.map(function(g, i) {
          return "<div class='bg-grad-btn' data-idx='" + i + "' style='height:20px;border-radius:4px;background:linear-gradient(135deg," + g[0] + "," + g[1] + ");cursor:pointer;border:" + (JSON.stringify(state.bgGradient)===JSON.stringify(g)?"2px solid #f5d48a":"1px solid transparent") + ";'></div>";
        }).join("") + "</div>"
      ) +
      "</div>" +

      // Modèles
      "<div style='margin-bottom:14px;'>" +
      "<p style='color:#c9a86a;font-size:10px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;'>MODÈLES</p>" +
      "<div style='display:flex;flex-direction:column;gap:5px;'>" +
      MODELES.map(function(m, i) {
        return "<button class='modele-btn' data-idx='" + i + "' style='background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:7px;border-radius:6px;cursor:pointer;font-size:11px;text-align:left;'>" + m.nom + "</button>";
      }).join("") +
      "</div></div>" +

      // Propriétés élément sélectionné
      (state.selected !== null ? renderElemProps() : "<p style='color:rgba(255,255,255,0.3);font-size:11px;'>Clique sur un élément pour le modifier</p>");

    sidebar.onmousedown = function(e) { e.stopPropagation(); };
    sidebar.onclick = function(e) { e.stopPropagation(); };
    sidebar.onwheel = function(e) { e.stopPropagation(); };
    main.appendChild(sidebar);

    // CANVAS ZONE
    var canvasZone = document.createElement("div");
    canvasZone.style.cssText = "flex:1;display:flex;align-items:center;justify-content:center;background:#2a2a2a;overflow:hidden;position:relative;";

    var ar = getAspectRatio();
    var maxW = Math.min(window.innerWidth - 240, window.innerHeight * ar * 0.9);
    var maxH = Math.min(window.innerHeight * 0.9, (window.innerWidth - 240) / ar);
    var cW = Math.min(maxW, maxH * ar);
    var cH = cW / ar;

    var canvas = document.createElement("div");
    canvas.id = "cv-canvas";
    canvas.style.cssText = "position:relative;width:" + cW + "px;height:" + cH + "px;" + getBgStyle() + "overflow:hidden;cursor:crosshair;box-shadow:0 8px 40px rgba(0,0,0,0.5);";

    // Éléments
    state.elements.forEach(function(el) {
      var elDiv = document.createElement("div");
      elDiv.className = "cv-el";
      elDiv.setAttribute("data-id", el.id);
      elDiv.style.cssText = "position:absolute;left:" + (el.x/100*cW) + "px;top:" + (el.y/100*cH) + "px;cursor:move;user-select:none;" + (state.selected===el.id ? "outline:2px dashed #c9a86a;outline-offset:3px;" : "");

      if (el.type === "text") {
        elDiv.innerHTML = "<span style='font-size:" + (el.fontSize*cW/1080) + "px;font-family:" + el.fontFamily + ";color:" + el.color + ";font-weight:" + (el.bold?"bold":"normal") + ";font-style:" + (el.italic?"italic":"normal") + ";white-space:pre;display:block;text-align:center;'>" + el.text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;") + "</span>";
      } else if (el.type === "photo" && el.photoUrl) {
        elDiv.innerHTML = "<img src='" + el.photoUrl + "' style='width:" + (el.w*cW/100) + "px;height:" + (el.h*cH/100) + "px;object-fit:cover;display:block;border-radius:" + (el.rounded?50:0) + "%;' />";
      } else if (el.type === "line") {
        elDiv.innerHTML = "<div style='width:" + (el.w*cW/100) + "px;height:3px;background:" + el.color + ";border-radius:2px;'></div>";
      } else if (el.type === "rect") {
        elDiv.innerHTML = "<div style='width:" + (el.w*cW/100) + "px;height:" + (el.h*cH/100) + "px;background:" + el.color + ";border-radius:" + el.radius + "px;opacity:" + el.opacity + ";'></div>";
      }

      // Resize handle
      if (state.selected === el.id) {
        var handle = document.createElement("div");
        handle.style.cssText = "position:absolute;right:-6px;bottom:-6px;width:12px;height:12px;background:#c9a86a;border-radius:50%;cursor:se-resize;";
        handle.setAttribute("data-resize", el.id);
        elDiv.appendChild(handle);
        // Supprimer
        var delBtn = document.createElement("div");
        delBtn.style.cssText = "position:absolute;top:-10px;right:-10px;width:20px;height:20px;background:#e74c3c;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;";
        delBtn.innerText = "×";
        delBtn.setAttribute("data-delete", el.id);
        elDiv.appendChild(delBtn);
      }

      canvas.appendChild(elDiv);
    });

    canvasZone.appendChild(canvas);
    main.appendChild(canvasZone);

    // Input photo caché
    var photoInput = document.createElement("input");
    photoInput.type = "file"; photoInput.accept = "image/*"; photoInput.id = "cv-photo-input"; photoInput.style.display = "none";
    panel.appendChild(photoInput);

    attachEvents(cW, cH);
  }

  function renderElemProps() {
    var el = state.elements.find(function(e) { return e.id === state.selected; });
    if (!el) return "";
    var html = "<div style='border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;margin-top:12px;'><p style='color:#c9a86a;font-size:10px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;'>PROPRIÉTÉS</p>";

    if (el.type === "text") {
      html += "<textarea id='el-text' style='width:100%;background:rgba(255,255,255,0.08);color:white;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:6px;font-size:12px;resize:vertical;box-sizing:border-box;margin-bottom:8px;'>" + el.text + "</textarea>";
      html += "<p style='color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;'>Taille</p><input id='el-size' type='range' min='10' max='120' value='" + el.fontSize + "' style='width:100%;margin-bottom:8px;' />";
      html += "<p style='color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;'>Police</p><div style='display:flex;flex-direction:column;gap:3px;margin-bottom:8px;max-height:100px;overflow-y:auto;'>" +
        FONTS.map(function(f) { return "<div class='font-btn' data-font='" + f + "' style='padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px;background:" + (el.fontFamily===f?"#c9a86a":"rgba(255,255,255,0.06)") + ";color:" + (el.fontFamily===f?"#1a1208":"rgba(255,255,255,0.7)") + ";font-family:" + f + ";'>" + f + "</div>"; }).join("") + "</div>";
      html += "<div style='display:flex;gap:6px;margin-bottom:8px;'>" +
        "<button id='el-bold' style='flex:1;background:" + (el.bold?"#c9a86a":"rgba(255,255,255,0.08)") + ";color:" + (el.bold?"#1a1208":"rgba(255,255,255,0.6)") + ";border:none;padding:5px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:12px;'>B</button>" +
        "<button id='el-italic' style='flex:1;background:" + (el.italic?"#c9a86a":"rgba(255,255,255,0.08)") + ";color:" + (el.italic?"#1a1208":"rgba(255,255,255,0.6)") + ";border:none;padding:5px;border-radius:6px;cursor:pointer;font-style:italic;font-size:12px;'>I</button>" +
        "</div>";
      html += "<p style='color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;'>Couleur du texte</p><div style='display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;'>" +
        COLORS_TEXT.map(function(c) {
          return "<div class='text-color-btn' data-color='" + c + "' style='width:22px;height:22px;border-radius:4px;background:" + c + ";cursor:pointer;border:" + (el.color===c?"2px solid #f5d48a":"1px solid rgba(255,255,255,0.2)") + ";'></div>";
        }).join("") + "</div>";
    } else if (el.type === "photo") {
      html += "<p style='color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;'>Forme</p><div style='display:flex;gap:6px;margin-bottom:8px;'>" +
        "<button id='el-rect-photo' style='flex:1;background:" + (!el.rounded?"#c9a86a":"rgba(255,255,255,0.08)") + ";color:" + (!el.rounded?"#1a1208":"rgba(255,255,255,0.6)") + ";border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:11px;'>Carré</button>" +
        "<button id='el-round-photo' style='flex:1;background:" + (el.rounded?"#c9a86a":"rgba(255,255,255,0.08)") + ";color:" + (el.rounded?"#1a1208":"rgba(255,255,255,0.6)") + ";border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:11px;'>Rond</button>" +
        "</div>" +
        "<button id='el-full-photo' style='width:100%;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:7px;border-radius:6px;cursor:pointer;font-size:11px;margin-bottom:6px;'>⬜ Plein écran</button>" +
        "<button id='el-change-photo' style='width:100%;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:7px;border-radius:6px;cursor:pointer;font-size:11px;margin-bottom:6px;'>Changer la photo</button>";
    } else if (el.type === "line" || el.type === "rect") {
      html += "<p style='color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;'>Couleur</p><div style='display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;'>" +
        COLORS_TEXT.map(function(c) {
          return "<div class='text-color-btn' data-color='" + c + "' style='width:22px;height:22px;border-radius:4px;background:" + c + ";cursor:pointer;border:" + (el.color===c?"2px solid #f5d48a":"1px solid rgba(255,255,255,0.2)") + ";'></div>";
        }).join("") + "</div>";
    }

    // Z-index
    html += "<div style='display:flex;gap:6px;'><button id='el-front' style='flex:1;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:10px;'>↑ Devant</button><button id='el-back' style='flex:1;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:10px;'>↓ Derrière</button></div>";
    html += "</div>";
    return html;
  }

  function renderCanvasOnly(cW, cH) {
    var canvas = document.getElementById("cv-canvas");
    if (!canvas) return;
    canvas.style.cssText = canvas.style.cssText.replace(/background:[^;]+;/, "") + getBgStyle();
    canvas.innerHTML = "";
    state.elements.forEach(function(el) {
      var elDiv = document.createElement("div");
      elDiv.className = "cv-el";
      elDiv.setAttribute("data-id", el.id);
      elDiv.style.cssText = "position:absolute;left:" + (el.x/100*cW) + "px;top:" + (el.y/100*cH) + "px;cursor:move;user-select:none;" + (state.selected===el.id ? "outline:2px dashed #c9a86a;outline-offset:3px;" : "");
      if (el.type === "text") {
        elDiv.innerHTML = "<span style='font-size:" + (el.fontSize*cW/1080) + "px;font-family:" + el.fontFamily + ";color:" + el.color + ";font-weight:" + (el.bold?"bold":"normal") + ";font-style:" + (el.italic?"italic":"normal") + ";white-space:pre;display:block;text-align:center;'>" + el.text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;") + "</span>";
      } else if (el.type === "photo" && el.photoUrl) {
        elDiv.innerHTML = "<img src='" + el.photoUrl + "' style='width:" + (el.w*cW/100) + "px;height:" + (el.h*cH/100) + "px;object-fit:cover;display:block;border-radius:" + (el.rounded?50:0) + "%;' />";
      } else if (el.type === "line") {
        elDiv.innerHTML = "<div style='width:" + (el.w*cW/100) + "px;height:3px;background:" + el.color + ";border-radius:2px;'></div>";
      } else if (el.type === "rect") {
        elDiv.innerHTML = "<div style='width:" + (el.w*cW/100) + "px;height:" + (el.h*cH/100) + "px;background:" + el.color + ";border-radius:" + el.radius + "px;opacity:" + el.opacity + ";'></div>";
      }
      if (state.selected === el.id) {
        var handle = document.createElement("div");
        handle.style.cssText = "position:absolute;right:-6px;bottom:-6px;width:12px;height:12px;background:#c9a86a;border-radius:50%;cursor:se-resize;";
        handle.setAttribute("data-resize", el.id);
        elDiv.appendChild(handle);
        var delBtnNew = document.createElement("div");
        delBtnNew.style.cssText = "position:absolute;top:-10px;right:-10px;width:20px;height:20px;background:#e74c3c;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;z-index:10;";
        delBtnNew.innerText = "×";
        delBtnNew.setAttribute("data-delete", el.id);
        delBtnNew.onmousedown = function(e) { e.stopPropagation(); e.preventDefault(); };
        delBtnNew.onclick = function(e) { e.stopPropagation(); e.preventDefault(); state.elements = state.elements.filter(function(x) { return x.id !== el.id; }); state.selected = null; render(); };
        elDiv.appendChild(delBtnNew);
      }
      attachElEvents(elDiv, el.id, cW, cH);
      canvas.appendChild(elDiv);
    });
  }

  function attachElEvents(elDiv, elId, cW, cH) {
    elDiv.onmousedown = function(e) {
      if (e.target.hasAttribute("data-delete") || e.target.hasAttribute("data-resize")) return;
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "BUTTON") return;
      e.stopPropagation(); e.preventDefault();
      if (state.selected !== elId) { state.selected = elId; render(); return; }
      var startX = e.clientX; var startY = e.clientY;
      var elObj = state.elements.find(function(el) { return el.id === elId; });
      if (!elObj) return;
      var startElX = elObj.x; var startElY = elObj.y;
      var moved = false;
      function onMove(ev) {
        moved = true;
        var dx = ev.clientX - startX; var dy = ev.clientY - startY;
        elObj.x = Math.max(0, Math.min(100, startElX + dx/cW*100));
        elObj.y = Math.max(0, Math.min(100, startElY + dy/cH*100));
        var elDom = document.querySelector("[data-id='" + elId + "']");
        if (elDom) { elDom.style.left = (elObj.x/100*cW) + "px"; elDom.style.top = (elObj.y/100*cH) + "px"; }
      }
      function onUp() { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); if (moved) renderCanvasOnly(cW, cH); }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };
    var resizeHandle = elDiv.querySelector("[data-resize]");
    if (resizeHandle) resizeHandle.onmousedown = function(e) {
      e.stopPropagation(); e.preventDefault();
      var elObj = state.elements.find(function(el) { return el.id === elId; });
      if (!elObj) return;
      var startX = e.clientX; var startY = e.clientY;
      var startW = elObj.w; var startH = elObj.h;
      function onMove(ev) {
        var dx = ev.clientX - startX; var dy = ev.clientY - startY;
        elObj.w = Math.max(5, startW + dx/cW*100);
        elObj.h = Math.max(5, startH + dy/cH*100);
        var elDom = document.querySelector("[data-id='" + elId + "']");
        if (elDom) {
          var img = elDom.querySelector("img");
          if (img) { img.style.width = (elObj.w*cW/100) + "px"; img.style.height = (elObj.h*cH/100) + "px"; }
          var divEl = elDom.querySelector("div:not([data-delete]):not([data-resize])");
          if (divEl && (elObj.type === "line" || elObj.type === "rect")) { divEl.style.width = (elObj.w*cW/100) + "px"; if (elObj.type === "rect") divEl.style.height = (elObj.h*cH/100) + "px"; }
        }
      }
      function onUp() { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); renderCanvasOnly(cW, cH); }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };
    elDiv.ondblclick = function(e) {
      e.stopPropagation();
      var elObj = state.elements.find(function(el) { return el.id === elId; });
      if (elObj && elObj.type === "text") {
        var newText = prompt("Modifier le texte :", elObj.text);
        if (newText !== null) { elObj.text = newText; renderCanvasOnly(cW, cH); }
      }
    };
  }

  function attachEvents(cW, cH) {
    // Fermer
    var closBtn = document.getElementById("close-createur");
    if (closBtn) {
      closBtn.onmousedown = function(e) { e.stopPropagation(); e.preventDefault(); };
      closBtn.onclick = function(e) {
        e.stopPropagation(); e.preventDefault();
        panel.remove();
        if (typeof window.__baaOpenOutilsPanel === "function") {
          window.__baaOpenOutilsPanel();
        }
      };
    }

    // Format
    panel.querySelectorAll(".fmt-btn").forEach(function(btn) {
      btn.onclick = function() { state.format = btn.getAttribute("data-fmt"); render(); };
    });

    // Fond uni/dégradé
    var bgSolid = document.getElementById("bg-solid-btn");
    var bgGrad = document.getElementById("bg-grad-btn");
    if (bgSolid) bgSolid.onclick = function() { state.bgType = "solid"; render(); };
    if (bgGrad) bgGrad.onclick = function() { state.bgType = "gradient"; render(); };

    // Couleurs fond
    panel.querySelectorAll(".bg-color-btn").forEach(function(btn) {
      btn.onclick = function() { state.bg = btn.getAttribute("data-color"); render(); };
    });
    panel.querySelectorAll(".bg-grad-btn").forEach(function(btn) {
      btn.onclick = function() { state.bgGradient = GRADIENTS[parseInt(btn.getAttribute("data-idx"))]; render(); };
    });

    // Modèles
    panel.querySelectorAll(".modele-btn").forEach(function(btn) {
      btn.onclick = function() {
        var m = MODELES[parseInt(btn.getAttribute("data-idx"))];
        state.bg = m.bg; state.bgType = "solid"; state.selected = null;
        state.elements = m.elements.map(function(el, i) {
          return Object.assign({ id: state.nextId++, w: 40, h: 10, rounded: false, radius: 8, opacity: 1, italic: false }, el);
        });
        render();
      };
    });

    // Ajouter texte
    var addText = document.getElementById("add-text");
    if (addText) addText.onclick = function() {
      state.elements.push({ id: state.nextId++, type: "text", x: 50, y: 50, text: "Mon texte", fontSize: 36, fontFamily: "Arial", color: "#ffffff", bold: false, italic: false, w: 40, h: 10 });
      state.selected = state.nextId - 1;
      render();
    };

    // Ajouter photo
    var addPhoto = document.getElementById("add-photo");
    if (addPhoto) addPhoto.onclick = function() {
      var inp = document.getElementById("cv-photo-input");
      if (inp) inp.click();
    };

    // Ajouter ligne
    var addLine = document.getElementById("add-line");
    if (addLine) addLine.onclick = function() {
      state.elements.push({ id: state.nextId++, type: "line", x: 25, y: 50, w: 50, h: 1, color: "#c9a86a" });
      state.selected = state.nextId - 1;
      render();
    };

    // Ajouter rectangle
    var addRect = document.getElementById("add-rect");
    if (addRect) addRect.onclick = function() {
      state.elements.push({ id: state.nextId++, type: "rect", x: 30, y: 30, w: 40, h: 20, color: "rgba(201,168,106,0.3)", radius: 8, opacity: 0.8 });
      state.selected = state.nextId - 1;
      render();
    };

    // Upload photo
    var photoInput = document.getElementById("cv-photo-input");
    if (photoInput) photoInput.onchange = async function() {
      var file = this.files[0]; if (!file) return;
      try {
        var fd = new FormData(); fd.append("file", file); fd.append("upload_preset", "baa_avatars"); fd.append("folder", "studio");
        var r = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload", { method: "POST", body: fd });
        var data = await r.json();
        var url = data.secure_url;
        var imgEl = new Image(); imgEl.crossOrigin = "anonymous";
        imgEl.onload = function() {
          var c2 = document.createElement("canvas"); c2.width = 400; c2.height = 400;
          c2.getContext("2d").drawImage(imgEl, 0, 0, 400, 400);
          var b64 = c2.toDataURL("image/jpeg", 0.85);
          // Si un élément photo est sélectionné, on le met à jour
          if (state.selected) {
            var selEl = state.elements.find(function(e) { return e.id === state.selected && e.type === "photo"; });
            if (selEl) { selEl.photoUrl = b64; render(); return; }
          }
          state.elements.push({ id: state.nextId++, type: "photo", x: 20, y: 20, w: 40, h: 40, photoUrl: b64, rounded: false });
          state.selected = state.nextId - 1;
          render();
        };
        imgEl.src = url;
      } catch(e) { console.log("Erreur upload:", e); }
    };

    // Propriétés élément sélectionné
    var el = state.selected !== null ? state.elements.find(function(e) { return e.id === state.selected; }) : null;
    if (el) {
      var elText = document.getElementById("el-text");
      if (elText) {
        elText.oninput = function() { el.text = elText.value; };
        elText.onblur = function() { el.text = elText.value; render(); };
        elText.onmousedown = function(e) { e.stopPropagation(); };
        elText.onclick = function(e) { e.stopPropagation(); };
        setTimeout(function() { if (document.getElementById("el-text")) document.getElementById("el-text").focus(); }, 50);
      }

      var elSize = document.getElementById("el-size");
      if (elSize) { elSize.onmousedown=function(e){e.stopPropagation();}; elSize.oninput = function(e) { e.stopPropagation(); var selId=state.selected; var selEl=state.elements.find(function(x){return x.id===selId;}); if(selEl){selEl.fontSize=parseInt(elSize.value);} renderCanvasOnly(cW,cH); }; }

      var elFont = document.getElementById("el-font");
      if (elFont) {
        elFont.onmousedown = function(e) { e.stopPropagation(); };
        elFont.onchange = function(e) { e.stopPropagation(); var selId = state.selected; var selEl = state.elements.find(function(x){return x.id===selId;}); if(selEl){selEl.fontFamily=elFont.value;} renderCanvasOnly(cW,cH); };
      }

      panel.querySelectorAll(".font-btn").forEach(function(btn) {
        btn.onmousedown = function(e) { e.preventDefault(); e.stopPropagation(); };
        btn.onclick = function(e) { e.preventDefault(); e.stopPropagation(); var selId=state.selected; var selEl=state.elements.find(function(x){return x.id===selId;}); if(selEl){selEl.fontFamily=btn.getAttribute("data-font");} renderCanvasOnly(cW,cH); };
      });

      var elBold = document.getElementById("el-bold");
      if (elBold) { elBold.onmousedown = function(e){e.preventDefault();e.stopPropagation();}; elBold.onclick = function(e) { e.preventDefault(); e.stopPropagation(); var selId=state.selected; var selEl=state.elements.find(function(x){return x.id===selId;}); if(selEl){selEl.bold=!selEl.bold;} renderCanvasOnly(cW,cH); }; }

      var elItalic = document.getElementById("el-italic");
      if (elItalic) { elItalic.onmousedown = function(e){e.preventDefault();e.stopPropagation();}; elItalic.onclick = function(e) { e.preventDefault(); e.stopPropagation(); var selId=state.selected; var selEl=state.elements.find(function(x){return x.id===selId;}); if(selEl){selEl.italic=!selEl.italic;} renderCanvasOnly(cW,cH); }; }

      var elFront = document.getElementById("el-front");
      if (elFront) { elFront.onmousedown=function(e){e.preventDefault();e.stopPropagation();}; elFront.onclick = function(e) { e.preventDefault(); e.stopPropagation(); var selId = state.selected; var idx = state.elements.findIndex(function(x) { return x.id === selId; }); if (idx < state.elements.length - 1) { var tmp = state.elements[idx+1]; state.elements[idx+1] = state.elements[idx]; state.elements[idx] = tmp; renderCanvasOnly(cW,cH); } }; }

      var elBack = document.getElementById("el-back");
      if (elBack) { elBack.onmousedown=function(e){e.preventDefault();e.stopPropagation();}; elBack.onclick = function(e) { e.preventDefault(); e.stopPropagation(); var selId = state.selected; var idx = state.elements.findIndex(function(x) { return x.id === selId; }); if (idx > 0) { var tmp = state.elements[idx-1]; state.elements[idx-1] = state.elements[idx]; state.elements[idx] = tmp; renderCanvasOnly(cW,cH); } }; }

      var elRectPhoto = document.getElementById("el-rect-photo");
      if (elRectPhoto) elRectPhoto.onclick = function(e) { e.preventDefault(); e.stopPropagation(); var selId=state.selected; var selEl=state.elements.find(function(x){return x.id===selId;}); if(selEl){selEl.rounded=false;} renderCanvasOnly(cW,cH); };
      var elRoundPhoto = document.getElementById("el-round-photo");
      if (elRoundPhoto) elRoundPhoto.onclick = function(e) { e.preventDefault(); e.stopPropagation(); var selId=state.selected; var selEl=state.elements.find(function(x){return x.id===selId;}); if(selEl){selEl.rounded=true;} renderCanvasOnly(cW,cH); };
      var elFullPhoto = document.getElementById("el-full-photo");
      if (elFullPhoto) elFullPhoto.onclick = function(e) { e.preventDefault(); e.stopPropagation(); var selId=state.selected; var selEl=state.elements.find(function(x){return x.id===selId;}); if(selEl){selEl.x=0;selEl.y=0;selEl.w=100;selEl.h=100;selEl.rounded=false;} renderCanvasOnly(cW,cH); };
      var elChangePhoto = document.getElementById("el-change-photo");
      if (elChangePhoto) elChangePhoto.onclick = function() { document.getElementById("cv-photo-input").click(); };

      // Couleur texte/rect
      panel.querySelectorAll(".text-color-btn").forEach(function(btn) {
        btn.onmousedown = function(e) { e.preventDefault(); e.stopPropagation(); };
        btn.onclick = function(e) { e.preventDefault(); e.stopPropagation(); var selId = state.selected; var selEl = state.elements.find(function(x){return x.id===selId;}); if(selEl){selEl.color=btn.getAttribute("data-color");} renderCanvasOnly(cW,cH); };
      });
    }

    // Drag & drop éléments
    var canvas = document.getElementById("cv-canvas");
    if (canvas) {
      // Clic sur canvas = désélectionner
      canvas.onclick = function(e) {
        if (e.target === canvas) { state.selected = null; render(); }
      };

      panel.querySelectorAll(".cv-el").forEach(function(elDiv) {
        var elId = parseInt(elDiv.getAttribute("data-id"));

        // Sélectionner + drag
        elDiv.onmousedown = function(e) {
          if (e.target.hasAttribute("data-delete") || e.target.hasAttribute("data-resize")) return;
          if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "BUTTON") return;
          e.stopPropagation(); e.preventDefault();
          if (state.selected !== elId) { state.selected = elId; render(); return; }
          var startX = e.clientX; var startY = e.clientY;
          var elObj = state.elements.find(function(el) { return el.id === elId; });
          var startElX = elObj.x; var startElY = elObj.y;
          var moved = false;
          function onMove(ev) {
            moved = true;
            var dx = ev.clientX - startX; var dy = ev.clientY - startY;
            elObj.x = Math.max(0, Math.min(100, startElX + dx/cW*100));
            elObj.y = Math.max(0, Math.min(100, startElY + dy/cH*100));
            var elDom = panel.querySelector("[data-id='" + elId + "']");
            if (elDom) { elDom.style.left = (elObj.x/100*cW) + "px"; elDom.style.top = (elObj.y/100*cH) + "px"; }
          }
          function onUp() {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            if (moved) render();
          }
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        };

        // Resize handle
        var resizeHandle = elDiv.querySelector("[data-resize]");
        if (resizeHandle) resizeHandle.onmousedown = function(e) {
          e.stopPropagation(); e.preventDefault();
          var elObj = state.elements.find(function(el) { return el.id === elId; });
          var startX = e.clientX; var startY = e.clientY;
          var startW = elObj.w; var startH = elObj.h;
          function onMove(ev) {
            var dx = ev.clientX - startX; var dy = ev.clientY - startY;
            elObj.w = Math.max(5, startW + dx/cW*100);
            elObj.h = Math.max(5, startH + dy/cH*100);
            var elDom = panel.querySelector("[data-id='" + elId + "']");
            if (elDom) {
              var img = elDom.querySelector("img");
              if (img) { img.style.width = (elObj.w*cW/100) + "px"; img.style.height = (elObj.h*cH/100) + "px"; }
              var div = elDom.querySelector("div");
              if (div && (elObj.type === "line" || elObj.type === "rect")) { div.style.width = (elObj.w*cW/100) + "px"; if (elObj.type === "rect") div.style.height = (elObj.h*cH/100) + "px"; }
            }
          }
          function onUp() { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); render(); }
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        };
        var delBtn = panel.querySelectorAll(".cv-el")[panel.querySelectorAll(".cv-el").length-1] ? elDiv.querySelector("[data-delete]") : null;
        var delBtnEl = elDiv.querySelector("[data-delete]");
        if (delBtnEl) {
          delBtnEl.onmousedown = function(e) { e.stopPropagation(); e.preventDefault(); };
          delBtnEl.onclick = function(e) {
            e.stopPropagation(); e.preventDefault();
            state.elements = state.elements.filter(function(el) { return el.id !== elId; });
            state.selected = null;
            render();
          };
        }

        // Double-clic pour éditer texte
        elDiv.ondblclick = function(e) {
          e.stopPropagation();
          var elObj = state.elements.find(function(el) { return el.id === elId; });
          if (elObj && elObj.type === "text") {
            var newText = prompt("Modifier le texte :", elObj.text);
            if (newText !== null) { elObj.text = newText; render(); }
          }
        };
      });
    }

    // Télécharger
    var dlBtn = document.getElementById("btn-dl-createur");
    if (dlBtn) dlBtn.onclick = function() {
      var cvs = getCanvasSize();
      var canvasEl = document.getElementById("cv-canvas");
      if (!canvasEl) return;
      var html2canvas_script = document.createElement("script");
      html2canvas_script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      html2canvas_script.onload = function() {
        html2canvas(canvasEl, { scale: cvs.w / canvasEl.offsetWidth, useCORS: true, allowTaint: true }).then(function(cvEl) {
          var link = document.createElement("a"); link.download = "visuel-beauty-addict.png"; link.href = cvEl.toDataURL("image/png");
          var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          if (isMobile) { var w = window.open(""); w.document.write("<img src='" + cvEl.toDataURL("image/png") + "' style='max-width:100%;' /><p style='font-family:Arial;color:#666;font-size:14px;text-align:center;'>Appuie longuement pour enregistrer 📲</p>"); }
          else { link.click(); }
        });
      };
      document.head.appendChild(html2canvas_script);
    };
  }

  render();
}

window.openCreateurVisuels = openCreateurVisuels;
