import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import ModePicker from './components/ModePicker.jsx';
import CalculatorForm from './components/CalculatorForm.jsx';
import SummaryCard from './components/SummaryCard.jsx';
import DetailsView from './components/DetailsView.jsx';
import { ChevronRight } from './components/Icons.jsx';
import { MODES, getMode, emptyValues } from './utils/calculators.js';
import { validateForm } from './utils/validation.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useMediaQuery } from './hooks/useMediaQuery.js';

// Un objeto de valores vacíos por cada modalidad: { loan: {...}, simple: {...}, ... }
const initialValues = Object.fromEntries(MODES.map((m) => [m.id, emptyValues(m)]));
const DETAILS_HASH = '#detalle';
const MAX_HISTORY = 8;

export default function App() {
  // ── Estado ────────────────────────────────────────────────
  const [modeId, setModeId] = useState('loan');
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [simulations, setSimulations] = useState({}); // { loan: { inputs, result } }
  const [showDetails, setShowDetails] = useState(false);
  const [history, setHistory] = useLocalStorage('financalc:historial', []);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const mode = getMode(modeId);
  const simulation = simulations[modeId] ?? null;

  // ── Efectos ───────────────────────────────────────────────
  useEffect(() => {
    document.title = 'FinanCalc | Calculadora financiera';
    // Si la página se abre con #detalle sin datos, se limpia el hash
    if (window.location.hash === DETAILS_HASH) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // El botón "atrás" del celular cierra el detalle en lugar de salir de la app
  useEffect(() => {
    const onHashChange = () => setShowDetails(window.location.hash === DETAILS_HASH);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Al cambiar de pantalla en el celular, volver arriba
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [showDetails]);

  // ── Manejadores de eventos ────────────────────────────────
  const changeMode = (nextId) => {
    setModeId(nextId);
    setErrors({});
  };

  const changeField = (field, value) => {
    setValues((prev) => ({ ...prev, [modeId]: { ...prev[modeId], [field]: value } }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    // Un dato cambió: el resultado anterior ya no corresponde
    setSimulations((prev) => ({ ...prev, [modeId]: null }));
  };

  const runSimulation = (targetMode, formValues) => {
    const { errors: found, inputs } = validateForm(targetMode, formValues);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setSimulations((prev) => ({ ...prev, [targetMode.id]: null }));
      // Llevar el foco al primer campo con error
      const first = targetMode.fields.find((f) => found[f.name]);
      document.getElementById(`${targetMode.id}-${first.name}`)?.focus();
      return null;
    }
    const result = targetMode.compute(inputs);
    setErrors({});
    setSimulations((prev) => ({ ...prev, [targetMode.id]: { inputs, result } }));
    return result;
  };

  const submit = (event) => {
    event.preventDefault(); // evita que el formulario recargue la página
    const result = runSimulation(mode, values[modeId]);
    if (!result) return;

    const entry = {
      id: Date.now(),
      modeId,
      values: values[modeId],
      main: result[mode.summary.main.key],
      date: new Date().toISOString(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
  };

  const loadFromHistory = (item) => {
    const target = getMode(item.modeId);
    setModeId(target.id);
    setValues((prev) => ({ ...prev, [target.id]: { ...emptyValues(target), ...item.values } }));
    runSimulation(target, { ...emptyValues(target), ...item.values });
  };

  const openDetails = () => {
    window.location.hash = DETAILS_HASH; // dispara hashchange → showDetails = true
  };

  const closeDetails = () => {
    if (window.location.hash === DETAILS_HASH) window.history.back();
    else setShowDetails(false);
  };

  // ── Vista ─────────────────────────────────────────────────
  const header = (
    <Header history={history} onSelectHistory={loadFromHistory} onClearHistory={() => setHistory([])} />
  );

  // Celular / tableta: el detalle es una pantalla aparte
  if (!isDesktop && showDetails && simulation) {
    return (
      <div className="app app--details">
        {header}
        <main>
          <DetailsView mode={mode} simulation={simulation} onBack={closeDetails} />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      {header}
      <main className="layout">
        <div className="calculator">
          <ModePicker value={modeId} onChange={changeMode} />
          <CalculatorForm
            mode={mode}
            values={values[modeId]}
            errors={errors}
            onFieldChange={changeField}
            onSubmit={submit}
          />
          <SummaryCard mode={mode} result={simulation?.result ?? null} />
          {!isDesktop && (
            <button type="button" className="btn btn--details" onClick={openDetails} disabled={!simulation}>
              Detalles
              <ChevronRight />
            </button>
          )}
          <p className="disclaimer">Simulación referencial. Las condiciones finales las define la institución.</p>
        </div>

        {isDesktop && <DetailsView mode={mode} simulation={simulation} />}
      </main>
    </div>
  );
}
