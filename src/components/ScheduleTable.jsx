import { formatValue } from '../utils/format.js';

/** Tabla período a período generada con .map() sobre result.schedule. */
export default function ScheduleTable({ table, result }) {
  return (
    <section className="card schedule">
      <h2 className="card__title" id="schedule-title">
        {table.title}
      </h2>
      <div className="schedule__scroll" tabIndex={0} role="region" aria-labelledby="schedule-title">
        <table>
          <thead>
            <tr>
              {table.columns.map((col) => (
                <th key={col.key} scope="col">
                  {col.labelKey ? result[col.labelKey] : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.schedule.map((row) => (
              <tr key={row.period}>
                {table.columns.map((col) => (
                  <td key={col.key} className={col.strong ? 'strong' : undefined}>
                    {formatValue(row[col.key], col.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
