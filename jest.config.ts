import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  rootDir: './',
  clearMocks: true,
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/tests/**/*.spec.ts',
    '<rootDir>/tests/**/*.test.ts',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  extensionsToTreatAsEsm: ['.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/types/express/index.ts'],
};

export default config;
