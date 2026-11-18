import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { DEFAULT_LIMITS } from '@/features/manage-testcases/config/testcase-types'
import { readLines } from '@/features/manage-testcases/lib/read-lines'
import { importSchema, type ImportValues } from '@/features/manage-testcases/model/import-schema'
import { importTestcases } from '@/shared/api/assessments'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'

type ImportSlot = 'inputs' | 'outputs'

/* The two picked files, their lines as the service will read them, and the import request. */
export function useTestcaseImport(assessmentId: string, questionId: string) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<{ inputs?: File; outputs?: File }>({})
  const [lines, setLines] = useState<{ inputs?: string[]; outputs?: string[] }>({})
  // The file last picked per slot, so a slow read of an older pick is dropped.
  const latest = useRef<{ inputs?: File; outputs?: File }>({})
  const form = useForm<ImportValues>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      type: 'EVALUATION',
      timeLimitSeconds: String(DEFAULT_LIMITS.timeLimitSeconds),
      memoryLimitMB: String(DEFAULT_LIMITS.memoryLimitMB),
    },
  })
  const inputCount = lines.inputs?.length
  const outputCount = lines.outputs?.length
  const isMismatch = inputCount !== undefined && outputCount !== undefined && inputCount !== outputCount
  const isReady = Boolean(files.inputs && files.outputs && inputCount !== undefined && outputCount !== undefined && !isMismatch)

  const mutation = useMutation({
    mutationFn: (values: ImportValues) =>
      importTestcases(assessmentId, questionId, {
        // Submit stays disabled until both files are chosen.
        inputs: files.inputs as File,
        outputs: files.outputs as File,
        type: values.type,
        timeLimitSeconds: Number(values.timeLimitSeconds),
        memoryLimitMB: Number(values.memoryLimitMB),
      }),
    onSuccess: (created) => {
      toast.success(created.length === 1 ? '1 caso de teste importado.' : `${created.length} casos de teste importados.`)
      close()
    },
    onError: (error) => applyFieldErrors(form, error),
  })

  // Closing, by import or by cancel, starts the next import from empty files.
  function close() {
    setOpen(false)
    latest.current = {}
    setFiles({})
    setLines({})
    form.reset()
    mutation.reset()
  }

  function pick(slot: ImportSlot, file?: File) {
    latest.current[slot] = file
    setFiles((current) => ({ ...current, [slot]: file }))
    setLines((current) => ({ ...current, [slot]: undefined }))

    if (file) {
      readLines(file).then((read) => {
        if (latest.current[slot] === file) setLines((current) => ({ ...current, [slot]: read }))
      })
    }
  }

  return { open, setOpen, close, files, lines, pick, form, mutation, inputCount, isMismatch, isReady }
}
