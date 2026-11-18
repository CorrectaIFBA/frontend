import { type Control, useWatch } from 'react-hook-form'
import { TOGGLES } from '@/features/manage-assessment/config/rule-toggles'
import type { RulesValues } from '@/features/manage-assessment/model/assessment-schema'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Switch } from '@/shared/ui/switch'
import { cn } from '@/shared/lib/cn'

/** How the activity is taken: time limit and the switches, one row each. */
export function RulesFields<T extends RulesValues>({ control: controlOfForm }: { control: Control<T> }) {
  const control = controlOfForm as unknown as Control<RulesValues>
  const values = useWatch({ control })

  return (
    <div className="flex flex-col divide-y divide-border/70">
      <FormField
        control={control}
        name="timeLimit"
        render={({ field }) => (
          <FormItem className="gap-1.5 pb-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <FormLabel>Tempo limite</FormLabel>
                <FormDescription className="text-xs">Conta a partir de quando o estudante começa.</FormDescription>
              </div>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input className="h-8 w-20 text-right" inputMode="numeric" placeholder="Livre" {...field} />
                </FormControl>
                <span className="text-muted-foreground text-xs">min</span>
              </div>
            </div>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      {TOGGLES.filter((toggle) => !toggle.dependsOn).map((toggle) => (
        // A dependent rule refines the one above it: nested in the same row, and off while that one is off.
        <div className="flex flex-col gap-3 py-3 last:pb-0" key={toggle.name}>
          {[toggle, ...TOGGLES.filter((candidate) => candidate.dependsOn === toggle.name)].map((entry) => {
            const isBlocked = Boolean(entry.dependsOn && !values[entry.dependsOn])

            return (
              <FormField
                control={control}
                key={entry.name}
                name={entry.name}
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      'flex flex-row items-center justify-between gap-4',
                      entry.dependsOn && 'ml-1 border-border border-l-2 pl-3',
                      isBlocked && 'opacity-60'
                    )}
                  >
                    <div className="flex flex-col gap-0.5">
                      <FormLabel>{entry.label}</FormLabel>
                      <FormDescription className="text-xs">
                        {isBlocked ? `Ligue “${toggle.label}” para usar.` : entry.hint}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value && !isBlocked} disabled={isBlocked} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
