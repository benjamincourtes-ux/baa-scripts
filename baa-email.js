// BAA Email Service — SMTP.js + Gmail
window.baaEmail = {
  gmailUser: "TON_ADRESSE_GMAIL",
  gmailPass: "TON_MOT_DE_PASSE_APP",

  send: function(to, sujet, prenom, corps) {
    return new Promise(function(resolve) {
      var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='font-family:Arial,sans-serif;background:#f8f3ee;margin:0;padding:20px;'><div style='max-width:600px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);'><div style='background:linear-gradient(135deg,#1a0a00,#3d1f05);padding:32px;text-align:center;'><div style='font-size:40px;margin-bottom:8px;'>🐦‍🔥</div><h1 style='color:#f5d48a;margin:0;font-size:22px;letter-spacing:1px;'>Académie Beauty Addict</h1></div><div style='padding:32px;'>" + corps + "</div><div style='background:#f8f3ee;padding:20px;text-align:center;border-top:1px solid #e8d4b0;'><p style='color:#c9a86a;font-size:12px;margin:0;'>Beauty Addict Academy • Tous droits réservés</p></div></div></body></html>";

      Email.send({
        Host: "smtp.gmail.com",
        Username: window.baaEmail.gmailUser,
        Password: window.baaEmail.gmailPass,
        To: to,
        From: window.baaEmail.gmailUser,
        Subject: sujet,
        Body: html
      }).then(function(msg) {
        console.log("Email envoyé à " + to + ":", msg);
        resolve(true);
      }).catch(function(e) {
        console.log("Erreur email:", e);
        resolve(false);
      });
    });
  },

  bienvenue: function(prenom, nom, email) {
    var corps = "<h2 style='color:#3d1f05;'>Bonjour " + prenom + " ! 🐦‍🔥</h2><p style='color:#555;line-height:1.7;'>Ton compte sur l'Académie Beauty Addict vient d'être activé. Tu peux maintenant te connecter et accéder à tout le contenu de l'académie.</p><p style='color:#555;line-height:1.7;'>Ton envol vers la liberté commence maintenant. ✨</p><div style='text-align:center;margin-top:24px;'><a href='https://academie-beauty-addict.super.site' style='background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;padding:12px 28px;border-radius:25px;text-decoration:none;font-weight:bold;font-size:14px;'>Accéder à l'Académie →</a></div>";
    return this.send(email, "🐦‍🔥 Bienvenue dans l'Académie Beauty Addict !", prenom, corps);
  },

  annonce: function(destinataires, titre, message) {
    var self = this;
    var promises = destinataires.map(function(d) {
      var corps = "<h2 style='color:#3d1f05;'>Bonjour " + (d.prenom||"Phénix") + " ! 🐦‍🔥</h2><p style='color:#555;line-height:1.7;white-space:pre-line;'>" + message + "</p>";
      return self.send(d.email, titre, d.prenom||"Phénix", corps);
    });
    return Promise.all(promises);
  },

  victoire: function(destinataires, auteur, texte) {
    var self = this;
    var sujet = "🏆 " + auteur + " a partagé une victoire sur l'Académie !";
    var promises = destinataires.map(function(d) {
      var corps = "<h2 style='color:#3d1f05;'>Bonjour " + (d.prenom||"Phénix") + " ! 🏆</h2><p style='color:#555;line-height:1.7;'><strong>" + auteur + "</strong> vient de partager une victoire :</p><div style='background:#f8f3ee;border-left:4px solid #c9a86a;padding:16px;border-radius:0 8px 8px 0;margin:16px 0;color:#3a3a3a;font-style:italic;'>" + texte + "</div><div style='text-align:center;margin-top:24px;'><a href='https://academie-beauty-addict.super.site' style='background:linear-gradient(135deg,#c9a86a,#f5d48a);color:#1a0a00;padding:12px 28px;border-radius:25px;text-decoration:none;font-weight:bold;font-size:14px;'>Voir le Mur des Victoires →</a></div>";
      return self.send(d.email, sujet, d.prenom||"Phénix", corps);
    });
    return Promise.all(promises);
  },

  defi: function(destinataires, titreDefi, descDefi) {
    var self = this;
    var sujet = "⚡ Nouveau Défi Éclair — " + titreDefi;
    var promises = destinataires.map(function(d) {
      var corps = "<h2 style='color:#3d1f05;'>Bonjour " + (d.prenom||"Phénix") + " ! ⚡</h2><p style='color:#555;line-height:1.7;'>Un nouveau Défi Éclair vient d'être lancé !</p><div style='background:#fff8f0;border:1px solid #f5c4b3;border-radius:10px;padding:16px;margin:16px 0;'><h3 style='color:#D85A30;margin:0 0 8px;'>" + titreDefi + "</h3><p style='color:#555;margin:0;'>" + descDefi + "</p></div><div style='text-align:center;margin-top:24px;'><a href='https://academie-beauty-addict.super.site' style='background:linear-gradient(135deg,#D85A30,#f5d48a);color:#1a0a00;padding:12px 28px;border-radius:25px;text-decoration:none;font-weight:bold;font-size:14px;'>Relever le défi →</a></div>";
      return self.send(d.email, sujet, d.prenom||"Phénix", corps);
    });
    return Promise.all(promises);
  }
};
