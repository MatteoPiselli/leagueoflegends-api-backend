# Tests Documentation - SummonerFinder.gg Backend

## 🧪 Test Architecture

This test suite follows **TDD best practices** with Jest and Supertest to ensure API quality and robustness.

### 📁 Test Structure

```
tests/
├── setup.js                   # Global test configuration
├── unit/api/                  # Unit tests for API functions
│   ├── summonerApi.test.js    # Tests for getRiotId, getSummonerByPuuid
│   ├── championApi.test.js    # Tests for getMatchIds, getMatchData
│   ├── masteriesApi.test.js   # Tests for getMasteriesByPuuid
│   ├── rankedApi.test.js      # Tests for getRankedByPuuid
│   └── matchApi.test.js       # Tests for getMatchHistory, getMatchDetails
└── integration/routes/        # HTTP integration tests
    └── summoner.test.js       # Tests for Express endpoints
```

## 🎯 Test Types

### 1. **Unit Tests** (`unit/api/`)

- Test **API functions directly**
- Mock `fetch` calls to Riot API
- Verify **business logic** without external dependencies

### 2. **Integration Tests** (`integration/routes/`)

- Test **complete HTTP endpoints**
- Use Supertest to simulate requests
- Verify **complete Express.js flow**

## 🛠️ Configuration

### Global Setup (`setup.js`)

```javascript
// Environment variables for tests
process.env.NODE_ENV = "test";
process.env.RIOT_API_KEY = "test-api-key";

// Mock console.log for clean tests
global.console.log = jest.fn();

// Global fetch mock
global.fetch = jest.fn();
```

### Jest Config (`jest.config.js`)

- **Environment**: Node.js
- **Timeout**: 10 seconds
- **Setup**: Uses `tests/setup.js`
- **Mocks**: Automatic clear between tests

## 📝 Test Patterns

### ✅ Successful API Test

```javascript
it("should return data when API call is successful", async () => {
  const mockResponse = {
    /* data */
  };

  fetch.mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce(mockResponse),
  });

  const result = await apiFunction(params);

  expect(fetch).toHaveBeenCalledWith(expectedUrl);
  expect(result).toEqual(mockResponse);
});
```

### ❌ HTTP Error Test

```javascript
it("should throw error with status code when API fails", async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 404,
    text: jest.fn().mockResolvedValueOnce("Not Found"),
  });

  try {
    await apiFunction(params);
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

  await expect(apiFunction(params)).rejects.toThrow("Network error");
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

## 📊 Test Coverage

### Scenarios covered for each API function:

#### ✅ **Success Cases**

- Successful API calls with valid data
- Default and custom parameters
- Empty or partial responses

#### ❌ **Error Handling**

- HTTP status codes (404, 403, 429, 500, etc.)
- Appropriate error messages
- Status code propagation

#### 🌐 **Network Errors**

- Connection timeouts
- Network errors
- Fetch promise rejections

## 🎯 How to Add New Tests

### 1. **Create the test file**

```bash
# For a new API
touch tests/unit/api/newApi.test.js
```

### 2. **Basic structure**

```javascript
const { newFunction } = require("../../../api/newApi");

// Mock fetch globally
global.fetch = jest.fn();

describe("newApi", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe("newFunction", () => {
    it("should handle successful API calls", async () => {
      // Test implementation
    });

    it("should handle API errors", async () => {
      // Test implementation
    });

    it("should handle network errors", async () => {
      // Test implementation
    });
  });
});
```

### 3. **Required patterns**

- ✅ **Mock fetch** in each file
- ✅ **beforeEach** to reset mocks
- ✅ **Test 3 scenarios**: success, HTTP error, network error
- ✅ **Verify URLs** and parameters

## 🔍 Test Debugging

### Common issues:

#### **Undefined environment variables**

```javascript
// ❌ Problem: API key undefined in tests
// ✅ Solution: Use setup.js to define env vars BEFORE import
```

#### **Mocks not working**

```javascript
// ❌ Problem: fetch.mockClear() forgotten
// ✅ Solution: Always reset mocks in beforeEach
```

#### **Tests failing in parallel**

```javascript
// ❌ Problem: Shared state between tests
// ✅ Solution: Complete isolation with clean mocks
```

## 🎉 Best Practices

### ✅ **DO**

- Test the 3 scenarios (success, HTTP error, network error)
- Use realistic test data
- Verify exact API call URLs
- Reset mocks between each test
- Use clear descriptions for tests

### ❌ **DON'T**

- Don't forget network error tests
- Don't hardcode environment variables
- Don't share state between tests
- Don't test multiple functions in one test
- Don't ignore status codes in assertions

## 📈 Quality Metrics

- **100% coverage** of API functions
- **All error cases** handled and tested
- **Complete isolation** of tests
- **Optimized execution time** with mocks
- **CI/CD integration** with GitHub Actions

This test architecture ensures the **robustness** and **maintainability** of the SummonerFinder.gg API! 🚀
