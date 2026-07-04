function openCreateurVisuels() {
  if (document.getElementById("baa-createur-panel")) return;

  var panel = document.createElement("div");
  panel.id = "baa-createur-panel";
  panel.style.cssText = "position:fixed;inset:0;z-index:999999;display:flex;flex-direction:column;font-family:Arial,sans-serif;background:#1a1208;";
  document.body.appendChild(panel);

  var FONTS = ["Arial","Georgia","Verdana","Trebuchet MS","Courier New","Impact","Times New Roman","Palatino","Garamond","Tahoma","Century Gothic","Lucida Sans","Comic Sans MS","Arial Narrow","Bookman"];
  var COLORS_BG = ["#ffffff","#0f0f0f","#f8f3ee","#26215C","#D4537E","#27AE60","#D85A30","#2980B9","#f5d48a","#E8D5FF","#FFE0E0","#D5F5E3","#FDEBD0","#1a1208","#993556","#4B1528"];
  var COLORS_TEXT = ["#ffffff","#000000","#c9a86a","#f5d48a","#D4537E","#26215C","#D85A30","#27AE60","#2980B9","#ff6b6b","#333333","#888888","#3d1f05","#1a8a4a"];
  var GRADIENTS = [["#c9a86a","#f5d48a"],["#26215C","#534AB7"],["#D4537E","#993556"],["#D85A30","#f5d48a"],["#0f0f0f","#3d1f05"],["#27AE60","#f5d48a"],["#2980B9","#26215C"],["#f8f3ee","#e8d4b0"]];

  var state = { bg:"#ffffff", bgType:"solid", bgGradient:["#c9a86a","#f5d48a"], format:"square", elements:[], selected:null, nextId:1 };

  var fileInput = document.createElement("input");
  fileInput.type="file"; fileInput.accept="image/*"; fileInput.id="cv-file-input"; fileInput.style.display="none";
  panel.appendChild(fileInput);

  fileInput.onchange = async function() {
    var file = this.files[0]; if (!file) return;
    try {
      var fd = new FormData(); fd.append("file",file); fd.append("upload_preset","baa_avatars"); fd.append("folder","studio");
      var r = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload",{method:"POST",body:fd});
      var data = await r.json();
      var imgEl = new Image(); imgEl.crossOrigin="anonymous";
      imgEl.onload = function() {
        var c2=document.createElement("canvas"); c2.width=1080; c2.height=1080;
        c2.getContext("2d").drawImage(imgEl,0,0,1080,1080);
        var b64=c2.toDataURL("image/jpeg",0.95);
        var selEl = state.selected ? state.elements.find(function(e){return e.id===state.selected&&e.type==="photo";}) : null;
        if (selEl) { selEl.photoUrl=b64; fullRender(); return; }
        state.elements.push({id:state.nextId++,type:"photo",x:20,y:20,w:40,h:40,photoUrl:b64,rounded:false});
        state.selected=state.nextId-1; fullRender();
      };
      imgEl.src=data.secure_url;
    } catch(e) { console.log("Upload error:",e); }
  };

  function getBg() {
    return state.bgType==="gradient" ? "background:linear-gradient(135deg,"+state.bgGradient[0]+","+state.bgGradient[1]+");" : "background:"+state.bg+";";
  }

  function getDims() {
    var ar = state.format==="story"?9/16:state.format==="landscape"?1200/628:1;
    var maxW = Math.min(window.innerWidth-240, (window.innerHeight-60)*ar);
    var maxH = Math.min(window.innerHeight-60, (window.innerWidth-240)/ar);
    var w = Math.min(maxW, maxH*ar), h = w/ar;
    return {w:Math.round(w), h:Math.round(h)};
  }

  function btn(label, onclick, style) {
    var b = document.createElement("button");
    b.innerHTML = label;
    b.style.cssText = (style||"background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:8px;border-radius:6px;cursor:pointer;font-size:11px;") + "touch-action:manipulation;-webkit-tap-highlight-color:transparent;";
    b.onclick = function(e) { e.stopPropagation(); onclick(); };
    return b;
  }

  function renderTopbar() {
    var tb = document.createElement("div");
    tb.style.cssText = "background:#0f0a04;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;border-bottom:1px solid rgba(201,168,106,0.3);";
    var left = document.createElement("div");
    left.style.cssText = "display:flex;align-items:center;gap:10px;";
    var title = document.createElement("span");
    title.style.cssText = "color:#f5d48a;font-size:15px;font-weight:bold;";
    title.textContent = "🎨 Créez vos visuels";
    left.appendChild(title);
    var formats = document.createElement("div");
    formats.style.cssText = "display:flex;gap:4px;";
    [["square","Carré"],["story","Story"],["landscape","Large"]].forEach(function(f) {
      var b = document.createElement("button");
      b.textContent = f[1];
      b.style.cssText = "background:"+(state.format===f[0]?"#c9a86a":"rgba(255,255,255,0.1)")+";color:"+(state.format===f[0]?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold;touch-action:manipulation;-webkit-tap-highlight-color:transparent;";
      b.onclick = function(e) { e.stopPropagation(); state.format=f[0]; fullRender(); };
      formats.appendChild(b);
    });
    left.appendChild(formats);
    tb.appendChild(left);
    var right = document.createElement("div");
    right.style.cssText = "display:flex;gap:8px;align-items:center;";
    var dlBtn = document.createElement("button");
    dlBtn.textContent = "⬇️ Télécharger";
    dlBtn.style.cssText = "background:#c9a86a;color:#1a1208;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;touch-action:manipulation;-webkit-tap-highlight-color:transparent;";
    dlBtn.onclick = function(e) { e.stopPropagation(); doDownload(); };
    right.appendChild(dlBtn);
    var closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = "background:none;border:none;color:rgba(255,255,255,0.6);font-size:24px;cursor:pointer;padding:0 6px;touch-action:manipulation;-webkit-tap-highlight-color:transparent;";
    closeBtn.onclick = function(e) { e.stopPropagation(); panel.remove(); if (typeof window.__baaOpenOutilsPanel==="function") window.__baaOpenOutilsPanel(); };
    right.appendChild(closeBtn);
    tb.appendChild(right);
    return tb;
  }

  function buildSidebarContent(container) {
    container.onclick = function(e) { e.stopPropagation(); };
    var savedScroll = container.scrollTop || 0;

    function section(title) {
      var p = document.createElement("p");
      p.style.cssText = "color:#c9a86a;font-size:10px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;";
      p.textContent = title;
      container.appendChild(p);
    }

    function divider() {
      var d = document.createElement("div");
      d.style.cssText = "border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;margin-top:12px;";
      container.appendChild(d);
      return d;
    }

    section("FORMAT");
    var formatDiv = document.createElement("div");
    formatDiv.style.cssText = "display:flex;gap:6px;margin-bottom:14px;";
    [["square","Carré"],["story","Story"],["landscape","Large"]].forEach(function(f) {
      var b = document.createElement("button");
      b.textContent = f[1];
      b.style.cssText = "flex:1;background:"+(state.format===f[0]?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(state.format===f[0]?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:7px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold;touch-action:manipulation;";
      b.onclick = function(e) { e.stopPropagation(); state.format=f[0]; fullRender(); };
      formatDiv.appendChild(b);
    });
    container.appendChild(formatDiv);

    section("AJOUTER");
    var grid = document.createElement("div");
    grid.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:14px;";
    grid.appendChild(btn("T Texte", function() {
      state.elements.push({id:state.nextId++,type:"text",x:50,y:50,text:"Mon texte",fontSize:36,fontFamily:"Arial",color:"#ffffff",bold:false,italic:false,w:40,h:10});
      state.selected=state.nextId-1; fullRender();
    }));
    var photoLabel = document.createElement("label");
    photoLabel.htmlFor = "cv-file-input";
    photoLabel.style.cssText = "background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);padding:8px;border-radius:6px;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;touch-action:manipulation;";
    photoLabel.textContent = "📷 Photo";
    grid.appendChild(photoLabel);
    grid.appendChild(btn("— Ligne", function() {
      state.elements.push({id:state.nextId++,type:"line",x:25,y:50,w:50,h:1,color:"#c9a86a"});
      state.selected=state.nextId-1; fullRender();
    }));
    grid.appendChild(btn("⬜ Forme", function() {
      state.elements.push({id:state.nextId++,type:"rect",x:30,y:30,w:40,h:20,color:"rgba(201,168,106,0.3)",radius:8,opacity:0.8});
      state.selected=state.nextId-1; fullRender();
    }));
    container.appendChild(grid);

    section("FOND");
    var fonds = document.createElement("div");
    fonds.style.cssText = "display:flex;gap:6px;margin-bottom:8px;";
    fonds.appendChild(btn("Uni", function(){state.bgType="solid";fullRender();}, "background:"+(state.bgType==="solid"?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(state.bgType==="solid"?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:10px;flex:1;"));
    fonds.appendChild(btn("Dégradé", function(){state.bgType="gradient";fullRender();}, "background:"+(state.bgType==="gradient"?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(state.bgType==="gradient"?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:10px;flex:1;"));
    container.appendChild(fonds);

    var couleursDiv = document.createElement("div");
    couleursDiv.style.cssText = "display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px;";
    if (state.bgType==="solid") {
      COLORS_BG.forEach(function(c) {
        var d = document.createElement("button");
        d.style.cssText = "width:22px;height:22px;border-radius:4px;background:"+c+";cursor:pointer;border:"+(state.bg===c?"2px solid #f5d48a":"1px solid rgba(255,255,255,0.2)")+";padding:0;touch-action:manipulation;";
        d.onclick = function(e) { e.stopPropagation(); state.bg=c; fullRender(); };
        couleursDiv.appendChild(d);
      });
    } else {
      couleursDiv.style.cssText = "display:flex;flex-direction:column;gap:4px;margin-bottom:14px;";
      GRADIENTS.forEach(function(g) {
        var d = document.createElement("button");
        d.style.cssText = "height:18px;border-radius:4px;background:linear-gradient(135deg,"+g[0]+","+g[1]+");cursor:pointer;border:"+(JSON.stringify(state.bgGradient)===JSON.stringify(g)?"2px solid #f5d48a":"1px solid transparent")+";padding:0;touch-action:manipulation;";
        d.onclick = function(e) { e.stopPropagation(); state.bgGradient=g; fullRender(); };
        couleursDiv.appendChild(d);
      });
    }
    container.appendChild(couleursDiv);

    section("MODÈLES");
    var MODELES = [
      {nom:"Page vierge",bg:"#ffffff",els:[]},
      {nom:"Noir & Or",bg:"#0f0f0f",els:[{type:"text",x:50,y:35,text:"Titre principal",fontSize:42,fontFamily:"Georgia",color:"#f5d48a",bold:true,italic:false},{type:"text",x:50,y:55,text:"Sous-titre ici",fontSize:24,fontFamily:"Arial",color:"rgba(255,255,255,0.6)",bold:false,italic:false},{type:"text",x:50,y:88,text:"Beauty Addict ✦",fontSize:16,fontFamily:"Arial",color:"#c9a86a",bold:false,italic:false}]},
      {nom:"Rose élégant",bg:"#FFF5F8",els:[{type:"text",x:50,y:30,text:"Mon conseil beauté",fontSize:38,fontFamily:"Georgia",color:"#D4537E",bold:true,italic:false},{type:"text",x:50,y:55,text:"Ton texte ici",fontSize:20,fontFamily:"Arial",color:"#555555",bold:false,italic:false},{type:"text",x:50,y:88,text:"@beautyaddictfrance",fontSize:14,fontFamily:"Arial",color:"#D4537E",bold:false,italic:false}]},
      {nom:"Violet Phénix",bg:"#26215C",els:[{type:"text",x:50,y:35,text:"Titre ici",fontSize:44,fontFamily:"Georgia",color:"#CECBF6",bold:true,italic:false},{type:"text",x:50,y:58,text:"Sous-titre",fontSize:22,fontFamily:"Arial",color:"rgba(255,255,255,0.5)",bold:false,italic:false},{type:"text",x:50,y:88,text:"🐦‍🔥 Phénix",fontSize:16,fontFamily:"Arial",color:"#f5d48a",bold:false,italic:false}]},
      {nom:"Nature Luxe",bg:"#f8f3ee",els:[{type:"text",x:50,y:35,text:"Titre élégant",fontSize:40,fontFamily:"Georgia",color:"#3d1f05",bold:true,italic:false},{type:"text",x:50,y:58,text:"Votre message",fontSize:20,fontFamily:"Arial",color:"#8a6a35",bold:false,italic:false},{type:"text",x:50,y:88,text:"Beauty Addict ✦",fontSize:14,fontFamily:"Arial",color:"#c9a86a",bold:false,italic:false}]}
    ];
    var modDiv = document.createElement("div");
    modDiv.style.cssText = "display:flex;flex-direction:column;gap:4px;margin-bottom:14px;";
    MODELES.forEach(function(m) {
      modDiv.appendChild(btn(m.nom, function() {
        state.bg=m.bg; state.bgType="solid"; state.selected=null;
        state.elements=m.els.map(function(el){return Object.assign({id:state.nextId++,w:80,h:10,rounded:false,radius:8,opacity:1},el);});
        fullRender();
      }, "background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.7);border:none;padding:7px;border-radius:6px;cursor:pointer;font-size:11px;text-align:left;width:100%;"));
    });
    container.appendChild(modDiv);

    var selEl = state.selected!==null ? state.elements.find(function(e){return e.id===state.selected;}) : null;
    if (selEl) {
      var propDiv = divider();
      var pTitle = document.createElement("p");
      pTitle.style.cssText = "color:#c9a86a;font-size:10px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;";
      pTitle.textContent = "PROPRIÉTÉS";
      propDiv.appendChild(pTitle);

      if (selEl.type==="text") {
        var ta = document.createElement("textarea");
        ta.value = selEl.text;
        ta.style.cssText = "width:100%;background:rgba(255,255,255,0.08);color:white;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:6px;font-size:12px;resize:vertical;box-sizing:border-box;margin-bottom:8px;height:60px;";
        ta.oninput = function() { selEl.text=ta.value; renderCanvasOnly(); };
        ta.onclick = function(e) { e.stopPropagation(); };
        propDiv.appendChild(ta);
        setTimeout(function(){ta.focus();},50);

        var szLabel = document.createElement("p"); szLabel.style.cssText="color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;"; szLabel.textContent="Taille"; propDiv.appendChild(szLabel);
        var slider = document.createElement("input"); slider.type="range"; slider.min=10; slider.max=120; slider.value=selEl.fontSize;
        slider.style.cssText="width:100%;margin-bottom:8px;";
        slider.oninput=function(){selEl.fontSize=parseInt(slider.value);renderCanvasOnly();};
        slider.onclick=function(e){e.stopPropagation();};
        propDiv.appendChild(slider);

        var fLabel = document.createElement("p"); fLabel.style.cssText="color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;"; fLabel.textContent="Police"; propDiv.appendChild(fLabel);
        var fontDiv = document.createElement("div"); fontDiv.style.cssText="display:flex;flex-direction:column;gap:3px;margin-bottom:8px;max-height:100px;overflow-y:auto;";
        FONTS.forEach(function(f) {
          var fb = document.createElement("button");
          fb.textContent=f; fb.style.cssText="padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px;font-family:"+f+";background:"+(selEl.fontFamily===f?"#c9a86a":"rgba(255,255,255,0.06)")+";color:"+(selEl.fontFamily===f?"#1a1208":"rgba(255,255,255,0.7)")+";border:none;text-align:left;touch-action:manipulation;";
          fb.onclick=function(e){e.stopPropagation();selEl.fontFamily=f;renderCanvasOnly();updateFontBorders(fontDiv,f);};
          fontDiv.appendChild(fb);
        });
        propDiv.appendChild(fontDiv);

        var styleDiv = document.createElement("div"); styleDiv.style.cssText="display:flex;gap:6px;margin-bottom:8px;";
        styleDiv.appendChild(btn("B",function(){selEl.bold=!selEl.bold;renderCanvasOnly();var bEl=styleDiv.children[0];if(bEl){bEl.style.background=selEl.bold?"#c9a86a":"rgba(255,255,255,0.08)";bEl.style.color=selEl.bold?"#1a1208":"rgba(255,255,255,0.6)";};},"background:"+(selEl.bold?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(selEl.bold?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:5px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:12px;flex:1;"));
        styleDiv.appendChild(btn("I",function(){selEl.italic=!selEl.italic;renderCanvasOnly();var iEl=styleDiv.children[1];if(iEl){iEl.style.background=selEl.italic?"#c9a86a":"rgba(255,255,255,0.08)";iEl.style.color=selEl.italic?"#1a1208":"rgba(255,255,255,0.6)";};},"background:"+(selEl.italic?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(selEl.italic?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:5px;border-radius:6px;cursor:pointer;font-style:italic;font-size:12px;flex:1;"));
        propDiv.appendChild(styleDiv);

        var cLabel = document.createElement("p"); cLabel.style.cssText="color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;"; cLabel.textContent="Couleur"; propDiv.appendChild(cLabel);
        var cDiv = document.createElement("div"); cDiv.style.cssText="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;";
        COLORS_TEXT.forEach(function(c) {
          var cb = document.createElement("button");
          cb.style.cssText="width:22px;height:22px;border-radius:4px;background:"+c+";cursor:pointer;border:"+(selEl.color===c?"2px solid #f5d48a":"1px solid rgba(255,255,255,0.2)")+";padding:0;touch-action:manipulation;";
          cb.onclick=function(e){e.stopPropagation();selEl.color=c;renderCanvasOnly();updateColorBorders(cDiv,c);};
          cDiv.appendChild(cb);
        });
        propDiv.appendChild(cDiv);

      } else if (selEl.type==="photo") {
        var shapeDiv = document.createElement("div"); shapeDiv.style.cssText="display:flex;gap:6px;margin-bottom:8px;";
        shapeDiv.appendChild(btn("Carré",function(){selEl.rounded=false;fullRender();},"background:"+(!selEl.rounded?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(!selEl.rounded?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:11px;flex:1;"));
        shapeDiv.appendChild(btn("Rond",function(){selEl.rounded=true;fullRender();},"background:"+(selEl.rounded?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(selEl.rounded?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:11px;flex:1;"));
        propDiv.appendChild(shapeDiv);
        propDiv.appendChild(btn("⬜ Plein écran",function(){selEl.x=0;selEl.y=0;selEl.w=100;selEl.h=100;selEl.rounded=false;fullRender();},"background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:7px;border-radius:6px;cursor:pointer;font-size:11px;width:100%;margin-bottom:6px;display:block;"));
        var chLabel = document.createElement("label"); chLabel.htmlFor="cv-file-input";
        chLabel.style.cssText="background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);padding:7px;border-radius:6px;cursor:pointer;font-size:11px;display:block;text-align:center;margin-bottom:6px;touch-action:manipulation;";
        chLabel.textContent="Changer la photo"; propDiv.appendChild(chLabel);

      } else if (selEl.type==="line"||selEl.type==="rect") {
        var cLabel2 = document.createElement("p"); cLabel2.style.cssText="color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;"; cLabel2.textContent="Couleur"; propDiv.appendChild(cLabel2);
        var cDiv2 = document.createElement("div"); cDiv2.style.cssText="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;";
        COLORS_TEXT.forEach(function(c) {
          var cb = document.createElement("button");
          cb.style.cssText="width:22px;height:22px;border-radius:4px;background:"+c+";cursor:pointer;border:"+(selEl.color===c?"2px solid #f5d48a":"1px solid rgba(255,255,255,0.2)")+";padding:0;touch-action:manipulation;";
          cb.onclick=function(e){e.stopPropagation();selEl.color=c;renderCanvasOnly();updateColorBorders(cDiv2,c);};
          cDiv2.appendChild(cb);
        });
        propDiv.appendChild(cDiv2);
      }

      var ordDiv = document.createElement("div"); ordDiv.style.cssText="display:flex;gap:6px;margin-top:8px;";
      ordDiv.appendChild(btn("↑ Devant",function(){var idx=state.elements.findIndex(function(e){return e.id===selEl.id;});if(idx<state.elements.length-1){var t=state.elements[idx+1];state.elements[idx+1]=state.elements[idx];state.elements[idx]=t;renderCanvasOnly();}},"background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:10px;flex:1;"));
      ordDiv.appendChild(btn("↓ Derrière",function(){var idx=state.elements.findIndex(function(e){return e.id===selEl.id;});if(idx>0){var t=state.elements[idx-1];state.elements[idx-1]=state.elements[idx];state.elements[idx]=t;renderCanvasOnly();}},"background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:10px;flex:1;"));
      propDiv.appendChild(ordDiv);
    } else {
      var hint = document.createElement("p"); hint.style.cssText="color:rgba(255,255,255,0.3);font-size:11px;margin-top:12px;"; hint.textContent="Clique sur un élément pour le modifier"; container.appendChild(hint);
    }
  }

  function updateColorBorders(container, selectedColor) {
    container.querySelectorAll("button").forEach(function(b) {
      b.style.border = b.style.background === selectedColor ? "2px solid #f5d48a" : "1px solid rgba(255,255,255,0.2)";
    });
  }

  function updateFontBorders(container, selectedFont) {
    container.querySelectorAll("button").forEach(function(b) {
      var isSelected = b.textContent === selectedFont;
      b.style.background = isSelected ? "#c9a86a" : "rgba(255,255,255,0.06)";
      b.style.color = isSelected ? "#1a1208" : "rgba(255,255,255,0.7)";
    });
  }

  function fullRenderKeepScroll(container) {
    var scroll = container ? container.scrollTop : 0;
    fullRender();
    // Restaurer scroll après render
    setTimeout(function() {
      var newContainer = document.querySelector("#baa-createur-panel > div:last-child");
      if (newContainer) newContainer.scrollTop = scroll;
    }, 0);
  }

  function renderCanvasOnly() {
    var isMobile = window.innerWidth < 768;
    var cW, cH;
    if (isMobile) {
      cW = window.innerWidth - 20;
      var ar = state.format==="story"?9/16:state.format==="landscape"?1200/628:1;
      cH = Math.round(cW/ar);
      if (cH > window.innerHeight * 0.5) { cH = Math.round(window.innerHeight*0.5); cW = Math.round(cH*ar); }
    } else {
      var dims = getDims(); cW=dims.w; cH=dims.h;
    }
    var cvEl = document.getElementById("cv-canvas-inner");
    if (!cvEl) return;
    cvEl.style.cssText = "position:relative;width:"+cW+"px;height:"+cH+"px;"+getBg()+"overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.6);";
    cvEl.innerHTML="";

    state.elements.forEach(function(el) {
      var div = document.createElement("div");
      div.style.cssText = "position:absolute;left:"+(el.x/100*cW)+"px;top:"+(el.y/100*cH)+"px;cursor:move;user-select:none;touch-action:none;"+(state.selected===el.id?"outline:2px dashed #c9a86a;outline-offset:3px;":"");

      if (el.type==="text") {
        var span = document.createElement("span");
        span.style.cssText = "font-size:"+(el.fontSize*cW/1080)+"px;font-family:"+el.fontFamily+";color:"+el.color+";font-weight:"+(el.bold?"bold":"normal")+";font-style:"+(el.italic?"italic":"normal")+";white-space:pre;display:block;text-align:center;pointer-events:none;";
        span.textContent = el.text;
        div.appendChild(span);
      } else if (el.type==="photo"&&el.photoUrl) {
        var img = document.createElement("img");
        img.src=el.photoUrl; img.style.cssText="width:"+(el.w*cW/100)+"px;height:"+(el.h*cH/100)+"px;object-fit:cover;display:block;border-radius:"+(el.rounded?50:0)+"%;pointer-events:none;";
        div.appendChild(img);
      } else if (el.type==="line") {
        var line = document.createElement("div"); line.style.cssText="width:"+(el.w*cW/100)+"px;height:3px;background:"+el.color+";border-radius:2px;pointer-events:none;"; div.appendChild(line);
      } else if (el.type==="rect") {
        var rect = document.createElement("div"); rect.style.cssText="width:"+(el.w*cW/100)+"px;height:"+(el.h*cH/100)+"px;background:"+el.color+";border-radius:"+el.radius+"px;opacity:"+el.opacity+";pointer-events:none;"; div.appendChild(rect);
      }

      if (state.selected===el.id) {
        var delBtn = document.createElement("button");
        delBtn.textContent="×"; delBtn.style.cssText="position:absolute;top:-10px;right:-10px;width:20px;height:20px;background:#e74c3c;border-radius:50%;cursor:pointer;color:white;font-size:14px;font-weight:bold;border:none;z-index:10;line-height:1;padding:0;touch-action:manipulation;-webkit-tap-highlight-color:transparent;";
        delBtn.onclick=function(e){e.stopPropagation();state.elements=state.elements.filter(function(x){return x.id!==el.id;});state.selected=null;fullRender();};
        div.appendChild(delBtn);

        var resizeDiv = document.createElement("div");
        resizeDiv.style.cssText = "position:absolute;right:-40px;bottom:-10px;display:flex;flex-direction:column;gap:3px;z-index:10;";
        
        var btnPlus = document.createElement("button");
        btnPlus.textContent = "+";
        btnPlus.style.cssText = "width:24px;height:24px;background:#c9a86a;color:#1a1208;border:none;border-radius:50%;cursor:pointer;font-size:16px;font-weight:bold;line-height:1;touch-action:manipulation;-webkit-tap-highlight-color:transparent;";
        btnPlus.onclick = function(e) { e.stopPropagation(); el.w=Math.min(100,el.w+5); el.h=Math.min(100,el.h+5); renderCanvasOnly(); };

        var btnMinus = document.createElement("button");
        btnMinus.textContent = "−";
        btnMinus.style.cssText = "width:24px;height:24px;background:#c9a86a;color:#1a1208;border:none;border-radius:50%;cursor:pointer;font-size:16px;font-weight:bold;line-height:1;touch-action:manipulation;-webkit-tap-highlight-color:transparent;";
        btnMinus.onclick = function(e) { e.stopPropagation(); el.w=Math.max(5,el.w-5); el.h=Math.max(5,el.h-5); renderCanvasOnly(); };

        resizeDiv.appendChild(btnPlus);
        resizeDiv.appendChild(btnMinus);
        div.appendChild(resizeDiv);
      }

      function startDrag(e) {
        var tgt = e.target;
        if (tgt.tagName === "BUTTON") return;
        if (state.selected!==el.id){state.selected=el.id;fullRender();return;}
        e.stopPropagation(); e.preventDefault();
        var startX=e.clientX||(e.touches&&e.touches[0].clientX)||0;
        var startY=e.clientY||(e.touches&&e.touches[0].clientY)||0;
        var startElX=el.x, startElY=el.y;
        function getPos(ev){return{x:ev.clientX||(ev.touches&&ev.touches[0].clientX)||0,y:ev.clientY||(ev.touches&&ev.touches[0].clientY)||0};}
        function onMove(ev){ev.preventDefault();var p=getPos(ev);el.x=Math.max(0,Math.min(100,startElX+(p.x-startX)/cW*100));el.y=Math.max(0,Math.min(100,startElY+(p.y-startY)/cH*100));div.style.left=(el.x/100*cW)+"px";div.style.top=(el.y/100*cH)+"px";}
        function onEnd(){document.removeEventListener("mousemove",onMove);document.removeEventListener("mouseup",onEnd);document.removeEventListener("touchmove",onMove);document.removeEventListener("touchend",onEnd);}
        document.addEventListener("mousemove",onMove); document.addEventListener("mouseup",onEnd);
        document.addEventListener("touchmove",onMove,{passive:false}); document.addEventListener("touchend",onEnd);
      }
      div.addEventListener("mousedown",startDrag);
      div.addEventListener("touchstart",startDrag,{passive:false});

      cvEl.appendChild(div);
    });

    cvEl.onclick=function(e){if(e.target===cvEl){state.selected=null;fullRender();}};

    // Bouton désélectionner hors canvas (utile quand image plein écran)
    var deselBtn = document.getElementById("cv-desel-btn");
    if (!deselBtn && state.selected !== null) {
      deselBtn = document.createElement("button");
      deselBtn.id = "cv-desel-btn";
      deselBtn.textContent = "✓ Désélectionner";
      deselBtn.style.cssText = "position:absolute;top:8px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:white;border:none;padding:6px 14px;border-radius:20px;cursor:pointer;font-size:12px;z-index:100;touch-action:manipulation;";
      deselBtn.onclick = function(e) { e.stopPropagation(); state.selected=null; fullRender(); };
      var canvasContainer = cvEl.parentNode;
      if (canvasContainer) { canvasContainer.style.position="relative"; canvasContainer.appendChild(deselBtn); }
    } else if (deselBtn && state.selected === null) {
      deselBtn.remove();
    }
  }

  function doDownload() {
    var cvEl = document.getElementById("cv-canvas-inner");
    if (!cvEl) return;
    var loadH2C = function(cb){if(window.html2canvas){cb();return;}var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";s.onload=cb;document.head.appendChild(s);};
    loadH2C(function(){
      html2canvas(cvEl,{scale:1080/cvEl.offsetWidth,useCORS:true,allowTaint:true,logging:false}).then(function(c){
        var dataUrl=c.toDataURL("image/png");
        if(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)){
          var dlDiv=document.createElement("div");
          dlDiv.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;";
          var msgP=document.createElement("p");msgP.style.cssText="color:#f5d48a;font-size:15px;text-align:center;margin-bottom:16px;font-family:Arial;";msgP.textContent="Appuie longuement sur l'image puis Enregistrer 📲";
          var img=document.createElement("img");img.src=dataUrl;img.style.cssText="max-width:100%;max-height:65vh;border-radius:8px;";
          var closeB=document.createElement("button");closeB.textContent="Fermer";closeB.style.cssText="margin-top:16px;background:#c9a86a;color:#1a1208;border:none;padding:12px 28px;border-radius:20px;font-size:15px;font-weight:bold;cursor:pointer;touch-action:manipulation;";
          closeB.onclick=function(){dlDiv.remove();};
          dlDiv.appendChild(msgP);dlDiv.appendChild(img);dlDiv.appendChild(closeB);
          document.body.appendChild(dlDiv);
        } else {
          var link=document.createElement("a");link.download="visuel-beauty-addict.png";link.href=dataUrl;link.click();
        }
      });
    });
  }

  var lastScrollTop = 0;

  function saveScroll() {
    var el = document.getElementById("baa-mobile-bottom");
    if (el) lastScrollTop = el.scrollTop;
  }

  function restoreScroll() {
    setTimeout(function() {
      var el = document.getElementById("baa-mobile-bottom");
      if (el) el.scrollTop = lastScrollTop;
    }, 0);
  }

  function fullRender() {
    saveScroll();
    panel.innerHTML="";
    panel.appendChild(fileInput);
    var isMobile = window.innerWidth < 768;

    if (isMobile) {
      // TOPBAR MOBILE
      var tb = document.createElement("div");
      tb.style.cssText = "background:#0f0a04;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;border-bottom:1px solid rgba(201,168,106,0.3);";
      var title = document.createElement("span"); title.style.cssText="color:#f5d48a;font-size:14px;font-weight:bold;"; title.textContent="🎨 Créez vos visuels";
      var right = document.createElement("div"); right.style.cssText="display:flex;gap:8px;align-items:center;";
      var dlBtn = document.createElement("button"); dlBtn.textContent="⬇️"; dlBtn.style.cssText="background:#c9a86a;color:#1a1208;border:none;padding:7px 12px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:bold;touch-action:manipulation;"; dlBtn.onclick=function(e){e.stopPropagation();doDownload();};
      var closeBtn = document.createElement("button"); closeBtn.textContent="✕"; closeBtn.style.cssText="background:none;border:none;color:rgba(255,255,255,0.6);font-size:22px;cursor:pointer;padding:0 4px;touch-action:manipulation;"; closeBtn.onclick=function(e){e.stopPropagation();panel.remove();if(typeof window.__baaOpenOutilsPanel==="function")window.__baaOpenOutilsPanel();};
      right.appendChild(dlBtn); right.appendChild(closeBtn);
      tb.appendChild(title); tb.appendChild(right);
      panel.appendChild(tb);

      // CANVAS
      var canvasZone = document.createElement("div");
      canvasZone.style.cssText = "display:flex;align-items:center;justify-content:center;background:#2a2420;padding:10px;flex-shrink:0;";
      var cvEl = document.createElement("div"); cvEl.id="cv-canvas-inner";
      canvasZone.appendChild(cvEl);
      panel.appendChild(canvasZone);
      renderCanvasOnly();

      // SIDEBAR EN BAS — scrollable horizontalement
      var bottomBar = document.createElement("div");
      bottomBar.id = "baa-mobile-bottom";
      bottomBar.style.cssText = "flex:1;background:#140e04;overflow-y:auto;padding:12px;border-top:1px solid rgba(201,168,106,0.2);";
      buildSidebarContent(bottomBar);
      panel.appendChild(bottomBar);
      restoreScroll();

    } else {
      // LAYOUT DESKTOP
      panel.appendChild(renderTopbar());
      var main=document.createElement("div");main.style.cssText="display:flex;flex:1;overflow:hidden;";
      var sb = document.createElement("div");
      sb.style.cssText = "width:230px;background:#140e04;overflow-y:auto;padding:12px;flex-shrink:0;border-right:1px solid rgba(201,168,106,0.2);";
      buildSidebarContent(sb);
      main.appendChild(sb);
      var canvasZone=document.createElement("div");canvasZone.style.cssText="flex:1;display:flex;align-items:center;justify-content:center;background:#2a2420;overflow:hidden;";
      var dims=getDims();
      var cvEl=document.createElement("div");cvEl.id="cv-canvas-inner";cvEl.style.cssText="position:relative;width:"+dims.w+"px;height:"+dims.h+"px;"+getBg()+"overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.6);";
      canvasZone.appendChild(cvEl);main.appendChild(canvasZone);panel.appendChild(main);
      renderCanvasOnly();
    }
  }

  fullRender();
}

window.openCreateurVisuels = openCreateurVisuels;
