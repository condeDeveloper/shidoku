#!/usr/bin/env node
// Exemplo de uso da biblioteca pela porta de entrada do pacote.
//
//   node exemplos/uso.js
//
// Mostra as duas classes de shidoku e quantos quebra-cabecas minimos cada uma tem.

import { classes, quebraCabecasPorClasse } from '../src/index.js'

const c = classes()
const q = quebraCabecasPorClasse()
c.classes.forEach((cl, i) => {
  console.log(`classe de ${cl.tamanho} grades; uma delas:`)
  for (let r = 0; r < 4; r++) console.log('  ' + cl.representante.slice(4 * r, 4 * r + 4).map((v) => v + 1).join(' '))
  const m = q.porClasse[i].minimos
  console.log('  quebra-cabecas minimos por grade: ' + m.map((x, k) => (x ? `${k} dicas: ${x}` : '')).filter(Boolean).join(', '))
})
