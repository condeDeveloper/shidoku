import test from 'node:test'
import assert from 'node:assert/strict'

import { todas } from '../src/shidoku.js'
import { porLinhas, quebraCabecasEmTodas, burnside } from '../src/juiz.js'

test('por permutacoes de linha: 288 em 331.776 combinacoes', () => {
  const r = porLinhas()
  assert.equal(r.testadas, 331776)
  assert.equal(r.achadas, 288)
})

test('grade a grade: nenhum quebra-cabeca de 3 dicas e bom; 25.728 de 4 sao', () => {
  const L = todas()
  assert.equal(quebraCabecasEmTodas(L, 3).total, 0)
  assert.equal(quebraCabecasEmTodas(L, 4).total, 25728)
})

test('Burnside reprova uma soma que nao divide', () => {
  assert.equal(burnside(6144, 3072).classes, 2)
  assert.equal(burnside(6145, 3072).inteiro, false)
})
