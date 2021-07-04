module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/?(*.)(spec|test).(ts|tsx|js)?(x)'],
  collectCoverageFrom: ['./src/**/*.ts'],
  reporters: [ "default", "jest-junit" ],
  moduleDirectories: ['src', 'node_modules']
};
