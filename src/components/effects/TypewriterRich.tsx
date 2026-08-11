import { useTypewriter } from '../../hooks/useTypewriter'

interface Segment {
  text: string
  className?: string
}

export default function TypewriterRich({ segments, className = '' }: { segments: Segment[]; className?: string }) {
  const fullText = segments.map((s) => s.text).join('')
  const { displayedText } = useTypewriter(fullText)

  let remaining = displayedText.length
  const rendered = segments.map((segment, i) => {
    const shown = segment.text.slice(0, Math.max(0, remaining))
    remaining -= segment.text.length
    return (
      <span key={i} className={segment.className}>
        {shown}
      </span>
    )
  })

  return (
    <span className={className}>
      {rendered}
      <span className="animate-blink text-mint">|</span>
    </span>
  )
}
