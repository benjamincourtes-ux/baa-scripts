function openQuizModule7() {
  if (document.getElementById("baa-quiz-panel")) return;
  var auth = firebase.auth();
  var db = firebase.firestore();
  var uid = auth.currentUser ? auth.currentUser.uid : null;
  if (uid) {
    db.collection("users").doc(uid).get().then(function(snapCheck) {
      var dCheck = snapCheck.data();
      if (dCheck && dCheck.quizModule7Complete === true) {
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
    {
      q: "Selon la Parrainage Academy (Module 1), que signifie vraiment parrainer ?",
      options: ["Convaincre un maximum de personnes de rejoindre l'equipe", "Attirer, inspirer, connecter, comprendre et accompagner", "Recruter rapidement pour maximiser ses revenus", "Presenter les produits et le plan de compensation"],
      correct: 1,
      explain: "Le vrai parrainage est un art relationnel qui consiste a attirer, inspirer, connecter, comprendre et accompagner. Ce n'est jamais forcer ou convaincre."
    },
    {
      q: "Module 1 — Les gens rejoignent-ils d'abord une societe MLM ?",
      options: ["Oui, c'est la reputation de la societe qui compte avant tout", "Non, ils rejoignent une personne : son energie, sa vision, sa posture, son leadership", "Oui, si le plan de compensation est suffisamment attractif", "Oui, si les produits sont reconnus et de qualite"],
      correct: 1,
      explain: "Les gens rejoignent rarement une societe en premier. Ils rejoignent une personne et ses qualites : energie, vision, posture et leadership."
    },
    {
      q: "Module 1 — L'erreur numero 1 dans la presentation de l'opportunite est de trop parler de :",
      options: ["Ses resultats personnels et de son parcours", "La societe, le plan de compensation et les commissions, au detriment de l'humain et de la vision", "Les produits et leurs benefices", "La duree necessaire pour reussir"],
      correct: 1,
      explain: "On parle trop souvent de la societe, du plan et des commissions, pas assez de l'humain, de la vision et de la transformation. Les emotions convertissent plus que les arguments."
    },
    {
      q: "Module 1 — Le vrai parrainage est decrit comme :",
      options: ["Une chasse, une course, une bataille commerciale", "Un art relationnel base sur la confiance, la credibilite, la relation et le leadership", "Une technique de vente adaptee au MLM", "Un systeme de recommandation produits"],
      correct: 1,
      explain: "Le parrainage n'est pas une chasse, une course ou une bataille. C'est un art relationnel dont les piliers essentiels sont la confiance, la credibilite, la relation et le leadership."
    },
    {
      q: "Module 2 — Quelle est la vraie signification d'un 'non' recu d'un prospect ?",
      options: ["L'opportunite n'est pas assez interessante", "Le plan de compensation n'est pas assez fort", "Derriere un non se cache souvent une peur (d'echouer, du regard des autres, du MLM)", "La personne n'a simplement pas le profil pour ce metier"],
      correct: 2,
      explain: "Dans la majorite des cas, un non ne signifie pas que l'opportunite est mauvaise. Derriere un non se cache souvent une peur : d'echouer, du regard des autres, du MLM ou de l'argent."
    },
    {
      q: "Module 2 — Quand un prospect objecte, quelle est l'erreur la plus frequente ?",
      options: ["Poser des questions pour mieux comprendre sa situation", "Argumenter immediatement pour contrer l'objection, ce qui le ferme encore plus", "Accepter son refus avec bienveillance et passer au suivant", "Reformuler son objection pour montrer qu'on a compris"],
      correct: 1,
      explain: "L'erreur frequente est d'argumenter immediatement face a une objection. Cela ferme encore plus le prospect. Ne cherche pas a gagner un debat — cherche a comprendre."
    },
    {
      q: "Module 2 — La phrase 'Je n'ai pas le temps' cache souvent :",
      options: ["Une vraie surcharge de travail qu'il faut respecter", "Un emploi du temps incompatible avec une activite complementaire", "La peur de ne pas reussir plutot qu'un manque de temps reel", "Une preference pour d'autres priorites de vie"],
      correct: 2,
      explain: "Apprends a ecouter entre les lignes. 'Je n'ai pas le temps' cache souvent 'J'ai peur de ne pas reussir'. Derriere chaque objection se cache une emotion non exprimee."
    },
    {
      q: "Module 2 — La bonne posture face aux objections est de passer :",
      options: ["Du mode ecoute au mode argumentation", "Du mode vendeur au mode coach, en posant des questions plutot qu'en convainquant", "Du mode doux au mode plus insistant si necessaire", "Du mode questions au mode presentation de l'opportunite"],
      correct: 1,
      explain: "Il faut passer du mode vendeur au mode coach. Au lieu de convaincre, pose des questions : 'Qu'est-ce qui te freine reellement ?', 'De quoi aurais-tu besoin pour te sentir rassure(e) ?'. Les questions ouvrent. La pression ferme."
    },
    {
      q: "Module 3 — Quand commence vraiment le recrutement selon la Parrainage Academy ?",
      options: ["Des le premier message prive envoye au prospect", "Lors de la presentation formelle de l'opportunite", "Avant meme le message prive — ton image parle avant toi", "Apres plusieurs semaines d'echanges pour etablir la confiance"],
      correct: 2,
      explain: "Le recrutement commence bien avant le message prive. En quelques secondes, le prospect se forge une opinion sur ton profil, ton contenu, ton energie, ta posture et ta credibilite. Ton image parle avant toi."
    },
    {
      q: "Module 3 — Quels sont les 4 piliers du personal branding ?",
      options: ["Visibilite, connexion, conversion, fidelisation", "Authenticite, credibilite, valeur, coherence", "Contenu, stories, reels, lives", "Leadership, vision, energie, posture"],
      correct: 1,
      explain: "Les 4 piliers du personal branding sont : Authenticite (etre vrai), Credibilite (inspirer confiance), Valeur (donner avant de demander), Coherence (raconter une histoire claire)."
    },
    {
      q: "Module 3 — Le pilier 'Valeur' signifie concretement :",
      options: ["Afficher la valeur monetaire de son opportunite", "Montrer combien on gagne pour prouver la valeur du business", "Donner avant de demander : conseils, astuces, enseignements, inspiration", "Valider ses produits avec des temoignages clients"],
      correct: 2,
      explain: "Pilier Valeur = donner avant de demander. Ne poste pas uniquement des promotions, offres et recrutement. Apporte aussi des conseils, astuces, enseignements et inspiration. La valeur attire naturellement."
    },
    {
      q: "Module 3 — La 'coherence' dans le personal branding signifie :",
      options: ["Poster tous les jours sans exception", "Toujours parler des memes produits pour rester dans un seul sujet", "Raconter une histoire claire et alignee dans le temps — si aujourd'hui tu inspires une chose et demain son contraire, l'audience se perd", "Utiliser les memes couleurs et la meme charte graphique sur tous tes posts"],
      correct: 2,
      explain: "La coherence, c'est raconter une histoire claire dans la duree. Si aujourd'hui tu inspires une chose et demain son contraire, ton audience se perd. Une image forte est coherente."
    },
    {
      q: "Module 3 — Pourquoi vouloir ressembler a d'autres leaders est une erreur ?",
      options: ["Parce que c'est techniquement impossible a reproduire fidelement", "Parce qu'on devient invisible : ce qui attire vraiment c'est ta singularite, ta difference est ton pouvoir", "Parce que les autres leaders pourraient s'en apercevoir et mal le prendre", "Parce que cela demande trop de temps et d'energie"],
      correct: 1,
      explain: "Copier les posts, scripts et attitudes des autres mene a l'invisibilite. Ce qui attire vraiment c'est ta singularite. Ta difference n'est pas un defaut — c'est ton pouvoir."
    },
    {
      q: "Module 3 — Pour inspirer confiance (pilier Credibilite), tu n'as pas besoin d'etre parfait(e) mais tu dois montrer :",
      options: ["Tous tes resultats financiers des les premieres publications", "Du serieux, de la constance, du professionnalisme et du leadership", "Une vie ideale sans aucune difficulte visible", "Une expertise complete sur tous les produits de la gamme"],
      correct: 1,
      explain: "Credibilite ne signifie pas perfection. Tu dois montrer du serieux, de la constance, du professionnalisme et du leadership. La credibilite rassure."
    },
    {
      q: "Module 4 — Quel est le principal probleme de poster beaucoup sans intention ?",
      options: ["L'algorithme des reseaux sociaux penalise les publications trop frequentes", "Un contenu sans intention claire convertit rarement, meme si on poste tous les jours", "Les abonnes se lassent de voir trop de posts de la meme personne", "Cela montre qu'on manque de contenu qualitatif"],
      correct: 1,
      explain: "Beaucoup publient tous les jours et ne recrutent pas. La raison : un contenu sans intention claire convertit rarement. Il faut toujours se demander pourquoi on publie chaque contenu."
    },
    {
      q: "Module 4 — Le 'contenu de connexion' a pour objectif de :",
      options: ["Attirer de nouvelles personnes vers son profil", "Transformer l'interet d'un prospect en action concrete", "Faire aimer la personne derriere la marque en partageant histoire, parcours, valeurs, coulisses", "Expliquer le fonctionnement du plan de compensation"],
      correct: 2,
      explain: "Le contenu de connexion (ton histoire, ton parcours, tes valeurs, tes coulisses, ton quotidien) a pour objectif de faire aimer la personne derriere la marque. Les gens se connectent aux emotions."
    },
    {
      q: "Module 4 — Poster uniquement des produits, promotions, offres et recrutement provoque :",
      options: ["Une forte notoriete car le message est clair et repetitif", "Le decrochage de l'audience — trop de business tue l'interet", "Une meilleure credibilite car on montre son serieux", "Un recrutement plus rapide car l'intention est claire"],
      correct: 1,
      explain: "Le piege du contenu repetitif : poster uniquement produits, promotions, offres et recrutement fait decrocher l'audience. L'audience finit par ignorer. Trop de business tue l'interet."
    },
    {
      q: "Module 4 — Parmi ces formats, lesquels sont cites comme 'les plus puissants' pour recruter ?",
      options: ["Les tutoriels produits detailles et les comparaisons de prix", "Le storytelling personnel, la transformation, les coulisses d'equipe et le leadership", "Les posts d'anniversaire et les photos de groupe", "Les lives de presentation du catalogue"],
      correct: 1,
      explain: "Les formats les plus puissants sont : storytelling personnel, transformation, coulisses d'equipe, leadership, reponses aux objections, vision long terme. Les gens rejoignent une energie."
    },
    {
      q: "Module 4 — La question strategique du Module 4 est : quand quelqu'un arrive sur ton profil, que voit-il ?",
      options: ["Le nombre de followers et de likes", "Des promos en boucle ou une leader inspirante ?", "Le prix de tes produits phares", "Le lien vers ta boutique en ligne"],
      correct: 1,
      explain: "La question strategique : quand quelqu'un arrive sur ton profil, voit-il des promos ou une leader inspirante ? Prends le temps d'y repondre honnetement — c'est ce qui determine qui te contacte."
    },
    {
      q: "Module 5 — La peur principale qui bloque la prospection est :",
      options: ["Le manque de produits a presenter ou la complexite du catalogue", "La peur de deranger, de paraitre insistante, d'etre rejetee et de ne pas savoir quoi dire", "Le manque de temps disponible dans la journee", "La complexite du plan de compensation a expliquer"],
      correct: 1,
      explain: "Beaucoup n'osent pas prospecter car elles pensent : 'Je vais deranger', 'Je vais paraitre insistante', 'Je vais me faire rejeter', 'Je ne sais pas quoi dire'. La peur bloque plus que le manque de competences."
    },
    {
      q: "Module 5 — 'Prospecter, c'est...' selon la Parrainage Academy :",
      options: ["Forcer, insister, spammer et manipuler jusqu'a obtenir un oui", "Convaincre un maximum de personnes de rejoindre son equipe", "Creer une ouverture — rien de plus", "Vendre l'opportunite des le premier contact pour gagner du temps"],
      correct: 2,
      explain: "Prospecter ne veut pas dire forcer, insister, spammer ou manipuler. Prospecter, c'est creer une ouverture. La relation vient ensuite."
    },
    {
      q: "Module 5 — Le bon etat d'esprit pour prospecter est :",
      options: ["Je dois absolument recruter cette personne aujourd'hui pour atteindre mon objectif", "Je vais voir si cette personne a un besoin — le detachement cree une meilleure energie", "Je dois etre persuasif(ve) pour que cette personne ne passe pas a cote d'une opportunite", "Je dois convaincre avant que quelqu'un d'autre ne la recrute"],
      correct: 1,
      explain: "La bonne posture : 'Je vais voir si cette personne a un besoin'. Pas 'Je dois absolument recruter'. Le detachement cree une meilleure energie et attire plus que la pression."
    },
    {
      q: "Module 5 — Les 'prospects chauds' sont definis comme :",
      options: ["Les personnes qu'on ne connait pas encore mais qui semblent interesses", "Les anciens clients qui ont deja achete des produits", "Les personnes engagees, viewers reguliers de stories et personnes curieuses", "Les abonnes silencieux qui regardent sans jamais interagir"],
      correct: 2,
      explain: "Les prospects chauds sont les personnes engagees, les viewers reguliers de stories et les personnes curieuses. Ce sont les plus receptifs — commence par eux."
    },
    {
      q: "Module 5 — Pour briser la glace naturellement avant un message business, la Parrainage Academy recommande :",
      options: ["D'envoyer d'abord un message presentant l'opportunite de maniere enthousiaste", "De reagir a une story, commenter un post ou creer une interaction sincere avant de parler business", "D'inviter directement a une presentation ou un appel zoom", "De mentionner directement le nom de la societe pour etre transparent"],
      correct: 1,
      explain: "La relation commence avant le message business. Reagir a une story, commenter un post ou creer une interaction sincere sont les 3 facons naturelles de briser la glace. Le business trop rapide fait fuir."
    },
    {
      q: "Module 5 — L'approche en 3 etapes est :",
      options: ["Presenter → Argumenter → Conclure rapidement", "Connecter → Qualifier → Proposer (chaque etape a son importance)", "Contacter → Informer → Recruter dans la foulee", "Attirer → Convaincre → Vendre"],
      correct: 1,
      explain: "L'approche efficace est : Connexion (creer un lien humain sincere) → Comprehension (identifier les besoins reels) → Proposition (offrir une solution adaptee). Chaque etape a son importance — ne bruler aucune."
    },
    {
      q: "Module 5 — Parmi ces comportements, lequel repousse les prospects ?",
      options: ["Poser des questions ouvertes sur leur situation et leurs envies", "Trop parler argent, mettre la pression, vouloir conclure trop vite", "Montrer ses resultats avec bienveillance et sans exageration", "Proposer un appel pour approfondir leur projet"],
      correct: 1,
      explain: "Les erreurs qui repoussent : copier-coller des scripts, trop parler de soi, trop parler argent, mettre la pression, vouloir conclure trop vite. La pression casse la confiance."
    },
    {
      q: "Module 5 — Comment gerer un prospect qui ne se decide pas tout de suite ?",
      options: ["Le relancer toutes les semaines avec de nouvelles arguments jusqu'a obtenir un oui", "Respecter son timing — certains sont prets maintenant, d'autres dans 3 mois ou 1 an", "Considerer qu'il n'est pas interresse et passer au suivant apres 48h", "Lui envoyer davantage d'informations sur l'opportunite pour l'aider a decider"],
      correct: 1,
      explain: "Tout le monde n'est pas au meme timing. Certains sont prets maintenant, d'autres dans 3 mois, d'autres encore murissent sur 1 an. Respecte le timing du prospect — ne casse pas la relation par l'impatience."
    },
    {
      q: "Module 6 — Pourquoi certaines conversations echouent-elles selon la Parrainage Academy ?",
      options: ["A cause de la qualite insuffisante de l'opportunite ou des produits", "Parce que les prospects ne sont pas assez qualifies", "A cause de la facon de communiquer, pas de l'opportunite elle-meme", "Parce que le marche est sature de propositions similaires"],
      correct: 2,
      explain: "Beaucoup de conversations echouent non pas a cause de l'opportunite, mais a cause de la facon de communiquer. Savoir ecouter est plus important que savoir parler."
    },
    {
      q: "Module 6 — La vraie mission lors d'une conversation est :",
      options: ["Convaincre le prospect que l'opportunite est la meilleure du marche", "Presenter tous les avantages pour qu'il ait tous les elements pour decider", "Comprendre, ecouter, guider et clarifier — jamais convaincre", "Montrer sa reussite pour l'inspirer a faire de meme"],
      correct: 2,
      explain: "Ta mission n'est pas de convaincre. Ta mission est de comprendre, ecouter, guider et clarifier. Le bon leader guide, il ne pousse pas."
    },
    {
      q: "Module 6 — Quand un prospect dit 'J'ai besoin d'argent', le besoin profond est generalement :",
      options: ["Un besoin de formation pour augmenter son employabilite", "Un besoin de securite (financiere, familiale)", "Un besoin de reconnaissance professionnelle", "Un besoin de trouver un emploi plus stable"],
      correct: 1,
      explain: "Le prospect parle souvent du symptome. 'J'ai besoin d'argent' cache generalement un besoin de securite. 'Je veux etre libre' cache un besoin d'autonomie. Il faut chercher la vraie motivation derriere les mots."
    },
    {
      q: "Module 6 — Pour que le prospect s'ouvre et se confie, il doit sentir :",
      options: ["Que tu es tres experte et que tu maitrises parfaitement tous les produits", "Que tu as de nombreux resultats impressionnants a lui montrer", "Zero jugement, de l'ecoute, de la bienveillance et du respect", "Que tu es tres enthousiaste et passionnee par l'opportunite"],
      correct: 2,
      explain: "Une personne s'ouvre quand elle sent : zero jugement, de l'ecoute, de la bienveillance et du respect. La confiance ouvre les portes — pas l'expertise ou les resultats."
    },
    {
      q: "Module 6 — Le 'closing naturel' : a quel moment faut-il proposer ?",
      options: ["Des les premieres minutes pour ne pas perdre de temps", "Seulement apres avoir compris le besoin, cree la connexion et detecte l'ouverture", "Apres avoir presente tous les avantages financiers de l'opportunite", "Au bout de la troisieme conversation systematiquement"],
      correct: 1,
      explain: "Ne propose pas trop tot. Attends d'avoir : (01) compris le besoin, (02) cree la connexion, (03) detecte l'ouverture. Le bon timing est essentiel."
    },
    {
      q: "Module 6 — Que revele la question 'Qu'est-ce qui te manque actuellement ?' selon le Module 6 ?",
      options: ["Le budget disponible du prospect", "Les produits dont il a besoin pour ameliorer son quotidien", "Les besoins profonds et vraies motivations du prospect", "Le niveau d'urgence de sa situation financiere"],
      correct: 2,
      explain: "Les bonnes questions ouvrent les vraies conversations. 'Qu'est-ce qui te manque actuellement ?' comme 'Pourquoi maintenant ?', 'Qu'est-ce que tu recherches ?' permettent de reveler les besoins profonds et les vraies motivations."
    },
    {
      q: "Module 6 — L'erreur fatale en conversation qui fait fuir le prospect est :",
      options: ["Poser trop de questions ce qui peut sembler intrusif", "La pression : relances agressives, urgence artificielle, insistance", "Etre trop a l'ecoute et ne pas assez parler de l'opportunite", "Montrer trop d'enthousiasme pour la societe"],
      correct: 1,
      explain: "La pression detruit la decision. Les relances agressives, l'urgence artificielle et l'insistance font fuir le prospect. La pression ferme. La confiance ouvre."
    },
    {
      q: "Module 6 — La phrase 'Le bon leader guide, il ne pousse pas' apparait dans quel contexte ?",
      options: ["Dans le Module 5 sur la prospection sans etre lourd", "Dans le Module 6 sur la vraie mission en conversation : comprendre, ecouter, guider, clarifier", "Dans le Module 8 sur le recrutement avec authenticite", "Dans le Module 9 sur le plan d'action 30 jours"],
      correct: 1,
      explain: "Cette phrase est au coeur du Module 6 (L'art de la conversation) : ta mission n'est pas de convaincre, c'est de comprendre, ecouter, guider et clarifier. Le bon leader guide, il ne pousse pas."
    },
    {
      q: "Module 8 — Le plus grand mythe du MLM est de croire qu'il faut obligatoirement etre :",
      options: ["Bien forme sur tous les produits avant de demarrer", "Extraveti, ultra charismatique, excellent vendeur et toujours parfait", "Disponible 7j/7 pour ses prospects et son equipe", "Membre depuis plusieurs annees pour avoir une vraie credibilite"],
      correct: 1,
      explain: "Beaucoup pensent qu'il faut etre extraverti, ultra charismatique, excellent vendeur et toujours parfait. C'est faux. L'authenticite remplace tous ces preconceptions."
    },
    {
      q: "Module 8 — Que se passe-t-il quand on copie des scripts, des leaders et une attitude artificielle ?",
      options: ["On gagne rapidement en credibilite en s'appuyant sur des methodes eprouvees", "On recrute plus vite grace aux formules qui ont deja fait leurs preuves", "On perd son essence — le fake fatigue et se ressent immediatement par les prospects", "L'audience ne fait pas la difference entre authenticite et imitation"],
      correct: 2,
      explain: "Beaucoup essaient de copier des leaders, des scripts et une attitude artificielle. Resultat : ils perdent leur essence. Le fake fatigue et se ressent immediatement. Les gens ressentent l'alignement."
    },
    {
      q: "Module 8 — 'Attirer par resonance' signifie que :",
      options: ["Il faut publier beaucoup de contenu pour etre visible partout", "Les bonnes personnes te rejoignent parce qu'elles se reconnaissent en toi — ta vision, ton energie, tes valeurs", "Il faut utiliser des techniques de persuasion avancees pour convaincre", "Il faut cibler les prospects qui ont deja une experience en MLM"],
      correct: 1,
      explain: "La resonance : les bonnes personnes te rejoignent parce qu'elles se reconnaissent en toi (ta vision, ton energie, tes valeurs, ta maniere d'accompagner). La resonance vaut mieux que la persuasion."
    },
    {
      q: "Module 8 — 'Etre authentique' ne veut pas dire :",
      options: ["Partager ses vraies valeurs et convictions profondes", "Montrer ses difficultes et ses doutes avec bienveillance", "Tout raconter, tout montrer, tout exposer sans filtre", "S'exprimer avec ses propres mots plutot que des scripts"],
      correct: 2,
      explain: "L'authenticite saine garde aussi des limites. Etre authentique ne veut pas dire tout raconter, tout montrer ou tout exposer. C'est etre vrai dans ce qu'on choisit de partager."
    },
    {
      q: "Module 8 — Pourquoi vouloir plaire a tout le monde est une erreur strategique ?",
      options: ["Parce que c'est epuisant et non durable sur le long terme", "Parce qu'on perd son magnetisme — on n'a pas besoin d'attirer tout le monde, seulement les bonnes personnes", "Parce que les algorithmes penalisent ce type de posture", "Parce que cela demande de faire trop de contenu different"],
      correct: 1,
      explain: "Quand tu essaies de plaire a tout le monde, tu perds ton magnetisme. Tu n'as pas besoin d'attirer tout le monde — tu dois attirer les bonnes personnes. L'alignement cree le magnetisme."
    },
    {
      q: "Module 8 — Un prospect ressent rapidement :",
      options: ["Uniquement ce que tu lui dis explicitement lors de la conversation", "Seulement tes resultats financiers et ton anciennete dans la societe", "L'authenticite, la sincerite, l'alignement et la confiance — l'energie ne ment pas", "Principalement la qualite de tes produits et les benefices qu'ils peuvent lui apporter"],
      correct: 2,
      explain: "Un prospect ressent rapidement l'authenticite, la sincerite, l'alignement et la confiance. L'energie ne ment pas — c'est pour ca qu'il faut etre aligne avec qui tu es vraiment."
    },
    {
      q: "Module 8 — Le leadership authentique peut prendre la forme de :",
      options: ["Uniquement le style charismatique et extraverti", "Exclusivement le style assertif et direct pour imposer sa credibilite", "Doux, calme, empathique, puissant ou inspirant — plusieurs formes existent sans etre agressif", "Seulement le style autoritaire pour que l'equipe prenne le leader au serieux"],
      correct: 2,
      explain: "Il existe plusieurs formes de leadership. Tu peux etre doux(ce), calme, empathique, puissant(e) ou inspirant(e) — sans etre agressif(ve). Ton style naturel est ton meilleur atout."
    },
    {
      q: "Module 9 — Pourquoi beaucoup de personnes stagnent malgre leurs connaissances ?",
      options: ["Parce qu'elles n'ont pas assez de followers pour etre visibles", "Parce que leurs produits ne sont pas assez competitifs sur le marche", "Parce qu'elles manquent de structure — la connaissance sans action ne donne pas de resultats", "Parce qu'elles n'ont pas le bon upline pour les soutenir"],
      correct: 2,
      explain: "Beaucoup savent quoi poster, quoi dire, quoi faire — mais manquent de structure. La connaissance sans action ne donne pas de resultats. Le Module 9 apporte cette structure."
    },
    {
      q: "Module 9 — Quels sont les 4 axes quotidiens du plan d'action 30 jours ?",
      options: ["Former, recruter, vendre, fideliser", "Visibilite, connexion, prospection, suivi", "Stories, posts, lives, messages prives", "Produits, business, temoignages, appels zoom"],
      correct: 1,
      explain: "Les 4 axes quotidiens sont : Visibilite (etre vu chaque jour), Connexion (creer du lien humain), Prospection (creer des opportunites), Suivi (relancer intelligemment)."
    },
    {
      q: "Module 9 — L'axe 'Visibilite' consiste en :",
      options: ["Faire de la publicite payante sur les reseaux sociaux", "1 publication ou reel + 3 a 10 stories + contenu valeur ou inspiration chaque jour", "Publier uniquement du contenu business pour montrer son serieux", "Faire un live par semaine pour interagir avec sa communaute"],
      correct: 1,
      explain: "L'axe Visibilite : 1 publication ou reel, 3 a 10 stories, contenu valeur ou inspiration. L'objectif est d'etre vu regulierement. Invisible = impossible a recruter."
    },
    {
      q: "Module 9 — La 'fortune est dans le suivi' se refere a l'axe :",
      options: ["Visibilite : poster regulierement pour rester dans l'esprit des gens", "Connexion : maintenir des liens reguliers avec sa communaute", "Prospection : qualifier les besoins de ses prospects", "Suivi : relances douces, suivi prospects, suivi clientes, nurturing"],
      correct: 3,
      explain: "L'axe Suivi consiste a relancer intelligemment : relances douces, suivi prospects, suivi clientes, nurturing. Comme le dit le proverbe business : 'La fortune est dans le suivi.'"
    },
    {
      q: "Module 9 — La regle d'or du plan 30 jours est :",
      options: ["Recruter au moins 2 personnes par semaine pour valider sa methode", "Faire ce plan pendant 30 jours sans s'arreter et ne pas juger les resultats au jour 2, 5 ou 10", "Consacrer au minimum 2h par jour a son activite", "Avoir en permanence 10 prospects en discussion simultanement"],
      correct: 1,
      explain: "Reste constant. Fais ce plan pendant 30 jours sans t'arreter. Ne juge pas les resultats trop tot. La constance revele les resultats."
    },
    {
      q: "Module 9 — Le recrutement est decrit comme un systeme qui repose sur :",
      options: ["Le hasard et les bonnes rencontres au bon moment", "Discipline, constance, repetition et ajustements", "Le nombre de followers et l'engagement sur les reseaux sociaux", "La qualite des produits et l'attractivite du plan de compensation"],
      correct: 1,
      explain: "Le recrutement n'est pas magique — il est le resultat de : discipline, constance, repetition et ajustements. Ce que tu fais une fois impressionne. Ce que tu fais chaque jour transforme."
    },
    {
      q: "PIEGE — Quelle affirmation est FAUSSE selon la Parrainage Academy ?",
      options: ["Prospecter c'est creer une ouverture, pas forcer", "Le refus d'un prospect definit ta valeur personnelle et ton leadership", "Les gens rejoignent une personne avant de rejoindre une societe", "La pression en conversation fait fuir les prospects"],
      correct: 1,
      explain: "FAUX : le refus d'un prospect ne definit pas ta valeur personnelle. Le non du prospect ne definit pas ta valeur, ton leadership ni ton potentiel. Le rejet de l'opportunite n'est pas un rejet de ta personne."
    },
    {
      q: "PIEGE — Laquelle de ces phrases est correcte selon tous les modules ?",
      options: ["Pour reussir en MLM, il faut etre extraverti et avoir beaucoup de charisme naturel", "Le bon contenu ne pousse pas, il attire — et le bon leader guide, il ne pousse pas", "Il faut presenter le plan de compensation des le premier message pour aller a l'essentiel", "Plus on envoie de messages, plus on recrute — la loi des grands nombres s'applique"],
      correct: 1,
      explain: "La philosophie commune a tous les modules : le bon contenu attire (Module 4) et le bon leader guide sans pousser (Module 6). Tout repose sur l'attraction et l'authenticite, jamais sur la pression."
    },
    {
      q: "PIEGE — Dans le Module 6, les 4 elements sur lesquels repose une conversation puissante sont :",
      options: ["Argumentation, presentation, negociation, conclusion", "L'ecoute, les questions, l'empathie et le leadership", "L'energie, la confiance, la maitrise et la persuasion", "La credibilite, les resultats, les temoignages et les offres"],
      correct: 1,
      explain: "Une conversation puissante repose sur : l'ecoute, les questions, l'empathie et le leadership. Ces 4 elements sont au coeur du Module 6. Les gens n'aiment pas qu'on les pousse — ils aiment qu'on les comprenne."
    },
    {
      q: "PIEGE FINAL — Quel est le fil conducteur de toute la Parrainage Academy ?",
      options: ["Apprendre les meilleures techniques de vente MLM pour recruter vite", "Maitriser tous les produits pour etre credible aupres des prospects", "Passer du mode vendeur/recruteur au mode leader authentique qui guide sans pousser — attirer plutot que forcer", "Comprendre le plan de compensation pour mieux le presenter aux prospects"],
      correct: 2,
      explain: "Le fil conducteur de toute la Parrainage Academy est de passer du mode vendeur au mode guide authentique : attirer plutot que forcer, comprendre plutot que convaincre, servir plutot qu'insister. Les gens n'aiment pas qu'on les pousse — ils aiment qu'on les comprenne."
    }
  ];

  var currentIndex = 0;
  var score = 0;
  var answered = false;

  var panel = document.createElement("div");
  panel.id = "baa-quiz-panel";
  panel.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:40px;padding-bottom:40px;overflow-y:auto;";
  var box = document.createElement("div");
  box.style.cssText = "background:#f8f3ee;width:90%;max-width:600px;border-radius:20px;padding:30px;font-family:Arial,sans-serif;max-height:90vh;overflow-y:auto;";
  box.innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'><h2 style='color:#8b735d;margin:0;'>Quiz Module 7</h2><span id='close-quiz' style='cursor:pointer;font-size:28px;color:#8b735d;'>X</span></div><div style='color:#999;font-size:13px;margin-bottom:20px;'>Parrainage Academy — Maitrise complete (50 questions)</div><div id='quiz-progress-container' style='margin-bottom:20px;'><div style='display:flex;justify-content:space-between;margin-bottom:6px;'><span id='quiz-progress-text' style='color:#8b735d;font-size:13px;font-weight:bold;'>Question 1 / 50</span><span id='quiz-score-text' style='color:#c9a86a;font-size:13px;font-weight:bold;'>Score : 0</span></div><div style='background:#f0e6d3;border-radius:20px;height:10px;overflow:hidden;'><div id='quiz-progress-barre' style='background:#c9a86a;height:100%;border-radius:20px;width:0%;transition:width 0.4s ease;'></div></div></div><div id='quiz-content'></div>";
  panel.appendChild(box);
  document.body.appendChild(panel);
  document.getElementById("close-quiz").onclick = function() { panel.remove(); if (typeof window.__baaOpenQuizPanel === "function") { window.__baaOpenQuizPanel(); } };

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
    var message = pctFinal === 100 ? "Parfait ! Maitrise totale de la Parrainage Academy !" : pctFinal >= 80 ? "Excellent ! Tu maitrises tres bien les fondamentaux du parrainage." : pctFinal >= 60 ? "Bien joue ! Quelques points a consolider avant de passer a l'action." : "N'hesite pas a relire les modules pour bien ancrer les bases du parrainage.";
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
        quizModule7Score: score,
        quizModule7Total: questions.length,
        quizModule7Date: new Date().toISOString()
      };
      if (pctSave >= 80) { updateData.quizModule7Complete = true; } else { updateData.quizModule7Complete = false; }
      db.collection("users").doc(uid).update(updateData).catch(function(e) { console.log("Erreur sauvegarde quiz:", e); });
    }
  }

  renderQuestion();
  }
}
