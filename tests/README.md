# Tests Documentation - SummonerFinder.gg Backend

## 🧪 Test Architecture

This test suite follows **TDD best practices** with Jest and Supertest to ensure API quality and robustness.

### 📁 Test Structure

```
tests/
├── setup.js                           # Global test configuration
├── unit/                              # Unit tests
│   ├── api/                           # Tests for Riot API functions
│   │   ├── summonerApi.test.js        # getRiotId, getSummonerByPuuid
│   │   ├── championApi.test.js        # getMatchIds, getMatchData
│   │   ├── masteriesApi.test.js       # getMasteriesByPuuid
│   │   ├── rankedApi.test.js          # getRankedByPuuid
│   │   └── matchApi.test.js           # getMatchHistory, getMatchDetails
│   ├── controllers/                   # Tests for Express controllers
│   │   ├── summonerController.test.js
│   │   ├── championController.test.js
│   │   ├── masteryController.test.js
│   │   ├── matchController.test.js
│   │   └── rankedController.test.js
│   └── database/                      # Database tests
│       ├── connection.test.js         # MongoDB connection test
│       └── models/                    # Tests for Mongoose models
│           ├── summoner.test.js
│           ├── match.test.js
│           └── ranked.test.js
└── integration/                       # Integration tests (WIP)
    ├── app.test.js                    # Full application tests
    └── routes/                        # HTTP route tests (empty for now)
```

## 🎯 Test Types

### 1. **Unit Tests - API** (`unit/api/`)

Test **Riot API functions** directly:

- Mock `fetch` to simulate API calls
- Verify logic without external dependencies
- **3 mandatory scenarios**: success, HTTP error, network error

### 2. **Unit Tests - Controllers** (`unit/controllers/`)

Test **Express controllers**:

- Mock services (e.g., `summonerService.searchSummoner`)
- Verify Express `req`/`res` objects
- Test error code propagation (`statusCode`)

### 3. **Unit Tests - Database** (`unit/database/`)

Test **Mongoose models**:

- Verify schema structure
- Test defined indexes
- Validate data types
- **Note**: No real MongoDB connection, structure tests only

### 4. **Integration Tests** (`integration/`)

End-to-end tests (currently in development).

## 🛠️ Configuration

### Global Setup (`setup.js`)

```javascript
// Environment variables for tests
process.env.RIOT_API_KEY = "test-api-key";

// Hide logs during tests
console.log = jest.fn();
```

### Jest Config (`jest.config.js`)

- **Environment**: Node.js
- **Timeout**: 10 seconds
- **Setup**: Uses `tests/setup.js`
- **clearMocks**: Automatic cleanup between tests

## 📝 Test Patterns

### ✅ Successful API Test

```javascript
it("should return data when API call is successful", async () => {
  const mockResponse = { puuid: "test-puuid", gameName: "testuser" };

  fetch.mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce(mockResponse),
  });

  const result = await getRiotId("testuser", "EUW");

  expect(fetch).toHaveBeenCalledWith(expectedUrl);
  expect(result).toEqual(mockResponse);
});
```

### ❌ HTTP Error Test with statusCode

```javascript
it("should throw error with correct statusCode when API call fails", async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 404,
    text: jest.fn().mockResolvedValueOnce("Not Found"),
  });

  try {
    await getRiotId("nonexistent", "EUW");
  } catch (error) {
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain("Not Found");
  }
});
```

### 🌐 Network Error Test

```javascript
it("should handle network errors", async () => {
  fetch.mockRejectedValueOnce(new Error("Network error"));

  await expect(getRiotId("testuser", "EUW")).rejects.toThrow("Network error");
});
```

### 🎮 Controller Test

```javascript
it("should return summoner data on success", async () => {
  const mockResult = { summoner: { puuid: "abc", username: "testuser" } };
  jest
    .spyOn(summonerService, "searchSummoner")
    .mockResolvedValueOnce(mockResult);

  await searchSummoner(req, res);

  expect(summonerService.searchSummoner).toHaveBeenCalledWith(
    "testuser",
    "EUW"
  );
  expect(res.json).toHaveBeenCalledWith(mockResult);
});
```

