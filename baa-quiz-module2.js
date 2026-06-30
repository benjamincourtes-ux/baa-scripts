function openQuizModule2() {
  if (document.getElementById("baa-quiz-panel")) return;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;
  if (uid) {
    db.collection("users").doc(uid).get().then(function(snapCheck) {
      var dCheck = snapCheck.data();
      if (dCheck && dCheck.quizModule2Complete === true) {
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
    { q: "Que represente le 'Pourquoi' selon le Chapitre 1 ?", options: ["Une formalite administrative", "Le moteur invisible qui pousse a avancer dans les moments difficiles", "Un objectif financier uniquement", "Une simple formalite de bienvenue"], correct: 1, explain: "Le Pourquoi est le moteur invisible qui pousse a persister meme quand les resultats tardent a venir." },
    { q: "Combien de phrases sont demandees dans l'exercice 'Mon Pourquoi' ?", options: ["3 phrases", "5 phrases", "10 phrases", "1 seule phrase"], correct: 1, explain: "L'exercice demande de rediger son pourquoi en 5 phrases completes, a relire chaque matin pendant 30 jours." },
    { q: "Quels sont les trois horizons de la methode de definition d'objectifs ?", options: ["1 jour, 1 semaine, 1 mois", "30 jours, 90 jours, 1 an", "1 mois, 6 mois, 5 ans", "Hebdomadaire uniquement"], correct: 1, explain: "La methode des trois horizons (30 jours, 90 jours, 1 an) est adaptee a la progressivite necessaire pour ce type d'activite." },
    { q: "Que signifie la regle des 3 P pour formuler ses objectifs ?", options: ["Positif, Precis, Personnel", "Possible, Profitable, Productif", "Planifie, Prouve, Performant", "Patient, Persistant, Puissant"], correct: 0, explain: "La regle des 3 P : Positif (ce que l'on veut), Precis (detaille), Personnel (refletant ses propres valeurs)." },
    { q: "Pourquoi est-il conseille d'ecrire ses objectifs a la main ?", options: ["C'est plus rapide", "L'ecriture manuscrite active davantage la memoire et l'engagement emotionnel", "C'est une obligation administrative", "Cela evite les fautes d'orthographe"], correct: 1, explain: "Les neurosciences montrent que l'ecriture manuscrite active davantage la memoire et l'engagement emotionnel que la saisie numerique." },
    { q: "Selon le Chapitre 3, qu'est-ce qui compte le plus pour organiser son temps ?", options: ["Le nombre d'heures travaillees", "La regularite et la qualite du temps investi", "Travailler uniquement le week-end", "Avoir un planning fixe impose"], correct: 1, explain: "Ce qui compte c'est la regularite et la qualite du temps investi, pas sa quantite : meme 15 minutes par jour bien utilisees suffisent." },
    { q: "Quelle est la strategie recommandee pour creer des rituels quotidiens ?", options: ["Bloquer 5h par jour", "Associer ses actions Mihi a des moments deja presents dans sa routine", "Travailler uniquement le matin", "Attendre d'avoir plus de temps libre"], correct: 1, explain: "Associer les nouvelles habitudes a des habitudes existantes (cafe du matin, pause dejeuner) reduit l'effort mental necessaire." },
    { q: "Quel est l'objectif de la liste de contacts presentee au Chapitre 4 ?", options: ["10 noms", "50 noms", "100 noms", "500 noms"], correct: 2, explain: "L'objectif est de construire une liste de 100 noms en cartographiant son reseau existant avec authenticite." },
    { q: "Combien de personnes connait en moyenne une personne, selon le guide ?", options: ["Entre 10 et 50", "Entre 100 et 150", "Entre 250 et 500", "Plus de 1000"], correct: 2, explain: "Une personne moyenne connait entre 250 et 500 personnes : le defi n'est pas de trouver des inconnus mais de reconnaitre la valeur du reseau existant." },
    { q: "Quelle est la premiere erreur a eviter selon le Chapitre 5 ?", options: ["Trop former ses clientes", "Attendre le moment parfait pour commencer", "Avoir trop de contacts", "Etre trop genereuse"], correct: 1, explain: "Le moment parfait n'existe pas : chaque jour sans action est un jour de retard. L'action cree la clarte, pas l'inverse." },
    { q: "Que dit le guide sur la peur du regard des autres ?", options: ["Il faut l'ignorer completement les autres", "Ceux qui reussissent encouragent, ceux qui jugent ne vivent pas notre vie", "C'est une raison valable pour abandonner", "Il faut convaincre tout le monde avant d'agir"], correct: 1, explain: "Les gens qui jugent ne vivent pas notre vie ; ceux qui reussissent encouragent, et ceux qui aiment vraiment seront les premiers supporters." },
    { q: "Selon le Chapitre 5, que bat toujours l'intensite ?", options: ["La chance", "La regularite", "Le budget publicitaire", "Le nombre de followers"], correct: 1, explain: "La regularite bat toujours l'intensite : mieux vaut 15 minutes par jour que 3 heures une fois par semaine." },
    { q: "Quelles sont les 5 habitudes des personnes qui reussissent (Chapitre 6) ?", options: ["Chance, talent, argent, reseau, diplome", "Regularite, passage a l'action, formation continue, suivi des contacts, attitude positive", "Perfectionnisme, isolement, comparaison, rigidite, controle", "Vitesse, improvisation, intuition seule, hasard, opportunisme"], correct: 1, explain: "Les 5 habitudes forment un cercle vertueux : regularite, passage a l'action, formation continue, suivi des contacts et attitude positive." },
    { q: "Que represente le Chapitre 7 'Mon Engagement' ?", options: ["Un simple exercice facultatif", "Un acte solennel envers soi-meme officialisant sa decision", "Un contrat avec Mihi", "Une formalite administrative obligatoire"], correct: 1, explain: "L'engagement est un acte solennel envers soi-meme : on officialise sa decision de construire quelque chose de grand avec serieux et determination." },
    { q: "Quels sont les 4 piliers d'une activite solide ?", options: ["Chance, argent, reseau, diplome", "Mindset, visibilite, credibilite, passage a l'action", "Vitesse, prix, stock, publicite", "Formation, certification, budget, equipe"], correct: 1, explain: "Les 4 piliers sont : le mindset (constance et resilience), la visibilite (etre vue), la credibilite (inspirer confiance) et le passage a l'action (transformer la connaissance en resultats)." }
  ];

  var currentIndex = 0;
  var score = 0;
  var answered = false;

  var panel = document.createElement("div");
  panel.id = "baa-quiz-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:40px;padding-bottom:40px;overflow-y:auto;";
  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;font-family:Arial,sans-serif;max-height:90vh;overflow-y:auto;";
  box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'><h2 style='color:#8b735d;margin:0;'>Quiz Module 2</h2><span id='close-quiz' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div style='color:#999;font-size:13px;margin-bottom:20px;'>Les Fondations de Mon Activite</div><div id='quiz-progress-container' style='margin-bottom:20px;'><div style='display:flex;justify-content:space-between;margin-bottom:6px;'><span id='quiz-progress-text' style='color:#8b735d;font-size:13px;font-weight:bold;'>Question 1 / 15</span><span id='quiz-score-text' style='color:#c9a86a;font-size:13px;font-weight:bold;'>Score : 0</span></div><div style='background:#f0e6d3;border-radius:20px;height:10px;overflow:hidden;'><div id='quiz-progress-barre' style='background:#c9a86a;height:100%;border-radius:20px;width:0%;transition:width 0.4s ease;'></div></div></div><div id='quiz-content'></div>";
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
        quizModule2Score: score,
        quizModule2Total: questions.length,
        quizModule2Date: new Date().toISOString()
      };
      if (pctSave >= 80) { updateData.quizModule2Complete = true; } else { updateData.quizModule2Complete = false; }
      db.collection("users").doc(uid).update(updateData).catch(function(e) { console.log("Erreur sauvegarde quiz:", e); });
    }
  }

  renderQuestion();
  }
}
