/*
  Reads the function signatures out of C source and compares the harness
  with the draft. A light scanner, not a compiler: it understands top-level
  prototypes and definitions, which is all the check needs. Anything it
  cannot read is left out rather than guessed at.

  The convention the check enforces: the harness declares, as prototypes,
  the functions the student writes, and the draft defines them with the
  same return type and parameter types.
*/

export type CFunction = {
  name: string
  returnType: string
  /** Parameter types only, normalised; names dropped. */
  params: string[]
  /** The declaration as written, parameter names kept, without storage keywords. No trailing `;` or body. */
  text: string
  kind: 'definition' | 'prototype'
  /** 1-based line of the name in the source it came from. */
  line: number
}

const TYPE_WORDS = new Set([
  'void', 'char', 'short', 'int', 'long', 'float', 'double', 'signed', 'unsigned', 'const', 'volatile', '_Bool',
])

const TAG_WORDS = new Set(['struct', 'union', 'enum'])

const DROPPED_QUALIFIERS = new Set(['static', 'extern', 'inline', 'register', '__inline__'])

/** Comments, strings, chars and preprocessor lines blanked out; every newline kept so lines still match. */
function blank(source: string): string {
  let out = ''
  let i = 0
  let lineStart = true
  while (i < source.length) {
    const char = source[i]
    const next = source[i + 1]
    if (char === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') i++
    } else if (char === '/' && next === '*') {
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
        if (source[i] === '\n') out += '\n'
        i++
      }
      i += 2
      out += ' '
    } else if (char === '"' || char === "'") {
      i++
      while (i < source.length && source[i] !== char && source[i] !== '\n') i += source[i] === '\\' ? 2 : 1
      i++
      out += '0'
    } else if (char === '#' && lineStart) {
      // Preprocessor line, with its backslash continuations.
      while (i < source.length && source[i] !== '\n') {
        if (source[i] === '\\' && source[i + 1] === '\n') {
          out += '\n'
          i++
        }
        i++
      }
    } else {
      out += char
      i++
    }
    const last = out[out.length - 1]
    if (last === '\n') lineStart = true
    else if (last && !/\s/.test(last)) lineStart = false
  }
  return out
}

function normaliseType(raw: string): string {
  const words = raw
    .replace(/\*/g, ' * ')
    .replace(/\[[^\]]*\]/g, ' * ')
    .split(/\s+/)
    .filter((word) => word && !DROPPED_QUALIFIERS.has(word))
  const stars = words.filter((word) => word === '*').length
  let base = words.filter((word) => word !== '*')

  // `unsigned` is `unsigned int`, `long int` is `long`, and so on.
  const hasInteger = base.includes('int')
  const sized = base.some((word) => word === 'short' || word === 'long')
  if (hasInteger && sized) base = base.filter((word) => word !== 'int')
  if (base.includes('unsigned') && !base.some((word) => ['char', 'short', 'long', 'int'].includes(word))) base.push('int')
  // `signed int` is `int`; a lone `signed` too.
  base = base.filter((word) => word !== 'signed')
  if (!base.length && raw.includes('signed')) base = ['int']

  // Qualifiers first, then the rest, so `int const` equals `const int`.
  const qualifiers = base.filter((word) => word === 'const' || word === 'volatile').sort()
  const rest = base.filter((word) => word !== 'const' && word !== 'volatile')
  return [...qualifiers, ...rest].join(' ') + '*'.repeat(stars)
}

/** A parameter without its name: `const char *s` becomes `const char*`. */
function parameterType(raw: string): string {
  const text = raw.trim()
  if (!text) return ''
  if (text === '...') return '...'
  // Function pointer parameter: keep its shape, drop the name inside `(*name)`.
  if (/\(\s*\*/.test(text)) return text.replace(/\(\s*\*\s*\w*\s*\)/, '(*)').replace(/\s+/g, ' ')
  // `v[]` and `v[10]` are pointers; the brackets come off before the name does.
  const arrays = (text.match(/\[[^\]]*\]/g) ?? []).length
  const tokens = text.replace(/\[[^\]]*\]/g, ' ').replace(/\*/g, ' * ').split(/\s+/).filter(Boolean)
  const last = tokens[tokens.length - 1]
  const before = tokens[tokens.length - 2]
  const substantial = tokens.filter((token) => token !== '*' && !DROPPED_QUALIFIERS.has(token))
  const isName =
    /^[A-Za-z_]\w*$/.test(last) &&
    !TYPE_WORDS.has(last) &&
    !TAG_WORDS.has(last) &&
    !TAG_WORDS.has(before ?? '') &&
    substantial.length >= 2
  return normaliseType([...(isName ? tokens.slice(0, -1) : tokens), ...Array(arrays).fill('*')].join(' '))
}

function splitParameters(raw: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const char of raw) {
    if (char === '(' || char === '[') depth++
    if (char === ')' || char === ']') depth--
    if (char === ',' && depth === 0) {
      parts.push(current)
      current = ''
    } else {
      current += char
    }
  }
  parts.push(current)
  const types = parts.map(parameterType)
  // `f()` and `f(void)` both take nothing.
  return types.length === 1 && (types[0] === '' || types[0] === 'void') ? [] : types
}

const SHAPE = /^([\s\S]*?)\b([A-Za-z_]\w*)\s*\(((?:[^()]|\([^()]*\))*)\)\s*$/

