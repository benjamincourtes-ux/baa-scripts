// BAA Vitrine Commandes Fix — Intercepte les commandes et corrige le statut
(function() {
  function init() {
    if (typeof firebase === "undefined" || !firebase.apps || !firebase.apps.length) {
      setTimeout(init, 300); return;
    }

    var db = firebase.firestore();

    // Intercepter firebase.firestore().collection
    var origFirestore = firebase.firestore.bind(firebase);
    firebase.firestore = function() {
      var fs = origFirestore();
      var origCollection = fs.collection.bind(fs);
      fs.collection = function(name) {
        var ref = origCollection(name);
        if (name === "commandes_clients") {
          var origAdd = ref.add.bind(ref);
          ref.add = function(data) {
            // Forcer statut en_attente
            if (!data.statut) {
              data.statut = "en_attente";
              console.log("BAA Fix: statut en_attente ajouté");
            }
            return origAdd(data);
          };
        }
        if (name === "boutiques") {
          // Intercepter les stats pour ne pas compter les commandes non confirmées
          var origDoc = ref.doc.bind(ref);
          ref.doc = function(docId) {
            var docRef = origDoc(docId);
            var origCollection2 = docRef.collection.bind(docRef);
            docRef.collection = function(subName) {
              var subRef = origCollection2(subName);
              if (subName === "stats") {
                var origDoc2 = subRef.doc.bind(subRef);
                subRef.doc = function(docId2) {
                  var statRef = origDoc2(docId2);
                  if (docId2 === "global") {
                    var origSet = statRef.set.bind(statRef);
                    statRef.set = function(data, options) {
                      // Bloquer l'incrément des commandes et CA
                      if (data.commandes || data.chiffreAffaires) {
                        console.log("BAA Fix: stats commandes bloquées jusqu'à confirmation");
                        return Promise.resolve();
                      }
                      return origSet(data, options);
                    };
                  }
                  return statRef;
                };
              }
              return subRef;
            };
            return docRef;
          };
        }
        return ref;
      };
      return fs;
    };

    console.log("BAA Vitrine Commandes Fix actif");
  }

  var tries = 0;
  function tryInit() {
    tries++;
    if (tries > 20) return;
    if (typeof firebase !== "undefined" && firebase.apps && firebase.apps.length) {
      init();
    } else {
      setTimeout(tryInit, 500);
    }
  }
  tryInit();
})();
