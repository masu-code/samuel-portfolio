import { motion } from 'framer-motion'
import SectionHeading from '../layout/SectionHeading'
import Tabs from '../ui/Tabs'
import { experience } from '../../content/experience'
import { fadeInUp } from '../../lib/animations'

export default function Experience() {
  const tabs = experience.map((entry) => ({
    label: entry.company,
    content: (
      <div>
        <h3 className="text-lg font-medium text-slate-lightest">
          {entry.role} @{' '}
          {entry.url ? (
            <a href={entry.url} target="_blank" rel="noreferrer" className="text-mint hover:underline">
              {entry.company}
            </a>
          ) : (
            <span className="text-mint">{entry.company}</span>
          )}
        </h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-wide text-slate">{entry.dateRange}</p>
        <ul className="mt-4 space-y-3 text-slate">
          {entry.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1 shrink-0 text-mint">▹</span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    ),
  }))

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading title="experience" />
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <Tabs items={tabs} />
      </motion.div>
    </section>
  )
}
