import { percent } from '../utils/format.js';

/** Barra horizontal: qué parte del total es capital/aportes y qué parte intereses. */
export default function CompositionBar({ parts, result }) {
  const values = parts.map((p) => Math.max(result[p.key], 0));
  const total = values.reduce((sum, v) => sum + v, 0) || 1;
  const shares = values.map((v) => (v / total) * 100);

  return (
    <section className="card composition">
      <h2 className="card__title card__title--small">Composición del total</h2>
      <div
        className="composition__bar"
        role="img"
        aria-label={parts.map((p, i) => `${p.label} ${percent(shares[i])}`).join(', ')}
      >
        {shares.map((share, i) => (
          <span key={parts[i].key} className={`composition__seg composition__seg--${i}`} style={{ width: `${share}%` }} />
        ))}
      </div>
      <ul className="composition__legend">
        {parts.map((p, i) => (
          <li key={p.key}>
            <span className={`dot dot--${i}`} aria-hidden="true" />
            {p.label} <span className="sep">·</span> <strong>{percent(shares[i])}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
