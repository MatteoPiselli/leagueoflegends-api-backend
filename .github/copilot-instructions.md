# AI Coding Agent Instructions: SummonerFinder.gg

## Project Architecture

This is a **full-stack League of Legends player statistics application** with separate Node.js/Express backend and Next.js frontend.

### Backend (`leagueoflegends-api-backend/`)

- **Express.js REST API** with MongoDB (Mongoose)
- **Riot Games API integration** with rate limiting and error handling
- **PUUID-based data flow**: All player data keyed by Riot's unique PUUID identifier
- **Smart caching**: Database stores API responses to reduce Riot API calls

### Frontend (`leagueoflegends-api-frontend/`)

- **Next.js 12** with React 18 and Tailwind CSS
- **Hook-driven architecture**: Domain-specific hooks in `hooks/` organize all business logic
- **Component modularity**: Each major feature (Core, Ranked, Matchs, Champions, Masteries) has its own directory with internal organization
- **Context-based state**: `ChampionContext` provides global champion data access

## Critical Integration Patterns

### Data Flow Architecture

```
User Search (username#tagline) → Backend gets PUUID → Parallel API calls → MongoDB cache → Frontend hooks
```

### PUUID-Centric Design

- **All data operations require PUUID**: Player searches first get PUUID from Riot ID, then use it for all subsequent API calls
- **Database relationships**: Mongoose models use PUUID as the primary foreign key (see `summonerController.js`)
- **Frontend hooks**: All data hooks expect PUUID as first parameter (`useRankedData`, `useMatchData`, etc.)

### Parallel Data Fetching

```javascript
// In usePlayerData.js - THIS IS THE ORCHESTRATION PATTERN
await Promise.all([
  fetchRankedData(puuid, forceUpdate),
  fetchMatchData(puuid, forceUpdate),
  fetchMasteriesData(puuid, forceUpdate),
  fetchChampionStatsData(puuid, forceUpdate, "400"),
]);
```

## Backend Development Conventions

### Controller Pattern

```javascript
// Standard controller structure - see rankedController.js
exports.getFunctionName = async (req, res) => {
  try {
    // 1. Extract params/query
    // 2. Check database first (unless forceUpdate)
    // 3. Call Riot API if needed
    // 4. Update/create database record
    // 5. Return transformed data
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};
```

### API Integration Pattern

- **Utility functions** in `api/` folder handle Riot API calls
- **Error propagation**: API utilities throw errors with `statusCode` property
- **Region handling**: Europe endpoints for PUUID, EUW1 for game data

### Database Patterns

- **findOneAndUpdate with upsert**: Standard pattern for create-or-update operations
- **Mongoose indexes**: All models index on PUUID for performance
- **Date tracking**: `updatedAt` fields track cache freshness

## Frontend Development Conventions

### Hook Architecture

- **Domain separation**: `hooks/data/`, `hooks/ui/`, `hooks/external/`
- **Orchestrator pattern**: `usePlayerData` coordinates all data fetching
- **Retry mechanisms**: Individual hooks have retry functions for error recovery

### Component Organization

```
ComponentName/
├── ComponentName.jsx     # Main component
├── index.js             # Exports
├── README.md            # Documentation
├── components/          # Sub-components
├── hooks/               # Component-specific hooks
└── States/              # Loading/Error/Empty states
```

### Data Transformation Pattern

```javascript
// Transform API responses in hooks, not components
const transformRankedData = (ranked) => {
  // Convert backend format to frontend format
  return rankedArray;
};
```

## Project-Specific Conventions

### Naming Patterns

- **Routes**: `/api/{resource}/{identifier}` (e.g., `/api/summoner/:username/:tagline`)
- **Hooks**: `use{ResourceName}Data` for data hooks, `use{Feature}` for UI hooks
- **Controllers**: `{resource}Controller.js` with exported functions

### Error Handling Strategy

- **Backend**: HTTP status codes with descriptive error messages
- **Frontend**: `utils/errorHandling.js` maps status codes to user-friendly messages
- **Retry logic**: Built into data hooks with exponential backoff

### Environment Configuration

- **Backend**: Requires `RIOT_API_KEY` and `CONNECTION_STRING` in `.env`
- **Frontend**: Hardcoded localhost:3000 API base URL (dev setup)

## Development Workflow

### Backend Development

```bash
cd leagueoflegends-api-backend
yarn start  # Runs on localhost:3000
```

### Frontend Development

```bash
cd leagueoflegends-api-frontend
yarn dev  # Runs on localhost:3001
```

### Adding New Features

1. **Backend**: Create controller → API utility → route → model (if needed)
2. **Frontend**: Create data hook → integrate into `usePlayerData` → add UI component
3. **Follow the PUUID flow**: All player-related features must work with PUUID

## Key Files to Reference

- `hooks/usePlayerData.js` - Central orchestration pattern
- `controllers/summonerController.js` - PUUID acquisition flow
- `api/summonerApi.js` - Riot API integration pattern
- `components/App.jsx` - Main component structure and state management
- `utils/errorHandling.js` - Error mapping strategy
- Component READMEs - Detailed feature documentation

## Common Pitfalls to Avoid

- **Don't bypass PUUID**: Never try to use summoner names directly for API calls
- **Don't duplicate data fetching**: Use existing hooks in `hooks/data/`
- **Don't hardcode queue types**: Use `constants/queueTypes.js`
- **Don't skip error handling**: All API calls must handle Riot API rate limits and errors
- **Don't break the parallel fetching**: New data hooks should integrate into `usePlayerData`
