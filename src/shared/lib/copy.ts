import { toast } from 'sonner'

export async function copy(text: string, what: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${what} copiado.`)
  } catch {
    toast.error('Não foi possível copiar. Selecione o texto e copie manualmente.')
  }
}
