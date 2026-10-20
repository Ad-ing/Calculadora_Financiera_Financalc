import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from './Icons.jsx';
import { MODES } from '../utils/calculators.js';

/**
 * Selector "Calcular: …" con un menú propio (en lugar del <select> nativo,
 * cuyo desplegable no se puede estilizar y heredaba el texto blanco).
 * - Es controlado: el valor activo vive en App (value / onChange).
 * - El estado open y active (opción resaltada) es local: solo le importa a este componente.
 * - Teclado: ↑ ↓ para moverse, Enter/Espacio para elegir, Esc para cerrar.
 */
export default function ModePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const selectedIndex = MODES.findIndex((m) => m.id === value);
  const current = MODES[selectedIndex];

  // Al abrir: resaltar la opción elegida y llevar el foco a la lista
  useEffect(() => {
    if (!open) return;
    setActive(selectedIndex);
    listRef.current?.focus();

    const onPointer = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open, selectedIndex]);

  const choose = (index) => {
    onChange(MODES[index].id);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onButtonKeyDown = (e) => {
    if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e) => {
    const last = MODES.length - 1;
    if (e.key === 'ArrowDown') setActive((i) => Math.min(i + 1, last));
    else if (e.key === 'ArrowUp') setActive((i) => Math.max(i - 1, 0));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(last);
    else if (e.key === 'Enter' || e.key === ' ') choose(active);
    else if (e.key === 'Escape') {
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === 'Tab') setOpen(false);
    else return;
    if (e.key !== 'Tab') e.preventDefault();
  };

  return (
    <div className="mode-picker" ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        className="mode-picker__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="mode-list"
        aria-labelledby="mode-label mode-value"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onButtonKeyDown}
      >
        <span id="mode-label" className="mode-picker__label">
          Calcular:
        </span>
        <span id="mode-value" className="mode-picker__value">
          {current.label}
        </span>
        <ChevronDown className={open ? 'mode-picker__icon is-open' : 'mode-picker__icon'} />
      </button>

      {open && (
        <ul
          ref={listRef}
          id="mode-list"
          className="mode-picker__list"
          role="listbox"
          tabIndex={-1}
          aria-labelledby="mode-label"
          aria-activedescendant={`mode-opt-${MODES[active].id}`}
          onKeyDown={onListKeyDown}
        >
          {MODES.map((m, i) => (
            <li
              key={m.id}
              id={`mode-opt-${m.id}`}
              role="option"
              aria-selected={m.id === value}
              className={[
                'mode-picker__option',
                i === active && 'is-active',
                m.id === value && 'is-selected',
              ]
                .filter(Boolean)
                .join(' ')}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
            >
              {m.label}
              {m.id === value && <span className="mode-picker__check" aria-hidden="true">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
