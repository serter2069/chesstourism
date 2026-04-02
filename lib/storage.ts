// Platform-agnostic storage import
// Metro/Expo resolves .native.ts on native and .web.ts on web automatically
// This file serves as the default fallback and type declaration
import { Platform } from 'react-native';

export interface Storage {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  del: (key: string) => Promise<void>;
}

// Re-export the correct platform implementation
// Metro bundler resolves storage.native.ts / storage.web.ts automatically
// This file is the fallback for platforms not covered
let storage: Storage;

if (Platform.OS === 'web') {
  // Guard against SSR where localStorage is not available
  const isClient = typeof window !== 'undefined';
  storage = {
    get: (key: string) =>
      Promise.resolve(isClient ? localStorage.getItem(key) : null),
    set: (key: string, value: string) => {
      if (isClient) localStorage.setItem(key, value);
      return Promise.resolve();
    },
    del: (key: string) => {
      if (isClient) localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
} else {
  // Dynamic import not available at module level for native,
  // but Metro resolves .native.ts extension automatically
  // This fallback uses AsyncStorage as a safety net
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  storage = {
    get: (key: string) => AsyncStorage.getItem(key),
    set: (key: string, value: string) => AsyncStorage.setItem(key, value),
    del: (key: string) => AsyncStorage.removeItem(key),
  };
}

export { storage };
