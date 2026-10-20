import { useRef } from 'react';
import { formatTyping } from '../utils/format.js';

/**
 * Campo numérico reutilizable (input controlado).
 * - value llega del estado del padre; onChange le comunica el nuevo texto.
 * - Mientras se escribe agrega comas de miles: 250000 → 250,000.
 */
export default function NumberField({ id, label, value, onChange, placeholder, error, decimals = 2, thousands = true }) {
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const input = event.target;
    // Recordamos cuántos dígitos había antes del cursor para no "saltar" al final
    const caret = input.selectionStart ?? input.value.length;
    const digitsBefore = input.value.slice(0, caret).replace(/[^\d.]/g, '').length;

    const next = formatTyping(input.value, { decimals, thousands });
    onChange(next);

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el || document.activeElement !== el) return;
      let pos = 0;
      let seen = 0;
      while (pos < next.length && seen < digitsBefore) {
        if (/[\d.]/.test(next[pos])) seen++;
        pos++;
      }
      el.setSelectionRange(pos, pos);
    });
  };

  const errorId = `${id}-error`;
  return (
    <div className={error ? 'field field--invalid' : 'field'}>
      <label htmlFor={id}>{label}</label>
      <input
        ref={inputRef}
        id={id}
        name={id}
        type="text"
        inputMode={decimals === 0 ? 'numeric' : 'decimal'}
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
