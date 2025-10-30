// Easily configure the test environment
process.env.RIOT_API_KEY = "test-api-key";

// Hide logs during tests
console.log = jest.fn();
