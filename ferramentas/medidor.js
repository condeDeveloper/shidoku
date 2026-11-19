#!/usr/bin/env node
// O medidor. Roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js                 todas
//   node ferramentas/medidor.js classes         as grades e as classes
//   node ferramentas/medidor.js quebracabecas   bons e minimos por numero de dicas
//   node ferramentas/medidor.js juizes          por linhas e grade a grade

import { classes, quebraCabecasPorClasse, juizes } from '../src/medidas.js'

const n = (x) => x.toLocaleString('pt-BR')
const pad = (s, w) => String(s).padStart(w)
const C = (a, b) => { let r = 1; for (let i = 0; i < b; i++) r = r * (a - i) / (i + 1); return Math.round(r) }

function tClasses () {
  const c = classes()
  console.log(`\n== ${c.grades} grades, ${n(c.transformacoes)} transformacoes ==`)
  console.log(`   toda transformacao leva shidoku em shidoku: ${c.fechado}`)
  console.log(`   classes: ${c.classes.length}, de ${c.classes.map((x) => x.tamanho).join(' e ')} grades   Burnside: ${c.burnside}`)
}

function tQuebra () {
  const q = quebraCabecasPorClasse()
  console.log('\n== quebra-cabecas de solucao unica, somados sobre as 288 grades ==')
  for (let k = 0; k <= 16; k++) {
    if (q.total[k] === 0 && k < 4) continue
    const possiveis = 288 * C(16, k)
    console.log(`   ${pad(k, 2)} dicas   bons ${pad(n(q.total[k]), 10)} de ${pad(n(possiveis), 10)} (${pad((q.total[k] / possiveis * 100).toFixed(2), 6)}%)   minimos ${pad(n(q.totalMin[k]), 7)}`)
  }
  console.log('\n   por grade, em cada classe:')
  for (const c of q.porClasse) {
    console.log(`   classe de ${c.tamanho}: minimos ${c.minimos.map((x, k) => (x ? `${k} dicas: ${x}` : '')).filter(Boolean).join('   ')}`)
  }
}

function tJuizes () {
  const j = juizes()
  console.log(`\n== por linhas: ${n(j.porLinhas.testadas)} combinacoes, ${j.porLinhas.achadas} shidokus ==`)
  console.log('== grade a grade, sem o atalho das classes ==')
  for (const d of j.direto) console.log(`   ${d.k} dicas: ${n(d.total)} bons`)
}

const partes = { classes: tClasses, quebracabecas: tQuebra, juizes: tJuizes }
const pedido = process.argv[2]
if (!pedido) for (const f of Object.values(partes)) f()
else if (partes[pedido]) partes[pedido]()
else { console.error(`nao conheco "${pedido}". conheco: ${Object.keys(partes).join(', ')}`); process.exit(1) }