function declarationText(head: string, name: string, params: string) {
  const type = head.replace(/\b(static|inline|extern|register|__inline__)\b/g, '').replace(/\s+/g, ' ').trim()
  const list = params.replace(/\s+/g, ' ').trim() || 'void'
  return `${type}${type.endsWith('*') ? '' : ' '}${name}(${list})`
}

/** The functions declared or defined at the top level of `source`. */
export function readFunctions(source: string): CFunction[] {
  const text = blank(source)
  const found: CFunction[] = []
  let depth = 0
  let chunk = ''
  let chunkStart = 0

  const flush = (kind: CFunction['kind']) => {
    const match = SHAPE.exec(chunk.trim())
    chunk = ''
    if (!match) return
    const [, head, name, params] = match
    // Initialisers, typedefs and `struct x { ... } f(...)` shapes are not functions.
    if (/[=]|\btypedef\b/.test(head) || !head.trim()) return
    const returnType = normaliseType(head)
    if (!returnType) return
    found.push({
      name,
      returnType,
      params: splitParameters(params),
      text: declarationText(head, name, params),
      kind,
      line: text.slice(0, chunkStart).split('\n').length,
    })
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (depth === 0) {
      if (!chunk.trim() && !/\s/.test(char)) chunkStart = i
      if (char === ';') flush('prototype')
      else if (char === '{') {
        depth = 1
        flush('definition')
      } else chunk += char
    } else if (char === '{') depth++
    else if (char === '}') depth--
  }
  return found
}

export type HarnessIssue = {
  severity: 'error' | 'warning'
  /** Stable key for the issue, for React and tests. */
  code: 'duplicate-main' | 'duplicate-definition' | 'missing-in-draft' | 'signature' | 'unused-in-harness' | 'no-prototypes'
  name: string
  message: string
  /** What the harness says and what the draft says, as C, when both exist. */
  harness?: string
  draft?: string
}

export const signatureText = (fn: Pick<CFunction, 'name' | 'returnType' | 'params'>) =>
  `${fn.returnType} ${fn.name}(${fn.params.join(', ') || 'void'})`.replace(/\*\s/g, '* ').replace(/ \*/g, '*')

const sameSignature = (first: CFunction, second: CFunction) =>
  first.returnType === second.returnType && first.params.length === second.params.length && first.params.every((param, index) => param === second.params[index])

function mentions(source: string, name: string) {
  return new RegExp(`\\b${name}\\b`).test(blank(source))
}

export type HarnessReport = {
  /** `idle` when the harness is empty: the student's code then runs as is. */
  state: 'idle' | 'ok' | 'issues'
  issues: HarnessIssue[]
  /** Functions the harness expects the student to write, matched or not. */
  expected: CFunction[]
  /** Functions the draft defines apart from `main`. */
  offered: CFunction[]
}

/** Checks both ways: the harness against the draft, and the draft against the harness. */
export function checkHarness(harness: string, draft: string): HarnessReport {
  if (!harness.trim()) return { state: 'idle', issues: [], expected: [], offered: [] }

  const fromHarness = readFunctions(harness)
  const fromDraft = readFunctions(draft)
  const issues: HarnessIssue[] = []

  const expected = fromHarness.filter((fn) => fn.kind === 'prototype' && fn.name !== 'main')
  const offered = fromDraft.filter((fn) => fn.kind === 'definition' && fn.name !== 'main')
  const harnessDefines = (name: string) => fromHarness.some((fn) => fn.kind === 'definition' && fn.name === name)

  if (harnessDefines('main') && fromDraft.some((fn) => fn.kind === 'definition' && fn.name === 'main')) {
    issues.push({
      severity: 'error',
      code: 'duplicate-main',
      name: 'main',
      message: 'O harness e o código inicial definem main. Junto, o programa teria duas. Deixe só o harness com main.',
    })
  }

  for (const fn of offered) {
    if (harnessDefines(fn.name)) {
      issues.push({
        severity: 'error',
        code: 'duplicate-definition',
        name: fn.name,
        message: `${fn.name} está definida no harness e no código inicial. Defina em um só lugar.`,
      })
    }
  }

  for (const want of expected) {
    const have = offered.find((fn) => fn.name === want.name)
    if (!have) {
      issues.push({
        severity: 'error',
        code: 'missing-in-draft',
        name: want.name,
        message: `O harness espera ${want.name}, mas o código inicial não a define.`,
        harness: signatureText(want),
      })
    } else if (!sameSignature(want, have)) {
      issues.push({
        severity: 'error',
        code: 'signature',
        name: want.name,
        message: `${want.name} tem assinatura diferente no harness e no código inicial.`,
        harness: signatureText(want),
        draft: signatureText(have),
      })
    }
  }

  for (const have of offered) {
    if (expected.some((fn) => fn.name === have.name)) continue
    // Called without a prototype is odd but not wrong; not mentioned at all means the harness never runs it.
    if (!mentions(harness, have.name)) {
      issues.push({
        severity: 'warning',
        code: 'unused-in-harness',
        name: have.name,
        message: `O código inicial define ${have.name}, mas o harness não a declara nem a chama.`,
        draft: signatureText(have),
      })
    }
  }

  if (!expected.length && !offered.length && !issues.length) {
    issues.push({
      severity: 'warning',
      code: 'no-prototypes',
      name: '',
      message: 'Nenhuma função para comparar. Declare no harness, como protótipo, a função que o estudante escreve.',
    })
  }

  return { state: issues.length ? 'issues' : 'ok', issues, expected, offered }
}
