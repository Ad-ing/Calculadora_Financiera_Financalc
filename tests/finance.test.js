// Pruebas de las fórmulas: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcLoan, calcSimple, calcCompound, calcSavings } from '../src/utils/finance.js';
import { money, formatTyping } from '../src/utils/format.js';
import { validateForm } from '../src/utils/validation.js';
import { getMode } from '../src/utils/calculators.js';

const round2 = (n) => Math.round(n * 100) / 100;

test('Préstamo: RD$250,000 · 36 meses · 14.5% anual', () => {
  const r = calcLoan({ amount: 250000, months: 36, rate: 14.5, rateType: 'anual' });
  assert.equal(money(r.payment), 'RD$ 8,605.24');
  assert.equal(money(r.total), 'RD$ 309,788.80');
  assert.equal(money(r.interest), 'RD$ 59,788.80');
  assert.equal(money(r.schedule[0].interest), 'RD$ 3,020.83');
  assert.equal(money(r.schedule[0].balance), 'RD$ 244,415.59');
  assert.equal(r.schedule.at(-1).balance, 0);
});

test('Préstamo con tasa 0: 1,200 en 12 meses → cuota 100 (guía)', () => {
  assert.equal(calcLoan({ amount: 1200, months: 12, rate: 0, rateType: 'anual' }).payment, 100);
});

test('Interés simple: 50,000 · 18 meses · 9% anual', () => {
  const r = calcSimple({ capital: 50000, months: 18, rate: 9, rateType: 'anual' });
  assert.equal(round2(r.interest), 6750);
  assert.equal(round2(r.total), 56750);
});

test('Interés simple (guía): 1,000 · 24 meses · 12% → interés 240', () => {
  const r = calcSimple({ capital: 1000, months: 24, rate: 12, rateType: 'anual' });
  assert.equal(round2(r.interest), 240);
  assert.equal(round2(r.total), 1240);
});

test('Interés compuesto: 100,000 · 5 años · 8% · mensual', () => {
  const r = calcCompound({ capital: 100000, years: 5, frequency: 12, rate: 8 });
  assert.equal(money(r.total), 'RD$ 148,984.57');
  assert.equal(money(r.interest), 'RD$ 48,984.57');
  assert.equal(r.schedule.length, 60);
});

test('Interés compuesto con tasa 0 (guía) → total igual al capital', () => {
  assert.equal(calcCompound({ capital: 1000, years: 2, frequency: 12, rate: 0 }).total, 1000);
});

test('Compuesto diario se agrupa por año en la tabla', () => {
  const r = calcCompound({ capital: 1000, years: 3, frequency: 365, rate: 5 });
  assert.equal(r.schedule.length, 3);
  assert.equal(r.periodLabel, 'Año');
});

test('Ahorro: 10,000 inicial + 3,000/mes · 3 años · 6%', () => {
  const r = calcSavings({ initial: 10000, monthly: 3000, years: 3, rate: 6 });
  assert.equal(money(r.balance), 'RD$ 129,975.12');
  assert.equal(money(r.contributed), 'RD$ 118,000.00');
  assert.equal(money(r.interest), 'RD$ 11,975.12');
});

test('Validación: capital negativo muestra error (guía)', () => {
  const { errors } = validateForm(getMode('simple'), { capital: '-100', months: '24', rateType: 'anual', rate: '12' });
  assert.ok(errors.capital);
});

test('Validación: campos vacíos y meses decimales', () => {
  const { errors } = validateForm(getMode('loan'), { amount: '', months: '12.5', rateType: 'anual', rate: '10' });
  assert.equal(errors.amount, 'Completa este campo.');
  assert.equal(errors.months, 'Usa un número entero.');
});

test('Validación: ahorro sin depósito ni aporte', () => {
  const { errors } = validateForm(getMode('savings'), { initial: '0', monthly: '', years: '2', rate: '5' });
  assert.ok(errors.monthly);
});

test('Formato al escribir', () => {
  assert.equal(formatTyping('250000'), '250,000');
  assert.equal(formatTyping('1234.567'), '1,234.56');
  assert.equal(formatTyping('0036', { decimals: 0, thousands: false }), '36');
  assert.equal(formatTyping('abc'), '');
});
