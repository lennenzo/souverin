# SOUVERAIN — V1

Jeu de stratégie et de diplomatie RP en français. 8 pays fictifs, 48 provinces, carte en relief calculée en 3D, économie, constructions, recrutements, mouvements, combats, accords, IA et journal RP.

## Jouer immédiatement

Ouvrir `index.html` dans Chrome, Edge ou Firefox. Tous les fichiers doivent rester dans le même dossier. Aucune installation, aucun compte ni clé API. Si le navigateur bloque la sauvegarde locale d'un fichier ouvert directement, utiliser Exporter la partie, ou jouer sur le site publié.

## Publier sur Vercel avec GitHub

1. Extraire le ZIP.
2. Créer un dépôt GitHub, privé si souhaité.
3. Ajouter les fichiers CONTENUS dans le dossier `souverain` à la racine du dépôt : index.html, style.css, engine.js, app.js, icon.svg, vercel.json et README.md. Ne pas ajouter le ZIP lui-même.
4. Dans Vercel, choisir Add New → Project et importer le dépôt.
5. Framework Preset : Other. Root Directory : racine du dépôt. Build Command : vide, Override activé si nécessaire. Output Directory : `.` (point). Install Command : vide.
6. Deploy. Le jeu est disponible à l'adresse de votre projet. Les prochains commits mettent à jour le site.

Le projet est entièrement statique et ne dépend d'aucun CDN.

## Commandes

- Sélection : clic / toucher une province. Liste accessible sous la carte.
- Déplacement de carte : glisser. Zoom : molette, boutons + / −.
- 3D / 2D : bouton dans la carte. Recentrer : ⌖.
- Clavier sur la carte : flèches pour sélectionner une province, Entrée pour son panneau.
- Temps : ▶, ×1 / ×2 / ×4, ou Jour suivant.
- Économie : impôts, politique, bâtiments et marché.
- Forces armées : recrutement et déplacement vers une province voisine. Toutes les unités de la province partent ensemble.
- Diplomatie : délégations, aides, commerce, alliances, guerre et cessez-le-feu.
- Journal : communiqués RP et événements du monde.
- Paramètres : import / export de sauvegarde JSON.

## Règles

Une journée dure 60 secondes à vitesse ×1, 30 à ×2, 15 à ×4. La partie commence en pause. La simulation se suspend si un dialogue est ouvert ou si l'onglet est masqué. Elle ne continue pas quand le navigateur est fermé.

6 provinces par nation. Objectif : posséder 30 provinces. Perdre le dernier territoire termine la partie.

Les bâtiments produisent chaque jour ; 4 emplacements par province, un exemplaire de chaque bâtiment maximum. Annuler un chantier ou recrutement rembourse 75 % du coût. Les coûts sont retirés à la commande, les revenus à la journée suivante. Un chantier sur une province occupée par un adversaire est perdu à son échéance.

Les unités consomment des crédits et de la nourriture ; les blindés consomment aussi du carburant. Les troupes en transit restent entretenues. Une pénurie de nourriture réduit la puissance d'attaque et la popularité. Une popularité sous 30 % réduit les recettes de 30 %.

Déplacement : 2 jours, 3 vers une montagne. Coût : 8 carburant + 4 par unité de blindés. Attaque possible uniquement en guerre. Fortification : +30 % défense, montagne : +20 %. Une attaque victorieuse conserve une partie de ses effectifs ; une attaque perdue détruit la force engagée. Si la paix est conclue pendant le trajet, l'armée rentre dans une province amie.

IA : tous les 4 jours, chaque pays recrute de l'infanterie dans une province ; tous les 12 jours, il ajoute un blindé. En guerre, il tente une contre-attaque frontalière si sa garnison est suffisamment forte. L'IA ne déclare pas spontanément de guerre dans cette V1.

Commerce : accepté en paix à 45 relations. Alliance : acceptée à 75 relations. Réponse après 2 jours. Alliance = statut diplomatique, sans intervention automatique. Cessez-le-feu : 65 % de chance d'acceptation et 5 jours de trêve. Les délégations coûtent 100 crédits (+15 relations), les aides 200 crédits et 20 nourriture (+25 relations).

## Sauvegardes et limites

V1 SOLO. Sept dirigeants simulés, pas de véritables joueurs connectés. Chaque navigateur a sa partie indépendante. Les communiqués ne sont pas visibles par d'autres visiteurs. Importer une sauvegarde remplace la partie locale.

La carte est un rendu 3D stylisé par projection orthographique sur canvas (terrains extrudés, volumes des capitales et bâtiments), pas un moteur 3D avec caméra libre.

Pas encore de comptes, serveurs persistants, élections, espionnage, brouillard de guerre, navires ou aéronefs. Pour du multijoueur réel, il faut une base de données, une authentification et une simulation serveur qui valide les actions et synchronise les joueurs. Une sauvegarde locale ne doit jamais servir d'autorité à un futur mode compétitif.

Aucun contenu ni visuel de Call of War utilisé. Univers et code originaux.
