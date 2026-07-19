// BAA Login Patch — Ajoute Banque d'images dans le menu hamburger
(function() {
  // Attendre que le menu hamburger soit créé
  var observer = new MutationObserver(function() {
    var menu = document.getElementById("baa-side-menu");
    if (!menu) return;
    
    // Vérifier que le menu-banque-images n'existe pas déjà
    if (document.getElementById("menu-banque-images")) return;
    
    // Trouver l'item Phénix — Coach IA
    var assistantItem = document.getElementById("menu-assistant");
    if (!assistantItem) return;
    
    // Créer l'item Banque d'images
    var banqueItem = document.createElement("div");
    banqueItem.id = "menu-banque-images";
    banqueItem.className = "baa-menu-item";
    banqueItem.style.cssText = "display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;border-bottom:1px solid #f0e6d3;";
    banqueItem.innerHTML = "<span style='font-size:20px;'>🖼️</span><span style='color:#8a6a35;font-size:15px;font-weight:600;'>Banque d\'images</span>";
    
    banqueItem.onmouseenter = function() { banqueItem.style.background = "#f0e6d3"; };
    banqueItem.onmouseleave = function() { banqueItem.style.background = "transparent"; };
    
    banqueItem.onclick = function() {
      menu.remove();
      if (typeof ouvrirBanqueImages === "function") {
        ouvrirBanqueImages(firebase.auth().currentUser);
      }
    };
    banqueItem.addEventListener("touchend", function(e) {
      e.preventDefault();
      banqueItem.onclick();
    }, {passive: false});
    
    // Insérer avant l'item Phénix
    assistantItem.parentNode.insertBefore(banqueItem, assistantItem);
    
    // Arrêter l'observer
    observer.disconnect();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  console.log("BAA Login Patch Banque Images actif");
})();
