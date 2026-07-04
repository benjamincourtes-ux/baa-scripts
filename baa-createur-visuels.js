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

  var state = {
    bg: "#ffffff", bgType: "solid", bgGradient: ["#c9a86a","#f5d48a"],
    format: "square", elements: [], selected: null, nextId: 1
  };

  // TOPBAR
  var topbar = document.createElement("div");
  topbar.style.cssText = "background:#0f0a04;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;border-bottom:1px solid rgba(201,168,106,0.3);";
  panel.appendChild(topbar);

  function updateTopbar() {
    topbar.innerHTML =
      "<div style='display:flex;align-items:center;gap:10px;'>" +
      "<span style='color:#f5d48a;font-size:15px;font-weight:bold;'>🎨 Créez vos visuels</span>" +
      "<div style='display:flex;gap:4px;'>" +
      [["square","Carré"],["story","Story"],["landscape","Large"]].map(function(f) {
        return "<button onclick='window.__cvSetFormat(\""+f[0]+"\")' style='background:"+(state.format===f[0]?"#c9a86a":"rgba(255,255,255,0.1)")+";color:"+(state.format===f[0]?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold;'>"+f[1]+"</button>";
      }).join("") +
      "</div></div>" +
      "<div style='display:flex;gap:8px;align-items:center;'>" +
      "<button onclick='window.__cvDownload()' style='background:#c9a86a;color:#1a1208;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;'>⬇️ Télécharger PNG</button>" +
      "<button onclick='window.__cvClose()' style='background:none;border:none;color:rgba(255,255,255,0.6);font-size:24px;cursor:pointer;padding:0 4px;line-height:1;'>✕</button>" +
      "</div>";
  }

  // MAIN
  var main = document.createElement("div");
  main.style.cssText = "display:flex;flex:1;overflow:hidden;";
  panel.appendChild(main);

  // SIDEBAR
  var sidebar = document.createElement("div");
  sidebar.style.cssText = "width:230px;background:#140e04;overflow-y:auto;padding:12px;flex-shrink:0;border-right:1px solid rgba(201,168,106,0.2);";
  main.appendChild(sidebar);

  // CANVAS ZONE
  var canvasZone = document.createElement("div");
  canvasZone.style.cssText = "flex:1;display:flex;align-items:center;justify-content:center;background:#2a2420;overflow:hidden;";
  main.appendChild(canvasZone);

  var canvasDiv = document.createElement("div");
  canvasDiv.id = "cv-main-canvas";
  canvasZone.appendChild(canvasDiv);

  // FONCTIONS GLOBALES
  window.__cvClose = function() {
    panel.remove();
    delete window.__cvClose; delete window.__cvSetFormat; delete window.__cvDownload;
    delete window.__cvAddText; delete window.__cvAddPhoto; delete window.__cvAddLine; delete window.__cvAddRect;
    delete window.__cvSetBg; delete window.__cvSetGrad; delete window.__cvSetBgType; delete window.__cvLoadModel;
    delete window.__cvSelFont; delete window.__cvSelColor;
    if (typeof window.__baaOpenOutilsPanel === "function") window.__baaOpenOutilsPanel();
  };

  window.__cvSetFormat = function(f) { state.format = f; updateTopbar(); renderCanvas(); renderSidebar(); };

  window.__cvSetBgType = function(t) { state.bgType = t; renderCanvas(); renderSidebar(); };
  window.__cvSetBg = function(c) { state.bg = c; state.bgType = "solid"; renderCanvas(); renderSidebar(); };
  window.__cvSetGrad = function(i) { state.bgGradient = GRADIENTS[i]; state.bgType = "gradient"; renderCanvas(); renderSidebar(); };

  window.__cvAddText = function() {
    state.elements.push({ id: state.nextId++, type:"text", x:50, y:50, text:"Mon texte", fontSize:36, fontFamily:"Arial", color:"#ffffff", bold:false, italic:false, w:40, h:10 });
    state.selected = state.nextId - 1;
    renderCanvas(); renderSidebar();
  };

  window.__cvAddPhoto = function() { document.getElementById("cv-file-input").click(); };

  window.__cvAddLine = function() {
    state.elements.push({ id: state.nextId++, type:"line", x:25, y:50, w:50, h:1, color:"#c9a86a" });
    state.selected = state.nextId - 1;
    renderCanvas(); renderSidebar();
  };

  window.__cvAddRect = function() {
    state.elements.push({ id: state.nextId++, type:"rect", x:30, y:30, w:40, h:20, color:"rgba(201,168,106,0.3)", radius:8, opacity:0.8 });
    state.selected = state.nextId - 1;
    renderCanvas(); renderSidebar();
  };

  window.__cvLoadModel = function(idx) {
    var MODELES = [
      { bg:"#ffffff", elements:[] },
      { bg:"#0f0f0f", elements:[{type:"text",x:50,y:35,text:"Titre principal",fontSize:42,fontFamily:"Georgia",color:"#f5d48a",bold:true,italic:false,w:80,h:10},{type:"text",x:50,y:55,text:"Sous-titre ici",fontSize:24,fontFamily:"Arial",color:"rgba(255,255,255,0.6)",bold:false,italic:false,w:80,h:10},{type:"text",x:50,y:88,text:"Beauty Addict ✦",fontSize:16,fontFamily:"Arial",color:"#c9a86a",bold:false,italic:false,w:60,h:10}] },
      { bg:"#FFF5F8", elements:[{type:"text",x:50,y:30,text:"Mon conseil beauté",fontSize:38,fontFamily:"Georgia",color:"#D4537E",bold:true,italic:false,w:80,h:10},{type:"text",x:50,y:55,text:"Ton texte ici",fontSize:20,fontFamily:"Arial",color:"#555555",bold:false,italic:false,w:80,h:10},{type:"text",x:50,y:88,text:"@beautyaddictfrance",fontSize:14,fontFamily:"Arial",color:"#D4537E",bold:false,italic:false,w:60,h:10}] },
      { bg:"#26215C", elements:[{type:"text",x:50,y:35,text:"Titre ici",fontSize:44,fontFamily:"Georgia",color:"#CECBF6",bold:true,italic:false,w:80,h:10},{type:"text",x:50,y:58,text:"Sous-titre",fontSize:22,fontFamily:"Arial",color:"rgba(255,255,255,0.5)",bold:false,italic:false,w:80,h:10},{type:"text",x:50,y:88,text:"🐦‍🔥 Phénix Academy",fontSize:16,fontFamily:"Arial",color:"#f5d48a",bold:false,italic:false,w:60,h:10}] },
      { bg:"#f8f3ee", elements:[{type:"text",x:50,y:35,text:"Titre élégant",fontSize:40,fontFamily:"Georgia",color:"#3d1f05",bold:true,italic:false,w:80,h:10},{type:"text",x:50,y:58,text:"Votre message ici",fontSize:20,fontFamily:"Arial",color:"#8a6a35",bold:false,italic:false,w:80,h:10},{type:"text",x:50,y:88,text:"Beauty Addict ✦",fontSize:14,fontFamily:"Arial",color:"#c9a86a",bold:false,italic:false,w:60,h:10}] }
    ];
    var m = MODELES[idx];
    state.bg = m.bg; state.bgType = "solid"; state.selected = null;
    state.elements = m.elements.map(function(el) { return Object.assign({ id:state.nextId++, w:80, h:10, rounded:false, radius:8, opacity:1 }, el); });
    renderCanvas(); renderSidebar();
  };

  window.__cvSelEl = function(id) {
    state.selected = id;
    renderCanvas(); renderSidebar();
  };

  window.__cvDelEl = function(id) {
    state.elements = state.elements.filter(function(e) { return e.id !== id; });
    state.selected = null;
    renderCanvas(); renderSidebar();
  };

  window.__cvFull = function(id) {
    var el = state.elements.find(function(e) { return e.id === id; });
    if (el) { el.x=0; el.y=0; el.w=100; el.h=100; el.rounded=false; }
    renderCanvas(); renderSidebar();
  };

  window.__cvRound = function(id, val) {
    var el = state.elements.find(function(e) { return e.id === id; });
    if (el) el.rounded = val;
    renderCanvas(); renderSidebar();
  };

  window.__cvFront = function(id) {
    var idx = state.elements.findIndex(function(e) { return e.id === id; });
    if (idx < state.elements.length - 1) { var tmp=state.elements[idx+1]; state.elements[idx+1]=state.elements[idx]; state.elements[idx]=tmp; renderCanvas(); }
  };

  window.__cvBack = function(id) {
    var idx = state.elements.findIndex(function(e) { return e.id === id; });
    if (idx > 0) { var tmp=state.elements[idx-1]; state.elements[idx-1]=state.elements[idx]; state.elements[idx]=tmp; renderCanvas(); }
  };

  window.__cvSetProp = function(id, prop, val) {
    var el = state.elements.find(function(e) { return e.id === id; });
    if (el) el[prop] = val;
    renderCanvas();
  };

  window.__cvUpdateText = function(id, val) {
    var el = state.elements.find(function(e) { return e.id === id; });
    if (el) { el.text = val; renderCanvas(); }
  };

  window.__cvDownload = function() {
    var cvMain = document.getElementById("cv-main-canvas");
    if (!cvMain) return;
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
    s.onload = function() {
      var size = state.format==="square"?1080:state.format==="story"?[1080,1920][1]:628;
      var cvEl = cvMain.querySelector("[data-canvas]");
      if (!cvEl) return;
      html2canvas(cvEl, { scale: 1080/cvEl.offsetWidth, useCORS:true, allowTaint:true }).then(function(c) {
        var link = document.createElement("a"); link.download="visuel-beauty-addict.png"; link.href=c.toDataURL("image/png");
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          var dataUrl = c.toDataURL("image/png");
          var w=window.open("");
          if(w){ w.document.write("<html><body style='margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;'><img src='"+dataUrl+"' style='max-width:100%;max-height:80vh;' /><p style='font-family:Arial;text-align:center;color:#fff;padding:16px;font-size:14px;'>Appuie longuement sur l image pour enregistrer 📲</p></body></html>"); w.document.close(); }
        } else link.click();
      });
    };
    document.head.appendChild(s);
  };

  // File input
  var fileInput = document.createElement("input");
  fileInput.type="file"; fileInput.accept="image/*"; fileInput.id="cv-file-input"; fileInput.style.display="none";
  fileInput.onchange = async function() {
    var file = this.files[0]; if (!file) return;
    try {
      var fd = new FormData(); fd.append("file",file); fd.append("upload_preset","baa_avatars"); fd.append("folder","studio");
      var r = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload",{method:"POST",body:fd});
      var data = await r.json();
      var imgEl = new Image(); imgEl.crossOrigin="anonymous";
      imgEl.onload = function() {
        var c2=document.createElement("canvas"); c2.width=400; c2.height=400;
        c2.getContext("2d").drawImage(imgEl,0,0,400,400);
        var b64=c2.toDataURL("image/jpeg",0.85);
        var selEl = state.selected ? state.elements.find(function(e){return e.id===state.selected&&e.type==="photo";}) : null;
        if (selEl) { selEl.photoUrl=b64; renderCanvas(); renderSidebar(); return; }
        state.elements.push({id:state.nextId++,type:"photo",x:20,y:20,w:40,h:40,photoUrl:b64,rounded:false});
        state.selected=state.nextId-1;
        renderCanvas(); renderSidebar();
      };
      imgEl.src=data.secure_url;
    } catch(e) { console.log("Upload error:",e); }
  };
  panel.appendChild(fileInput);

  function getBgStyle() {
    if (state.bgType==="gradient") return "background:linear-gradient(135deg,"+state.bgGradient[0]+","+state.bgGradient[1]+");";
    return "background:"+state.bg+";";
  }

  function getCanvasDims() {
    var maxW = Math.min(window.innerWidth-250, window.innerHeight*0.9*(state.format==="story"?9/16:state.format==="landscape"?1200/628:1));
    var ar = state.format==="story"?9/16:state.format==="landscape"?1200/628:1;
    var cW = maxW; var cH = cW/ar;
    if (cH > window.innerHeight*0.9) { cH=window.innerHeight*0.9; cW=cH*ar; }
    return {w:Math.round(cW), h:Math.round(cH)};
  }

  function renderCanvas() {
    var dims = getCanvasDims();
    var cW=dims.w, cH=dims.h;
    var html = "<div data-canvas='1' style='position:relative;width:"+cW+"px;height:"+cH+"px;"+getBgStyle()+"overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.6);'>";
    state.elements.forEach(function(el) {
      var sel = state.selected===el.id;
      html += "<div class='cv-el-div' data-id='"+el.id+"' onclick='event.stopPropagation();window.__cvSelEl("+el.id+")' style='position:absolute;left:"+(el.x/100*cW)+"px;top:"+(el.y/100*cH)+"px;cursor:move;user-select:none;"+(sel?"outline:2px dashed #c9a86a;outline-offset:3px;":"")+"'>";
      if (el.type==="text") {
        html += "<div contenteditable='false' id='cv-text-"+el.id+"' style='font-size:"+(el.fontSize*cW/1080)+"px;font-family:"+el.fontFamily+";color:"+el.color+";font-weight:"+(el.bold?"bold":"normal")+";font-style:"+(el.italic?"italic":"normal")+";white-space:pre;text-align:center;cursor:move;outline:none;'>"+el.text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</div>";
      } else if (el.type==="photo"&&el.photoUrl) {
        html += "<img src='"+el.photoUrl+"' style='width:"+(el.w*cW/100)+"px;height:"+(el.h*cH/100)+"px;object-fit:cover;display:block;border-radius:"+(el.rounded?50:0)+"%;pointer-events:none;' />";
      } else if (el.type==="line") {
        html += "<div style='width:"+(el.w*cW/100)+"px;height:3px;background:"+el.color+";border-radius:2px;pointer-events:none;'></div>";
      } else if (el.type==="rect") {
        html += "<div style='width:"+(el.w*cW/100)+"px;height:"+(el.h*cH/100)+"px;background:"+el.color+";border-radius:"+el.radius+"px;opacity:"+el.opacity+";pointer-events:none;'></div>";
      }
      if (sel) {
        html += "<div onclick='event.stopPropagation();window.__cvDelEl("+el.id+")' style='position:absolute;top:-10px;right:-10px;width:20px;height:20px;background:#e74c3c;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;font-weight:bold;z-index:10;line-height:1;'>×</div>";
        html += "<div data-resize-id='"+el.id+"' style='position:absolute;right:-6px;bottom:-6px;width:14px;height:14px;background:#c9a86a;border-radius:50%;cursor:se-resize;z-index:10;'></div>";
      }
      html += "</div>";
    });
    html += "</div>";
    canvasDiv.innerHTML = html;

    // Drag events
    canvasDiv.querySelectorAll(".cv-el-div").forEach(function(div) {
      var elId = parseInt(div.getAttribute("data-id"));
      function startDrag(e) {
        if (e.target.getAttribute("data-resize-id") || e.target.style.background==="#e74c3c") return;
        if (state.selected !== elId) return;
        e.stopPropagation(); e.preventDefault();
        var el = state.elements.find(function(x){return x.id===elId;});
        if (!el) return;
        var startX=e.clientX||e.touches[0].clientX, startY=e.clientY||e.touches[0].clientY, startElX=el.x, startElY=el.y, moved=false;
        function getXY(ev) { return ev.touches ? {x:ev.touches[0].clientX,y:ev.touches[0].clientY} : {x:ev.clientX,y:ev.clientY}; }
        function onMove(ev) {
          moved=true; var p=getXY(ev);
          el.x=Math.max(0,Math.min(100,startElX+(p.x-startX)/cW*100));
          el.y=Math.max(0,Math.min(100,startElY+(p.y-startY)/cH*100));
          div.style.left=(el.x/100*cW)+"px"; div.style.top=(el.y/100*cH)+"px";
        }
        function onUp() {
          document.removeEventListener("mousemove",onMove); document.removeEventListener("mouseup",onUp);
          document.removeEventListener("touchmove",onMove); document.removeEventListener("touchend",onUp);
        }
        document.addEventListener("mousemove",onMove); document.addEventListener("mouseup",onUp);
        document.addEventListener("touchmove",onMove,{passive:false}); document.addEventListener("touchend",onUp);
      }
      div.addEventListener("mousedown", startDrag);
      div.addEventListener("touchstart", startDrag, {passive:false});
      // Resize
      var rHandle = div.querySelector("[data-resize-id]");
      function startResize(e) {
        e.stopPropagation(); e.preventDefault();
        var el=state.elements.find(function(x){return x.id===elId;});
        if (!el) return;
        var startX=e.clientX||e.touches[0].clientX,startY=e.clientY||e.touches[0].clientY,startW=el.w,startH=el.h;
        function getXY2(ev){return ev.touches?{x:ev.touches[0].clientX,y:ev.touches[0].clientY}:{x:ev.clientX,y:ev.clientY};}
        function onMove(ev) {
          var p=getXY2(ev);
          el.w=Math.max(5,startW+(p.x-startX)/cW*100);
          el.h=Math.max(5,startH+(p.y-startY)/cH*100);
          var img=div.querySelector("img"); if(img){img.style.width=(el.w*cW/100)+"px";img.style.height=(el.h*cH/100)+"px";}
          var d=div.querySelector("div:not([data-resize-id])"); if(d&&(el.type==="line"||el.type==="rect")){d.style.width=(el.w*cW/100)+"px";if(el.type==="rect")d.style.height=(el.h*cH/100)+"px";}
        }
        function onUp(){
          document.removeEventListener("mousemove",onMove);document.removeEventListener("mouseup",onUp);
          document.removeEventListener("touchmove",onMove);document.removeEventListener("touchend",onUp);
        }
        document.addEventListener("mousemove",onMove); document.addEventListener("mouseup",onUp);
        document.addEventListener("touchmove",onMove,{passive:false}); document.addEventListener("touchend",onUp);
      }
      if (rHandle) { rHandle.addEventListener("mousedown",startResize); rHandle.addEventListener("touchstart",startResize,{passive:false}); }
      // Double-clic texte
      div.addEventListener("dblclick", function(e) {
        var el=state.elements.find(function(x){return x.id===elId;});
        if (el&&el.type==="text") { var t=prompt("Modifier le texte:",el.text); if(t!==null){el.text=t;renderCanvas();} }
      });
    });

    // Clic canvas = désélectionner
    var canvasEl = canvasDiv.querySelector("[data-canvas]");
    if (canvasEl) canvasEl.addEventListener("click", function(e) {
      if (e.target===canvasEl) { state.selected=null; renderCanvas(); renderSidebar(); }
    });
  }

  function renderSidebar() {
    var selEl = state.selected!==null ? state.elements.find(function(e){return e.id===state.selected;}) : null;
    var html = "";

    // Ajouter
    html += "<div style='margin-bottom:14px;'><p style='color:#c9a86a;font-size:10px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;'>AJOUTER</p><div style='display:grid;grid-template-columns:1fr 1fr;gap:6px;'>";
    html += "<button onclick='window.__cvAddText()' style='background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:8px;border-radius:6px;cursor:pointer;font-size:11px;'>T Texte</button>";
    html += "<button onclick='window.__cvAddPhoto()' style='background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:8px;border-radius:6px;cursor:pointer;font-size:11px;'>📷 Photo</button>";
    html += "<button onclick='window.__cvAddLine()' style='background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:8px;border-radius:6px;cursor:pointer;font-size:11px;'>— Ligne</button>";
    html += "<button onclick='window.__cvAddRect()' style='background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:8px;border-radius:6px;cursor:pointer;font-size:11px;'>⬜ Forme</button>";
    html += "</div></div>";

    // Fond
    html += "<div style='margin-bottom:14px;'><p style='color:#c9a86a;font-size:10px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;'>FOND</p>";
    html += "<div style='display:flex;gap:6px;margin-bottom:8px;'>";
    html += "<button onclick='window.__cvSetBgType(\"solid\")' style='flex:1;background:"+(state.bgType==="solid"?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(state.bgType==="solid"?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:10px;'>Uni</button>";
    html += "<button onclick='window.__cvSetBgType(\"gradient\")' style='flex:1;background:"+(state.bgType==="gradient"?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(state.bgType==="gradient"?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:10px;'>Dégradé</button>";
    html += "</div>";
    if (state.bgType==="solid") {
      html += "<div style='display:flex;flex-wrap:wrap;gap:5px;'>";
      COLORS_BG.forEach(function(c) { html += "<div onclick='window.__cvSetBg(\""+c+"\")' style='width:22px;height:22px;border-radius:4px;background:"+c+";cursor:pointer;border:"+(state.bg===c?"2px solid #f5d48a":"1px solid rgba(255,255,255,0.2)")+";'></div>"; });
      html += "</div>";
    } else {
      html += "<div style='display:flex;flex-direction:column;gap:4px;'>";
      GRADIENTS.forEach(function(g,i) { html += "<div onclick='window.__cvSetGrad("+i+")' style='height:18px;border-radius:4px;background:linear-gradient(135deg,"+g[0]+","+g[1]+");cursor:pointer;border:"+(JSON.stringify(state.bgGradient)===JSON.stringify(g)?"2px solid #f5d48a":"1px solid transparent")+";'></div>"; });
      html += "</div>";
    }
    html += "</div>";

    // Modèles
    html += "<div style='margin-bottom:14px;'><p style='color:#c9a86a;font-size:10px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;'>MODÈLES</p>";
    ["Page vierge","Noir & Or","Rose élégant","Violet Phénix","Nature Luxe"].forEach(function(n,i) {
      html += "<button onclick='window.__cvLoadModel("+i+")' style='width:100%;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.7);border:none;padding:7px;border-radius:6px;cursor:pointer;font-size:11px;text-align:left;margin-bottom:4px;'>"+n+"</button>";
    });
    html += "</div>";

    // Propriétés
    if (selEl) {
      html += "<div style='border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;'><p style='color:#c9a86a;font-size:10px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;'>PROPRIÉTÉS</p>";
      if (selEl.type==="text") {
        html += "<textarea id='cv-el-text' oninput='window.__cvUpdateText("+selEl.id+",this.value)' onmousedown='event.stopPropagation()' style='width:100%;background:rgba(255,255,255,0.08);color:white;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:6px;font-size:12px;resize:vertical;box-sizing:border-box;margin-bottom:8px;height:60px;'>"+selEl.text+"</textarea>";
        html += "<p style='color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;'>Taille</p><input type='range' min='10' max='120' value='"+selEl.fontSize+"' oninput='window.__cvSetProp("+selEl.id+",\"fontSize\",parseInt(this.value))' onmousedown='event.stopPropagation()' style='width:100%;margin-bottom:8px;' />";
        html += "<p style='color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;'>Police</p><div style='display:flex;flex-direction:column;gap:3px;margin-bottom:8px;max-height:100px;overflow-y:auto;'>";
        FONTS.forEach(function(f) { html += "<div onclick='window.__cvSetProp("+selEl.id+",\"fontFamily\",\""+f+"\")' style='padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px;background:"+(selEl.fontFamily===f?"#c9a86a":"rgba(255,255,255,0.06)")+";color:"+(selEl.fontFamily===f?"#1a1208":"rgba(255,255,255,0.7)")+";font-family:"+f+";'>"+f+"</div>"; });
        html += "</div>";
        html += "<div style='display:flex;gap:6px;margin-bottom:8px;'>";
        html += "<button onclick='window.__cvSetProp("+selEl.id+",\"bold\","+(!selEl.bold)+")' style='flex:1;background:"+(selEl.bold?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(selEl.bold?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:5px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:12px;'>B</button>";
        html += "<button onclick='window.__cvSetProp("+selEl.id+",\"italic\","+(!selEl.italic)+")' style='flex:1;background:"+(selEl.italic?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(selEl.italic?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:5px;border-radius:6px;cursor:pointer;font-style:italic;font-size:12px;'>I</button>";
        html += "</div>";
        html += "<p style='color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;'>Couleur</p><div style='display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;'>";
        COLORS_TEXT.forEach(function(c) { html += "<div onclick='window.__cvSetProp("+selEl.id+",\"color\",\""+c+"\")' style='width:22px;height:22px;border-radius:4px;background:"+c+";cursor:pointer;border:"+(selEl.color===c?"2px solid #f5d48a":"1px solid rgba(255,255,255,0.2)")+";'></div>"; });
        html += "</div>";
      } else if (selEl.type==="photo") {
        html += "<div style='display:flex;gap:6px;margin-bottom:8px;'>";
        html += "<button onclick='window.__cvRound("+selEl.id+",false)' style='flex:1;background:"+(!selEl.rounded?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(!selEl.rounded?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:11px;'>Carré</button>";
        html += "<button onclick='window.__cvRound("+selEl.id+",true)' style='flex:1;background:"+(selEl.rounded?"#c9a86a":"rgba(255,255,255,0.08)")+";color:"+(selEl.rounded?"#1a1208":"rgba(255,255,255,0.6)")+";border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:11px;'>Rond</button>";
        html += "</div>";
        html += "<button onclick='window.__cvFull("+selEl.id+")' style='width:100%;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:7px;border-radius:6px;cursor:pointer;font-size:11px;margin-bottom:6px;'>⬜ Plein écran</button>";
        html += "<button onclick='document.getElementById(\"cv-file-input\").click()' style='width:100%;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:none;padding:7px;border-radius:6px;cursor:pointer;font-size:11px;'>Changer la photo</button>";
      } else if (selEl.type==="line"||selEl.type==="rect") {
        html += "<p style='color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 4px;'>Couleur</p><div style='display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;'>";
        COLORS_TEXT.forEach(function(c) { html += "<div onclick='window.__cvSetProp("+selEl.id+",\"color\",\""+c+"\")' style='width:22px;height:22px;border-radius:4px;background:"+c+";cursor:pointer;border:"+(selEl.color===c?"2px solid #f5d48a":"1px solid rgba(255,255,255,0.2)")+";'></div>"; });
        html += "</div>";
      }
      html += "<div style='display:flex;gap:6px;margin-top:8px;'>";
      html += "<button onclick='window.__cvFront("+selEl.id+")' style='flex:1;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:10px;'>↑ Devant</button>";
      html += "<button onclick='window.__cvBack("+selEl.id+")' style='flex:1;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);border:none;padding:5px;border-radius:6px;cursor:pointer;font-size:10px;'>↓ Derrière</button>";
      html += "</div></div>";
    } else {
      html += "<p style='color:rgba(255,255,255,0.3);font-size:11px;margin-top:12px;'>Clique sur un élément pour le modifier</p>";
    }

    sidebar.innerHTML = html;

    // Focus textarea si texte sélectionné
    if (selEl && selEl.type==="text") {
      var ta = document.getElementById("cv-el-text");
      if (ta) { setTimeout(function() { if(document.getElementById("cv-el-text")) document.getElementById("cv-el-text").focus(); }, 50); }
    }
  }

  updateTopbar();
  renderCanvas();
  renderSidebar();
}

window.openCreateurVisuels = openCreateurVisuels;
