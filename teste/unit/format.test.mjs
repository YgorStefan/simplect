import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeHtml,
  formatDate,
  truncate,
  onlyDigits,
  maskCPF,
  maskCNPJ,
  maskCEP,
} from '../../scripts/shared/format.js';

test('escapeHtml escapa caracteres sensíveis a HTML', () => {
  assert.equal(
    escapeHtml('<script>alert("x")</script>'),
    '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
  );
});

test('escapeHtml não altera texto simples', () => {
  assert.equal(escapeHtml('Ana Lima'), 'Ana Lima');
});

test('formatDate converte ISO para formato pt-BR', () => {
  const iso = '2024-01-15T10:00:00Z';
  assert.equal(formatDate(iso), new Date(iso).toLocaleDateString('pt-BR'));
});

test('truncate mantém strings curtas inalteradas', () => {
  assert.equal(truncate('curto', 80), 'curto');
});

test('truncate corta strings longas e adiciona reticências', () => {
  const long = 'a'.repeat(100);
  const result = truncate(long, 80);
  assert.equal(result.length, 81);
  assert.ok(result.endsWith('…'));
});

test('onlyDigits remove caracteres não numéricos', () => {
  assert.equal(onlyDigits('111.222.333-44'), '11122233344');
});

test('maskCPF formata 11 dígitos como CPF completo', () => {
  assert.equal(maskCPF('11122233344'), '111.222.333-44');
});

test('maskCPF formata entrada parcial progressivamente', () => {
  assert.equal(maskCPF('111'), '111');
  assert.equal(maskCPF('1112223'), '111.222.3');
});

test('maskCNPJ formata 14 dígitos como CNPJ completo', () => {
  assert.equal(maskCNPJ('12345678000190'), '12.345.678/0001-90');
});

test('maskCEP formata 8 dígitos como CEP', () => {
  assert.equal(maskCEP('01310100'), '01310-100');
});

test('maskCEP mantém entrada curta inalterada', () => {
  assert.equal(maskCEP('01310'), '01310');
});
