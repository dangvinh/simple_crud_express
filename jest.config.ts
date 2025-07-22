// jest.config.ts

import type { Config } from "jest";

const config: Config = {
  // Use ts-jest preset to handle TypeScript files
  preset: "ts-jest",

  // Root directory for resolving files
  rootDir: "./",

  // Automatically clear mock calls and instances before every test
  clearMocks: true,

  // Look for test files with .spec.ts or .test.ts
  testMatch: ["<rootDir>/src/**/*.spec.ts", "<rootDir>/src/**/*.test.ts"],

  // Collect coverage from source files
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],

  // Module file extensions for importing
  moduleFileExtensions: ["ts", "tsx", "js", "json"],

  // Transform TypeScript files using ts-jest
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  // Point ts-jest to test-specific tsconfig
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },

  // Support absolute imports with @/
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Environment in which the tests are run
  testEnvironment: "node",

  // Look for test files only in the /test directory
  roots: ["<rootDir>/test"],

  // Enable code coverage collection
  collectCoverage: true,

  // Directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Coverage reporters to use:
  // 'text' shows a summary in the terminal,
  // 'lcov' is used by many CI tools (e.g. SonarQube),
  // 'html' generates a browsable HTML report
  coverageReporters: ["text", "lcov", "html"],
};

export default config;
