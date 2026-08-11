import TypewriterRich from './TypewriterRich'

export default function Typewriter({ text, className = '' }: { text: string; className?: string }) {
  return <TypewriterRich segments={[{ text }]} className={className} />
}
