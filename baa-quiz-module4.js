function openQuizModule4() {
  if (document.getElementById("baa-quiz-panel")) return;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;

  var questions = [
    { q: "Selon la Partie 1, a quoi servent vraiment les messages ?", options: ["A vendre le plus vite possible", "A creer une relation humaine, sincere et naturelle", "A convaincre par la pression", "A presenter immediatement Mihi"], correct: 1, explain: "Les messages ne servent pas a vendre mais a creer une relation humaine, sincere et naturelle : c'est cette posture qui change tout." },
    { q: "Quelle est la philosophie de la communication d'attraction ?", options: ["Forcer pour convaincre", "Vous n'avez pas besoin de convaincre, vous avez besoin d'interesser", "Envoyer un maximum de messages", "Mentionner Mihi des le premier message"], correct: 1, explain: "Vous n'avez pas besoin de convaincre mais d'interesser ; pas besoin de forcer mais d'inspirer : chaque message est une invitation, pas une pression." },
    { q: "Combien de lignes est ideale pour un bon message selon la Partie 2 ?", options: ["1 ligne maximum", "2 a 4 lignes", "10 a 15 lignes", "Aucune limite"], correct: 1, explain: "Un message de 2 a 4 lignes est ideal : court, lisible et donnant envie de repondre, comme un message a une amie." },
    { q: "Quels sont les 4 piliers fondamentaux d'un bon message ?", options: ["Long, generique, urgent, commercial", "Court et naturel, personnalise, base sur la curiosite, zero pression commerciale", "Rapide, vague, repetitif, insistant", "Formel, standardise, technique, direct"], correct: 1, explain: "Les 4 piliers sont : court et naturel, personnalise a 100%, base sur la curiosite (question ouverte), et zero pression commerciale." },
    { q: "Que ne faut-il jamais faire dans les premiers messages selon la Partie 2 ?", options: ["Utiliser le prenom de la personne", "Parler de Mihi, de revenus ou d'opportunite", "Poser une question ouverte", "Etre chaleureuse"], correct: 1, explain: "Dans les premiers messages, il ne faut jamais parler de Mihi, de revenus, d'opportunite ou de business : l'objectif est uniquement de creer un contact humain." },
    { q: "Quelle est la regle d'or avant d'envoyer un message ?", options: ["Verifier l'orthographe uniquement", "Se demander : Est-ce que j'enverrais ce message a une amie ?", "Toujours ajouter des emojis", "L'envoyer le plus vite possible"], correct: 1, explain: "La regle d'or : avant d'envoyer, demandez-vous si vous enverriez ce message a une amie. Si oui, c'est bon." },
    { q: "Comment introduire Mihi dans la conversation selon la Partie 4 ?", options: ["Des le premier message envoye", "Attendre que la personne montre de la curiosite, jamais forcer l'introduction", "En envoyant un pave explicatif", "En parlant immediatement des revenus possibles"], correct: 1, explain: "Il faut attendre que la personne pose une question ou montre de la curiosite, et ne jamais forcer l'introduction du sujet Mihi." },
    { q: "Que signifie reellement une objection comme 'je n'ai pas le temps' ?", options: ["Un refus definitif", "Une question deguisee : 'je ne suis pas encore convaincue que ca vaut mon temps'", "Une insulte personnelle", "Un signal pour abandonner immediatement"], correct: 1, explain: "Une objection n'est pas un refus mais une question deguisee. Le role n'est pas de la contrer mais de la comprendre avec empathie." },
    { q: "Que faut-il faire face a un 'non' ou 'je ne suis pas interesse(e)' ?", options: ["Insister une derniere fois", "Respecter le non avec grace, ce qui cree une impression durable", "Ignorer la reponse et relancer", "Couper tout contact brutalement"], correct: 1, explain: "Respecter le non avec grace cree une impression durable : la personne pourrait revenir plus tard ou parler de vous a quelqu'un d'autre." },
    { q: "Combien de jours attendre avant une relance apres un premier message sans reponse ?", options: ["Le jour meme", "3 a 4 jours", "1 mois", "Jamais relancer"], correct: 1, explain: "Le suivi intelligent recommande d'attendre 3 a 4 jours avant une relance douce, avec une vraie valeur ajoutee a chaque fois." },
    { q: "Que faut-il faire si aucune reponse n'arrive apres plusieurs relances ?", options: ["Continuer a relancer indefiniment", "Lacher prise et passer a autre chose avec gratitude", "Envoyer un message d'insistance", "Bloquer la personne"], correct: 1, explain: "Si aucune reponse n'arrive, il faut lacher prise avec gratitude : cette personne n'est peut-etre pas prete, et c'est parfaitement ok." },
    { q: "Quelle est l'erreur du 'copier-coller froid' selon la Partie 7 ?", options: ["Personnaliser chaque message", "Envoyer le meme message a 20 personnes sans personnalisation", "Repondre rapidement aux messages", "Utiliser le prenom de la personne"], correct: 1, explain: "Envoyer le meme message a plusieurs personnes sans personnalisation se ressent immediatement et cree l'effet inverse de celui recherche." },
    { q: "Quelle est la duree ideale d'un message vocal selon la section bonus ?", options: ["5 secondes", "20 a 40 secondes maximum", "5 minutes", "Aucune limite n'existe"], correct: 1, explain: "Le vocal doit rester court, entre 20 et 40 secondes maximum, sinon il decourage l'ecoute et donne une impression de monologue." },
    { q: "Pourquoi le message vocal est-il particulierement puissant ?", options: ["Il est plus rapide a faire qu'un texte", "Votre voix porte une chaleur et une sincerite que le texte ne peut transmettre", "Il remplace totalement les messages ecrits", "Il est moins personnel qu'un texte"], correct: 1, explain: "La voix porte une chaleur, une intonation et une sincerite que le texte ne peut jamais transmettre, ce qui installe la confiance plus rapidement." },
    { q: "Selon la section bonus, quand faut-il EVITER d'envoyer un vocal ?", options: ["Pour relancer une conversation en pause", "En remplacement d'un tout premier message de contact", "Pour feliciter une cliente apres une commande", "Pour creer un moment de proximite"], correct: 1, explain: "Il ne faut jamais envoyer un vocal en remplacement du premier message : l'ecrit est toujours privilegie pour le tout premier contact, car un vocal non sollicite peut sembler intrusif." }
  ];

  var currentIndex = 0;
  var score = 0;
  var answered = false;

  var panel = document.createElement("div");
  panel.id = "baa-quiz-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:40px;padding-bottom:40px;overflow-y:auto;";
  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;font-family:Arial,sans-serif;max-height:90vh;overflow-y:auto;";
  box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'><h2 style='color:#8b735d;margin:0;'>Quiz Module 4</h2><span id='close-quiz' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div style='color:#999;font-size:13px;margin-bottom:20px;'>Guide des Messages & Communication d'Attraction</div><div id='quiz-progress-container' style='margin-bottom:20px;'><div style='display:flex;justify-content:space-between;margin-bottom:6px;'><span id='quiz-progress-text' style='color:#8b735d;font-size:13px;font-weight:bold;'>Question 1 / 15</span><span id='quiz-score-text' style='color:#c9a86a;font-size:13px;font-weight:bold;'>Score : 0</span></div><div style='background:#f0e6d3;border-radius:20px;height:10px;overflow:hidden;'><div id='quiz-progress-barre' style='background:#c9a86a;height:100%;border-radius:20px;width:0%;transition:width 0.4s ease;'></div></div></div><div id='quiz-content'></div>";
  panel.appendChild(box);
  document.body.appendChild(panel);
  document.getElementById("close-quiz").onclick = function() { panel.remove(); };

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
      db.collection("users").doc(uid).update({
        quizModule4Score: score,
        quizModule4Total: questions.length,
        quizModule4Date: new Date().toISOString()
      }).catch(function(e) { console.log("Erreur sauvegarde quiz:", e); });
    }
  }

  renderQuestion();
}
