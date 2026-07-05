// BAA Telegram Notifications
window.baaTelegram = {
  token: "8890784714:AAH4ngpfizl2OhHZTeim1aOldC_mGRBMSso",
  chatId: "-1003902168054",

  send: async function(message) {
    try {
      var r = await fetch("https://api.telegram.org/bot" + this.token + "/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: "HTML"
        })
      });
      var data = await r.json();
      if (data.ok) console.log("Telegram envoyé"); else console.log("Telegram erreur:", data);
      return data.ok;
    } catch(e) { console.log("Telegram error:", e); return false; }
  },

  // Nouvelle victoire
  victoire: function(prenom, texte) {
    var msg = "🏆 <b>" + prenom + "</b> vient de partager une victoire !\n\n" +
              "✨ " + texte.substring(0, 200) + "\n\n" +
              "👉 Connecte-toi pour réagir !";
    return this.send(msg);
  },

  // Nouveau défi
  defi: function(titre, desc, duree) {
    var msg = "⚡ <b>Nouveau Défi Éclair !</b>\n\n" +
              "🎯 " + titre + "\n" +
              (desc ? "📝 " + desc + "\n" : "") +
              "⏱️ " + duree + "h pour relever le défi !\n\n" +
              "👉 Connecte-toi pour participer !";
    return this.send(msg);
  },

  // Annonce
  annonce: function(titre, message) {
    var msg = "📢 <b>" + titre + "</b>\n\n" + message + "\n\n" +
              "👉 Connecte-toi sur l'Académie !";
    return this.send(msg);
  },

  // Quiz validé
  quizValide: function(prenom, module) {
    var msg = "🎓 <b>" + prenom + "</b> vient de valider le " + module + " !\n\n" +
              "🔥 Bravo à elle ! 🐦‍🔥";
    return this.send(msg);
  },

  // Formation lue
  formationLue: function(prenom, formation) {
    var msg = "📚 <b>" + prenom + "</b> vient de lire la formation <b>" + formation + "</b> !\n\n" +
              "💪 Excellent investissement !";
    return this.send(msg);
  }
};
