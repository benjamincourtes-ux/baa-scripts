function initBeautyAddictLogin() {
  if (window.__baaLoginInitialized) return;
  window.__baaLoginInitialized = true;
  console.log("BAA Login init...");
  if (!window.firebase) { console.log("Firebase absent"); window.__baaLoginInitialized = false; return; }
  if (!firebase.apps || firebase.apps.length === 0) {
    firebase.initializeApp({ apiKey: "AIzaSyC94wzVrEtrqxhshdFsRHR7HiL5wJEkYG0", authDomain: "beauty-addict-academy.firebaseapp.com", projectId: "beauty-addict-academy", storageBucket: "beauty-addict-academy.firebasestorage.app", messagingSenderId: "311669980538", appId: "1:311669980538:web:eaf8a95e987473c6412ac3" });
  }
  const auth = firebase.auth();
  auth.languageCode = "fr";
  const db = firebase.firestore();
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      if (document.getElementById("baa-login-overlay")) return;
      const overlay = document.createElement("div");
      overlay.id = "baa-login-overlay";
      overlay.innerHTML = "<div id='baa-login-card'><h1>Bienvenue dans l'Academie Beauty Addict</h1><p>Plus qu'une formation, cette academie est un tremplin.<br>Un espace pour apprendre, grandir et deployer pleinement ton potentiel.</p><div class='baa-tabs'><button id='login-tab' class='baa-tab baa-active'>Se connecter</button><button id='signup-tab' class='baa-tab baa-inactive'>Creer mon compte</button></div><div id='login-view'><input id='login-email' class='baa-input' placeholder='Email' /><input id='login-password' type='password' class='baa-input' placeholder='Mot de passe' /><button id='login-btn' class='baa-btn'>Se connecter</button><div id='forgot-password-link' style='text-align:center;margin-top:12px;color:#8a6a35;font-size:13px;cursor:pointer;text-decoration:underline;'>Mot de passe oublie ?</div></div><div id='signup-view' style='display:none;'><input id='signup-firstname' class='baa-input' placeholder='Prenom' /><input id='signup-lastname' class='baa-input' placeholder='Nom' /><input id='signup-email' class='baa-input' placeholder='Email' /><input id='signup-password' type='password' class='baa-input' placeholder='Mot de passe' /><input id='signup-password2' type='password' class='baa-input' placeholder='Confirmer mot de passe' /><button id='signup-btn' class='baa-btn'>Creer mon compte</button></div><div id='baa-message'></div></div>";
      document.body.appendChild(overlay);

      (function() {
        var canvas = document.createElement("canvas");
        canvas.id = "baa-particles";
        canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:9998;pointer-events:none;";
        document.body.appendChild(canvas);
        var ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener("resize", function() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
        var particles = [];
        for (var i = 0; i < 55; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.3 - 0.15,
            o: Math.random() * 0.6 + 0.2,
            do: (Math.random() - 0.5) * 0.008
          });
        }
        var colors = ["rgba(201,168,106,", "rgba(232,212,176,", "rgba(243,231,211,", "rgba(255,220,120,"];
        function animateParticles() {
          if (!document.getElementById("baa-login-overlay") && !document.getElementById("baa-particles")) return;
          if (!document.getElementById("baa-login-overlay")) { canvas.remove(); return; }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach(function(p, i) {
            p.x += p.dx; p.y += p.dy;
            p.o += p.do;
            if (p.o > 0.8 || p.o < 0.1) p.do *= -1;
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = canvas.height + 10;
            if (p.y > canvas.height + 10) p.y = -10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = colors[i % colors.length] + p.o + ")";
            ctx.fill();
          });
          requestAnimationFrame(animateParticles);
        }
        animateParticles();
      })();

      document.getElementById("login-tab").onclick = function() { document.getElementById("login-view").style.display = "block"; document.getElementById("signup-view").style.display = "none"; document.getElementById("login-tab").className = "baa-tab baa-active"; document.getElementById("signup-tab").className = "baa-tab baa-inactive"; document.getElementById("baa-message").innerHTML = ""; };
      document.getElementById("signup-tab").onclick = function() { document.getElementById("login-view").style.display = "none"; document.getElementById("signup-view").style.display = "block"; document.getElementById("signup-tab").className = "baa-tab baa-active"; document.getElementById("login-tab").className = "baa-tab baa-inactive"; document.getElementById("baa-message").innerHTML = ""; };
      document.getElementById("login-btn").onclick = async function() {
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
        const msg = document.getElementById("baa-message");
        try {
          const userCred = await auth.signInWithEmailAndPassword(email, password);
          const doc = await db.collection("users").doc(userCred.user.uid).get();
          const data = doc.data();
          if (!data) { msg.innerHTML = "Compte introuvable."; return; }
          if (data.accountStatus === "pending") { msg.innerHTML = "Compte en attente de validation."; return; }
          if (data.accountStatus === "suspended") { msg.innerHTML = "Compte suspendu."; return; }
          sessionStorage.setItem("baa-show-dashboard", "1");
        } catch (e) { document.getElementById("baa-message").innerHTML = "Email ou mot de passe incorrect."; }
      };
      document.getElementById("signup-btn").onclick = async function() {
        const firstname = document.getElementById("signup-firstname").value.trim();
        const lastname = document.getElementById("signup-lastname").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;
        const password2 = document.getElementById("signup-password2").value;
        const msg = document.getElementById("baa-message");
        if (!firstname || !lastname || !email || !password) { msg.innerHTML = "Merci de remplir tous les champs."; return; }
        if (password !== password2) { msg.innerHTML = "Les mots de passe ne correspondent pas."; return; }
        try {
          const userCred = await auth.createUserWithEmailAndPassword(email, password);
          await db.collection("users").doc(userCred.user.uid).set({ prenom: firstname, nom: lastname, email: email, accountStatus: "pending", role: "member", moduleActuel: 1, progression: 0, createdAt: new Date() });
          msg.innerHTML = "Compte cree ! En attente de validation.";
          emailjs.init("D_JtKhPDgOQWi_ECO");
          emailjs.send("service_wr9mlhk", "template_qffpmql", { prenom: firstname, nom: lastname, email: email, date: new Date().toLocaleDateString("fr-FR") }).catch(function(err) { console.log("EmailJS erreur:", err); });
        } catch (e) { document.getElementById("baa-message").innerHTML = e.message; }
      };
      document.getElementById("forgot-password-link").onclick = function() {
        const email = document.getElementById("login-email").value.trim();
        const msg = document.getElementById("baa-message");
        if (!email) { msg.innerHTML = "Merci de saisir ton email ci-dessus avant de cliquer sur ce lien."; return; }
        auth.sendPasswordResetEmail(email).then(function() {
          msg.innerHTML = "Un email de reinitialisation a ete envoye a " + email + ". Verifie aussi tes spams.";
        }).catch(function(e) {
          if (e.code === "auth/user-not-found") { msg.innerHTML = "Aucun compte n est associe a cet email."; }
          else if (e.code === "auth/invalid-email") { msg.innerHTML = "Adresse email invalide."; }
          else { msg.innerHTML = "Une erreur est survenue. Reessaie plus tard."; }
        });
      };
      return;
    }
    const doc = await db.collection("users").doc(user.uid).get();
    const data = doc.data();
    if (data && data.accountStatus === "pending") {
      const existing = document.getElementById("baa-login-overlay"); if (existing) existing.remove();
      if (!document.getElementById("baa-pending-msg")) {
        const msg = document.createElement("div"); msg.id = "baa-pending-msg";
        msg.style.cssText = "position:fixed;inset:0;background:rgba(248,243,238,0.97);z-index:99998;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Arial,sans-serif;text-align:center;padding:40px;";
        msg.innerHTML = "<div style='font-size:60px;margin-bottom:20px;'>🐦</div><h2 style='color:#8b735d;'>Compte en attente de validation</h2><p style='color:#666;max-width:400px;'>Ton inscription a bien ete recue. Tu recevras un email des que ton compte sera active.</p><div style='background:#fdf6ec;border:1px solid #e8d4b0;border-radius:12px;padding:14px 18px;max-width:400px;margin-top:16px;'><p style='color:#8b735d;font-size:13px;margin:0;'>📩 Pense a verifier tes spams / courriers indesirables, et ajoute notre adresse a tes contacts pour ne manquer aucun message de l Academie.</p></div><button onclick=\"firebase.auth().signOut()\" style='margin-top:30px;background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:10px 20px;border-radius:10px;cursor:pointer;font-size:14px;'>Se deconnecter</button>";
        document.body.appendChild(msg);
      }
      return;
    }
    if (data && data.accountStatus === "suspended") { auth.signOut(); return; }
    if (data && data.accountStatus === "active") {
      const existing = document.getElementById("baa-login-overlay"); if (existing) existing.remove();
      if (!window.__baaHeartbeatStarted) {
        window.__baaHeartbeatStarted = true;
        function envoyerHeartbeat() {
          if (auth.currentUser) {
            db.collection("users").doc(auth.currentUser.uid).update({ derniereActivite: new Date().toISOString(), derniereConnexion: new Date().toISOString() }).catch(function(e) {});
          }
        }
        envoyerHeartbeat();
        setInterval(envoyerHeartbeat, 60000);
      }
      if (!document.querySelector("#baa-menu-btn")) {
        const menuBtn = document.createElement("div");
        menuBtn.id = "baa-menu-btn";
        menuBtn.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:99999;width:44px;height:44px;border-radius:50%;background:#f3e7d3;border:1px solid rgba(200,169,107,0.5);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(200,169,107,0.3);overflow:hidden;";
        db.collection("users").doc(auth.currentUser.uid).get().then(function(snap) {
          const d = snap.data();
          if (d.photoURL) { menuBtn.innerHTML = "<img src='" + d.photoURL + "' style='width:100%;height:100%;object-fit:cover;' />"; }
          else { menuBtn.innerHTML = "<span style='color:#8a6a35;font-size:16px;font-weight:bold;font-family:Arial;'>" + (d.prenom ? d.prenom[0].toUpperCase() : "") + (d.nom ? d.nom[0].toUpperCase() : "") + "</span>"; }
        });
        menuBtn.onclick = function(e) {
          e.stopPropagation();
          const existing = document.getElementById("baa-side-menu"); if (existing) { existing.remove(); return; }
          const menu = document.createElement("div"); menu.id = "baa-side-menu";
          menu.style.cssText = "position:fixed;top:0;right:0;bottom:0;width:280px;background:#f8f3ee;z-index:999998;box-shadow:-4px 0 20px rgba(0,0,0,0.15);font-family:Arial,sans-serif;display:flex;flex-direction:column;";
          db.collection("users").doc(auth.currentUser.uid).get().then(function(snap) {
            const d = snap.data();
            var avatarHTML = d.photoURL ? "<img src='" + d.photoURL + "' style='width:70px;height:70px;border-radius:50%;object-fit:cover;border:3px solid #e8d4b0;' />" : "<div style='width:70px;height:70px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;border:3px solid #e8d4b0;'><span style='color:white;font-size:24px;font-weight:bold;'>" + (d.prenom ? d.prenom[0].toUpperCase() : "") + (d.nom ? d.nom[0].toUpperCase() : "") + "</span></div>";
            var adminItem = data.role === "admin" ? "<div class='baa-menu-item' id='menu-admin' style='display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;border-bottom:1px solid #f0e6d3;'><span style='font-size:20px;'>⚙️</span><span style='color:#8a6a35;font-size:15px;font-weight:600;'>Panneau Admin</span></div>" : "";
            menu.innerHTML = "<div style='background:linear-gradient(135deg,#f3e7d3,#e8d4b0);padding:24px 20px;display:flex;align-items:center;gap:16px;'>" + avatarHTML + "<div><div style='font-weight:bold;color:#3a3a3a;font-size:16px;'>" + (d.prenom || "") + " " + (d.nom || "") + "</div><div style='color:#8b735d;font-size:13px;margin-top:2px;'>" + (data.role === "admin" ? "Administratrice" : "Membre") + "</div></div><span id='close-side-menu' style='margin-left:auto;cursor:pointer;font-size:24px;color:#8b735d;'>✕</span></div><div style='flex:1;overflow-y:auto;'>" + adminItem + "<div class='baa-menu-item' id='menu-moncompte' style='display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;border-bottom:1px solid #f0e6d3;'><span style='font-size:20px;'>👤</span><span style='color:#8a6a35;font-size:15px;font-weight:600;'>Mon compte</span></div><div class='baa-menu-item' id='menu-carnet' style='display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;border-bottom:1px solid #f0e6d3;'><span style='font-size:20px;'>📋</span><span style='color:#8a6a35;font-size:15px;font-weight:600;'>Carnet clients</span></div><div class='baa-menu-item' id='menu-commandes' style='display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;border-bottom:1px solid #f0e6d3;'><span style='font-size:20px;'>📦</span><span style='color:#8a6a35;font-size:15px;font-weight:600;'>Suivi commandes</span></div><div class='baa-menu-item' id='menu-notes' style='display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;border-bottom:1px solid #f0e6d3;'><span style='font-size:20px;'>📝</span><span style='color:#8a6a35;font-size:15px;font-weight:600;'>Notes perso</span></div><div class='baa-menu-item' id='menu-outils' style='display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;border-bottom:1px solid #f0e6d3;'><span style='font-size:20px;'>🔧</span><span style='color:#8a6a35;font-size:15px;font-weight:600;'>Outils</span></div></div><div style='padding:16px 20px;border-top:1px solid #e8d4b0;'><div id='menu-deconnexion' style='display:flex;align-items:center;gap:14px;cursor:pointer;padding:12px 0;'><span style='font-size:20px;'>🚪</span><span style='color:#c0392b;font-size:15px;font-weight:600;'>Deconnexion</span></div></div>";
            document.body.appendChild(menu);
            document.getElementById("close-side-menu").onclick = function() { menu.remove(); };
            document.getElementById("menu-deconnexion").onclick = function() { auth.signOut(); menu.remove(); };
            document.querySelectorAll(".baa-menu-item").forEach(function(item) { item.onmouseenter = function() { item.style.background = "#f0e6d3"; }; item.onmouseleave = function() { item.style.background = "transparent"; }; });
            if (data.role === "admin") { document.getElementById("menu-admin").onclick = function() { menu.remove(); openAdminPanel(); }; }
            document.getElementById("menu-moncompte").onclick = function() { menu.remove(); openInfoPanel(); };
            document.getElementById("menu-carnet").onclick = function() { menu.remove(); openCarnetPanel(); };
            document.getElementById("menu-commandes").onclick = function() { menu.remove(); openCommandesPanel(); };
            document.getElementById("menu-notes").onclick = function() { menu.remove(); openNotesPanel(); };
            document.getElementById("menu-outils").onclick = function() { menu.remove(); openOutilsPanel(); };
          });
          document.body.appendChild(menu);
          document.addEventListener("click", function closeMenu(e) { if (!menu.contains(e.target) && e.target !== menuBtn) { menu.remove(); document.removeEventListener("click", closeMenu); } });
        };
        document.body.appendChild(menuBtn);
      }
      function openAdminPanel() {
        if (document.getElementById("baa-admin-panel")) return;
        const panel = document.createElement("div"); panel.id = "baa-admin-panel";
        panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:60px;";
        const box = document.createElement("div");
        box.style.cssText = "background:#f8f3ee;width:90%;max-width:700px;border-radius:20px;padding:30px;max-height:80vh;overflow-y:auto;font-family:Arial,sans-serif;";
        box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'><h2 style='color:#8b735d;margin:0;'>Panneau Admin</h2><span id='close-admin' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div style='display:flex;gap:10px;margin-bottom:20px;border-bottom:1px solid #e8d4b0;padding-bottom:12px;flex-wrap:wrap;'><button id='tab-pending' style='background:#c9a86a;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;'>En attente</button><button id='tab-all' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;'>Tous les membres</button><button id='tab-dashboard' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;'>Tableau de bord</button><button id='tab-quiz' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;'>Quiz</button><button id='tab-annonces' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;'>Annonces</button></div><div id='admin-members-list'><p style='color:#999;'>Chargement...</p></div>";
        panel.appendChild(box); document.body.appendChild(panel);
        document.getElementById("close-admin").onclick = function() { panel.remove(); var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click(); };
        function loadPending() {
          const list = document.getElementById("admin-members-list"); list.innerHTML = "<p style='color:#999;'>Chargement...</p>";
          db.collection("users").where("accountStatus", "==", "pending").get().then(function(snapshot) {
            if (snapshot.empty) { list.innerHTML = "<p style='color:#999;'>Aucun membre en attente.</p>"; return; }
            list.innerHTML = "";
            snapshot.forEach(function(docSnap) {
              const d = docSnap.data(); const uid = docSnap.id;
              const row = document.createElement("div"); row.id = "row-" + uid;
              row.style.cssText = "background:white;border-radius:12px;padding:16px 20px;margin-bottom:12px;border:1px solid #e8d4b0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;";
              row.innerHTML = "<div><div style='font-weight:bold;color:#3a3a3a;'>" + d.prenom + " " + d.nom + "</div><div style='color:#888;font-size:13px;'>" + d.email + "</div><div style='color:#bbb;font-size:12px;'>Inscrit le " + (d.createdAt ? new Date(d.createdAt.seconds * 1000).toLocaleDateString("fr-FR") : "-") + "</div></div><div style='display:flex;gap:8px;'><button id='accept-" + uid + "' style='background:#c9a86a;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:bold;'>Accepter</button><button id='refuse-" + uid + "' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:bold;'>Refuser</button></div>";
              list.appendChild(row);
              document.getElementById("accept-" + uid).onclick = function() {
                db.collection("users").doc(uid).update({ accountStatus: "active" }).then(function() {
                  emailjs.send("service_wr9mlhk", "template_wk2j4mg", { prenom: d.prenom, nom: d.nom, email: d.email, date: new Date().toLocaleDateString("fr-FR"), titre_message: "Bienvenue", corps_message: "Ton compte sur l Academie Beauty Addict vient d etre active. Tu peux maintenant te connecter et acceder a tout le contenu de l academie.", lien_action: "Ton envol vers la liberte commence maintenant." }).then(function() { console.log("Email bienvenue envoye"); }).catch(function(err) { console.log(err); });
                  document.getElementById("row-" + uid).remove();
                  if (document.getElementById("admin-members-list").children.length === 0) { document.getElementById("admin-members-list").innerHTML = "<p style='color:#999;'>Aucun membre en attente.</p>"; }
                });
              };
              document.getElementById("refuse-" + uid).onclick = function() {
                db.collection("users").doc(uid).update({ accountStatus: "suspended" }).then(function() {
                  document.getElementById("row-" + uid).remove();
                  if (document.getElementById("admin-members-list").children.length === 0) { document.getElementById("admin-members-list").innerHTML = "<p style='color:#999;'>Aucun membre en attente.</p>"; }
                });
              };
            });
          });
        }
        function loadAllMembers() {
          const list = document.getElementById("admin-members-list"); list.innerHTML = "<p style='color:#999;'>Chargement...</p>";
          db.collection("users").get().then(function(snapshot) {
            if (snapshot.empty) { list.innerHTML = "<p style='color:#999;'>Aucun membre.</p>"; return; }
            list.innerHTML = "";
            snapshot.forEach(function(docSnap) {
              const d = docSnap.data(); const uid = docSnap.id;
              const statusColor = d.accountStatus === "active" ? "#2ecc71" : d.accountStatus === "suspended" ? "#e74c3c" : "#f39c12";
              var estEnLigne = d.derniereActivite && (new Date() - new Date(d.derniereActivite)) < 120000;
              var badgeEnLigne = estEnLigne ? "<span style='background:#2ecc71;color:white;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:bold;margin-left:6px;'>🟢 En ligne</span>" : "";
              const row = document.createElement("div"); row.id = "row-all-" + uid;
              row.style.cssText = "background:white;border-radius:12px;padding:16px 20px;margin-bottom:12px;border:1px solid #e8d4b0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;";
              row.innerHTML = "<div><div style='font-weight:bold;color:#3a3a3a;'>" + d.prenom + " " + d.nom + badgeEnLigne + "</div><div style='color:#888;font-size:13px;'>" + d.email + "</div><div style='font-size:12px;margin-top:4px;'><span style='background:" + statusColor + ";color:white;padding:2px 8px;border-radius:10px;'>" + d.accountStatus + "</span></div></div><div style='display:flex;gap:8px;'><button id='block-" + uid + "' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>" + (d.accountStatus === "suspended" ? "Debloquer" : "Bloquer") + "</button><button id='delete-" + uid + "' style='background:#ffe8e8;color:#c0392b;border:1px solid #e74c3c;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Supprimer</button></div>";
              list.appendChild(row);
              document.getElementById("block-" + uid).onclick = function() { const newStatus = d.accountStatus === "suspended" ? "active" : "suspended"; db.collection("users").doc(uid).update({ accountStatus: newStatus }).then(function() { loadAllMembers(); }); };
              document.getElementById("delete-" + uid).onclick = function() { if (confirm("Supprimer definitivement " + d.prenom + " " + d.nom + " ?")) { db.collection("users").doc(uid).delete().then(function() { document.getElementById("row-all-" + uid).remove(); }); } };
            });
          });
        }
        function loadDashboard() {
          const list = document.getElementById("admin-members-list"); list.innerHTML = "<p style='color:#999;'>Chargement...</p>";
          const today = new Date().toDateString();
          db.collection("users").where("accountStatus", "==", "active").get().then(function(snapshot) {
            if (snapshot.empty) { list.innerHTML = "<p style='color:#999;'>Aucun membre actif.</p>"; return; }
            list.innerHTML = "";
            snapshot.forEach(function(docSnap) {
              const d = docSnap.data();
              const card = document.createElement("div"); card.style.cssText = "background:white;border-radius:12px;padding:16px 20px;margin-bottom:12px;border:1px solid #e8d4b0;";
              const derniereConnexion = d.derniereConnexion ? new Date(d.derniereConnexion).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "Jamais";
              var estEnLigneD = d.derniereActivite && (new Date() - new Date(d.derniereActivite)) < 120000;
              var badgeEnLigneD = estEnLigneD ? "<span style='background:#2ecc71;color:white;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:bold;margin-left:6px;'>🟢 En ligne</span>" : "";
              const checklistTotal = d.checklistTaches ? d.checklistTaches.length : 10;
              const checklistCochees = d.checklistCochees ? d.checklistCochees.length : 0;
              const checklistAujourdhui = d.checklistDate === today;
              const checklistText = checklistAujourdhui ? checklistCochees + "/" + checklistTotal + " taches" : "Checklist non commencee";
              const checklistColor = checklistAujourdhui && checklistCochees === checklistTotal ? "#2ecc71" : checklistAujourdhui ? "#c9a86a" : "#e74c3c";
              const objectif = d.suiviObjectif || 0; const realise = d.suiviRealise || 0;
              const pct = objectif > 0 ? Math.min(100, Math.round(realise / objectif * 100)) : 0;
              const taux = realise >= 100 ? 30 : 20; const commission = (realise * taux / 100).toFixed(2);
              var avatarAdmin = d.photoURL ? "<img src='" + d.photoURL + "' style='width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #e8d4b0;margin-right:12px;' />" : "<div style='width:40px;height:40px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;border:2px solid #e8d4b0;margin-right:12px;min-width:40px;'><span style='color:white;font-size:14px;font-weight:bold;'>" + (d.prenom ? d.prenom[0].toUpperCase() : "") + (d.nom ? d.nom[0].toUpperCase() : "") + "</span></div>";
              card.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px;'><div style='display:flex;align-items:center;'>" + avatarAdmin + "<div><div style='font-weight:bold;color:#3a3a3a;font-size:15px;'>" + d.prenom + " " + d.nom + badgeEnLigneD + "</div><div style='color:#888;font-size:12px;margin-top:2px;'>Derniere connexion : " + derniereConnexion + "</div></div><span style='background:" + checklistColor + ";color:white;padding:4px 10px;border-radius:10px;font-size:12px;font-weight:bold;'>" + checklistText + "</span></div><div style='display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;'><div style='text-align:center;padding:8px;background:#f8f3ee;border-radius:8px;'><div style='color:#888;font-size:11px;'>Objectif</div><div style='color:#3a3a3a;font-size:14px;font-weight:bold;'>" + (objectif || "-") + " euros</div></div><div style='text-align:center;padding:8px;background:#f8f3ee;border-radius:8px;'><div style='color:#888;font-size:11px;'>CA realise</div><div style='color:#3a3a3a;font-size:14px;font-weight:bold;'>" + (realise || "-") + " euros</div></div><div style='text-align:center;padding:8px;background:#f8f3ee;border-radius:8px;'><div style='color:#888;font-size:11px;'>Commission</div><div style='color:#c9a86a;font-size:14px;font-weight:bold;'>" + commission + " euros</div></div></div><div style='background:#f0e6d3;border-radius:20px;height:8px;overflow:hidden;'><div style='background:#c9a86a;height:100%;border-radius:20px;width:" + pct + "%;'></div></div><div style='text-align:right;color:#888;font-size:11px;margin-top:4px;'>" + pct + "% de l objectif</div>";
              list.appendChild(card);
            });
          });
        }
        function loadQuiz() {
          const list = document.getElementById("admin-members-list"); list.innerHTML = "<p style='color:#999;'>Chargement...</p>";
          db.collection("users").where("accountStatus", "==", "active").get().then(function(snapshot) {
            if (snapshot.empty) { list.innerHTML = "<p style='color:#999;'>Aucun membre actif.</p>"; return; }
            list.innerHTML = "";
            function humaniserNomQuiz(key) {
              var nom = key.replace(/^quiz/, "").replace(/Score$/, "");
              nom = nom.replace(/([A-Z])/g, " $1").trim();
              return nom;
            }
            snapshot.forEach(function(docSnap) {
              const d = docSnap.data();
              const card = document.createElement("div"); card.style.cssText = "background:white;border-radius:12px;padding:16px 20px;margin-bottom:12px;border:1px solid #e8d4b0;";
              var avatarAdmin = d.photoURL ? "<img src='" + d.photoURL + "' style='width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #e8d4b0;margin-right:12px;' />" : "<div style='width:40px;height:40px;border-radius:50%;background:#c9a86a;display:flex;align-items:center;justify-content:center;border:2px solid #e8d4b0;margin-right:12px;min-width:40px;'><span style='color:white;font-size:14px;font-weight:bold;'>" + (d.prenom ? d.prenom[0].toUpperCase() : "") + (d.nom ? d.nom[0].toUpperCase() : "") + "</span></div>";
              var quizKeys = Object.keys(d).filter(function(k) { return k.indexOf("quiz") === 0 && k.endsWith("Score"); });
              var quizBadgesHTML = "<div style='display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;'>";
              if (quizKeys.length === 0) {
                quizBadgesHTML += "<span style='color:#bbb;font-size:12px;'>Aucun quiz commence</span>";
              } else {
                quizKeys.sort().forEach(function(scoreKey) {
                  var baseName = scoreKey.replace(/Score$/, "");
                  var totalKey = baseName + "Total";
                  var completeKey = baseName + "Complete";
                  var label = humaniserNomQuiz(baseName);
                  var score = d[scoreKey];
                  var total = d[totalKey] || "?";
                  var bg, txt;
                  if (d[completeKey] === true) { bg = "#2ecc71"; txt = label + " : " + score + "/" + total + " ✓"; }
                  else { bg = "#f39c12"; txt = label + " : " + score + "/" + total; }
                  quizBadgesHTML += "<span style='background:" + bg + ";color:white;padding:4px 10px;border-radius:10px;font-size:11px;font-weight:bold;'>" + txt + "</span>";
                });
              }
              quizBadgesHTML += "</div>";
              card.innerHTML = "<div style='display:flex;align-items:center;'>" + avatarAdmin + "<div><div style='font-weight:bold;color:#3a3a3a;font-size:15px;'>" + d.prenom + " " + d.nom + "</div></div></div>" + quizBadgesHTML;
              list.appendChild(card);
            });
          });
        }
        document.getElementById("tab-pending").onclick = function() { document.getElementById("tab-pending").style.cssText += "background:#c9a86a;color:white;border:none;"; document.getElementById("tab-all").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-dashboard").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-quiz").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-annonces").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; loadPending(); };
        document.getElementById("tab-all").onclick = function() { document.getElementById("tab-all").style.cssText += "background:#c9a86a;color:white;border:none;"; document.getElementById("tab-pending").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-dashboard").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-quiz").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-annonces").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; loadAllMembers(); };
        document.getElementById("tab-dashboard").onclick = function() { document.getElementById("tab-dashboard").style.cssText += "background:#c9a86a;color:white;border:none;"; document.getElementById("tab-pending").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-all").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-quiz").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-annonces").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; loadDashboard(); };
        document.getElementById("tab-quiz").onclick = function() { document.getElementById("tab-quiz").style.cssText += "background:#c9a86a;color:white;border:none;"; document.getElementById("tab-pending").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-all").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-dashboard").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-annonces").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; loadQuiz(); };
        function loadAnnonces() {
          const list = document.getElementById("admin-members-list");
          list.innerHTML = "<div style='background:white;border-radius:14px;padding:20px;border:1px solid #e8d4b0;margin-bottom:16px;'><h3 style='color:#8b735d;margin:0 0 14px 0;font-size:15px;'>📚 Annoncer une nouvelle formation</h3><input id='annonce-formation-titre' placeholder='Titre de la formation' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;margin-bottom:10px;' /><textarea id='annonce-formation-desc' placeholder='Courte description de la formation' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;height:70px;resize:vertical;margin-bottom:10px;'></textarea><button id='envoyer-annonce-formation' style='width:100%;background:#c9a86a;color:white;border:none;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>Envoyer a toutes les membres</button><div id='annonce-formation-msg' style='color:#8b735d;font-size:13px;margin-top:8px;text-align:center;'></div></div><div style='background:white;border-radius:14px;padding:20px;border:1px solid #e8d4b0;'><h3 style='color:#8b735d;margin:0 0 14px 0;font-size:15px;'>🔧 Annoncer un nouvel outil</h3><input id='annonce-outil-nom' placeholder='Nom du nouvel outil' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;margin-bottom:10px;' /><textarea id='annonce-outil-desc' placeholder='A quoi sert cet outil ?' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;height:70px;resize:vertical;margin-bottom:10px;'></textarea><button id='envoyer-annonce-outil' style='width:100%;background:#c9a86a;color:white;border:none;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>Envoyer a toutes les membres</button><div id='annonce-outil-msg' style='color:#8b735d;font-size:13px;margin-top:8px;text-align:center;'></div></div><div style='background:white;border-radius:14px;padding:20px;border:1px solid #e8d4b0;margin-top:16px;'><h3 style='color:#8b735d;margin:0 0 14px 0;font-size:15px;'>📢 Envoyer une info importante</h3><input id='annonce-info-titre' placeholder='Titre de l info importante' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;margin-bottom:10px;' /><textarea id='annonce-info-desc' placeholder='Contenu du message...' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;height:70px;resize:vertical;margin-bottom:10px;'></textarea><button id='envoyer-annonce-info' style='width:100%;background:#c9a86a;color:white;border:none;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>Envoyer a toutes les membres</button><div id='annonce-info-msg' style='color:#8b735d;font-size:13px;margin-top:8px;text-align:center;'></div></div>";
          function envoyerATous(dataExtra, msgElId, btnElId) {
            var msgEl = document.getElementById(msgElId);
            var btnEl = document.getElementById(btnElId);
            btnEl.disabled = true; btnEl.innerText = "Envoi en cours...";
            msgEl.innerText = "";
            db.collection("users").where("accountStatus", "==", "active").get().then(function(snapshot) {
              if (snapshot.empty) { msgEl.innerText = "Aucune membre active."; btnEl.disabled = false; btnEl.innerText = "Envoyer a toutes les membres"; return; }
              var promises = [];
              emailjs.init("D_JtKhPDgOQWi_ECO");
              snapshot.forEach(function(docSnap) {
                var d = docSnap.data();
                var payload = Object.assign({ prenom: d.prenom, nom: d.nom, email: d.email, date: new Date().toLocaleDateString("fr-FR") }, dataExtra);
                promises.push(emailjs.send("service_wr9mlhk", "template_wk2j4mg", payload).catch(function(err) { console.log("Erreur envoi a " + d.email, err); }));
              });
              Promise.all(promises).then(function() {
                msgEl.innerText = "Email envoye a " + snapshot.size + " membre" + (snapshot.size > 1 ? "s" : "") + " !";
                btnEl.disabled = false; btnEl.innerText = "Envoyer a toutes les membres";
              });
            });
          }
          document.getElementById("envoyer-annonce-formation").onclick = function() {
            var titre = document.getElementById("annonce-formation-titre").value.trim();
            var desc = document.getElementById("annonce-formation-desc").value.trim();
            if (!titre) { alert("Merci de saisir un titre."); return; }
            envoyerATous({ titre_message: "Nouvelle formation disponible :", corps_message: titre + (desc ? " - " + desc : ""), lien_action: "Connecte-toi sur l Academie pour la decouvrir." }, "annonce-formation-msg", "envoyer-annonce-formation");
          };
          document.getElementById("envoyer-annonce-outil").onclick = function() {
            var nom = document.getElementById("annonce-outil-nom").value.trim();
            var desc = document.getElementById("annonce-outil-desc").value.trim();
            if (!nom) { alert("Merci de saisir un nom d outil."); return; }
            envoyerATous({ titre_message: "Nouvel outil disponible :", corps_message: nom + (desc ? " - " + desc : ""), lien_action: "Va dans la section Outils de l Academie pour l utiliser." }, "annonce-outil-msg", "envoyer-annonce-outil");
          };
          document.getElementById("envoyer-annonce-info").onclick = function() {
            var titre = document.getElementById("annonce-info-titre").value.trim();
            var desc = document.getElementById("annonce-info-desc").value.trim();
            if (!titre) { alert("Merci de saisir un titre."); return; }
            envoyerATous({ titre_message: "Info importante :", corps_message: titre + (desc ? " - " + desc : ""), lien_action: "Connecte-toi sur l Academie pour en savoir plus." }, "annonce-info-msg", "envoyer-annonce-info");
          };
        }
        document.getElementById("tab-annonces").onclick = function() { document.getElementById("tab-annonces").style.cssText += "background:#c9a86a;color:white;border:none;"; document.getElementById("tab-pending").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-all").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-dashboard").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; document.getElementById("tab-quiz").style.cssText += "background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;"; loadAnnonces(); };
        loadPending();
      }
      function openInfoPanel() {
        if (document.getElementById("baa-info-panel")) return;
        const panel = document.createElement("div"); panel.id = "baa-info-panel";
        panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:60px;";
        const box = document.createElement("div");
        box.style.cssText = "background:#f8f3ee;width:90%;max-width:500px;border-radius:20px;padding:30px;font-family:Arial,sans-serif;max-height:85vh;overflow-y:auto;";
        box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;'><h2 style='color:#8b735d;margin:0;'>Mes informations</h2><span id='close-info' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div style='display:flex;flex-direction:column;gap:14px;'><div><label style='color:#8b735d;font-size:13px;font-weight:bold;display:block;margin-bottom:4px;'>Prenom</label><input id='field-prenom' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:14px;box-sizing:border-box;' /></div><div><label style='color:#8b735d;font-size:13px;font-weight:bold;display:block;margin-bottom:4px;'>Nom</label><input id='field-nom' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:14px;box-sizing:border-box;' /></div><div><label style='color:#8b735d;font-size:13px;font-weight:bold;display:block;margin-bottom:4px;'>Date de naissance</label><input id='field-ddn' type='date' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:14px;box-sizing:border-box;' /></div><div><label style='color:#8b735d;font-size:13px;font-weight:bold;display:block;margin-bottom:4px;'>Email</label><input id='field-email' disabled style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:14px;background:#f0f0f0;box-sizing:border-box;' /></div><button id='save-info' style='background:#c9a86a;color:white;border:none;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;margin-top:8px;'>Sauvegarder</button><div id='info-msg' style='color:#8b735d;font-size:13px;text-align:center;'></div></div>";
        panel.appendChild(box); document.body.appendChild(panel);
        document.getElementById("close-info").onclick = function() { panel.remove(); var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click(); };
        const u = auth.currentUser;
        db.collection("users").doc(u.uid).get().then(function(snap) {
          const d = snap.data();
          document.getElementById("field-prenom").value = d.prenom || "";
          document.getElementById("field-nom").value = d.nom || "";
          document.getElementById("field-email").value = d.email || "";
          document.getElementById("field-ddn").value = d.dateNaissance || "";
        });
        db.collection("users").doc(auth.currentUser.uid).get().then(function(snapPhoto) {
          const dp = snapPhoto.data();
          const avatarDiv = document.createElement("div"); avatarDiv.style.cssText = "text-align:center;margin-bottom:20px;";
          var photoHTML = dp.photoURL ? "<img src='" + dp.photoURL + "' style='width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #e8d4b0;margin-bottom:12px;' />" : "<div style='width:80px;height:80px;border-radius:50%;background:#c9a86a;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;border:3px solid #e8d4b0;'><span style='color:white;font-size:24px;font-weight:bold;'>" + (dp.prenom ? dp.prenom[0].toUpperCase() : "") + (dp.nom ? dp.nom[0].toUpperCase() : "") + "</span></div>";
          avatarDiv.innerHTML = photoHTML + "<label style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;display:inline-block;'>Changer ma photo<input type='file' id='avatar-upload' accept='image/*' style='display:none;' /></label><div id='avatar-msg' style='color:#8b735d;font-size:12px;margin-top:8px;'></div>";
          box.insertBefore(avatarDiv, box.firstChild);
          document.getElementById("avatar-upload").onchange = async function() {
            const file = this.files[0]; if (!file) return;
            document.getElementById("avatar-msg").innerText = "Upload en cours...";
            const formData = new FormData(); formData.append("file", file); formData.append("upload_preset", "baa_avatars"); formData.append("folder", "avatars");
            try {
              const res = await fetch("https://api.cloudinary.com/v1_1/dxcfq3nyl/image/upload", { method: "POST", body: formData });
              const data = await res.json(); const url = data.secure_url;
              await db.collection("users").doc(auth.currentUser.uid).update({ photoURL: url });
              avatarDiv.querySelector("div, img").outerHTML = "<img src='" + url + "' style='width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #e8d4b0;margin-bottom:12px;' />";
              document.getElementById("avatar-msg").innerText = "Photo mise a jour !";
              const menuBtn = document.getElementById("baa-menu-btn"); if (menuBtn) menuBtn.innerHTML = "<img src='" + url + "' style='width:100%;height:100%;object-fit:cover;' />";
              setTimeout(function() { document.getElementById("avatar-msg").innerText = ""; }, 3000);
            } catch (e) { document.getElementById("avatar-msg").innerText = "Erreur lors de l upload."; }
          };
        });
        document.getElementById("save-info").onclick = function() {
          const u = auth.currentUser;
          db.collection("users").doc(u.uid).update({ prenom: document.getElementById("field-prenom").value.trim(), nom: document.getElementById("field-nom").value.trim(), dateNaissance: document.getElementById("field-ddn").value }).then(function() {
            document.getElementById("info-msg").innerText = "Informations sauvegardees !";
            setTimeout(function() { document.getElementById("info-msg").innerText = ""; }, 3000);
          });
        };
        var btnSuivi = document.createElement("button");
        btnSuivi.innerText = "🎯 Suivi objectif du mois";
        btnSuivi.style.cssText = "width:100%;background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;margin-top:16px;";
        btnSuivi.onclick = function() { panel.remove(); openSuiviObjectifPanel(); };
        box.appendChild(btnSuivi);
      }
      function openNotesPanel() {
        if (document.getElementById("baa-notes-panel")) return;
        const panel = document.createElement("div"); panel.id = "baa-notes-panel";
        panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:60px;";
        const box = document.createElement("div");
        box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;font-family:Arial,sans-serif;";
        box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'><h2 style='color:#8b735d;margin:0;'>Notes perso</h2><span id='close-notes' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><textarea id='notes-content' style='width:100%;height:300px;padding:14px;border:1px solid #e8d4b0;border-radius:12px;font-size:14px;font-family:Arial,sans-serif;resize:vertical;box-sizing:border-box;line-height:1.6;' placeholder='Ecris tes notes ici...'></textarea><div style='display:flex;justify-content:space-between;align-items:center;margin-top:12px;'><button id='save-notes' style='background:#c9a86a;color:white;border:none;padding:12px 24px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>Sauvegarder</button><div id='notes-msg' style='color:#8b735d;font-size:13px;'></div></div>";
        panel.appendChild(box); document.body.appendChild(panel);
        document.getElementById("close-notes").onclick = function() { panel.remove(); var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click(); };
        const uid = auth.currentUser.uid;
        db.collection("users").doc(uid).get().then(function(snap) { document.getElementById("notes-content").value = snap.data().notesPerso || ""; });
        document.getElementById("save-notes").onclick = function() {
          db.collection("users").doc(uid).update({ notesPerso: document.getElementById("notes-content").value }).then(function() {
            document.getElementById("notes-msg").innerText = "Notes sauvegardees !";
            setTimeout(function() { document.getElementById("notes-msg").innerText = ""; }, 3000);
          });
        };
      }
      function openCarnetPanel() {
        if (document.getElementById("baa-carnet-panel")) return;
        const panel = document.createElement("div"); panel.id = "baa-carnet-panel";
        panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:60px;";
        const box = document.createElement("div");
        box.style.cssText = "background:#f8f3ee;width:90%;max-width:700px;border-radius:20px;padding:30px;max-height:85vh;overflow-y:auto;font-family:Arial,sans-serif;";
        box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'><h2 style='color:#8b735d;margin:0;'>Carnet clients</h2><span id='close-carnet' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><button id='add-cliente-btn' style='background:#c9a86a;color:white;border:none;padding:10px 20px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;margin-bottom:20px;'>+ Ajouter une cliente</button><div id='carnet-form' style='display:none;background:white;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #e8d4b0;'><div style='display:grid;grid-template-columns:1fr 1fr;gap:12px;'><div><label style='color:#8b735d;font-size:12px;font-weight:bold;display:block;margin-bottom:4px;'>Prenom</label><input id='c-prenom' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;' /></div><div><label style='color:#8b735d;font-size:12px;font-weight:bold;display:block;margin-bottom:4px;'>Nom</label><input id='c-nom' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;' /></div><div><label style='color:#8b735d;font-size:12px;font-weight:bold;display:block;margin-bottom:4px;'>Telephone</label><input id='c-tel' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;' /></div><div><label style='color:#8b735d;font-size:12px;font-weight:bold;display:block;margin-bottom:4px;'>Email</label><input id='c-email' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;' /></div></div><div style='margin-top:12px;'><label style='color:#8b735d;font-size:12px;font-weight:bold;display:block;margin-bottom:4px;'>Adresse postale</label><input id='c-adresse' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;' /></div><div style='display:flex;gap:10px;margin-top:16px;'><button id='save-cliente' style='background:#c9a86a;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:13px;'>Sauvegarder</button><button id='cancel-cliente' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:13px;'>Annuler</button></div><input type='hidden' id='c-edit-id' /></div><div id='carnet-list'><p style='color:#999;'>Chargement...</p></div>";
        panel.appendChild(box); document.body.appendChild(panel);
        document.getElementById("close-carnet").onclick = function() { panel.remove(); var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click(); };
        const uid = auth.currentUser.uid;
        function loadClientes() {
          const list = document.getElementById("carnet-list"); list.innerHTML = "<p style='color:#999;'>Chargement...</p>";
          db.collection("users").doc(uid).collection("clientes").orderBy("nom").get().then(function(snapshot) {
            if (snapshot.empty) { list.innerHTML = "<p style='color:#999;'>Aucune cliente pour l instant.</p>"; return; }
            list.innerHTML = "";
            snapshot.forEach(function(docSnap) {
              const c = docSnap.data(); const cid = docSnap.id;
              const card = document.createElement("div"); card.style.cssText = "background:white;border-radius:12px;padding:16px 20px;margin-bottom:12px;border:1px solid #e8d4b0;";
              card.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:flex-start;'><div><div style='font-weight:bold;color:#3a3a3a;font-size:15px;'>" + c.prenom + " " + c.nom + "</div><div style='color:#888;font-size:13px;margin-top:4px;'>Tel: " + (c.tel || "-") + "</div><div style='color:#888;font-size:13px;'>Email: " + (c.email || "-") + "</div><div style='color:#888;font-size:13px;'>Adresse: " + (c.adresse || "-") + "</div></div><div style='display:flex;gap:8px;'><button id='edit-" + cid + "' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Modifier</button><button id='del-" + cid + "' style='background:#ffe8e8;color:#c0392b;border:1px solid #e74c3c;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Supprimer</button></div></div>";
              list.appendChild(card);
              document.getElementById("edit-" + cid).onclick = function() { document.getElementById("carnet-form").style.display = "block"; document.getElementById("c-prenom").value = c.prenom || ""; document.getElementById("c-nom").value = c.nom || ""; document.getElementById("c-tel").value = c.tel || ""; document.getElementById("c-email").value = c.email || ""; document.getElementById("c-adresse").value = c.adresse || ""; document.getElementById("c-edit-id").value = cid; document.getElementById("carnet-form").scrollIntoView({ behavior: "smooth" }); };
              document.getElementById("del-" + cid).onclick = function() { if (confirm("Supprimer " + c.prenom + " " + c.nom + " ?")) { db.collection("users").doc(uid).collection("clientes").doc(cid).delete().then(function() { loadClientes(); }); } };
            });
          });
        }
        document.getElementById("add-cliente-btn").onclick = function() { document.getElementById("carnet-form").style.display = "block"; document.getElementById("c-prenom").value = ""; document.getElementById("c-nom").value = ""; document.getElementById("c-tel").value = ""; document.getElementById("c-email").value = ""; document.getElementById("c-adresse").value = ""; document.getElementById("c-edit-id").value = ""; };
        document.getElementById("cancel-cliente").onclick = function() { document.getElementById("carnet-form").style.display = "none"; };
        document.getElementById("save-cliente").onclick = function() {
          const prenom = document.getElementById("c-prenom").value.trim(); const nom = document.getElementById("c-nom").value.trim();
          const tel = document.getElementById("c-tel").value.trim(); const email = document.getElementById("c-email").value.trim();
          const adresse = document.getElementById("c-adresse").value.trim(); const editId = document.getElementById("c-edit-id").value;
          if (!prenom || !nom) { alert("Prenom et nom obligatoires."); return; }
          const clienteData = { prenom: prenom, nom: nom, tel: tel, email: email, adresse: adresse };
          if (editId) { db.collection("users").doc(uid).collection("clientes").doc(editId).update(clienteData).then(function() { document.getElementById("carnet-form").style.display = "none"; loadClientes(); }); }
          else { db.collection("users").doc(uid).collection("clientes").add(clienteData).then(function() { document.getElementById("carnet-form").style.display = "none"; loadClientes(); }); }
        };
        loadClientes();
      }
      function openCommandesPanel() {
        if (document.getElementById("baa-commandes-panel")) return;
        const panel = document.createElement("div"); panel.id = "baa-commandes-panel";
        panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:60px;";
        const box = document.createElement("div");
        box.style.cssText = "background:#f8f3ee;width:90%;max-width:700px;border-radius:20px;padding:30px;max-height:85vh;overflow-y:auto;font-family:Arial,sans-serif;";
        box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'><h2 style='color:#8b735d;margin:0;'>Suivi commandes</h2><span id='close-commandes' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><button id='add-commande-btn' style='background:#c9a86a;color:white;border:none;padding:10px 20px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;margin-bottom:20px;'>+ Ajouter une commande</button><div id='commande-form' style='display:none;background:white;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #e8d4b0;'><div style='display:grid;grid-template-columns:1fr 1fr;gap:12px;'><div><label style='color:#8b735d;font-size:12px;font-weight:bold;display:block;margin-bottom:4px;'>Nom cliente</label><input id='cmd-cliente' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;' /></div><div><label style='color:#8b735d;font-size:12px;font-weight:bold;display:block;margin-bottom:4px;'>Produit commande</label><textarea id='cmd-produit' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;height:60px;resize:vertical;'></textarea></div><div><label style='color:#8b735d;font-size:12px;font-weight:bold;display:block;margin-bottom:4px;'>Date de commande</label><input id='cmd-date' type='date' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;' /></div><div><label style='color:#8b735d;font-size:12px;font-weight:bold;display:block;margin-bottom:4px;'>Montant euros</label><input id='cmd-montant' type='number' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;' /></div></div><div style='display:flex;gap:10px;margin-top:16px;'><button id='save-commande' style='background:#c9a86a;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:13px;'>Sauvegarder</button><button id='cancel-commande' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:13px;'>Annuler</button></div><input type='hidden' id='cmd-edit-id' /></div><div id='commandes-list'><p style='color:#999;'>Chargement...</p></div>";
        panel.appendChild(box); document.body.appendChild(panel);
        document.getElementById("close-commandes").onclick = function() { panel.remove(); var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click(); };
        const uid = auth.currentUser.uid;
        function loadCommandes() {
          const list = document.getElementById("commandes-list"); list.innerHTML = "<p style='color:#999;'>Chargement...</p>";
          db.collection("users").doc(uid).collection("commandes").orderBy("date", "desc").get().then(function(snapshot) {
            if (snapshot.empty) { list.innerHTML = "<p style='color:#999;'>Aucune commande pour l instant.</p>"; return; }
            list.innerHTML = "";
            snapshot.forEach(function(docSnap) {
              const c = docSnap.data(); const cid = docSnap.id;
              const card = document.createElement("div"); card.style.cssText = "background:white;border-radius:12px;padding:16px 20px;margin-bottom:12px;border:1px solid #e8d4b0;";
              card.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:flex-start;'><div><div style='font-weight:bold;color:#3a3a3a;font-size:15px;'>" + c.cliente + "</div><div style='color:#888;font-size:13px;margin-top:4px;'>Produit: " + c.produit + "</div><div style='color:#888;font-size:13px;'>Date: " + c.date + "</div><div style='color:#c9a86a;font-size:13px;font-weight:bold;'>Montant: " + c.montant + " euros</div></div><div style='display:flex;gap:8px;'><button id='edit-cmd-" + cid + "' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Modifier</button><button id='del-cmd-" + cid + "' style='background:#ffe8e8;color:#c0392b;border:1px solid #e74c3c;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Supprimer</button></div></div>";
              list.appendChild(card);
              document.getElementById("edit-cmd-" + cid).onclick = function() { document.getElementById("commande-form").style.display = "block"; document.getElementById("cmd-cliente").value = c.cliente || ""; document.getElementById("cmd-produit").value = c.produit || ""; document.getElementById("cmd-date").value = c.date || ""; document.getElementById("cmd-montant").value = c.montant || ""; document.getElementById("cmd-edit-id").value = cid; document.getElementById("commande-form").scrollIntoView({ behavior: "smooth" }); };
              document.getElementById("del-cmd-" + cid).onclick = function() { if (confirm("Supprimer cette commande ?")) { db.collection("users").doc(uid).collection("commandes").doc(cid).delete().then(function() { loadCommandes(); }); } };
            });
          });
        }
        document.getElementById("add-commande-btn").onclick = function() { document.getElementById("commande-form").style.display = "block"; document.getElementById("cmd-cliente").value = ""; document.getElementById("cmd-produit").value = ""; document.getElementById("cmd-date").value = ""; document.getElementById("cmd-montant").value = ""; document.getElementById("cmd-edit-id").value = ""; };
        document.getElementById("cancel-commande").onclick = function() { document.getElementById("commande-form").style.display = "none"; };
        document.getElementById("save-commande").onclick = function() {
          const cliente = document.getElementById("cmd-cliente").value.trim(); const produit = document.getElementById("cmd-produit").value.trim();
          const date = document.getElementById("cmd-date").value; const montant = document.getElementById("cmd-montant").value;
          const editId = document.getElementById("cmd-edit-id").value;
          if (!cliente || !produit) { alert("Nom cliente et produit obligatoires."); return; }
          const cmdData = { cliente: cliente, produit: produit, date: date, montant: montant };
          if (editId) { db.collection("users").doc(uid).collection("commandes").doc(editId).update(cmdData).then(function() { document.getElementById("commande-form").style.display = "none"; loadCommandes(); }); }
          else { db.collection("users").doc(uid).collection("commandes").add(cmdData).then(function() { document.getElementById("commande-form").style.display = "none"; loadCommandes(); }); }
        };
        loadCommandes();
      }
      function openOutilsPanel() {
        window.__baaOpenOutilsPanel = openOutilsPanel;
        if (document.getElementById("baa-outils-panel")) return;
        const panel = document.createElement("div"); panel.id = "baa-outils-panel";
        panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:60px;";
        const box = document.createElement("div");
        box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;max-height:85vh;overflow-y:auto;font-family:Arial,sans-serif;";
        box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'><h2 style='color:#8b735d;margin:0;'>Outils</h2><span id='close-outils' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div style='display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;border-bottom:1px solid #e8d4b0;padding-bottom:12px;'><button id='outil-tab-calcul' style='background:#c9a86a;color:white;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Calcul revenus</button><button id='outil-tab-equipe' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Calcul equipe</button><button id='outil-tab-objectif' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Simulateur</button><button id='outil-tab-checklist' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Checklist</button><button id='outil-tab-tunnel' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Tunnel vente</button><button id='outil-tab-quiz' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Quiz formation</button><button id='outil-tab-quiz2' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Quiz Module 2</button><button id='outil-tab-quiz3' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Quiz Module 3</button><button id='outil-tab-quiz4' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Quiz Module 4</button><button id='outil-tab-quiz5' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Quiz Module 5</button><button id='outil-tab-quiz6' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Quiz Module 6</button></div><div id='outil-calcul'><p style='color:#8b735d;font-size:14px;margin-bottom:20px;'>Simule tes revenus selon ton chiffre d affaires mensuel.</p><div style='background:white;border-radius:12px;padding:20px;border:1px solid #e8d4b0;'><div style='margin-bottom:16px;'><label style='color:#8b735d;font-size:13px;font-weight:bold;display:block;margin-bottom:8px;'>Ton chiffre d affaires mensuel (euros)</label><input id='ca-input' type='number' placeholder='Ex: 250' style='width:100%;padding:12px;border:1px solid #e8d4b0;border-radius:8px;font-size:16px;box-sizing:border-box;' /></div><button id='calc-btn' style='width:100%;background:#c9a86a;color:white;border:none;padding:14px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:15px;margin-bottom:20px;'>Calculer</button><div id='calc-result' style='display:none;background:#f8f3ee;border-radius:12px;padding:20px;border:1px solid #e8d4b0;text-align:center;'><div id='calc-taux' style='color:#8b735d;font-size:14px;margin-bottom:8px;'></div><div id='calc-commission' style='color:#c9a86a;font-size:32px;font-weight:bold;margin-bottom:8px;'></div><div id='calc-detail' style='color:#999;font-size:13px;'></div></div></div></div>";
        panel.appendChild(box); document.body.appendChild(panel);
        document.getElementById("close-outils").onclick = function() { panel.remove(); var mb = document.getElementById("baa-menu-btn"); if (mb) mb.click(); };
        document.getElementById("outil-tab-equipe").onclick = function() { panel.remove(); openCalculEquipePanel(); };
        document.getElementById("outil-tab-objectif").onclick = function() { panel.remove(); openSimulateurObjectifPanel(); };
        
        document.getElementById("outil-tab-checklist").onclick = function() { panel.remove(); openChecklistPanel(); };
        document.getElementById("outil-tab-tunnel").onclick = function() { panel.remove(); openTunnelVentePanel(); };
        document.getElementById("outil-tab-quiz").onclick = function() { panel.remove(); openQuizBonDemarrage(); };
        document.getElementById("outil-tab-quiz2").onclick = function() { panel.remove(); openQuizModule2(); };
        document.getElementById("outil-tab-quiz3").onclick = function() { panel.remove(); openQuizModule3(); };
        document.getElementById("outil-tab-quiz4").onclick = function() { panel.remove(); openQuizModule4(); };
        document.getElementById("outil-tab-quiz5").onclick = function() { panel.remove(); openQuizModule5(); };
        document.getElementById("outil-tab-quiz6").onclick = function() { panel.remove(); openQuizModule6(); };
        (function() {
          var quizUid = auth.currentUser ? auth.currentUser.uid : null;
          if (!quizUid) return;
          db.collection("users").doc(quizUid).get().then(function(snap) {
            var d = snap.data();
            if (!d) return;
            var quizBadges = [
              { id: "outil-tab-quiz", completeField: "quizBonDemarrageComplete", scoreField: "quizBonDemarrageScore", totalField: "quizBonDemarrageTotal", label: "Quiz formation" },
              { id: "outil-tab-quiz2", completeField: "quizModule2Complete", scoreField: "quizModule2Score", totalField: "quizModule2Total", label: "Quiz Module 2" },
              { id: "outil-tab-quiz3", completeField: "quizModule3Complete", scoreField: "quizModule3Score", totalField: "quizModule3Total", label: "Quiz Module 3" },
              { id: "outil-tab-quiz4", completeField: "quizModule4Complete", scoreField: "quizModule4Score", totalField: "quizModule4Total", label: "Quiz Module 4" },
              { id: "outil-tab-quiz5", completeField: "quizModule5Complete", scoreField: "quizModule5Score", totalField: "quizModule5Total", label: "Quiz Module 5" },
              { id: "outil-tab-quiz6", completeField: "quizModule6Complete", scoreField: "quizModule6Score", totalField: "quizModule6Total", label: "Quiz Module 6" }
            ];
            quizBadges.forEach(function(qb) {
              if (d[qb.completeField] === true) {
                var btn = document.getElementById(qb.id);
                if (btn) {
                  btn.innerHTML = "✓ " + qb.label + " (" + d[qb.scoreField] + "/" + d[qb.totalField] + ")";
                  btn.style.background = "#2ecc71";
                  btn.style.color = "white";
                  btn.style.border = "none";
                }
              }
            });
          });
        })();
        document.getElementById("calc-btn").onclick = function() {
          const ca = parseFloat(document.getElementById("ca-input").value);
          if (!ca || ca <= 0) { alert("Saisis un chiffre d affaires valide."); return; }
          const taux = ca >= 100 ? 30 : 20; const commission = ca * taux / 100;
          document.getElementById("calc-taux").innerText = "Taux applique : " + taux + "% " + (ca >= 100 ? "(palier 100 euros atteint)" : "(palier 100 euros non atteint)");
          document.getElementById("calc-commission").innerText = commission.toFixed(2) + " euros";
          document.getElementById("calc-detail").innerText = ca + " euros x " + taux + "% = " + commission.toFixed(2) + " euros de commission";
          document.getElementById("calc-result").style.display = "block";
        };
      }
      function openTunnelVentePanel() {
        if (document.getElementById("baa-tunnel-panel")) return;
        const panel = document.createElement("div"); panel.id = "baa-tunnel-panel";
        panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:60px;";
        const box = document.createElement("div");
        box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;max-height:85vh;overflow-y:auto;font-family:Arial,sans-serif;";
        box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'><h2 style='color:#8b735d;margin:0;'>Tunnel vente</h2><span id='close-tunnel' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><p style='color:#8b735d;font-size:14px;margin-bottom:20px;'>Selectionne ton objectif pour obtenir ta sequence de messages.</p><div style='display:flex;gap:10px;margin-bottom:24px;'><button id='tunnel-btn-vente' style='flex:1;background:#c9a86a;color:white;border:none;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>Vendre un produit</button><button id='tunnel-btn-recrutement' style='flex:1;background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>Recruter</button></div><div id='tunnel-vente-content'><p style='color:#8b735d;font-size:13px;margin-bottom:16px;font-weight:bold;'>Quel est le probleme de peau de ta prospect ?</p><div style='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;'><button class='prob-btn' data-prob='acne' style='background:white;border:1px solid #e8d4b0;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;color:#3a3a3a;'>Acne / Imperfections</button><button class='prob-btn' data-prob='secheresse' style='background:white;border:1px solid #e8d4b0;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;color:#3a3a3a;'>Peau seche</button><button class='prob-btn' data-prob='terne' style='background:white;border:1px solid #e8d4b0;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;color:#3a3a3a;'>Teint terne</button><button class='prob-btn' data-prob='rides' style='background:white;border:1px solid #e8d4b0;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;color:#3a3a3a;'>Rides / Anti-age</button><button class='prob-btn' data-prob='pores' style='background:white;border:1px solid #e8d4b0;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;color:#3a3a3a;'>Pores dilates</button><button class='prob-btn' data-prob='sensible' style='background:white;border:1px solid #e8d4b0;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;color:#3a3a3a;'>Peau sensible</button></div><div id='tunnel-messages' style='display:none;'></div></div><div id='tunnel-recrutement-content' style='display:none;'><p style='color:#8b735d;font-size:13px;margin-bottom:16px;font-weight:bold;'>Quelle est la situation de ta prospect ?</p><div style='display:flex;flex-direction:column;gap:8px;margin-bottom:16px;'><button class='recr-btn' data-recr='nouvelle' style='background:white;border:1px solid #e8d4b0;padding:12px;border-radius:10px;cursor:pointer;font-size:13px;color:#3a3a3a;text-align:left;'>Nouvelle personne - jamais entendu parler de Mihi</button><button class='recr-btn' data-recr='cliente' style='background:white;border:1px solid #e8d4b0;padding:12px;border-radius:10px;cursor:pointer;font-size:13px;color:#3a3a3a;text-align:left;'>Cliente satisfaite - utilise deja les produits</button><button class='recr-btn' data-recr='mlm' style='background:white;border:1px solid #e8d4b0;padding:12px;border-radius:10px;cursor:pointer;font-size:13px;color:#3a3a3a;text-align:left;'>Deja dans un autre MLM</button><button class='recr-btn' data-recr='hesitante' style='background:white;border:1px solid #e8d4b0;padding:12px;border-radius:10px;cursor:pointer;font-size:13px;color:#3a3a3a;text-align:left;'>Interesse mais hesitante</button></div><div id='recrutement-messages' style='display:none;'></div></div>";
        panel.appendChild(box); document.body.appendChild(panel);
        document.getElementById("close-tunnel").onclick = function() { panel.remove(); openOutilsPanel(); };
        document.getElementById("tunnel-btn-vente").onclick = function() { document.getElementById("tunnel-vente-content").style.display = "block"; document.getElementById("tunnel-recrutement-content").style.display = "none"; document.getElementById("tunnel-btn-vente").style.background = "#c9a86a"; document.getElementById("tunnel-btn-vente").style.color = "white"; document.getElementById("tunnel-btn-vente").style.border = "none"; document.getElementById("tunnel-btn-recrutement").style.background = "#f3e7d3"; document.getElementById("tunnel-btn-recrutement").style.color = "#8a6a35"; document.getElementById("tunnel-btn-recrutement").style.border = "1px solid #c8a96b"; };
        document.getElementById("tunnel-btn-recrutement").onclick = function() { document.getElementById("tunnel-recrutement-content").style.display = "block"; document.getElementById("tunnel-vente-content").style.display = "none"; document.getElementById("tunnel-btn-recrutement").style.background = "#c9a86a"; document.getElementById("tunnel-btn-recrutement").style.color = "white"; document.getElementById("tunnel-btn-recrutement").style.border = "none"; document.getElementById("tunnel-btn-vente").style.background = "#f3e7d3"; document.getElementById("tunnel-btn-vente").style.color = "#8a6a35"; document.getElementById("tunnel-btn-vente").style.border = "1px solid #c8a96b"; };
        var messagesVente = {
          acne: [{etape:"Message 1 - Repondre a la curiosite",msg:"Merci pour ton message ! Les produits Mihi ont vraiment transforme ma peau. Mais avant de te recommander quoi que ce soit, dis-moi : qu est-ce qui te derange le plus dans ta peau en ce moment ? Les imperfections, les rougeurs, les cicatrices ?"},{etape:"Message 2 - Conseiller le produit adapte",msg:"Je comprends totalement, c est tellement frustrant ! Pour les imperfections, j ai justement [produit] qui a fait des merveilles sur ma peau et sur celles de mes clientes. En quelques semaines, les resultats sont vraiment visibles. Tu veux que je t en dise plus ?"},{etape:"Message 3 - Proposer",msg:"Ce que j adore avec ce produit c est qu il [benefice principal]. Je t accompagne dans ta routine si tu veux qu on essaie ensemble - je suis la pour repondre a toutes tes questions !"},{etape:"Message 4 - Suivi J+7",msg:"Coucou ! Comment tu trouves le produit depuis une semaine ? Tu vois deja des petits changements ? N hesite pas a me dire si tu as des questions sur ton utilisation."},{etape:"Message 5 - Suivi J+30",msg:"Un mois deja ! J espere que ta peau te fait de belles surprises. Si tu es contente des resultats, j ai quelque chose d interessant a te partager sur comment profiter encore plus des produits Mihi..."}],
          secheresse: [{etape:"Message 1 - Repondre a la curiosite",msg:"Merci pour ton message ! Les produits Mihi ont vraiment transforme ma peau. Avant de te recommander quoi que ce soit, dis-moi : ta peau te tire, elle est inconfortable, elle peele ?"},{etape:"Message 2 - Conseiller le produit adapte",msg:"Ah je vois exactement de quoi tu parles ! Pour la secheresse, [produit] est vraiment exceptionnel - il hydrate en profondeur sans graisser. Mes clientes qui avaient la peau tres seche n en reviennent pas des resultats !"},{etape:"Message 3 - Proposer",msg:"L avantage de ce soin c est qu il [benefice]. Tu veux qu on essaie ensemble ? Je suis la pour t accompagner et m assurer que tu utilises le produit de la meilleure facon possible."},{etape:"Message 4 - Suivi J+7",msg:"Coucou ! Une semaine avec ton nouveau soin, c est comment ? Tu sens deja une difference au niveau du confort de ta peau ?"},{etape:"Message 5 - Suivi J+30",msg:"Ca fait un mois maintenant ! J espere que ta peau est bien plus confortable. Si tu es satisfaite, j ai quelque chose d interessant a te partager..."}],
          terne: [{etape:"Message 1 - Repondre a la curiosite",msg:"Merci pour ton message ! Ma peau a vraiment change depuis que j utilise Mihi. Dis-moi, qu est-ce qui te deplait dans ton teint - il est terne, gris, pas eclaire ?"},{etape:"Message 2 - Conseiller le produit adapte",msg:"Je comprends tellement ! Un teint sans eclat ca plombe le moral. [Produit] est vraiment mon chouchou pour ca - il donne un eclat naturel et unifie le teint. Mes clientes m envoient des photos de leur peau et je suis a chaque fois bluffee !"},{etape:"Message 3 - Proposer",msg:"Ce que j adore c est qu on voit la difference tres rapidement. Tu veux qu on essaie ensemble ? Je t explique comment l utiliser pour des resultats optimaux."},{etape:"Message 4 - Suivi J+7",msg:"Coucou ! Comment se passe la premiere semaine ? Tu te sens deja plus rayonnante ?"},{etape:"Message 5 - Suivi J+30",msg:"Un mois ! Est-ce que les gens autour de toi ont remarque quelque chose de different ? Si tu es ravie, j ai une petite surprise a te partager..."}],
          rides: [{etape:"Message 1 - Repondre a la curiosite",msg:"Merci pour ton message ! Mihi a vraiment change ma peau et mon rapport au miroir. Dis-moi, ce qui te preoccupe c est quoi exactement - les rides d expression, le manque de fermete, le relachement ?"},{etape:"Message 2 - Conseiller le produit adapte",msg:"Je te comprends tellement. Pour l anti-age, [produit] est vraiment impressionnant - il agit sur [benefice] et les resultats sont visibles en quelques semaines. J ai des clientes de 50 ans qui ne jurent que par lui !"},{etape:"Message 3 - Proposer",msg:"La cle c est la regularite et la bonne technique d application. Tu veux qu on commence ensemble ? Je te guide etape par etape."},{etape:"Message 4 - Suivi J+7",msg:"Coucou ! Comment tu trouves le produit ? Ta peau te parait deja un peu plus tonique ?"},{etape:"Message 5 - Suivi J+30",msg:"Un mois avec ton nouveau rituel ! J espere que tu vois de belles evolutions. Si tu es contente, j ai quelque chose d interessant a te partager..."}],
          pores: [{etape:"Message 1 - Repondre a la curiosite",msg:"Merci pour ton message ! Les produits Mihi ont vraiment ameliore ma peau. Dis-moi, tes pores dilates c est surtout sur le nez, les joues, le front ?"},{etape:"Message 2 - Conseiller le produit adapte",msg:"Ah oui je connais bien ce probleme ! [Produit] est vraiment efficace pour affiner le grain de peau et reduire l aspect des pores. Mes clientes qui avaient ce souci ont ete bluffees par les resultats en quelques semaines !"},{etape:"Message 3 - Proposer",msg:"Tu veux qu on essaie ensemble ? Je t explique comment l utiliser pour des resultats optimaux et je suis la si tu as des questions."},{etape:"Message 4 - Suivi J+7",msg:"Coucou ! Une semaine avec le soin, tu vois deja une difference sur tes pores ?"},{etape:"Message 5 - Suivi J+30",msg:"Un mois ! Ta peau s est affinee ? Si tu es satisfaite, j ai quelque chose d interessant a te montrer..."}],
          sensible: [{etape:"Message 1 - Repondre a la curiosite",msg:"Merci pour ton message ! Mihi a vraiment revolutionne ma routine. Dis-moi, ta peau sensible c est comment - elle rougit facilement, elle reagit aux produits, elle chauffe ?"},{etape:"Message 2 - Conseiller le produit adapte",msg:"Je comprends comme c est complique avec une peau sensible ! [Produit] est ideal pour les peaux reactives - il est doux, sans ingredients agressifs et apaise vraiment la peau. Plusieurs de mes clientes avec des peaux sensibles l ont adopte !"},{etape:"Message 3 - Proposer",msg:"L important c est d y aller doucement au debut. Je t accompagne dans ton introduction au produit pour m assurer que ta peau reagit bien."},{etape:"Message 4 - Suivi J+7",msg:"Coucou ! Comment se passe la premiere semaine ? Ta peau supporte bien le produit ?"},{etape:"Message 5 - Suivi J+30",msg:"Un mois ! Ta peau est plus calme ? Si tu es ravie, j ai quelque chose d interessant a partager avec toi..."}]
        };
        var messagesRecrutement = {
          nouvelle: [{etape:"Message 1 - Creer la curiosite",msg:"Dis-moi, est-ce que tu serais ouverte a gagner un peu d argent en partageant des produits que tu aimes ? Je te pose la question parce que tu m as l air d etre quelqu un qui prend soin d elle et qui saurait en parler naturellement."},{etape:"Message 2 - Presenter simplement",msg:"Je travaille avec Mihi, une marque de cosmetiques haut de gamme. C est pas du tout du porte-a-porte ou des reunions obligatoires - on partage juste ce qu on aime, principalement sur les reseaux. Je travaille depuis chez moi en quelques heures par semaine. Tu voudrais qu on en parle ?"},{etape:"Message 3 - Lever les doutes",msg:"Je comprends si tu as des questions ou des doutes - c etait pareil pour moi au debut ! Ce qui m a convaincue c est que Mihi ce n est pas du forcing - on attire les gens naturellement avec du contenu authentique. Et tu commences sans stock, sans investissement lourd."},{etape:"Message 4 - Inviter a decouvrir",msg:"Je t invite a regarder mon profil pour voir comment je travaille au quotidien - c est la meilleure facon de comprendre le concept. Et si tu as des questions apres, je suis la pour y repondre sans pression."}],
          cliente: [{etape:"Message 1 - Ouvrir la conversation",msg:"Coucou ! Je suis tellement contente que les produits te plaisent. Je voulais te poser une question... est-ce que tu en parles autour de toi depuis que tu les utilises ?"},{etape:"Message 2 - Proposer l opportunite",msg:"Je te demande ca parce que beaucoup de mes clientes qui adorent les produits ont commence a les recommander naturellement et a gagner de l argent avec. Toi qui es deja convaincue par les resultats, tu aurais tout pour le faire ! Ca t interesserait d en savoir plus ?"},{etape:"Message 3 - Expliquer les avantages",msg:"L avantage c est que tu connais deja les produits, tu les utilises, tu peux temoigner de vrais resultats. C est ca la force - pas besoin d inventer, tu partages juste ton experience. Et tu beneficies en plus de tes produits a prix coute !"},{etape:"Message 4 - Conclure",msg:"Si tu veux en savoir plus sur comment ca fonctionne, je peux t expliquer tout ca en 15 minutes. Sans engagement et sans pression - juste pour que tu aies toutes les infos pour decider."}],
          mlm: [{etape:"Message 1 - Respecter son choix",msg:"Ah super, tu as deja de l experience dans la vente directe ! C est vraiment un avantage. Je suis curieuse - tu es satisfaite de tes revenus actuellement ?"},{etape:"Message 2 - Planter la graine",msg:"Je te demande ca parce que beaucoup de personnes que je connais combinent plusieurs activites ou changent quand ils trouvent quelque chose qui correspond mieux a leur style de vie. Les produits beaute et skincare ont un enorme potentiel en ce moment sur les reseaux."},{etape:"Message 3 - Proposer sans forcer",msg:"En tout cas si jamais tu es curieuse de voir comment fonctionne Mihi, je suis la pour t en parler. Pas pour te convaincre de quitter ce que tu fais - juste pour que tu aies les infos si un jour tu cherches une nouvelle opportunite."}],
          hesitante: [{etape:"Message 1 - Identifier le frein",msg:"Je comprends totalement l hesitation ! C est quoi qui te retient le plus - tu manques de temps, tu ne te sens pas a l aise pour vendre, tu as peur de ne pas y arriver ?"},{etape:"Message 2 - Repondre au frein",msg:"Je te rassure, on part toutes de zero et on apprend ensemble. Moi aussi j avais exactement les memes doutes avant de me lancer. Ce qui m a aidee c est l accompagnement de l equipe - on n est jamais seule. Et tu commences a ton rythme, sans pression de resultats."},{etape:"Message 3 - Proposer un premier pas",msg:"Tu sais ce que je te propose ? Prends le temps de regarder mes stories et ma facon de travailler pendant une semaine. Ca te donnera une vraie idee de ce que c est au quotidien. Et apres si tu as encore des questions, on en reparle !"},{etape:"Message 4 - Relancer avec bienveillance",msg:"Coucou ! Je voulais juste prendre de tes nouvelles. Pas de pression du tout - si c est pas le bon moment pour toi c est tout a fait ok. Mais si un jour tu veux en savoir plus, je suis la !"}]
        };
        function afficherMessages(msgs, containerId) {
          var html = "<div style='margin-top:16px;'>";
          msgs.forEach(function(m) { html += "<div style='background:white;border-radius:12px;padding:16px;margin-bottom:12px;border:1px solid #e8d4b0;'><div style='color:#c9a86a;font-size:12px;font-weight:bold;margin-bottom:8px;'>" + m.etape + "</div><div style='color:#3a3a3a;font-size:13px;line-height:1.6;margin-bottom:10px;'>" + m.msg + "</div><button onclick='var t=this;navigator.clipboard.writeText(this.previousElementSibling.innerText).then(function(){t.innerText=\"Copie !\";setTimeout(function(){t.innerText=\"Copier\"},2000)});' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:6px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;'>Copier</button></div>"; });
          html += "</div>";
          document.getElementById(containerId).innerHTML = html; document.getElementById(containerId).style.display = "block";
        }
        document.querySelectorAll(".prob-btn").forEach(function(btn) { btn.onclick = function() { document.querySelectorAll(".prob-btn").forEach(function(b) { b.style.background = "white"; b.style.border = "1px solid #e8d4b0"; b.style.color = "#3a3a3a"; }); btn.style.background = "#c9a86a"; btn.style.color = "white"; btn.style.border = "none"; afficherMessages(messagesVente[btn.getAttribute("data-prob")], "tunnel-messages"); }; });
        document.querySelectorAll(".recr-btn").forEach(function(btn) { btn.onclick = function() { document.querySelectorAll(".recr-btn").forEach(function(b) { b.style.background = "white"; b.style.border = "1px solid #e8d4b0"; b.style.color = "#3a3a3a"; }); btn.style.background = "#c9a86a"; btn.style.color = "white"; btn.style.border = "none"; afficherMessages(messagesRecrutement[btn.getAttribute("data-recr")], "recrutement-messages"); }; });
      }
      function openChecklistPanel() {
        if (document.getElementById("baa-checklist-panel")) return;
        const panel = document.createElement("div"); panel.id = "baa-checklist-panel";
        panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:60px;";
        const box = document.createElement("div");
        box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;max-height:85vh;overflow-y:auto;font-family:Arial,sans-serif;";
        box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'><h2 style='color:#8b735d;margin:0;'>Checklist du jour</h2><span id='close-checklist' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div id='checklist-progress-bar-container' style='margin-bottom:20px;'><div style='display:flex;justify-content:space-between;margin-bottom:6px;'><span style='color:#8b735d;font-size:13px;'>Progression</span><span id='checklist-pct' style='color:#8b735d;font-size:13px;font-weight:bold;'>0%</span></div><div style='background:#f0e6d3;border-radius:20px;height:14px;overflow:hidden;'><div id='checklist-barre' style='background:#c9a86a;height:100%;border-radius:20px;width:0%;transition:width 0.4s ease;'></div></div></div><div id='checklist-items'></div><div style='margin-top:20px;border-top:1px solid #e8d4b0;padding-top:16px;'><label style='color:#8b735d;font-size:13px;font-weight:bold;display:block;margin-bottom:8px;'>Ajouter une tache perso</label><div style='display:flex;gap:8px;'><input id='new-task-input' placeholder='Ex: Envoyer un email...' style='flex:1;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;' /><button id='add-task-btn' style='background:#c9a86a;color:white;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:13px;'>+</button></div></div>";
        panel.appendChild(box); document.body.appendChild(panel);
        document.getElementById("close-checklist").onclick = function() { panel.remove(); openOutilsPanel(); };
        const uid = auth.currentUser.uid;
        const today = new Date().toDateString();
        const tachesBase = ["Poster sur les reseaux (1-2 posts)","Stories (minimum 5)","Story face camera (minimum 2)","Contacter 3 prospects","Relancer une cliente","Partager un temoignage","Prendre soin de soi","Session sur le Refuge du Phenix","Ajouter 3 personnes en ami","Noter sa victoire du jour"];
        function mettreAJourProgression(taches, cochees) {
          const pct = taches.length === 0 ? 0 : Math.round(cochees.length / taches.length * 100);
          document.getElementById("checklist-pct").innerText = pct + "%";
          document.getElementById("checklist-barre").style.width = pct + "%";
          document.getElementById("checklist-barre").style.background = pct === 100 ? "#2ecc71" : "#c9a86a";
        }
        function afficherTaches(taches, cochees) {
          const container = document.getElementById("checklist-items"); container.innerHTML = "";
          taches.forEach(function(tache, index) {
            const estCochee = cochees.indexOf(tache) !== -1; const estPerso = tachesBase.indexOf(tache) === -1;
            const item = document.createElement("div");
            item.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:" + (estCochee ? "#f0f8f0" : "white") + ";border-radius:10px;margin-bottom:8px;border:1px solid " + (estCochee ? "#2ecc71" : "#e8d4b0") + ";cursor:pointer;";
            item.innerHTML = "<div style='display:flex;align-items:center;gap:12px;flex:1;'><div style='width:22px;height:22px;border-radius:50%;border:2px solid " + (estCochee ? "#2ecc71" : "#c8a96b") + ";background:" + (estCochee ? "#2ecc71" : "transparent") + ";display:flex;align-items:center;justify-content:center;min-width:22px;'>" + (estCochee ? "<span style='color:white;font-size:12px;font-weight:bold;'>v</span>" : "") + "</div><span style='color:" + (estCochee ? "#888" : "#3a3a3a") + ";font-size:14px;text-decoration:" + (estCochee ? "line-through" : "none") + ";'>" + tache + "</span></div>" + (estPerso ? "<span id='del-task-" + index + "' style='color:#c0392b;font-size:16px;cursor:pointer;padding-left:8px;'>X</span>" : "");
            container.appendChild(item);
            item.onclick = function(e) {
              if (e.target.id === "del-task-" + index) return;
              var newCochees = cochees.slice();
              if (estCochee) { newCochees.splice(newCochees.indexOf(tache), 1); } else { newCochees.push(tache); }
              db.collection("users").doc(uid).update({ checklistDate: today, checklistCochees: newCochees, checklistTaches: taches }).then(function() { afficherTaches(taches, newCochees); mettreAJourProgression(taches, newCochees); });
            };
            if (estPerso) {
              var delBtn = document.getElementById("del-task-" + index);
              if (delBtn) { delBtn.onclick = function(e) { e.stopPropagation(); var newTaches = taches.filter(function(t) { return t !== tache; }); var newCochees = cochees.filter(function(c) { return c !== tache; }); db.collection("users").doc(uid).update({ checklistDate: today, checklistCochees: newCochees, checklistTaches: newTaches }).then(function() { afficherTaches(newTaches, newCochees); mettreAJourProgression(newTaches, newCochees); }); }; }
            }
          });
        }
        db.collection("users").doc(uid).get().then(function(snap) {
          const d = snap.data(); var taches = tachesBase.slice(); var cochees = [];
          if (d.checklistDate === today) { cochees = d.checklistCochees || []; var tachesPerso = (d.checklistTaches || []).filter(function(t) { return tachesBase.indexOf(t) === -1; }); taches = tachesBase.concat(tachesPerso); }
          else { db.collection("users").doc(uid).update({ checklistDate: today, checklistCochees: [], checklistTaches: tachesBase }); }
          afficherTaches(taches, cochees); mettreAJourProgression(taches, cochees);
        });
        document.getElementById("add-task-btn").onclick = function() {
          const input = document.getElementById("new-task-input"); const newTask = input.value.trim(); if (!newTask) return;
          db.collection("users").doc(uid).get().then(function(snap) {
            const d = snap.data(); var taches = d.checklistTaches || tachesBase.slice(); var cochees = d.checklistCochees || [];
            if (taches.indexOf(newTask) !== -1) { alert("Cette tache existe deja."); return; }
            taches.push(newTask);
            db.collection("users").doc(uid).update({ checklistDate: today, checklistCochees: cochees, checklistTaches: taches }).then(function() { input.value = ""; afficherTaches(taches, cochees); mettreAJourProgression(taches, cochees); });
          });
        };
      }
      function openSuiviObjectifPanel() {
        if (document.getElementById("baa-suivi-panel")) return;
        const panel = document.createElement("div"); panel.id = "baa-suivi-panel";
        panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:60px;";
        const box = document.createElement("div");
        box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;max-height:85vh;overflow-y:auto;font-family:Arial,sans-serif;";
        box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'><h2 style='color:#8b735d;margin:0;'>Suivi objectif</h2><span id='close-suivi' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div style='background:white;border-radius:12px;padding:20px;border:1px solid #e8d4b0;margin-bottom:16px;'><div style='margin-bottom:14px;'><label style='color:#8b735d;font-size:13px;font-weight:bold;display:block;margin-bottom:8px;'>Objectif CA du mois (euros)</label><input id='suivi-objectif' type='number' placeholder='Ex: 500' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:14px;box-sizing:border-box;' /></div><div style='margin-bottom:14px;'><label style='color:#8b735d;font-size:13px;font-weight:bold;display:block;margin-bottom:8px;'>CA realise a ce jour (euros)</label><input id='suivi-realise' type='number' placeholder='Ex: 180' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:14px;box-sizing:border-box;' /></div><div style='display:flex;gap:10px;'><button id='save-suivi' style='flex:1;background:#c9a86a;color:white;border:none;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>Sauvegarder</button><button id='reset-suivi' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:12px 16px;border-radius:10px;cursor:pointer;font-size:13px;'>Nouveau mois</button></div><div id='suivi-save-msg' style='color:#8b735d;font-size:13px;text-align:center;margin-top:8px;'></div></div><div id='suivi-result' style='display:none;'></div>";
        panel.appendChild(box); document.body.appendChild(panel);
        document.getElementById("close-suivi").onclick = function() { panel.remove(); openInfoPanel(); };
        const uid = auth.currentUser.uid;
        function afficherProgression(objectif, realise) {
          if (!objectif || objectif <= 0) return;
          const pct = Math.min(100, Math.round(realise / objectif * 100)); const reste = Math.max(0, objectif - realise);
          const taux = realise >= 100 ? 30 : 20; const commission = realise * taux / 100;
          var message = pct >= 100 ? "Objectif atteint ! Bravo !" : pct >= 75 ? "Tu y es presque, continue !" : pct >= 50 ? "Bonne progression, ne lache rien !" : pct >= 25 ? "Tu es sur la bonne voie !" : "C est parti, chaque vente compte !";
          var couleurBarre = pct >= 100 ? "#2ecc71" : pct >= 50 ? "#c9a86a" : "#f39c12";
          var html = "<div style='background:white;border-radius:12px;padding:20px;border:1px solid #e8d4b0;margin-bottom:12px;'><div style='display:flex;justify-content:space-between;margin-bottom:8px;'><span style='color:#8b735d;font-size:13px;font-weight:bold;'>Progression</span><span style='color:#8b735d;font-size:13px;font-weight:bold;'>" + pct + "%</span></div><div style='background:#f0e6d3;border-radius:20px;height:20px;margin-bottom:16px;overflow:hidden;'><div style='background:" + couleurBarre + ";height:100%;border-radius:20px;width:" + pct + "%;'></div></div><div style='display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;'><div style='text-align:center;padding:12px;background:#f8f3ee;border-radius:10px;'><div style='color:#888;font-size:12px;'>CA realise</div><div style='color:#3a3a3a;font-size:18px;font-weight:bold;'>" + realise + " euros</div></div><div style='text-align:center;padding:12px;background:#f8f3ee;border-radius:10px;'><div style='color:#888;font-size:12px;'>Reste a faire</div><div style='color:#3a3a3a;font-size:18px;font-weight:bold;'>" + reste + " euros</div></div><div style='text-align:center;padding:12px;background:#f8f3ee;border-radius:10px;'><div style='color:#888;font-size:12px;'>Commission</div><div style='color:#c9a86a;font-size:18px;font-weight:bold;'>" + commission.toFixed(2) + " euros</div></div><div style='text-align:center;padding:12px;background:#f8f3ee;border-radius:10px;'><div style='color:#888;font-size:12px;'>Taux</div><div style='color:#c9a86a;font-size:18px;font-weight:bold;'>" + taux + "%</div></div></div><div style='text-align:center;color:#8b735d;font-size:14px;font-weight:bold;'>" + message + "</div></div>";
          document.getElementById("suivi-result").innerHTML = html; document.getElementById("suivi-result").style.display = "block";
        }
        db.collection("users").doc(uid).get().then(function(snap) { const d = snap.data(); if (d.suiviObjectif) { document.getElementById("suivi-objectif").value = d.suiviObjectif || ""; document.getElementById("suivi-realise").value = d.suiviRealise || ""; afficherProgression(d.suiviObjectif, d.suiviRealise || 0); } });
        document.getElementById("save-suivi").onclick = function() {
          const objectif = parseFloat(document.getElementById("suivi-objectif").value); const realise = parseFloat(document.getElementById("suivi-realise").value) || 0;
          if (!objectif || objectif <= 0) { alert("Saisis un objectif valide."); return; }
          db.collection("users").doc(uid).update({ suiviObjectif: objectif, suiviRealise: realise }).then(function() { document.getElementById("suivi-save-msg").innerText = "Sauvegarde !"; setTimeout(function() { document.getElementById("suivi-save-msg").innerText = ""; }, 3000); afficherProgression(objectif, realise); });
        };
        document.getElementById("reset-suivi").onclick = function() { if (confirm("Remettre a zero pour un nouveau mois ?")) { db.collection("users").doc(uid).update({ suiviObjectif: 0, suiviRealise: 0 }).then(function() { document.getElementById("suivi-objectif").value = ""; document.getElementById("suivi-realise").value = ""; document.getElementById("suivi-result").style.display = "none"; }); } };
      }
      function openSimulateurObjectifPanel() {
        if (document.getElementById("baa-objectif-panel")) return;
        const panel = document.createElement("div"); panel.id = "baa-objectif-panel";
        panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:60px;";
        const box = document.createElement("div");
        box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;max-height:85vh;overflow-y:auto;font-family:Arial,sans-serif;";
        box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'><h2 style='color:#8b735d;margin:0;'>Simulateur objectif</h2><span id='close-objectif' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><p style='color:#8b735d;font-size:14px;margin-bottom:20px;'>Combien dois-je vendre pour atteindre mon objectif ?</p><div style='background:white;border-radius:12px;padding:20px;border:1px solid #e8d4b0;margin-bottom:16px;'><div style='margin-bottom:16px;'><label style='color:#8b735d;font-size:13px;font-weight:bold;display:block;margin-bottom:8px;'>Objectif de revenus mensuel (euros)</label><input id='obj-revenu' type='number' placeholder='Ex: 500' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:14px;box-sizing:border-box;' /></div><div style='margin-bottom:16px;'><label style='color:#8b735d;font-size:13px;font-weight:bold;display:block;margin-bottom:8px;'>Inclure les revenus equipe ?</label><div style='display:flex;gap:10px;'><button id='obj-sans-equipe' style='flex:1;background:#c9a86a;color:white;border:none;padding:10px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;'>Vente seule</button><button id='obj-avec-equipe' style='flex:1;background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:10px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:bold;'>Avec equipe</button></div></div><div id='equipe-section' style='display:none;margin-bottom:16px;'><label style='color:#8b735d;font-size:13px;font-weight:bold;display:block;margin-bottom:8px;'>Revenus equipe estimes (euros)</label><input id='obj-revenus-equipe' type='number' placeholder='Ex: 200' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:14px;box-sizing:border-box;' /></div><button id='calc-objectif-btn' style='width:100%;background:#c9a86a;color:white;border:none;padding:14px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:15px;'>Calculer</button></div><div id='objectif-result' style='display:none;'></div>";
        panel.appendChild(box); document.body.appendChild(panel);
        document.getElementById("close-objectif").onclick = function() { panel.remove(); openOutilsPanel(); };
        var avecEquipe = false;
        document.getElementById("obj-sans-equipe").onclick = function() { avecEquipe = false; document.getElementById("obj-sans-equipe").style.background = "#c9a86a"; document.getElementById("obj-sans-equipe").style.color = "white"; document.getElementById("obj-sans-equipe").style.border = "none"; document.getElementById("obj-avec-equipe").style.background = "#f3e7d3"; document.getElementById("obj-avec-equipe").style.color = "#8a6a35"; document.getElementById("obj-avec-equipe").style.border = "1px solid #c8a96b"; document.getElementById("equipe-section").style.display = "none"; };
        document.getElementById("obj-avec-equipe").onclick = function() { avecEquipe = true; document.getElementById("obj-avec-equipe").style.background = "#c9a86a"; document.getElementById("obj-avec-equipe").style.color = "white"; document.getElementById("obj-avec-equipe").style.border = "none"; document.getElementById("obj-sans-equipe").style.background = "#f3e7d3"; document.getElementById("obj-sans-equipe").style.color = "#8a6a35"; document.getElementById("obj-sans-equipe").style.border = "1px solid #c8a96b"; document.getElementById("equipe-section").style.display = "block"; };
        document.getElementById("calc-objectif-btn").onclick = function() {
          const objectif = parseFloat(document.getElementById("obj-revenu").value); if (!objectif || objectif <= 0) { alert("Saisis un objectif valide."); return; }
          const revenusEquipe = avecEquipe ? (parseFloat(document.getElementById("obj-revenus-equipe").value) || 0) : 0;
          const revenusVenteNecessaires = objectif - revenusEquipe;
          if (revenusVenteNecessaires <= 0) { document.getElementById("objectif-result").innerHTML = "<div style='background:#c9a86a;border-radius:12px;padding:20px;text-align:center;'><div style='color:white;font-size:16px;font-weight:bold;'>Tes revenus equipe couvrent deja ton objectif !</div></div>"; document.getElementById("objectif-result").style.display = "block"; return; }
          var caFinal = revenusVenteNecessaires / 0.30; var taux = 30;
          if (caFinal < 100) { caFinal = revenusVenteNecessaires / 0.20; taux = 20; }
          var resultHTML = "<div style='background:white;border-radius:12px;padding:20px;border:1px solid #e8d4b0;margin-bottom:12px;'><div style='color:#8b735d;font-size:14px;margin-bottom:12px;font-weight:bold;'>Pour gagner " + objectif + " euros :</div>";
          if (avecEquipe && revenusEquipe > 0) { resultHTML += "<div style='color:#888;font-size:13px;margin-bottom:8px;'>Revenus equipe : " + revenusEquipe + " euros</div><div style='color:#888;font-size:13px;margin-bottom:16px;'>Revenus vente necessaires : " + revenusVenteNecessaires.toFixed(2) + " euros</div>"; }
          resultHTML += "<div style='color:#3a3a3a;font-size:14px;margin-bottom:4px;'>Taux : <strong>" + taux + "%</strong></div></div><div style='background:#c9a86a;border-radius:12px;padding:20px;text-align:center;'><div style='color:white;font-size:14px;margin-bottom:4px;'>Chiffre d affaires a realiser</div><div style='color:white;font-size:32px;font-weight:bold;'>" + caFinal.toFixed(2) + " euros</div></div>";
          document.getElementById("objectif-result").innerHTML = resultHTML; document.getElementById("objectif-result").style.display = "block";
        };
      }
      function openCalculEquipePanel() {
        if (document.getElementById("baa-equipe-panel")) return;
        const panel = document.createElement("div"); panel.id = "baa-equipe-panel";
        panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:60px;";
        const box = document.createElement("div");
        box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;max-height:85vh;overflow-y:auto;font-family:Arial,sans-serif;";
        box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'><h2 style='color:#8b735d;margin:0;'>Calculateur equipe</h2><span id='close-equipe' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div style='background:white;border-radius:12px;padding:20px;border:1px solid #e8d4b0;margin-bottom:16px;'><label style='color:#8b735d;font-size:13px;font-weight:bold;display:block;margin-bottom:8px;'>Ton VGP perso (euros)</label><input id='vgp-perso' type='number' placeholder='Ex: 300' style='width:100%;padding:10px;border:1px solid #e8d4b0;border-radius:8px;font-size:14px;box-sizing:border-box;' /></div><div id='branches-container'></div><button id='add-branche-btn' style='width:100%;background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:12px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;margin-bottom:16px;'>+ Ajouter une branche</button><button id='calc-equipe-btn' style='width:100%;background:#c9a86a;color:white;border:none;padding:14px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:15px;margin-bottom:20px;'>Calculer mes revenus equipe</button><div id='equipe-result' style='display:none;'></div>";
        panel.appendChild(box); document.body.appendChild(panel);
        document.getElementById("close-equipe").onclick = function() { panel.remove(); openOutilsPanel(); };
        var brancheCount = 0;
        function getPalier(vgp) { if (vgp >= 5000) return 17; if (vgp >= 3000) return 14; if (vgp >= 2000) return 12; if (vgp >= 1500) return 10; if (vgp >= 1000) return 8; if (vgp >= 500) return 6; if (vgp >= 250) return 4; if (vgp >= 100) return 2; return 0; }
        document.getElementById("add-branche-btn").onclick = function() {
          brancheCount++;
          const branche = document.createElement("div"); branche.id = "branche-" + brancheCount;
          branche.style.cssText = "background:white;border-radius:12px;padding:16px;border:1px solid #e8d4b0;margin-bottom:12px;";
          branche.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;'><label style='color:#8b735d;font-size:13px;font-weight:bold;'>Branche " + brancheCount + "</label><span id='del-branche-" + brancheCount + "' style='cursor:pointer;color:#c0392b;font-size:18px;font-weight:bold;'>X</span></div><input id='branche-nom-" + brancheCount + "' placeholder='Nom (ex: Lucie)' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;margin-bottom:8px;' /><input id='branche-vgp-" + brancheCount + "' type='number' placeholder='VGP total de la branche (euros)' style='width:100%;padding:8px;border:1px solid #e8d4b0;border-radius:8px;font-size:13px;box-sizing:border-box;' />";
          document.getElementById("branches-container").appendChild(branche);
          document.getElementById("del-branche-" + brancheCount).onclick = function() { branche.remove(); };
        };
        document.getElementById("calc-equipe-btn").onclick = function() {
          const vgpPerso = parseFloat(document.getElementById("vgp-perso").value) || 0;
          var totalVGPEquipe = vgpPerso; var branches = []; var valid = true;
          for (var i = 1; i <= brancheCount; i++) {
            const el = document.getElementById("branche-" + i); if (!el) continue;
            const nom = document.getElementById("branche-nom-" + i).value || "Branche " + i;
            const vgp = parseFloat(document.getElementById("branche-vgp-" + i).value);
            if (!vgp || vgp <= 0) { valid = false; break; }
            totalVGPEquipe += vgp; branches.push({ nom: nom, vgp: vgp });
          }
          if (!valid) { alert("Verifie les VGP de tes branches."); return; }
          const monPalierTotal = getPalier(totalVGPEquipe);
          var detailHTML = "<div style='background:white;border-radius:12px;padding:20px;border:1px solid #e8d4b0;margin-bottom:12px;'><div style='color:#8b735d;font-size:14px;font-weight:bold;margin-bottom:12px;'>VGP total : " + totalVGPEquipe.toFixed(0) + " euros - Palier " + monPalierTotal + "%</div>";
          var totalDifferentiel = 0;
          branches.forEach(function(b) {
            const palierBranche = getPalier(b.vgp); const differentiel = Math.max(0, monPalierTotal - palierBranche); const gain = b.vgp * differentiel / 100; totalDifferentiel += gain;
            detailHTML += "<div style='border-top:1px solid #f0e6d3;padding-top:10px;margin-top:10px;'><div style='font-weight:bold;color:#3a3a3a;'>" + b.nom + "</div><div style='color:#888;font-size:13px;'>VGP: " + b.vgp + " - Palier " + palierBranche + "% - Diff: " + differentiel + "%</div><div style='color:#c9a86a;font-weight:bold;'>+" + gain.toFixed(2) + " euros</div></div>";
          });
          detailHTML += "</div><div style='background:#c9a86a;border-radius:12px;padding:20px;text-align:center;'><div style='color:white;font-size:14px;margin-bottom:4px;'>Total revenus equipe</div><div style='color:white;font-size:32px;font-weight:bold;'>" + totalDifferentiel.toFixed(2) + " euros</div></div>";
          document.getElementById("equipe-result").innerHTML = detailHTML; document.getElementById("equipe-result").style.display = "block";
        };
      }
    }
  });
}
if (document.readyState === "complete") { setTimeout(initBeautyAddictLogin, 1500); }
else { window.addEventListener("load", function() { setTimeout(initBeautyAddictLogin, 2000); }); }
