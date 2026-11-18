type Token = [kind: 'kw' | 'fn' | 'str' | 'num' | 'dim' | 'txt', text: string]

/* Hand-tokenised: a highlighter library for nine lines is not worth its weight. */
export const CODE: Token[][] = [
  [['kw', '#include '], ['str', '<stdio.h>']],
  [],
  [['kw', 'int '], ['fn', 'soma'], ['txt', '('], ['kw', 'int '], ['txt', 'a, '], ['kw', 'int '], ['txt', 'b) {']],
  [['kw', '    return '], ['txt', 'a + b;']],
  [['txt', '}']],
  [],
  [['kw', 'int '], ['fn', 'main'], ['txt', '('], ['kw', 'void'], ['txt', ') {']],
  [['kw', '    int '], ['txt', 'casos, a, b;']],
  [['txt', '    '], ['fn', 'scanf'], ['txt', '('], ['str', '"%d"'], ['txt', ', &casos);']],
  [['kw', '    while '], ['txt', '(casos--) {']],
  [['txt', '        '], ['fn', 'scanf'], ['txt', '('], ['str', '"%d %d"'], ['txt', ', &a, &b);']],
  [['txt', '        '], ['fn', 'printf'], ['txt', '('], ['str', '"%d\\n"'], ['txt', ', '], ['fn', 'soma'], ['txt', '(a, b));']],
  [['txt', '    }']],
  [['kw', '    return '], ['num', '0'], ['txt', ';']],
  [['txt', '}']],
]

export const TOKEN_CLASS: Record<Token[0], string> = {
  kw: 'text-(--code-keyword)',
  fn: 'text-(--code-fn)',
  str: 'text-(--code-string)',
  num: 'text-(--code-number)',
  dim: 'text-(--code-dim)',
  txt: 'text-(--code-fg)',
}

export const CASES = [
  { input: '2 3', ms: 1 },
  { input: '-7 7', ms: 1 },
  { input: '0 0', ms: 1 },
  { input: '1000000 1', ms: 2 },
  { input: '-4 -9', ms: 1 },
]

export const TOTAL_MS = CASES.reduce((sum, testCase) => sum + testCase.ms, 0)

export const HEADLINES = [
  'Errou? Veja onde e tente de novo.',
  'Envie seu código e veja o resultado.',
  'Descubra na hora se sua solução funciona.',
  'Quase nunca sai perfeito de primeira.',
  'Hora de colocar sua solução à prova.',
  'Seu código passa no teste?'
]

export const STEP_MS = 520

/* Pause on the verdict before the run starts over. */
export const HOLD_STEPS = 9
