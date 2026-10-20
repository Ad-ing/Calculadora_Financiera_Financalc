import { ChevronLeft } from './Icons.jsx';
import StatTiles from './StatTiles.jsx';
import CompositionBar from './CompositionBar.jsx';
import ScheduleTable from './ScheduleTable.jsx';

/**
 * "Detalle de la simulación": encabezado, 4 indicadores, barra de
 * composición y tabla. En celular se abre como pantalla aparte (onBack);
 * en escritorio se muestra a la derecha del formulario.
 */
export default function DetailsView({ mode, simulation, onBack }) {
  return (
    <section className="details" aria-labelledby="details-title">
      {onBack && (
        <button type="button" className="back-link" onClick={onBack}>
          <ChevronLeft />
          Volver a la calculadora
        </button>
      )}

      <h1 id="details-title" className="details__title">
        Detalle de la simulación
      </h1>

      {!simulation ? (
        <div className="details__empty">
          <p>Completa los datos y pulsa <strong>Calcular</strong> para ver el desglose completo.</p>
        </div>
      ) : (
        <>
          <p className="details__subtitle">
            {mode.label} · {mode.subtitle(simulation.inputs)}
          </p>
          <StatTiles tiles={mode.tiles} result={simulation.result} />
          <CompositionBar parts={mode.composition} result={simulation.result} />
          <ScheduleTable table={mode.table} result={simulation.result} />
        </>
      )}
    </section>
  );
}
