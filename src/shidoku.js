// Shidoku: o sudoku 4x4.
//
// Uma grade 4x4 com os digitos 0..3 e um SHIDOKU quando cada linha, cada coluna
// e cada um dos quatro blocos 2x2 tem os quatro digitos. A casa (i, j) fica na
// posicao 4*i + j, e a grade e um vetor de 16.
//
// Um QUEBRA-CABECA e uma grade com so algumas casas reveladas (as DICAS). Ele e
// BOM quando so uma grade combina com as dicas. Ele e MINIMO quando e bom e
// tirar qualquer dica deixa de ser bom.

export const CASAS = 16

/** Os 12 grupos (4 linhas, 4 colunas, 4 blocos), cada um com 4 casas. */
export const GRUPOS = (() => {
  const g = []
  for (let i = 0; i < 4; i++) g.push([0, 1, 2, 3].map((j) => 4 * i + j))
  for (let j = 0; j < 4; j++) g.push([0, 1, 2, 3].map((i) => 4 * i + j))
  for (const bi of [0, 2]) for (const bj of [0, 2]) g.push([0, 1].flatMap((di) => [0, 1].map((dj) => 4 * (bi + di) + bj + dj)))
  return g
})()

/** A grade e shidoku? A definicao, grupo por grupo. */
export function ehShidoku (g) {
  for (const grupo of GRUPOS) {
    const vistos = new Set(grupo.map((c) => g[c]))
    if (vistos.size !== 4) return false
  }
  return true
}

/** Todas as grades, por busca casa a casa. Cada grade entregue e uma COPIA. */
export function todas () {
  const g = new Array(CASAS).fill(-1)
  const saida = []
  const pode = (c, v) => {
    for (const grupo of GRUPOS) if (grupo.includes(c)) for (const o of grupo) if (o !== c && g[o] === v) return false
    return true
  }
  const anda = (c) => {
    if (c === CASAS) { saida.push([...g]); return }
    for (let v = 0; v < 4; v++) {
      if (!pode(c, v)) continue
      g[c] = v
      anda(c + 1)
      g[c] = -1
    }
  }
  anda(0)
  return saida
}

/** A mascara de casas em que duas grades diferem. */
export function diferenca (a, b) {
  let m = 0
  for (let c = 0; c < CASAS; c++) if (a[c] !== b[c]) m |= 1 << c
  return m
}

export function bits (m) {
  let c = 0
  while (m) { m &= m - 1; c++ }
  return c
}

/**
 * As diferencas MINIMAS de uma grade para todas as outras: um conjunto de
 * dicas e bom exatamente quando toca cada diferenca, e basta conferir as que
 * nao contem outra.
 */
export function diferencasMinimas (g, lista) {
  const difs = []
  for (const h of lista) { const d = diferenca(g, h); if (d) difs.push(d) }
  difs.sort((x, y) => bits(x) - bits(y))
  const minimas = []
  for (const d of difs) if (!minimas.some((m) => (m & d) === m)) minimas.push(d)
  return minimas
}

/**
 * Para uma grade, quantos conjuntos de k dicas sao bons e quantos sao minimos,
 * para k de 0 a 16. Varre os 65.536 subconjuntos das casas.
 */
export function quebraCabecas (g, lista) {
  const minimas = diferencasMinimas(g, lista)
  const bom = new Uint8Array(1 << CASAS)
  for (let S = 0; S < (1 << CASAS); S++) {
    let ok = true
    for (const m of minimas) if ((m & S) === 0) { ok = false; break }
    bom[S] = ok ? 1 : 0
  }
  const bons = new Array(CASAS + 1).fill(0)
  const minimos = new Array(CASAS + 1).fill(0)
  for (let S = 0; S < (1 << CASAS); S++) {
    if (!bom[S]) continue
    const k = bits(S)
    bons[k]++
    let minimo = true
    let s = S
    while (s) {
      const b = s & -s
      if (bom[S ^ b]) { minimo = false; break }
      s ^= b
    }
    if (minimo) minimos[k]++
  }
  return { bons, minimos, diferencas: minimas.length }
}

// ---------------------------------------------------------------------------
// As transformacoes que levam shidoku em shidoku.
// ---------------------------------------------------------------------------

/** Permutacoes das linhas que respeitam os blocos: troca dentro das faixas e troca as faixas. */
function permutacoesDeFaixa () {
  const saida = []
  for (const trocaFaixa of [false, true]) {
    for (const t0 of [false, true]) {
      for (const t1 of [false, true]) {
        let f0 = t0 ? [1, 0] : [0, 1]
        let f1 = t1 ? [3, 2] : [2, 3]
        saida.push(trocaFaixa ? [...f1, ...f0] : [...f0, ...f1])
      }
    }
  }
  return saida
}

/** As 128 transformacoes de posicao (linhas x colunas x transpor). */
export function posicoes () {
  const ps = permutacoesDeFaixa()
  const saida = []
  for (const pl of ps) {
    for (const pc of ps) {
      for (const transpor of [false, true]) {
        saida.push((g) => {
          const n = new Array(CASAS)
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
              const [ii, jj] = transpor ? [j, i] : [i, j]
              n[4 * i + j] = g[4 * pl[ii] + pc[jj]]
            }
          }
          return n
        })
      }
    }
  }
  return saida
}

/** As 24 trocas de digito. */
export function trocasDeDigito () {
  const saida = []
  const perm = (arr, k = 0) => {
    if (k === arr.length) { saida.push([...arr]); return }
    for (let i = k; i < arr.length; i++) {
      [arr[k], arr[i]] = [arr[i], arr[k]]
      perm(arr, k + 1);
      [arr[k], arr[i]] = [arr[i], arr[k]]
    }
  }
  perm([0, 1, 2, 3])
  return saida.map((p) => (g) => g.map((v) => p[v]))
}

export function chave (g) { return g.join('') }
