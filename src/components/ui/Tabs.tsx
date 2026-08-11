import { useState, type ReactNode } from 'react'

interface TabItem {
  label: string
  content: ReactNode
}

export default function Tabs({ items }: { items: TabItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
      <div
        role="tablist"
        aria-orientation="vertical"
        className="flex gap-1 overflow-x-auto sm:flex-col sm:border-l sm:border-navy-lightest"
      >
        {items.map((item, i) => (
          <button
            key={item.label}
            role="tab"
            type="button"
            aria-selected={activeIndex === i}
            onClick={() => setActiveIndex(i)}
            className={`whitespace-nowrap px-4 py-3 text-left text-sm transition-colors sm:border-l-2 ${
              activeIndex === i
                ? 'bg-navy-light text-mint sm:-ml-px sm:border-mint'
                : 'text-slate hover:bg-navy-light/50 hover:text-slate-lightest sm:border-transparent'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div role="tabpanel">{items[activeIndex]?.content}</div>
    </div>
  )
}
