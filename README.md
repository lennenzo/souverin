# SOUVERAIN EUROPE — V2

Jeu de stratégie et de diplomatie RP en français. Nouvelle version entièrement refaite autour d'une carte de l'Europe en plein écran, de panneaux contextuels et d'opérations rapides.

**Pour jouer : ouvrir index.html. Pour publier et connecter les salons : lire INSTALLATION.md.**

## Dans cette version

- 28 pays européens, 72 secteurs stratégiques autour de villes réelles.
- Frontières Natural Earth au 1:50 millions, embarquées dans le projet : pas de tuiles externes ni d'abonnement cartographique.
- Panoramique, zoom à la molette et au doigt, recherche de ville/pays, couche politique/terrain.
- Figurés d'infanterie, blindés et avions ; trajets visibles sur la carte.
- Budget, industrie, carburant, ravitaillement, impôts, priorités nationales et soutien populaire.
- Six types d'infrastructures, trois niveaux par bâtiment, trois préparations maximum par secteur.
- Recrutement de 18 à 40 secondes ; constructions de 30 à 50 secondes ; déplacements de 6 à 85 secondes selon distance et type.
- Relations, délégations, commerce, alliances, déclarations de guerre, cessez-le-feu et propositions à signer.
- Messages publics ou bilatéraux et communiqués RP.
- Entraînement immédiat : gouvernements simulés, sauvegarde locale, import/export, pause et ×1 / ×2 / ×4.
- Salons partagés après configuration Supabase : pays réservés par joueur, état serveur, refus des actions non autorisées, messages privés filtrés côté serveur, productions et ordres rattrapés à la connexion.

## Règles principales

Les ressources sont produites en continu. Les revenus affichés correspondent à une minute de jeu. Les dépenses de construction/recrutement sont prélevées à la commande. Annuler rembourse 75 %. Un chantier sur un secteur perdu est abandonné à son échéance.

Les unités en mouvement restent entretenues. Une pénurie de ravitaillement réduit l'attaque de 35 %. Une popularité sous 30 % réduit les recettes de 30 %. Les services publics améliorent le soutien et ont un coût.

Une unité se déplace à travers ses propres secteurs ou ceux des alliés. Le dernier secteur peut être adverse uniquement en guerre. Les liaisons de mer sont des routes stratégiques définies dans le jeu. Les appareils aériens utilisent également ces routes dans cette version ; ils ne contournent pas librement les frontières.

Un combat est résolu à l'arrivée : puissance de l'unité attaquante contre la somme de la défense présente. Fortification : +25 % par niveau ; montagne : +20 %. Une offensive victorieuse capture le secteur et inflige des dégâts au vainqueur. Une offensive perdue détruit l'unité attaquante. Plusieurs ordres sont résolus individuellement, sans fusion automatique en une armée.

Un accord commercial rapporte +90 crédits et +8 industrie/min à chaque pays. Une alliance autorise le transit ; elle ne déclenche pas d'intervention automatique. Une déclaration de guerre rompt les accords et retire 6 points de soutien. Le cessez-le-feu interdit une nouvelle déclaration pendant 90 secondes.

Les pays simulés acceptent le commerce à partir de 45 relations, une alliance à partir de 70 ; une délégation coûte 300 crédits et ajoute 15 points. Réponse automatique après 8 secondes. Un joueur réel choisit librement de signer ou refuser. Les cessez-le-feu sont automatiquement acceptés par les gouvernements non joués.

En entraînement, les simulations adverses vérifient leurs opérations toutes les 15 secondes, recrutent si leurs moyens le permettent et attaquent les secteurs ennemis voisins s'ils estiment pouvoir gagner. Elles ne déclarent pas de guerres spontanées.

Victoire : contrôler 40 secteurs. Si un pays perd tous ses secteurs, il ne peut plus donner d'ordres. Il est toujours possible de lancer un nouvel entraînement.

## Limites explicites

Carte tactique **2D avec relief graphique**, sans caméra 3D libre. Les contours nationaux sont géographiques ; les secteurs et liaisons tracées sont des zones et chemins de jeu, pas les régions administratives ou routes exactes.

Ce scénario fictif ne reproduit pas les effectifs, budgets, dirigeants ou conflits réels. Pas encore d'élections, de ministres joueurs, de recherche technologique, de navires, d'espionnage ou de brouillard de guerre. Les tailles des pays diffèrent ; ce premier scénario n'est pas équilibré pour une compétition classée.

Entraînement : pause à l'ouverture d'un dialogue et lorsque l'onglet est caché. Aucun calcul après fermeture.

En salon : temps commun, synchronisation toutes les 3 secondes, rattrapage à la lecture suivante (24 h maximum). Pas de serveur exécutant des tâches en permanence, de notifications push, ni de compte récupérable après effacement des données du navigateur. Les gouvernements non joués restent neutres et n'effectuent pas d'opérations autonomes dans ce mode.

## Fichiers

- index.html, style.css : présentation.
- assets/world.js : géographie ; assets/emblem.svg : emblème.
- engine.js : simulation d'entraînement, règles et validation des sauvegardes.
- app.js : carte, interface et interactions.
- network.js : session anonyme et appels RPC.
- config.js : URL et clé PUBLIQUE Supabase uniquement.
- supabase.sql : migration et moteur multijoueur autoritaire.
- vercel.json : configuration statique.
- INSTALLATION.md : guide de publication et de configuration.

Aucun code ni visuel de Call of War utilisé. Fond cartographique Natural Earth, domaine public. Code et interface créés pour ce projet.
