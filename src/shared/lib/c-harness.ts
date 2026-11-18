import { type CFunction, readFunctions } from '@/shared/lib/c-signatures'

/*
  Writes a harness for the function the draft defines: read each argument
  from standard input, call the function, print what it returns. Strings
  are read a line at a time, numbers with scanf. Types it cannot read or
  print get a TODO comment where the code belongs, never a guess.
*/

/** scanf / printf conversions for the scalar types, keyed by normalised type. */
const SCALARS: Record<string, { scan: string; print: string }> = {
  char: { scan: ' %c', print: '%c' },
  'signed char': { scan: ' %hhd', print: '%hhd' },
  'unsigned char': { scan: ' %hhu', print: '%hhu' },
  short: { scan: ' %hd', print: '%hd' },
  'unsigned short': { scan: ' %hu', print: '%hu' },
  int: { scan: ' %d', print: '%d' },
  'unsigned int': { scan: ' %u', print: '%u' },
  long: { scan: ' %ld', print: '%ld' },
  'unsigned long': { scan: ' %lu', print: '%lu' },
  'long long': { scan: ' %lld', print: '%lld' },
  'unsigned long long': { scan: ' %llu', print: '%llu' },
  float: { scan: ' %f', print: '%f' },
  double: { scan: ' %lf', print: '%f' },
  _Bool: { scan: ' %d', print: '%d' },
}

const withoutConst = (type: string) => type.replace(/\b(const|volatile)\s*/g, '').trim()

const isString = (type: string) => /^(const )?char\*$/.test(type)

/** `Declaration x` for a type, with the star hugging the name. */
const declare = (type: string, name: string) => {
  const stars = /\*+$/.exec(type)?.[0] ?? ''
  return `${type.slice(0, type.length - stars.length)} ${stars}${name}`
}

export type GeneratedHarness = {
  code: string
  /** The draft function the harness calls. */
  fn: CFunction
  /** True when some type had to be left as a TODO. */
  incomplete: boolean
}

/** The function to call: the first one the draft defines besides `main`. */
export function targetFunction(draft: string): CFunction | undefined {
  return readFunctions(draft).find((fn) => fn.kind === 'definition' && fn.name !== 'main')
}

export function generateHarness(draft: string): GeneratedHarness | null {
  const fn = targetFunction(draft)
  if (!fn) return null

  let incomplete = false
  let needsStdlib = false
  const declarations: string[] = []
  const reads: string[] = []
  const args: string[] = []
  const strings = fn.params.filter((param) => isString(param)).length
  let stringIndex = 0
  let scalarIndex = 0
  let lastRead: 'none' | 'scalar' | 'line' = 'none'

  for (const param of fn.params) {
    if (isString(param)) {
      // A line read right after a number would get the rest of that number's line.
      stringIndex++
      const name = strings === 1 ? 'buffer' : `buffer${stringIndex}`
      declarations.push('// buffer que armazenará a entrada de texto (uma linha)', `static char ${name}[65536];`)
      if (lastRead === 'scalar') {
        reads.push('// descarta o resto da linha anterior', "for (int c; (c = getchar()) != '\\n' && c != EOF;) {}")
      }
      reads.push('// injeta o valor de stdin no buffer de entrada', `if (!fgets(${name}, sizeof ${name}, stdin)) return 1;`)
      args.push(name)
      lastRead = 'line'
      continue
    }
    scalarIndex++
    const name = `arg${scalarIndex}`
    const type = withoutConst(param)
    const conversion = SCALARS[type]
    if (conversion && param !== '...') {
      declarations.push(`${declare(type, name)};`)
      reads.push(`// lê o valor de ${name} (${type}) da entrada padrão`, `if (scanf("${conversion.scan}", &${name}) != 1) return 1;`)
      lastRead = 'scalar'
    } else {
      incomplete = true
      declarations.push(`${declare(type, name)} = {0}; // TODO: ler ${param} da entrada`)
    }
    args.push(name)
  }

  const call = `${fn.name}(${args.join(', ')})`
  const output: string[] = []
  if (fn.returnType === 'void') {
    output.push(`${call}; // execução do teste`)
  } else if (isString(fn.returnType)) {
    // A `char *` comes from malloc by convention; a `const char *` is the function's to keep.
    output.push(`${declare(fn.returnType, 'out')} = ${call}; // execução do teste`, '', 'fputs(out, stdout); // insere a saída no stdout')
    if (!fn.returnType.startsWith('const')) {
      output.push('free(out); // limpeza do resultado')
      needsStdlib = true
    }
  } else if (SCALARS[withoutConst(fn.returnType)]) {
    const type = withoutConst(fn.returnType)
    output.push(
      `${declare(type, 'out')} = ${call}; // execução do teste`,
      '',
      `printf("${SCALARS[type].print}\\n", out); // insere a saída no stdout`
    )
  } else {
    incomplete = true
    output.push(`${declare(fn.returnType, 'out')} = ${call}; // execução do teste`, '', `// TODO: imprimir ${fn.returnType}`)
  }

  const includes = ['#include <stdio.h>', ...(needsStdlib ? ['#include <stdlib.h>'] : [])]
  // Blank line between groups, as the model harness is laid out.
  const groups = [declarations, reads, output].filter((group) => group.length)
  const body = groups.flatMap((group, index) => (index ? ['', ...group] : group))
  const code = [
    ...includes,
    '',
    '// assinatura da função presente no código inicial',
    `${fn.text};`,
    '',
    'int main(void) {',
    ...body.map((line) => (line ? `  ${line}` : '')),
    '',
    '  return 0; // sempre retorno 0, definindo sucesso',
    '}',
    '',
  ].join('\n')

  return { code, fn, incomplete }
}
