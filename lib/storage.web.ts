// storage.web.ts — localStorage (survives browser reload)
// Guard against SSR where localStorage is not available
const isClient = typeof window !== 'undefined';

export const storage = {
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
