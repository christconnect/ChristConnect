global.RN$Bridgeless = false;
global.RN$TurboInterop = true;
globalThis['__react_navigation__elements_contexts'] = new Map();

import 'react-native-gesture-handler/jestSetup';

// Mock PlatformConstants
jest.mock('react-native/Libraries/Utilities/NativePlatformConstantsIOS', () => ({
  __esModule: true,
  default: {
    getConstants: () => ({
      isTesting: true,
      reactNativeVersion: { major: 0, minor: 76, patch: 6 },
      forceTouchAvailable: false,
      osVersion: '14.0',
      systemName: 'iOS',
      interfaceIdiom: 'phone',
    }),
  },
}));

jest.mock('react-native/Libraries/Utilities/NativePlatformConstantsAndroid', () => ({
  __esModule: true,
  default: {
    getConstants: () => ({
      isTesting: true,
      reactNativeVersion: { major: 0, minor: 76, patch: 6 },
    }),
  },
}));

jest.mock('react-native/Libraries/Utilities/NativeDeviceInfo', () => ({
  __esModule: true,
  default: {
    getConstants: () => ({
      Dimensions: {
        window: {
          width: 375,
          height: 812,
          scale: 3,
          fontScale: 1,
        },
        screen: {
          width: 375,
          height: 812,
          scale: 3,
          fontScale: 1,
        },
      },
    }),
  },
}));

// Mock DevSettings
jest.mock('react-native/Libraries/NativeModules/specs/NativeDevSettings', () => ({
  __esModule: true,
  default: {
    reload: jest.fn(),
    reloadWithReason: jest.fn(),
    onFastRefresh: jest.fn(),
    setHotLoadingEnabled: jest.fn(),
    setIsDebuggingRemotely: jest.fn(),
    setProfilingEnabled: jest.fn(),
    toggleElementInspector: jest.fn(),
    addMenuItem: jest.fn(),
    openDebugger: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    setIsShakeToShowDevMenuEnabled: jest.fn(),
  },
}));

// Mock SourceCode
jest.mock('react-native/Libraries/NativeModules/specs/NativeSourceCode', () => ({
  __esModule: true,
  default: {
    getConstants: () => ({
      scriptURL: 'http://localhost:8081/index.bundle?platform=ios&dev=true',
    }),
  },
}));

// Mock StatusBarManager for iOS and Android
jest.mock('react-native/Libraries/Components/StatusBar/NativeStatusBarManagerAndroid', () => ({
  __esModule: true,
  default: {
    getConstants: () => ({
      HEIGHT: 20,
    }),
    setColor: jest.fn(),
    setTranslucent: jest.fn(),
    setStyle: jest.fn(),
    setHidden: jest.fn(),
  },
}));

jest.mock('react-native/Libraries/Components/StatusBar/NativeStatusBarManagerIOS', () => ({
  __esModule: true,
  default: {
    getConstants: () => ({
      HEIGHT: 20,
    }),
    setStyle: jest.fn(),
    setHidden: jest.fn(),
    setNetworkActivityIndicatorVisible: jest.fn(),
  },
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock NativeAnimatedHelper to resolve circular dependency loop in Jest tests
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  __esModule: true,
  default: {
    API: {
      getValue: jest.fn(),
      createAnimatedNode: jest.fn(),
      startListeningToAnimatedNodeValue: jest.fn(),
      stopListeningToAnimatedNodeValue: jest.fn(),
      connectAnimatedNodes: jest.fn(),
      disconnectAnimatedNodes: jest.fn(),
      startAnimatingNode: jest.fn(),
      stopAnimation: jest.fn(),
      setAnimatedNodeValue: jest.fn(),
      setAnimatedNodeOffset: jest.fn(),
      flattenAnimatedNodeOffset: jest.fn(),
      extractAnimatedNodeOffset: jest.fn(),
      connectAnimatedNodeToView: jest.fn(),
      disconnectAnimatedNodeFromView: jest.fn(),
      dropAnimatedNode: jest.fn(),
      addAnimatedEventToView: jest.fn(),
      removeAnimatedEventFromView: jest.fn(),
    },
    generateNewNodeTag: () => 1,
    generateNewAnimationId: () => 1,
    assertNativeAnimatedModule: jest.fn(),
    shouldUseNativeDriver: () => false,
    transformDataType: (v) => v,
    nativeEventEmitter: {
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    },
  },
}));

// Mock react-native-safe-area-context with proper React Contexts to support Navigation elements
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const initialMetrics = {
    frame: { width: 320, height: 640, x: 0, y: 0 },
    insets: { left: 0, right: 0, bottom: 0, top: 0 },
  };
  return {
    __esModule: true,
    SafeAreaInsetsContext: React.createContext(initialMetrics.insets),
    SafeAreaFrameContext: React.createContext(initialMetrics.frame),
    initialWindowMetrics: initialMetrics,
    useSafeAreaInsets: () => initialMetrics.insets,
    useSafeAreaFrame: () => initialMetrics.frame,
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
  };
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Override preset mocks for core React Native components to bypass default export import issues
jest.mock('react-native/Libraries/Components/View/View', () => ({
  __esModule: true,
  get default() {
    const React = require('react');
    const View = React.forwardRef((props, ref) => React.createElement('View', { ...props, ref }));
    View.displayName = 'View';
    return View;
  }
}));

jest.mock('react-native/Libraries/Text/Text', () => ({
  __esModule: true,
  get default() {
    const React = require('react');
    const Text = React.forwardRef((props, ref) => React.createElement('Text', { ...props, ref }));
    Text.displayName = 'Text';
    return Text;
  }
}));

jest.mock('react-native/Libraries/Components/TextInput/TextInput', () => ({
  __esModule: true,
  get default() {
    const React = require('react');
    const TextInput = React.forwardRef((props, ref) => React.createElement('TextInput', { ...props, ref }));
    TextInput.displayName = 'TextInput';
    return TextInput;
  }
}));

jest.mock('react-native/Libraries/Components/ScrollView/ScrollView', () => ({
  __esModule: true,
  get default() {
    const React = require('react');
    const ScrollView = React.forwardRef((props, ref) => React.createElement('ScrollView', { ...props, ref }));
    ScrollView.displayName = 'ScrollView';
    return ScrollView;
  }
}));

jest.mock('react-native/Libraries/Image/Image', () => ({
  __esModule: true,
  get default() {
    const React = require('react');
    const Image = React.forwardRef((props, ref) => React.createElement('Image', { ...props, ref }));
    Image.displayName = 'Image';
    return Image;
  }
}));

// Override UIManager directly on react-native exports to bypass Jest resolver mapping mismatches on Windows
const ReactNative = require('react-native');
Object.defineProperty(ReactNative, 'UIManager', {
  get() {
    return require('@react-native/jest-preset/jest/mocks/UIManager').default;
  },
  configurable: true,
  enumerable: true,
});

// Override Linking directly on react-native exports to ensure addEventListener and getInitialURL exist
const originalLinking = ReactNative.Linking;
Object.defineProperty(ReactNative, 'Linking', {
  get() {
    return {
      ...originalLinking,
      addEventListener: jest.fn(() => ({
        remove: jest.fn(),
      })),
      removeEventListener: jest.fn(),
      getInitialURL: jest.fn(() => Promise.resolve(null)),
    };
  },
  configurable: true,
  enumerable: true,
});
