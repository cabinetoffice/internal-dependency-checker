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
    coverageThreshold: {
        global: {
            lines: 95,
        },
    },
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    testMatch: ["**/test/**/*.spec.[jt]s"],
    globalSetup: "./test/setup.ts",
    transform: {
        '^.+\\.ts?$': ['ts-jest', { diagnostics: false }]
    }
};
