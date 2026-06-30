function openQuizModule6() {
  if (document.getElementById("baa-quiz-panel")) return;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;
  if (uid) {
    db.collection("users").doc(uid).get().then(function(snapCheck) {
      var dCheck = snapCheck.data();
      if (dCheck && dCheck.quizModule6Complete === true) {
        alert("Tu as deja valide ce quiz avec un score superieur ou egal a 80 pourcent. Il n est plus necessaire de le refaire.");
        return;
      }
      __launchQuiz();
    });
  } else {
    __launchQuiz();
  }
  function __launchQuiz() {

  var questions = [
    { q: "Selon le Module 6, que doit faire une conseillere avant de proposer un produit ?", options: ["Presenter le catalogue complet", "Comprendre le besoin reel de la cliente", "Parler des promotions en cours", "Conclure la vente rapidement"], correct: 1, explain: "La regle d'or du module est de ne jamais commencer par vendre : il faut toujours comprendre avant de proposer." },
    { q: "Que symbolise le phoenix dans ce module ?", options: ["L'echec irreversible", "La transformation et la metamorphose de la cliente", "La perfection du catalogue Mihi", "La rapidite de la vente"], correct: 1, explain: "Comme le phoenix qui renait de ses cendres, chaque cliente porte en elle une transformation a reveler, que la conseillere accompagne." },
    { q: "Quelles sont les trois etapes de l'alchimie des besoins presentees dans les fondamentaux ?", options: ["Vendre, conclure, fideliser", "Ecouter, comprendre, reveler", "Parler, convaincre, encaisser", "Presenter, comparer, remiser"], correct: 1, explain: "Les trois etapes sont : ecouter (creer un espace de confiance), comprendre (identifier le besoin profond), reveler (proposer la solution adaptee)." },
    { q: "Que faut-il eviter en tout premier lieu selon la regle d'or du module ?", options: ["Poser des questions ouvertes", "Presenter le catalogue des les premieres minutes", "Reformuler les propos de la cliente", "Ecouter activement"], correct: 1, explain: "Presenter le catalogue ou parler de produits sans connaitre la cliente est l'une des erreurs majeures a eviter d'emblee." },
    { q: "Une cliente dit : 'Je cherche quelque chose pour ma peau.' Quelle est la meilleure reaction ?", options: ["Lui presenter immediatement toute la gamme de soins", "Lui poser une question ouverte pour cibler son besoin precis", "Lui parler des promotions du moment", "Changer de sujet"], correct: 1, explain: "Il vaut mieux poser une question ouverte comme 'Qu'est-ce qui te preoccupe le plus en ce moment ?' pour cibler avec precision avant de proposer." },
    { q: "Quel type de question commence par 'Comment', 'Qu'est-ce que' ou 'Raconte-moi' ?", options: ["Une question fermee", "Une question ouverte", "Une question de precision", "Une question rhetorique"], correct: 1, explain: "Les questions ouvertes invitent la cliente a s'exprimer librement et commencent par des formules comme Comment, Qu'est-ce que ou Raconte-moi." },
    { q: "A quoi servent les questions fermees selon le module ?", options: ["A monopoliser la conversation", "A confirmer ou infirmer une hypothese, avec parcimonie", "A remplacer toutes les questions ouvertes", "A clore systematiquement l'echange"], correct: 1, explain: "Les questions fermees permettent de confirmer ou infirmer une hypothese et se repondent par oui ou non ; elles doivent etre utilisees avec parcimonie." },
    { q: "Quel est le role des questions de precision ?", options: ["Elles ouvrent la conversation au tout debut", "Elles approfondissent et affinent la comprehension apres que la cliente s'est exprimee", "Elles servent uniquement a conclure la vente", "Elles remplacent la reformulation"], correct: 1, explain: "Les questions de precision interviennent une fois que la cliente a commence a s'exprimer, pour approfondir et affiner la comprehension du besoin." },
    { q: "Parmi ces categories, laquelle ne fait PAS partie des grands besoins clientes presentes dans le module ?", options: ["Hydratation", "Anti-Age", "Comptabilite", "Bien-etre & Energie"], correct: 2, explain: "La comptabilite ne fait pas partie des dix categories de besoins presentees (Beaute & Eclat, Hydratation, Anti-Age, Cheveux & Ongles, Bien-etre & Energie, Gestion du Poids, Maquillage, Parfums, Hygiene & Soins)." },
    { q: "Quelles sont les cinq etapes de la mise en situation 'Transformer un besoin en solution' ?", options: ["Vente, relance, paiement, livraison, avis", "Accueil, exploration, reformulation, recommandation, accompagnement", "Catalogue, prix, remise, commande, facture", "Bonjour, produit, prix, merci, au revoir"], correct: 1, explain: "Les cinq etapes sont : accueil, exploration, reformulation, recommandation, accompagnement." },
    { q: "Selon le module, quelle proportion du temps une conseillere devrait-elle ecouter plutot que parler ?", options: ["50% d'ecoute, 50% de parole", "70% d'ecoute, 30% de parole", "30% d'ecoute, 70% de parole", "90% de parole, 10% d'ecoute"], correct: 1, explain: "La regle d'or rappelee dans les erreurs a eviter est : ecoute 70% du temps, parle 30%." },
    { q: "Quelle erreur consiste a recommander un produit uniquement parce qu'il est populaire ou en promotion ?", options: ["Vouloir tout connaitre avant de commencer", "Proposer sans comprendre", "Compliquer les recommandations", "Parler plus qu'ecouter"], correct: 1, explain: "Proposer sans comprendre signifie recommander un produit sans lien avec le besoin exprime, ce que la cliente ressent immediatement." },
    { q: "Que recommande le module face a une cliente qui pose une question dont la conseillere ne connait pas la reponse ?", options: ["Inventer une reponse pour ne pas perdre la vente", "Dire honnetement qu'elle ne sait pas mais va se renseigner", "Changer rapidement de sujet", "Rediriger vers un autre produit"], correct: 1, explain: "L'honnetete renforce la credibilite : dire 'Je ne sais pas, mais je vais me renseigner pour toi' est une preuve d'authenticite valorisee dans le module." },
    { q: "Selon la philosophie Mihi rappelee dans le module, l'accompagnement consiste a...", options: ["Imposer une solution rapidement", "Proposer, pas imposer ; guider, pas pousser", "Insister jusqu'a la decision de la cliente", "Vendre le maximum de produits possibles"], correct: 1, explain: "L'accompagnement Mihi, c'est proposer, pas imposer. C'est guider, pas pousser : la cliente ne doit jamais se sentir obligee d'acheter." },
    { q: "D'apres le bonus sur les messages, lequel de ces comportements est une erreur a eviter ?", options: ["Personnaliser le message", "Poser des questions ouvertes", "Envoyer un pave des le premier message", "Chercher a comprendre avant de proposer"], correct: 2, explain: "Envoyer un pave des le premier message fait partie des erreurs a eviter, au meme titre que copier-coller le meme message a tout le monde ou vouloir vendre trop vite." }
  ];

  var currentIndex = 0;
  var score = 0;
  var answered = false;

  var panel = document.createElement("div");
  panel.id = "baa-quiz-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:40px;padding-bottom:40px;overflow-y:auto;";
  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;font-family:Arial,sans-serif;max-height:90vh;overflow-y:auto;";
  box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'><h2 style='color:#8b735d;margin:0;'>Quiz Module 6</h2><span id='close-quiz' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div style='color:#999;font-size:13px;margin-bottom:20px;'>L'Alchimie des Besoins - Comprendre pour reveler</div><div id='quiz-progress-container' style='margin-bottom:20px;'><div style='display:flex;justify-content:space-between;margin-bottom:6px;'><span id='quiz-progress-text' style='color:#8b735d;font-size:13px;font-weight:bold;'>Question 1 / 15</span><span id='quiz-score-text' style='color:#c9a86a;font-size:13px;font-weight:bold;'>Score : 0</span></div><div style='background:#f0e6d3;border-radius:20px;height:10px;overflow:hidden;'><div id='quiz-progress-barre' style='background:#c9a86a;height:100%;border-radius:20px;width:0%;transition:width 0.4s ease;'></div></div></div><div id='quiz-content'></div>";
  panel.appendChild(box);
  document.body.appendChild(panel);
  document.getElementById("close-quiz").onclick = function() { panel.remove(); if (typeof window.__baaOpenOutilsPanel === "function") { window.__baaOpenOutilsPanel(); } };

  function renderQuestion() {
    answered = false;
    var qData = questions[currentIndex];
    document.getElementById("quiz-progress-text").innerText = "Question " + (currentIndex + 1) + " / " + questions.length;
    document.getElementById("quiz-score-text").innerText = "Score : " + score;
    var pct = Math.round((currentIndex / questions.length) * 100);
    document.getElementById("quiz-progress-barre").style.width = pct + "%";

    var html = "<div style='background:white;border-radius:14px;padding:20px;border:1px solid #e8d4b0;margin-bottom:16px;'>";
    html += "<div style='color:#3a3a3a;font-size:16px;font-weight:bold;margin-bottom:16px;line-height:1.4;'>" + qData.q + "</div>";
    html += "<div id='quiz-options'>";
    qData.options.forEach(function(opt, idx) {
      html += "<div class='quiz-option' data-idx='" + idx + "' style='background:#f8f3ee;border:1px solid #e8d4b0;border-radius:10px;padding:12px 16px;margin-bottom:10px;cursor:pointer;color:#3a3a3a;font-size:14px;'>" + opt + "</div>";
    });
    html += "</div>";
    html += "<div id='quiz-explain' style='display:none;margin-top:12px;padding:14px;border-radius:10px;font-size:13px;line-height:1.5;'></div>";
    html += "</div>";
    html += "<button id='quiz-next-btn' style='width:100%;background:#c9a86a;color:white;border:none;padding:14px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;display:none;'>" + (currentIndex === questions.length - 1 ? "Voir mon resultat" : "Question suivante") + "</button>";
    document.getElementById("quiz-content").innerHTML = html;

    document.querySelectorAll(".quiz-option").forEach(function(optEl) {
      optEl.onclick = function() {
        if (answered) return;
        answered = true;
        var chosenIdx = parseInt(optEl.getAttribute("data-idx"));
        var allOpts = document.querySelectorAll(".quiz-option");
        allOpts.forEach(function(el) {
          var idx = parseInt(el.getAttribute("data-idx"));
          if (idx === qData.correct) {
            el.style.background = "#e6f7ec";
            el.style.border = "1px solid #2ecc71";
            el.style.color = "#1e8449";
            el.style.fontWeight = "bold";
          } else if (idx === chosenIdx) {
            el.style.background = "#fdecec";
            el.style.border = "1px solid #e74c3c";
            el.style.color = "#c0392b";
          }
          el.style.cursor = "default";
        });
        var explainBox = document.getElementById("quiz-explain");
        if (chosenIdx === qData.correct) {
          score++;
          document.getElementById("quiz-score-text").innerText = "Score : " + score;
          explainBox.style.background = "#e6f7ec";
          explainBox.style.color = "#1e8449";
          explainBox.innerHTML = "<strong>Bonne reponse !</strong> " + qData.explain;
        } else {
          explainBox.style.background = "#fdecec";
          explainBox.style.color = "#c0392b";
          explainBox.innerHTML = "<strong>Pas tout a fait.</strong> " + qData.explain;
        }
        explainBox.style.display = "block";
        document.getElementById("quiz-next-btn").style.display = "block";
      };
    });

    document.getElementById("quiz-next-btn").onclick = function() {
      currentIndex++;
      if (currentIndex >= questions.length) {
        renderResult();
      } else {
        renderQuestion();
      }
    };
  }

  function renderResult() {
    document.getElementById("quiz-progress-barre").style.width = "100%";
    document.getElementById("quiz-progress-text").innerText = "Quiz termine !";
    document.getElementById("quiz-score-text").innerText = "Score : " + score + " / " + questions.length;
    var pctFinal = Math.round((score / questions.length) * 100);
    var message = pctFinal === 100 ? "Parfait ! Tu maitrises totalement le module !" : pctFinal >= 80 ? "Excellent ! Tu connais tres bien le module." : pctFinal >= 60 ? "Bien joue ! Quelques points a revoir." : "N'hesite pas a relire le guide pour bien ancrer les bases.";
    var couleur = pctFinal >= 80 ? "#2ecc71" : pctFinal >= 60 ? "#c9a86a" : "#f39c12";
    var html = "<div style='text-align:center;background:white;border-radius:14px;padding:30px 20px;border:1px solid #e8d4b0;'>";
    html += "<div style='font-size:48px;margin-bottom:12px;'>" + (pctFinal >= 80 ? "🎉" : pctFinal >= 60 ? "👏" : "💪") + "</div>";
    html += "<div style='font-size:32px;font-weight:bold;color:" + couleur + ";margin-bottom:8px;'>" + score + " / " + questions.length + "</div>";
    html += "<div style='color:#8b735d;font-size:15px;margin-bottom:20px;'>" + message + "</div>";
    html += "<button id='quiz-restart-btn' style='background:#c9a86a;color:white;border:none;padding:12px 24px;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;'>Recommencer le quiz</button>";
    html += "</div>";
    document.getElementById("quiz-content").innerHTML = html;
    document.getElementById("quiz-restart-btn").onclick = function() {
      currentIndex = 0;
      score = 0;
      renderQuestion();
    };
    if (uid) {
      var pctSave = Math.round((score / questions.length) * 100);
      var updateData = {
        quizModule6Score: score,
        quizModule6Total: questions.length,
        quizModule6Date: new Date().toISOString()
      };
      if (pctSave >= 80) { updateData.quizModule6Complete = true; } else { updateData.quizModule6Complete = false; }
      db.collection("users").doc(uid).update(updateData).catch(function(e) { console.log("Erreur sauvegarde quiz:", e); });
    }
  }

  renderQuestion();
  }
}
