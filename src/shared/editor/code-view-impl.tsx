import { useEffect, useState } from 'react'
import type { ProgrammingLanguage } from '@/shared/api/assessments'
import { FONT } from '@/shared/editor/editor-font'
import { MONACO_LANGUAGE } from '@/shared/editor/languages'
import { monaco } from '@/shared/editor/monaco'
import { cn } from '@/shared/lib/cn'
import { useTheme } from '@/shared/lib/theme-provider'

/*
  Read-only code without an editor instance: Monaco's own colouring, so a
  page with many questions does not mount many editors. `colorize` escapes
  the source, so the HTML it returns is safe to inject.
*/
export function CodeViewImpl({ language, value, className }: { language: ProgrammingLanguage; value: string; className?: string }) {
  const { resolvedTheme } = useTheme()
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let current = true
    monaco.editor.setTheme(resolvedTheme === 'dark' ? 'correcta-dark' : 'correcta-light')
    monaco.editor.colorize(value, MONACO_LANGUAGE[language], { tabSize: 4 }).then((result) => {
      if (current) setHtml(result)
    })
    return () => {
      current = false
    }
  }, [language, value, resolvedTheme])

  return (
    <pre
      className={cn('monaco-colorized overflow-x-auto p-3 text-[12.5px] leading-5', className)}
      style={{ fontFamily: FONT }}
    >
      {html === null ? (
        <code>{value}</code>
      ) : (
        <code dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </pre>
  )
}
