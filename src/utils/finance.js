// ─────────────────────────────────────────────────────────────
// finance.js — Fórmulas financieras puras.
// No importa React: recibe números y devuelve números/objetos.
// Así se pueden probar por separado y reutilizar en cualquier vista.
// ─────────────────────────────────────────────────────────────

/** Convierte un texto con separadores ("250,000.50") en número. Vacío → NaN. */
export function parseNumber(text) {
  if (text === undefined || text === null) return NaN;
  const clean = String(text).replace(/,/g, '').trim();
  if (clean === '' || clean === '.') return NaN;
  return Number(clean);
}

/** Evita mostrar "-0.00" o residuos como 0.0000000001 en los saldos. */
const clean = (n) => (Math.abs(n) < 1e-7 ? 0 : n);

/** Tasa mensual en decimal a partir de un porcentaje anual o mensual. */
export function toMonthlyRate(rate, rateType = 'anual') {
  return rateType === 'mensual' ? rate / 100 : rate / 100 / 12;
}

/**
 * Préstamo con cuota fija (sistema francés).
 * Cuota = P · i / (1 − (1 + i)^−n). Si i = 0 → P / n.
 */
export function calcLoan({ amount, months, rate, rateType }) {
  const i = toMonthlyRate(rate, rateType);
  const payment = i === 0 ? amount / months : (amount * i) / (1 - Math.pow(1 + i, -months));

  const schedule = [];
  let balance = amount;
  for (let period = 1; period <= months; period++) {
    const interest = balance * i;
    const principal = payment - interest;
    balance = clean(balance - principal);
    schedule.push({ period, payment, interest, principal, balance });
  }

  const total = payment * months;
  return { amount, payment, total, interest: total - amount, capital: amount, schedule };
}

/**
 * Interés simple: I = C · i · n (i = tasa mensual, n = meses).
 * El interés se calcula siempre sobre el capital inicial.
 */
export function calcSimple({ capital, months, rate, rateType }) {
  const i = toMonthlyRate(rate, rateType);
  const monthlyInterest = capital * i;

  const schedule = [];
  let accumulated = 0;
  for (let period = 1; period <= months; period++) {
    accumulated += monthlyInterest;
    schedule.push({ period, interest: monthlyInterest, accumulated, balance: capital + accumulated });
  }

  const interest = monthlyInterest * months;
  return { capital, interest, total: capital + interest, monthlyInterest, schedule };
}

/**
 * Interés compuesto: M = C · (1 + r/m)^(m·t)
 * m = capitalizaciones por año (12 mensual, 4 trimestral…), t = años.
 */
export function calcCompound({ capital, years, frequency, rate }) {
  const m = frequency;
  const i = rate / 100 / m;
  const periods = Math.max(1, Math.round(years * m));
  const total = capital * Math.pow(1 + i, periods);
  const effectiveRate = (Math.pow(1 + i, m) - 1) * 100;

  // Si hay más de 12 capitalizaciones al año (diaria), la tabla se agrupa por año.
  const step = m <= 12 ? 1 : m;
  const schedule = [];
  let balance = capital;
  for (let start = 0, row = 1; start < periods; start += step, row++) {
    const opening = balance;
    const count = Math.min(step, periods - start);
    balance = opening * Math.pow(1 + i, count);
    schedule.push({ period: row, opening, interest: balance - opening, balance });
  }

  return {
    capital,
    total,
    interest: total - capital,
    effectiveRate,
    periods,
    periodLabel: step === 1 ? 'Periodo' : 'Año',
    schedule,
  };
}

/**
 * Proyección de ahorro: depósito inicial + aportes al final de cada mes,
 * con capitalización mensual.
 * Saldo = D·(1+i)^n + A·[((1+i)^n − 1) / i]
 */
export function calcSavings({ initial, monthly, years, rate }) {
  const i = rate / 100 / 12;
  const months = Math.max(1, Math.round(years * 12));

  const schedule = [];
  let balance = initial;
  for (let period = 1; period <= months; period++) {
    const interest = balance * i;
    balance += interest + monthly;
    schedule.push({ period, contribution: monthly, interest, balance });
  }

  const contributed = initial + monthly * months;
  return {
    initial,
    monthly,
    months,
    balance,
    contributed,
    interest: balance - contributed,
    schedule,
  };
}
