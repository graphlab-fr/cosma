/** @type {import('jest').Config} */
const config = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(env-paths|is-safe-filename)/)'],
  moduleNameMapper: {
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.js',
  },
};

module.exports = config;
