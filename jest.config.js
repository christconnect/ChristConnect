const path = require('path');
const reactNativePath = path.dirname(require.resolve('react-native')).replace(/\\/g, '/');

module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: [
    '@react-native/jest-preset/jest/setup.js',
    './jest.setup.js',
  ],
  moduleNameMapper: {
    '^react-native/Libraries/Animated/NativeAnimatedHelper$': 'react-native/src/private/animated/NativeAnimatedHelper',
    '^react-native($|/.*)': `${reactNativePath}/$1`,
    'useFrameSize': '<rootDir>/__mocks__/useFrameSizeMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-reanimated)/)',
  ],
};
