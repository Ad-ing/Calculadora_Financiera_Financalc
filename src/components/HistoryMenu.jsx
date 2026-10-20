import { useEffect, useRef, useState } from 'react';
import { UserIcon } from './Icons.jsx';
import { getMode } from '../utils/calculators.js';
import { money } from '../utils/format.js';

const dateFormat = new Intl.DateTimeFormat('es-DO', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
});

/**
 * Botón de usuario: abre "Mis simulaciones", el historial guardado
 * en localStorage. El estado open es local porque solo le importa a este componente.
 */
export default function HistoryMenu({ items, onSelect, onClear }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Cierra al hacer clic fuera o al pulsar Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="history" ref={wrapperRef}>
      <button
        type="button"
        className="avatar"
        aria-label="Mis simulaciones"
        aria-expanded={open}
        aria-controls="history-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <UserIcon />
      </button>

      {open && (
        <div className="history__panel" id="history-panel" role="dialog" aria-label="Mis simulaciones">
          <div className="history__head">
            <h2>Mis simulaciones</h2>
            {items.length > 0 && (
              <button type="button" className="text-btn" onClick={onClear}>
                Borrar
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <p className="history__empty">Aún no tienes simulaciones. Tus últimos cálculos aparecerán aquí.</p>
          ) : (
            <ul className="history__list">
              {items.map((item) => {
                const mode = getMode(item.modeId);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(item);
                        setOpen(false);
                      }}
                    >
                      <span className="history__mode">{mode.label}</span>
                      <span className="history__value">{money(item.main)}</span>
                      <span className="history__date">{dateFormat.format(new Date(item.date))}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
