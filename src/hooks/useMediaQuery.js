import { useEffect, useState } from 'react';

/** Devuelve true mientras la media query se cumpla (p. ej. pantalla de escritorio). */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange); // limpieza
  }, [query]);

  return matches;
}
