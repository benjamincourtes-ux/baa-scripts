function openQuizModule5() {
  if (document.getElementById("baa-quiz-panel")) return;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;
  if (uid) {
    db.collection("users").doc(uid).get().then(function(snapCheck) {
      var dCheck = snapCheck.data();
      if (dCheck && dCheck.quizModule5Complete === true) {
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
    { q: "Que symbolise le Phoenix selon le Chapitre 1 ?", options: ["La fragilite et la peur", "La renaissance et la transformation par les epreuves", "L'echec definitif", "La perfection sans effort"], correct: 1, explain: "Le Phoenix ne meurt pas vraiment, il se transforme : il brule, s'effondre, puis s'eleve a nouveau, plus puissant qu'avant." },
    { q: "Selon le Chapitre 1, que represente chaque non recu ou moment de fragilite ?", options: ["Une preuve d'echec definitif", "Une etape necessaire vers sa version la plus accomplie", "Un signal pour abandonner", "Une coincidence sans importance"], correct: 1, explain: "Chaque fin est un commencement deguise : chaque non, chaque hesitation est une etape necessaire vers la version la plus accomplie de soi." },
    { q: "Selon le Chapitre 2, qu'est-ce que la confiance en soi ?", options: ["Un trait de caractere inne", "Une competence qui se developpe comme un muscle", "Quelque chose que l'on a ou pas, sans evolution possible", "Un don reserve a certaines personnes"], correct: 1, explain: "La confiance en soi est une competence que l'on developpe, un muscle qui se renforce par la pratique reguliere." },
    { q: "Que ressentent les clientes selon le Chapitre 2 ?", options: ["Uniquement les mots prononces", "Qui vous etes quand vous le dites, pas seulement ce que vous dites", "Rien de particulier", "Seulement le prix des produits"], correct: 1, explain: "Les clientes ne ressentent pas seulement ce que vous dites, elles ressentent qui vous etes quand vous le dites : la posture suffit." },
    { q: "Que sont les patterns d'auto-sabotage selon le Chapitre 2 ?", options: ["Des faiblesses irreversibles", "Des mecanismes de protection appris dans l'enfance", "Une preuve d'incompetence definitive", "Un trait de personnalite fixe"], correct: 1, explain: "Les patterns d'auto-sabotage ne sont pas des faiblesses mais des mecanismes de protection appris : les identifier permet de s'en liberer." },
    { q: "D'ou nait le syndrome de l'imposteur selon le Chapitre 3 ?", options: ["D'un manque reel de competences", "D'une confusion entre expertise technique et legitimite humaine", "D'un excès de confiance", "D'une mauvaise formation uniquement"], correct: 1, explain: "Le syndrome de l'imposteur nait d'une confusion entre expertise technique et legitimite humaine : la legitimite vient de l'authenticite, pas du diplome." },
    { q: "Que precede l'action selon le Chapitre 3 (loi du developpement personnel) ?", options: ["La confiance precede toujours l'action", "L'action precede la motivation, pas l'inverse", "Il faut attendre de se sentir prete avant d'agir", "Rien ne precede rien"], correct: 1, explain: "L'action precede la motivation : ne cherchez pas a vous sentir confiante avant d'agir, agissez et la confiance suivra." },
    { q: "Selon le Chapitre 4, que signifie reellement un refus client ?", options: ["Une evaluation de la valeur personnelle", "Que ce n'est pas le bon moment, jamais un jugement sur la valeur", "Une preuve d'incompetence", "Qu'il faut abandonner l'activite"], correct: 1, explain: "Un refus n'est jamais une evaluation de la valeur personnelle : c'est simplement que ce n'est pas le bon moment ou que la valeur n'a pas ete comprise." },
    { q: "Que recommande le Chapitre 4 de tenir pour cultiver la resilience ?", options: ["Un tableau de ventes uniquement", "Un journal des refus avec ce qu'on en apprend", "Une liste de plaintes", "Rien de particulier"], correct: 1, explain: "Tenir un journal des refus permet de voir un pattern se dessiner : on survit toujours, et chaque refus rend un peu plus fort." },
    { q: "Selon le Chapitre 5, qu'est-ce qui bat toujours l'intensite ?", options: ["Le talent brut", "La constance", "La chance", "Le budget publicitaire"], correct: 1, explain: "La constance bat toujours l'intensite : une partenaire qui agit un peu chaque jour surpasse celle qui fait des sprints puis s'effondre." },
    { q: "Quelle est la 'regle des 2 minutes' presentee au Chapitre 5 ?", options: ["Travailler 2 minutes par semaine seulement", "S'engager a agir seulement 2 minutes pour briser l'inertie", "Attendre 2 minutes avant chaque decision", "Faire une pause de 2 minutes toutes les heures"], correct: 1, explain: "Quand la motivation manque, s'engager a agir seulement 2 minutes suffit souvent a briser l'inertie et lancer un elan plus long." },
    { q: "Selon le Chapitre 6, que representent les mois 1 a 2 dans le parcours type ?", options: ["La phase de revenus stabilises", "La phase de plantation : apprentissage et premieres prospections", "L'echec garanti", "La phase de recrutement massif"], correct: 1, explain: "Les mois 1-2 sont la phase de plantation : apprentissage, premieres prospections, construction de la liste de contacts, avec des resultats modestes mais normaux." },
    { q: "Que faut-il faire selon le Chapitre 6 pendant les periodes de doute ?", options: ["Abandonner immediatement", "Revenir a son pourquoi profond comme ancre dans les tempetes", "Ignorer completement la situation", "Changer d'activite"], correct: 1, explain: "La vision long terme et le pourquoi profond sont l'ancre dans les tempetes passagères : il faut y revenir quand le doute survient." },
    { q: "Que signifie le 'S' du triangle STOP presente dans la section bonus ?", options: ["Suivre les autres", "Stopper : interrompre physiquement ce que l'on fait", "Sourire constamment", "Supprimer ses pensees"], correct: 1, explain: "Le S de STOP signifie Stopper : interrompre physiquement l'action en cours, poser son telephone, fermer les yeux quelques secondes." },
    { q: "Selon la section bonus, que signifie reellement la presence du syndrome de l'imposteur ?", options: ["Une preuve d'incompetence certaine", "Souvent un signe d'exigence envers soi-meme, pas d'incompetence", "Qu'il faut arreter l'activite", "Rien de particulier"], correct: 1, explain: "Sa presence n'est jamais une preuve d'incompetence : seules les personnes exigeantes envers elles-memes le ressentent generalement." }
  ];

  var currentIndex = 0;
  var score = 0;
  var answered = false;

  var panel = document.createElement("div");
  panel.id = "baa-quiz-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:40px;padding-bottom:40px;overflow-y:auto;";
  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;font-family:Arial,sans-serif;max-height:90vh;overflow-y:auto;";
  box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'><h2 style='color:#8b735d;margin:0;'>Quiz Module 5</h2><span id='close-quiz' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div style='color:#999;font-size:13px;margin-bottom:20px;'>Developpement Personnel & Mental de Reussite</div><div id='quiz-progress-container' style='margin-bottom:20px;'><div style='display:flex;justify-content:space-between;margin-bottom:6px;'><span id='quiz-progress-text' style='color:#8b735d;font-size:13px;font-weight:bold;'>Question 1 / 15</span><span id='quiz-score-text' style='color:#c9a86a;font-size:13px;font-weight:bold;'>Score : 0</span></div><div style='background:#f0e6d3;border-radius:20px;height:10px;overflow:hidden;'><div id='quiz-progress-barre' style='background:#c9a86a;height:100%;border-radius:20px;width:0%;transition:width 0.4s ease;'></div></div></div><div id='quiz-content'></div>";
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
        quizModule5Score: score,
        quizModule5Total: questions.length,
        quizModule5Date: new Date().toISOString()
      };
      if (pctSave >= 80) { updateData.quizModule5Complete = true; } else { updateData.quizModule5Complete = false; }
      db.collection("users").doc(uid).update(updateData).catch(function(e) { console.log("Erreur sauvegarde quiz:", e); });
    }
  }

  renderQuestion();
  }
}
