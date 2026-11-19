// As tabelas do README. Calculadas aqui, e em lugar nenhum mais.

import { todas, posicoes, trocasDeDigito, chave, quebraCabecas } from './shidoku.js'
import { porLinhas, quebraCabecasEmTodas, burnside } from './juiz.js'

const guardadas = new Map()
function umaVez (k, fn) {
  if (!guardadas.has(k)) guardadas.set(k, fn())
  return guardadas.get(k)
}

export function grades () {
  return umaVez('grades', () => todas())
}

/** As classes pelas 3.072 transformacoes, com o tamanho de cada uma. */
export function classes () {
  return umaVez('classes', () => {
    const L = grades()
    const pos = posicoes()
    const dig = trocasDeDigito()
    const existe = new Set(L.map(chave))
    let somaFixas = 0
    let fechado = true
    const repDe = new Map()
    for (const g of L) {
      const k0 = chave(g)
      let menor = null
      for (const p of pos) {
        const gp = p(g)
        for (const d of dig) {
          const k = chave(d(gp))
          if (!existe.has(k)) fechado = false
          if (menor === null || k < menor) menor = k
          if (k === k0) somaFixas++
        }
      }
      repDe.set(k0, menor)
    }
    const tamanhos = new Map()
    for (const r of repDe.values()) tamanhos.set(r, (tamanhos.get(r) || 0) + 1)
    const b = burnside(somaFixas, pos.length * dig.length)
    return {
      grades: L.length,
      transformacoes: pos.length * dig.length,
      fechado,
      classes: [...tamanhos].map(([rep, tam]) => ({ representante: [...rep].map(Number), tamanho: tam })).sort((a, b) => a.tamanho - b.tamanho),
      burnside: b.classes,
      burnsideInteiro: b.inteiro
    }
  })
}

/** Os quebra-cabecas bons e minimos, por classe e no total. */
export function quebraCabecasPorClasse () {
  return umaVez('qc', () => {
    const L = grades()
    const total = new Array(17).fill(0)
    const totalMin = new Array(17).fill(0)
    const porClasse = []
    for (const c of classes().classes) {
      const q = quebraCabecas(c.representante, L)
      for (let k = 0; k <= 16; k++) { total[k] += q.bons[k] * c.tamanho; totalMin[k] += q.minimos[k] * c.tamanho }
      porClasse.push({ tamanho: c.tamanho, bons: q.bons, minimos: q.minimos })
    }
    return { total, totalMin, porClasse }
  })
}

/** Os juizes. */
export function juizes () {
  return umaVez('juizes', () => ({
    porLinhas: porLinhas(),
    direto: [3, 4, 5].map((k) => quebraCabecasEmTodas(grades(), k))
  }))
}
