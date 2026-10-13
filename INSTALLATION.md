# Souverain Europe — installation

## 1. Essayer maintenant

Extraire le ZIP. Ouvrir `index.html` avec Chrome, Edge ou Firefox. Choisir une nation, saisir un pseudo et cliquer **Prendre mes fonctions**.

Tout le mode entraînement fonctionne sans compte, serveur ou installation. Les autres pays sont simulés. Les salons deviennent disponibles après l'étape 3.

## 2. Publier sur Vercel

1. Créer un dépôt GitHub, privé si souhaité.
2. Ajouter les fichiers et le dossier `assets` qui sont **à l'intérieur de `souverain-europe`**, à la racine du dépôt. Ne pas envoyer le ZIP lui-même.
3. Dans Vercel : **Add New → Project**, importer ce dépôt.
4. Choisir **Framework Preset : Other**, **Root Directory : racine du dépôt**.
5. **Build Command : vide**, **Install Command : vide**. Si nécessaire, activer leurs interrupteurs Override pour conserver des champs vides. **Output Directory : `.`** (un point).
6. Cliquer **Deploy**. Le jeu est accessible via l'adresse de votre projet.

Il n'y a ni dépendances à installer, ni fichier volumineux d'installation Windows. Le projet reste inférieur à 1 Mo hors compression. Les commits suivants mettent le site à jour.

## 3. Activer les salons entre amis

Il faut créer un projet Supabase pour stocker et synchroniser les parties. Le site Vercel, seul, ne synchronise pas les joueurs.

1. Créer un projet sur https://supabase.com/dashboard — utiliser de préférence un projet dédié à ce jeu.
2. Ouvrir **SQL Editor**, créer une requête et coller **tout le contenu de `supabase.sql`**. Cliquer **Run**. Attendre la confirmation de succès.
3. Dans **Authentication → Sign In / Providers**, activer les connexions anonymes (**Anonymous Sign-Ins**). Le nom exact de la section peut varier selon le tableau de bord.
4. Copier l'URL du projet et sa **clé publique publishable** (ou la clé publique legacy `anon`) depuis les paramètres API.
5. Modifier `config.js` :

```js
window.SOUVERAIN_CONFIG = {
  supabaseUrl: 'https://VOTRE-PROJET.supabase.co',
  publishableKey: 'VOTRE-CLE-PUBLIQUE'
};
```

**Ne jamais mettre la clé `service_role` ou une clé `sb_secret_...` dans ce fichier.** La clé publique identifie le projet ; chaque joueur est identifié par sa propre session anonyme, et ses actions sont vérifiées par les fonctions serveur.

6. Enregistrer et pousser la modification de `config.js` sur GitHub. Attendre le déploiement Vercel.
7. Ouvrir le jeu : **Créer un salon**, choisir sa nation et son nom, puis créer la partie.
8. Copier le code. Les amis ouvrent la **même adresse Vercel**, choisissent **Rejoindre**, saisissent le code et prennent un pays libre.

Pas de deuxième serveur Node à héberger. Le fichier SQL inclut les tables, droits, transactions et règles de jeu. Le navigateur envoie uniquement des ordres ; il n'envoie jamais un état de partie à sauvegarder sur le serveur.

### Reprendre un salon

Le bouton **Salon XXXXXXXX** apparaît à l'accueil sur le navigateur qui a créé ou rejoint la partie. La session anonyme est conservée sur cet appareil. Utiliser le même navigateur pour retrouver son pays. Effacer les données du navigateur fait perdre cette identité ; cette version n'a pas de récupération de compte par email.

Le code réserve l'accès au salon ; gardez-le entre amis. Un pays occupé par un joueur ne peut pas être repris par un autre. Maximum : 3 salons créés par identité, 28 nations par salon.

### Fonctionnement du temps en ligne

Les clients interrogent le serveur toutes les 3 secondes. Les ordres, productions et combats sont validés en transaction, avec verrouillage du salon pour éviter les doubles dépenses.

Quand tout le monde ferme le jeu, le serveur conserve l'état. À la prochaine lecture, il calcule le temps écoulé, termine les ordres et applique la production, avec un rattrapage limité à 24 heures par absence. Il ne s'agit pas d'un processus tournant en continu : un combat arrivé pendant une absence sera calculé à la lecture suivante. Il n'y a pas de notifications hors navigateur.

Les pays non joués répondent automatiquement aux accords mais ne recrutent pas et ne contre-attaquent pas dans un salon. En entraînement, les pays simulés recrutent et peuvent contre-attaquer.

### Si la connexion ne fonctionne pas

- « Connexion multijoueur non configurée » : vérifier les deux valeurs de `config.js` et le déploiement Vercel.
- « Activez les connexions anonymes » ou « Anonymous sign-ins are disabled » : activer le fournisseur anonyme.
- Fonction `sovereign_create` / `sovereign_sync` introuvable : exécuter l'intégralité du SQL dans le bon projet.
- « Pays déjà joué » : choisir un autre pays, ou reprendre le salon sur le navigateur d'origine.
- « Session non renouvelée » : vérifier la connexion et les paramètres du même projet Supabase. Éviter d'effacer la session si vous voulez conserver votre pays.
- Ne pas réinitialiser le SQL ni changer de projet pour traiter une simple coupure réseau.

## 4. Ce qui a été vérifié

- Syntaxe des trois fichiers JavaScript.
- Moteur local : 28 nations, 72 secteurs connectés, production, coûts, délais exacts, routes, captures, accords humains et simulés, sauvegarde et victoire.
- Une simulation locale d'une heure.
- Les secteurs recouvrent exactement les 28 silhouettes nationales et ne se chevauchent pas.
- Interface dans un environnement DOM de test : démarrage, cinq menus, construction, unités, guerre, journal, recherche, paramètres et guide. Textes RP échappés.
- Rendu de la carte calculé et inspecté sous forme d'image.
- SQL exécuté dans un moteur PostgreSQL embarqué : création et entrée dans un salon, budgets, chantiers, déplacements, messages privés, traités, permissions et actions invalides.

Le projet n'a pas été déployé dans votre compte Vercel ou Supabase. La connexion de bout en bout à un projet Supabase réel et la mise en page complète dans un vrai navigateur restent à vérifier après configuration. Les essais DOM et SQL ne remplacent pas ces vérifications.

## Sources techniques

- Natural Earth : https://www.naturalearthdata.com/downloads/50m-cultural-vectors/ — frontières en domaine public.
- Supabase, connexions anonymes : https://supabase.com/docs/guides/auth/auth-anonymous
- Fonctions SQL / RPC : https://supabase.com/docs/guides/database/functions
- Clés publiques : https://supabase.com/docs/guides/getting-started/api-keys
