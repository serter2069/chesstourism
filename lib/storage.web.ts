// storage.web.ts — localStorage (survives browser reload)
export const storage = {
  get: (key: string) => Promise.resolve(localStorage.getItem(key)),
  set: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  del: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};
