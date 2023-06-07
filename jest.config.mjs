
module.exports = {
  roots: [
    "<rootDir>"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
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
