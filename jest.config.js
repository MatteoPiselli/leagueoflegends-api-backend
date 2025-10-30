module.exports = {
  testEnvironment: "node",
  testTimeout: 10000,
  clearMocks: true,
  forceExit: true,
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
