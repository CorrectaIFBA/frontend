import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Token = [kind: 'kw' | 'fn' | 'str' | 'num' | 'dim' | 'txt', text: string]

/* Hand-tokenised: a highlighter library for nine lines is not worth its weight. */
const CODE: Token[][] = [
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

const TOKEN_CLASS: Record<Token[0], string> = {
  kw: 'text-(--code-keyword)',
  fn: 'text-(--code-fn)',
  str: 'text-(--code-string)',
  num: 'text-(--code-number)',
  dim: 'text-(--code-dim)',
  txt: 'text-(--code-fg)',
}

const CASES = [
  { input: '2 3', ms: 1 },
  { input: '-7 7', ms: 1 },
  { input: '0 0', ms: 1 },
  { input: '1000000 1', ms: 2 },
  { input: '-4 -9', ms: 1 },
]

const TOTAL_MS = CASES.reduce((sum, testCase) => sum + testCase.ms, 0)

const HEADLINES = [
  'Errou? Veja onde e tente de novo.',
  'Envie seu código e veja o resultado.',
  'Descubra na hora se sua solução funciona.',
  'Quase nunca sai perfeito de primeira.',
  'Hora de colocar sua solução à prova.',
  'Seu código passa no teste?'
]

/* One line per visit, kept while the tab lives so screens don't swap it. */
function pickHeadline() {
  try {
    const kept = Number(sessionStorage.getItem('correcta.headline'))
    if (Number.isInteger(kept) && kept >= 0 && kept < HEADLINES.length) {
      return HEADLINES[kept]
    }
    const index = Math.floor(Math.random() * HEADLINES.length)
    sessionStorage.setItem('correcta.headline', String(index))
    return HEADLINES[index]
  } catch {
    return HEADLINES[0]
  }
}

const STEP_MS = 520
/* Pause on the verdict before the run starts over. */
const HOLD_STEPS = 9

/**
 * The right half of the authentication screens: a submission being judged.
 * It is what Correcta does, shown instead of described.
 */
export function JudgePanel({
  className,
  compact = false,
}: {
  className?: string
  /** Tighter spacing for the add-account dialog. */
  compact?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const [headline] = useState(pickHeadline)
  const [step, setStep] = useState(reducedMotion ? CASES.length + 1 : 0)

  useEffect(() => {
    if (reducedMotion) return

    const timer = setInterval(() => {
      setStep((current) => (current >= CASES.length + HOLD_STEPS ? 0 : current + 1))
    }, STEP_MS)

    return () => clearInterval(timer)
  }, [reducedMotion])

  const finished = step > CASES.length

  return (
    <aside
      aria-hidden
      className={cn(
        'relative flex-col overflow-hidden bg-(--code-bg) text-(--code-fg)',
        compact ? 'flex' : 'hidden rounded-2xl lg:flex',
        className
      )}
    >
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-[0.35] [--foreground:white]" />

      <div
        className={cn(
          'relative flex flex-1 flex-col justify-center',
          compact ? 'px-7 pt-7 pb-4' : 'px-10 py-8 xl:px-16'
        )}
      >
        <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-xl border border-(--code-line) bg-black/25 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)] backdrop-blur-sm">
          <div className="flex h-10 items-center gap-3 border-(--code-line) border-b px-4">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
            </span>
            <span className="font-mono text-(--code-dim) text-[11px]">soma.c</span>
            <span className="label-xs ml-auto text-(--code-dim)">Lista 1 · Exercício 3</span>
          </div>

          <pre className="overflow-hidden px-4 py-4 font-mono text-[12px] leading-[1.6]">
            {CODE.map((line, lineIndex) => (
              <div className="flex" key={`line-${lineIndex + 1}`}>
                <span className="w-7 shrink-0 select-none text-(--code-dim)/60 tabular-nums">
                  {lineIndex + 1}
                </span>
                <code>
                  {line.map(([kind, text], tokenIndex) => (
                    <span className={TOKEN_CLASS[kind]} key={`${lineIndex}-${tokenIndex}`}>
                      {text}
                    </span>
                  ))}
                </code>
              </div>
            ))}
          </pre>

          <div className="border-(--code-line) border-t">
            <div className="flex h-9 items-center justify-between px-4">
              <span className="label-xs text-(--code-dim)">Casos de teste</span>
              <span className="font-mono text-(--code-dim) text-[11px] tabular-nums">
                {Math.min(step, CASES.length)}/{CASES.length}
              </span>
            </div>

            <ol className="flex flex-col px-2 pb-2">
              {CASES.map((testCase, index) => {
                const state = step > index ? 'done' : step === index ? 'running' : 'queued'

                return (
                  <li
                    className={cn(
                      'flex h-8 items-center gap-3 rounded-md px-2 font-mono text-[12px] transition-colors duration-300',
                      state === 'running' && 'bg-white/[0.04]'
                    )}
                    key={testCase.input}
                  >
                    <span className="flex size-4 items-center justify-center">
                      {state === 'done' ? (
                        <motion.span
                          animate={{ scale: 1, opacity: 1 }}
                          initial={reducedMotion ? false : { scale: 0.4, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 520, damping: 26 }}
                        >
                          <Check className="size-3.5 text-success" strokeWidth={3} />
                        </motion.span>
                      ) : state === 'running' ? (
                        <LoaderCircle className="size-3.5 animate-spin text-(--code-dim)" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-white/15" />
                      )}
                    </span>
                    <span className="text-(--code-dim)">caso {index + 1}</span>
                    <span className="truncate text-(--code-fg)/80">{testCase.input}</span>
                    <span
                      className={cn(
                        'ml-auto tabular-nums transition-opacity duration-300',
                        state === 'done' ? 'text-(--code-dim) opacity-100' : 'opacity-0'
                      )}
                    >
                      {testCase.ms} ms
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="relative h-12 border-(--code-line) border-t">
            <AnimatePresence initial={false} mode="wait">
              {finished ? (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 flex items-center gap-3 px-4"
                  exit={{ opacity: 0, y: -6 }}
                  initial={{ opacity: 0, y: 6 }}
                  key="verdict"
                  transition={{ duration: 0.25 }}
                >
                  <span className="rounded-[5px] bg-success/15 px-2 py-1 font-mono font-semibold text-[11px] text-success uppercase tracking-[0.08em]">
                    Aceito
                  </span>
                  <span className="font-mono text-(--code-dim) text-[11px] tabular-nums">
                    {CASES.length}/{CASES.length} casos · {TOTAL_MS} ms
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center gap-2 px-4 font-mono text-(--code-dim) text-[11px]"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  key="judging"
                >
                  <span className="size-1.5 animate-pulse rounded-full bg-warning" />
                  corrigindo envio #42…
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p
        className={cn(
          'relative max-w-[18ch] text-balance font-semibold text-white leading-[1.05] tracking-[-0.035em]',
          compact
            ? 'px-7 pb-7 text-2xl'
            : 'px-10 pb-12 text-[clamp(1.75rem,2.6vw,2.6rem)] xl:px-16'
        )}
      >
        {headline}
      </p>
    </aside>
  )
}
