# 🎮 SummonerFinder.gg - Backend API

REST API backend for **SummonerFinder.gg**, a League of Legends stats aggregator application. Built with Express.js and MongoDB, this API serves as a gateway between the Riot Games API and the frontend, with intelligent data caching.

## 🌟 Features

- **Player Search** - Retrieve account information via username/tagline
- **Ranked Statistics** - Solo/Duo and Flex rankings with details
- **Match History** - Fetch and store recent matches
- **Champion Mastery** - Mastery levels and points per champion
- **Champion Statistics** - KDA, winrate and performance by champion and game mode
- **Intelligent Rate Limiting** - Automatic management of Riot API limits (20 req/sec, 100 req/2min)
- **MongoDB Cache** - Reduced API calls and improved performance

## 📋 Prerequisites

- **Node.js** 22+
- **MongoDB** (local or Atlas)
- **Riot Games API Key** ([get a key](https://developer.riotgames.com/))
- **Yarn** (recommended) or npm

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/MatteoPiselli/leagueoflegends-api-backend.git
cd leagueoflegends-api-backend

# Install dependencies
yarn install
```

## ⚙️ Configuration

Create a `.env` file at the root with the following variables:

```env
# Riot Games API
RIOT_API_KEY=your_riot_api_key_here

# MongoDB Atlas
CONNECTION_STRING=mongodb+srv://<user>:<password>@<cluster>/<your_collection_name>

# Server Configuration
ORIGIN=http://localhost:3001
```

### Environment Variables

| Variable            | Description                       | Default                 |
| ------------------- | --------------------------------- | ----------------------- |
| `RIOT_API_KEY`      | Riot Games API Key (required)     | -                       |
| `CONNECTION_STRING` | MongoDB connection URI (required) | -                       |
| `ORIGIN`            | Frontend URL for CORS             | `http://localhost:3001` |

## 🎯 Getting Started

### Development mode (with auto-reload)

```bash
yarn nodemon
```

### Production mode

```bash
yarn start
```

The server starts on `http://localhost:3000` by default.

## 🧪 Tests

```bash
# Run all tests
yarn test

# Watch mode (development)
yarn test --watch
# Test a specific file
yarn test summonerApi

# Tests with coverage
yarn test --coverage
```

See [tests/README.md](./tests/README.md) for more details on test architecture.

## 📁 Project Structure

```
leagueoflegends-api-backend/
├── api/                    # Riot Games API call functions
│   ├── summonerApi.js     # Player info retrieval
│   ├── rankedApi.js       # Ranking data
│   ├── matchApi.js        # Match history
│   ├── masteriesApi.js    # Champion mastery
│   └── championApi.js     # Champion statistics
├── controllers/            # Express controllers (HTTP logic)
├── services/               # Business logic (3 sub-layers)
│   └── <feature>/
│       ├── <feature>Service.js      # API + DB orchestration
│       ├── <feature>ApiService.js   # Riot API wrapper
│       └── <feature>DbService.js    # MongoDB operations
├── database/
│   ├── connection.js      # MongoDB configuration
│   └── models/            # Mongoose schemas
├── routes/                # Express route definitions
├── tests/                 # Unit and integration tests
├── utils/                 # Utilities (rate limiting, delay)
└── app.js                 # Express configuration
```

## 🔗 API Endpoints

### Players

```
GET /api/summoner/:username/:tagline
    ?updateClicked=true  # Force update from Riot API
```

### Ranked Statistics

```
GET /api/ranked/:puuid
    ?updateClicked=true
```

### Match History

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

### Champion Statistics

```
GET /api/champions/:puuid/stats
    ?updateClicked=true
    &queueType=400  # 400=Normal, 420=Ranked Solo, 440=Ranked Flex
```

## 🏗️ Architecture

### 3-Layer Pattern

```
Routes → Controllers → Services → Database/API Riot
```

### Services (Critical Pattern)

Each feature has **3 service files**:

1. **`<feature>Service.js`** - Orchestration (coordinates API + DB)
2. **`<feature>ApiService.js`** - Riot API calls
3. **`<feature>DbService.js`** - MongoDB operations

**Flow example**:

```javascript
// 1. Check MongoDB first
const cached = await dbService.find(puuid);
if (cached) return cached;

// 2. Otherwise, call Riot API
const data = await apiService.fetch(puuid);

// 3. Save to cache
await dbService.save(data);

// 4. Return result
return data;
```

### Rate Limiting Management

The Riot API enforces strict limits:

- **20 requests/second**
- **100 requests/2 minutes**

Use `utils/riotRateLimit.js` for batch operations:

```javascript
const { riotRateLimit } = require("./utils/riotRateLimit");

// Automatically handles 20 req/sec with pause after 100 req
const results = await riotRateLimit(matchIds);
```

## 🌐 Deployment

### Vercel

The project is configured for Vercel via `vercel.json`:

**Environment Variables**: Configure `RIOT_API_KEY`, `CONNECTION_STRING` and `ORIGIN` in the Vercel dashboard.

## 🛠️ Technologies

- **Express.js** 4.16 - Web framework
- **Mongoose** 8.18 - MongoDB ODM
- **dotenv** - Environment variable management
- **cors** - Cross-origin support
- **Jest** 30.2 - Testing framework
- **Supertest** - HTTP testing
- **Nodemon** - Auto-reload in development

## 📚 Additional Documentation

- [Tests Documentation](./tests/README.md) - Test architecture and patterns
- [Copilot Instructions](./.github/copilot-instructions.md) - Guide for AI agents

## 🤝 Frontend Integration

This backend is designed to work with the **SummonerFinder.gg** frontend:

- Frontend listens on port `3001` by default
- Backend listens on port `3000` by default
- CORS automatically configured via `ORIGIN`

## 📄 License

Proprietary - Matteo Piselli.

## 👨‍💻 Author

**Matteo Piselli** - [MatteoPiselli](https://github.com/MatteoPiselli)

Project developed as part of my full-stack developer portfolio.

- Portfolio : [matteopiselli.dev](https://matteopiselli.dev)
- LinkedIn : [Matteo Piselli 💻📱](https://www.linkedin.com/in/matteo-piselli/)
