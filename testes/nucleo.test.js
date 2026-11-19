import test from 'node:test'
import assert from 'node:assert/strict'

import {
  GRUPOS, ehShidoku, todas, diferenca, diferencasMinimas, bits, quebraCabecas, posicoes, trocasDeDigito, chave
} from '../src/shidoku.js'

test('12 grupos de 4 casas, e cada casa em exatamente 3 grupos', () => {
  assert.equal(GRUPOS.length, 12)
  const conta = new Array(16).fill(0)
  for (const g of GRUPOS) { assert.equal(g.length, 4); for (const c of g) conta[c]++ }
  assert.ok(conta.every((v) => v === 3))
})

test('a grade classica passa, e trocando duas casas de linha deixa de passar', () => {
  const g = [0, 1, 2, 3, 2, 3, 0, 1, 1, 0, 3, 2, 3, 2, 1, 0]
  assert.equal(ehShidoku(g), true)
  const h = [...g]; [h[0], h[1]] = [h[1], h[0]]
  assert.equal(ehShidoku(h), false)
})

test('288 grades, todas validas e distintas', () => {
  const L = todas()
  assert.equal(L.length, 288)
  assert.ok(L.every(ehShidoku))
  assert.equal(new Set(L.map(chave)).size, 288)
})

test('a diferenca de uma grade para ela mesma e vazia', () => {
  const g = todas()[0]
  assert.equal(diferenca(g, g), 0)
})

test('nenhuma diferenca minima contem outra', () => {
  const L = todas()
  const ms = diferencasMinimas(L[0], L)
  for (let i = 0; i < ms.length; i++) for (let j = 0; j < ms.length; j++) if (i !== j) assert.notEqual(ms[i] & ms[j], ms[i])
})

test('duas grades diferem em pelo menos 4 casas', () => {
  const L = todas()
  let menor = 16
  for (const d of diferencasMinimas(L[0], L)) menor = Math.min(menor, bits(d))
  assert.equal(menor, 4)
})

test('a grade inteira revelada e sempre boa; nada revelado nunca e', () => {
  const L = todas()
  const q = quebraCabecas(L[0], L)
  assert.equal(q.bons[16], 1)
  assert.equal(q.bons[0], 0)
})

test('as 3.072 transformacoes levam shidoku em shidoku', () => {
  const L = todas()
  const pos = posicoes()
  const dig = trocasDeDigito()
  assert.equal(pos.length, 128)
  assert.equal(dig.length, 24)
  for (const p of pos) for (const d of dig) assert.equal(ehShidoku(d(p(L[5]))), true)
})
