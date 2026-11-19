// Os numeros do README, presos.

import test from 'node:test'
import assert from 'node:assert/strict'

import { classes, quebraCabecasPorClasse, juizes } from '../src/medidas.js'

test('2 classes, de 96 e 192 grades, e Burnside confirma', () => {
  const c = classes()
  assert.equal(c.fechado, true)
  assert.deepEqual(c.classes.map((x) => x.tamanho), [96, 192])
  assert.equal(c.burnside, 2)
})

test('bons e minimos por numero de dicas, sobre as 288 grades', () => {
  const q = quebraCabecasPorClasse()
  assert.deepEqual(q.total, [0, 0, 0, 0, 25728, 284160, 1041408, 2141184, 2961024, 2958336, 2204928, 1239552, 522624, 161280, 34560, 4608, 288])
  assert.deepEqual(q.totalMin.slice(4, 8), [25728, 58368, 1536, 0])
})

test('as classes sao muito diferentes por dentro: 12 contra 128 minimos de 4 dicas', () => {
  const [a, b] = quebraCabecasPorClasse().porClasse
  assert.equal(a.tamanho, 96)
  assert.equal(a.minimos[4], 12)
  assert.equal(b.tamanho, 192)
  assert.equal(b.minimos[4], 128)
})

test('o minimo de 6 dicas so existe na classe de 96', () => {
  const [a, b] = quebraCabecasPorClasse().porClasse
  assert.equal(a.minimos[6], 16)
  assert.equal(b.minimos[6], 0)
  for (let k = 7; k <= 16; k++) { assert.equal(a.minimos[k], 0); assert.equal(b.minimos[k], 0) }
})

test('com 12 casas reveladas ainda ha 1.536 ambiguos; com 13, nenhum', () => {
  const q = quebraCabecasPorClasse()
  assert.equal(288 * 1820 - q.total[12], 1536)
  assert.equal(q.total[13], 288 * 560)
})

test('o juiz grade a grade concorda com o atalho das classes', () => {
  const j = juizes()
  const q = quebraCabecasPorClasse()
  for (const d of j.direto) assert.equal(d.total, q.total[d.k], `${d.k} dicas`)
  assert.equal(j.porLinhas.achadas, 288)
})
