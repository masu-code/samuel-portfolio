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
        className="flex gap-1 overflow-x-auto sm:flex-col sm:gap-6 sm:border-r-2 sm:border-mint sm:pr-6"
      >
        {items.map((item, i) => (
          <button
            key={item.label}
            role="tab"
            type="button"
            aria-selected={activeIndex === i}
            onClick={() => setActiveIndex(i)}
            className={`whitespace-nowrap px-4 py-3 text-left text-sm transition-colors sm:px-0 sm:py-0 ${
              activeIndex === i ? 'font-medium text-slate-lightest' : 'text-slate hover:text-slate-lightest'
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
