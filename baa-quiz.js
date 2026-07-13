function openQuizBonDemarrage() {
  if (document.getElementById("baa-quiz-panel")) return;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;
  if (uid) {
    db.collection("users").doc(uid).get().then(function(snapCheck) {
      var dCheck = snapCheck.data();
      if (dCheck && dCheck.quizBonDemarrageComplete === true) {
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
    { q: "Combien de jours dure le programme Bon Demarrage Mihi ?", options: ["5 jours", "7 jours", "10 jours", "14 jours"], correct: 1, explain: "Le programme Bon Demarrage dure exactement 7 jours, un par etape cle de votre lancement." },
    { q: "Quelle est la premiere action a faire le Jour 1 ?", options: ["Publier sur Facebook", "Definir ses objectifs", "Envoyer le catalogue", "Passer sa premiere commande"], correct: 1, explain: "Tout commence par definir ses objectifs personnels et professionnels avec precision." },
    { q: "Pourquoi passer sa premiere commande avant de vendre ?", options: ["Pour avoir une reduction", "Pour devenir cliente avant vendeuse et vendre avec authenticite", "C'est obligatoire administrativement", "Pour remplir son stock"], correct: 1, explain: "Devenir cliente avant d'etre vendeuse permet de vendre avec naturel et conviction, car on croit reellement aux produits." },
    { q: "Combien de personnes minimum doit-on viser dans sa liste de contacts initiale ?", options: ["20 contacts", "30 contacts", "50 contacts", "100 contacts"], correct: 2, explain: "Le guide recommande de viser un minimum de 50 contacts pour multiplier les opportunites." },
    { q: "Quel type de photo de profil est recommande sur Facebook ?", options: ["Une photo de groupe", "Une photo sombre avec filtre", "Une photo lumineuse, souriante et seule", "Une photo de produit uniquement"], correct: 2, explain: "Une photo lumineuse, souriante, ou vous etes seule et bien mise en valeur inspire confiance et credibilite." },
    { q: "Qu'est-ce qu'un 'pitch' personnel selon le Jour 2 ?", options: ["Un argumentaire de vente agressif", "Une presentation de 3 a 5 phrases sur qui vous etes et pourquoi vous aimez Mihi", "Un script obligatoire impose par Mihi", "Une liste de produits a vendre"], correct: 1, explain: "Le pitch est une presentation courte et sincere en 3 a 5 phrases, a repeter jusqu'a ce qu'elle sonne naturelle." },
    { q: "Combien de produits favoris faut-il identifier au Jour 3 ?", options: ["1 a 3 produits", "5 a 10 produits", "15 a 20 produits", "Tout le catalogue"], correct: 1, explain: "Il est conseille d'identifier 5 a 10 produits favoris que vous connaissez et aimez le plus." },
    { q: "Quelle est la difference entre une vendeuse et une conseillere de beaute ?", options: ["Le salaire", "La connaissance approfondie des produits", "Le nombre de clientes", "Aucune difference"], correct: 1, explain: "Une partenaire qui connait ses produits par coeur inspire confiance : c'est la difference entre vendeuse et conseillere." },
    { q: "Que recommande le guide pour les stories du Jour 4 ?", options: ["Ne jamais montrer son quotidien", "Montrer des stories coulisses pour creer de la proximite", "Publier uniquement des prix", "Eviter de poser des questions a l'audience"], correct: 1, explain: "Les stories coulisses (espace de travail, routine, preparation de commandes) creent une proximite precieuse avec l'audience." },
    { q: "Combien de hashtags pertinents est-il conseille d'utiliser ?", options: ["1 a 2", "5 a 10", "20 a 30", "Aucun"], correct: 1, explain: "Le guide recommande d'utiliser 5 a 10 hashtags pertinents pour booster la visibilite." },
    { q: "Selon le Jour 5, quand se concluent la majorite des ventes ?", options: ["Des la premiere interaction", "Apres la deuxieme ou troisieme interaction", "Jamais avant un mois", "Uniquement lors d'evenements"], correct: 1, explain: "La majorite des ventes se concluent apres la deuxieme ou troisieme interaction, pas la premiere : la relance est essentielle." },
    { q: "Qu'est-ce qu'une bonne relance selon le guide ?", options: ["Un message generique envoye en masse", "Un message court, chaleureux et personnalise", "Un appel telephonique insistant", "Un rappel quotidien"], correct: 1, explain: "Une relance efficace est courte, chaleureuse et personnalisee avec le prenom et le contexte de la personne." },
    { q: "Quel est le pilier principal de la reussite durable selon le Jour 6 ?", options: ["Travailler 12h par jour", "La discipline et la regularite", "Avoir un gros budget publicitaire", "Ne jamais faire de pause"], correct: 1, explain: "Il ne s'agit pas de travailler dur un jour, mais de travailler chaque jour : meme 30 minutes regulieres valent mieux qu'une journee suivie d'inactivite." },
    { q: "A quoi sert le journal de gratitude professionnel ?", options: ["A noter ses depenses", "A noter chaque soir 3 avancees de sa journee", "A lister ses clientes", "A planifier les vacances"], correct: 1, explain: "Le journal de gratitude transforme la perception du chemin parcouru et maintient la motivation dans la duree." },
    { q: "Que doit-on faire au Jour 7 pour cloturer le programme ?", options: ["Tout recommencer depuis le debut", "Faire un bilan et definir un plan d'action pour les 30 jours suivants", "Arreter l'activite si les resultats ne sont pas parfaits", "Ignorer les resultats de la semaine"], correct: 1, explain: "Le Jour 7 est dedie au bilan de la semaine et a la definition d'objectifs clairs pour le mois a venir." }
  ];

  // Mapping des quiz pour les messages Phénix
  var QUIZ_SUIVANTS = {
    "Bon Demarrage": { nom: "Module 2", fn: "openQuizModule2" },
    "Module 2": { nom: "Module 3", fn: "openQuizModule3" },
    "Module 3": { nom: "Module 4", fn: "openQuizModule4" },
    "Module 4": { nom: "Module 5", fn: "openQuizModule5" },
    "Module 5": { nom: "Module 6", fn: "openQuizModule6" },
    "Module 6": { nom: "Module 7", fn: "openQuizModule7" },
    "Module 7": null
  };
  var NOM_QUIZ_ACTUEL = "Bon Demarrage";

  var currentIndex = 0;
  var score = 0;
  var answered = false;

  var panel = document.createElement("div");
  panel.id = "baa-quiz-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:40px;padding-bottom:40px;overflow-y:auto;";
  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;font-family:Arial,sans-serif;max-height:90vh;overflow-y:auto;";
  box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'><h2 style='color:#8b735d;margin:0;'>Quiz Bon Demarrage</h2><span id='close-quiz' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div style='color:#999;font-size:13px;margin-bottom:20px;'>Teste tes connaissances sur le programme 7 jours</div><div id='quiz-progress-container' style='margin-bottom:20px;'><div style='display:flex;justify-content:space-between;margin-bottom:6px;'><span id='quiz-progress-text' style='color:#8b735d;font-size:13px;font-weight:bold;'>Question 1 / 15</span><span id='quiz-score-text' style='color:#c9a86a;font-size:13px;font-weight:bold;'>Score : 0</span></div><div style='background:#f0e6d3;border-radius:20px;height:10px;overflow:hidden;'><div id='quiz-progress-barre' style='background:#c9a86a;height:100%;border-radius:20px;width:0%;transition:width 0.4s ease;'></div></div></div><div id='quiz-content'></div>";
  panel.appendChild(box);
  document.body.appendChild(panel);
  document.getElementById("close-quiz").onclick = function() { panel.remove(); if (typeof window.__baaOpenQuizPanel === "function") { window.__baaOpenQuizPanel(); } else if (typeof window.__baaOpenOutilsPanel === "function") { window.__baaOpenOutilsPanel(); } };

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
    var message = pctFinal === 100 ? "Parfait ! Tu maitrises totalement le programme !" : pctFinal >= 80 ? "Excellent ! Tu connais tres bien le programme." : pctFinal >= 60 ? "Bien joue ! Quelques points a revoir." : "N'hesite pas a relire le guide pour bien ancrer les bases.";
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
        quizBonDemarrageScore: score,
        quizBonDemarrageTotal: questions.length,
        quizBonDemarrageDate: new Date().toISOString()
      };
      if (pctSave >= 80) {
        updateData.quizBonDemarrageComplete = true;

        // 🔥 CONNEXION BUS D'ÉVÉNEMENTS
        if (window.baaEventBus) {
          var quizSuivant = QUIZ_SUIVANTS[NOM_QUIZ_ACTUEL];
          var msgPhenix = "🎓 Bravo ! Tu as validé le Quiz " + NOM_QUIZ_ACTUEL + " avec " + pctFinal + "% ! 🔥\n+20 points badges gagnés !";
          if (quizSuivant) {
            msgPhenix += "\n\n👉 Prochain quiz : " + quizSuivant.nom;
          } else {
            msgPhenix += "\n\n🏆 Tu as validé tous les quiz ! Tu es au top !";
          }

          window.baaEventBus.emit("module_termine", {
            moduleNom: "Quiz " + NOM_QUIZ_ACTUEL,
            score: pctFinal,
            quizSuivant: quizSuivant ? quizSuivant.nom : null
          });
        }

      } else {
        updateData.quizBonDemarrageComplete = false;
      }
      db.collection("users").doc(uid).update(updateData).catch(function(e) { console.log("Erreur sauvegarde quiz:", e); });
    }
  }

  renderQuestion();
  }
}
