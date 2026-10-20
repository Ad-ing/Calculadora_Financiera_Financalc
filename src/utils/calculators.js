// ─────────────────────────────────────────────────────────────
// calculators.js — Configuración de cada modalidad.
// Describe qué campos tiene cada formulario, qué etiquetas se muestran
// y qué función de finance.js se usa. Los componentes leen esta
// configuración en lugar de repetir JSX para cada modalidad.
// ─────────────────────────────────────────────────────────────
import { calcLoan, calcSimple, calcCompound, calcSavings } from './finance.js';
import { money, plain } from './format.js';

const RATE_TYPE_OPTIONS = [
  { value: 'anual', label: 'Tasa anual' },
  { value: 'mensual', label: 'Tasa mensual' },
];

export const FREQUENCY_OPTIONS = [
  { value: '12', label: 'Mensual' },
  { value: '4', label: 'Trimestral' },
  { value: '2', label: 'Semestral' },
  { value: '1', label: 'Anual' },
  { value: '365', label: 'Diaria' },
];

// Reglas reutilizables para validar
const RATE_RULES = { min: 0, allowZero: true, max: 100 };
const MONTH_RULES = { min: 0, max: 600, integer: true };
const YEAR_RULES = { min: 0, max: 50 };

export const MODES = [
  {
    id: 'loan',
    label: 'Préstamo (cuotas)',
    fields: [
      { name: 'amount', label: 'Monto del préstamo (RD$)', placeholder: 'Ej. 250,000', decimals: 2, rules: { min: 0 } },
      { name: 'months', label: 'Plazo (meses)', placeholder: 'Ej. 36', decimals: 0, thousands: false, rules: MONTH_RULES },
      { name: 'rateType', label: 'Interés', kind: 'select', options: RATE_TYPE_OPTIONS },
      { name: 'rate', label: 'Tasa de interés (%)', placeholder: 'Ej. 14.5', decimals: 4, thousands: false, rules: RATE_RULES },
    ],
    compute: calcLoan,
    summary: {
      main: { label: 'Cuota mensual', key: 'payment' },
      rows: [
        { label: 'Total a pagar', key: 'total' },
        { label: 'Total de intereses', key: 'interest' },
      ],
    },
    subtitle: (v) => `${money(v.amount)} · ${v.months} meses · ${plain(v.rate)}% ${v.rateType}`,
    tiles: [
      { label: 'Cuota mensual', key: 'payment', highlight: true },
      { label: 'Total a pagar', key: 'total' },
      { label: 'Total de intereses', key: 'interest' },
      { label: 'Monto solicitado', key: 'amount' },
    ],
    composition: [
      { label: 'Capital', key: 'capital' },
      { label: 'Intereses', key: 'interest' },
    ],
    table: {
      title: 'Tabla de amortización',
      columns: [
        { key: 'period', label: 'Mes', type: 'int' },
        { key: 'payment', label: 'Cuota' },
        { key: 'interest', label: 'Interés' },
        { key: 'principal', label: 'Capital' },
        { key: 'balance', label: 'Saldo', strong: true },
      ],
    },
  },
  {
    id: 'simple',
    label: 'Interés simple',
    fields: [
      { name: 'capital', label: 'Capital (RD$)', placeholder: 'Ej. 50,000', decimals: 2, rules: { min: 0 } },
      { name: 'months', label: 'Plazo (meses)', placeholder: 'Ej. 18', decimals: 0, thousands: false, rules: MONTH_RULES },
      { name: 'rateType', label: 'Interés', kind: 'select', options: RATE_TYPE_OPTIONS },
      { name: 'rate', label: 'Tasa de interés (%)', placeholder: 'Ej. 9', decimals: 4, thousands: false, rules: RATE_RULES },
    ],
    compute: calcSimple,
    summary: {
      main: { label: 'Monto final', key: 'total' },
      rows: [
        { label: 'Interés generado', key: 'interest' },
        { label: 'Capital inicial', key: 'capital' },
      ],
    },
    subtitle: (v) => `${money(v.capital)} · ${v.months} meses · ${plain(v.rate)}% ${v.rateType}`,
    tiles: [
      { label: 'Monto final', key: 'total', highlight: true },
      { label: 'Interés generado', key: 'interest' },
      { label: 'Interés por mes', key: 'monthlyInterest' },
      { label: 'Capital inicial', key: 'capital' },
    ],
    composition: [
      { label: 'Capital', key: 'capital' },
      { label: 'Intereses', key: 'interest' },
    ],
    table: {
      title: 'Evolución mensual',
      columns: [
        { key: 'period', label: 'Mes', type: 'int' },
        { key: 'interest', label: 'Interés del mes' },
        { key: 'accumulated', label: 'Interés acumulado' },
        { key: 'balance', label: 'Saldo', strong: true },
      ],
    },
  },
  {
    id: 'compound',
    label: 'Interés compuesto',
    fields: [
      { name: 'capital', label: 'Capital (RD$)', placeholder: 'Ej. 100,000', decimals: 2, rules: { min: 0 } },
      { name: 'years', label: 'Plazo (años)', placeholder: 'Ej. 5', decimals: 2, thousands: false, rules: YEAR_RULES },
      { name: 'frequency', label: 'Capitalización', kind: 'select', options: FREQUENCY_OPTIONS },
      { name: 'rate', label: 'Tasa anual (%)', placeholder: 'Ej. 8', decimals: 4, thousands: false, rules: RATE_RULES },
    ],
    compute: calcCompound,
    summary: {
      main: { label: 'Monto final', key: 'total' },
      rows: [
        { label: 'Interés generado', key: 'interest' },
        { label: 'Capital inicial', key: 'capital' },
      ],
    },
    subtitle: (v) => {
      const freq = FREQUENCY_OPTIONS.find((o) => Number(o.value) === v.frequency)?.label ?? '';
      return `${money(v.capital)} · ${plain(v.years)} años · ${plain(v.rate)}% anual · ${freq.toLowerCase()}`;
    },
    tiles: [
      { label: 'Monto final', key: 'total', highlight: true },
      { label: 'Interés generado', key: 'interest' },
      { label: 'Tasa efectiva anual', key: 'effectiveRate', type: 'percent' },
      { label: 'Capital inicial', key: 'capital' },
    ],
    composition: [
      { label: 'Capital', key: 'capital' },
      { label: 'Intereses', key: 'interest' },
    ],
    table: {
      title: 'Evolución del capital',
      columns: [
        { key: 'period', label: 'Periodo', type: 'int', labelKey: 'periodLabel' },
        { key: 'opening', label: 'Saldo inicial' },
        { key: 'interest', label: 'Interés' },
        { key: 'balance', label: 'Saldo final', strong: true },
      ],
    },
  },
  {
    id: 'savings',
    label: 'Proyección de ahorro',
    fields: [
      { name: 'initial', label: 'Depósito inicial (RD$)', placeholder: 'Ej. 10,000', decimals: 2, rules: { min: 0, allowZero: true } },
      { name: 'monthly', label: 'Aporte mensual (RD$)', placeholder: 'Ej. 3,000', decimals: 2, optional: true, rules: { min: 0, allowZero: true } },
      { name: 'years', label: 'Plazo (años)', placeholder: 'Ej. 3', decimals: 2, thousands: false, rules: YEAR_RULES },
      { name: 'rate', label: 'Tasa anual (%)', placeholder: 'Ej. 6', decimals: 4, thousands: false, rules: RATE_RULES },
    ],
    compute: calcSavings,
    // Validación que depende de dos campos a la vez
    crossValidate: (v) =>
      v.initial === 0 && v.monthly === 0 ? { monthly: 'Agrega un depósito inicial o un aporte mensual.' } : {},
    summary: {
      main: { label: 'Saldo proyectado', key: 'balance' },
      rows: [
        { label: 'Total aportado', key: 'contributed' },
        { label: 'Intereses ganados', key: 'interest' },
      ],
    },
    subtitle: (v) =>
      `${money(v.initial)} + ${money(v.monthly)}/mes · ${plain(v.years)} años · ${plain(v.rate)}% anual`,
    tiles: [
      { label: 'Saldo proyectado', key: 'balance', highlight: true },
      { label: 'Total aportado', key: 'contributed' },
      { label: 'Intereses ganados', key: 'interest' },
      { label: 'Depósito inicial', key: 'initial' },
    ],
    composition: [
      { label: 'Aportes', key: 'contributed' },
      { label: 'Intereses', key: 'interest' },
    ],
    table: {
      title: 'Proyección mensual',
      columns: [
        { key: 'period', label: 'Mes', type: 'int' },
        { key: 'contribution', label: 'Aporte' },
        { key: 'interest', label: 'Interés' },
        { key: 'balance', label: 'Saldo', strong: true },
      ],
    },
  },
];

export const getMode = (id) => MODES.find((m) => m.id === id) ?? MODES[0];

/** Valores iniciales: textos vacíos y la primera opción en los selects. */
export function emptyValues(mode) {
  return Object.fromEntries(
    mode.fields.map((f) => [f.name, f.kind === 'select' ? f.options[0].value : ''])
  );
}
