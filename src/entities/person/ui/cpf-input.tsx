import { formatCpf } from '@/shared/lib/cpf'
import { Input } from '@/shared/ui/input'

export function CpfInput(props: React.ComponentProps<typeof Input> & { value: string }) {
  return (
    <Input
      autoComplete="off"
      className="h-9 font-mono"
      inputMode="numeric"
      placeholder="000.000.000-00"
      {...props}
      onChange={(event) => {
        event.target.value = formatCpf(event.target.value)
        props.onChange?.(event)
      }}
    />
  )
}
