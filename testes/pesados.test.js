// O mais caro do projeto: o juiz grade a grade nas faixas maiores de dicas.

import test from 'node:test'
import assert from 'node:assert/strict'

import { todas } from '../src/shidoku.js'
import { quebraCabecasEmTodas } from '../src/juiz.js'

test('grade a grade, sem o atalho: 5, 6 e 8 dicas', { timeout: 600000 }, () => {
  const L = todas()
  assert.equal(quebraCabecasEmTodas(L, 5).total, 284160)
  assert.equal(quebraCabecasEmTodas(L, 6).total, 1041408)
  assert.equal(quebraCabecasEmTodas(L, 8).total, 2961024)
})

test('grade a grade: 12 dicas, 1.536 ambiguos', { timeout: 600000 }, () => {
  const L = todas()
  const r = quebraCabecasEmTodas(L, 12)
  assert.equal(r.subconjuntos, 524160)
  assert.equal(r.total, 522624)
  assert.equal(r.subconjuntos - r.total, 1536)
})
