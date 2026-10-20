import { formatValue } from '../utils/format.js';

/** Cuadrícula 2×2 de indicadores. El primero se resalta en verde. */
export default function StatTiles({ tiles, result }) {
  return (
    <dl className="tiles">
      {tiles.map((tile) => (
        <div key={tile.key} className={tile.highlight ? 'tile tile--highlight' : 'tile'}>
          <dt>{tile.label}</dt>
          <dd>{formatValue(result[tile.key], tile.type)}</dd>
        </div>
      ))}
    </dl>
  );
}
