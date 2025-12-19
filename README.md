# 🎮 SummonerFinder.gg - Backend API

API REST backend pour **SummonerFinder.gg**, une application d'agrégation de statistiques League of Legends. Construit avec Express.js et MongoDB, cette API sert de passerelle entre l'API Riot Games et le frontend, avec mise en cache intelligente des données.

## 🌟 Fonctionnalités

- **Recherche de joueurs** - Récupération des informations de compte via username/tagline
- **Statistiques ranked** - Classements Solo/Duo et Flex avec détails
- **Historique de matchs** - Récupération et stockage des parties récentes
- **Champion mastery** - Niveaux de maîtrise et points par champion
- **Statistiques de champions** - KDA, winrate et performances par champion et mode de jeu
- **Rate limiting intelligent** - Gestion automatique des limites de l'API Riot (20 req/sec, 100 req/2min)
- **Cache MongoDB** - Réduction des appels API et amélioration des performances

## 📋 Prérequis

- **Node.js** 22+
- **MongoDB** (local ou Atlas)
- **Clé API Riot Games** ([obtenir une clé](https://developer.riotgames.com/))
- **Yarn** (recommandé) ou npm

## 🚀 Installation

```bash
# Cloner le repository
git clone <repository-url>
cd leagueoflegends-api-backend

# Installer les dépendances
yarn install
```

## ⚙️ Configuration

Créez un fichier `.env` à la racine avec les variables suivantes :

```env
# Riot Games API
RIOT_API_KEY=your_riot_api_key_here

# MongoDB Atlas
CONNECTION_STRING=mongodb+srv://<user>:<password>@<cluster>/<your_collection_name>

# Server Configuration
ORIGIN=http://localhost:3001
```

### Variables d'environnement

| Variable            | Description                        | Défaut                  |
| ------------------- | ---------------------------------- | ----------------------- |
| `RIOT_API_KEY`      | Clé API Riot Games (requise)       | -                       |
| `CONNECTION_STRING` | URI de connexion MongoDB (requise) | -                       |
| `ORIGIN`            | URL du frontend pour CORS          | `http://localhost:3001` |

## 🎯 Démarrage

### Mode développement (avec auto-reload)

```bash
yarn nodemon
```

### Mode production

```bash
yarn start
```

Le serveur démarre sur `http://localhost:3000` par défaut.

## 🧪 Tests

```bash
# Exécuter tous les tests
yarn test

# Mode watch (développement)
yarn test --watch

# Tester un fichier spécifique
yarn test summonerApi

# Tests avec couverture
yarn test --coverage
```

Voir [tests/README.md](./tests/README.md) pour plus de détails sur l'architecture des tests.

## 📁 Structure du projet

```
leagueoflegends-api-backend/
├── api/                    # Fonctions d'appel à l'API Riot Games
│   ├── summonerApi.js     # Récupération des infos joueur
│   ├── rankedApi.js       # Données de classement
│   ├── matchApi.js        # Historique de matchs
│   ├── masteriesApi.js    # Champion mastery
│   └── championApi.js     # Statistiques de champions
├── controllers/            # Contrôleurs Express (logique HTTP)
├── services/               # Logique métier (3 sous-couches)
│   └── <feature>/
│       ├── <feature>Service.js      # Orchestration API + DB
│       ├── <feature>ApiService.js   # Wrapper API Riot
│       └── <feature>DbService.js    # Opérations MongoDB
├── database/
│   ├── connection.js      # Configuration MongoDB
│   └── models/            # Schémas Mongoose
├── routes/                # Définition des routes Express
├── tests/                 # Tests unitaires et d'intégration
├── utils/                 # Utilitaires (rate limiting, delay)
└── app.js                 # Configuration Express
```

## 🔗 Endpoints API

### Joueurs

```
GET /api/summoner/:username/:tagline
    ?updateClicked=true  # Force la mise à jour depuis Riot API
```

### Statistiques Ranked

```
GET /api/ranked/:puuid
    ?updateClicked=true
```

### Historique de matchs

```
GET /api/matchs/:puuid
    ?updateClicked=true

GET /api/matchs/details/:matchId
```

### Champion Mastery

```
GET /api/masteries/:puuid
    ?updateClicked=true
```

### Statistiques de champions

```
GET /api/champions/:puuid/stats
    ?updateClicked=true
    &queueType=400  # 400=Normal, 420=Ranked Solo, 440=Ranked Flex
```

## 🏗️ Architecture

### Pattern 3-couches

```
Routes → Controllers → Services → Database/API Riot
```

### Services (Pattern critique)

Chaque feature a **3 fichiers de service** :

1. **`<feature>Service.js`** - Orchestration (coordonne API + DB)
2. **`<feature>ApiService.js`** - Appels à l'API Riot
3. **`<feature>DbService.js`** - Opérations MongoDB

**Exemple de flux** :

```javascript
// 1. Vérifier MongoDB d'abord
const cached = await dbService.find(puuid);
if (cached) return cached;

// 2. Sinon, appeler l'API Riot
const data = await apiService.fetch(puuid);

// 3. Sauvegarder en cache
await dbService.save(data);

// 4. Retourner le résultat
return data;
```

### Gestion du Rate Limiting

L'API Riot impose des limites strictes :

- **20 requêtes/seconde**
- **100 requêtes/2 minutes**

Utilisez `utils/riotRateLimit.js` pour les opérations par lot :

```javascript
const { riotRateLimit } = require("./utils/riotRateLimit");

// Traite automatiquement 20 req/sec avec pause après 100 req
const results = await riotRateLimit(matchIds);
```

## 🌐 Déploiement

### Vercel

Le projet est configuré pour Vercel via `vercel.json` :

**Variables d'environnement** : Configurez `RIOT_API_KEY`, `CONNECTION_STRING` et `ORIGIN` dans le dashboard Vercel.

## 🛠️ Technologies

- **Express.js** 4.16 - Framework web
- **Mongoose** 8.18 - ODM MongoDB
- **dotenv** - Gestion des variables d'environnement
- **cors** - Cross-origin support
- **Jest** 30.2 - Framework de tests
- **Supertest** - Tests HTTP
- **Nodemon** - Auto-reload en développement

## 📚 Documentation complémentaire

- [Tests Documentation](./tests/README.md) - Architecture et patterns des tests
- [Copilot Instructions](./.github/copilot-instructions.md) - Guide pour agents IA

## 🤝 Intégration Frontend

Ce backend est conçu pour fonctionner avec le frontend **SummonerFinder.gg** :

- Frontend écoute sur port `3001` par défaut
- Backend écoute sur port `3000` par défaut
- CORS configuré automatiquement via `ORIGIN`

## 📄 License

Propriétaire - Matteo Piselli.

## 👨‍💻 Auteur

**Matteo Piselli** - [MatteoPiselli](https://github.com/MatteoPiselli)

Projet développé dans le cadre de mon portfolio de développeur full stack.

- Portfolio : [matteopiselli.dev](https://matteopiselli.dev)
- LinkedIn : [Matteo Piselli 💻📱](https://www.linkedin.com/in/matteo-piselli/)
