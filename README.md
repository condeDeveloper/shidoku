# Shidoku

O sudoku 4×4 varrido inteiro — todas as grades, todas as classes de simetria e todo quebra-cabeça possível —, em Node puro, sem dependência nenhuma.

Uma grade 4×4 com os dígitos 1 a 4 é um **shidoku** quando cada linha, cada coluna e cada um dos quatro blocos 2×2 tem os quatro dígitos. Um **quebra-cabeça** é uma grade com só algumas casas reveladas; ele é **bom** quando uma grade só combina com as dicas, e **mínimo** quando é bom e tirar qualquer dica estraga.

É pequeno o bastante para não precisar escolher amostra: são 288 grades e 65.536 jeitos de escolher quais casas revelar em cada uma.

---

## Os quatro achados

**1. As 288 grades são só 2, a menos de simetria — e muito diferentes por dentro.** As 3.072 transformações (trocar os dígitos, permutar linhas e colunas respeitando os blocos, transpor) juntam as grades em uma classe de **96** e outra de **192**. Nas duas o mínimo é 4 dicas. Mas numa grade da classe de 96 existem **12** quebra-cabeças mínimos de 4 dicas; numa da classe de 192, **128**.

**2. O maior quebra-cabeça mínimo tem 6 dicas, e só existe numa das classes.** Na classe de 96, cada grade tem 16 quebra-cabeças mínimos de 6 dicas. Na de 192, **nenhum** — o maior mínimo dela tem 5.

```
classe de 96          classe de 192
1 2 3 4               1 2 3 4
3 4 1 2               3 4 1 2
2 1 4 3               2 3 4 1
4 3 2 1               4 1 2 3
```

**3. Com 12 das 16 casas reveladas ainda há 1.536 quebra-cabeças ambíguos.** São 524.160 jeitos de revelar 12 casas, somando as 288 grades, e 1.536 deles deixam duas soluções. A partir de **13** casas reveladas, todos têm solução única.

**4. Com 4 dicas, só 4,91% dos quebra-cabeças são bons.** A fração de bons sobe com as dicas: 4,91% com 4, 22,59% com 5, 45,15% com 6, 79,89% com 8, 99,71% com 12.

---

## As tabelas

Todos os números saem de `node ferramentas/medidor.js` e estão presos em `testes/`.

### Quebra-cabeças de solução única, somados sobre as 288 grades

| dicas | bons | possíveis | % | mínimos |
| --- | --- | --- | --- | --- |
| 3 | 0 | 161.280 | 0,00 | 0 |
| 4 | 25.728 | 524.160 | 4,91 | 25.728 |
| 5 | 284.160 | 1.257.984 | 22,59 | 58.368 |
| 6 | 1.041.408 | 2.306.304 | 45,15 | **1.536** |
| 7 | 2.141.184 | 3.294.720 | 64,99 | 0 |
| 8 | 2.961.024 | 3.706.560 | 79,89 | 0 |
| 10 | 2.204.928 | 2.306.304 | 95,60 | 0 |
| 12 | 522.624 | 524.160 | 99,71 | 0 |
| 13 | 161.280 | 161.280 | **100,00** | 0 |

Todo quebra-cabeça de 4 dicas que é bom já é mínimo — com 3 não existe bom nenhum.

### Por grade, em cada classe

| classe | mínimos de 4 dicas | de 5 | de 6 |
| --- | --- | --- | --- |
| 96 grades | 12 | 256 | 16 |
| 192 grades | 128 | 176 | 0 |

---

## Como a conta é feita

Um conjunto de casas reveladas é bom exatamente quando ele toca o conjunto de casas em que a grade difere de **cada** uma das outras 287. Basta conferir as diferenças mínimas (as que não contêm outra). Varro os 65.536 subconjuntos de casas de uma grade, marco os bons, e um bom é mínimo quando nenhum dos seus subconjuntos com uma casa a menos é bom.

Como as transformações levam quebra-cabeça bom em quebra-cabeça bom, basta fazer a conta num representante de cada classe e multiplicar pelo tamanho dela.

---

## Os juízes

**Por permutações de linha.** Cada linha de um shidoku é uma das 24 permutações de 1 a 4. As 331.776 combinações de quatro linhas, conferidas em colunas e blocos, dão as mesmas 288 grades — sem a busca casa a casa.

**Grade a grade, sem o atalho.** O atalho de usar um representante por classe só vale se as transformações preservam quebra-cabeça bom. O juiz refaz a conta em cada uma das 288 grades, para 3, 4, 5, 6, 8 e 12 dicas, e chega nos mesmos números.

**Burnside**: a média, sobre as 3.072 transformações, de quantas grades cada uma deixa parada dá 2 — e o teste exige que uma soma que não divide seja reprovada.

---

## O que as medidas me corrigiram

Nada quebrou neste projeto: a busca, as permutações de linha, o atalho das classes, a conta grade a grade e Burnside concordaram de primeira, e não vou inventar um erro para preencher a seção.

O que eu não esperava foi a diferença entre as duas classes. Eu sabia que o mínimo era 4 dicas e imaginava as duas classes parecidas a partir daí. São 12 contra 128 quebra-cabeças mínimos de 4 dicas por grade, e o mínimo de 6 dicas existe numa e não existe na outra.

---

## Como usar

Node 20 ou mais novo. Sem dependência.

```bash
npm test
npm run medir
node exemplos/uso.js
```

```js
import { todas, quebraCabecas } from 'shidoku'

const L = todas()                 // as 288 grades
quebraCabecas(L[0], L).minimos    // quantos minimos de cada tamanho
```

## Os arquivos

- `src/shidoku.js` — as regras, as grades, os quebra-cabeças e as 3.072 transformações.
- `src/juiz.js` — por permutações de linha, grade a grade, e Burnside.
- `src/medidas.js` — as tabelas do README, cada uma calculada uma vez só.
- `src/index.js` — a porta de entrada do pacote.
- `exemplos/uso.js` — o pacote em uso.
- `ferramentas/medidor.js` — imprime as tabelas.
- `testes/` — 19 testes, com os números do README presos.

## Licença

MIT.
