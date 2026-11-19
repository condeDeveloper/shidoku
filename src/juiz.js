// O juiz. Caminhos que nao passam pela busca casa a casa nem pelas classes.
//
// 1. `porLinhas` — cada linha de um shidoku e uma das 24 permutacoes de 0..3.
//    Varre as 24^4 = 331.776 combinacoes de quatro linhas e confere colunas e
//    blocos. Nao usa a busca casa a casa.
//
// 2. `quebraCabecasEmTodas` — conta os quebra-cabecas bons de k dicas fazendo a
//    conta em CADA uma das 288 grades, sem usar o atalho de pegar um
//    representante por classe e multiplicar. Se o atalho estivesse errado (uma
//    transformacao que nao preserva quebra-cabeca bom, por exemplo), os dois
//    numeros discordariam.
//
// 3. `burnside` — o numero de classes e a media, sobre as 3.072 transformacoes,
//    de quantas grades cada uma deixa parada.

import { ehShidoku, diferencasMinimas, bits, CASAS } from './shidoku.js'

export function porLinhas () {
  const perms = []
  const p = (arr, k = 0) => {
    if (k === arr.length) { perms.push([...arr]); return }
    for (let i = k; i < arr.length; i++) {
      [arr[k], arr[i]] = [arr[i], arr[k]]
      p(arr, k + 1);
      [arr[k], arr[i]] = [arr[i], arr[k]]
    }
  }
  p([0, 1, 2, 3])
  let achadas = 0
  let testadas = 0
  for (const a of perms) for (const b of perms) for (const c of perms) for (const d of perms) {
    testadas++
    if (ehShidoku([...a, ...b, ...c, ...d])) achadas++
  }
  return { testadas, achadas }
}

/** Os quebra-cabecas bons de exatamente k dicas, somados sobre todas as grades. */
export function quebraCabecasEmTodas (lista, k) {
  const subconjuntos = []
  for (let S = 0; S < (1 << CASAS); S++) if (bits(S) === k) subconjuntos.push(S)
  let total = 0
  for (const g of lista) {
    const minimas = diferencasMinimas(g, lista)
    for (const S of subconjuntos) {
      let ok = true
      for (const m of minimas) if ((m & S) === 0) { ok = false; break }
      if (ok) total++
    }
  }
  return { k, total, subconjuntos: subconjuntos.length * lista.length }
}

export function burnside (somaFixas, tamanhoDoGrupo) {
  return { classes: somaFixas / tamanhoDoGrupo, inteiro: somaFixas % tamanhoDoGrupo === 0 }
}
