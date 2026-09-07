import { useEffect, useRef, useState, type ReactNode } from 'react'

interface TabItem {
  label: string
  content: ReactNode
}

export default function Tabs({ items }: { items: TabItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState({ top: 0, height: 0 })

  useEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeIndex]
      if (el) setIndicator({ top: el.offsetTop, height: el.offsetHeight })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeIndex, items])

  return (
    <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
      <div
        role="tablist"
        aria-orientation="vertical"
        className="relative flex gap-1 overflow-x-auto sm:flex-col sm:gap-6 sm:border-r-2 sm:border-navy-lightest sm:pr-6"
      >
        <span
          aria-hidden="true"
          className="absolute -right-6 hidden w-0.5 bg-mint transition-[top,height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] sm:block"
          style={{ top: indicator.top, height: indicator.height }}
        />
        {items.map((item, i) => (
          <button
            key={item.label}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
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