### 🗄️ Mongoose Model Test

```javascript
it("should have the correct schema structure", () => {
  const schemaPaths = Summoner.schema.paths;
  expect(schemaPaths.username).toBeDefined();
  expect(schemaPaths.puuid).toBeDefined();
  expect(schemaPaths.level).toBeDefined();
});

it("should have an index on puuid", () => {
  const indexes = Summoner.schema.indexes();
  const hasPuuidIndex = indexes.some(([fields]) => fields.puuid === 1);
  expect(hasPuuidIndex).toBe(true);
});
```

## 🚀 Test Commands

```bash
# Run all tests
yarn test

# Tests in watch mode (development)
yarn test --watch

# Tests with coverage
yarn test --coverage

# Test a specific file
yarn test summonerApi

# Tests in verbose mode (detailed)
yarn test --verbose
```

## 🎯 Adding New Tests

### 1. Create Test File

```bash
# For a new API
touch tests/unit/api/newApi.test.js

# For a new controller
touch tests/unit/controllers/newController.test.js

# For a new model
touch tests/unit/database/models/newModel.test.js
```

### 2. Basic Structure - API Tests

```javascript
const { newFunction } = require("../../../api/newApi");

global.fetch = jest.fn();

describe("newApi", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe("newFunction", () => {
    it("should handle successful API calls", async () => {
      /* ... */
    });
    it("should throw error with correct statusCode when API call fails", async () => {
      /* ... */
    });
    it("should handle network errors", async () => {
      /* ... */
    });
  });
});
```

### 3. Basic Structure - Controller Tests

```javascript
const service = require("../../../services/feature/featureService");
const {
  controllerFunction,
} = require("../../../controllers/featureController");

const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe("featureController.controllerFunction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return data on success", async () => {
    /* ... */
  });
  it("should handle errors and return status code", async () => {
    /* ... */
  });
});
```

### 4. Basic Structure - Model Tests

```javascript
const Model = require("../../../../database/models/model");

describe("Model model", () => {
  it("should have the correct schema structure", () => {
    /* ... */
  });
  it("should have required indexes", () => {
    /* ... */
  });
  it("should validate a valid document", async () => {
    /* ... */
  });
});
```

## 📊 Checklist for Each Test Type

### API Tests (`unit/api/`)

- ✅ Mock `fetch` globally
- ✅ `beforeEach(() => fetch.mockClear())`
- ✅ Test success + verify URL
- ✅ Test HTTP error with `statusCode`
- ✅ Test network error

### Controller Tests (`unit/controllers/`)

- ✅ Mock the corresponding service
- ✅ Create `mockRes()` with `json` and `status`
- ✅ Test success
- ✅ Test error with `statusCode` propagation
- ✅ Test error without `statusCode` (default 500)

### Model Tests (`unit/database/models/`)

- ✅ Verify schema structure
- ✅ Verify indexes
- ✅ Test validation of a valid document
- ✅ Test validation with invalid types

## 🎉 Best Practices

### ✅ DO

- Test all 3 scenarios for each API function (success, HTTP error, network error)
- Use realistic data in mocks
- Verify exact API call URLs
- Reset mocks in `beforeEach`
- Use clear test descriptions

### ❌ DON'T

- Forget network error tests
- Hardcode environment variables (use `setup.js`)
- Share state between tests
- Test multiple functions in one test
- Ignore `statusCode` in assertions

## 🔍 Debugging

### Undefined environment variables

```javascript
// ❌ Problem: RIOT_API_KEY undefined
// ✅ Solution: Defined in setup.js before imports
```

### Mocks not working

```javascript
// ❌ Problem: fetch.mockClear() forgotten
// ✅ Solution: Always reset in beforeEach
```

### Tests failing in parallel

```javascript
// ❌ Problem: Shared state between tests
// ✅ Solution: Complete isolation with clean mocks
```

This test architecture ensures the **robustness** and **maintainability** of the SummonerFinder.gg API! 🚀
