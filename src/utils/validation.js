// ─────────────────────────────────────────────────────────────
// validation.js — Convierte los textos del formulario en números
// y devuelve mensajes de error comprensibles por campo.
// ─────────────────────────────────────────────────────────────
import { parseNumber } from './finance.js';
import { plain } from './format.js';

export function validateField(field, text) {
  if (field.kind === 'select') return '';
  if (text === '' && field.optional) return '';
  if (text === '') return 'Completa este campo.';

  const n = parseNumber(text);
  if (!Number.isFinite(n)) return 'Introduce un número válido.';

  const { min = 0, allowZero = false, max, integer = false } = field.rules ?? {};
  if (allowZero ? n < min : n <= min) {
    return allowZero ? `No puede ser menor que ${min}.` : `Debe ser mayor que ${min}.`;
  }
  if (max !== undefined && n > max) return `El máximo permitido es ${plain(max)}.`;
  if (integer && !Number.isInteger(n)) return 'Usa un número entero.';
  return '';
}

/**
 * Valida todo el formulario de una modalidad.
 * Devuelve { errors, inputs }: errors por campo e inputs ya convertidos a número.
 */
export function validateForm(mode, values) {
  const errors = {};
  const inputs = {};

  for (const field of mode.fields) {
    const text = values[field.name] ?? '';
    const message = validateField(field, text);
    if (message) errors[field.name] = message;

    if (field.kind === 'select') {
      // Los selects numéricos (capitalización) se guardan como número
      const asNumber = Number(text);
      inputs[field.name] = Number.isFinite(asNumber) && text !== '' ? asNumber : text;
    } else {
      inputs[field.name] = text === '' && field.optional ? 0 : parseNumber(text);
    }
  }

  if (Object.keys(errors).length === 0 && mode.crossValidate) {
    Object.assign(errors, mode.crossValidate(inputs));
  }

  return { errors, inputs };
}
