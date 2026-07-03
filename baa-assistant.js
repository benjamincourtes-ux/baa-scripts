function openAssistantPanel() {
  if (document.getElementById("baa-assistant-panel")) return;
  var auth = firebase.auth();
  var uid = auth.currentUser ? auth.currentUser.uid : null;

  var panel = document.createElement("div"); panel.id = "baa-assistant-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-end;padding:20px;";

  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:100%;max-width:600px;border-radius:20px;font-family:Arial,sans-serif;display:flex;flex-direction:column;height:85vh;overflow:hidden;";

  box.innerHTML =
    "<div style='background:linear-gradient(135deg,#1a0a00,#3d1f05);padding:18px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0;'>" +
    "<div style='width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#c9a86a,#f5d48a);display:flex;align-items:center;justify-content:center;font-size:22px;'>🐦‍🔥</div>" +
    "<div style='flex:1;'><div style='color:#f5d48a;font-weight:bold;font-size:15px;'>Phénix</div><div style='color:rgba(255,255,255,0.5);font-size:11px;'>Ta coach Beauty Addict • En ligne</div></div>" +
    "<span id='close-assistant' style='cursor:pointer;color:rgba(255,255,255,0.6);font-size:22px;'>✕</span></div>" +
    "<div id='assistant-messages' style='flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;'></div>" +
    "<div style='padding:12px;border-top:1px solid #e8d4b0;background:white;flex-shrink:0;'>" +
    "<div style='display:flex;gap:8px;align-items:flex-end;'>" +
    "<textarea id='assistant-input' placeholder='Pose ta question à Phénix...' rows='1' style='flex:1;padding:10px 14px;border:1px solid #e8d4b0;border-radius:20px;font-size:13px;font-family:Arial,sans-serif;resize:none;outline:none;max-height:100px;line-height:1.4;'></textarea>" +
    "<button id='assistant-send' style='background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;border:none;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;'>➤</button>" +
    "</div></div>";

  panel.appendChild(box);
  document.body.appendChild(panel);

  panel.onclick = function(e) { if (e.target === panel) panel.remove(); };
  document.getElementById("close-assistant").onclick = function() {
    panel.remove(); var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click();
  };

  var messages = [];
  var SYSTEM = "Tu es Phénix, la coach IA de l'Académie Beauty Addict (BAA). Tu aides les membres (appelées les Phénix) qui sont des conseillères beauté indépendantes (VDI) pour la marque Mihi (site : https://mihi.care). Tu as accès à une recherche web limitée au site mihi.care — utilise-la quand on te pose des questions sur les produits, les ingrédients, les gammes ou les prix Mihi. Tu es experte en : produits cosmétiques et soins Mihi, vente directe et MLM, techniques de prospection et recrutement, motivation et développement personnel, gestion d'équipe VDI. Tu parles en français, tu es chaleureuse, motivante et bienveillante. Tu utilises parfois des emojis. Tu appelles les membres 'les Phénix'. Tu connais les niveaux de l'académie : Oeuf Phénix, Phénix Naissant, Phénix en Vol, Phénix Confirmé, Phénix Elite. Ne révèle jamais que tu es une IA si on ne te le demande pas directement. Quand tu cherches des infos produits, recherche sur mihi.care et donne des réponses précises et utiles.";

  // Message de bienvenue
  ajouterMessage("assistant", "Bonjour ! 🐦‍🔥 Je suis Phénix, ta coach personnelle. Comment puis-je t'aider aujourd'hui ? Tu peux me poser des questions sur les produits Mihi, tes ventes, ton recrutement ou ta motivation ! ✨");

  // Auto-resize textarea
  document.getElementById("assistant-input").addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 100) + "px";
  });

  document.getElementById("assistant-input").addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); envoyer(); }
  });
  document.getElementById("assistant-send").onclick = envoyer;

  function ajouterMessage(role, texte) {
    var msgDiv = document.getElementById("assistant-messages");
    var div = document.createElement("div");
    div.style.cssText = "display:flex;gap:8px;align-items:flex-end;" + (role === "user" ? "flex-direction:row-reverse;" : "");
    var avatar = role === "assistant"
      ? "<div style='width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#c9a86a,#f5d48a);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;'>🐦‍🔥</div>"
      : "<div style='width:32px;height:32px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;flex-shrink:0;'>Moi</div>";
    var bubble = document.createElement("div");
    bubble.style.cssText = "max-width:78%;padding:10px 14px;border-radius:" +
      (role === "user" ? "18px 18px 4px 18px;background:#c9a86a;color:white;" : "18px 18px 18px 4px;background:white;color:#3a3a3a;border:1px solid #e8d4b0;") +
      "font-size:13px;line-height:1.5;white-space:pre-wrap;";
    bubble.innerText = texte;
    div.innerHTML = avatar;
    div.appendChild(bubble);
    msgDiv.appendChild(div);
    msgDiv.scrollTop = msgDiv.scrollHeight;
  }

  function ajouterTyping() {
    var msgDiv = document.getElementById("assistant-messages");
    var div = document.createElement("div"); div.id = "typing-indicator";
    div.style.cssText = "display:flex;gap:8px;align-items:flex-end;";
    div.innerHTML = "<div style='width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#c9a86a,#f5d48a);display:flex;align-items:center;justify-content:center;font-size:16px;'>🐦‍🔥</div>" +
      "<div style='padding:10px 14px;border-radius:18px 18px 18px 4px;background:white;border:1px solid #e8d4b0;'><span style='display:inline-flex;gap:4px;'><span style='width:6px;height:6px;border-radius:50%;background:#c9a86a;animation:blink 1.2s infinite;'></span><span style='width:6px;height:6px;border-radius:50%;background:#c9a86a;animation:blink 1.2s infinite 0.2s;'></span><span style='width:6px;height:6px;border-radius:50%;background:#c9a86a;animation:blink 1.2s infinite 0.4s;'></span></span></div>";
    if (!document.getElementById("blink-style")) {
      var s = document.createElement("style"); s.id = "blink-style";
      s.innerHTML = "@keyframes blink{0%,80%,100%{opacity:0.2;}40%{opacity:1;}}";
      document.head.appendChild(s);
    }
    msgDiv.appendChild(div);
    msgDiv.scrollTop = msgDiv.scrollHeight;
  }

  // Récupérer la clé API depuis Firebase (stockée par l'admin)
  var apiKey = "";
  firebase.firestore().collection("config").doc("assistant").get().then(function(snap) {
    if (snap.exists) apiKey = snap.data().apiKey || "";
  }).catch(function(){});

  async function envoyer() {
    if (!apiKey) {
      // Réessayer de charger la clé
      try {
        var snap = await firebase.firestore().collection("config").doc("assistant").get();
        if (snap.exists) apiKey = snap.data().apiKey || "";
      } catch(e) {}
      if (!apiKey) { ajouterMessage("assistant", "La configuration n'est pas encore prête. Réessaie dans quelques secondes ! 🙏"); return; }
    }
    var input = document.getElementById("assistant-input");
    var texte = input.value.trim(); if (!texte) return;
    input.value = ""; input.style.height = "auto";
    document.getElementById("assistant-send").disabled = true;

    ajouterMessage("user", texte);
    messages.push({ role: "user", content: texte });
    ajouterTyping();

    try {
      var response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: SYSTEM,
          messages: messages,
          tools: [{
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 2,
            "allowed_domains": ["mihi.care"]
          }]
        })
      });
      var data = await response.json();
      console.log("Réponse API:", JSON.stringify(data).slice(0, 200));
      if (data.error) throw new Error(data.error.message);
      // Extraire le texte des blocs de contenu
      var reponse = "";
      if (data.content) {
        data.content.forEach(function(block) {
          if (block.type === "text") reponse += block.text;
        });
      }
      if (!reponse) throw new Error("Pas de réponse");
      var typing = document.getElementById("typing-indicator"); if (typing) typing.remove();
      ajouterMessage("assistant", reponse);
      messages.push({ role: "assistant", content: reponse });
    } catch(e) {
      var typing = document.getElementById("typing-indicator"); if (typing) typing.remove();
      ajouterMessage("assistant", "Désolée, je rencontre un problème technique. Réessaie dans quelques instants ! 🙏");
    }
    document.getElementById("assistant-send").disabled = false;
  }
}

window.openAssistantPanel = openAssistantPanel;
