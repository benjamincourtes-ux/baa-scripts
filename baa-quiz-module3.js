function openQuizModule3() {
  if (document.getElementById("baa-quiz-panel")) return;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;

  var questions = [
    { q: "Selon le Chapitre 1, que se passe-t-il si personne ne sait ce que vous faites ?", options: ["Cela n'a aucune importance", "Personne ne peut acheter chez vous", "Les clients viennent quand meme", "C'est un avantage pour la discretion"], correct: 1, explain: "Sans visibilite, personne ne peut acheter chez vous : la visibilite est le fondement meme de l'activite." },
    { q: "Quelle est la difference entre une presence magnetique et une presence intrusive ?", options: ["Il n'y a aucune difference", "La magnetique inspire et attire, l'intrusive fatigue et repousse", "L'intrusive est plus efficace", "La magnetique demande plus de publications"], correct: 1, explain: "La presence magnetique inspire, attire et fidelise, tandis que la presence intrusive fatigue, agace et repousse." },
    { q: "Quel est l'element cle d'une presence harmonieuse selon le Chapitre 1 ?", options: ["La quantite de publications", "La regularite", "Le nombre de followers", "Le budget publicitaire"], correct: 1, explain: "Ce n'est pas la quantite qui compte mais la constance : la regularite cree la confiance et la reconnaissance." },
    { q: "Combien de piliers compose un profil Facebook optimise selon le Chapitre 2 ?", options: ["3 piliers", "5 piliers", "10 piliers", "1 seul pilier"], correct: 1, explain: "Cinq piliers travaillent ensemble pour creer une image coherente et attractive sur le profil." },
    { q: "Quel type de photo de profil est recommande ?", options: ["Avec un filtre tres prononce", "A la lumiere naturelle, sourire sincere, fond neutre", "En groupe avec des amis", "Sombre et mysterieuse"], correct: 1, explain: "La photo de profil doit etre prise a la lumiere naturelle avec un sourire sincere et un fond neutre : l'authenticite prime sur la perfection." },
    { q: "Tous les combien de mois est-il conseille de renouveler sa photo de profil ?", options: ["Tous les mois", "Tous les 6 a 12 mois", "Une seule fois pour toujours", "Tous les 5 ans"], correct: 1, explain: "Il est conseille de renouveler sa photo de profil tous les 6 a 12 mois pour rester actuelle et reconnaissable." },
    { q: "Selon la mini-formation, quels sont les 3 types de contenus a publier ?", options: ["Personnel, valeur, business/produit", "Promo, promo, promo", "Photos, videos, texte", "Matin, midi, soir"], correct: 0, explain: "Les 3 types de contenus sont : contenu personnel (qui vous etes), contenu de valeur (conseils/education) et contenu business/produit (resultats, temoignages)." },
    { q: "Que renforce le contenu de valeur selon la mini-formation ?", options: ["Vos ventes immediates uniquement", "Votre credibilite", "Le nombre de followers uniquement", "Rien de particulier"], correct: 1, explain: "Le contenu de valeur (conseils, astuces, education, mindset, business) renforce la credibilite aupres de l'audience." },
    { q: "Selon le Chapitre 3 (regle 80/20), quelle proportion de contenu produit direct est recommandee ?", options: ["80% de produit", "50% de produit", "20% de produit", "100% de produit"], correct: 2, explain: "La regle 80/20 recommande 80% de contenu de valeur et seulement 20% de contenu produit direct." },
    { q: "Pourquoi les stories sont-elles considerees comme une 'arme secrete' (Chapitre 4) ?", options: ["Elles durent eternellement", "Elles offrent intimite, urgence (24h) et authenticite imparfaite", "Elles sont payantes", "Elles remplacent totalement les publications"], correct: 1, explain: "Les stories creent un sentiment d'urgence (24h), offrent une intimite unique et autorisent l'imperfection, contrairement aux publications classiques." },
    { q: "Combien de stories par jour est-il conseille de publier ?", options: ["1 a 2", "5 a 10", "50 et plus", "Aucune story n'est necessaire"], correct: 1, explain: "Il est conseille de poster 5 a 10 stories par jour pour maintenir une presence reguliere et engageante." },
    { q: "Qu'est-ce qui transforme un follower passif en membre actif selon le Chapitre 5 ?", options: ["Le nombre de publications", "L'engagement (commentaires, partages, reactions)", "Le prix des produits", "La frequence des promotions"], correct: 1, explain: "Un follower qui commente, repond, partage et reagit devient un membre actif de la communaute, potentiellement une cliente ou partenaire." },
    { q: "Quelle erreur consiste a publier uniquement des photos produits selon le Chapitre 6 ?", options: ["C'est la strategie ideale", "Cela ressemble a un catalogue, pas a une presence humaine", "Cela genere toujours plus de ventes", "C'est sans consequence"], correct: 1, explain: "Une feed remplie uniquement de produits ressemble a un catalogue : l'audience veut connaitre la personne, pas seulement ses produits." },
    { q: "Que dit le guide sur la recherche de la perfection avant de publier ?", options: ["Elle garantit toujours un meilleur resultat", "C'est la garantie de ne jamais publier ; la regularite imparfaite bat la perfection intermittente", "Il faut toujours attendre le moment parfait", "C'est sans importance"], correct: 1, explain: "Attendre la perfection est la garantie de ne jamais publier. La regularite imparfaite bat toujours la perfection intermittente." },
    { q: "Quel est le veritable objectif des reseaux sociaux selon la mini-formation ?", options: ["Courir apres les gens pour vendre", "Devenir suffisamment visible, credible et inspirant(e) pour que les gens viennent naturellement", "Publier uniquement des promotions agressives", "Avoir le maximum de followers sans interaction"], correct: 1, explain: "L'objectif n'est pas de courir apres les gens, mais de devenir visible, credible et inspirant(e) pour qu'ils viennent naturellement a vous." }
  ];

  var currentIndex = 0;
  var score = 0;
  var answered = false;

  var panel = document.createElement("div");
  panel.id = "baa-quiz-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:40px;padding-bottom:40px;overflow-y:auto;";
  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;font-family:Arial,sans-serif;max-height:90vh;overflow-y:auto;";
  box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'><h2 style='color:#8b735d;margin:0;'>Quiz Module 3</h2><span id='close-quiz' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div style='color:#999;font-size:13px;margin-bottom:20px;'>Reseaux Sociaux & Attraction</div><div id='quiz-progress-container' style='margin-bottom:20px;'><div style='display:flex;justify-content:space-between;margin-bottom:6px;'><span id='quiz-progress-text' style='color:#8b735d;font-size:13px;font-weight:bold;'>Question 1 / 15</span><span id='quiz-score-text' style='color:#c9a86a;font-size:13px;font-weight:bold;'>Score : 0</span></div><div style='background:#f0e6d3;border-radius:20px;height:10px;overflow:hidden;'><div id='quiz-progress-barre' style='background:#c9a86a;height:100%;border-radius:20px;width:0%;transition:width 0.4s ease;'></div></div></div><div id='quiz-content'></div>";
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
        quizModule3Score: score,
        quizModule3Total: questions.length,
        quizModule3Date: new Date().toISOString()
      };
      if (pctSave >= 80) { updateData.quizModule3Complete = true; } else { updateData.quizModule3Complete = false; }
      db.collection("users").doc(uid).update(updateData).catch(function(e) { console.log("Erreur sauvegarde quiz:", e); });
    }
  }

  renderQuestion();
}
