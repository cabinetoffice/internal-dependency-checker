module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/test"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/infrastructure/",
    "/dist/"
  ],
  collectCoverageFrom: [
    "./src/**/*.ts"
  ],
  coveragePathIgnorePatterns: [],
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/test/**/*.spec.[jt]s"],
  globalSetup: "./test/setup.ts"
};
