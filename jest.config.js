module.exports = {
  moduleNameMapper: {
    '@root/(.*)$': '<rootDir>/functions/$1',
    '@route/(.*)$': '<rootDir>/functions/routes/$1',
    '@helpers/(.*)$': '<rootDir>/functions/helpers/$1',
    '@queries/(.*)$': '<rootDir>/functions/queries/$1',
    '@module/(.*)$': '<rootDir>/functions/node_modules/$1',
  },
  moduleFileExtensions: ['js', 'json'],
  testPathIgnorePatterns: ['node_modules/'],
}
