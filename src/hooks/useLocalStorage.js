import { useEffect, useState } from 'react';

/**
 * Igual que useState, pero guarda el valor en localStorage.
 * Si el navegador bloquea el almacenamiento, la app sigue funcionando.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Sincroniza con localStorage cada vez que cambia el valor
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* almacenamiento no disponible: se ignora */
    }
  }, [key, value]);

  return [value, setValue];
}
