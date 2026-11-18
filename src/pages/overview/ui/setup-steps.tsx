import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SETUP_STEPS } from '@/pages/overview/config/setup-steps'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'

export function SetupSteps() {
  return (
    <Panel>
      <PanelHeading
        action={<span className="font-mono text-[11px] text-muted-foreground">4 etapas</span>}
        title="Primeiros passos"
      />
      <ol className="divide-y divide-border">
        {SETUP_STEPS.map((step, index) => (
          <motion.li
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 6 }}
            key={step.to}
            transition={{ delay: 0.04 * index, duration: 0.25, ease: [0.2, 0, 0, 1] }}
          >
            <Link
              className="group flex items-start gap-4 px-4 py-3.5 transition-colors hover:bg-accent/50"
              to={step.to}
            >
              <span className="pt-0.5 font-mono text-muted-foreground text-xs tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-medium text-[13px]">{step.title}</span>
                <span className="text-muted-foreground text-xs">{step.description}</span>
              </span>
              <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/50 transition-[color,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
            </Link>
          </motion.li>
        ))}
      </ol>
    </Panel>
  )
}
