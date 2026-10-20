import { money } from '../utils/format.js';

/**
 * Tarjeta "Total (resumen)". Antes de calcular (result = null)
 * muestra RD$ 0.00 y guiones; después, las cifras principales.
 */
export default function SummaryCard({ mode, result }) {
  const { main, rows } = mode.summary;
  return (
    <section className="summary" aria-live="polite" aria-label="Resumen del resultado">
      <p className="summary__label">
        Total (resumen) · <span>{main.label}</span>
      </p>
      <p className="summary__value">{money(result ? result[main.key] : 0)}</p>
      <dl className="summary__rows">
        {rows.map((row) => (
          <div key={row.key} className="summary__row">
            <dt>{row.label}</dt>
            <dd>{result ? money(result[row.key]) : '—'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
