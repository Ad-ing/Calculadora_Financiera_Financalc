// ─────────────────────────────────────────────────────────────
// format.js — Presentación de números (texto). Separado de las fórmulas.
// ─────────────────────────────────────────────────────────────

const moneyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 8605.2444 → "RD$ 8,605.24" */
export function money(amount) {
  const value = Math.abs(amount) < 0.005 ? 0 : amount;
  return `RD$ ${moneyFormatter.format(value)}`;
}

/** 80.6996 → "80.7%" */
export function percent(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

/** Número tal cual lo escribió el usuario, sin ceros sobrantes: 14.50 → "14.5" */
export function plain(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(value);
}

/** Aplica un formato por nombre ("money" | "percent" | "int"). */
export function formatValue(value, type = 'money') {
  if (type === 'percent') return percent(value, 2);
  if (type === 'int') return String(value);
  return money(value);
}

/**
 * Da formato mientras el usuario escribe: solo dígitos y un punto,
 * miles con coma y un máximo de decimales.
 * "250000" → "250,000"   |   "14.505" (2 decimales) → "14.50"
 */
export function formatTyping(text, { decimals = 2, thousands = true } = {}) {
  let digits = String(text).replace(/[^\d.]/g, '');
  if (decimals === 0) digits = digits.replace(/\./g, '');

  const [intRaw, ...rest] = digits.split('.');
  const hasDot = digits.includes('.');
  let intPart = intRaw.replace(/^0+(?=\d)/, '');
  if (intPart === '' && hasDot) intPart = '0';
  if (thousands) intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (!hasDot) return intPart;
  return `${intPart}.${rest.join('').slice(0, decimals)}`;
}
