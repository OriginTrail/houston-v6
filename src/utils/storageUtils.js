export const saveToStorage = (key, value) => {
  return localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
};

export const readFromStorage = (key) => {
  return localStorage.getItem(key);
};

export const deleteFromStorage = (key) => {
  return localStorage.removeItem(key);
};
