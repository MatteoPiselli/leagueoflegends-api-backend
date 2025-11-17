# SummonerFinder.gg Backend - AI Coding Agent Instructions

## Architecture Overview

This is a **League of Legends stats aggregator API** built with Express.js and MongoDB. The architecture follows a **3-layer pattern**:

```
Routes → Controllers → Services (3 sub-layers) → Database/API
```

### Service Layer Structure (Critical Pattern)

**Every feature** (summoner, masteries, matchs, ranked, champions) has **3 service files**:

```
services/<feature>/
  ├── <feature>Service.js      # Orchestration layer - coordinates API + DB
  ├── <feature>ApiService.js   # Riot API calls wrapper
  └── <feature>DbService.js    # MongoDB operations wrapper
```

**Example flow** (`services/summoner/summonerService.js`):

1. Check DB first (`summonerDbService.findSummonerByNameAndTag`)
2. If not found, call Riot API (`summonerApiService.fetchRiotId`)
3. Save/update in DB (`summonerDbService.saveOrUpdateSummoner`)
4. Return combined result

### API Layer Pattern

Files in `api/` directory contain **raw Riot API functions**:

- Use `process.env.RIOT_API_KEY` for authentication
- Throw errors with `.statusCode` property for HTTP failures
- Return raw JSON from Riot endpoints

**Error handling pattern** (from `api/summonerApi.js`):

```javascript
if (!response.ok) {
  const errorText = await response.text();
  const error = new Error(`Riot ID error: ${response.status} - ${errorText}`);
  error.statusCode = response.status; // CRITICAL: Propagate status code
  throw error;
}
```

## Environment Configuration

**Required variables** (`.env` file):

- `RIOT_API_KEY` - Riot Games API key
- `CONNECTION_STRING` - MongoDB connection URI

**Note**: Database connection in `database/connection.js` auto-closes on SIGINT.

## Rate Limiting Strategy

Riot API has strict rate limits (20 requests/second, 100 requests/2 minutes). Use `utils/riotRateLimit.js` for batch operations:

```javascript
const { riotRateLimit } = require("../utils/riotRateLimit");
// Automatically batches requests at 20/sec with 2-min delay after 100 requests
const results = await riotRateLimit(matchIds);
```

## Testing Architecture

**Run tests**: `yarn test`

### Test Structure (from `tests/README.md`)

```
tests/
├── setup.js                  # Mocks process.env, console.log
├── unit/
│   ├── api/                  # Test raw API functions (mock fetch)
│   ├── controllers/          # Test controllers (mock services)
│   └── database/
│       ├── connection.test.js
│       └── models/           # Test Mongoose schemas & indexes
└── integration/              # End-to-end tests (WIP)
```

### Test Types & Patterns

#### 1. API Tests (`unit/api/`)

Test raw Riot API functions with **3 mandatory scenarios**:

```javascript
// 1. Success case
fetch.mockResolvedValueOnce({
  ok: true,
  json: jest.fn().mockResolvedValueOnce(data),
});

// 2. HTTP error (with statusCode)
fetch.mockResolvedValueOnce({
  ok: false,
  status: 404,
  text: jest.fn().mockResolvedValueOnce("Not Found"),
});
expect(error.statusCode).toBe(404);

// 3. Network error
fetch.mockRejectedValueOnce(new Error("Network error"));
```

#### 2. Controller Tests (`unit/controllers/`)

Test Express controllers by mocking services:

```javascript
const mockRes = () => ({
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
});
jest.spyOn(summonerService, "searchSummoner").mockResolvedValueOnce(mockResult);
```

#### 3. Model Tests (`unit/database/models/`)

Test Mongoose schema structure, indexes, and validation:

```javascript
it("should have the correct schema structure", () => {
  expect(Summoner.schema.paths.puuid).toBeDefined();
});
it("should have an index on puuid", () => {
  const indexes = Summoner.schema.indexes();
  expect(indexes.some(([fields]) => fields.puuid === 1)).toBe(true);
});
```

**Always reset mocks**: Use `beforeEach(() => fetch.mockClear())` or `jest.clearAllMocks()`

## MongoDB Patterns

### Models use `findOneAndUpdate` with upsert

Example from `services/summoner/summonerDbService.js`:

```javascript
Summoner.findOneAndUpdate(
  { puuid },                           // Find criteria
  { $set: { ... }, $setOnInsert: { puuid } },  // Update/insert
  { new: true, upsert: true }          // Return new doc, create if missing
);
```

### Indexed fields

All models have indexes on primary lookup fields (e.g., `puuid` in `database/models/summoner.js`).

## Development Workflow

### Starting the server

```bash
yarn start       # Production mode
# OR use nodemon for dev (add to package.json if needed)
```

### Running tests

```bash
yarn test        # Run all tests
yarn test --watch           # Watch mode
yarn test summonerApi       # Run specific test file
```

## Common Patterns

### Controller error handling

Always propagate `statusCode` from service errors:

```javascript
catch (error) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message });
}
```

### Route definitions

Simple pattern: `router.get("/:param", controller.method)`

### CORS

Enabled globally in `app.js` with `app.use(cors())`

## File Naming Conventions

- Routes: plural (e.g., `routes/summoner.js` → `/api/summoner`)
- Controllers: `<feature>Controller.js`
- Services: `<feature>Service.js`, `<feature>ApiService.js`, `<feature>DbService.js`
- Models: singular lowercase (e.g., `models/summoner.js`)
- Tests: `<filename>.test.js`

## Key Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **cors** - Cross-origin support
- **jest** + **supertest** - Testing
