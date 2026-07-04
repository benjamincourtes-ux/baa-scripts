function openQuizModule8() {
  if (!window.quizModule8Questions) { console.log("Quiz module 8 non chargé"); return; }
  if (document.getElementById("baa-quiz-panel")) return;

  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;
  var questions = window.quizModule8Questions;
  var currentQ = 0; var score = 0; var answered = false;

  var panel = document.createElement("div"); panel.id = "baa-quiz-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:30px;overflow-y:auto;";
  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:92%;max-width:680px;border-radius:20px;padding:28px;font-family:Arial,sans-serif;max-height:92vh;overflow-y:auto;margin-bottom:30px;";
  panel.appendChild(box); document.body.appendChild(panel);
  panel.onclick = function(e) { if (e.target === panel) panel.remove(); };

  function afficherQuestion() {
    answered = false;
    var q = questions[currentQ];
    var pct = Math.round((currentQ / questions.length) * 100);
    box.innerHTML =
      "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'>" +
      "<h2 style='color:#8b735d;margin:0;font-size:18px;'>📚 La Vente</h2>" +
      "<span id='close-quiz' style='cursor:pointer;font-size:28px;color:#8b735d;'>✕</span></div>" +
      "<div style='background:#e8d4b0;border-radius:10px;height:8px;margin-bottom:8px;'><div style='background:#c9a86a;height:8px;border-radius:10px;width:" + pct + "%;transition:width 0.3s;'></div></div>" +
      "<p style='color:#999;font-size:12px;margin-bottom:20px;'>Question " + (currentQ+1) + " / " + questions.length + "</p>" +
      "<div style='background:white;border-radius:14px;padding:20px;border:1px solid #e8d4b0;margin-bottom:16px;'><p style='color:#3a3a3a;font-size:15px;font-weight:bold;margin:0;line-height:1.5;'>" + q.question + "</p></div>" +
      "<div id='options-container'></div>";

    document.getElementById("close-quiz").onclick = function() { panel.remove(); };

    var opts = document.getElementById("options-container");
    q.options.forEach(function(opt, i) {
      var btn = document.createElement("button");
      btn.style.cssText = "width:100%;text-align:left;padding:14px 18px;border-radius:10px;border:1px solid #e8d4b0;background:white;cursor:pointer;font-size:14px;color:#3a3a3a;margin-bottom:8px;display:block;";
      btn.innerText = ["A","B","C","D"][i] + ". " + opt;
      btn.onclick = function() {
        if (answered) return; answered = true;
        if (i === q.correct) { score++; btn.style.background = "#d5f5e3"; btn.style.borderColor = "#2ecc71"; btn.style.color = "#1a8a4a"; }
        else { btn.style.background = "#fadbd8"; btn.style.borderColor = "#e74c3c"; btn.style.color = "#c0392b"; opts.querySelectorAll("button")[q.correct].style.background = "#d5f5e3"; opts.querySelectorAll("button")[q.correct].style.borderColor = "#2ecc71"; }
        setTimeout(function() {
          currentQ++;
          if (currentQ < questions.length) { afficherQuestion(); }
          else { afficherResultat(); }
        }, 800);
      };
      opts.appendChild(btn);
    });
  }

  function afficherResultat() {
    var pct = Math.round((score / questions.length) * 100);
    var reussi = pct >= 80;
    box.innerHTML =
      "<div style='text-align:center;padding:20px;'>" +
      "<div style='font-size:60px;margin-bottom:16px;'>" + (reussi ? "🏆" : "💪") + "</div>" +
      "<h2 style='color:#3a3a3a;margin-bottom:8px;'>" + (reussi ? "Félicitations !" : "Continue tes efforts !") + "</h2>" +
      "<p style='color:#888;margin-bottom:20px;'>Tu as obtenu <strong>" + score + "/" + questions.length + "</strong> (" + pct + "%)</p>" +
      "<div style='background:#f3e7d3;border-radius:12px;padding:16px;margin-bottom:20px;'>" +
      "<p style='color:#8b735d;font-size:14px;margin:0;'>" + (reussi ? "Module validé ! Tu maîtrises les bases de la vente. 🌟" : "Il te faut 80% pour valider ce module. Réessaie !") + "</p></div>" +
      (reussi ? "<button id='valider-quiz' style='background:#c9a86a;color:white;border:none;padding:14px 28px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;margin-bottom:10px;width:100%;'>Valider le module ✓</button>" : "") +
      "<button id='recommencer-quiz' style='background:#f3e7d3;color:#8a6a35;border:1px solid #c8a96b;padding:14px 28px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:15px;width:100%;'>Recommencer</button></div>";

    if (reussi && document.getElementById("valider-quiz")) {
      document.getElementById("valider-quiz").onclick = function() {
        db.collection("users").doc(uid).update({ quizModule8Complete: true }).then(function() {
          if (typeof window.ajouterPointsBadge === "function") window.ajouterPointsBadge(20);
          panel.remove();
        });
      };
    }
    if (document.getElementById("recommencer-quiz")) {
      document.getElementById("recommencer-quiz").onclick = function() { currentQ = 0; score = 0; afficherQuestion(); };
    }
  }

  afficherQuestion();
}
