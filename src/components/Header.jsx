import { CalculatorIcon } from './Icons.jsx';
import HistoryMenu from './HistoryMenu.jsx';

/** Encabezado: marca a la izquierda y botón de usuario (historial) a la derecha. */
export default function Header({ history, onSelectHistory, onClearHistory }) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand__logo">
          <CalculatorIcon />
        </span>
        <span className="brand__text">
          <strong>FinanCalc</strong>
          <small>Calculadora financiera</small>
        </span>
      </div>
      <HistoryMenu items={history} onSelect={onSelectHistory} onClear={onClearHistory} />
    </header>
  );
}
